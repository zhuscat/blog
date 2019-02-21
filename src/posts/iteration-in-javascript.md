---
title: JavaScript 中的遍历
date: 2016-09-06 22:23:14
category: 学习笔记
tags:
- 前端
- JavaScript
---

`JavaScript` 中的遍历方法可谓是种类繁多，这篇文章总结了 `JavaScript` 中对对象，对数组的各种遍历方法。

## 遍历对象

### for…in

`for…in` 遍历自身的属性和其继承的可枚举的属性

### Object.keys()

```javascript
Object.keys(obj)
```

遍历自身的可枚举属性

### Object.getOwnPropertyNames()

```javascript
Object.getOwnPropertyNames(obj)
```

遍历自身的属性（不包括Symbol）

### Object.getOwnPropertySymbols()

```javascript
Object.getOwnPropertySymbols(obj)
```

遍历自身的 Symbol

### Reflect.ownKeys()

```javascript
Reflect.ownKeys(obj)
```

返回自身的所有属性（包括不可枚举的和 `Symbol` )

## 遍历数组

数组实际上就是特殊的对象，可以使用对象遍历的任意一个方法，另外，数组还拥有其他遍历的方法

### 传统的 for 循环

```javascript
for (let i = 0; i < array.length; i++) {
  // ...
}
```

## 使用 map, forEach, filter

```javascript
[1, 2, 3].map(value => {
  // ...
})
```

### for..of

```javascript
for (let value of [1, 2, 3]) {
  // ...
}
```
