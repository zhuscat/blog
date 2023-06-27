---
title: "CSS 选择器学习笔记"
date: 2016-01-28 00:21:45
category: 学习笔记
tags:
- 前端
- 学习笔记
- 开发
- CSS

---

最近需要写一些前端的东西，几个月前也是学习了前端的知识，然后做了一些东西出来，几个月不写不看，发现忘了好多东西，以前也没做什么笔记，现在觉得要是当时做了笔记会好很多，所以现在写一些笔记可以给以后回顾。



# 正文

## 常用的选择器
### 类型选择器

```
p {color: black;}
h1 {font-weight: bold;}
```

### 后代选择器

```
/* 作用于 blockquote 的所有标签为 p 的后代 */
blockquote p {padding-left: 2em;}
```

### ID 选择器与类选择器

```
#intro {font-weight: bold;}
.date-posted {color: #ccc;}
```

### 伪类

```
a:link {color:blue;}

/* 作用于已经访问过并且鼠标悬停在上面的 a 元素 */
a:visited:hover {color: blue;}
```

1. `:link` 和 `:visited` 成为链接伪类，只能应用于锚元素
2. `:hover`、`:active` 和 `:focus` 称为动态伪类，理论上可应用于任何元素

## 通用选择器

```
* {
  padding: 0;
  margin: 0;
}
```

## 高级选择器

注意浏览器的兼容性

### 子选择器和相邻同胞选择器

#### 子选择器

```
/* 只对直接子元素起作用，而后代选择器是对所有后代起作用 */
#nav>li {
  background: url(folder.png) no-repeat left top;
  padding-left: 20px;
}
```

```
/* 对于 IE6 以及更低版本，可实现同样效果 */
#nav li {
  /* style */
}

# nav li * {
  /* style */
}
```

#### 相邻同胞选择器
```
/* 作用于在 h2 后面与其相邻的 p 元素 */
h2 + p {
  font-size: 1.4em;
  font-weight: bold;
  color: #777;
}
```

### 属性选择器

根据属性是否存在应用样式

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>属性选择器</title>
    <style>
    acronym[title] {
      border-bottom: 1px dotted #999;
    }

    acronym[title]:hover, acronym[title]:focus {
      cursor: help;
    }
    </style>
  </head>
  <body>
    <p>The term
      <acronym title="self-contained underwater breathing apparatus">
        SCUBA
      </acronym>
       is an acronym rather than an abbreviation as it is pronounced as a word.
     </p>
  </body>
</html>
```

根据属性值显示样式

```
a[rel="nofollow"] {
  /* style */
}
```

根据属性值之一寻找元素

```
.blogroll a[rel~="co-worker"] {
  /* style */
}
```

### 层叠和特殊性

#### 重要度排序
1. `!important` 用户样式
2. `!important` 作者样式
3. 作者样式
4. 用户样式
5. 浏览器/用户代理应用的样式

如果两个规则特殊性度相同，则后定义的规则优先

#### 特殊性

选择器的特殊性分为4个成分等级：a、b、c 和 d

1. 如果是行内样式，a ＝ 1
2. b 等于 ID 选择器总数
3. c 等于类、伪类和属性选择器的数量
4. d 等于类型选择器和伪元素选择器的个数

| 选择器 | 特殊性 |
|-------|-------|
|style=""|1,0,0,0|
|wrapper #content {}|0,2,0,0|

一般的，`style` 比其他规则特殊，具有 ID 选择器的规则比没有 ID 选择器的规则特殊，具有类选择器的比没有类选择器的特殊，如果两个规则特殊性相同，则后定义优先。

### 继承

直接应用于元素的任何样式总会覆盖继承而来的样式

## 规划、组织和维护样式表

### 对文档应用样式表

两种方式

```
<link href="/css/basic.css" rel="stylesheet" type="text/css" />
<style type="text/css">
<!--
@import url("/css/advanced.css");
-->
</style>
```

### 注释

```
/* 这是注释 */
```

### 寻找特定样式

添加标记，搜索时更方便（可以自己定义这个标志，作者在书中使用 `@group`）

```
/* @group typography */
```

### 结构

#### 一般性样式

- 主体样式
- reset样式
- 链接
- 标题
- 其他元素

#### 辅助样式

- 表单
- 通知和错误
- 一致的条目

#### 页面结构

- 标题、页脚和导航
- 布局
- 其他页面结构元素

#### 页面组件

- 各个页面

#### 覆盖

### 自我提示

通过写一些有关键字的注释来提示自己，比如下面这样的

```
/* Color Variables

@colordef #434343; dark gray
@colordef #369; light green
*/

/* @todo: Rember to do something... */
/* @workaround: I managed to fix this problem in IE
by setting a small negative margin but it's not pretty */
/* @bugfix: Rule break */
```

# 参考资料
1. [《精通CSS·高级Web标准解决方案（第二版）》](http://book.douban.com/subject/4736167/)

