---
title: 将 React 组件渲染到 body 上
date: 2016-09-10 18:02:50
category: 学以致用
tags:
- 前端
- JavaScript
- React

---
## 背景

一般来说使用编写的 `React` 组件会用一个 `render` 方法，然后整个应用有一个唯一的根元素，但是有时候可能希望有一些例外，比如说编写类似 `popover` 的组件，可能会有一些不方便，如果能将其渲染到 `body` 上则会方便许多。

<!-- more -->

## 解决方案

以下就是一个比较简单的将组件渲染到 `body` 上的组件。

```jsx
import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

const propTypes = {
  children: PropTypes.any,
};

export default class RenderToLayer extends Component {
  componentDidMount() {
    this.popup = document.createElement('div');
    document.body.appendChild(this.popup);
    this.renderLayer();
  }

  componentDidUpdate() {
    this.renderLayer();
  }

  componentWillUnmount() {
    this.unrenderLayer();
  }

  unrenderLayer() {
    if (!this.popup) {
      return;
    }
    ReactDOM.unmountComponentAtNode(this.popup);
    document.body.removeChild(this.popup);
    this.popup = null;
  }

  renderLayer() {
    ReactDOM.render(this.props.children, this.popup);
  }

  render() {
    return null;
  }
}

RenderToLayer.propTypes = propTypes;
```

代码十分简单，该组件的 `children` 属性会被添加到 `body` 后面进行渲染，相信大家都看得懂。使用这种方法的一个缺点就是无法享受到 `Virtual DOM` 带来的好处了，但也得到了很多便利。

## 参考资料

1. [Rendering React components to the document body](http://jamesknelson.com/rendering-react-components-to-the-document-body/)
2. [RenderToLayer.js](https://github.com/callemall/material-ui/blob/master/src/internal/RenderToLayer.js)