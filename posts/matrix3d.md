---
title: matrix3d
date: 2016-12-07 23:37:14
category: 学习笔记
tags:
- CSS
- JavaScript
- 学习笔记
- transform
---
今天看到一篇文章, [和transformjs一起摇摆](http://www.alloyteam.com/2016/12/and-transformjs-rock/), 顺便去看了一下源码, 源码不是很多,一百八十多行, 于是仔细阅读了一下, 变形的实现是通过 CSS 的 transform 属性完成的. 一个关键的方法是 `watch`, 代码如下:

```javascript
function watch(target, prop, callback) {
    Object.defineProperty(target, prop, {
        get: function () {
            return this["_" + prop];
        },
        set: function (value) {
            if (value !== this["_" + prop]) {
                this["_" + prop] = value;
                callback();
            }

        }
    });
}
```

最终这个函数会 "`watch`" 如 `translateX`, `scaleX` 这些 transform 的值, 而 `callback` 则是一个修改 CSS 的 transform 的函数.

```javascript
function () {
  var mtx = element.matrix3D.identity().appendTransform(element.translateX, element.translateY, element.translateZ, element.scaleX, element.scaleY, element.scaleZ, element.rotateX, element.rotateY, element.rotateZ, element.skewX, element.skewY, element.originX, element.originY, element.originZ);
  element.style.transform = element.style.msTransform = element.style.OTransform = element.style.MozTransform = element.style.webkitTransform = (notPerspective ? "" : "perspective(" + (element.perspective === undefined ? 500 : element.perspective) + "px) ") + "matrix3d(" + Array.prototype.slice.call(mtx.elements).join(",") + ")";
});
```

代码十分清晰, 详情可以点击[这里](https://github.com/AlloyTeam/AlloyTouch/blob/master/transformjs/transform.js)阅读.

这篇文章主要也不是分析源码, 而是 `matrix3d`, 这个小工具就是通过设置 `matrix3d` 实现的, 之前对 `matrix3d` 并没有多少了解, 趁此学习一下.



## 语法

```
transform: matrix3d(a1,  b1,  c1,  d1,  a2,  b2,  c2,  d2,  a3,  b3,  c3,  d3,  a4,  b4,  c4,  d4);
```

## 意义

CSS 所代表的矩阵如下所示:

```
$$
\begin{bmatrix}
   a1 & a2 & a3 & a4 \\\
   b1 & b2 & b3 & b4 \\\
   c1 & c2 & c3 & c4 \\\
   d1 & d2 & d3 & d4
 \end{bmatrix}
$$
```

一般来说,  d1,  d2,  d3,  d4 的取值分别为 0,  0,  0,  1.

这个矩阵会和原来元素的 x, y, z 进行矩阵乘法, 从而得到新的坐标, 实现了变换

```
$$
\begin{bmatrix}
   a_1 & a_2 & a_3 & a_4 \\\
   b_1 & b_2 & b_3 & b_4 \\\
   c_1 & c_2 & c_3 & c_4 \\\
   0 & 0 & 0 & 1
 \end{bmatrix}
 \cdot
 \begin{bmatrix}
   x \\\
   y \\\
   z \\\
   1
 \end{bmatrix}
 =
 \begin{bmatrix}
     a_1x + a_2y + a_3z + a_4 \\\
     b_1x + b_2y + b_3z + b_4 \\\
     c_1x + c_2y + c_3 z + c_4 \\\
     0 + 0 + 0 + 1
 \end{bmatrix}
$$
```

这就是 `matrix3d` 做的事情了.

而 `rotateX`,  `rotateY`,  `scaleX` 等等便捷的变形方法本质上就是一个特殊的 `matrix3d`, 让我们看看这些值得 `matrix3d` 是什么样的.

**rotateX(a):**

```
$$
\begin{bmatrix}
   1 & 0 & 0 & 0 \\\
   0 & cos(a) & -sin(a) & 0 \\\
   0 & sin(a) & cos(a) & 0 \\\
   0 & 0 & 0 & 1
 \end{bmatrix}
$$
```

**rotateY(a):**

```
$$
\begin{bmatrix}
   cos(a) & 0 & sin(a) & 0 \\\
   0 & 1 & 0 & 0 \\\
   -sin(a) & 0 & cos(a) & 0 \\\
   0 & 0 & 0 & 1
 \end{bmatrix}
$$
```

**rotateZ(a):**

```
$$
\begin{bmatrix}
   cos(a) & -sin(a) & 0 & 0 \\\
   sin(a) & cos(a) & 0 & 0 \\\
   0 & 0 & 1 & 0 \\\
   0 & 0 & 0 & 1
 \end{bmatrix}
$$
```

**translateX(t):**

```
$$
\begin{bmatrix}
   1 & 0 & 0 & t \\\
   0 & 1 & 0 & 0 \\\
   0 & 0 & 1 & 0 \\\
   0 & 0 & 0 & 1
 \end{bmatrix}
$$
```

**translateY(t):**

```
$$
\begin{bmatrix}
   1 & 0 & 0 & 0 \\\
   0 & 1 & 0 & t \\\
   0 & 0 & 1 & 0 \\\
   0 & 0 & 0 & 1
 \end{bmatrix}
$$
```

**translateZ(t):**

```
$$
\begin{bmatrix}
   1 & 0 & 0 & 0 \\\
   0 & 1 & 0 & 0 \\\
   0 & 0 & 1 & t \\\
   0 & 0 & 0 & 1
 \end{bmatrix}
$$
```

**skewX(ax):**

```
$$
\begin{bmatrix}
   1 & tan(ay) & 0 & 0 \\\
   0 & 1 & 0 & 0 \\\
   0 & 0 & 1 & 0 \\\
   0 & 0 & 0 & 1
 \end{bmatrix}
$$
```

**skewX(ay):**

```
$$
\begin{bmatrix}
   1 & 0 & 0 & 0 \\\
   tan(a_x) & 1 & 0 & 0 \\\
   0 & 0 & 1 & 0 \\\
   0 & 0 & 0 & 1
 \end{bmatrix}
$$
```

**skewX(az):**

```
$$
\begin{bmatrix}
   1 & tan(a_y) & 0 & 0 \\\
   0 & 1 & 0 & 0 \\\
   0 & 0 & 1 & 0 \\\
   0 & 0 & 0 & 1
 \end{bmatrix}
$$
```

**变换中心改变：**

设新的中心点为 $x_0$, $y_0$, $z_0$.

```
$$
\begin{bmatrix}
   a_1 & a_2 & a_3 & a_4 \\\
   b_1 & b_2 & b_3 & b_4 \\\
   c_1 & c_2 & c_3 & c_4 \\\
   0 & 0 & 0 & 1
 \end{bmatrix}
 \cdot
 \begin{bmatrix}
   x_0 \\\
   y_0 \\\
   z_0 \\\
   0
 \end{bmatrix}
 =
 \begin{bmatrix}
     a_1x_0 + a_2y_0 + a_3z_0  \\\
     b_1x_0 + b_2y_0 + b_3z_0 \\\
     c_1x_0 + c_2y_0 + c_3 z_0 \\\
     0
 \end{bmatrix}
$$
```

然后用原来矩阵的最后一列减去这个向量.

```
$$
\begin{bmatrix}
   a_1 & a_2 & a_3 & a_4 - a_1x_0 - a_2y_0 - a_3z_0 \\\
   b_1 & b_2 & b_3 & b_4 - b_1x_0 - b_2y_0 - b_3z_0 \\\
   c_1 & c_2 & c_3 & c_4 - c_1x_0 - c_2y_0 - c_3z_0 \\\
   0 & 0 & 0 & 1
 \end{bmatrix}
$$
```

这些矩阵也就是 transformjs 所用到的, 大家可以阅读源码看到这些矩阵.

另外, 还有一个 `perspective`, 其意义是透视, 视角. 在显示器中3D效果元素的透视点在显示器前方(近似于我们眼睛所在方位).

`perspective` 属性有两种书写形式, 用在元素的父级或元素本身.

```css
.parent {
    perspective: 1000px;
}
```

```css
#parent .ele {
    transform: perspective(1000px) rotateY(45deg);
}
```

他们之间的区别可以通过阅读[好吧，CSS3 3D transform变换，不过如此！](http://www.zhangxinxu.com/wordpress/2012/09/css3-3d-transform-perspective-animate-transition/)来区分.

## 深入阅读

1. [和transformjs一起摇摆](http://www.alloyteam.com/2016/12/and-transformjs-rock/)
2. [transform.js](https://github.com/AlloyTeam/AlloyTouch/blob/master/transformjs/transform.js)
3. [理解CSS3 transform中的Matrix(矩阵)](http://www.zhangxinxu.com/wordpress/2012/06/css3-transform-matrix-%E7%9F%A9%E9%98%B5/)
4. [好吧，CSS3 3D transform变换，不过如此！](http://www.zhangxinxu.com/wordpress/2012/09/css3-3d-transform-perspective-animate-transition/)