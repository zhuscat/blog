---
title: 警惕循环依赖
date: 2021-11-17 21:34:06
category: 想法
tags:
- 前端
- JavaScript
---

循环依赖可能会导致意想不到的 BUG，特别是一开始有循环依赖的时候，BUG 不一定会显现，然后某一次代码改动可能就突然出现因循环依赖导致的问题了，所以我们要十分注意循环依赖，理解循环依赖为什么会产生问题以及如何避免。

## 案例

让我们来看几个例子：

### 例子 1

```javascript
// index.js
const { fn_foo } = require('./foo.js')

fn_foo(10)
```

```javascript
// foo.js
const { fn_bar } = require('./bar.js')

function fn_foo(count) {
  if (count === 0) {
    return
  }
  fn_bar(count)
  console.log('fn_foo')
}

exports.fn_foo =  fn_foo
```

```javascript
// bar.js
const { fn_foo } = require('./foo.js')

function fn_bar(count) {
  fn_foo(count - 1)
  console.log('fn_bar')
}

exports.fn_bar = fn_bar
```

思考一下，`node index.js` 会输出什么结果呢？

### 例子 2

刚才的例子是 `commonjs` 模块，现在让我们看看 `ES Module`，代码差不多

```javascript
// index.mjs
import { fn_foo } from './foo.mjs'
fn_foo(10)
```

```javascript
// foo.mjs
import { fn_bar } from './bar.mjs'
function fn_foo(count) {
  if (count === 0) {
    return
  }
  fn_bar(count)
  console.log('fn_foo')
}
export { fn_foo }
```

```javascript
// bar.mjs
import { fn_foo } from './foo.mjs'
function fn_bar(count) {
  fn_foo(count - 1)
  console.log('fn_bar')
}
export { fn_bar }
```

想想，在这种情况下又会输出什么呢？按照自己的知识储备思考一下，让我们再看下一个例子

### 例子 3

```javascript
// a.mjs
export let a = 10

setTimeout(() => {
  a = 20
}, 200)
```

```javascript
// index.mjs
import { a } from './a.mjs'
console.log(a)
setTimeout(() => {
  console.log(a)
}, 1000)
```

想一下这种情况下输出又是什么

### 例子 4

```javascript
// a.js
let a = 10
setTimeout(() => {
  a = 20
}, 200)

exports.a = a
```

```javascript
// index.js
const { a } = require('./a.js')
console.log(a)
setTimeout(() => {
  console.log(a)
}, 1000)
```

想一想这种情况下输出是什么，然后我们看最后一个例子

### 例子5

```javascript
// a.mjs
import { b } from './b.mjs'

export const a = b + 1
```

```javascript
// b.mjs
import { a } from './a.mjs'

const b = a + 1

export { b }
```

```javascript
// index.mjs
import { a } from './a.mjs'
console.log(a);
```

思考一下，然后公布答案，看看与你所想的是否相同

### 答案

#### 例子 1

```
bar.js:4
  fn_foo(count - 1)
  ^

TypeError: fn_foo is not a functio
```

#### 例子 2

```
fn_bar
fn_foo
fn_bar
fn_foo
fn_bar
fn_foo
fn_bar
fn_foo
fn_bar
fn_foo
fn_bar
fn_foo
fn_bar
fn_foo
fn_bar
fn_foo
fn_bar
fn_foo
fn_bar
fn_foo
```

#### 例子3

先输出 10，时隔 1s 输出 20

#### 例子 4

先输出 10，时隔 1s 输出 10

#### 例子 5

```
b.mjs:3
const b = a + 1
          ^

ReferenceError: Cannot access 'a' before initialization
```

## 如何理解

