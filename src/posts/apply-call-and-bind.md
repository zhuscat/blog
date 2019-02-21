---
title: apply, call 与 bind
date: 2016-08-25 15:45:29
category: 学习笔记
tags:
- 学习笔记
- 前端
- JavaScript
---

这三个函数都与改变函数执行时的上下文有关。其又分为两类：

1. `Function.prototype.apply` 与 `Function.prototype.call` 为一类。它们会立即调用函数。
2. `Function.prototype.bind`  为一类，其会返回一个绑定了作用域的函数而不立即被调用。

## Function.prototype.apply

```javascript
fun.apply(thisArg, [argsArray])
```

`apply` 接收两个参数第一个是要绑定给 `this` 的值，第二个是参数数组（array-like object）。

作用：

1. 绑定作用域
2. 方便一些函数的调用（诸如 `Math.max`)

绑定作用域相信就不用详细说明了，简单的说就是指定函数内部 `this` 的指向。

这里举一个方便函数调用的例子，大家知道，`Math.max` 接收一系列数字作为参数，但是不接收数组，使用 `apply` 就可以做到传递数组了：

```javascript
let maxNumber = Math.max.apply(null, [2, 4, 6, 8, 10]) // output: 10
```

不过，在 ES2015 中这应该不是问题了，因为可以使用扩展运算符（`...`

）

```javascript
let maxNumber = Math.max(...[2, 4, 6, 8, 10]) // output: 10
```



## Function.prototype.call

```javascript
fun.call(thisArg[, arg1[, arg2[, ...]]])
```

`call` 的作用与 `apply` 完全相同，只是使用方法有所不同，需要将参数一个一个传入。另外由于 ES2015 中的扩展运算符，似乎 `call` 和 `apply` 在在任何场景都可以互相替换了。个人认为使用哪一个函数看个人习惯了。



## Function.prototype.bind

```javascript
fun.bind(thisArg[, arg1[, arg2[, ...]]])
```

`bind` 与前两个函数不同之处在于，前两个函数会立即执行，而 `bind` 做的仅仅是绑定作用域，然后供之后调用。

关于 `bind` 还有一点值得说明的是，当一个函数调用 `bind` 绑定 `thisArg` 之后，企图再去调用 `bind` 去绑定另一个上下文，或者去调用 `apply` 或者 `call` 来改变上下文是没有用的。

来看一下 `bind` 的简单实现（粗略实现，实际实现内容更多）

```javascript
Function.prototype.bind = function(ctx, ...formerArgs) {
  let _this = this;
  return (...laterArgs) => {
    return _this.apply(ctx, formerArgs.concat(laterArgs));
  }
}
```

当第一次调用 `bind` 之后就形成了一个闭包，再改变上下文也不会改变最后执行的结果。

## 更新记录
1. 2016 年 10 月 18 日增加 `bind` 的描述。