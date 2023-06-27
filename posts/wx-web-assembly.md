---
title: 使用 WXWebAssembly
date: 2022-01-23 22:46:16
category: 技术
tags:
  - JavaScript
  - 小程序
---

之前看文档发现微信小程序有一个 WXWebAssembly，可以算是「小程序版」的 WebAssembly（就不能完全和标准一样么🤷‍♂️），微信官方文档写的太简略了，今天花时间看了一下要怎么集成进去

## 操作流水账

首先编译一个 WebAssembly 模块出来，我基于 Rust 打包一个出来，可以参考 [Compiling from Rust to WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly/Rust_to_wasm)

```bash
# 安装 wasm-pack
$ cargo install wasm-pack
# 初始化一个项目
$ cargo new --lib hello-wasm
```

`src/lib.rs` 代码如下：

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}
```

修改 `Cargo.toml`

```toml
[package]
name = "hello-wasm"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
```

编译出 wasm 模块：

```bash
$ wasm-pack build --target web
```

然后我们就可以看到 `pkg` 目录下有

```
.
├── hello_wasm.d.ts
├── hello_wasm.js
├── hello_wasm_bg.wasm
├── hello_wasm_bg.wasm.d.ts
└── package.json
```

我们需要 `hello_wasm.js`，`hello_wasm_bg.wasm`，`hello_wasm.js` 是胶水层，负责把转换 js 变量转换，wasm 输出转换为 js 变量。

因为输出产物是供 Web 使用的，小程序引入 `hello_wasm.js`，自然会报错，我们需要对 `hello_wasm.js` 做一些更改，主要改动是引入 `TextEncoder` 和 `TextDecoder`（小程序中没有，我找了一个极简的实现，但是与标准有所出入，可能会存在一些兼容性问题，但是这足够跑通本文的例子了），把 `WebAssembly` 改成 `WXWebAssembly`，以及移除一些无用代码，更改如下：

```diff

 let wasm;
 
