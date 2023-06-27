---
title: vue sfc 是如何被编译的
date: 2022-05-03 22:46:16
category: 技术
tags:
  - 前端
  - vite
  - vue
  - 编译
---

vite 2.x 举例，vite 通过 vite-plugin-vue 插件提供了编译 vue sfc 的能力，主要逻辑在 vite-plugin-vue 的 `load` hook 和 `transform` hook 中

不同的 hook 会在 vite 编译过程的不同时机被调用

`load` hook 会在加载对应模块的时候被调用，用来获取文件内容，默认是在文件系统中读取对应模块的内容

`transform` hook 在 `load` hook 之后会被触发，用来转换模块内容

我们以下面这个 sfc 为例子（假设名称是 `app.vue`）：

```vue
<template>
  <div class="title">
    {{ title }}
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const title = ref('Hello World')
    return {
      title,
    }
  }
}
</script>

<style>
.title {
  color: #000;
}
</style>
```

vite-plugin-vue `load` hook 的职责是返回 sfc 被解析出来的同名 block，比如 `<style lang="scss"></style>` 可能会被解析成一个这样的 import 语句 `import '/app.vue?vue&type=style&index=1&lang.scss'`，然后当 vite 去 load 这个模块的时候，就会进入到 vite-plugin-vue 的 `load` hook 里面，vite-plugin-vue 匹配到这样的一个 import 语句，就会把之前解析好的 sfc 的 `style` block 返回回去

vite-plugin-vue 的 `transform` hook 主要包含三个逻辑，对 `vue` 文件的[转换](https://github.com/vitejs/vite/blob/d49e3fbfc0227e2e00ffc4a8d4152135c5cd6bb8/packages/plugin-vue/src/index.ts#L223)，对 `template` block 的[转换](https://github.com/vitejs/vite/blob/d49e3fbfc0227e2e00ffc4a8d4152135c5cd6bb8/packages/plugin-vue/src/index.ts#L238)，对 `style` block 的[转换](https://github.com/vitejs/vite/blob/d49e3fbfc0227e2e00ffc4a8d4152135c5cd6bb8/packages/plugin-vue/src/index.ts#L240)

对 `vue` 的转换的逻辑在 `transformMain` 中，比如上面例子中的 `app.vue` 会进入 `transformMain` 被转换，先是调用 `vue/compiler-sfc` 的 parse 方法，把 `vue` 处理成一个 `descriptor` 对象，通过这个对象能够快速拿到每个类型的 `block`，另外也会生成对应 block 的 source map，类似于对应 block 在原来 vue 文件中的位置映射

然后是生成 `script`，如果可以内联（vue 文件中 javascript 类型的内联 script），就直接把内容内联在被转换后的模块中，否则在被转换的模块中加入一个 `import` 语句，比如：

如果是内联的话，这样的代码会被拼接到转换后的模块中：

```js
import { ref } from 'vue'
const _sfc_main = {
  setup() {
    const title = ref('Hello')
    const info = ref(null)

    return {
      title,
      info
    }
  }
}
```

如果是引入的方式，这样的代码会被拼接到转换后的模块中：

```js
import _sfc_main from '/app.vue?vue&type=script&lang.js'
export * from '/app.vue?vue&type=script&lang.js'
```

然后是对 `template` 的处理，生成 `template` 代码，和 `script` 代码类似，如果可以内联的话，会把 `template` 的代码转换成 render 函数内联在生成的模块中，不能内联就通过 import 的方式引入（通过 import 方式引入会在后续再被打包工具进行处理），如果是内联，内联的代码会被添加到上面所说的 script 代码后面，render 函数同样会生成 source map，如果被内联，会需要调整 source map，主要是[增加一个偏移量](https://github.com/vitejs/vite/blob/d49e3fbfc0227e2e00ffc4a8d4152135c5cd6bb8/packages/plugin-vue/src/main.ts#L166)，另外再提一嘴，如果 `sfc` 中包含 setup script，在生产环境中，如果可能的话，模版生成的 render 函数会被[内联到 setup script 里面](https://github.com/vitejs/vite/blob/d49e3fbfc0227e2e00ffc4a8d4152135c5cd6bb8/packages/plugin-vue/src/script.ts#L27)，这主要的原因在这个 [issue](https://github.com/vuejs/rfcs/pull/227#issuecomment-725011499) 里面有提到，主要有性能和 tree shaking 方面的考量。但是目前我发现内联到 setup script 里面会导致 source map 有点问题，因为被内联到 setup script 的 render 函数没有到原始模版的映射关系，也许后面会优化

内联的话：

```js
import { toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

const _hoisted_1 = { class: "content" }
const _hoisted_2 = { class: "text-area" }
const _hoisted_3 = { class: "title" }

function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createElementVNode("div", _hoisted_2, [
      _createElementVNode("span", null, _toDisplayString($setup.info.text), 1 /* TEXT */),
      _createElementVNode("span", _hoisted_3, _toDisplayString($setup.title), 1 /* TEXT */)
    ])
  ]))
}
```

引入的话：

```js
import { render as _sfc_render } from '/app.vue?vue&type=template&lang.js'
```

然后是对 `style` 的处理，以 scss 为例，会被转化为 `import`，如：

```js
import '/app.vue?vue&type=style&index=0&lang.scss'
```

还会对 custom blocks 进行转换，一般不会用到，不详细说了，可以直接看看代码

最后是插入一些样板代码，`vue` 模块就被解析完成了，像上面的例子 `script` 和 `template` 都是以内联的方式被添加到转换后的模块中的，所以最终的结果大概类似于这样：

```js
import { ref } from 'vue'

const _sfc_main = {
  setup() {
    const title = ref('Hello World')
    return {
      title,
    }
  }
}

import { toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

const _hoisted_1 = { class: "title" }

function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", _hoisted_1, _toDisplayString($setup.title), 1 /* TEXT */))
}

import "/app.vue?vue&type=style&index=0&lang.css"

import _export_sfc from 'plugin-vue:export-helper'
export default /*#__PURE__*/_export_sfc(_sfc_main, [['render',_sfc_render],['__file',"/app.vue"]])
```

然后是 `template` 和 `style` 模块的转换逻辑，比如上面转换后的代码有一个 `.css` 的导入，这个 `css` 文件的导入先会触发 `load`，`vite-plugin-vue` 会匹配到并返回之前解析的 `descriptor` 中的 css 代码，然后再进入 `transform` hook，此时就会调用 `style` 的转换逻辑了，具体内容我就不多说了。`template` 的转换逻辑也是类似

还想说的一点是，知道了一个好用的包：[magic-string](https://www.npmjs.com/package/magic-string)，可以用这个包修改源文件，然后可以非常方便的生成 source map

这大概就是一个 vue sfc 的转换流程了，大概描述一下算是自己加深一下理解吧，最好的方式还是直接[看代码](https://github.com/vitejs/vite/blob/d49e3fbfc0227e2e00ffc4a8d4152135c5cd6bb8/packages/plugin-vue/src/index.ts)

