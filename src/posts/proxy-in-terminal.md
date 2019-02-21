---
title: 在终端中使用代理
date: 2016-10-01 19:52:17
category: 学以致用
tags:
- 工具
- 代理
- 终端
- shadowsocks
---

一直使用 `shadowsocks` 翻墙，之前一直以为开了 `shadowsocks` 客户端的全局模式之后终端也是走代理的。近期要升级一下 `CocoaPods`，然后发现终端压根就没走代理，东西根本就没有下载下来。

寻找了许多方法，最后采用了本文说的办法。

## 下载 ProxyChains-NG

首先请确保你安装了 `homebrew`，没安装的话安装一下。

接着在终端中执行等待安装结束

```shell
$ brew install proxychains-ng
```

## 配置 ProxyChains-NG

打开 `usr/local/etc/proxychains.conf`

在 [ProxyList] 下面加上

```
socks5 127.0.0.1 1080
```

## 关闭系统安装限制

重启电脑，开启时按住 `command + R`，然后点击实用工具 -> 终端，输入

```shell
$ csrutil disable
```

再次重启电脑

## 测试

在终端中输入

```shell
$ proxychains4 google.com
```

如果成功返回信息，则证明设置成功了。(以后要进行代理的命令就在前面加 `proxychains4` )。



PS：跟墙斗争好累😫😫😫