---
title: "NSDate 学习笔记"
date: 2016-01-17 14:08:02
category: 学习笔记
tags:
- 学习笔记
- 技术
- 开发
- Swift
- iOS

---
日期与时间是一个在开发中经常要用到的，最近看到了一篇 [NSDate 的教程](http://swift.gg/2015/12/14/a-beginners-guide-to-nsdate-in-swift/)，写的很详细，但是不免有些枯燥与乏味，即使是一个 iOS 初学者，也能很快明白 NSDate 的内容，其实主要就是一些函数的使用，只要照着下面的代码打一遍，弄明白每一条语句的作用，基本上就是会使用了，我也是照着那篇教程打了一遍，顺便加了注释，所以这次就直接给出代码了。

<!-- more -->

# 代码

```
import UIKit

// NSDate 与 String 的转换

let currentDate = NSDate() //初始化NSDate对象即可获取当前时间
//Jan 17, 2016, 1:01 PM

let dateFormatter = NSDateFormatter()
// 默认采用设备中的位置信息

dateFormatter.locale = NSLocale.currentLocale()
// 设置当前位置，默认就是这样

//dateFormatter.locale = NSLocale(localeIdentifier: "fr_FR")
// 设置为法国

// 用Date Formatter Style 为输出设置格式

dateFormatter.dateStyle = NSDateFormatterStyle.FullStyle
// 设置 Date Formatter Style 为 FullStyle

var convertedDate = dateFormatter.stringFromDate(currentDate)
// 将currentDate转换为 String

dateFormatter.dateStyle = NSDateFormatterStyle.LongStyle
// 设置 Date Formatter Style 为 LongStyle

var convertedDate2 = dateFormatter.stringFromDate(currentDate)
// 将currentDate转换为 String
// .FullStyle .LongStyle .MediumStyle .ShortStyle

/*
EEEE: 表示星期, 使用1-3个字母为缩写
MMMM: 月份全写, 1-3个字母为缩写
dd: 日期
yyyy: 年份
HH: 小时
mm: 分钟
ss: 秒
zzz: 时区
GGG: BC 或者 AD
*/

dateFormatter.dateFormat = "EEEE, MMMM dd, yyyy"
convertedDate = dateFormatter.stringFromDate(currentDate)

var dateAsString = "2016-01-16 08:00"
dateFormatter.dateFormat = "yyyy-MM-dd HH:mm"
var newDate = dateFormatter.dateFromString(dateAsString)
//返回 NSDate?

let calendar = NSCalendar.currentCalendar()

let dateComponents = calendar.components([NSCalendarUnit.Day, NSCalendarUnit.Month,
    NSCalendarUnit.Year, NSCalendarUnit.WeekOfYear, NSCalendarUnit.Hour,
    NSCalendarUnit.Minute,NSCalendarUnit.Second, NSCalendarUnit.Nanosecond],
    fromDate: currentDate)
// 第一个参数是 NSCalendarUnit 的数组, 没有在数组中列出的内容不能在 dateComponents 中访问
// 否则会引发一个运行时错误

print("day = \(dateComponents.day)")

// 将 NSDateComponents 转变为 NSDate
let components = NSDateComponents()
components.day = 16
components.month = 1
components.year = 2016
components.hour = 8
components.minute = 30
components.timeZone = NSTimeZone(abbreviation: "CST")
newDate = calendar.dateFromComponents(components)
//从 NSDateComponents 转变为 NSDate 需要用一个 NSCalendar 实例

print("Earlier date: \(newDate!.earlierDate(currentDate))")
// 比较时间方法1, 还有 laterDate, 会返回 NSDate

if newDate!.compare(currentDate) == NSComparisonResult.OrderedAscending {
    print("newDate is elarlier than currentDate.")
}
// 比较时间方法2, 返回 NSComparisonResult

/*
NSComparisonResult
1. OrderedAscending
2. OrderedDescending
3. ORderedSame
*/

if newDate!.timeIntervalSinceReferenceDate < currentDate.timeIntervalSinceReferenceDate {
    print("newDate is elarlier than currentDate.")
}

if newDate!.isEqualToDate(currentDate) {
    print("newDate is equal to currentDate.")
}
else {
    print("newDate is not equal to currentDate.")
}

var calculatedDate = NSCalendar.currentCalendar().dateByAddingUnit(.Month,
    value: 1, toDate: currentDate, options: NSCalendarOptions.init(rawValue: 0))

calculatedDate = NSCalendar.currentCalendar().dateByAddingUnit(.Day,
    value: 3, toDate: calculatedDate!, options: NSCalendarOptions.init(rawValue: 0))
// 使用 NSCalendarUnit 增加时间

let newDateComponents = NSDateComponents()
newDateComponents.month = 1
newDateComponents.day = 3

calculatedDate = NSCalendar.currentCalendar().dateByAddingComponents(newDateComponents,
    toDate: calculatedDate!, options: NSCalendarOptions.init(rawValue: 0))
// 使用 NSDateComponents 增加时间

// 还可以用 dateByAddingTimeInterval

var diffDateComponents = NSCalendar.currentCalendar().components([NSCalendarUnit.Day],
    fromDate: newDate!, toDate: currentDate, options: NSCalendarOptions.init(rawValue: 0))

print("The difference of day: \(diffDateComponents.day)")
//计算时间差值

let dateComponentsFormatter = NSDateComponentsFormatter()
dateComponentsFormatter.unitsStyle = NSDateComponentsFormatterUnitsStyle.Full
// 可以指定不同的 NSDateComponentsFormatterUnitsStyle

let interval = currentDate.timeIntervalSinceDate(newDate!)

print(dateComponentsFormatter.stringFromTimeInterval(interval)!)
```

# 参考资料
1. [Swift 的 NSDate 初学者指南](http://swift.gg/2015/12/14/a-beginners-guide-to-nsdate-in-swift/)