+function TextEncoder() {}
+
+TextEncoder.prototype.encode = function (string) {
+  var octets = []
+  var length = string.length
+  var i = 0
+  while (i < length) {
+    var codePoint = string.codePointAt(i)
+    var c = 0
+    var bits = 0
+    if (codePoint <= 0x0000007f) {
+      c = 0
+      bits = 0x00
+    } else if (codePoint <= 0x000007ff) {
+      c = 6
+      bits = 0xc0
+    } else if (codePoint <= 0x0000ffff) {
+      c = 12
+      bits = 0xe0
+    } else if (codePoint <= 0x001fffff) {
+      c = 18
+      bits = 0xf0
+    }
+    octets.push(bits | (codePoint >> c))
+    c -= 6
+    while (c >= 0) {
+      octets.push(0x80 | ((codePoint >> c) & 0x3f))
+      c -= 6
+    }
+    i += codePoint >= 0x10000 ? 2 : 1
+  }
+  return octets
+}
+
+function TextDecoder() {}
+
+TextDecoder.prototype.decode = function (octets) {
+  if (octets == null) {
+    return
+  }
+
+  var string = ''
+  var i = 0
+  while (i < octets.length) {
+    var octet = octets[i]
+    var bytesNeeded = 0
+    var codePoint = 0
+    if (octet <= 0x7f) {
+      bytesNeeded = 0
+      codePoint = octet & 0xff
+    } else if (octet <= 0xdf) {
+      bytesNeeded = 1
+      codePoint = octet & 0x1f
+    } else if (octet <= 0xef) {
+      bytesNeeded = 2
+      codePoint = octet & 0x0f
+    } else if (octet <= 0xf4) {
+      bytesNeeded = 3
+      codePoint = octet & 0x07
+    }
+    if (octets.length - i - bytesNeeded > 0) {
+      var k = 0
+      while (k < bytesNeeded) {
+        octet = octets[i + k + 1]
+        codePoint = (codePoint << 6) | (octet & 0x3f)
+        k += 1
+      }
+    } else {
+      codePoint = 0xfffd
+      bytesNeeded = octets.length - i
+    }
+    string += String.fromCodePoint(codePoint)
+    i += bytesNeeded + 1
+  }
+  return string
+}
+
 let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
 
 cachedTextDecoder.decode();
 
 let cachegetUint8Memory0 = null;
 function getUint8Memory0() {
     if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
         cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
     }
     return cachegetUint8Memory0;
 }
 
 function getStringFromWasm0(ptr, len) {
     return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
 }
 
 let WASM_VECTOR_LEN = 0;
 
 let cachedTextEncoder = new TextEncoder('utf-8');
 
 const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
     ? function (arg, view) {
     return cachedTextEncoder.encodeInto(arg, view);
 }
     : function (arg, view) {
     const buf = cachedTextEncoder.encode(arg);
     view.set(buf);
     return {
         read: arg.length,
         written: buf.length
     };
 });
 
 function passStringToWasm0(arg, malloc, realloc) {
 
     if (realloc === undefined) {
         const buf = cachedTextEncoder.encode(arg);
         const ptr = malloc(buf.length);
         getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
         WASM_VECTOR_LEN = buf.length;
         return ptr;
     }
 
     let len = arg.length;
     let ptr = malloc(len);
 
     const mem = getUint8Memory0();
 
     let offset = 0;
 
     for (; offset < len; offset++) {
         const code = arg.charCodeAt(offset);
         if (code > 0x7F) break;
         mem[ptr + offset] = code;
     }
 
     if (offset !== len) {
         if (offset !== 0) {
             arg = arg.slice(offset);
         }
         ptr = realloc(ptr, len, len = offset + arg.length * 3);
         const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
         const ret = encodeString(arg, view);
 
         offset += ret.written;
     }
 
     WASM_VECTOR_LEN = offset;
     return ptr;
 }
 /**
 * @param {string} name
 */
 export function greet(name) {
     var ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
     var len0 = WASM_VECTOR_LEN;
     wasm.greet(ptr0, len0);
 }
 
 async function load(module, imports) {
-    if (typeof Response === 'function' && module instanceof Response) {
-        if (typeof WebAssembly.instantiateStreaming === 'function') {
-            try {
-                return await WebAssembly.instantiateStreaming(module, imports);
-
-            } catch (e) {
-                if (module.headers.get('Content-Type') != 'application/wasm') {
-                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
-
-                } else {
-                    throw e;
-                }
-            }
-        }
-
-        const bytes = await module.arrayBuffer();
-        return await WebAssembly.instantiate(bytes, imports);
+  const instance = await WXWebAssembly.instantiate(module, imports);
 
-    } else {
-        const instance = await WebAssembly.instantiate(module, imports);
-
-        if (instance instanceof WebAssembly.Instance) {
-            return { instance, module };
-
-        } else {
-            return instance;
-        }
-    }
+  return instance;
 }
 
 async function init(input) {
-    if (typeof input === 'undefined') {
-        input = new URL('hello_wasm_bg.wasm', import.meta.url);
-    }
     const imports = {};
     imports.wbg = {};
     imports.wbg.__wbg_log_ce93870e50a20a29 = function(arg0, arg1) {
         console.log(getStringFromWasm0(arg0, arg1));
     };
 
-    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
-        input = fetch(input);
-    }
-
-
-
-    const { instance, module } = await load(await input, imports);
+    const { instance, module } = await load(input, imports);
 
     wasm = instance.exports;
     init.__wbindgen_wasm_module = module;
 
     return wasm;
 }
 
 export default init;
```

然后在小程序中使用，成功：

```js
import init, { greet } from './hello_wasm'

// 填写 wasm 的绝对路径
await init('/hello_wasm.wasm')
greet()
```

## 参考

1. [Compiling from Rust to WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly/Rust_to_wasm)
2. [TextEncoderTextDecoder.js](https://gist.github.com/Yaffle/5458286)
3. [FastestSmallestTextEncoderDecoder](https://github.com/anonyco/FastestSmallestTextEncoderDecoder)
4. [WXWebAssembly](https://developers.weixin.qq.com/miniprogram/dev/framework/performance/wasm.html)
