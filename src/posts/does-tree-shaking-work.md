---
title: Tree Shaking 真的有效吗
date: 2017-07-14 23:40:17
category: 学习笔记
tags:
- 前端
- webpack
- rollup
---

其实 Tree Shaking 出来已经挺久了，不过我还是最近才了解的。

Tree Shaking 是一个在 Rollup 中提出的概念，之后在 webpack 2 中也得到了实现。其作用是，比如说我依赖于某个模块的一部分，使用 Tree Shaking 可以只引入我依赖的那部分，其他部分可以去掉。

这听起来十分美好，然而，Tree Shaking 真的有想象中的那么好吗？

先拿 Rollup 一个官方例子：

```js
// main.js
import { cube } from './maths.js';
console.log( cube( 5 ) ); // 125
```

```js
// maths.js
// This function isn't used anywhere, so
// Rollup excludes it from the bundle...
export function square ( x ) {
	return x * x;
}

// This function gets included
export function cube ( x ) {
	// rewrite this as `square( x ) * x`
	// and see what happens!
	return x * x * x;
}
```

最终可以打包出：

```js
'use strict';

// This function isn't used anywhere, so
// Rollup excludes it from the bundle...


// This function gets included
function cube ( x ) {
	// rewrite this as `square( x ) * x`
	// and see what happens!
	return x * x * x;
}

console.log( cube( 5 ) ); // 125
```

看，`square` 函数没有被打包进来。

然而，想要使其失效也很简单，我在 `maths.js` 模块中再加一句

```js
decorate(square)
```

先不管 `decorate` 函数是怎么实现的，最终打包出来的结果如下：

```js
'use strict';

// This function isn't used anywhere, so
// Rollup excludes it from the bundle...
function square ( x ) {
	return x * x;
}

// This function gets included
function cube ( x ) {
	// rewrite this as `square( x ) * x`
	// and see what happens!
	return x * x * x;
}

decorate(square);

console.log( cube( 5 ) ); // 125
```

好了，`square` 已经被完整打包进来了。为什么？如果 `decorate` 只是对 `square` 函数进行一些改变还好，但如果 `decorate` 函数做了其他事情呢？

比如这样：

```js
function decorate () {
	Array.prototype.count = function () { return this.length }
}
```

假如不打包 `square`，后续代码如果用到了 `Array.prototype.count` 该怎么办？

因此，Rollup 只能讲 `square` 打包进来，将这个例子放到 `webpack` 里面讲也同样适用。

所以，Tree Shaking 并没有想象中的那么有效。

Tree Shaking 需要模块是 ES6 模块，现在很多第三方模块都是 CommonJS 模块，对这些模块，无法使用 Tree Shaking 对其进行无用代码的删除。

就算第三方模块提供了 ES6 模块的支持，因为上面说到的原因，Tree Shaking 也不一定能发挥作用，拿 Ant Design 举例，其包下面有一个 es 文件夹，这就是 ES6 模块，并且我们可以看到 `antd` 包的 `package.json` 文件已经配置了 `module` 字段，因此，`wepack 2` 及以上可以感知其拥有 ES6 模块，从而在引入的时候会从 es 文件夹中引入。然而，当我们写下

```js
import { Button } from 'antd'
```

并进行打包后，我们会发现整个 `antd` 已经被打包进去了，随便看一个模块，会发现 `antd` 的各个组件模块也是有副作用的，就比如一些组件使用了类似下面的代码对组件进行功能上的增强：

```js
decorate(Component)
```

最终我们还是需要使用 Babel Plugin 的方式对其进行按需加载。

最后的总结就是，Tree Shaking 对一些纯函数的库应该会有不错的价值，但是 Tree Shaking 并没有想象中的有效，对于很多项目，其并不能发挥出其效果，不过，有总比没有好吧。



## 参考资料

1. [webpack2 的 tree-shaking 好用吗？ - 腾讯Web前端 IMWeb 团队社区 | blog | 团队博客](http://imweb.io/topic/58666d57b3ce6d8e3f9f99b0)
2. [译 为什么 Webpack 2 的 Tree Shaking 并非像你想的那么高效？ - 开发者头条](https://toutiao.io/posts/cu9vfs/preview)
3. [Tree shaking completely broken? · Issue #2867 · webpack/webpack · GitHub](https://github.com/webpack/webpack/issues/2867)
4. [阿里巴巴国际UED团队 » 今天，你升级Webpack2了吗？](http://www.aliued.com/?p=4060)