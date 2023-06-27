---
title: 使用 async hooks 实现基于请求的上下文
date: 2022-11-20 21:30:00
category: 技术
tags:
  - JavaScript
  - nodejs
---

## 背景

以一个 Web 应用为例，当用户发起一次请求的时候，应用接收到 HTTP 请求就行执行一个「任务」，比如：

```javascript
// 伪代码
function handleRequest() {
  // 检查登录态
  auth(...)
  // 检查权限
  checkPermission(...)
  // 从数据库获取数据
  queryFromDb(...)
  // 响应
  response(...)
}
```

一个这样的任务，我们可能会调用很多其他的方法，而其他的方法又可能会调用其他更多的方法，在一些情况下，我们可能期望在一个请求任务中的所有函数都能够获取一些基于请求上下文的变量。一个常见的场景是应用的链路追踪：对于一个请求，我想看到这个请求各个阶段花费的时间，比如调用外部接口花费的时间、调用数据库花费的时间。这样我们就需要在收集数据的时候，有一个贯穿一个请求统一的 ID（TraceID），来把这些数据以请求为维度串联起来

## 其他生态中的情况

一种方式是，对于调用链路中需要做这样采集数据的地方，都传递一个「上下文」对象：

```javascript
// 伪代码
function handleRequest() {
  const ctx = {
    traceId: uuid()
  }
  // 检查登录态
  auth(ctx, ...)
  // 检查权限
  checkPermission(ctx, ...)
  // 从数据库获取数据
  queryFromDb(ctx, ...)
  // 响应
  response(ctx, ...)
}
```

