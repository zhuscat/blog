---
title: Vite 新特性：HMR Partial Accept
date: 2022-11-16 00:10:00
category: 技术
tags:
  - 前端工程化
---

Vite 3 提供了一个实验性的新特性 —— HMR Partial Accept。现在主流的 UI 框架脚手架基本都提供了热更新（Hot Module Replacement）的能力，也就是说，我们修改组件，不用刷新页面，变更就可以更新到页面上

不过，这些脚手架（未验证所有脚手架，以 React 为例）自带的行为只支持当一个模块（`.js` 文件）只导出组件的时候，如果还导出了其他内容，当修改这个模块的时候，模块自身无法处理这个模块的更新，因此开发框架只有这样两种选择：
1. 退到热重载（Live Reload）
2. 将对该文件的变更冒泡到上层，接受该变更，但框架层面实际上只对组件热更新逻辑做了完善地处理，如果简单粗暴地接受变更，可能会导致一些问题

经过我的测试发现（create react app、vite），如果被导出的其他内容还是在组件树的某个部分被使用的，那还是会简单粗暴地进行热更新

Vite 3 提供的这个实验性特性，就是尝试解决上面所说的问题的，当一个模块发生变更的时候，可以对指定的导出进行 accept 操作

举个 🌰：

```jsx
// foo.js
export function hello() {
  console.log('hello')
}

export default function Foo() {
  return <div>foo</div>
}

if (import.meta.hot) {
  // accept default 导出
  // 如果没有其他模块引用 hello，那么这个模块自身可以处理自身的热更新，不会传递到上层
  // 如果当前有其他模块引用 hello，那么还是会传递到上层
  import.meta.hot.acceptExports(['default'], newModule => {
    // ...
  })
}
```

我理解这个功能的作用是为热更新提供更加精细准确的控制

所谓的精细，指的的是模块自身可以选择自己能够处理哪些导出，如果外部没有引用不能够自身处理的导出，就不会把热更新处理传递到上层。而原来，如果模块一旦包含混杂的内容，必定会把热更新的处理传递给上层，不管外部有没有引用除了组件之外的内容

所谓的准确，指的是原来一个混杂的模块如果发生变化，上层处理这个更新，可能会选择简单粗暴的热更新。但是这样会导致应用的状态可能会不符合预期，导致不准确。现在有了这样更加精细的控制，上层可以选择去做热重载

读到这里，你可能会觉得，好像这个特性没有解决什么问题，如果一个模块内的内容外部不使用，那干嘛还要导出，但如果外部使用，又会会退到热重载，好像又回到了最初的原点

这里举个讨论中的 🌰：

```html
<script context="module">
  // option implemented as an export
  export const ssr = false
  // loading function implemented as an export
  export const load = async (...) => ...
</script>
...
```

像 Svelte Kit 的写法，除了导出组件，还会导出一些内容，这些内容会在 server 端被消费，在 client 端不会被使用，这种情况下，如果用了 HMR Partial Accept，热更新就不会传递到上层了，这样我们就可以做到，一个模块变更时，除了组件自身，如果只有这些 SSR 相关的配置内容（`ssr`、`load`），它自身还是可以处理变更进行热更新，如果一个模块还导出其他一些内容被外部使用了，就去进行热重载保证应用状态是符合预期的

这应该就是这个特性想要做到的事情吧，不知道我理解的对不对

另外，我想到，如果对于一个模块，如果我能静态地分析一个变更是变更哪一部分，是不是就能更加精细地去控制热更新了呢？比如如果我改动的是组件部分，那我就让它自身处理热更新，如果经过静态分析发现更改的其他的某个函数，我就进行热重载

好了，就写这么多吧，睡觉睡觉

参考：

1. https://vitejs.dev/blog/announcing-vite3.html
2. https://github.com/vitejs/vite/discussions/7309