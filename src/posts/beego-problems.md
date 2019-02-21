---
title: "使用Beego的时候遇到的坑"
date: 2016-06-07 09:38:19
category: 学以致用
tags:
- Go
- Beego
- 开发
- 实践
---

记录使用 Beego 的时候遇到的一些问题以及解决方案。

## 存到 MySQL 数据库里的时间跟读取出来的时间有时差

原因是保存时间的时候转换成UTC时间，读取时间的时候按照的是本地的时区，然后时间就慢了8个小时，下面是解决办法

给对应的连接字符串设置一下时区：

```
"root:root@/db?charset=utf8&loc=Asia%2FShanghai"
```

设置 `orm`的默认时区：

```
orm.DefaultTimeLoc, _ = time.LoadLocation("Asia/Shanghai")
```

## 表单中未选择文件提交发生 Runtime Error

代码如下，当没有上传文件的时候会引发 `runtime error: invalid memory address or nil pointer dereference`

```
func (c *FormController) Post() {
    f, h, err := c.GetFile("uploadname")
    defer f.Close()
    if err != nil {
        fmt.Println("getfile err ", err)
    } else {
        c.SaveToFile("uploadname", "/www/"+h.Filename)
    }
}
```

将代码改为下面这样就行了：

```
f, h, err := c.GetFile("uploadname")
if err != nil {
	// handle
}
defer f.Close()
```

这样可以在没有文件上传的时候检测到错误并做一些处理退出函数，并且是在 `defer f.Close()` 语句执行以前，所以不会引发上面的那个错误。
