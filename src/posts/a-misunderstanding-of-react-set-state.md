---
title: 对 React setState 的误解
date: 2019-04-11 00:00:06
category: 学以致用
tags:
- 前端
- JavaScript
- React
---

之前一直以为同步的几个  `setState`  调用批量合并再一次性更新，结果发现这是我的一个误解。

```js
import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  state = {
    a: 0
  };

  handleClick = () => {
    this.setState({
      a: 1
    });
    this.setState({
      a: 2
    });
  };

  render() {
    console.log("render");

    return (
      <div className="App">
        <div>{this.state.a}</div>
        <button onClick={this.handleClick}>按一下</button>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

如上所示的一个例子，控制台的输出为：

```
render
```

也就是说虽然调用了两次 `setState`，但实际上只执行一次 `render`，而之前我以为任何情况下都是这个样子的。

然而并不是，比如：

```js
import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  state = {
    a: 0
  };

  handleClick = () => {
    this.setState({
      a: 1
    });
    this.setState({
      a: 2
    });
  };

  componentDidMount() {
    document.addEventListener("click", this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClick);
  }

  render() {
    console.log("render");

    return (
      <div className="App">
        <div>{this.state.a}</div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

控制台的输入为：

```
render
render
```

也就是说执行了两次 `setState`，进行了两次 `render`

原来，目前只有在 React 的事件函数当中，多次 `setState` 才会批量处理，因为所有的 React 事件函数会被 `unstable_batchedUpdates` 包裹起来，这是实现批量更新的关键。而 React 未来将更新策略默认为批量更新。

## 参考文章

1. [javascript - Does React keep the order for state updates? - Stack Overflow](https://stackoverflow.com/questions/48563650/does-react-keep-the-order-for-state-updates/48610973#48610973)
