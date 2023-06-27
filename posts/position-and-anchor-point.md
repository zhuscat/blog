---
title: "position 与 anchorPoint"
date: 2016-06-19 20:24:09
category: 学习笔记
tags:
- 学习笔记
- 技术
- 开发
- iOS
---

简单的记录一下 `position` 与 `anchorPoint`



# 属性

`UIView` 具有的属性： `frame`, `bounds`, `center`
`CALayer` 具有的属性： `frame`, `bounds`, `position`, `anchorPoint`

`position` 是 `layer` 中的 `anchorPoint` 在 `superLayer`中的位置的坐标

# 关系

如上所述，那么修改 `position` 或者修改 `anchorPoint` 会对另一方的值造成影响吗？

答案是不会，因此，`frame.origin` 会收到影响，因此修改 `achorPoint` 会造成视图移动的现象。比如默认 `anchorPoint` 是 `(0.5, 0.5)`，修改成 `(0.5, 0)` 之后视图会下移二分之一的高度。

只要牢牢记住这一句话就行了：
>`position` 是 `layer` 中的 `anchorPoint` 在 `superLayer`中的位置的坐标

**注：**layer 默认的值是 `(0.5, 0.5)`