---
title: 近期遇到的问题解决
date: 2016-10-16 11:53:13
category: 学以致用
tags:
- Eclipse
- MySQL
---
之前重装过 `homebrew`，又更新过系统，刚才用 `Eclipse` 跑一个项目出现了几个问题，这里是遇到问题的解决方案，供以后遇到问题时候快速查看。

**1. 解决 Eclipse 中无法绑定 tomcat 8.5 的问题**

[How to use Tomcat 8.5.x and TomEE 7.x with Eclipse?](http://stackoverflow.com/questions/37024876/how-to-use-tomcat-8-5-x-and-tomee-7-x-with-eclipse)

修改 tomcat 的描述信息使 Eclipse 以为是 tomcat 8.0。

**2. 解决 Eclipse 添加服务器 server name 一栏为空的问题**

[Eclipse add Tomcat 7 blank server name](http://stackoverflow.com/questions/14791843/eclipse-add-tomcat-7-blank-server-name)

Eclipse 的一个 BUG，通过删除特定的文件即可解决。

**3. 解决 MySQL 无法启动问题**

[Warning the user/local/mysql/data directory is not owned by the mysql user](http://stackoverflow.com/questions/5527676/warning-the-user-local-mysql-data-directory-is-not-owned-by-the-mysql-user)

[Can't Start MySQL on Mavericks](http://stackoverflow.com/questions/24697558/cant-start-mysql-on-mavericks)

按照链接中的内容做就好了。
