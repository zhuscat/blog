---
title: 为什么会有微任务
date: 2022-01-06 23:57:00
category: 技术
tags:
- JavaScript
---

前几天面试一个人的时候在聊事件循环的时候突然想到的一个可以问的问题：为什么在 JavaScript 中有任务（又称宏任务，下文使用名词「任务」）和微任务？

这里说说我的小见解：

注：下文描述均基于浏览器

## 任务和微任务的行为

在一个事件循环中，微任务（Microtask）在任务（Task）运行完之后执行，在下一次事件循环之前，会清空微任务队列，在微任务执行中注册的微任务，也会被执行。从严格意义上来说，微任务是在任务之后执行的，很多人都认为先执行完微任务，再执行任务，这忽略了一个事实是入口脚本的执行是第一个任务。

## 哪些是任务

setTimeout、setInterval、浏览器原生事件等（如用户点击按钮触发 click 事件，如果是直接调用 dom 的 click 方法或者 dispatchEvent 则是同步的）

## 哪些是微任务

Promise（注：Promise 规范并不要求必须是微任务，不过实际情况是微任务）、MutationObserver、`queueMicrotask`等

## 为什么要有微任务

延迟执行代码，但又要再下一次事件循环之前执行，比如我们有个业务逻辑是监听滚动事件并更新DOM，如果我们用任务的方式，如在 setTimeout 里面去更新 DOM，很容易出现 DOM 更新不及时的情况，这个时候我们用微任务就可以解决这个问题。微任务使得延迟执行的代码（比如效率方面的考虑需要延迟执行，合并操作一次性延迟执行）不必在后续的事件循环中才被执行，可以尽快被执行，这对于视图来说是至关重要的。一个具体的例子可以在[这个 issue 评论](https://github.com/vuejs/vue/issues/3771#issuecomment-249663327)中找到。

## 一些参考文章

1. [In depth: Microtasks and the JavaScript runtime environment](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth)

2. [JavaScript的DOM事件回调不是宏任务吗，为什么在本次微任务队列触发？](https://www.zhihu.com/question/362096226)

3. [What was the motivation for introducing a separate microtask queue which the event loop prioritises over the task queue?](https://stackoverflow.com/questions/66190571/what-was-the-motivation-for-introducing-a-separate-microtask-queue-which-the-eve)
4. [Vue源码详解之nextTick：MutationObserver只是浮云，microtask才是核心！](https://segmentfault.com/a/1190000008589736)

