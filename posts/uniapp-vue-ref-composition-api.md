---
title: UniApp 中为什么不能使用 Composition API 的模版引用？
date: 2021-11-22 22:46:16
category: 技术
tags:
  - JavaScript
  - 小程序
---

uniapp 版本：2.0.0

我们可以引入 `@vue/composition-api`，大部分 API 是正常的，但是有一个写法会引起报错：

```vue
<template>
  <view ref="viewRef" />
</template>

<script>
import { ref } from '@vue/composition-api'
export default {
  setup() {
    const viewRef = ref()
    
    return {
      viewRef,
    }
  }
}
</script>
```

报错大概是这个样子的：

```
mp.runtime.esm.js:5634 TypeError: Converting circular structure to JSON
    --> starting at object with constructor 'Object'
    --- property '_renderProxy' closes the circle
    at JSON.stringify (<anonymous>)
    at _o (mp.runtime.esm.js:5619)
    at a.wo [as __patch__] (mp.runtime.esm.js:5632)
    at a.e._update (mp.runtime.esm.js:3959)
    at a.r (mp.runtime.esm.js:5700)
    at Ir.get (mp.runtime.esm.js:4419)
    at Ir.run (mp.runtime.esm.js:4494)
    at wr (mp.runtime.esm.js:4250)
    at Array.<anonymous> (mp.runtime.esm.js:1984)
    at St (mp.runtime.esm.js:1912)(env: macOS,mp,1.05.2110290; lib: 2.17.0)
```

因为 uniapp 自定义了 `__patch__` 函数，有个操作：

```js
function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);

  // vue-composition-api
  var compositionApiState = vm.__composition_api_state__ || vm.__secret_vfa_state__;
  var rawBindings = compositionApiState && compositionApiState.rawBindings;
  if (rawBindings) {
    Object.keys(rawBindings).forEach(function (key) {
      ret[key] = vm[key];
    });
  }

  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}
```

这段函数的作用就是把 Vue 的数据同步到小程序上面：

```javascript
JSON.parse(JSON.stringify(ret))
```

因为 viewRef.value 是 view 组件，当执行这段的时候会报循环结构，因为组件实例中存在循环结构

## 题外话

UniApp 中 `this.$refs` 是怎么实现的：

给了定义 ref 的组件一相应的 class，然后利用小程序获取元素的能力把这些组件找到，相关代码：

```javascript
function initRefs (vm) {
  const mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get () {
      const $refs = {};
      selectAllComponents(mpInstance, '.vue-ref', $refs);
      // TODO 暂不考虑 for 中的 scoped
      const forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(component => {
        const ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs
    }
  });
}
```
