---
title: linear-gradient 的方向参数
date: 2016-08-01 17:21:04
category: 学以致用
tags:
- 前端
- CSS
---

大家知道，`linear-gradient` 有一个方向参数，比如下面这样：

```
background: linear-gradient(90deg, #fb3 20%, #58a 80%)
```

那么这个角度是什么意思呢，简单地理解，这个角度指明了渐变的方向。

这个参数的默认值是 `180deg`。此时渐变方向为从上到下渐变，即 #fb3 （类似黄色）渐变到 #58a(类似蓝色）。

![渐变效果图](https://i.loli.net/2018/11/17/5befc2143879d.png)

这个参数也可以这么写：

1. to top
2. to right
3. to left
4. to bottom

分别表示渐变从下到上，从左到右，从右到左和从上到下。

那么当用角度的时候，渐变方向是怎么回事呢，用下图就能轻松地记住了。

![渐变解释图](https://i.loli.net/2018/11/17/5befc215dcadb.png)

如图所示，该情况为角度为 `0deg` 的时候情况，箭头为渐变的方向，即从下到上渐变。

我们以白色的线条为基准，~~逆时针~~顺时针旋转角度增加，怎么样，是不是就能知道渐变的方向了呢。

比如 `45deg` 就是~~逆时针~~顺时针旋转 45 度，效果如下图：

![渐变例子](https://i.loli.net/2018/11/17/5befc215713ce.png)

好了，相信你已经知道这个参数的作用与含义了。