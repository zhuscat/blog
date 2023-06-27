---
title: Loose Equal
date: 2016-11-18 21:36:49
category: 学习笔记
tags:
- 前端
- JavaScript
---
![loose equal](https://i.loli.net/2018/11/17/5befc21baae1b.jpg)

`==` 在 `JavaScript` 中与其他许多语言有着不同的行为，在 `JavaScript` 中，`==` 在比较双方的类型不同的时候进行强制类型转换，正因为这点，`==` 运算符遭到了很多人的诟病，但是，`==` 也有着自己的优势，比如适当的时候可以让代码更加简洁，`==` 的转换规则并不难，本文总结了其转换规则供大家参考。

### 特殊情况

`NaN` 不等于 `NaN`

`+0` 等于 `-0`

### 字符串与数字的比较

将字符串转换为数字然后进行比较

### 其他类型与布尔类型之间的比较

将布尔类型转换为数字，然后再进行比较

`false` 转为 `0`

`true` 转换为 `1`

### null 和 undefined 之间的比较

`null == undefined` 为 `true`

### 对象和非对象之间的比较

对对象做 `ToPrimitive` 操作，然后再比较

### 实例运用

```javascript
[] == ![] // true
```

`![]` 将 `[]` 转换为布尔值，值为 `false`，所以上式变为

```javascript
[] == false
```

`[]` 是对象，对其做 `ToPrimitive` 操作，转换为 `''`，所以上式变为

```javascript
'' == false
```

`false` 转换为数字 `0`，上式变为

```javascript
'' == 0
```

`''` 转换为数字，转换为`0`，所以上式变为

```javascript
0 == 0
```

结果为 `true`