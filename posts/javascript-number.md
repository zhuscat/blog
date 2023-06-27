---
title: 说说 JavaScript 中的数字
date: 2019-04-20 23:01:16
category: 学以致用
tags:
  - JavaScript
---

JavaScript 中的数字（`number` 类型）占据 64 位，为 IEEE 754 规范的双精度浮点数，其二进制的表示形式如下：

![618px-IEEE_754_Double_Floating_Point_Format.svg.png](https://i.loli.net/2019/04/20/5cbb351228bca.png)

## 规约形式的浮点数(normal number)

数值大小公式为：

```
((-1) ** sign) * 1.fraction * (2 ** (exponent - 1023))
```

其中，exponent 的取值为 1 到 2046

## 非规约形式的浮点数(subnormal number)

当 exponent 为 0 时，数字大小的公式为：

```
((-1) ** sign) * 0.fraction * 2 ** -1022
```

可以看到，非规约形式的浮点数弥补了 0 与 1 之间的取值，而规约形式的浮点数因为有前导 1，最小正数为 `1 * (2 ** -1022)`。

## 特殊值

### 0

当 exponent 为 0，且 fraction 为 0 的时候，数值为 0，可见，0 分为 +0 和 -0

### Infinity

当 exponent 为 2047 且 fraction 为 0 的时候，值的意义为无穷，可见，根据符号位不同，可分为 `+Infinity` 和 `-Infinity`

### NaN

当 exponent 位 2047 且 fraction 不为 0 的时候

## 关于整数

因为整数也是用双精度浮点数存储，因此能正常表示精度的整数范围为：

```
(-2 ** 53 + 1) ~ (2 ** 53 -1)
```

推算也很简单，当 fraction 全部用上的时候，为 52 位，再加上前导 1 的一位。

## 查看数字的二进制表示

写了个简单的函数可以返回数字的二进制表示以及 sign、exponent 以及 fraction 部分：

```javascript
function getNumberBits(n) {
  const f64a = new Float64Array([n])
  const v = new DataView(f64a.buffer)
  let b = ''
  for (let i = 7; i >= 0; i--) {
    b += v
      .getUint8(i)
      .toString(2)
      .padStart(8, '0')
  }
  return {
    bits: b,
    sign: b[0],
    exponent: b.slice(1, 1 + 11),
    fraction: b.slice(1 + 11),
  }
}
```

## 未来

[BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 是一个新增的基本类型（Primitive），目前已经进入 Stage 3，有了 BigInt，我们就可以精确的表达更大的整数了。
