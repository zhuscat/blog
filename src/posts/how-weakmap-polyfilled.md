---
title: WeakMap 如何被 Polyfill
date: 2022-11-10 11:30:00
category: 技术
tags:
  - JavaScript
---

在很多场景中，我们需要给一个对象关联一些元信息或者其他类型的各种信息

WeakMap 可以用来做这样的事情。比如，以一个错误上报功能为例，我期望在任意的业务流程中，给一个错误添加一个元信息，使得当顶层捕获到这个错误的时候，如果发现有这个元信息，就不上报该错误

```js
const errorMeta = new WeakMap()
// ...
// 某处代码
errorMeta.set(err, {
  ignore: true
})

// ...
// 上报处逻辑
if (errorMeta.get(err)?.ignore) {
  // 不上报
} else {

}
```

使用 WeakMap 的好处是，WeakMap 不会影响其 key 被垃圾回收，如果在上面的例子中使用 Map 的话，只要 Map 实例还在某处被引用着，Error 对象就不会被垃圾回收

进入正题，我突然想到的是，WeakMap 要如何被 Polyfill？原生支持 WeakMap 的 JS 引擎，应该存在一种机制实现 WeakMap。比如一个实现方式是，当某个对象被垃圾回收的时候，能够触发通知，这样就可以删除 WeakMap 中对应对象的建值

但比如在只支持 ES5 的运行时中呢？看了几个方案，看起来唯一的方式就是在 key 中设置一个⌈不可见⌋的属性，确实，这种方式就不会影响 key 被垃圾回收了

```js
MyWeakMap.prototype.set = function (key, value) {
  Object.defineProperty(key, this.WEAK_MAP_UUID, {
    value
  })
}
```

这也以为这 WeakMap 不能被完美的 Polyfill，比如，如果一个对象不是可扩展的，就不能正常使用了

```js
Object.freeze(o)

Object.defineProperty(o, 'foo', {
  value: 'bar'
})

// Uncaught TypeError: Cannot define property id, object is not extensible
//     at Function.defineProperty (<anonymous>)
```

另外，确确实实修改了原本的对象，虽然在一般情况下，这个新增加的属性不会有什么影响

题外话，ES2021 提供一个 `FinalizationRegistry` 类，能够让你注册回调，当一个对象被垃圾回收之后，触发回调：

```js
// 创建一个 registry，当关心的对象被垃圾回收后，会调用这个回调（第一个参数）
const registry = new FinalizationRegistry((heldValue) => {
  // ...
});

// 注册一个对象，当该对象被垃圾回收，会触发回调，第二个参数（heldValue），会作为回调函数的第一个参数，第三个参数用来在后续接触注册
registry.register(theObject, "some value", theObject);
// ...

// 接触注册
registry.unregister(theObject);
```

参考：

1. https://github.com/zloirock/core-js/blob/fc44490deb9abeb426163c31bd2772cfa30c7943/packages/core-js/internals/collection-weak.js#L118
2. https://v8.dev/features/weak-references
3. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry