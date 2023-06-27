---
title: CSS陷阱（一）
date: 2016-09-05 18:37:42
category: 学以致用
tags:
- 前端
- CSS
- React
---

在写自定义的 `radio`，`checkbox` 这些东西的时候遇到了一个坑，在这里记录一下。

`HTML` 的组织是这样的：

```jsx
<label className="zc-radio-wrapper">
  <span className="zc-radio">
    <span className="zc-radio-inner" />
    <input
      className="zc-radio-input"
      type="radio"
      value={value}
      checked={on}
      onChange={this.handleClick}
    />
  </span>
  <span>{text}</span>
</label>
```

一开始的CSS大概如下：

```css
.zc-radio-input {
  position: absolute;
  opacity: 0;
}

.zc-radio-inner {
  /* 自定义的内容 */
}
```

然后发现滚动条滚到下面的时候，点击自定义的组件会自动滚到最上方。

一开始我以为是重新渲染所产生的问题，各种排查错误，就是没有发现，最后才发现是忘记给外层元素设置 `position: relative;` 了，导致 `.zc-radio-input` 处在页面的上方，当点击 `label` 的时候就会自动滚到 `zc-radio-input` 处了。

