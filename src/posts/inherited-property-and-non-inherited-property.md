---
title: 继承属性与非继承属性
date: 2016-12-12 16:37:39
category: 学习笔记
tags:
- CSS
- 前端
- 学习笔记
---
CSS 属性可以分为继承属性与非继承属性。这决定着当某一属性没有提供值得时候，该属性的值为什么。

## 继承属性

CSS 继承属性是在没有给元素指定某一属性的时候，该属性的值为属性父元素该值得计算值。

看下面的代码，可以看到 `color` 是继承属性，所以 `span` 里面的颜色也变为蓝色，而 `border` 是非继承属性，所以 `span` 并没有边框。

{% jsfiddle zhuscat/ovqkLxx7 html,css,result %}

下面是一个继承属性的列表：

```
azimuth
border-collapse
border-spacing
caption-side
color
cursor
direction
elevation
empty-cells
font-family
font-size
font-style
font-variant
font-weight
font
letter-spacing
line-height
list-style-image
list-style-position
list-style-type
list-style
orphans
pitch-range
pitch
quotes
richness
speak-header
speak-numeral
speak-punctuation
speak
speech-rate
stress
text-align
text-indent
text-transform
visibility
voice-family
volume
white-space
widows
word-spacing
```

## 非继承属性

非继承属性当没有指定值得时候，为该属性的初始值(可在CSS文档中看到一个属性初始值为什么)。