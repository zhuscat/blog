---
title: "可视化格式模型学习笔记"
date: 2016-01-28 11:12:40
category: 学习笔记
tags:
- 前端
- 学习笔记
- 开发
- CSS

---

个人认为，对于 CSS 盒模型、定位和浮动的理解，是学习 CSS 的一个核心，理解了它们，相信布局的问题的解决了许多，这篇笔记能帮助你快速的回忆起这些内容，图片来自 [W3School](http://www.w3school.com.cn/index.html) 。



# 正文

## 盒模型

![盒模型](https://i.loli.net/2018/11/17/5befc2267e26f.gif)

内边距、边框、外边距也可以应用单独的边。外边距可以是负值。

**注：**IE的早期版本，包括IE6，在混杂模式中使用自己的非标准模型，认为width属性是内容、内边距和边框宽度的总和。

### 外边距叠加

空元素自己也会发生叠加，关于叠加可以想成当两个外边距“碰在一起”的时候就会进行叠加，选择更大的那个边距。

只有普通文档流中块边框的垂直外边距才会发生外边距叠加。行内框、浮动框或绝对定位框之间的外边距不会发生叠加。

## 定位

### 可视化格式模型

- 块级元素，如 p、h1、div，称为块框
- 行内元素，如 strong、span，称为行内框

通过 `display` 可以改变框类型

定位机制

- 普通流
- 浮动
- 绝对定位

默认为普通流

修改行内框尺寸的唯一办法是修改行高、水平边框、内边距或外边距

将 `display` 改为 `inline-block` 可以让元素想行内元素一样水平排列，但是框的内容表现得跟块级元素一样（可以改变宽度、高度、垂直外边距和内边距等等）。

**注：**屏幕上看到的所有东西都形成某种框

### 相对定位

如下元素向原位置向右，向下各移动20px，并且元素还是占据原来的空间，只是看到的位置变了


```
#myBox {
  position: relative;
  left: 20px;
  top: 20px;
}
```

### 绝对定位

脱离文档流，不占据空间，绝对定位的元素位置是相对于其距离最近的已经定位的祖先元素确定

```
position: absolute;
```

通过 `z-index` 控制绝对定位框的叠放次序

### 浮动

脱离文档流，不占据原来的空间

理解浮动，类似于漂浮的元素向某个方向移动，遇到障碍物（其他浮动元素）并且有足够空间就停止移动，没有足够空间就向下移动，继续向左走。

#### 清除浮动

框的文本内容会受到浮动元素的影响

![文本内容收到影响](https://i.loli.net/2018/11/17/5befc6d4a2a6f.gif)

对第二个段落执行清楚浮动之后（本质上添加了边距使其不与浮动元素接触）

![对第二个段落清楚浮动](https://i.loli.net/2018/11/17/5befc6d486d30.gif)

清除浮动的例子

![清除浮动](https://i.loli.net/2018/11/17/5befc6d4851fb.gif)

如上图所示有好几种清除浮动的方法让容器能包含里面的内容

- 在 html 文档中给元素增加一个专门用来清除浮动的标签，对该标签进行清除浮动
- 将容器也进行浮动，这样容器就能包含里面的元素的了
- 对容器样式设置 `overflow`，当其为 `hidden` 或者 `auto` 的时候，会进行清除浮动
- 使用 `:after` 伪类在内容末尾添加新内容，如设置 `.clear:after {content: "."; height: 0; visibility: hidden; display: block; clear: both;}`
- 使用 JavaScript 进行清除

# 参考资料
1. [《精通CSS·高级Web标准解决方案（第二版）》](http://book.douban.com/subject/4736167/)
2. [W3School CSS 教程](http://www.w3school.com.cn/css/index.asp)