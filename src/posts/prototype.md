---
title: 关于原型
date: 2016-10-20 15:16:18
category: 学习笔记
tags:
- 前端
- JavaScript

---

JavaScript 是目前唯一广泛使用的基于原型的语言，然而，JavaScript 中掺杂了许多类的语法元素，比如 `new` ，`instanceof`，`class`，这些东西掩盖了 JavaScript 的本质。实际上，JavaScript 中没有类，本文梳理了 `[[Prototype]]` ，`[[Get]]` 和 `[[Put]]`，理解它们，会对 JavaScript 有更深刻的理解。

### 没有类

JavaScript 中并没有类，先看一段代码：

```javascript
function Foo() {
  console.log('Foo');
}

var foo = new Foo();
```

你可能会认为 `Foo` 是一个类，实际上并不是。

`new Foo()` 只是会将新创建的对象的 `[[Prototype]]` 关联到 `Foo.prototype` 上去。这与真正类是不同的，类可以被复制（实例化）多次，而在 JavaScript 中，并没有出现复制，而是用 `[[Prototype]]` 进行关联。

### [[Prototype]]

JavaScript 中的对象有一个特殊的内置属性 —— `[[Prototype]]`，其实就是对于其他对象的引用。

这里给出一个例子

```javascript
function Foo() {
  console.log('Foo');
}

var foo = new Foo();
```

一个函数存在一个 `prototype` 属性，如上面就是 `Foo.prototype` 。

当调用 `new Foo()` 的时候，会将新产生的对象的 `[[Prototype]]` 指向 `Foo.prototype`。

### [[Get]]

当你看到语句

```javascript
obj.a
```

的时候，不要以为这条语句仅仅是简单地在 `obj` 对象中寻找属性名为 `a` 的属性，`obj.a` 实际上进行了一个 `[[Get]]` 操作，`[[Get]]` 操作是一个内置的操作。其行为是查找对象中是否有名称相同属性，如果有，则返回，如果没有，就到对象的 `[[Prototype]]` 链指向的对象中去寻找，如果有，则返回，如果没有，则继续该操作，直到寻找到最后的原型（`Object.prototype`）还没有找到的话，就返回 `undefined`。

### [[Put]]

`[[Get]]` 是用来获取值，`[[Put]]` 则是用来修改值

当你看到语句

```javascript
obj.a = 1
```

的时候，实际上会就行一个 `[[Put]]` 操作。

`[[Put]]` 的行为如下：

如果对象存在你要进行操作的属性，则会进行如下操作：

1. 对象属性是否存在访问描述符？存在且存在 `setter` 则调用 `setter`
2. 否则看属性数据描述符当中的 `writable` 是否为 `false`，是的话在非严格模式下静默失败，在严格模式下抛出 `TypeError` 异常
3. 否则设置属性为指定的值

如果属性不存在在对象当中，则会进行如下操作：

1. 如果在 `[[Prototype]]` 链上层存在对应的属性并且其属性数据描述符 `writable` 不为 `false`，则会在原对象上添加一个指定属性名的属性。
2. 如果在 `[[Prototype]]` 链上层存在对应属性并且属性数据描述符 `writable` 为 `false`，若运行在非严格模式下，则会静默失败，在严格模式下抛出异常。
3. 如果在 `[[Prototype]]` 链上层存在对应属性的 `setter`，则调用这个 `setter`。

### constructor 属性

```javascript
function Foo() {
  console.log('Foo');
}

var foo = new Foo();

foo.constructor // Foo
```

可以看到，`foo.constructor` 为 `Foo`，但其实这并不能说明 `Foo` 就是 `foo` 的构造函数。

比如我们这样改一改：

```javascript
function Foo() {
  console.log('Foo');
}

Foo.prototype = {};

var foo = new Foo();

foo.constructor // Object
```

如此一来， `foo.constructor` 就变成了 `Object`，实际上应该还是 `Foo`呀。

其实，`foo` 实例本身并没有一个 `constructor` 属性，`constructor` 属性在 `foo.__proto__` 上面。由于 `foo` 没有 `constructor` 属性，因此在其 `[[Prototype]]` 关联的对象上面找属性。

因此，不要寄希望于使用 `constructor` 来确定是谁创造了这个对象。

### Function 与 Object

最后来梳理一下 `Function` 和 `Object`。

`Function` 和 `Object` 都是函数。

`Function` 和 `Object` 的 `[[Prototype]]` 均指向 `Function.prototype`。

`Function.prototype` 是一个对象，`Function.prototype` 的 `[[Prototype]]` 指向 `Object.prototype`。

### 参考资料

1. 《你不知道的 JavaScript(上卷)》


