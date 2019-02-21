---
title: JavaScript 异步验证
date: 2016-09-26 15:16:54
category: 学以致用
tags:
- JavaScript
- 验证
- 前端
---

这几天看了一些开源代码自己重新写了一下表单组件，然后现在想加异步验证组件进来。

异步验证是表单验证中比较重要的一个功能点，如从服务器获取用户名是否已经被注册等都可以通过一个异步验证模块来处理。

如何制作一个异步验证模块呢，一开始我并没有什么头绪，开始想着使用 `Promise` 来进行模块的制作，但是对 `Promise` 的使用还是不够自如。然后就看了 `Ant.Design` 中使用的异步验证模块 —— `async-validator`，根据其思路实现了异步验证。在实现了异步验证模块之后，我们可以直接使用其替代原来的验证模块。

先说说异步验证可以带来的功能，以检查用户名为例子，该字段的规则是，用户名由 5 - 20 位字母数字或下划线组成，用户名不能已经被注册，该字段必须是要提供的。

当我们在该字段进行输入的时候，字段会显示正在验证，等到验证结束之后，显示该字段是否验证成功。

这篇文章就以 [async-validator](https://github.com/yiminghe/async-validator) 为例子，来说明该异步验证模块是怎么工作的。

<!-- more -->

相信大家在 `JavaScript` 中，会频繁地接触到与异步相关的编程，说到异步，自然而然就会想到回调函数， [async-validator](https://github.com/yiminghe/async-validator) 也是使用回调来处理异步的事情。

## 呈现的接口

让我们先来看看该模块给外部提供的接口

```javascript
function Schema(descriptor) {
  // 构造函数
};
Schema.prototype.message = function(messages){
  // 获取提示信息(如：该字段为必填字段)
};
Schema.prototype.define = function(rules) {
  // 对 rules 做一定的处理
};
Schema.prototype.validate = function(source_, o = {}, oc) {
  // 进行验证操作
}
```

其中，message 和 define 方法由 validate 进行调用，所以最终使用该模块的人一般为这样使用：

```javascript
const validator = new Schema(rules);
validator.validate({
  user: 'zhuscat',
  password: '123456'
}, options, (errors, fileds) => {
  // do something here...
});
```

我们只需要知道 `message` 方法是返回一个可以获取各种提示信息的对象，`define` 方法是对 `rules` 做一定的处理的函数。

这里有必要解释一下 `rules` 的形式：

```javascript
/**
 * rules 为一个对象，其描述了验证的一些规则
 * 对象的键指明其所对应的字段的名称
 * 然后验证模块会解析这些规则以提供验证
 * 如下面定义的规则
 * user 字段所对应的规则为 userRule
 * userRule 由一个数组组成，每个数组都是一条验证的规则
 * userRule[0]:
 * 要求类型为 string, 为必填字段，最小长度为5，最大长度为10
 * userRule[1]:
 * 一个自定义的异步验证，在 1s 后返回错误，"超时错误"
 * 你可能会问：为什么不直接把 validator 写到 userRule[0] 里面
 * 原因是像 type, required 之类的字段是预先定义好的
 * userRule[0] 最终会转换成一个具有 validator 成员的对象
 * async-validator 的做法是，如果一个对象中有 validator
 * 则直接返回 validator
 * 最后验证字段的时候，只是调用每一个 validator
 *
 */
const userRule = [
  {
    type: 'string',
    required: true,
    min: 5,
    max: 10,
  },
  {
    validator: (rule, value, callback, source, options) => {
      setTimeout(() => {
        callback('超时错误');
      }, 1000);
    },
  },
];

const passwordRule = [
  {
    type: 'string',
    required: true,
    min: 5,
    max: 10,
  },
];

const rules = {
  user: userRule,
  password: passwordRule,
};
```

好了，知道了 `rules` 的形式之后，是不是对该验证模块是如何验证心里是不是有一个想法了呢？

在生成了新的 `Schema` 实例之后，通过调用 `validate` 函数就能进行验证了，之后我们在 `callback` 中取得错误。

```javascript
// callback 的形式
(errors, fields) => {
  //...
}
```

其中， errors 是所有验证错误信息，fields 是对应于每一个字段的错误，如以上面的例子，可能返回的就是：

```javascript
const errors = [error1, error2, error3, error4];

const fields = {
  user: [error1, error2],
  password: [error3, error4],
};
```

## 验证过程

好了，讲完大概的用法之后，我们就要思考，如何实现。

其过程是这样的（做了一定的简化，如关于 message 的逻辑，如一些特殊情况的处理）

### 创建实例

```javascript
const validator = new Schema(rules)
```

首先根据 `rules`，将其进行一定的转换，放到 `validator.rules` 上面。

### 进行验证

```javascript
validator.validate({
  user: 'zhuscat',
  password: '123456'
}, options, (errors, fileds) => {
  // do something here...
});
```

我们要进行的验证字段是 user 跟 password，关于规则可以看上面的内容，首先，模块会对 `validator.rules` 进行一个处理，使所有规则都具有一个 `validator` 字段，`validator` 字段要求是一个形式如下的函数：

```javascript
(rule, value, callback, source, options) => {
  //...
}
```

当 callback 被调用的时候，说明这条规则验证结束。

接着，对信息做如下的处理

```javascript
// series = {};
// for every key in source(这里是'user', 'password')
//   arr <- this.rules[key]
//   for every item in arr
//     series[key].push({value, rule, source, filed: key})
```

这样一来，会得到一个如下的 `series`

```javascript
const series = {
  'user': [
    {
      value: 'zhuscat',
      rule: {}, // 带有 validator
      source: {user: 'zhuscat', password: '123456'},
      field: 'user',
    },
    {
      value: 'zhuscat',
      rule: {},
      source: {},
      field: 'user'
    },
  ],
  'password': [
    {
      value: '123456',
      rule: {},
      source: {},
      filed: 'password',
    },
  ],
};
```

接下来就是最关键的一步，我认为这就是该异步验证的核心，也就是一个函数: `asyncMap`

```javascript
function asyncMap(objArr, option, func, callback) {
  //...
}
```

生成的 `series` 会传递给 asyncMap, 调用形式如下：

```javascript
asyncMap(series, option, (data, doIt) => {
  //...
}, (results) => {
  complete(results);
})
```

`asyncMap` 会根据提供的 option 来进行不同的验证策略，如进行所有规则的验证，或者当出现一个错误立即停止验证。验证结束之后就会调用 `callback`，`results` 就是相关的错误信息。

`func` 参数对 `series` 中的一条规则进行验证时调用，data 就是如下面的对象：

```javascript
{
  value: 'zhuscat',
  rule: {}, // 带有 validator
  source: {user: 'zhuscat', password: '123456'},
  field: 'user',
}
```

在 `func` 中，会调用 `rule.validator` 进行验证，在 `rule.validator` 验证后，调用 `doIt`，并传入相应的错误。

关于这个 `doIt` 函数，则决定了验证的策略。

`asyncMap` 主要通过调用两个不同的函数实现不同的验证策略，一个叫做 `asyncParallelArray(arr, func, callback)`，一个叫做 `asyncSerialArray(arr, func, callback)`

`syncParallelArray` 验证 arr 中的所有规则结束后调用 `callback`， `asyncSerialArray` 为当出现一个错误的时候，就调用 `callback`，让我们来看看这两个函数的实现：

```javascript
function asyncParallelArray(arr, func, callback) {
  const results = [];
  let total = 0;
  const arrLength = arr.length;
  /*
    count 也就是刚才的 doIt
    当被调用后，增加 total 的值，当 total 与数组总数
    相同的时候，调用 callback
  */
  function count(errors) {
    results.push.apply(results, errors);
    total++;
    if (total === arrLength) {
      callback(results);
    }
  }

  arr.forEach((a) => {
    func(a, count);
  });
}

function asyncSerialArray(arr, func, callback) {
  let index = 0;
  const arrLength = arr.length;
  /*
    next 也就是刚才的 doIt
    当被调用的时候，查看是否存在 errors 如果存在
    调用 callback
  */
  function next(errors) {
    if (errors && errors.length) {
      callback(errors);
      return;
    }
    const original = index;
    index = index + 1;
    if (original < arrLength) {
      func(arr[original], next);
    } else {
      callback([]);
    }
  }

  next([]);
}
```

再看看 `asyncMap` 的函数实现：

```javascript

export function asyncMap(objArr, option, func, callback) {
  if (option.first) {
    const flattenArr = flattenObjArr(objArr);
    return asyncSerialArray(flattenArr, func, callback);
  }
  let firstFields = option.firstFields || [];
  if (firstFields === true) {
    firstFields = Object.keys(objArr);
  }
  const objArrKeys = Object.keys(objArr);
  const objArrLength = objArrKeys.length;
  let total = 0;
  const results = [];
  const next = (errors) => {
    results.push.apply(results, errors);
    total++;
    if (total === objArrLength) {
      callback(results);
    }
  };
  objArrKeys.forEach((key) => {
    const arr = objArr[key];
    if (firstFields.indexOf(key) !== -1) {
      asyncSerialArray(arr, func, next);
    } else {
      asyncParallelArray(arr, func, next);
    }
  });
}
```

当 `option.first` 为 `true` 的时候（只验证到第一个错误），将 `series` 做 `flattenArray` 的处理：

```javascript
// 类似与这样的处理
// array = [[1, 2], [3, 4]]
// flattenArray = [1, 2, 3, 4]
```

接着调用 `asyncSerialArray` 进行处理

当 `option.firstField` 为 `true` 的时候，对每一个字段（这里是 `user` 和 `password` )中的数组使用 `asyncSerialArray` 处理，如果没有这些配置，则对每一个字段进行 `asyncParallelArray` 处理。

`next` 函数作为 `asyncParallelArray` 和 `asyncSerialArray`，当调用的时候证明一个验证结束，通过改变 `total` 来看是否所有验证已经结束，结束后调用 `callback`。

这就是一个异步验证组件。

## 参考资料

1. [async-validator](https://github.com/yiminghe/async-validator)


