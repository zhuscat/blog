---
title: Rollup 小记
date: 2017-07-09 09:47:14
category: 学习笔记
tags:
- 前端
- 打包
---

Rollup 是一个模块打包工具，其利用了 ES6 模块的特性，只将需要的代码进行打包，通过这种方式可以大大减小打包的体积（不用打包整个），官方称这个特性为 Tree Shaking。另外，Webpack 2 也支持了 Tree Shaking，因此 Tree Shaking 已经不能作为 Rollup 的一个优势了，不过，Rollup 的配置相较于 Webpack 更加简单明了，这算是 Rollup 的一个优势。不过，Rollup 的功能也没有 Webpack 多，比如说 Rollup 不支持 Code Splitting，各种静态资源的处理。总的来说，Rollup 更适合库的打包，比如说 React，Vue 这类库。而 Webpack 则更适合用于 Web App。

## 配置
可以在 CLI 中给 Rollup 传参数，也可以写到配置文件里面，如果配置文件里写了，CLI 又传了相关的参数，则 CLI 的参数会覆盖掉配置文件里的。

```js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'src/main.js',
  format: 'cjs',
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  dest: 'dist/bundle.js',
  sourceMap: true,
};
```

以上是一个简单的配置文件，其指定了入口文件(entry)，打包成 `commonjs` 形式的模块，使用到了几个插件，指定了打包地址为(dest)，开启了 sourceMap 功能。需要注意的是，Rollup 的配置文件是一个 JS 文件，虽然其用到了 ES6 的模块功能，但是除此之外，其并不会对代码进行转换，简单来说就是你在里面写了你 Node 版本不支持的特性代码的话是会出错的。另外，Rollup 默认是只认 ES6 模块的，所以需要借助插件来帮助你引入其他形式的模块。

## Tree Shaking
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

```js
// main.js
import { cube } from './maths.js';
console.log( cube( 5 ) ); // 125
```

假设 `main.js` 为入口文件，打包成 es6 模块，最终结果是这样的：

```js
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

看，`square` 函数没有被打包进来，这就是 Tree Shaking 的能力。

Tree Shaking 与 Dead Code Elimination 的区别是，Dead Code Elimination 是先打包出了一个具有冗余代码的模块，然后检测 Dead Code，再删除相关代码。而 Tree Shaking 从一开始就没有将这些代码打包进来。

## 参考资料

1. [rollup.js](https://rollupjs.org/)
2. [Tree Shaking](https://webpack.js.org/guides/tree-shaking/)
3. [Webpack 2 Tree Shaking Configuration – Modus Create: Front End Development – Medium](https://medium.com/modus-create-front-end-development/webpack-2-tree-shaking-configuration-9f1de90f3233)

