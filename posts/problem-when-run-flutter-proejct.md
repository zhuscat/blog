---
title: 一个跑 flutter 项目遇到的问题
date: 2021-12-26 23:57:00
category: 流水账
tags:
- Flutter
- CocoaPods
---

最近跑 flutter 的一个项目遇到了一个问题

```
flutter run
```

然后安装 Cocoapods 依赖的时候报错了：

```
    [!] CocoaPods could not find compatible versions for pod "JMLink":
      In snapshot (Podfile.lock):
        JMLink (= 1.2.4)

      In Podfile:
        jmlink_flutter_plugin (from `.symlinks/plugins/jmlink_flutter_plugin/ios`) was resolved to 0.0.1, which depends on
          JMLink (= 1.2.4)
```

很久没接触原生开发了，遇到这个问题，一开始的反应是环境配置有问题，因为其他人是能正常跑的

然后我就去网上搜索这个问题，搜的解决方案大概是这些：

到 ios 文件夹里面执行

```
pod repo update –verbose
pod install
```

但是不行，然后说是删掉 `Podfile.lock`，然后再执行还是不行

试了各种方法，各种方式清楚缓存都不行

后来使用了这个命令：

```
pod search JMLink
```

发现并没有 `1.2.4` 这个版本，然后我去查看了 Cocoapods 的 repo list

```
trunk
- Type: CDN
- URL:  https://cdn.cocoapods.org/
- Path: /Users/zhuliangzhen/.cocoapods/repos/trunk

1 repo
```

然后我甚至还怀疑到是不是 trunk 这个 repo 里面缺了一个版本，然后我还把 git repo 下下来试了一下，也是找不到 1.2.4

最终我怀疑其实就是本来 1.2.4 是有了，后来不知道什么原因把 1.2.4 删掉了，然后我找了之前能跑项目的人，让他清除缓存从 0 开始配置，结果果然也不行了。

因为依赖的是一个 flutter plugin，然后是在 flutter plugin 里面声明了对 1.2.4 JMLink 的依赖，所以最终解决方案，fork 了这个 flutter plugin，然后把 `pubspec.lock` 的依赖改成了 git 式的依赖。