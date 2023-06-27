---
title: Reactivity
date: 2017-09-08 17:55:40
category: 学以致用
tags:
- JavaScript
- 前端
---

最近有被问到 Vue 的响应式数据的原理，第一次被问到的时候有点语无伦次的感觉吧。对于一个知识点，看过，然后自己理解一下是一个层次，能够讲出来让别人明白就是另一个层次了。对于源码的阅读，我比较喜欢去明白一些机制的原理，比较理想的情况下是能够在明白源码的原理之后，在不查看源码的情况下能够实现类似的功能。今天我就尝试一下实现响应式数据，当然，在实现上比较粗略，以原理为主，在此之前，需要知道几个基本点。

首先是 `Observer` 类，在 Vue 中，通过 `Observer` 来给属性添加 `setter` 和 `getter`，这是 Vue 实现响应式机制的关键。

第二点是 `Watcher` 类，Vue 的每一个组件都有一个 `Watcher` 实例，组件渲染的过程中会把相应属性记为依赖，之后当相应属性的 `setter` 被调用的时候，会通知 `Watcher` 实例进行计算，然后触发重新渲染。

第三点是 `Dep`，前面说到了 `Observer` 和 `Watcher`，还提到 `Watcher` 实例会在依赖属性的 `setter` 调用时候重新计算，那么 `Watcher` 实例是如何被通知的呢？这里就得说到 `Dep` 这个类了，正式通过 `Dep` 实例来通知相应的 `Watcher` 实例进行重新计算。

不多说，开始写代码。

首先实现 `Observer`

```javascript
class Observer {
  constructor(data) {
    this.walk(data)
  }

  walk(data) {
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      let val = data[key]
      observe(val)
      Object.defineProperty(data, key, {
        get() {
          return val
        },
        set(newVal) {
          val = newVal
          console.log('receive new value', newVal)
        }
      })
    }
  }
}

function observe(data) {
  if (Object.prototype.toString.call(data) !== '[object Object]') {
    return
  }
  new Observer(data)
}
```

就这样，初步实现了一个 `Observer` 类，来测试一下我们能否知道属性被设置新值。

```javascript
const data = {
  a: 'a',
  obj: {
    key1: 'key1',
    key2: 'key2',
  },
}

observe(data)

data.obj.key1 = 'key1_changed'
// console 输出:
// receive new value key1_changed
```

可以看到，通过设置对象属性的 `setter` 和 `getter`，我们能够在设置属性或者获取属性值的时候做一些额外的事情。

接着我们定义一下 `Watcher` 类

```javascript
class Watcher {
  constructor(data, exp, fn) {
    this.exp = exp
    this.fn = fn
    // ...more
  }
}
```

`Watcher` 的构造函数大概长这个样子，然后我们可以通过下面的方式来“观察”对象：

```javascript
const data = {
  a: 'a',
  obj: {
    key1: 'key1',
    key2: 'key2',
  },
}

observe(data)

new Watcher(data, 'a', () => {
  console.log('data.a changed')
})
```

然后每次 `data.a` 被重新设置的时候，控制台会输出 `data.a changed`

那么具体来讲该怎么实现呢？直观来讲，我们会想到，在对应的 `setter` 属性里面加一些代码，当 `setter` 被调用的时候，调用对应 `Watcher` 实例的方法就可以了，那么，该怎么实现呢，这个时候就要请出连接 `Observer` 和 `Watcher` 的桥梁，`Dep` 了。

```javascript
class Dep {
  constructor() {
    this.subs = []
  }

  addSub(watcher) {
    if (!this.subs.includes(watcher)) {
      this.subs.push(watcher)
    }
  }

  notify() {
    this.subs.forEach(sub => {
      sub.fn()
    })
  }
}
```

`Dep` 类就这样简单的实现了，思想就是将 `Watcher` 实例放到 `subs` 里面，当 `Dep#notify` 调用的时候，调用相应 `Watcher` 实例的 `fn` 函数。

不过，现在 `Dep` 还没能将 `Watcher` 和 `Observer` 连接起来，接下来我们需要修改 `Watcher` 和 `Observer` 函数。

首先给 `Dep` 加一个静态属性，`Dep.target`

