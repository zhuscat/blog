---
title: 变量提升
date: 2016-10-19 09:53:22
categories: 学习笔记
tags:
- 前端
- JavaScript
---
早上看了一下 《你不知道的 JavaScript（上卷）》的第一章，其实很多内容是已经知道的，不过作者从另一个层面讲述了关于作用域的知识。作者从 JavaScript 引擎的编译开始说起，让我对这方面的知识有了更加深入地了解。今天来写一下变量提升，虽然之前已经知道变量提升了，不过没有了解到书中说得那么细致，所以做一下这方面的笔记。

JavaScript 引擎会在解释代码之前先对代码进行编译。其中一个步骤就是找到所有声明，并用合适的作用域将他们关联起来。

如

```javascript
var a = 1;
```

JavaScript 会把其看成如下的两个声明

```javascript
// 编译阶段
var a;
// 执行阶段
a = 1;
```

看几个例子：

一、

代码：

```javascript
console.log(a); // output: undefined
var a = 2;
```

实际流程：

```javascript
var a;
console.log(a);
a = 2;
```

二、

代码：

```javascript
foo();

function foo() {
  console.log(a); // output: undefined
  var a = 2;
}
```

实际流程：

```javascript
function foo() {
  var a;
  console.log(a);
  a = 2;
}
foo();
```

需要注意的是，函数声明先于变量声明进行变量提升，重复声明会被忽略（如下面的 `var foo;`)，不过，重复出现的函数声明，后面的会覆盖前面的。

代码：

```javascript
foo()

var foo;

function foo() {
  console.log('foo');
}

function foo() {
  console.log('foo2')
}

// output: foo2
```

实际执行流程：

```javascript
function foo() {
  console.log('foo2');
}

foo();
```

变量提升的存在告诉我们需要注意声明的位置，即使你将声明放到你写的代码的下方，也会提升上去。

另外，ES6 中新的关键词 `let` 和 `const` 不存在变量提升。