---
title: Promise
date: 2016-08-21 21:10:38
category: 学以致用
tags:
- 前端
- JavaScript
---

## 什么是 Promise

> Promise是抽象异步处理对象以及对其进行各种操作的组件。

使用 Promise 可以有效的避免写多个层次的回调函数。

## 初体验

首先看一下使用回调函数进行异步操作的写法。

`getSomethingFromNetwork` 是一个虚构的函数，其功能是异步从网络中获取内容。

```javascript
getSomethingFromNetwork(function(error, resp) {
  if (err) {
    // 处理错误
  }
  // 对获取的结果进行进一步的处理
})
```

那用 Promise 会怎么写呢？

```javascript
var promise = getSomethingFromNetworkPromise()
promise.then(
function(resp) {
  // 对获取的结果进行进一步的处理
}, function(err) {
  // 处理错误
})
```

是否很容易理解呢？

其实，一个新的 API，`fetch` 返回的就是 Promise 对象，该 API 的功能与 `XMLHttpRequest` 类似，进行异步的网络请求。

简单地看看这个 API 是怎么使用的吧：

```javascript
fetch('http://localhost:8080/api/tasks')
.then(resp => resp.json())
.then(json => console.log(json))
```

这里用到了 ES2015 的箭头函数。

关于 fetch API 的内容可以参考：

