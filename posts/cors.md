---
title: CORS 跨域
date: 2016-10-14 08:26:24
category: 学习笔记
tags:
- 前端
- HTTP
---
虽然一直知道跨域，但也仅限于知道什么情况下会出现跨域的问题，没有实践过如何实现跨域。最近写代码正好碰到了需要跨域的需求，正好学习一下。实现跨域有很多种方法，常见的有 CORS，JSONP。这里我仅仅是说明如何使用 CORS 进行跨域。

### 请求分类

请求分为简单请求和非简单请求，满足以下条件的为简单请求，否则为非简单请求。

一、请求方法是以下几种

1. HEAD
2. GET
3. POST

二、HTTP的头信息不超出以下几种字段

（不包括 User Agent 自动增加的头部，如 `Connection`，`User-Agent`，详情见[forbidden-header-name](https://fetch.spec.whatwg.org/#forbidden-header-name)）

1. Accept
2. Accept-Language
3. Content-Language
4. Last-Event-ID
5. Contnet-Type 为  `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain` 中的一个。

### 简单请求

在简单请求的情况，浏览器在发出CORS请求头部中会自动增加一个 `Origin` 字段。

```http
GET / HTTP/1.1
Origin: http://localhost:6006
Host: localhost:8124
Connection: keep-alive
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36
Accept-Language: zh-CN,zh;q=0.8,en;q=0.6
```

如果 `Origin` 指定的源不在许可的范围里面，服务器就会返回一个正常的 HTTP 响应。如果浏览器发现回应的信息没有 `Access-Control-Allow-Origin` ，浏览器就会抛出一个错误，并会被 `XMLHttpRequest` 的 `onerror` 捕获。

**注意**：此时 HTTP 返回码仍然可能是 200。

如果是允许返回的域，则服务器返回的字段中会有以下几个字段（其中，肯定会有 `Access-Control-Allow-Origin`，另外的两个根据相应情况而定。

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:6006
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: X-Requested-With
```

(1) `Access-Control-Allow-Origin`

表明允许的 `Origin`，当时 `*` 的时候表示接受任何域的请求。

(2) `Access-Control-Allow-Credentials`

表明是否允许发送 `cookie`。允许下添加 `Access-Control-Allow-Credentials: true`，否则不包含该字段，该字段不能设置为 `false`。如果要浏览器发`cookie`，还需要浏览器方面做出一些配置。

```javascript
const xhr = new XMLHttpRequest();
xhr.withCredentials = true
```

这样就可以发送 `cookie` 了，另外需要注意的是，如果要发送 `cookie`，服务器返回的 `Access-Control-Allow-Origin` 不能是 `*`，必须是确定的域名。`cookie` 的传送依然遵循同源政策。

(3) `Acess-Control-Expose-Headers`

可被 `getResponseHeader` 拿到的额外的字段。

本来就可以拿到的字段有：

```
Cache-Control
Content-Language
Content-Type
Expires
Last-Modified
Pragma
```

### 非简单请求

当发送非简单请求的时候，会先发送一个 `preflight` 请求，看这个请求是否被允许。

如下所示就是一个 `prefilight` 请求

```http
OPTIONS / HTTP/1.1
Host: localhost:8124
Connection: keep-alive
Access-Control-Request-Method: POST
Origin: http://localhost:6006
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36
Access-Control-Request-Headers: x-requested-with
Accept: */*
Referer: http://localhost:6006/api
Accept-Encoding: gzip, deflate, sdch
Accept-Language: zh-CN,zh;q=0.8,en;q=0.6
```

注意到有两个特殊字段

(1) `Access-Control-Request-Method`

表明该请求所用到的 HTTP 方法

(2) `Access-Control-Request-Headers`

表明额外发送的头信息字段，这里是 `x-requested-with`，多个字段用逗号隔开。

如果服务器允许该跨域请求，会做出相应的回应。

```http
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: X-Requested-With
Access-Control-Allow-Methods: GET, POST, PUT
Date: Thu, 13 Oct 2016 15:19:04 GMT
Connection: keep-alive
Transfer-Encoding: chunked
```

如果服务器返回普通的响应，则浏览器认为跨域不被允许，于是会抛出错误。

这里有几个新的字段之前没看到过

(1) `Access-Control-Allow-Headers`

允许的额外头部

(2) `Access-Control-Allow-Methods`

允许的 HTTP 请求方法

另外，还有可能会返回一下的字段

(1) `Access-Control-Allow-Credentials`

(2) `Acess-Control-Max-Age`

指明本次 `preflight` 的有效时间（秒），在有效时间内不用再次发送 `preflight` 请求。

接着浏览器就会发送正常的请求：

```http
POST / HTTP/1.1
Host: localhost:8124
Connection: keep-alive
Content-Length: 0
Origin: http://localhost:6006
X-Requested-With: X-Requested-With
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36
Accept: */*
Referer: http://localhost:6006
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.8,en;q=0.6
```

接着服务器再返回请求

```http
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: *
Date: Thu, 13 Oct 2016 15:19:04 GMT
Connection: keep-alive
Transfer-Encoding: chunked
```

### 参考资料

1. [跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)
2. [前端跨域及其解决方案](http://tech.jandou.com/cross-domain.html)

### 更新记录

1. 2017 年 8 月 16 日修改对简单请求的描述
