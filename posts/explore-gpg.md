---
title: 对 GPG 的一点探索
date: 2023-10-13 22:14:00
category: 学习笔记
tags:
- 密码学
- 信息安全
---

写这篇文章的起因是最近老婆公司 ERP 系统里的一个业务流程跑不通了，大概流程对方用 PGP （不清楚具体哪款软件，用 PGP 代称，下同）进行加密+签名，我方用 PGP 进行解密+验签，但是最近系统出错，解密不成功，但是系统报错信息比较不清晰，待排查，怀疑可能是 PGP key 过期或者不匹配，顺便我也学了一下相关知识以及软件的使用

我用的是 GnuGP，GnuGP 是一款加密软件，可以管理密钥，对文件进行加密、解密、签名之类的操作，所用的加解密原理是非对称密钥，可以理解为 GnuGP 是 PGP 的开源版本

简明使用方式：

```bash
# 下载安装
brew install gnupg
# 生成密钥
gpg --full-generate-key
# 加密 hello.txt，假设生成密钥时候填的邮箱是 zhudx6512@gmail.com
gpg --recipient zhudx6512@163.com --output hello.txt.gpg --encrypt hello.txt
# 解密
gpg --decrypt hello.txt.gpg
# 导出私钥(ascii格式)
gpg --armor --output private-key.asc --export-secret-keys zhudx6512@gmail.com
# 导入
gpg --import private-key.asc
```

## 名词

- 工程意义上的私钥：利用 `gpg --export-keys` 导出的 key 
- 工程意义上的公钥：利用 `gpg --export-secret-keys` 导出的 key
- 数学意义的私钥：工程意义上的私钥底层对应的真正用于解密/签名的 key
- 数学意义的公钥：工程意义上的公钥底层对应的真正用于加密/验签的 key

## 过期时间是怎么实现的
在生成 PGP 密钥的时候，可以选择过期时间，这个过期时间会作为元信息存储在系统里，加密信息的时候，会校验当前时间和过期时间。另外，这个过期时间也是不能被篡改的，因为还有会有根据对应信息生成的签名，直接改会导致验证签名不通过

## 为什么解密不需要指定邮箱或者 key id
因为加密的信息里面有包含了这部分信息，可以根据这些信息去找到系统中对应的密钥

## 更新过期时间会改变私钥吗
不会改变数学意义上的私钥，所以仍然可以去解密更改过期时间前加密的信息，不过，PGP 导出的私钥实际上还包含其他信息，所以在更新过期时间后，执行命令输出的私钥会和原来不同：
```
gpg --armor --output secret-key.asc --export-secret-keys zhudx6512@gmail.com
```

## 更新过期时间会改变公钥吗
不会改变底层的公钥，PGP 导出的公钥实际上还包含元信息，所以在更新过期时间后，执行命令输出的公钥会和原来不同：
```
gpg --armor --output public-key.asc --export-keys zhudx6512@gmail.com
```

## 撤销证书是如何工作的
如果私钥被盗或者丢失，可以分发撤销证书到公共服务器或者给你期望通知的接受者，GPG 会根据撤销证书将对应的密钥置为无效

## 后记
上面说的 ERP 系统的问题，目前发现的是银行用的公钥和老婆公司用的私钥不是对应的，但还不清楚为什么会出现这种问题（难道有人改了），已经让银行换了，等后续业务再次触发的时候验证，等到时候再更新文章