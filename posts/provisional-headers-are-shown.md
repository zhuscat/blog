---
title: 一场对 Provisional headers are shown 的探索之旅
date: 2019-04-12 20:57:06
category: 学习笔记
tags:
- 浏览器
---

经常使用 Chrome 的 Network 面板会发现，即使是正常成功返回的跨域请求，在 Request Header 一栏还是会显示 **Provisional headers are shown**。

有诸多原因会导致出现 **Provisional headers are shown** ，比如我看到的这篇文章 [provisional headers are shown  知多少](http://xxdy.tech/2018/11/30/header/) 里有说到几种情况，但对于正常的跨域请求来说，显然不在上述文章所列出的几点原因中。

在进一步探寻出现该问题原因的过程中，我找到了这篇文章  [https://www.chromium.org/Home/chromium-security/site-isolation#TOC-Known-Issues](https://www.chromium.org/Home/chromium-security/site-isolation#TOC-Known-Issues) ，在里面有写到：

> In Chrome’s DevTools, cookies and other request headers are not shown in the network panel for cross-site subresource requests. There are also issues with the DOM storage view, security panel, performance panel, and with scrolling over cross-site iframes in mobile device emulation mode, all of which are fixed in Chrome 68.

也就是说，这一问题是由于 Chrome  [Site Isolation](https://developers.google.com/web/updates/2018/07/site-isolation)  的特性导致的，至此，真相应该大白了。

如果是这样的话，那么关掉 Site Isolation 的特性应该就可以看到所有的请求头部了，搜了下，发现 Chrome 确实提供了对应的开关，在  [chrome://flags/#site-isolation-trial-opt-out](chrome://flags/#site-isolation-trial-opt-out)  中，然而，在我关闭了该特性之后，发现跨域请求还是有 **Provisional headers are shown**，然后，我蒙圈了，在尝试了 `./Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary --disable-site-isolation-trials` 启动 Chrome 之后，依旧无解。

至此，我探究 **Provisional headers are shown** 问题的旅程宣告暂时性结束，留下了一个疑问，如果有读者恰巧知道的话，欢迎评论告知。
