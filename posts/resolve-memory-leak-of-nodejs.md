---
title: Node.js 内存泄露解决经验
date: 2024-4-13 22:30:00
category: 学以致用
tags:
- Node.js
- 后端
- 内存泄露
---

在迄今为止的工作历程中，解决了不少 Node.js 的内存泄露问题，大部分是 SSR 服务的问题，大概总结一下

## 关注监控

首先一个我总结的非常重要的经验是，当发生内存泄露能极大加快解决问题速度的事情，就是增加监控，然后日常需要看监控，以及确保报警的可用性

我遇到的问题，大多数都是一开始没有关注监控，直到出现明显问题才发现然后开始解决。而到问题比较明显的时候，又因为监控数据也是只保留一段时间的，不知道从何时开始发生问题的，只得从全局入手进行排查，而不能将问题缩小到局部的 commits 范围

## 看依赖

可以先简单看一看依赖/Node.js 版本有没有问题，一般比较火的开源库如果有内存泄露，都会有 Issue

比如之前我们 Nuxt 应用的一个内存泄露最终排查下来就是 [i18n 依赖的内存泄露](https://github.com/nuxt-modules/i18n/issues/2034)。像之前有查到过的， 还有比如 [Node.js  fetch 有内存泄露问题](https://github.com/nodejs/node/issues/46435)，[axios 有内存泄露问题](https://github.com/axios/axios/issues/5641)等等，所以，一般如果依赖可以升级的话，我会选择先把依赖升级一波，都升级到最新的稳定版本，然后再发到线上观察看看

## 快速识别会造成内存泄露的代码

总结经验，快速识别会造成内存泄露的代码，给自己的排查提供思路

比如说，有一个「全局」的对象会不断增加，比如之前遇到的问题就是这个导致的：[回忆一个 vhtml 的 BUG](https://www.zhuscat.com/posts/vhtml-bug)

比如说细化到具体的框架， Vue 在服务端渲染的时候，很多声明周期函数是[不会被触发的](https://vuejs.org/guide/scaling-up/ssr.html#component-lifecycle-hooks)

如果写了类似这样的代码，就会导致内存泄露：

```vue
<script setup>
const timer = setInterval(() => {
  // do something...
}, 1000)

onUnmounted(() => {
  clearInterval(timer)
})
</script>
```

包括我们使用第三方包的 Composition API 或者组件的时候，就需要注意，其实这在 Vue 文档中都有提及

之前遇到过，用的一个三方组件，在 `setup` 中[直接进行了定时操作](https://github.com/quelchx/vue-writer/blob/4bd9902b9b6551d948d0e37df318482dda0673f1/src/vue-writer.vue#L86)，导致我们的应用内存泄露

还有之前我们代码中，使用 VueUse 的 useEventBus 的时候，出现了这样的代码：

```vue
<script setup>
const { on } = useEventBus('foo')

on(() => {
  // do something...
})
</script>
```

应该是要这样写：
```vue
<script setup>
const { on } = useEventBus('foo')

onMounted(() => {
  // PS：在客户端 Vue setup scope 中，借助 Vue 框架的能力，不用显式去取消监听，组件卸载时会自动取消监听
  on(() => {
    // do something...
  })
})
</script>
```

## 先全局后局部

排查问题时候，先看看是不是全局问题，全局问题相对来说会更加容易去解决。如果是全局问题，我们进行改动验证的时候，一般可以直接把服务发到线上观察

如果发现是局部问题，就比较麻烦了，如果一直排查不出问题点，可能需要采取特殊的流量方案，比如对于 Web 服务，把路由分为两份（采用二分法的形式），将线上流量进行分流，然后看，哪部分会有内存泄露，然后再继续进行分流，最终排查到问题点。我目前解决的问题，还没有到需要采取这种方式解决的

## 分析快照

还可以使用 Heap Snapshot 之类的方式去分析

之前排查问题的时候，因为本地测试生成的 Heap Snapshot 看不出问题，我还给应用接入了 [easy monitor](https://github.com/hyj1991/easy-monitor)，给线上应用生成 Heap Snapshot 去看。这里需要注意的点是，因为生成 Heap Snapshot 也是会大幅增加内存，而比如我们使用的 k8s 会设置 pod 内存上限，所以要注意生成 Heap Snapshot 的时间点，防止生成过程中 OOM。另外，生成过程中也会导致服务无法处理请求，如果要保证线上服务稳定，需要和运维配合，不将流量打到在生成 Heap Snapshot 的 Pod 上

遗憾的是，当时并没有通过 Heap Snapshot 排查出具体问题点，不管是通过 Summary 还是 Comparison 都没有明显地看出问题所在，最后还是搜 GitHub 发现是 i18n 的问题，这在上面已经讲过了

## 总结

以上就是我总结的一些经验了，一般排查的时候，是结合这些方法一起使用，一般来说，大部分内存泄露问题都可以解决
