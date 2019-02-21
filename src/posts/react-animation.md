---
title: React 动画
date: 2016-08-31 14:07:50
category: 学习笔记
tags:
- 前端
- JavaScript
- React
---

`React.js` 提供了两个附加组件方便我们定义动画，分别为 `ReactTransitionGroup` 和 `ReactCSSTransitionGroup`。`ReactTransitionGroup` 是低层次的 API，`ReactCSSTransitionGoup` 是高层次的 API （做了进一步的封装，使用上更加方便但也相应的没有那么灵活）。

<!-- more -->

## ReactCSSTransitionGroup

使用该组件定义动画十分方便，将需要进行动画的组件由 `ReactCSSTransitionGroup` 包括起来，并定义相关的属性即可。

示例如下：

```jsx
<ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
  {items}
</ReactCSSTransitionGroup>
```

对于 `ReactCSSTransitionGroup` 下的每一个子组件，都需要指定一个 `key` 属性，即使其下只有一个子组件也需要指定 `key` 属性， `React` 通过该属性决定子组件进入、离开和保持在屏幕上的行为。

`ReactCSSTransitionGroup` 的本质是通过改变 `CSS` 类达到动画的效果，一系列的类名与 `transitionName` 有关，如指定了其值为 `example` 后，需定义如下的 `CSS` 类：

1. `.example-enter`：动画开始之前的 `CSS` 属性
2. `.example-enter.example-enter-active`：动画结束时的 `CSS` 属性(由这两个属性就可以得出进厂动画)
3. `.example-leave`：组件离场时的初始 `CSS` 属性。
4. `.example-leave.example-leave-active`：组件离场后的 `CSS` 属性。

示例如下(来自官方文档)：
```css
.example-enter {
  opacity: 0.01;
}

.example-enter.example-enter-active {
  opacity: 1;
  transition: opacity 500ms ease-in;
}

.example-leave {
  opacity: 1;
}

.example-leave.example-leave-active {
  opacity: 0.01;
  transition: opacity 300ms ease-in;
}
```
另外，`ReactCSSTransitionGroup` 还有一个 `transitionAppear` 属性，该属性在为 `true` 的情况下首次挂载会进行动画。

所改变的 CSS 类为：

1. `example-appear`
2. `.example-appear.example-appear-active`

当然，如果你不想像上面那样命名 `CSS`，也可以自定义 CSS  名称（官方示例）：

```jsx
  ...
  <ReactCSSTransitionGroup
    transitionName={ {
      enter: 'enter',
      enterActive: 'enterActive',
      leave: 'leave',
      leaveActive: 'leaveActive',
      appear: 'appear',
      appearActive: 'appearActive'
    } }>
    {item}
  </ReactCSSTransitionGroup>

  <ReactCSSTransitionGroup
    transitionName={ {
      enter: 'enter',
      leave: 'leave',
      appear: 'appear'
    } }>
    {item2}
  </ReactCSSTransitionGroup>
  ...
```

另一点需要注意的是，如果要使用该组件进行动画的话，`ReactCSSTransitionGroup` 必须先挂载在 `DOM` 上面才行，这一点也可以理解，当然，如果你设置了 `transitionAppear={true}` 就不需要预先挂载。

最后，还有两个属性：`transitionEnter` 和 `transitionLeave` ，都是用布尔值去赋值，分别定义进场和出场时是否进行动画。

## ReactTransitionGroup

该组件在 `react-addons-transition-group` 中。

使用该组件有一系列生命周期函数，我看到的时候感觉十分熟悉（写过 `iOS`，十分类似）

1. componentWillAppear(callback)

2. componentDidAppear

3. componentWillEnter(callback)

4. componentDidEnter()

5. componentWillLeave(callback)

6. componentDidLeave()

   这些函数都有一些特点：在 `callback` 被调用之前会阻塞不尽兴下一步操作。另外跟 `ReactCSSTransitionGroup` 中所需要的 `CSS` 类名进行对照就可以发现其实是一一对应的，也不难想象 `ReactCSSTransitionGroup` 的实现方式。

既然 `ReactTransitionGroup` 是组件，则其当然会对应一些 DOM 元素，默认情况下，其渲染为 `span`，不过，你仍然可以进行进一步定制，通过设定 `component` 属性即可，其可以是 `html` 标签，也可以是其他自定义的组件，另外还有一个 `className` 属性，该值会被传递给被渲染的子组件。