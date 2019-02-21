---
title: 一些需要在Info.plist中配置的东西
date: 2016-03-23 22:44:53
category: 学以致用
tags:
- iOS
- 开发
- 技术
---

有些东西得在 `Info.plist` 中配置，这里记录一下，持续更新。

<!-- more -->

# UIWebView不能加载某些网址

在 `Info.plist` 中加入以下字段：

```
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
        <true/>
</dict>
```

# 定位权限

在 `Info.plist` 中加入如下字段，值设为YES：
## 允许在前台获取GPS的描述:
```
NSLocationWhenInUseUsageDescription
```

## 允许在前后台获取CPS的描述：
```
NSLocationAlwaysUsageDescription
```
