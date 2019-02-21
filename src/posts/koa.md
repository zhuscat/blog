---
title: 阅读 Koa 源码
date: 2016-12-11 18:34:16
category: 学习笔记
tags:
- koa
- nodejs
- JavaScript
- Web
- 学习笔记
- 源码阅读
---
之前阅读了 `co` 的源码，其实一开始就是想看一下 `koa` 的源码，然后 `koa` 又是基于 `co` 构建的，所以先读了一下 `co`，这次再来记录一下 `koa` 源码中的东西。

## compose

`compose` 方法返回一个 `Generator` 函数，将所有 `middleware` 串联起来。

```javascript
function compose(middleware){
  return function *(next){
      // ...
  }
}
```

首先， 判断 `next` 是否为空，如果为空则将 `next` 赋值为 `noop`（空函数）。

接着逆序遍历 `middleware`，把 `middleware` 数组中的后一个产生的 `iterator` 作为前一个 `middleware` 的参数。

最后，`yield *` 第一个 `next`。

理解这个函数，就明白在中间件中 `yield next` 是怎么工作的了，因为数组中后一个会把产生的 `iterator` （也就是 `next`）传给前一个。

```javascript
function compose(middleware){
  return function *(next){
    if (!next) next = noop();

    var i = middleware.length;

    while (i--) {
      next = middleware[i].call(this, next);
    }

    return yield *next;
  }
}
```

## Application

### 构造函数

先来看看 `Application` 的构造函数，注意到 `middleware`， `context`，`request` 和 `response`。`Context`，`Request` 和 `Response` 都是 `Koa` 下面自定义的三个类。

```javascript
function Application() {
  if (!(this instanceof Application)) return new Application;
  this.env = process.env.NODE_ENV || 'development';
  this.subdomainOffset = 2;
  this.middleware = [];
  this.proxy = false;
  this.context = Object.create(context);
  this.request = Object.create(request);
  this.response = Object.create(response);
}
```

### Application#use

这个函数就是检查 `fn` 的合法性，然后把 `fn` 添加到 `middleware` 数组里面，返回 `this` 可以让这个函数链式调用。

```javascript
app.use = function(fn){
  if (!this.experimental) {
    // es7 async functions are not allowed,
    // so we have to make sure that `fn` is a generator function
    assert(fn && 'GeneratorFunction' == fn.constructor.name, 'app.use() requires a generator function');
  }
  debug('use %s', fn._name || fn.name || '-');
  this.middleware.push(fn);
  return this;
};
```

### Application#callback

调用 `callback` 函数返回的是一个形似 `function(res, req) {}` 的函数。这个返回的函数传给 `http.createServer`。

让我们仔细看一下 `callback`，首先，调用 `compose` 将 `middleware` 变为一个 `Generator` 函数，然后使用 `co.wrap` 将其变为一个返回 `Promise` 的函数。关于 `co` 的讨论，可以看我写的另一篇文章 [阅读 co 源码](http://zhuscat.com)。

接着保存 `this` 给 `self`。

注意到 `this.listeners('error').length` 这段代码，`Application.prototype` 的原型是 `EventEmitter.prototype`，因此拥有这个属性。

接着就是返回这个回调函数了，`onFinished` 是在一个 HTTP 请求关闭，结束或者出现错误的时候调用的，这里我们传入了 `ctx.onerror`，`createContext` 所做的就是创建一个 `Context` 对象，然后创建 `Request` 和 `Response` 对象，并将它们进行一系列的关联。

可以看到下面还有一个 `respond.call(ctx)`，`respond` 是一个关于 `Response` 的帮助函数，最终结束掉响应。

```javascript
app.callback = function(){
  if (this.experimental) {
    console.error('Experimental ES7 Async Function support is deprecated. Please look into Koa v2 as the middleware signature has changed.')
  }
  var fn = this.experimental
    ? compose_es7(this.middleware)
    : co.wrap(compose(this.middleware));
  var self = this;

  if (!this.listeners('error').length) this.on('error', this.onerror);


  return function handleRequest(req, res){
    res.statusCode = 404;
    var ctx = self.createContext(req, res);
    onFinished(res, ctx.onerror);

    fn.call(ctx).then(function handleResponse() {

      respond.call(ctx);
    }).catch(ctx.onerror);
  }
};
```

## Context

`Context` 类（准确来说是用作一个原型）作为一个上下文，提供了到 `Response` 对象和 `Request` 对象的代理。

## Request

提供了一系列与请求相关的方法。

## Response

提供了一系列与响应相关的方法。

## 总结

最后附上一个 `Koa` 调用的流程

![Koa Flowcahrt](https://i.loli.net/2018/11/17/5befc20816dea.png)

`Koa` 是一个非常轻量级的 Web 框架，连路由都没有提供，去看它的源码的时候，发现居然只有4个文件，每个文件代码都不多，并且有许多注释，比较容易阅读。正是这样一个轻量级的框架，配合大量的中间件，可以构建出一个功能强大的应用，这也许就是 Koa 的魅力所在吧。
