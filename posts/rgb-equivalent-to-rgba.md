---
title: 获取有透明度的颜色在白色背景上等效的不透明色
date: 2022-06-03 10:25:00
category: 技术
tags:
- 前端
- CSS
- 颜色
---

在很多设计系统中，我们会定一个基础颜色，然后会基于这个基础颜色计算出其他颜色，一个常见的计算是给这个基础色施加一个透明度，如下所示：

```css
:root {
  --primary-color: rba(48, 92, 216);
  --primary-color-6: rgba(48, 92, 216, 0.6);
}
```

使用 `rgba` 的问题是，这个颜色是透明的，如果你的背景色不是白色，颜色会进行叠加，那么，如果我们想要生成一个不透明颜色，这个颜色是原来的颜色施加了透明度之后在白色（甚至任何其他颜色）背景上显示的颜色，该怎么做的呢？

其实一个简单的公式就能计算出来：

设原来的颜色的三个数值为 R、G、B，P 为透明度（0...1），背景色为 B_R、B_G、B_B，R'、G'、B' 为结果值，则：

```
R' = B_R - P * (B_R - R)
G' = B_G - P * (B_G - G)
B' = B_B - P * (B_B - B)
```

用 JavaScript 实现一下：

```javascript
// backgroundRgb 默认为白色
function getOpaqueRgb(rgb, opacity, backgroundRgb = [255, 255, 255]) {
  return rgb.map(
    (x, idx) => backgroundRgb[idx] - opacity * (backgroundRgb[idx] - x)
  )
}
```

同样的例子，使用 CSS 变量和 `calc` 实现一下：

```css
:root {
  --primary-r: 48;
  --primary-g: 92;
  --primary-b: 216;
  --primary-color-6: rgb(
    calc(255 - 0.6 * (255 - var(--primary-r))),
    calc(255 - 0.6 * (255 - var(--primary-g))),
    calc(255 - 0.6 * (255 - var(--primary-b)))
  );
}
```

## 参考

1. [How to determine the equivalent opaque RGB color for a given partially transparent RGB color against a white background](https://graphicdesign.stackexchange.com/questions/113007/how-to-determine-the-equivalent-opaque-rgb-color-for-a-given-partially-transpare)
