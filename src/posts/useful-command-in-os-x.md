---
title: Mac OS X 下一些命令的整理
date: 2016-04-13 22:43:56
category: 学以致用
tags:
- Mac OS X
- 终端
---
记录一些平时不常用到，但是用到的时候又要各种找的命令。

<!-- more -->

## 列表

1.显示与不显示隐藏的文件

```
显示：defaults write com.apple.finder AppleShowAllFiles -bool true
隐藏：defaults write com.apple.finder AppleShowAllFiles -bool false
```

在写入命令后，如果需要立即生效，`option + command + esc`，重新启动 Finder

2.合并两个静态文件

```
显示相关信息：lipo -info <.a 或者 .framework里面的那个可执行文件>
进行合并操作：lipo -create <文件> <文件> -output <文件名>
```

3.修改默认 shell

```
这里修改为fish：chsh -s /usr/local/bin/fish
```

还有一些命令，但是没有记录，如果以后又用到的话就记录下来方便查阅。

4.进入 Swift 命令行工具

```
xcrun swift
```

5.使用 scp 上传文件到云服务器

```
scp /some ubuntu@ipaddress:/some
```

6.`npm` 使用淘宝源

临时使用

```shell
npm --registry https://registry.npm.taobao.org install
```

持久使用

```shell
npm config set registry https://registry.npm.taobao.org
```

查看源

```shell
npm config get registry
```

7.解决设置中`允许从以下位置下载应用`中的`所有来源`消失的问题

```shell
sudo spctl --master-disable
```

8.查看文件夹的权限

```shell
ls -ld dirname
```

9.查看文件的权限

```shell
ls -l filename
```

10.查看所有运行中的 nginx 进程（使用 grep 匹配 nginx）

```shell
ps -ax | grep nginx
```

11.修改文件名或移动文件

```shell
mv a b
```

12.使用 netstat 列出处于监听状态的 TCP 端口和连接

```shell
netstat -tnl
```

13.在终端中以一个单词的间隔前进后退

```
control + shift + b (后退)

control + shift + f (前进)
```

## 更新记录

2016年4月17日：增加 修改默认 shell

2016年4月26日：增加 进入 Swift 命令行工具

2016年5月31日：增加 scp

2016年9月26日：增加 npm 源操作

2017年8月27日：增加终端中移动操作
