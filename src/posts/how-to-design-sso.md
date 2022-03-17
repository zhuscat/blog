---
title: 如何设计 SSO
date: 2022-03-12 22:00:00
category: 技术
tags:
  - 系统设计
---

# 什么是 SSO

一个 SSO（单点登录）系统，能做到一次登录，能在多个系统中获得登录态，而不需要在每一个系统中再单独登录一次

# 如何实现

在 Web 系统中，不同的系统一般指的是不同域名的站点，如 `foo.example.com`, `bar.example.com`。登录态的保持可以用 Cookie、localStorage 这种持久化的方式来保存登录凭证。Cookie 可以通过后端接口返回的 Response Header 中的 `Set-Cookie` 来设置，localStorage 则可以通过后端接口返回的数据自行保存，并在接口请求的时候带上对应的登录凭证。

## Set-Cookie 的极限

Cookie 的优势是借助浏览器的机制（`Set-Cookie`）可以自己设置上去，并且可以设置到二级域名上，并且在发送请求的时候，浏览器也会自动给请求头带上 Cookie。

假设我们多个系统的二级域名都是 `example.com`，如 `foo.example.com`，`bar.example.com`，我们可以通过如下方式将 Cookie 设置到 `example.com`，这样，所有二级域名为 `example.com` 的站点全都变成登录态了：

```
Set-Cookie: token=foo; Path=/; Domain=example.com
```

但是，如果多个系统的二级域名不同呢？比如阿里旗下有 `taobao.com`，`tmall.com`，这样如何实现 SSO 呢？

## 不同二级域名的 SSO

假设我们有三个系统

1. sso.example.com：统一登录页面，当一个系统未登录的时候，会统一跳到统一登录页进行登录
2. mall.foo.com：商城系统
3. chat.bar.com：聊天系统

可以看到，这三个系统的二级域名均不同，下面介绍几种方式

### 登录后携带 ticket 转跳各个系统

我们在 sso.example.com 登录后，可以携带一个 ticket 转跳到其他系统，其他系统再转跳到下一个系统，ticket 可以理解成一个可以向后端接口交换到最终登录凭证的参数，比如后端接口可以 Set-Cookie：

```
登录 sso.example.com?from=mall.foo.com，假设是从 mall.foo.com 转跳过来的
-> 转跳到商城系统
mall.foo.com?ticket=hello&from=mall.foo.com
-> 转跳到聊天系统
chat.bar.com?ticket=hello&from=mall.foo.com
-> 最终转跳到原始地址
mall.foo.com
```

这种方式不管再什么浏览器版本中都是可行的，缺点是会有一个比较漫长的登录过程，如果系统比较多的情况下，可能体验不是很好。

另一种同样原理的方式是不去一次性跳转所有系统，而是在访问系统的时候，如果发现是未登录状态，则跳转到统一登录页，如果此时统一登录页已经是登录态的话，再携带 ticket 跳转回原系统，缺点是访问未登录系统的时候必定会跳转统一登录页一次。

### 如何更快

那么，有没有办法登录一次，其他系统就自动变成登录态，而不需要跳转页面呢？过去会有下面这样的做法，但在当今时代已经不适用了，我先介绍一下方式，然后说为什么不适用了。

1. 我们可以在统一登录页登录，在登录成功之后，在统一登录页调用 `*.foo.com` 的接口和 `*.bar.com` 的接口，让他们 Set Cookie 到各自的域名。
2. 通过 iframe，在统一登录页加载 `*.foo.com` 和 `*.bar.com` 的页面，或者在 `*.foo.com` 或者 `*.bar.com` 通过 iframe 加载 `*.example.com`，并通过 postMessage 的方式去让对应的页面设置 Cookie

但是这些方式在当今主流浏览器中均已不适用了，原因是出于对用户隐私的保护，浏览器开始限制写入第三方 Cookie（当然有方法可以关闭，但因为这个限制存在，上面的方法不再是通用的解决方案了），比如你在 sso.example.com 下，访问 `*.foo.com 的接口`，`*.foo.com` 的接口想要去设置 Cookie，因为域名不同，其想要设置的 Cookie 就是第三方 Cookie，关于第三方 Cookie，我曾经写过一篇文章提到过：[Cookie 知识二则](https://zhuanlan.zhihu.com/p/50541175)，你也可以看看这篇文章：[当浏览器全面禁用三方 Cookie](https://zhuanlan.zhihu.com/p/131256002)

### 怎么办

首先上面说的都是 Cookie 方式，比如通过 iframe，你仍然可以通过 localStorage 对 token 进行存储，然后自己发送请求的时候带上 token 即可，这没有 Cookie 方便，不过也是可以实现 SSO 的，但我也在 StackOverflow 看到有人提问，说通过这种方式不能在 iframe localStorage 中保存数据，我在最新版本的 Chrome 上测试过是可行的。

## 总结

在当前浏览器环境下，可行的方式：

1. 统一登录，并一次性转跳各个系统获取登录态
2. 统一登录，在访问各自系统时转跳回统一登录再转跳回系统获取登录态
3. 使用 Cookie 之外的方式，如 localStorage，加载 iframe 并传递必要信息给各个系统

# 相关的题外话

1. 跨域请求，客户端必须设置 withCredentials（XMLHttpRequest） 或者 credentials=include（Fetch），Set-Cookie 才能正确设置，否则会被忽略

# 参考资料

1. https://zhuanlan.zhihu.com/p/131256002
2. https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage
3. https://segmentfault.com/a/1190000039712911
4. https://stackoverflow.com/questions/37559827/how-youtube-gets-logged-in-to-gmail-account-without-getting-redirected