比如 Go 语言就推荐将调用链路中的函数的[第一个参数设为 context 对象](https://go.dev/blog/context)，Go 语言将这种方式作为一个模式进行推广，生态中大量的库都是遵从这一套的模式，因此，在 Go 中处理这种问题的方式就是显式的传递 context

显式传递 context 对象的一个问题就是，如果对应的生态之中没有像 Go 这种去建立这样一个约定俗成的规范的话（像 Node.js），大量的第三方库并不会对这种情况进行支持，如果我们想要给某个库增加链路追踪的能力，就需要给相关函数进行一层包装。以 [sequelize](https://sequelize.org/) 为例，库提供的 API 是这样的：

```javascript
// 假设有一个 User Model
User.findOne({
  where: {
    id: '123'
  }
})
```

为了给数据库查询增加追踪数据采集，我们必须对暴露的 API 进行一层包装：

```javascript
User.prototype.findOneWithCtx = async function (ctx) {
  const start = Date.now()
  await this.findOne({
    where: {
      id: '123'
    }
  })
  const end = Date.now()
  trace.send({
    id: uuid(),
    traceId: ctx.traceId,
    start,
    end
  })
}
```

很多情况下，这是非常麻烦的。另外一方面，大多数 API 设计良好的库，都会暴露一些 hook 或者一共一些插件化的方式，让你能够执行一些自定义逻辑，如果我们能够在编写这些自定义的逻辑中，获取关联请求的上下文对象，就能做到非侵入式地给某个库增加链路追踪功能

而像 Java 中 ThreadLocal API，可以往 ThreadLocal 中存储变量，不同线程中存储的变量是互相隔离的，可以这样理解：

```javascript
// 伪代码
const threadLocalMap = {}

const threadLocal = {
  get() {
    const threadId = getThreadId()
    return threadLocalMap[threadId]
  },
  set(v) {
    const threadId = getThreadId()
    threadLocalMap[threadId] = v
  }
}

createThread(() => {
  threadLocal.set("foo")
  // ....
  callInThread()
})

function callInThread() {
  console.log(threadLocal.get())
}
```

## 在 Node.js 中 —— async hooks

JS 是一门单线程语言，当多个 HTTP 请求并发地发送到 Node.js 服务器时，接受并执行请求对应的「任务」都是在同一个线程执行的，通过事件循环机制，Node.js 在 I/O 密集型应用能有很好的性能表现。比如如果在 Node.js 中发起一个 I/O 操作，Node.js 并不会等待 I/O 完成，而是会注册一个回调，然后就去执行其他可以执行的代码了，等 I/O 完成后，触发回调进一步进行后续的逻辑。那么，如果在一个这样的单线程环境中实现类似上面所说的 Java 那样的 ThreadLocal 呢？在 Node.js 中提供了一个 API 能够做到类似的事情——那就是 [async hooks](https://nodejs.org/api/async_hooks.html)。虽然 async hooks 到现在还是一个实验性的 API，但其实已经趋近于稳定了，并且，在最新版的 Node.js 上对性能的影响也不大。async hooks 可以追踪异步资源，可以在异步资源的各个生命周期去触发我们的自定义逻辑，所谓的异步资源，指的是一个关联了回调的对象，比如说 setTimeout、Promise 等等：

```javascript
import async_hooks, { createHook } from 'node:async_hooks'
import fs from 'node:fs'
import { stdout } from 'node:process'

function println(s) {
  fs.writeFileSync(stdout.fd, s + '\n')
}

// eid: 当前执行上下文的ID
// tid: 触发当前执行上线文的ID
// 通过 eid 和 tid，能够把整个执行流程串联起来

const hook = createHook({
  // 异步资源初始化时调用（可能资源还没有创建完成）
  init(asyncId, type, triggerAsyncId, resource) {
    println(`init type:${type} eid:${asyncId} tid:${triggerAsyncId}`)
  },
  // 在异步资源的回调被调用之前调用
  before() {
    const eid = async_hooks.executionAsyncId()
    const tid = async_hooks.triggerAsyncId()
    println(`before eid:${eid} tid:${tid}`)
  },
  // 在资源的回调结束之前调用
  after() {
    const eid = async_hooks.executionAsyncId()
    const tid = async_hooks.triggerAsyncId()
    println(`after eid:${eid} tid:${tid}`)
  },
  // 资源被销毁后调用
  destroy() {
    const eid = async_hooks.executionAsyncId()
    const tid = async_hooks.triggerAsyncId()
    println(`destroy eid:${eid} tid:${tid}`)
  },
  // 仅仅 promise 资源会出发，当 resolve 被调用时候调用
  promiseResolve() {
    const eid = async_hooks.executionAsyncId()
    const tid = async_hooks.triggerAsyncId()
    println(`promiseResolve eid:${eid} tid:${tid}`)
  }
})

hook.enable()

new Promise((resolve) => {
  resolve(1)
})
```

利用 async hooks，我们可以创建一个像下面这样的 context 对象，被 context.run 包裹的函数，能获取一个独立的存储：

```javascript
import async_hooks from 'node:async_hooks'

const context = {
  init: () => {
    const hooks = async_hooks.createHook({
      init(eid, _, tid) {
        if (context.store[tid]) {
          context.store[eid] = context.store[tid]
        }
      },
      destroy(eid) {
        delete context.store[eid]
      }
    })
    hooks.enable()
  },
  store: {},
  run: (fn) => {
    const eid = async_hooks.executionAsyncId()
    context.store[eid] = {}
    return fn()
  },
  set: (k, v) => {
    const eid = async_hooks.executionAsyncId()
    if (context.store[eid]) {
      context.store[eid][k] = v
    } else {
      throw new Error('you should wrap your fn with context.run')
    }
  },
  get: (k) => {
    const eid = async_hooks.executionAsyncId()
    if (context.store[eid]) {
      return context.store[eid][k]
    } else {
      throw new Error('you should wrap your fn with context.run')
    }
  }
}

context.init()

// 分别在两个「上下文」中执行，两个上下文中的存储是互相隔离的
context.run(async () => {
  context.set('foo', 'bar')
  await sleep()
})

context.run(async () => {
  context.set('foo', 'baz')
  await sleep()
})

async function sleep() {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
  console.log('foo:', context.get('foo'))
}

// 输出
// foo: bar
// foo: baz

```

这大概就是利用 async hooks 实现基于请求的上下文的大致实现方式了，当然，利用 async hooks 可以实现更多其他的用例。官方在 async hooks 之上，又封装了 AsyncLocalStorage，和我们上面实现的 context 类似，如果 AsyncLocalStorage 能够满足需求，则尽量使用 AsyncLocalStorage，它的实现健壮性、性能都会更好

比如下面这段代码，起一个 HTTP Server，让我们执行两遍请求看一下输出：

```javascript
import Koa from 'koa'
import { AsyncLocalStorage } from 'node:async_hooks'

const asyncLocalStorage = new AsyncLocalStorage()

const app = new Koa()

let reqId = 0

app.use(async (ctx, next) => {
  // 通过 run 方法包裹，内部的逻辑享有独立的存储？怎么描述好
  await asyncLocalStorage.run(reqId++, async () => {
    const start = Date.now()
    await next()
    const end = Date.now()
    console.log(`http request: reqId:${asyncLocalStorage.getStore()} start:${start} end:${end}`)
  })
})

app.use(async (ctx) => {
  const ret = await dbOp()
  ctx.body = ret
})

app.listen(3000, () => {
  console.log(`server started`)
})

// mock 的数据库操作
async function dbOp() {
  const start = Date.now()
  const ret = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: 'foo'
      })
    }, 1000)
  })
  const end = Date.now()
  // 这里也可以拿到对应上下文的 store
  console.log(`db op: reqId:${asyncLocalStorage.getStore()} start:${start} end:${end}`)
  return ret
}
```

```bash
curl http://localhost:3000
# 服务器控制台输出
db op: reqId:0 start:1668870986375 end:1668870987381
http request: reqId:0 start:1668870986375 end:1668870987385

curl http://localhost:3000
db op: reqId:1 start:1668870998250 end:1668870999253
http request: reqId:1 start:1668870998250 end:1668870999254
```

可以看到，两个请求之间的 asyncLocalStorage 对应的存储是独立的。至此，我们可以利用这些 API，在不修改第三方库暴露地 API 的情况下，很方便地做到无侵入地链路追踪

## 题外话

再说个题外话，在 Node.js 推出 async hooks API 之前，Node.js 就有第三方库（[https://github.com/othiym23/node-continuation-local-storage](https://github.com/othiym23/node-continuation-local-storage)）支持类似的特性了。之前了解到这个库是在之前公司的 Node.js 后端框架里面，使用了这个库保存请求上下文来做链路追踪。当时就觉得，居然还有这种「黑魔法」

## 总结

好了，最后来总结一下吧

为了实现基于请求的上下文，我们可以显式地传递上下文对象，也可以利用 async hooks 去构建一个隐式地在整个请求链路中传递的上下文。而在 Node.js 中，利用这种隐式地方式去构建一些基础层面的功能可能[更为常见](https://github.com/open-telemetry/opentelemetry-js)

## 参考

1. [https://github.com/guyguyon/node-request-context](https://github.com/guyguyon/node-request-context)
2. [https://github.com/strongloop/loopback-context](https://github.com/strongloop/loopback-context)
3. [https://github.com/othiym23/node-continuation-local-storage](https://github.com/othiym23/node-continuation-local-storage)
4. [https://nodejs.org/api/async_hooks.html](https://nodejs.org/api/async_hooks.html)
5. [https://www.liaoxuefeng.com/wiki/1252599548343744/1306581251653666](https://www.liaoxuefeng.com/wiki/1252599548343744/1306581251653666)
6. [https://go.dev/blog/context](https://go.dev/blog/context)
