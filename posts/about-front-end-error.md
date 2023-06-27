---
title: 前端错误小知识
date: 2017-11-03 23:36:41
category: 学习笔记
tags:
- 前端
- JavaScript
---

## window.onerror

`window.onerror` 是顶层的错误处理函数，大部分抛出的未被处理的错误可以在这里进行统一处理。如下所示：

```js
window.onerror = function(msg, source, row, col, error) {
  // 处理各种事情，如错误上报
}
```

另外，如果在函数中 `return true` 的话，错误不会继续向上抛出，也就是不会再浏览器控制台出现 `Uncaught Error` 这些提示。

当然，`window.onerror` 不是万能灵药，有如下限制：

1. Promise 抛出的错误无法处理
2. 跨域脚本中的错误会直接显示成 `Script Error`，这样一来无法定位错误
3. 比如说在 HTML 中请求一个不存在的资源，如 `<img src="./404.png">`，这也是一个错误，不过 `window.onerror` 也是不能处理到的。

当然，上面的问题也有一定的解决方案。

首先说一下跨域脚本问题，第一个解决办法是将脚本同源化，另外就是设置 CORS 策略：

1.给 `script` 标签加上 `crossorign`，假设 `http://127.0.0.1:8080` 跟当前页面不同源

```html
<script src="http://127.0.0.1:8080" crossorign></script>
```

2.对服务器进行相关设置

设置 `Access-Control-Allow-Origin` 为 `*` 或者对应的源

另外，对于指定相应源的 `Access-Control-Allow-Origin`，一个小知识点是关于脚本的缓存的，我们需要设置 `Vary: Origin` 来根据 `Orign` 区分缓存，这样一来就不会出现类似 `http://127.0.0.1:8080` 请求脚本，结果响应的头部中的 `Access-Controll-Allow-Origin` 为 `http://127.0.0.1:3000` 的问题了。

## Promise 错误的统一处理

上面说到 Promise 的错误是无法通过 `window.onerror` 处理的，我们通过另一种方式进行统一处理：

```js
window.addEventListener('unhandledrejection', function(event) {
  // 进行各种处理
  console.log(event.promise) // 产生错误的 promise
  console.log(event.reason) // 异常原因或者 reject 的内容
  // 如果想要阻止继续抛出，即会在控制台显示 `Uncaught(in promise) Error` 的话，调用以下函数
  event.preventDefault()
})
```

## HTML 中网络请求错误

通过以下方法：

```js
window.addEventListener('error', function(event) {
  console.log(event)
}, true)
```

注意第三个参数，即在捕获阶段进行日志的捕获，这种方案的缺点是只能知道这个错误发生了，但是错误发生的原因什么的无法进一步知道，错误的内容大概如下所示（请求不存在的图片资源返回了404）：

![img-404-error](https://i.loli.net/2018/11/17/5befc59987bf6.png)

## One more thing

现在一般会对代码进行压缩混淆，这样一来代码中出错得到的名称、行数、列数等信息会和源代码中有出入，这个时候可以一同生成 `sourcemap`，然后可以通过压缩文件报出的错误信息和 `sourcemap` 结合来得出源代码中相应的信息。

## 进一步阅读

1. [脚本错误量极致优化-监控上报与Script error](https://github.com/joeyguo/blog/issues/13)
2. [脚本错误量极致优化-让脚本错误一目了然](https://github.com/joeyguo/blog/issues/14)
3. [前端魔法堂——异常不仅仅是try/catch](https://segmentfault.com/a/1190000011602203)
