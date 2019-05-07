---
title: 解决生成的 CSV 在 Excel 打开乱码
date: 2019-05-07 20:40:00
category: 学以致用
tags:
  - 编码
---

最近做了一个将 CSV 字符串内容保存为文件的功能（在浏览器中），由于我自己电脑上没有 Excel，在使用 Keynote 和纯文本形式打开没问题之后就觉得 OK 了。但是后来用户反馈用 Excel 打开生成的 CSV 文件出现了乱码。这是由于生成的文件不包含 BOM 导致的，本文将描述问题出现的原因，什么是 BOM 以及最终问题的解决方案。

## 问题

原来的代码是这样写的，直接根据包含 CSV 文件内容的字符串生成一个 Blob 对象，然后生成一个 URL 并下载，文件内容的编码格式则是 UTF-8。

```javascript
function save(content) {
  const a = document.createElement('a')
  const blob = new Blob([content], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  a.href = url
  a.click()
  URL.revokeObjectURL(url)
}

save('1997,Ford,E350\r\n1996,Jeep,Grand Cherokee')
```

但是，这样下载下来的文件在 Excel 中打开乱码了。原来，Excel 在识别文件编码的时候，会根据文件的 BOM 头来识别，而我上面代码所得到的文件显然不含 BOM 头。

## 什么是 BOM

BOM 即字节顺序标记（Byte Order Mark），它出现在一个文件的开头，在如 UTF-16、UTF-32 等编码的文件中，用来表明文件字节序的一个标记。在 UTF-16 中，BOM 为 `U+FEFF`，这样，如果是大端字节序，则程序读到的前两个字节分别为 `0xFE`、`0xFF`，若是小端字节序，则分别为 `0xFF`、`0xFE`。而在 UTF-8 编码的文件中，BOM 实际上是不必要的。但一些程序会要求在 UTF-8 文件中添加 BOM，否则默认情况下就不能正确解析文件（如 Excel），UTF-8 文件的 BOM 为 `EF BB BF`。

## 解决

既然知道了问题的原因，那我们只需要在文件开头加上 UTF-8 文件对应的 BOM 就行了。修改代码如下：

```javascript
function save(content) {
  const a = document.createElement('a')
  const bom = new ArrayBuffer(3)
  const dv = new DataView(bom)
  dv.setInt8(0, 0xef)
  dv.setInt8(1, 0xbb)
  dv.setInt8(2, 0xbf)
  const blob = new Blob([bom, content], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  a.href = url
  a.click()
  URL.revokeObjectURL(url)
}

save('1997,Ford,E350\r\n1996,Jeep,Grand Cherokee')
```

## 参考

1. [UTF-8 BOM 头](https://www.cnblogs.com/sparkdev/p/5676654.html)
2. [逗号分隔值 - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/%E9%80%97%E5%8F%B7%E5%88%86%E9%9A%94%E5%80%BC)
3. [字节顺序标记 - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/%E4%BD%8D%E5%85%83%E7%B5%84%E9%A0%86%E5%BA%8F%E8%A8%98%E8%99%9F)
