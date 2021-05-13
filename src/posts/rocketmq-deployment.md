---
title: 在 macOS 本地部署 RocketMQ
date: 2021-05-13 22:28:00
category: 学以致用
tags:
- 技术
- 后端
- 消息队列
- 实践
---
现在公司用了 RocketMQ，所以想自己在本地部署看看。有两种方式，一种是下载源码自己编译，一种是直接下载编译好的：

[下载地址](https://rocketmq.apache.org/docs/quick-start/)

```bash
# 自己编译
> unzip rocketmq-all-4.8.0-source-release.zip
> cd rocketmq-all-4.8.0/
> mvn -Prelease-all -DskipTests clean install -U
> cd distribution/target/rocketmq-4.8.0/rocketmq-4.8.0
```

编译完之后先启动 Name Server 再启动 Broker

比如说在 Binary 的包里面，在 `bin` 目录下面，执行：

```bash
# 运行 name server，默认端口是 9876
./mqnamesrv
# 运行 broker
./mqbroker -n localhost:9876
```

一开始我启动的时候一直失败，报错大概是这样的

```bash
Error: Could not create the Java Virtual Machine.
```

后来排查到是 Java/JDK 版本的问题（不太了解 Java 体系，反正是版本问题，之后可以好好学习一下），当时是 `jdk-9.0.1.jdk` ，然后我就再安装了 `openjdk 8`，用 Homebrew 装就行了

```bash
brew install openjdk@8
```

然后 link 一下

```bash
sudo ln -sfn /usr/local/opt/openjdk@8/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-8.jdk
```

然后我还修改了 `JAVA_HOME`

```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-8.jdk/Contents/Home
```

改完之后就可以运行起来了

```bash
> mqnamesrv
> mqbroker -n localhost:9876
```

然后就可以跑 Demo 试试了，然后我想弄个 console 试下

```bash
# 下载源码
> git clone https://github.com/apache/rocketmq-externals.git
# 进入对应目录
> cd rocketmq-console
# 编译，产物在 target 里面
> mvn clean package -Dmaven.test.skip=true
```

编译完之后运行一下

```bash
java -jar target/rocketmq-console-ng-2.0.0.jar --rocketmq.config.namesrvAddr='localhost:9876'
```

`rocketmq-externals` 的 master 分支 console 的版本是 2.0.0，然后进入 Web 管理界面的时候发现报错，大概是：

```
rocketmq org.apache.rocketmq.remoting.exception.RemotingConnectException:connect to <127.0.0.1:9876> failed
```

通过更改各种 `namesrvAddr` 的方式都没有用，网上一顿找才找到一个解决方案是使用 1.0.0 版本的 console

```bash
# 切换分支到 console 1.0.0 版本的
> git checkout rocketmq-console-1.0.0
> mvn clean package -Dmaven.test.skip=true
> java -jar target/rocketmq-console-ng-1.0.0.jar --rocketmq.config.namesrvAddr='localhost:9876'
```

使用 1.0.0 版本运行就完美了，本地部署大概就是这样
