---
title: Webpack 场景下隐性的不同模块规范混用
date: 2019-04-30 22:09:00
category: 学以致用
tags:
  - 前端
  - Webpack
---

这是之前重构项目的时候遇到的一个问题，整理一下写成文章。我们知道，Webpack 打包的 JS 文件不能混用 ES Module 与 CommonJS，但即使在文件中没有混用，也可能因为 Babel 转码的关系导致混用情况的出现而导致错误，本文就这种情况作了详细描述。

注：在本文的语境下，若不做特殊说明，Webpack 版本为 4.x，Babel 版本为 7.x。

## 问题

之前给一个老项目升级构建工具的时候，项目在运行时遇到了一个错误。

```
Uncaught TypeError: Cannot set property 'mylib' of undefined
```

很快就找到跟问题有关的文件，在项目中，有一个类似这样的模块：

```javascript
;(function(global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory()
  } else if (typeof define === 'function' && define.amd) {
    define(factory)
  } else {
    global.mylib = factory()
  }
})(this, function() {
  return '__THIS_IS_THE_MODULE'
})
```

这是一个能兼容多种不同模块规范的文件。显然，在我们的情况下，最后一个分支被执行了，并且 `this` 是 `undefined`，显然，这是不符合预期的。预期结果应该是执行 `module.exports = factory()`。

## 原因

通过查看编译时候输出的日志，可以发现出现问题的原因：

```
"export 'default' (imported as 'mylib') wa not found in './mylib'
```

由此可知，Webpack 应该是将 `mylib` 视为 ES Module 了。进一步的查看发现，这是由 Babel 转码引起的，项目的 Babel 配置使用了 `@vue/app` 这个预设，而预设中有这样的配置：

```json
{
  ...
  "useBuiltIns": "usage"
  ...
}
```

使用该选项的情况下 Babel 会按需导入 Polyfill，经过转码之后，`mylib` 模块就会变成这样：

```javascript
import 'xxx'
import 'ooo'

// mylib 的其他内容
```

如此一来，Webpack 就认为这是一个 ES Module 了。

## 其他

Babel 的配置中有一个 [caller](https://babeljs.io/docs/en/options#caller) 属性，这是用来告知 Babel 调用方能力的一个参数，比如说如果调用方支持处理 ES Module，那么 Babel 就不会把 ES Module 转换成 CommonJS 模块。因为目前 Webpack 已经原生支持 ES Module 了，因此不会让 Babel 将模块转换为 CommonJS。

## 参考

1. [javascript - webpack: import + module.exports in the same module caused error - Stack Overflow](https://stackoverflow.com/questions/42449999/webpack-import-module-exports-in-the-same-module-caused-error)
2. [Options · Babel](https://babeljs.io/docs/en/options#misc-options)
3. [ES2015 modules can access `module` and `exports` · Issue #3491 · webpack/webpack · GitHub](https://github.com/webpack/webpack/issues/3491)
