---
title: XSS Protection Summary
date: 2017-05-01 13:06:37
category: 前端安全
tags:
- 前端安全
- XSS
- 前端
- XSS 防范
---

## 分类

XSS 攻击分为 **反射型** 、**存储型** 和 **DOM Based XSS**

### 反射型 XSS

反射型 XSS 是把用户的输入反射回浏览器所造成的 XSS 攻击，比如说本来网页上有一个表单让用户填用户名，用户提交表单之后返回的响应将用户填写的用户名显示出来。这种类型的攻击，一般攻击者的攻击手段为构造一个 URL 让用户去点击，当用户点击了这个 URL 之后，攻击才能成功。

我们试着去构造这样一个攻击的例子，使用 node.js 搭建一个简单的服务器：

```javascript
const http = require('http');
const url = require('url');

const server = http.createServer(function(request, response) {
  const parsedURL = url.parse(request.url, true);
  response.setHeader('X-XSS-Protection', 0);
  if (parsedURL.query.a) {
    response.end(`<html><head><title>XSS</title></head><body>${parsedURL.query.a}</body></html>`);
  } else {
    response.end('No Param a');
  }
});

server.listen(3002);
```

当输入的 URL 中有参数 `a` 的时候，会将这个参数的值嵌入到 body 作为响应返回到客户端。

注意到，我在返回的头部设置了 `X-XSS-Protection: 0`，不然 Chrome 会默认拦截可能的 XSS 攻击。

接着我们构造这样一个URL：`http://localhost:3002/xss?a=<script>alert(/xss/)<script>`

