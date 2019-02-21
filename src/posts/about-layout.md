---
title: "关于布局"
date: 2016-02-14 13:45:27
category: 学习笔记
tags:
- 学习笔记
- 技术
- 开发
- Swift
- iOS
---

关于布局的一些知识。更新中，如有错误欢迎指出。
<!-- more -->
## 正文
### layoutSubviews 什么时候被调用
1. init(frame: CGRect) 且 frame 不为 CGRectZero
2. addSubview
3. 设置 frame 且与之前的 frame 不同
4. 滚动 UIScrollView
5. 旋转屏幕触发父 UIView 的 layoutSubviews
6. 更改 view 的大小也会触发父 UIView 的 layoutSubviews

### layoutIfNeeded 和 setNeedsLayout
1. layoutIfNeeded 是在如果有更新布局标记的情况下马上布局
2. setNeedsLayout 是添加一个更新布局的标记，然后在恰当的时候调用 layoutIfNeeded

### 尺寸什么时候是确定的
1. 在调用 layoutSubviews 的时候，尺寸已经是精确的
2. 在控制器中，可以在 viewDidLayoutSubviews 中进行一些与 view 尺寸相关的布局，此时尺寸是精确的
3. 在 awakeFromNib 中，控件的尺寸是 xib 文件中的尺寸，此时尺寸是不精确的（针对某个屏幕大小进行布局或尺寸计算等）

