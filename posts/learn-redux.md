---
title: Redux 初体验
date: 2016-07-22 19:51:14
category: 学习笔记
tags:
- 前端
- 学习笔记
- Redux
- 开发
---

![Redux](https://i.loli.net/2018/11/17/5befc20e79926.png)

Redux 是一个可预测的状态容器。最近看了 Redux 作者的入门视频，算是入了个门，顺便写篇文章记录一下。



# 基本思想

首先是 action，action 是形如下面形式的 JavaScript 对象：

```
{
	type: 'ACTION_TYPE',
	info: 'some information'
}
```

其中，type 是必须的，通过 action 可以改变状态。

```
(oldState, action) => newState
```

以上就是一个 reducer 了，输入一个旧的状态与动作，输出一下新的状态。Redux 要求我们不要去修改旧状态。

通过 createStore 来创建一个 store，然后通过 dispatch 函数来修改 store 所存储的状态。

可以 `subscribe(listener)` 来监听状态的变化，当状态发生变化的时候调用 listener 来执行一些操作。

另外还有一个 getState 方法可以获取当前状态

所以 Redux 的基本思想是这样的：

action 描述发生了什么，reducer 则根据 action 改变 state，store 则是将两者联系起来。

接着就说说视频里的一些其他东西，比较杂。

# 有用的库

1. expect
2. deep-freeze

# 不要修改原数组

Redux 要求我们不要去修改原来的状态，状态所包含的信息可以多种多样，比如说数组，所以我们要注意不要去修改原来的数组

## 添加

不要这样做

```
list.push(item);
return list;
```

这样做

```
return [...list, item];
```

## 删除某一项

不要这样做

```
list.splice(index, 1);
```

这样做

```
return [
	...list.slice(0, i),
	...list.slice(i + 1)
	];
```

## 修改某一项

这样做

```
return [
	...list.slice(0, i),
	list[i] + 1,
	...list.slice(i + 1)
	];
```

# 不要修改原对象

使用 Object.assign，将键值赋值到第一个参数上，如果有一样的键的话，后面那个的值会被赋给第一个参数

```
return Object.assign({}, todo, {
	completed: !todo.completed
	});
}
```

还有这样的方法，不过下面这种方法不是标准中的方法，不过 babel 支持转码

```
return {
	...todo,
	completed: !todo.completed
	};
```

# combineReducers 简要实现

combineReducers 可以将多个 reducer 整合起来变为一个 reducer

```
const combineReducers = (reducers) => {
	return (state, action) => {
		return Object.keys(reducers).reduce(
			(nextState, key) => {
				nextState[key] = reducers[key](
					state[key],
					action
				);
				return nextState;
			},
			{}
		);
	};
};
```

# Provider 简要实现

使用 Provider 为自己的应用提供一个顶层状态，该状态向下流动给有需要的组件使用

```
class Provider extends Component {
	getChildContext() {
		return {
			store: this.props.store
		};
	}

	render() {
		return this.props.children;
	}
}

Provider.childContextTypes = {
	store: React.PropTypes.object
};

```

给需要用到 store 的组件加上：

```
SomeComponent.contextTypes = {
	store: React.PropTypes.Object
};
```

使用 context 把数据传递到所有的子组件

作者把 contextTypes 比喻 wormhole，有需要的组件可以获取状态数据

这些事情一个库已经帮我们做好了：

react-redux

# 分离表现和行为

这是作者在视频后面做的事情，主要方法如下

创建 Container Component

提供数据，行为

将数据行为与表现连接起来

创建 Presentation Component

决定组件是如何展现的，而不关心行为

将表现组件从容器组件中分离出来

分离出来的好处？

一个好处是当不使用 Redux 管理状态的时候，不需要修改太多代码，也就是低耦合了

然后分离了之后就发现所有 Container Component 都是类似的，react-redux 就提供了一个 connect 方法来创建容器组件，非常方便，用法如下：

```
// 定义生成的 Container Component 中 Presentation Component 的 props

const mapStateToProps = (state, ownProps) => {
	return {
		foo: state.foo
	};
};

const mapStateToDispatch = (dispatch, ownProps) => {
	return {
		onEventOccur: () => {
			dispatch({
				type: SOME_ACTION
			})
		}
	};
};

// 生成

const ContainerComponent = connect(
	mapStateToProps,
	mapStateToDispatch)(PresentationComponent)
```

# 结构

1. action
2. reducers
3. store
4. components
	- Presentational Components
	- Container Components