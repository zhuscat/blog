---
title: JavaScript 小技巧
date: 2016-09-13 23:46:43
category: 学以致用
tags:
- 前端
- JavaScript

---

这篇文章记录一些 JavaScript 可能可以用到的小技巧，持续更新。

## 取整（适用于非负数）

```javascript
(number1 / number2) >> 0
```

## 转换为布尔值

使用两个逻辑非

```javascript
!!(foo)
```

## 转换为字符串

```javascript
let str = 123 + "";
// "123"
```

## 理解 const

```javascript
const obj = {}
obj.a = 1
obj.b = 2
// obj = {a: 1, b: 2}
```

## 拷贝数组

```javascript
const copyArray = [1, 2, 3, 4].concat();
```