![反射型XSS](https://i.loli.net/2018/11/17/5befc247c7dc5.png)

### 存储型 XSS

存储型 XSS，不同于反射型的 XSS 攻击，会将数据存储到数据库，一个比较常见的例子是攻击者发布了一篇包含恶意 JavaScript 代码的文章，所有访问该文章的用户都会受到攻击。

### DOM Based XSS

DOM Based 通过 JS 操作 DOM 元素造成 XSS（如往事件属性里面写信息），严格来说，DOM Based XSS 也是反射型 XSS 的一种，不过这种攻击不是服务器返回的数据包含了恶意脚本，而是直接在客户端就生成了恶意脚本。还是看一个例子（ [DOM Based XSS - OWASP](https://www.owasp.org/index.php/DOM_Based_XSS) ）：

假设服务器返回如下所示的 HTML 页面，注意到，OPTION 选项是从用户的链接中提取的

```html
Select your language:

<select><script>

document.write("<OPTION value=1>"+document.location.href.substring(document.location.href.indexOf("default=")+8)+"</OPTION>");

document.write("<OPTION value=2>English</OPTION>");

</script></select>
```

正常的链接应该是这个样子的

```
http://www.some.site/page.html?default=French
```

然而，攻击者可以构造一个这样的 URL

```
http://www.some.site/page.html?default=<script>alert(document.cookie)</script>
```

当用户点击了这样一个 URL 之后，攻击就成功了，浏览器会执行下面这段代码：

```javascript
alert(document.cookie)
```

## 如何防范

### 给 Cookie 设置 HttpOnly

很多 XSS 攻击想要获取用户的 cookie，一般会获取 cookie 然后传送到攻击者的服务器上，然后可以以该用户的身份做一些操作（当然并不是所有都需要），给 Cookie 设置 HttpOnly 之后，JavaScript 就不能读取 Cookie 了。

### 输入检查

输入检查做的是过滤用户可能会造成 XSS 攻击的输入，比如说用户的用户名填写只能是数字加字母，如果要做输入检查，服务器端必须要有输入检查的逻辑，另外，客户端也可以做输入检查的逻辑，可以将正常用户的不小心的输入直接排除，不仅增强了用户体验，还减轻了服务器的压力。
但是，输入检查不是万能的，比如说一个可以让用户自定义 script 标签的 URL 的地方，此时，攻击者大可以输入一个指向恶意脚本的地址，服务器很难判别这是否是恶意的脚本。

### 输出检查

输出检查是在输出的时候进行过滤或者转义。
根据输出位置的不同，我们需要有不同的策略来进行文本的转义，切不可只使用一种转义的方法就觉得万事大吉了。
很多后端框架支持默认的转义，一般会对变量进行 HTML 转义，不过，即使是这样，仍然有可能存在着 XSS 漏洞。
比如说用户可以在如下 HTML 中输入变量：

```html
<button onclick="alert('$var');">CLICK ME<button>
```

如果攻击者输入如下字符串

```
1');alert('2
```

经过转义之后变为如下的字符

```
1&#x27;&#x29;;&#x3B;alert&#x28;&#x27;2
```

![插入事件属性的变量](https://i.loli.net/2018/11/17/5befc7c96476c.png)

即使这样，仍然会发现浏览器的行为为 `alert(1)` 和 `alert(2)`，究其原因，onclick 中的数据会先经过浏览器的解析，此时又成为了

```javascript
alert('1');alert('2');
```

自然攻击能够成功。

因此，我们需要对在不同情况下的输出做不同的转移：

1.在 HTML 标签之间输出，对这些数据进行 HTML Entity 编码

**编码规则**

```
& -> &amp;
< -> &lt;
> -> &gt;
" -> &quot;
' -> &#x27;
/ -> &#x2f;
```

2.要将不可信数据插入到HTML属性里时，对这些数据进行HTML属性编码

**编码规则**

除了阿拉伯数字和字母，对其他所有字符进行编码。编码后输出为 `&#xHH;` HH 为对应的十六进制数字，分号作为结束符。
防止在属性值进行构造关闭当前标签。然后自己的标签就可以作为 HTML 实体插入了。

3.在将不可信数据插入到 script 里时，对这些数据进行 script 编码

**编码规则**

除了阿拉伯数字和字母，对其他所有字符进行编码。编码后输出的格式为 `\xHH`。

不要用反斜杠对特殊字符进行转义。

```html
<script>
var message = "{{data}}";
</script>
```

攻击者输入
```
\"; alert('xss');//
```

结果渲染上去之后是
```html
<script>
var message = "\\"; alert('xss');//
</script>
```

4.在将不可信数据插入到 style 属性里时，对这些数据进行 CSS 编码

除了阿拉伯数字和字母，对其他所有字符进行转义，转移之后变为形如 `\HH` 的字符。

5.在将不可信数据插入到 HTML URL 里时，对这些数据进行 URL 编码
除了阿拉伯数字和字母，对其他所有字符进行转义，转义之后变为形如  `%HH`  的字符。

对URL进行编码的时候的注意点：

1. URL属性用引号包含起来
2. 不要对整个URL进行编码，因为不可信数据会插入到 href src 或其他以URL为基础的属性里面，并且要对协议字段进行认证，否则攻击者可以改变协议，如  `data`  协议或者  `javascript`  伪协议

6.使用富文本时，使用 XSS 规则引擎进行编码过滤，使用白名单策略

针对富文本的特殊性，我们可以使用XSS规则引擎对用户输入进行编码过滤，只允许用户输入安全的HTML标签，如 `<b>`，`<i>`， `<p>`等，对其他数据进行 HTML 编码。需要注意的是，经过规则引擎编码过滤后的内容只能放在 `<div>`， `<p>`  等安全的HTML标签里，不要放到 HTML 标签的属性值里，更不要放到HTML 事件处理属性里，或者放到  `<script>` 标签里。

如下就是是一个 XSS 过滤工具
 [GitHub - leizongmin/js-xss: Sanitize untrusted HTML (to prevent XSS) with a configuration specified by a Whitelist](https://github.com/leizongmin/js-xss)

#### DOM Based XSS
DOM Based XSS 的攻击方法是在 JavaScript 将内容写到 HTML 页面中，一般在返回的页面中可能已经对 JavaScript 中的变量进行转义了，但在 script 标签执行的时候，内容又会被解码，然后输出到 HTML 中。因此防御 DOM Based XSS 的时候，一个重要的关注点是在 JavaScript 输出的时候对其进行再次的转义，转义的方案与上面所述相同。

#### 使用 XSS 安全相关的头部

1.X-XSS-Protection

浏览器默认开启了 XSS 保护，可以使用这个头部关闭这种特性，一般不需要关闭：

- 0：禁用XSS保护
- 1：启用XSS保护
- 1：mode=block：启用XSS保护，并在检查到XSS攻击时，停止渲染页面

2.Content-Security-Policy

使用 Content-Security-Policy 可以限制页面可以加载哪些内容

欢迎大家探讨交流，有错误请指正。

## 参考资料

1. 《白帽子将 Web 安全》
2. [一些安全相关的HTTP响应头 | JerryQu 的小站](https://imququ.com/post/web-security-and-response-header.html)
3. [Content Security Policy 介绍 | JerryQu 的小站](https://imququ.com/post/content-security-policy-reference.html)
4. [GitHub - leizongmin/js-xss: Sanitize untrusted HTML (to prevent XSS) with a configuration specified by a Whitelist](https://github.com/leizongmin/js-xss)
5. [DOM Based XSS](https://www.owasp.org/index.php/DOM_Based_XSS)
