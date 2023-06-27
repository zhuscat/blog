---
title: Thoughts on Styled Components
date: 2017-07-18 08:34:06
category: 想法
tags:
- 前端
- React
- CSS
- Styled Components
- CSS in JS
---

随着组件化的盛行，一些人开始使用 CSS in JS 的方案，目前比较流行的就是 Styled Components，为什么这种方案会被一些人接受并使用呢？我想从动机出发谈谈这个方案。

在组件化的思维下，很多人会发现，自己写的样式只会在某个组件下使用，比如我写了一个特定的 Button，那么这些样式只会在这个 Button 下使用，这个样式不会给一个列表项，不会给一个标题，在这种情况下，下面这种代码是很常见的：

```html
<Button className="btn">
<Button className="btn btn--primary">
```

这就带来了一个问题，为什么命名我的样式只会给一个特定的组件使用，我却要维护从组件到样式关系的一个映射呢？能不能去除这一层关系？

根据 Styled Components 的方案，最终代码就会变成下面这样

```html
<Button>
<Button primary>
```

另一个 CSS in JS 的优点是，可以发挥出 JS 的力量。比如说变量，循环等等，这些能力全部统统拥有，不再需要 Less，Sass 等等 CSS 预编译器了。

至于 CSS in JS，这里特指 Styled Components 这种方案到底好不好，这里就仁者见仁，智者见智了。虽然目前我还没有用到实践中去，但我认为这种方案还是不错的。

首先， Styled Components 并不是让我们去写一个类似 `style` 对象的东西，在 Styled Components 中，我们所写都是标准的 CSS 语法，甚至支持 CSS 动画，媒体查询等，根据 Styled Components 的原理，其最终也是生成一个类插入到 `head` 里面去。

另外，有了 JS 的帮助，我们可以拥有那些 CSS 预处理器拥有的大部分功能。

另外，Styled Components 所提供的一个 `ThemeProvider` 可以方便我们定制主题，先看一下现在主流的组件库是怎么定制主题的，以 Ant Design 为例，要定制主题，有两种方式，一个是在 `package.json` 中指定 `theme` 字段，当然，这是一个自定义字段，需要[相关的工具](https://ant.design/docs/react/customize-theme-cn)去对其进行解析 ，另一种方式就是覆盖 less 变量，不管哪种方式，都不显得那么简洁。但是使用 Styled Components，我们只需要在 `ThemeProvider` 中提供相关变量就好了，这样，一个组件库对外提供的是 JS 模块，我们使用 JS 对其进行配置，在配置的便捷性上高了很多。

当然，也有人认为这种方案不够好，比如 [Stop using CSS in JavaScript for web development – Gajus Kuizinas – Medium](https://medium.com/@gajus/stop-using-css-in-javascript-for-web-development-fa32fb873dcc)

而我能想到的几个缺点是：

1. JS 与 CSS 无法分离成两个文件，实际中可能会有 JS 改变但 CSS 不变的情形，这样的话，无法有效利用缓存。
2. ~~另外就是覆写样式不方便，虽然上面我夸赞了下 Styled Components 的主题定制功能，但是对于一些精细的样式改变可能就会显得不方便，比如说我有一个组件库，里面又一个 Table 组件，我可能会想改变 Table 组件下一行的边框，高度，颜色等等等等。这个时候必须暴露一些 props 出来，但显然无法照顾到方方面面。而使用传统方案只需要找到一行的那个类名就行样式覆写就好。~~ 发现 Styled Components 同样可以定义生成的类名，但我不知道通过这种方式再去写对应类名的 CSS 好不好，假如使用了 Styled Components，我肯定不想再写对应的 CSS，这样感觉有些混乱。

## 深入阅读
1. [GitHub - styled-components/polished: A lightweight toolset for writing styles in JavaScript ✨](https://github.com/styled-components/polished)
2. [GitHub - styled-components/styled-components: Visual primitives for the component age 💅](https://github.com/styled-components/styled-components)
3. [Ryan’s Random Thoughts on Inline Styles - YouTube](https://www.youtube.com/watch?v=EkPcGS4TzdQ)
4. [ColdFront16 • Glenn Maddern: The Future of Reusable CSS - YouTube](https://www.youtube.com/watch?v=XR6eM_5pAb0)
5. [如何看待《React: CSS in JS》？ · Issue #22 · hax/hax.github.com · GitHub](https://github.com/hax/hax.github.com/issues/22)
6. [Stop using CSS in JavaScript for web development – Gajus Kuizinas – Medium](https://medium.com/@gajus/stop-using-css-in-javascript-for-web-development-fa32fb873dcc)