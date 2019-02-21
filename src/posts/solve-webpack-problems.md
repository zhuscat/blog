---
title: 用 webpack 遇到的坑
date: 2016-07-20 22:15:17
category: 学以致用
tags:
- 前端
- 开发
---

node 是好久之前装的了，更新了一下，问题出现多多

首先是 npm 出现了一些问题，错误大概是这个样子的：

```
fs: re-evaluating native module sources is not supported. If you are using the graceful-fs module, please update it to a more recent version.
```

然后通过更新 npm 解决了：

```
sudo npm update -g npm
```

接着，全局安装 webpack

```
npm install -g webpack
```

使用 webpack 的时候出现了以下问题：

```
Error: Cannot find module 'webpack/lib/node/NodeTemplatePlugin'
```

看了一下有没有 `NodeTemplatePlugin`，结果是有的。

我的心情是这样的

![表情1](https://i.loli.net/2018/11/17/5befc787db25c.png)

然后继续各种搜索，总算找到办法，原来是要设置 `NODE_PATH`，我用的是 fish shell，打开 `config.fish`，加上一行:

```
set -x NODE_PATH /usr/local/node_modules:/usr/local/lib/node_modules
```

之后总算是可以用了，这里记录一下。