---
title: export default <name> 和 export { <name> as default } 的区别
date: 2019-08-29 10:15:16
category: 学以致用
tags:
- JavaScript
---

昨天组里面讨论了一些 JS 模块相关的问题。其中说到了 ES Module 导出的是对应变量的「引用」，或者说是对应变量的一个绑定。然后被问到：`export default` 也是这样吗？

我以为 `export default name` 和 `export { name }` 的行为是一样的，在 `import` 一个模块中的变量实际上是这些变量的一个绑定，在访问变量时取到的就是当时模块中变量对应的值。

如下 `export { name }` 的形式，在 `index.js` 中，在调用了 `changeName` 之后，`index.js` 中的 `name` 就从 `"John"` 变成 `"Arya"` 了，这没有什么疑问。

```javascript
// foo.js
let name = 'John'
export function changeName(_name) {
  name = _name
}
export { name }
```

```javascript
// index.js
import { name, changeName } from './foo.js'
console.log(name) // "John"
changeName('Arya')
console.log(name) // "Arya"
```

但是下面的代码就跟我原来以为的不一样了，看起来，`export default name` 导出的是值的一个浅拷贝，`index.js` 中的 `name` 值不会变。

```javascript
// foo.js
let name = 'John'
export function changeName(_name) {
  name = _name
}
export default name
```

```javascript
// index.js
import name, { changeName } from './foo.js'
console.log(name) // 我以为是 "John"，实际是 "John"
changeName('Arya')
console.log(name) // 我以为是 "Arya"，实际是 "John"
```

不过，导出默认值还有另一个写法，也就是：

```javascript
// foo.js
let name = 'John'
export function changeName(_name) {
  name = _name
}
export { name as default }
```

如果这样一来，那么在 `index.js` 中，`name` 的值又会变了。

总结一下，如果是 `export default <name>` 的话，导出的就是对应值的一个浅拷贝了，而 `export { <name> as default }` 就还是对变量的一个绑定。以上行为是在 Chrome 中使用原生 ES Module 进行测试的。不过，这个区别在实际开发中倒是没什么用，在平时编写模块的时候，应该避免使用这种行为。另外，有兴趣的话也可以看看 Babel 是如何转码 ES Module 的。
