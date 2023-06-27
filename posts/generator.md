---
title: generator
date: 2016-11-24 23:10:50
category: 学习笔记
tags:
- 前端
- JavaScript
- ES6
---

Generator 是一种可以暂停的函数，通过使用 `yield` 来进行控制。



## 基本

本文通过一段代码来解释 generator 的机制。

```javascript
function *foo() {
    var a = yield 5;
    console.log(yield a);
    return a;
}

let it = foo();
it.next(); // 1
// { value: 5, done: false }
it.next(10); // 2
// { value: 10, done: false }
it.next(20); // 3
// 20
// { value: 20, done: true }
it.next(30); // 4
// { value: undefined, done: true }
```

generator 一种特殊的函数，其通过在 `function` 和函数签名之间加上一个 `*` 来定义，`*` 的位置没有要求，因此，以下任何一种方式都是合法的：

```javascript
function *foo() {
    // ...
}

function* bar() {
    // ...
}

function*baz() {
    // ...
}
```

首先通过调用 `foo()` 来生成一个迭代器。接着通过调用这个迭代器的 `next` 方法可以控制该函数的流程。

当调用第一个 `next` 的时候，会运行到第一个 `yield` 处，然后停止该函数的运行。

`yield` 关键字用来暂停函数，当函数运行到带有 `yield` 关键字的地方的时候，就会暂停该函数。当 `yield` 后面有一个值得时候，会将该值传出。

在上面一段代码的 `//1` 处，`it.next()` 返回了 `{ value: 5, done: false }`。

再看 `//2` 处的 `it.next(10)`，这次给 `next` 传了一个值，值为 `10`，这相当于将上次出现 `yield` 的地方赋值为 `10`，也就是说，`var a = yield 5;` 处变为 `var a = 10;`，因此变量 `a` 被赋值为 `10`，接着，函数继续运行，一直运行到下一个 `yield` 处，也就是 `console.log(yield a)`，当运行到这个 `yield` 的时候，函数暂停，于是 `console.log(yield a)` 最终还没有被调用。此时 `yield a` 将 `a` 值传出，所以在 `//2` 处返回的值为 `{ value: 10, done: false }`。

接着继续调用 `//3` 处的 `it.next(20)`，这次传入了 `20`，上次出现 `yield` 的代码变为 `console.log(20)`，因此控制台输出 `20`，同时，函数一直运行到 `return a` 处。此时，`//3` 处的代码返回 `{ next: 20, done: true }`。因为函数已经运行完成了，所以 `done` 变为 `true`。`done` 是用来指示迭代器是否运行完成的标志，当 `done` 为 `true` 的时候，就表明迭代器已经运行完成了。

接着继续调用 `//4` 处的 `it.next(30)`，但这次函数已经运行完成了，所以返回了 `{ next: undefined, done: true }`。

## 异常捕获

```javascript

function *foo() {
    try {
        yield;
    } catch (e) {
        console.log('内部捕获异常', e);
    }
}

let it = foo();

it.next()

try {
    it.throw('a');
    it.throw('b');
} catch(e) {
    console.log('外部捕获错误', e)
}

// 内部捕获错误 a
// 外部捕获错误 b

```

可以调用 `throw` 方法来向函数传入一个错误，如果错误没有被函数处理，则错误会被重新抛出。

来看看上面一段代码，首先运行了一遍 `it.next()`，于是函数停在了 `yield` 处，`yield` 处于一个 `try` 中，此时如果有错误抛出，则会被 `catch` 接收到，然后调用了两次 `it.throw`，分别传入 `a` 和 `b`，第一次传入的 `a` 被函数内部的 `catch` 捕获了，但第二次则是被外部的 `catch` 捕获，因为函数内部的 `catch` 已经运行过一遍了。

## 生成器委托

```javascript
function *foo() {
    yield 3;
    yield 4;
    yield 5;
}

function *bar() {
    yield 1;
    yield 2;
    yield *foo();
    yield 6;
}
```

通过前面添加 `yield *` 在一个生成器函数中调用另一个生成器函数。看看输出就可以理解流程了：

![log](https://i.loli.net/2018/11/17/5befc1ebb66bf.png)