```javascript
Dep.target = null
```

接着修改 `Wathcer`

```javascript
function pushTarget(watcher) {
  Dep.target = watcher
}

class Watcher {
  constructor(data, exp, fn) {
    this.exp = exp
    this.fn = fn
    pushTarget(this)
    data[exp]
  }
}
```

好的，这个时候有必要解释一下了，`Dep.target` 是一个 `Watcher` 实例，每当我们创建一个新的 `Watcher` 实例的时候，会通过 `pushTarget` 函数修改 `Dep.target`，将其设为这个新初始化的 `Watcher` 实例，接着，下面一行代码是 `data[exp]`，咦，这行代码有什么用？这里我对问题先做一下简化，即 `exp` 为 `data` 的一个 `key`（真正的实现不仅可以是 `key`，还可以是类似`key1.key2` 这样的形式，还可以是函数，但是从原理上来讲是一样的）。那么，`data[exp]` 其实就是调用响应属性的 `getter`！前面说过，通过 `Observer` 设置了对象属性的 `setter` 和 `getter`，所以我们可以在 `setter` 和 `getter` 里面做一些事情，而 `data[exp]` 所要做的就是收集依赖！

接着进一步修改 `Observer`

```javascript
class Observer {
  constructor(data) {
    this.walk(data)
  }

  walk(data) {
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      let val = data[key]
      observe(val)
      const dep = new Dep()
      Object.defineProperty(data, key, {
        get() {
          // +++
          dep.addSub(Dep.target)
          // +++
          return val
        },
        set(newVal) {
          // +++
          if (newVal === val) {
            return
          }
          observe(newVal)
          dep.notify()
          val = newVal
          // +++
        }
      })
    }
  }
}
```

看，通过这种方式，对象的每一个属性都有一个 `Dep` 实例，其 `Dep#subs` 记录了依赖于这个属性的 `watcher`，每当这个属性被重新赋值的时候，会通过调用 `Dep#notify` 来通知 `Watcher` 该属性改变了。另外，当使用相同值重复设置属性的时候，不会去触发通知。

先贴一下所有代码：

```javascript
class Dep {
  constructor() {
    this.subs = []
  }

  addSub(watcher) {
    if (!this.subs.includes(watcher)) {
      this.subs.push(watcher)
    }
  }

  notify() {
    this.subs.forEach(sub => {
      sub.fn()
    })
  }
}

Dep.target = null

function pushTarget(watcher) {
  Dep.target = watcher
}

class Observer {
  constructor(data) {
    this.walk(data)
  }

  walk(data) {
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      let val = data[key]
      observe(val)
      const dep = new Dep()
      Object.defineProperty(data, key, {
        get() {
          dep.addSub(Dep.target)
          return val
        },
        set(newVal) {
          if (newVal === val) {
            return
          }
          observe(newVal)
          dep.notify()
          val = newVal
        }
      })
    }
  }
}

function observe(data) {
  if (Object.prototype.toString.call(data) !== '[object Object]') {
    return
  }
  new Observer(data)
}

class Watcher {
  constructor(data, exp, fn) {
    this.exp = exp
    this.fn = fn
    pushTarget(this)
    data[exp]
  }
}
```

用刚才上面提到的代码测试一下：

```javascript
const data = {
  a: 'a',
  obj: {
    key1: 'key1',
    key2: 'key2',
  },
}

observe(data)

new Watcher(data, 'a', () => {
  console.log('data.a changed')
})

data.a = 'a_change'
// 控制台输出：
// data.a changed
```

好了，以上就是在 Vue 中，响应式数据的一个大概原理了，当然，很多细节没有照顾到，而 Vue 的具体实现跟上面所说的也有所不同，Vue 的实现会复杂许多，比如上面的实现 `Dep#notify` 是直接调用 `fn`，但在 Vue 中，有一个 `Wathcer#update` 方法，`Dep#notify` 实际上调用的是这个方法，如在 `Watcher` 实例中设置的函数可以获取值的新值跟旧值，大家可以自行尝试实现，等等等等，大家可以参考 `Vue` 中 `Watcher` 具体的 API，我就不再一一赘述了，因为这篇文章着重讲的是一个实现原理。
