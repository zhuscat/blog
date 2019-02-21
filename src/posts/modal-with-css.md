---
title: 使用 css 创建 modal 效果
date: 2016-08-14 19:14:54
category: 学以致用
tags:
- 前端
- CSS
---

Modal 是网页设计中经常用到的一种效果，来看看如何用CSS实现吧

## HTML 组织

```
.modal
    .modal-content
```

## CSS 代码

```
.modal {
    /* 背景色 */
    background: rgba(0, 0, 0, 0.2);
    /* 固定 */
    position: fixed;
    /* 覆盖整个视口 */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    /* 保持遮罩在上方 */
    z-index: 999;
    /* 当 modal-content 超出视口的时候可以进行滚动*/
    overflow: auto;
}

.modal-content {
    /* modal 的内容 */
    width: 60%;
    background-color: #fff;
    /* 居中 */
    margin: 50px auto;
    padding: 16px 32px;
    position: relative;
}
```

## 滚动解决

这样设置之后，当展现 modal 之后，后方的页面依旧可以滚动，这样用户体验不是很好，可以通过设置 `body` 的 CSS 样式来解决：

```
// 当出现 modal 的时候
document.body.style.overflow = 'hidden'

// 当 modal 消失的时候
document.body.style.overflow = 'auto'
```
