---
title: 为什么 Response Header 里面不带缓存相关的头部，还是会走缓存？
date: 2022-01-29 22:46:16
category: 技术
tags:
  - 网络
  - 浏览器
---

如果我们的 HTTP 请求的响应头里面没有返回任何缓存相关的头（如 Cache-Control），请求对应的资源还是有可能走缓存。之前在调试微信开发者工具的时候，发现请求头里面没有任何缓存相关的字段，但是响应还是 from disk

进行了一番搜索，发现：

> Leaving out the Cache-Control response header does not disable HTTP caching! Instead, browsers effectively guess what type of caching behavior makes the most sense for a given type of content. Chances are you want more control than that offers, so take the time to configure your response headers.

这叫做启发式缓存，但不知道是不是只有 Chrome 才有

# 参考

1. [为什么Header里面不带缓存相关的头部，还是会走缓存](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/53#issuecomment-760675415)