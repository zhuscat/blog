---
title: 前端竞态问题的解决
date: 2021-10-17 22:46:16
category: 学以致用
tags:
  - JavaScript
---

## 问题描述

如搜索场景，当搜索关键词发生变化的时候需要重新发起请求

如询价询券场景，当商品数量、发货方式等条件发生改变的时候需要重新发起请求

有可能会出现后面发起的请求比前面发起的请求返回更快的情况，在发生这种情况的时候，就会出现界面展示信息的错误

## 解决方案

这里与主流框架结合提供几个解决的方法，旨在阐明核心的解决思路

第一种，每次请求的时候可以生成一个ID，在应用请求返回结果的时候看，比对最新ID与该请求对应的ID是否一致，如果不一致则抛弃结果

### React 实现（仅展示关键逻辑）

```javascript
// 当搜索词 keyword 发生变化的时候重新发起请求
const latestIdRef = useRef(0)

useEffect(() => {
  const currentId = latestIdRef.current + 1
  latestIdRef.current = currentId
  searchSomething(keyword).then((res) => {
    if (latestIdRef.current !== currentId) {
      // 抛弃
      return
    }
    // 应用结果
  })
}, [keyword])
```

### Vue 2.x

```vue
<template>
  <div>
    <input v-model="keyword" />
    <!-- 加载中的时候不让点击 -->
    <button :disabled="isLoading">下一步</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isLoading: false,
        keyword: '',
        latestId: 0,
      }
    }
    }
    // ...
    watch: {
      keyword() {
        const latestId = this.latestId + 1
        this.latestId = latestId
        this.isLoading = true
        searchSomething(this.keyword).then((res) => {
          if (this.latestId !== latestId) {
            // 抛弃
            return
          }
          // 应用结果
          // ...
          this.isLoading = false
        }).catch(err => {
          if (this.latestId !== latestId) {
            // 抛弃
            return
          }
          // ...
          this.isLoading = false
        })
      }
    }
  }
</script>
```

另外，我们也可以借助框架提供的消除副作用的方法，比如 useEffect

### React 实现

```javascript
useEffect(() => {
  let valid = true

  searchSomething(keyword).then((res) => {
    if (!valid) {
      // 抛弃
      return
    }
    // 应用结果
  })

  return () => {
    valid = false
  }
}, [keyword])
```

还要其他一些类似的思路来解决这样的问题，总而言之，就是要防止旧的请求结果被应用

## 封装

业界已经有针对这种场景的解决方式：如 `rxjs` 中有 `switchMap`，`redux-saga` 中有 `takeLatest`，如果使用 `vue 2.x`（目前工作使用的主要框架），在不引入额外的依赖的情况下，我还没有想出一个比较完美的方案，可以不重复写上面那样的代码，当然可以封装这样一个函数，但是还是需要在 `catch` 中处理一下：

```typescript
class CancelError extends Error {
  hasCanceld = true
  constructor(message?: string) {
    super(message)
  }
}

function takeLatest<T extends any[], U>(
  fn: (...args: T) => Promise<U>,
): (...args: T) => Promise<U> {
  let id = 0
  const wrap = function (...args: T) {
    const _id = id++
    id = _id

    return fn(...args).then((v) => {
      if (_id !== id) {
        throw new CancelError()
      }
      return v
    })
  }

  return wrap
}

function search(keyword: string) {
  return Promise.resolve({
    ret: keyword,
  })
}

const _search = takeLatest(search)

_search('xxx')
  .then((res) => {
    // 处理业务逻辑
  })
  .catch((err) => {
    if (err instanceof CancelError) {
      // 什么事都不做
      return
    }
    // 处理错误逻辑
  })
```

