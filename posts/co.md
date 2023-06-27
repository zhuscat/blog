---
title: 阅读 co 源码
date: 2016-12-10 08:41:29
category:  学以致用
tags:
- 阅读源码
- co
- 异步编程
- JavaScript
- 前端
---

阅读了一下 `co` 的源码，发现其实做法跟我之前看的《你不知道的 JavaScript》中的 Generator + Promise 一节类似。正好巩固了一下这方面的知识，顺便做一些记录。

`co` 的源码不多，和注释加起来也才两百多行。其中，一个核心函数就是 `co` 了， `co` 可以将 `Generator` 进行自动的执行，本文就来讲一讲 `co` 是怎么实现自动运行 `Generator` 的。



`co` 函数会返回一个 `Promise` 对象。

```javascript
function co(gen) {

  var ctx = this;

  var args = slice.call(arguments, 1);

  return new Promise(function(resolve, reject) {
      // ...
  });
}
```

在传给这个返回的 `Promise` 对象的函数体中，做了很多事情。 首先，函数检查传入的 `gen` 参数是否是一个函数，如果是的话先执行这个函数，然后将 `gen` 重新赋值（如果这个函数是一个 `Generator` 的话，此时 `gen` 变为一个 `iterator`）。接着，检查 `gen` 是否是一个有 `next` 方法的对象，不是的话直接 `resolve` 返回。

```javascript
function co(gen) {

  var ctx = this;

  var args = slice.call(arguments, 1);

  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.apply(ctx, args);

    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    //...
  });
}
```

之后函数会调用 `onFulfilled` 方法。 `onFulfilled` 调用 `gen` 的 `next` 方法，并捕获可能发生的错误并进行 `reject`。如果没有发生错误，则调用 `next` 方法。

```javascript
function co(gen) {

  var ctx = this;

  var args = slice.call(arguments, 1);

  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.apply(ctx, args);

    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    onFulfilled();


    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);

      return null;
    }

    // ...
  });
}
```

`next` 方法就是让 `Generator` 自动完成的核心方法了。 它首先检查迭代器迭代是否完成，如果完成就直接 `resolve`。否则，将 `ret.value` 转化成一个 `Promise`（如果可以的话）。接着检查 `value` 是否成功转化为一个 `Promise`，如果是的话，就调用 `value` 的 `then` 方法，并把 `onFulfilled` 和 `onRejected` 作为这个 `Promise` 完成或被拒绝时候执行的函数。如果没有成功被转换为 `Promise`，则执行 `reject`。

```javascript
function co(gen) {

  var ctx = this;

  var args = slice.call(arguments, 1);

  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.apply(ctx, args);

    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    onFulfilled();


    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);

      return null;
    }

    // ...

    function next(ret) {
      if (ret.done) return resolve(ret.value);
      var value = toPromise.call(ctx, ret.value);
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
        + 'but the following object was passed: "' + String(ret.value) + '"'));
    }
  });
}
```

最后再看一下 `onRejected`，首先，它让 `gen` 调用 `throw` 方法，并传入错误参数，如果 `Generator` 中写了捕捉相应错误的代码，则会捕捉到错误并返回 `ret`，接着继续执行 `ret` 就好了（期间也可能抛出新的错误）。不然，错误被重新抛出（没有被 `Generator` 处理），然后调用 `reject`。

```javascript
function co(gen) {

  var ctx = this;

  var args = slice.call(arguments, 1);

  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.apply(ctx, args);

    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    onFulfilled();


    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);

      return null;
    }


    function onRejected(err) {
      var ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    function next(ret) {
      if (ret.done) return resolve(ret.value);
      var value = toPromise.call(ctx, ret.value);
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
        + 'but the following object was passed: "' + String(ret.value) + '"'));
    }
  });
}
```

这就是 `co` 的核心函数了，其他的一些函数都是一些判断类型（是否为 `Promise`等），转换函数（将 `thunk` 转换为 `Promise`，将 `Array` 转换为 `Promise` 等）和一个 `wrap` 函数（将 `Generator` 转换一个返回 `Promise` 的函数）。