[【翻译】这个API很“迷人”——(新的Fetch API)](http://www.w3ctech.com/topic/854)

接下来就让我们了解一下 Promise 的具体内容。



## 构造器

```javascript
var promise = new Promise(function(resolve, reject){
  // 进行异步的处理
  // 然后在适当的时机调用 `resolve` 或者 `reject`
  // 当操作成功的时候调用 `resolve`
  // 当操作失败的时候调用 `reject`
})
```

## 状态

Promise 对象有三个状态:

1. Fulfilled(完成) 调用 `resolve`
2. Rejected(拒绝) 调用 `reject`
3. Pending(不是 Fullfilled 和 Rejected 时的状态)

状态转换：

Pending -> Fufilled | Rejected

## 实例方法

### Promise#then

```javascript
promise.then(onFullfilled, onRejected)
```

Promise 对象会在操作成功的时候调用 `resolve`，失败的时候调用 `reject`，而这个这两个函数就是在 `then` 中指定的。Promise 中可以将任意多个方法使用链式调用的方法写在一起。

```javascript
promise.then(func1).then(func2).catch(func3)
```

`catch` 是 Promise 对象的另一个方法，在下面会讲到，值得注意的是，`then` 或者 `catch` 返回的是一个全新的 Promise 对象，这与 `jQuery` 的链式调用不同，`jQuery` 实现链式调用是通过返回 `this`，而 Promise 则会返回一个全新的 Promise 对象，这一点要特别注意。

### Promise#catch(onRejected)

```javascript
promise.catch(onRejected)
```

`catch` 其实就是 `then` 方法的一个特殊情况:

```javascript
promise.then(undefined, onRejected)
```

## 静态方法

### Promise.all

```javascript
Promise.all([promise1, promise2])
.then(function([result1, result2]) {
  // 处理 result1, result2
}).catch(function([err1, err2]) {
  // 处理错误
})
```

`Promise.all` 接受一个由 Promise 对象组成的数组，返回一个 Promise 对象，只有当数组中的所有 Promise 对象都变成完成状态后，该 Promise 对象才会变成完成状态。`onFullfilled` 与 `onRejected` 接收的参数也是一个数组，其顺序与 Promise 对象数组里的顺序相同。

### Promise.race

```javascript
Promise.race([promise1, promise2])
.then(function(value) {
  // 处理成功状体
}).catch(function(err) {
  // 处理错误状态
})
```

`Promise.race` 用法与 `Promise.all` 相同，只不过在传入的 Promise 对象数组中有一个完成就会调用后续的方法。值得注意的是，`Promise.race` 在数组中一个 Promise 对象变为完成状态之后取消执行。ES6 Promises 规范中也没有取消 promise 对象执行的概念

### Promise.resolve

```
Promise.resolve(66)
// 相当于
new Promise(function(resolve) {
  resolve(66)
})
```

### Promise.reject

```
Promise.reject(new Error('Some Error'))
// 相当于
new Promise(function(undefined, reject) {
  reject(new Error('Some Error'))
})
```

## 链式调用

前面在说 `Promise#then` 的时候已经提到了链式调用了，也说到了每次调用返回的是一个全新的 Promise 对象，现在我们再更加详细地看看链式调用的细节。

```javascript
const increment = value => {
  return value + 1
}

const double = value => {
  return value * 2
}

const log = value => {
  console.log(value)
}

const logError = err => {
  console.error(err)
}

let promise = Promise.resolve(1)

promise.then(increment).then(double).then(log).catch(logError)
// 输出：4
```

链式调用通过函数返回的值进行参数的传递，上面的例子首先调用  `increment`，`value` 变为2，接着调用 `double`， `value` 变为 4，接着调用 `log`，输出 4。

前一个函数返回的值会经过 `Promise.resolve` 的包装返回，然后下一个 `Promise#then` 方法中的函数就能接收到前一个函数返回的值了，这就是 Promise 链式调用的细节。

## 推荐写法

**注：**该推荐写法是本人通过阅读其他一些教程的推荐方法与自己平时自己的一些实践所得，并不一定是客观意义上的最好写法

### 捕捉错误

```javascript
promise.then(func1).then(func2).catch(func3)
```

只在 `then` 中写一个函数，用 `catch` 捕获错误。

```javascript
// 看看下面两种捕获错误的方法有什么区别
promise.then(func1, func2) // 1
promise.then(func1).catch(func2) // 2
```

看看上面代码，有什么区别呢？

先看看1，如果 `func1` 中出现错误，`func2` 并不会执行。

再看看2，如果 `func1` 中出现错误，会执行 `func2`。

```javascript
// 写成这样就知道是怎么回事了
promise.then(func1, func2) // 1
promise.then(func2).then(undefined, func2)
```

如果使用第一种写法，在逻辑上的确出现了错误，单并没有任何代码去处理该错误，这显然并不是很好的写法。而使用 `catch` 代码更加清晰简洁。

### 抛出错误

有两种方法可以调用到 `onRejected` 函数，一种是抛出异常的方式：

```javascript
throw Error('some info')
```

另一种就是调用 `reject` (传入的 `reject` 参数)

```javascript
reject(value)
```

使用第二种方法的做法比较好，因为有其他情况会抛出异常，如果为了去调用 `onRejected` 函数抛出异常，但其他抛出异常也会调用到 `onRejected`，无法很好地区分主动抛出，还是其他的异常。

### 在 then 中进行 reject

```javascript
// 摘录自《JavaScript Promise迷你书（中文版）》 文后有链接
var onRejected = console.error.bind(console);
var promise = Promise.resolve();
promise.then(function () {
    var retPromise = new Promise(function (resolve, reject) {
       reject(new Error("this promise is rejected"));
    });
    return retPromise;
}).catch(onRejected);
```

前面说到了 `Promise#then` 中的返回值会作为链式调用下一个方法中函数的参数。当返回的是一个 Promise 对象的时候，会等到该对象的状态变为 Fulfilled 或者 Rejected 之后进行下一步调用。

## 注意点

Promise 能很好地消化内容产生的错误，这也是需要注意的地方，因为错误不会从 Promise 中出来，但如果使用异步回调函数抛出的错误不会被 Promise 内部捕获，也就是会被抛出 Promise。

## 参考资料

1. [JavaScript Promise迷你书（中文版）](http://liubin.org/promises-book/)
2. [ECMAScript 6 入门 - Promise](http://es6.ruanyifeng.com/)