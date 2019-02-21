---
title: CSS 小知识（一）
date: 2016-08-20 19:14:29
category: 学以致用
tags:
- 前端
- 开发
- CSS
---

# px，em 与 rem

`px` 相对于显示器分辨率而言。

`em` 是相对长度单位，相当于当前对象内文本的尺寸。浏览器默认的字体行高是 `16px`

`rem `相对于 `html` 根元素 (`root em`)

# 将文本变为不可选中

```
-webkit-user-select:none;
-moz-user-select:none;
-ms-user-select:none;
user-select:none;
```

# 优化字体渲染

```
text-rendering: optimizeLegibility;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

# 设置全局字体

```
body {
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
}

/** 确保表单元素被设置所需字体 **/
input, label, select, option, textarea, button, fieldset, legend {
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
}
```
