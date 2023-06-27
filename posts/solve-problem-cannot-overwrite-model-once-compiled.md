---
title: mongoose Cannot overwrite model once compiled
date: 2017-01-05 14:35:12
category: 学以致用
tags:
- mongoose
- mongodb
- JavaScript
- chokidar
- isomorphic
---

之前使用了 [koa2-react-isomorphic-boilerplate](https://github.com/wssgcg1213/koa2-react-isomorphic-boilerplate) 作为编写前后端同构应用，但是使用这个 boilerplate 的时候出现了一个问题：我使用了一个库 `mongoose`，每次在 `development` 模式下修改代码的时候就会抛出错误，错误原因就是 `Cannot overwrite model once compiled.`，然后只能自己重启服务器。

然后就就想着要不就修改代码之后重启服务器吧。之后又参考了几个前后端同构的 boilerplate，自己写了个 boilerplate，大概就是服务器端代码修改时候自动重启，客户端代码修改进行热替换。然而，这带来的一个问题是客户端代码修改之后，当刷新页面时候服务端返回的html与客户端生成的是不一致的，在这个 [issue](https://github.com/chikara-chan/react-isomorphic-boilerplate/issues/1#issuecomment-270562613) 中我有提到。接着我突然想到，[koa2-react-isomorphic-boilerplate](https://github.com/wssgcg1213/koa2-react-isomorphic-boilerplate) 是可以在客户端代码修改后也修改服务器端返回的代码的，具体实现就是通过清除 `require` 缓存，至于为什么 `mongoose` 会报这个重复定义的错呢，我再次查阅了一些资料，发现 `mongoose` 会缓存 `model` 和 `modelSchema` 在 `mongoose.models` 和 `mongoose.modelSchemas` 上面，当清除 `require` 的缓存之后，`mongoose.models` 里面的东西还在，然后再次 `require` 模型的时候就报错了。

因此，我通过在监听文件变动的代码里再加上下面的代码来清除 `mongoose` 中的缓存，成功地解决了这个问题：

```javascript
Object.keys(mongoose.models).forEach(function(model) {
  delete mongoose.models[model];
})
Object.keys(mongoose.modelSchemas).forEach(function(schema) {
  delete mongoose.modelSchemas[schema];
})
```
