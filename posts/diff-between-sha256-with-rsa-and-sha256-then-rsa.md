---
title: SHA256 with RSA 和 SHA256 然后 RSA 的区别
date: 2022-01-17 23:57:00
category: 技术
tags:
- 签名
---

## 如何生成 RSA 公钥和私钥

```
$ openssl
OpenSSL> genrsa -out private_key.pem 2048
Generating RSA private key, 2048 bit long modulus
........................................................................................+++
......................................+++
e is 65537 (0x10001)
OpenSSL> rsa -in private_key.pem -pubout -out public_key.pem
writing RSA key
```

## 不同

用一段代码就可以解释 SHA256withRSA 和先对信息进行 SHA256，然后直接 RSA 加密的区别，如下的两种方式输出的签名是一样的，所以我们之后，SHA256withRSA 其实就是多了一步操作：在 SHA256 哈希之后，在生成的摘要前面在加上了一段固定的数据。

```javascript
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

const message = "123"
const privateKey = fs.readFileSync(path.resolve('./private_key.pem'))

// 自己结合 hash 和 RSA 加密实现 SHA256withRSA 签名
let buffer = crypto.createHash("sha256").update(message).digest();
// SHA256withRSA 会在生成的摘要前面固定加上：
// (0x) 30 31 30 0D 06 09 60 86 48 01 65 03 04 02 01 05 00 04 20
buffer = Buffer.concat([
  Uint8Array.from([
    0x30, 0x31, 0x30, 0x0d, 0x06, 0x09, 0x60, 0x86, 0x48, 0x01, 0x65, 0x03,
    0x04, 0x02, 0x01, 0x05, 0x00, 0x04, 0x20,
  ]),
  buffer
]);

const signature1 = crypto.privateEncrypt({
  key: privateKey,
  padding: crypto.constants.RSA_PKCS1_PADDING
}, buffer).toString('hex')


const signature2 = crypto.createSign('sha256WithRSAEncryption').update(message).sign({
  key: privateKey,
  padding: crypto.constants.RSA_PKCS1_PADDING
}).toString('hex')

console.log(signature1 === signature2) // true
```

## 题外话

RSA 加解密中，两对密钥是可以互换的，可以用密钥A加密，密钥B解密，也可以用密钥B加密，密钥A解密。但是在实际工程实现中，私钥和公钥是严格区分的，具体原因在[这篇帖子](https://v2ex.com/t/704756)中详细的描述了，我引用一下：

> 1. 你说的这个“可逆”的在 RSA 的原理上是正确的，更严格的说法是叫“对称”的，注意这里说的是数学上的轮换对称那个对称，而不是对称 /非对称加密里的那个对称，以防杠精
> 2. 之所以实际使用中不能互换使用，原因是我们平时使用的叫作私钥的那个文件，除了包含私钥本身，还额外地包含了一些信息，细节详见 6 楼，注意加解密过程中真正需要用到的只有[n,d]，这才是真正数学意义上的“私钥”，而实际的私钥文件里除了[n,d]以外还记录了 p/q 等用于产生私钥的原始值，利用这些值可以把公钥重新推导出来，也就是
>    (工程意义上的公钥) = (数学意义上的公钥)
>    (工程意义上的私钥) = (数学意义上的私钥) + (数学意义上的公钥)
>    所以如果你真的互换使用，程序直接就报错了，因为期待的私钥和公钥的文件格式是不一样的，但是如果你手动去解析真正的[n,e]和[n,d]值并喂给底层的 RSA 过程，使用完全没有问题
> 3. 那么假设我们统一工程上的私钥和公钥文件的格式，去掉私钥文件中的原始信息，都只包含数学密钥本身，是否就可以任意互换使用了呢？答案是仍然不能，原因是在原始的 RSA 原理定义里，质数 e 应该是随机选取的，但是实际工程应用中，固定为了 3 或者 65537，所以如果你把实际的私钥当成了公钥分发出去，有心人如果看到里面的 e 值不是 3 或 65537，就可以猜测你用反了，并且尝试用 3 或 65537 来生成对应的“私钥”
> 4. 一句话总结就是，在数学上，私钥和公钥是轮换对称的，可以互换使用，到底哪个是私钥哪个是公钥取决于哪个保密哪个任意分发，但是在实际工程上由于两点原因，不能互换使用，对于死记硬背“只能公钥加密私钥解密，私钥签名公钥验签”并以此为论据来嘲讽楼主的，你们好好去看看，在 RSA 里，加密和签名就是完全一模一样的过程(再次强调，仅限 RSA，不包括其他的非对称算法)


## 参考

1. [SHA256withRSA what does it do and in what order?](https://stackoverflow.com/questions/21018355/sha256withrsa-what-does-it-do-and-in-what-order)
2. [聊聊密码学中的Padding](https://cloud.tencent.com/developer/article/1499219)
3. [RSA中如果将公钥私钥交换使用会怎样？](https://segmentfault.com/q/1010000002932436)
4. [在 RSA 加密中既然公钥和私钥是可逆的，为什么都是把公钥给别人，而不把私钥给别人，自己保存好公钥？](https://v2ex.com/t/704756)
5. [如何设计一个API签名](https://cloud.tencent.com/developer/article/1557750)

