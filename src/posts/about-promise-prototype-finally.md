---
title: About Promise.prototype.finally
date: 2018-03-04 20:28:54
category: 学以致用
tags:
- 前端
- JavaScript
---

今天随意浏览，发现 `Promise.prototype.finally` 已经进入到 `Stage 4` 了，顺便记录一下规范中 `finally` 的一些注意点吧。

## 使用方法

```js
Promise.resolve(666).finally(() => { console.log('finally') })

Promise.reject('reason').finally(() => { console.log('finally') })
```

## 注意点

1、 `finally` 中的回调函数不接受任何参数

2、在调用了 `finally` 之后返回的仍然是一个 `Promise`，它会将前面操作 `resolved` 或者 `rejected` 的值作为这个新返回的 `Promise` 将会 `resolved` 或者 `rejected` 的值，但是，如果在 `finally` 中 `throw` 或者返回一个将会 `rejected` 的 `Promise`，那么，新返回的 `Promise` 将会被在 `finally` 中 `throw` 或者返回的 `Promise` reject 掉的值 reject 掉。

让我们看几个例子：

```js
Promise.resolve(666).finally(() => { console.log('finally') })
```

对于上面这段代码，最终这个 `promise` `resolved` 的结果为 `666`

```js
Promise.reject('reason').finally(() => { console.log('finally') })
```

对于上面这段代码，最终这个 `promise` `rejected` 的结果为 `reason`

```js
Promise.reject('reason').finally(() => {
	console.log('finally')
	throw 'reason2'
})
```

对于上面这段代码，最终这个 `promise` `rejected` 的结果为 `reason2`

## 自己写 Polyfill

```js
Promise.prototype.finally = function(fn) {
  return this.then(
    value => Promise.resolve(fn()).then(() => value),
    reason => Promise.resolve(fn()).then(() => { throw reason })
  )
}
```