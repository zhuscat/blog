---
title: drag
date: 2017-02-27 13:13:14
category: 学习笔记
tags:
- JavaScript
- HTML5
- HTML
---

## 简述

当拖动某一个元素的时候，将会先后触发 `dragstart`，`drag`，`dragend` 事件。

当某个元素被拖到有效放置目标上时，先后触发 `dragenter`，`dragover`，`drop`或`dragleave`。

某些元素不允许被放置，这个时候取消这些元素 `dragenter` 和 `dragover` 的默认行为就可以将该元素转为可被放置的目标。

另外，一些元素有默认的放置行为，这个时候，将 `drop` 的默认行为去除就行了。

要把一个元素设置为可拖动的，可以按照如下设置：

```html
<div draggable="true">
</div>
```

## dataTransfer

拖放可以实现数据交换，这是通过 `dataTransfer` 对象完成的，它是拖动过程中事件对象的一个属性，`dataTransfer` 主要的两个方法是 `getData` 和 `setData`

### setData

```javascript
dataTransfer.setData(format, data);
```

`format` 的值是一种 MIME 类型，考虑到向后兼容，也可以是 `text` 和 `url`，这两个类型被映射为 `text/plain` 和 `text/url-list`，在IE10及以前不支持 MIME 类型名称。另外，Firefox 5 之前的版本不能正确的将 `text` 和 `url` 映射成 `text/plain` 和 `text/url-list` ，但是却能将 `Text` 映射成 `text/plain`，因此，获取 URL 的时候最好两个都检测一下，获取 `text` 则将第一个改为大写，这样可以获得更高的兼容性。

### getData

```javascript
dataTransfer.getData(format)
```

指定MIME类型（以及 `text` 和 `url` ，规则同上）获取数据。

### dropEffect 和 effectAllowed

这两个属性决定这被拖动元素移动到某放置目标上的时候鼠标的外观，这与行为无关。

`dropEffect` 的有以下值：

1. none
2. move
3. copy
4. link

`effectAllowed` 有以下值：

1. uninitialized
2. none
3. copy
4. link
5. move
6. copyLink
7. copyMove
8. linkMove
9. all

值得注意的是，要在 `ondragstart` 中设置 `effectAllowed` 属性，在 `ondragengter` 中设置 `dropEffect` 属性。

~~当 `effectAllowed` 和 `dropEffect` “匹配”的时候就能显示指定的鼠标样式（如：`dropEffect` 为 `copy`，`effectAllowed` 为 `copyLink`，则显示为一个带有加号的鼠标样式，注意，该鼠标样式是在 macOS 的 Chrome 下进行观察的）。~~

我进行测试的时候发现，是否设置被放置元素 `dragenter` 事件中 `dropEffect` 的属性与鼠标显示无关，鼠标的显示与 `effectAllowed` 有关。

## 其他

`dataTransfer` 还有其他方法属性：

1. addElement(element) 在 `dataTransfer` 上添加一个元素类型的数据
2. clearData(format) 清除某类型的数据
3. setDragImage(element, x, y) 设置拖动的时候光标旁边显示的图像
4. types 当前保存的数据类型，一个类数组对象
