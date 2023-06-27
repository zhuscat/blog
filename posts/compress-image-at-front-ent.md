---
title: 在前端压缩图片
date: 2016-11-07 09:54:24
category: 学习笔记
tags:
- 前端
---

前端经常有上传图片的需求，比如上传头像，但用户可能会选择一张很大的图片，这个时候我们可以选择将图片压缩，然后再上传。

压缩的思路如下：

1. 获取图片文件
2. 将文件转为 Blob URL 或者 Data URL
3. 将该 URL 赋值给一个 Image 对象
4. 在 Image 对象加载完毕之后，将该图片绘制到 Canvas 上面
5. 然后使用 Canvas 的 toDataURL 或者 toBlob 方法，设定图片输出质量进行压缩
6. 之后经过一些处理就可以发送带有这张压缩过图片的请求了

## 将图片文件转为 URL

### 转为 Blob URL

```js
const objectURL = window.URL.createObjectURL(file)
```

一件需要注意的事情是，在创建了 Blob URL 之后，如果不关闭标签的话，所分配的资源会在内存里常驻，因此在不会使用到这个 Blob URL 之后，我们可以释放资源：

```js
window.URL.revokeObjectURL(objectURL)
```

### 转为 Data URL

```js
const fileReader = new FileReader()
fileReader.onload = (event) => {
  // do something with data url
  console.log(event.target.result)
}
fileReader.readAsDataURL(file)
```

## 赋值给 Image 对象并绘制到 Canvas 上

```js
const image = new Image()
const canvas = document.createElement('canvas')
// result 是之前获取的 Data URL 或者 Blob URL
image.src = result
image.onload = (event) => {
  canvas.width = image.width
  canvas.height = image.height
  canvas.drawImage(image, image.width, image.height)
}
```

## 压缩

然后再将 canvas 转回 Data URL 或者 Blob URL