---
title: 使用 Whistle 对 iOS HTTPS 进行抓包
date: 2017-09-20 20:35:29
categories: 学以致用
tags:
- 抓包
- 网络
- Web
---

[Whistle](https://github.com/avwo/whistle) 是一款 Web Debugging Proxy，类似的工具还有 Fiddler，Charles。不过，Fiddler 在 macOS 上不尽完美（我没有开启成功过，不知道什么情况），Charles 则是收费的。而 Fiddler 作为一款免费的开源软件，也能够满足开发中调试的要求。

软件的使用方法就不多做介绍了，直接看官方文档即可，不过有一个比较重要的点这里记录一下，就是对 HTTPS 进行抓包。

第一步，安装 Whistle

```
$ npm install whistle -g
```

第二步，开启 Whistle

```
$ w2 start
```

稍后就会显示类似于下面的提示：

![w2 start](https://i.loli.net/2018/11/17/5befc619817f1.png)

这时，我们设置自己手机的代理（以 iOS 11 为例），在设置 -> Wi-Fi -> 点击连接的网络右边的 i 图标

![setting1](https://i.loli.net/2018/11/17/5befc20446ad7.jpg)

点击 HTTP 代理

![setting2](https://i.loli.net/2018/11/17/5befc203b43b6.jpg)

将 HTTP 代理设为手动，并填入 Whistle 提示中的 IP 与端口

![setting3](https://i.loli.net/2018/11/17/5befc619817f1.png)

现在，手机的流量就会经过电脑代理了

下一步就是实现 HTTPS 的抓包

手机访问 `rootca.pro`，开始安装证书，一路通过就可以了

然后是电脑安装证书，访问 [https://127.0.0.1:8899/](https://127.0.0.1:8899/)，然后点击 HTTPS 选项，点击证书下载。我用的是 macOS，将下载下来的证书拖到钥匙串访问应用中去即可。注意，我们要让该证书成为受信任的根证书。找到拖入的证书（以 whistle 开头的那个），右键，显示简介，信任，始终信任。

你以为这样就好了吗？文章的标题是**使用 Whistle 对 iOS HTTPS 进行抓包**，做好了上面的设置之后，iOS 上安装的证书还不是受信任的根证书，虽然证书显示已验证，但是我们需要到设置 -> 关于本机 -> 证书信任设置里对针对根证书启用完全信任。

之后就可以愉快的进行抓包了。

之前主要是在安卓上进行过相应操作，没想到在 iOS 上还要做这一步操作，所以记录一下。
