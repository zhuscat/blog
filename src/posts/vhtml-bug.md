---
title: 回忆一个 vhtml 的 BUG
date: 2022-08-17 22:46:16
category: 技术
tags:
  - JavaScript
---

今天在 GitHub 推荐里面看到 `htm` 的仓库推荐，想起了前段时间被 `htm` 的一个配套库——`vhtml` 坑的事情

[htm](https://github.com/developit/htm) 大概是一个在模板字符串写类 JSX 语法的库，它会帮在运行时转换，这样就可以不经过编译直接在代码里使用 JSX 了

然后它有一个配套库，也是同一个作者写的，叫 [vhtml](https://github.com/developit/vhtml)，这两个库相结合，你可以将你的类 JSX 转换成标准的 HTML 字符串

由于历史原因，我们一些生成图片的方案使用在服务端用这两个库生成 HTML，然后传给 Puppeteer，生成一张截图返回给前端

大概一两个月前，同事找我说该服务的内存占用会不断攀升，最终导致 OOM。我猜大概是哪里内存泄漏了。因为之前一直没有问题，所以先看了一下接口调用的情况，是不是有哪个接口调用量激增，然后果然发现一个接口调用增长了十倍有余。所以我就先从这个接口入手看问题了，先看了一下代码并没有发现什么异样。于是我本地跑了一下代码，然后调用猜测有问题的这个接口，发现每调用一次接口内存占用就会上升一些。这样基本可以确定把范围圈定在这段代码里面应该是可以找出问题了。我大概就是使用⌈二分调试法⌋，逐渐缩小问题点，最终定位到就是调用 `htm` 生成 HTML 字符串导致内存不断被占用的

那么要么就是 `htm` 的问题，要么就是 `vhtml` 的问题。我先看了一下 `vhtml`，因为这个库代码很少。我第一眼就看到，这个库里有个顶级对象，会不断地有新的键值对添加进去，却没有一个地方释放（[https://github.com/developit/vhtml/blob/96fe21e63a983d7a8f52d8c51a0c994490313abc/src/vhtml.js#L12](https://github.com/developit/vhtml/blob/96fe21e63a983d7a8f52d8c51a0c994490313abc/src/vhtml.js#L12)）。这样基本就可以确定是这个库的问题了

我就到该仓库的 Issues 下面提问题，发现原来早就有人提到[存在内存泄漏的问题](https://github.com/developit/vhtml/issues/20)。然后发现作者一开始想用 WeakMap 解决（[https://github.com/developit/vhtml/pull/23](https://github.com/developit/vhtml/pull/23)），这显然是不行的，因为这个 key 是一个 String 类型，怎么能用 WeakMap 解决呢？作者发了这个 PR 之后就没合

然后我又问作者是否有修复这个问题的计划，作者响应速度倒是很快，立即又提交了一个 PR（[https://github.com/developit/vhtml/commit/8679db8ad83316ec066de1b4d766ca3586910974](https://github.com/developit/vhtml/commit/8679db8ad83316ec066de1b4d766ca3586910974)），不过这个 PR 还是有 BUG 的，因为实践中发现这个改动跟 `htm` 搭配还是有问题，会导致内容被转义多次，随意看了一下大概是跟 `htm` 的内部缓存优化有关，换成 `htm/mini` 就可以了，因为 `htm` 代码相对比较多，我们这个服务新的需求也不再使用这套方案生成图片了，就没深究了 `htm` 的实现了

总结一下，选择开源库还是需要精心调研选择的，比如 `htm` 已经有 7k+ 的 Star 了，`vhtml` 也有 700+ Star，即使是这个样子，还是有这么严重的 BUG。所以选择开源库，不仅要看 Star 数，还要看是不是经受了大量项目的考验，甚至可能还要你自己去看一下一些代码片段去确定作者写的这个库的质量