---
title: 异步文件上传
date: 2017-03-12 23:53:06
category: 学以致用
tags:
- JavaScript
- 前端
---
## 使用 iframe 进行文件的异步上传

使用 `iframe` 进行文件的异步上传的基本思想是在表单上传的时候，创建一个 `iframe` 元素，并将表单的 `target` 属性设置为创建的 `iframe` 窗口，这样，上传结束返回的数据会到 `iframe` 窗口里面，页面也不会发生转跳。

废话不多说，来看看代码：

首先是基本的表单

```html
<form id="myform" method="post" enctype="multipart/form-data" action="/someurl">
  <input type="file" name="myfile">
  <input type="submit">
</form>
```

接着再看看 `JavaScript` 代码：

```javascript
// 用于生成 iframe 窗口 name 属性
var seed = 0;
var myform = document.getElementById('myform');
myform.onsubmit = function (event) {
  var iframe = document.createElement('iframe');
  var id = 'uploader-frame-' + seed;
  seed++;
  iframe.setAttribute('name', id);
  // 隐藏 iframe
  iframe.style.cssText = 'display: none';
  // 设置 form 的 target 为 iframe
  myform.setAttribute('target', id);
  // 将 iframe 插入
  document.body.appendChild(iframe);
}
```

就是这么简单，不过服务器成功接收数据后返回需要返回一段数据，这里一般是要触发一个回调，我们可以与服务器预先约定好回调函数的名字，或者在上传表单的 `URL` 中加参数之类的，反正让服务器端知道回调函数的名字就好了，一般可以这样返回：

```javascript
res.write('<script>window.top.callback("somedata")</script>');
res.end();
```

这样就会调用 `callback` 函数了，`iframe` 异步上传表单的优点是兼容性较高。下面再看看另一种异步上传表单的方式。

## AJAX 上传

`XMLHttpRequest` 对象第二版支持异步上传文件，方法是使用 `FormData`，然后向服务器端发送数据。

让我们看看代码：

```javascript
var formData = new FormData();
formData.append('myfile', document.getElementById('myfile').files[0]);
var xhr = new XMLHttpRequest();
xhr.open('POST', '/someurl');
xhr.onload = function() {
  if (xhr.status === 200) {
    // 上传成功
  } else {
    // 出现错误
  }
};
xhr.send(formData);
```

就是这么简单，并且十分强大。

另外，借助 `File API` + `AJAX` 的方式，还能实现更多高级的功能，比如断点续传，思路就是使用 `File.prototype.slice` 将文件分割成多个片段，然后使用 `AJAX` 传送片段，如果一个片段传送成功了就传送下一个片段。