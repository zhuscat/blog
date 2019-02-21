---
title: 学习 FoldingCell 笔记
date: 2016-06-25 13:20:08
category: 学习笔记
tags:
- 学习笔记
- 技术
- 开发
- Swift
- iOS
---

1. `@IBInspectable` 加了这个之后的属性可以在 storyboard 中显示
2. `m34` 透视效果
3. 改变了 `anchorPoint`，如果是使用 `AutoLayout` 是要对约束做相应的修改，如一下场景，有一个视图 view1 ，有一个视图view2，view2是 view1 的 subview，view2 的约束是顶部在 view1 的顶部，左边在 view1 的左边，右边在 view1 的右边，高度为 view1 的高度，如果给 view2 设置 `anchorPoint` 为 `(0.5, 1)`，则要增加 view2 上方的高度为其高度的二分之一
4. 可以给 `CABasicAnimation` 设置代理，分别在动画开始和动画结束时做一些事情。
5. 对于 `CAAnimation` 的回调可以用 `dispatch_after` 实现，计算好动画结束的时间
6. `CALayer` 的 `shouldRasterize` 在开启后会将 `CALayer` 光栅化为 bitmap，适合那些内容不变的 layer