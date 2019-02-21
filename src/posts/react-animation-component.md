---
title: React 动画组件实现思路
date: 2016-09-22 23:20:09
category: 学以致用
tags:
- 前端
- JavaScript
- React
---

最近写了一个 React 动画组件，在这里记录一下实现的思路。

动画组件参考了 React 官方的实现和 React-Component 的 Animate 组件，这两个组件的实现思路大同小异。

<!-- more -->

假设这个组件的名称为 `Animator` ，使用形式类似于下面这样：

```jsx
<Animator>
  {this.props.items.map(i => {
    return (
      <Item key={i.key}>
        i.name
      </Item>
    );
  })}
</Animator>
```

在 `Animator` 包裹后，当新插入 item，删除 item 的时候，会有动画产生。

主要的思路是，`Animator` 组件内部有一个 `state` 来保存将要渲染的 children，当有新的 children 进来的时候（以 `props` 的方式，会将 `state` 中的 children 和新的 children 进行合并，这期间(即 `componentWillReceiveProps`），又要决定哪些元素是要进行入场动画的，哪些元素是要进行出场动画的，然后重新渲染，渲染结束之后，再对 children 进行动画操作。

简单来说， `Animator` 提供了一个缓冲区，在元素实际上是要删除的时候，`Animator` 通过 `state` 将其保存住，在做完动画之后才真正地删除。

接下来我们再更加细致地看看这个 `Animator` 该如何实现。

在 `componentWillReceiveProps` 这个生命周期中，会传入新的 `props`，因此我们可以拿到接下来要展示的 children（命名为 `nextChildren`)，另外就是 `state` 保存着的 children (命名为 `prevChildren` )，然后我们执行一个 `mergeChildren` 的操作，将 `prevChildren` 和 `nextChildren` 进行合并，接着，找出所有需要进行入场动画的孩子节点，也就是在 `nextChildren` 中但是不在 `prevChildren` 中的节点，以及所有需要进行离场动画的孩子节点，也就是在 `prevChildren` 中但是不在 `nextChildren` 中的节点，我们将这些节点分别用 `keysToEnter` 和 `keysToLeave` 保存。至于如何找到这些节点，我们规定，使用该组件的话，所有孩子节点都需要指定一个与其他孩子不同的 `key` 属性，这样就可以轻松找到节点了。

那么，节点要怎么进行合并呢？

```javascript
export default function mergeChildren(prev, next) {
  let res = [];

  const nextChildrenPending = {};
  let pendingChildren = [];
  prev.forEach(child => {
    if (child && findChildByKey(child.key, next)) {
      if (pendingChildren.length) {
        nextChildrenPending[child.key] = pendingChildren;
        pendingChildren = [];
      }
    } else {
      pendingChildren.push(child);
    }
  });
  next.forEach(child => {
    if (child && {}.hasOwnProperty.call(nextChildrenPending, child.key)) {
      res = res.concat(nextChildrenPending[child.key]);
    }
    res.push(child);
  });
  res = res.concat(pendingChildren);
  return res;
}
```

以上就是合并两个孩子节点数组的方法，`findChildByKey` 方法根据 key 值在一个孩子节点数组中寻找，寻找成功返回 `true` ，否则返回 `false`，相信大家很容易就能看懂是怎么实现的（在纸上模拟一下情况就知道了）。

接着就是要在 `componentDidUpdate` 这个生命周期方法中写一些代码了，我们根据之前保存的 `keysToEnter` 和 `keysToLeave` 所对应的节点进行相应的动画操作，我们可以约定孩子节点可以实现类似 `componentWillEnter`，`compoenntDidEnter` 之类的方法，然后我们就可以在适当的时候去调用这些方法。需要注意的是，在离场动画结束之后，需要将该离场了节点从 `state` 中删除，这样才符合逻辑。

另外，在实现这个组件的时候犯了个小错误：

```javascript
Array.prototype.concat()
```

该函数不会修改原数组，之前使用该方法忘记赋值，然后程序出现逻辑上的错误，找了好久才发现，一定要牢记在心。

顺便说一说

```javascript
Array.proptype.push()
```

该函数会修改原数组，并且会返回新的数组长度。