上面的模块规范涉及两种：CommonJS 和 ES Module，具体两者的区别，有大量的文章可供阅读（如[聊聊什么是CommonJs和Es Module及它们的区别](https://juejin.cn/post/6938581764432461854)，这里说一下重点：

对于 CommonJS，你可以理解每个模块是在这样一个环境中执行的：

```javascript
(function require(moudle, exports) {
  // 执行代码的时候包起来
  // exports = module.exports
  // require 的时候实际拿的就是 module.exports 的值
})(moudle, exports)
```

对于 ES Module，导入的时候你拿到的实际上是对应变量的一个引用

另外需要注意的是，两种模块规范重复导入模块的时候，模块都只会执行一遍（PS：当然 CommonJS 有办法清除模块缓存，这就另说了）

让我们具体看一下上面例子

### 例子 1

我们按照导入顺序去分析代码运行即可：

`index.js` 中导入 `foo.js`，`foo.js` 导入 `bar.js`，`bar.js` 又导入 `foo.js`，因为之前 `index.js` 已经 `require` 过 `foo.js` 了，模块缓存中已经有 `foo.js` 了，会直接返回该模块的 `module.export`，而此时 `foo.js` 的 `module.exports` 还是 `{}`（后面 `exports.fn_foo` 还没有执行），因此 `fn_foo` 是 `undefined`，因此 fn_bar 中的 `fn_foo` 是 `undefined`，到这里相信你就知道输出结果的原因了。

### 例子 2

前面说过，ES Module 实际上引入的是一个引用，让我们看代码，`bar.mjs` 导入了 `foo.mjs`，此时的 `fn_foo` 我们可以理解为一个引用，因此，当 `fn_foo(10)` 的时候，两个模块中的 `fn_bar` 和 `fn_foo` 都有正确的值

### 例子 3

还是之前说的，ES Module 引入的变量可以理解为一个引用，因此前后两次打印，`a` 的值会发生变化

### 例子 4

与例子 3 相似的例子，对于 CommonJS 来说，`exports.a = a` 就是值拷贝，`exports.a` 与 `a` 变量就没有关系了

### 例子 5

`b.mjs` 引入了 `a`，注意这可以理解为一个引用，然后直接对 `a` 进行了 `+1` 操作，此时，`a` 还没有初始化，因此报错

## 注意一件事

如果你完全理解上面几个例子，相信循环依赖的事情已经难不倒你了，相信你也理解两种常用的模块规范之间的区别了，但是要注意的一点是，我们的代码通常会经过转码、打包，当前时间节点，一般还是打包会把代码各个模块转换为 CommonJS 规范的模块，因此最终行为与 ES Module 还是有不一致的，比如对于例子 5 来说，经过转码的结果是这样的：

```javascript
// index.js
"use strict";

var _a = require("./a.js");

console.log(_a.a);
```

```javascript
// a.js
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.a = void 0;

var _b = require("./b.js");

const a = _b.b + 1;
exports.a = a;
```

```javascript
// b.js
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.b = void 0;

var _a = require("./a.js");

const b = _a.a + 1;
exports.b = b;
```

最终结果就不是报错，而是 `NaN` 了。

## 真实应用的案例

最近在改代码的时候，发现一个循环依赖的问题，不过问题没有暴露出来，原因是 `moduleConfig/loadConfigs` 恰巧执行的代码链路会走一个异步的流程，那个时候模块就构建完成了，但如果后续代码逻辑更改然后走同步流程了呢，那个时候就出BUG了。

大概几个重要文件分布是这样的：

```javascript
// modules/apis/flyio/index.js
// flyio 依赖了 api-sign
import { sign } from '@/modules/utils/api-sign'
//...
export { rpConfig }
```

```javascript
// modules/utils/api-sign.js
// ！！！api-sign 依赖了 store
import store from './store.js'
```

```javascript
// main.js
// 入口文件
import App from './App.vue'
import store from './store.js'
```

```javascript
// 在 ./App.vue 中
// ！！！@/modules/apis/echobox 依赖链路中有 flyio、api-sign
import ApiEchobox from '@/modules/apis/echobox'
```

```javascript
// store.js
import registerStoreModules from '@/modules/installers/register-store-modules'

const store = createStore()
registerStoreModules(store)

export default store
```

```javascript
// @/modules/installers/register-store-modules
// ！！！依赖链路中有 flyio
export default (store, { useModules = [], ...requiredModuleOptions }) => {
  store.dispatch('moduleConfig/loadConfigs', ['default'])
}
```

让我们看一下依赖情况，require 表示前面的文件依赖后面的文件

```
main.js require App.vue
App.vue require modules/apis/echobox.js
modules/apis/echobox.js require modules/apis/flyio.js
modules/apis/flyio.js require modules/utils/api-sign.js
modules/utils/api-sign.js require store/index.js <- store/index ！！！第一次导入是由 api-sign.js 导入的
store/index.js require modules/installers/register-store-modules.js
modules/installer/register-store-modules.js require modules/stores/config.js
modules/stores/config.js require modules/apis/config.js
modules/apis/config.js require modules/apis/flyio.js <- flyio在前面由 echobox 已经加载过了，不过 exports 还没构建完成，不过会直接返回模块，此时 exports = {}
...
...
然后在 register-store-modules里执行了 moduleConfig 的 loadConfigs，也就是执行了 config.js 中的方法，但是此时 flyio.js exports 还是 {}，由此报错
```

这里 `api-sign` 模块作为 API 层的一个模块，不应该依赖 `store` 模块。

## 如何避免

实践上，良好的架构设计。

工具上，可以利用一些辅助工具，如 [circular-dependency-plugin](https://github.com/aackerman/circular-dependency-plugin)

## 为什么写这篇文章

工作这几年，已经好几次遇到代码库中因循环依赖导致的问题了，而且循环依赖问题不是当代码库中已经出现循环依赖的代码的时候就会立刻暴露出来的，而当暴露出来的时候，每次 debug 又会花不少的时间，因此总结一下。

有时候，出现循环依赖是合理的，有时候，出现循环依赖则可能是代码结构设计有问题，需要对出现循环依赖的模块进行重新划分。特别是要注意的是，如果一个模块除了导出的函数、变量...之外，会立即执行很多逻辑，且其中又用到了其他模块的功能，且又有循环依赖的时候，就要很小心了。
