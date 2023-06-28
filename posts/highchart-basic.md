---
title: highcharts 入门
date: 2016-08-07 13:47:13
category: 学习笔记
tags:
- 前端
- 学习笔记
- 图表
- JavaScript
---

## 基本

首先，是使用 HIGHCHARTS 创建一个图表，在引用 `jQuery` 的情况下用如下的方法可以创建一个图表。

```
$('#container').highcharts(config);
```

其中，`#container` 是一个 `html` 元素，`config` 是该图表的配置，是一个 `Object`，使用 HIGHCHARTS 基本上就是对配置的编写，以下的内容就是介绍 HIGHCHARTS 的各种配置。

先来看看官方提供的这幅图片，其描述了一个图表所包含的内容，主要就是通过配置这些内容来展现一个图表：

![理解 highcharts](https://i.loli.net/2018/11/17/5befc5d93c171.png)

我们将通过不断地改变配置，最终做出一个简单的图表。

可以通过 [JSFiddle](https://jsfiddle.net) 方便地进行代码的编写。

为了方便描述 `config` 对象，本文中做如下约定：

```
{
  title: {
    text: 'MAIN TITLE'
  }
}
```

以上是一个简单的 `config` 对象，文中将用如下的方式描述:

设置 `title.text` 为 `MAIN TITLE`


## 标题

标题分为主标题(title)和副标题(subtitle)

可以用 `title.text` 设置主标题。

用 `sutitle.text` 设置副标题。

设置了标题之后，代码如下：

```
$(function() {
  $('#container').highcharts({
    title: {
      text: 'MAIN TITLE',
    },
    subtitle: {
      text: 'sub title'
    }
  })
})
```

可以看到运行结果上图表已经显示标题和副标题了。

看到这段代码很容易想到，标题能配置的不仅仅是文字，否则就不用以对象的方式设置标题了，接下来就简单地再扩展一下：

```
$(function() {
  $('#container').highcharts({
    title: {
      text: 'MAIN TITLE',
      align: 'left',
      margin: 20,
      style: {
        color: '#4a4a4a',
        fontSize: '16px'
      }
    },
    subtitle: {
      text: 'sub title'
    }
  })
})
```

以上代码设置了主标题的对齐方式，边距，字体相关的样式，官方还提供了其他许多的接口，可以查看[官方文档](http://api.highcharts.com/highcharts)进一步了解。

## 序列

序列即定义图表上的线，区域或者圆弧之类的数据。通过设置 `series` 来进行配置。可以说，序列是图表中最为重要的部分了。

```
$(function() {
  $('#container').highcharts({
    title: {
      text: 'MAIN TITLE',
      align: 'left',
      margin: 20,
      style: {
        color: '#4a4a4a',
        fontSize: '16px'
      }
    },
    subtitle: {
      text: 'sub title'
    },
    series: [
      {
        data: [1, 4, 8, 2, 5, 6]
      }
    ]
  })
})
```

如上代码所示，添加了 `series`，再次执行代码，就可以看到图表了，默认情况下，图表是折线图，可以通过设置 `series.type` 改变图表的类型。（这里的series指的是上面代码中 series 数组中的一个对象，可以在数组中包含多个这样的对象，图表上就会显示多个不同的“图”，如折线）。

现在，我们让图表显示两条曲线，而不是折线。

```
$(function() {
  $('#container').highcharts({
    title: {
      text: 'MAIN TITLE',
      align: 'left',
      margin: 20,
      style: {
        color: '#4a4a4a',
        fontSize: '16px'
      }
    },
    subtitle: {
      text: 'sub title'
    },
    series: [
      {
        type: 'spline',
        data: [1, 4, 8, 2, 5, 6]
      },
      {
        type: 'spline',
        data: [2, 6, 5, 1, 3, 8]
      }
    ]
  })
})
```

可以看到，series 数组里面现在有两个成员，并设置了 type，不过，可不可以不设置 type 而让整个图表默认为曲线图呢？可以通过设置 `chart.type`。

```
$(function() {
  $('#container').highcharts({
    chart: {
      type: 'spline'
    },
    title: {
      text: 'MAIN TITLE',
      align: 'left',
      margin: 20,
      style: {
        color: '#4a4a4a',
        fontSize: '16px'
      }
    },
    subtitle: {
      text: 'sub title'
    },
    series: [
      {
        data: [1, 4, 8, 2, 5, 6]
      },
      {
        data: [2, 6, 5, 1, 3, 8]
      }
    ]
  })
})
```

`chart` 用来设置图表的一些属性，在更粗粒度的范围内进行设置。另外还可以设置序列的 `name`，这样在图表的说明处会显示你设置的名字。

```
series: [
  {
    name: 's1',
    data: [1, 4, 8, 2, 5, 6]
  },
  {
    name: 's2',
    data: [2, 6, 5, 1, 3, 8]
  }
]
```

在此来说一下 HIGHCHARTS 中的图表类型：

大体上分为

1. 线图
2. 饼图
3. 面积图
4. 直方图
5. 泡泡图

其中，线图又可以分为折线，曲线

面积图也可以分为有折线与坐标轴围成的面积和曲线与坐标轴围成的面积。

具体图表的类型可以查看[官方文档](http://api.highcharts.com/highcharts)。

## 轴

轴有 x 轴和 y 轴。

x 轴通过 `xAxis` 设置。y 轴通过 `yAxis` 设置。需要知道的是，可以同时存在多个 x 轴或者 y 轴。

```
$(function() {
  $('#container').highcharts({
    chart: {
      type: 'spline'
    },
    title: {
      text: 'MAIN TITLE',
      align: 'left',
      margin: 20,
      style: {
        color: '#4a4a4a',
        fontSize: '16px'
      }
    },
    subtitle: {
      text: 'sub title'
    },
    series: [
      {
        data: [1, 4, 8, 2, 5, 6]
      },
      {
        data: [2, 6, 5, 1, 3, 8]
      }
    ]
  })
})
```

以上代码改变 x 轴刻度的间隔为2



## 提示

提示就是将鼠标放置到图表的上面出现的描述性区域。通过 `tooltip` 进行配置。

说一下 tooltip 的结构，头部和体，

```
$(function() {
  $('#container').highcharts({
    chart: {
      type: 'spline'
    },
    title: {
      text: 'MAIN TITLE',
      align: 'left',
      margin: 20,
      style: {
        color: '#4a4a4a',
        fontSize: '16px'
      }
    },
    subtitle: {
      text: 'sub title'
    },
    series: [
      {
        data: [1, 4, 8, 2, 5, 6]
      },
      {
        data: [2, 6, 5, 1, 3, 8]
      }
    ],
    xAxis: {
      tickInterval: 2,
    },
    tooltip: {
      pointFormat: 'The value is {point.y}'
    }
  })
})
```

如上所示，设置了 tooltip 体的内容为 `The value is {point.y}`

其中， `{point.y}` 指的是该点的 y 轴的值

在这里解释一下 `{point.y}`，HIGHCHARTS 会将 `{point.y}` 替换成该点的 y 值。此类语法还有

```
{point.x}
{series.name}
```

更多内容请查阅官方文档。



## 说明

即说明某条线，某个圆弧之类对应的信息。

使用 `legend` 进行配置。

## 标志域与标志线

标志域与标志线可以通过 `xAxis.plotBand` 和 `xAxis.plotLine` 进行配置。

## 缩放

通过 `chart.zoomType` 进行配置。

其值可以是 `x`, `y`, `xy`，分别代表在 x 轴上进行缩放，在 y 轴上进行缩放，xy 轴同时进行缩放。

```
$(function() {
  $('#container').highcharts({
    chart: {
      type: 'spline',
      zoomType: 'x'
    },
    title: {
      text: 'MAIN TITLE',
      align: 'left',
      margin: 20,
      style: {
        color: '#4a4a4a',
        fontSize: '16px'
      }
    },
    subtitle: {
      text: 'sub title'
    },
    series: [
      {
        data: [1, 4, 8, 2, 5, 6]
      },
      {
        data: [2, 6, 5, 1, 3, 8]
      }
    ],
    xAxis: {
      tickInterval: 2,
    },
    tooltip: {
      pointFormat: 'The value is {point.y}'
    }
  })
})
```

## 标签和字符串的格式化

```
$(function() {
  $('#container').highcharts({
    chart: {
      type: 'spline',
      zoomType: 'x'
    },
    title: {
      text: 'MAIN TITLE',
      align: 'left',
      margin: 20,
      style: {
        color: '#4a4a4a',
        fontSize: '16px'
      }
    },
    subtitle: {
      text: 'sub title'
    },
    series: [
      {
        data: [1, 4, 8, 2, 5, 6]
      },
      {
        data: [2, 6, 5, 1, 3, 8]
      }
    ],
    xAxis: {
      tickInterval: 2,
      title: {
        text: 'time'
      },
      labels: {
        format: '{value}s'
      }
    },
    yAxis: {
      title: {
        text: 'distance'
      },
      labels: {
        format: '{value}m'
      }
    },
    tooltip: {
      pointFormat: 'The value is {point.y}'
    }
  })
})
```

如上面的代码所示，可以设置轴上的标题和每个刻度显示的内容。

另外还可以设置 `xAxis.labels.rotation` 控制标签的旋转，

## 下钻

下钻的意思就是点击点击图表的某部分数据显示可以下钻到其更详细的内容，关于下钻的使用方法可以查看 [column-drilldown](http://www.highcharts.com/demo/column-drilldown)

## 结语

写完这篇文章我发现，很难真正讲述 HIGHCHARTS 的方方面面，因为其提供了太多的 API，另外我发现的一个难点是比较难对配置进行描述，如果是强类型的语言可以使用其类型系统进行描述，但是 JavaScript 作为一个弱类型的语言，在描述的时候显得有些吃力，但我相信你对 HIGHCHARTS 的使用已经有一个大体的了解，学习 HIGHCHARTS，重要的是对其所包含的大类进行一个了解（比如包含什么图，可以对哪些方面进行详细的配置），然后再在使用的时候查阅相应的 API 即可。
