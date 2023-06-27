---
title: 在 Swift 中使用 SQLite3
date: 2016-04-23 14:33:17
category: 学习笔记
tags:
- iOS
- Swift
- 学习笔记
---
这篇文章简单的描述了一下如何在 Swift 中使用 SQLite3，并简单地说记录一下一些函数的使用。



# 正文

## 添加库

点击项目设置，选择 TARGETS 中的项目，在 Linked Frameworks and Libraries 中点击 + 号，选择 libsqlite3.0.tbd 或者 libsqlite3.tdb

添加桥接头文件，创建一个`.h`文件，在里面写上：

```
#import <sqlite3.h>
```

在项目设置中，在 TARGETS 中点击你的项目，选择 Build Settings ，在 Objective-C Bridging Header 中添加你的桥接头文件，到这一步，你就可以在你的项目中使用 SQLite3 了

## 一些函数

1、连接数据库

```
sqlite3_open(filename: UnsafePointer<Int8>,
ppDb: UnsafeMutablePointer<COpaquePointer>)
```

打开一个数据库，根据传入的文件名，第二个参数是传入一个指针，打开成功后将指针置为一个数据库连接，如果文件不存在，则会创建文件，当操作成功时，函数返回 `SQLITE_OK`

2、预编译

```
sqlite3_prepare_v2(db: COpaquePointer,
zSql: UnsafePointer<Int8>,
nByte: Int32,
ppStmt: UnsafeMutablePointer<COpaquePointer>,
pzTail: UnsafeMutablePointer<UnsafePointer<Int8>>)
```

对 SQL 语句进行预编译

db: 一个数据库连接，如之前用 sqlite3_open 函数后第二个参数被改变的值

zSql: 要求进行预编译的语句

nByte: 语句的长度，如果传入-1，则视为读到第一个 zero terminator 后结束

ppStmt: 预编译的句柄

pzTail: 如果其不是 NULL 的话，指向 zSql 中的第一个 SQL 语句之后的第一个字符

3、执行SQL语句

```
sqlite3_exec(COpaquePointer,
sql: UnsafePointer<Int8>,
callback: ((UnsafeMutablePointer<Void>, Int32, UnsafeMutablePointer<UnsafeMutablePointer<Int8>>, UnsafeMutablePointerPointer<UnsafeMutablePointer<Int8>>) -> Int32),
UnsafeMutablePointer<Void>,
errmsg: UnsafeMutablePointer<UnsafeMutablePointer<Int8>>)
```

一共五个参数，用于执行SQL语句

第一个参数：一个数据库连接
第二个参数：要执行的SQL语句
第三个参数：执行SQL语句之后的回调，一般是传入nil
第四个参数：第三个参数的第一个参数，一般是传入nil
第五个参数：错误信息，一般传入nil

4、执行SQL语句后获取执行结果信息的函数

这里有许多函数：

```
// 传入一个句柄，之前的stmt
// 如果返回的是SQLITE_ROW，则说明还依旧有记录存在，可以进行读取
sqlite3_step(COpaquePointer)
// 获取列数
sqlite3_column_count(pStmt: COpaquePointer)

// 获取列名，为第N列
sqlite3_column_name(COpaquePointer, N: Int32)

// 获取第iCol列的数据类型
// 如int类型返回SQLITE_INTEGER
// 数据类型比较多，可以进头文件看一下
sqlite3_column_type(COpaquePointer, iCol: Int32)

// 获取执行结果中一条记录中第iCol列的数据，且是一个int类型的
// 类似的函数有许多，都是以sqlite3_column_开头的，用法类似，大家可以自己试一下
sqlite3_column_int(COpaquePointer, iCol: Int32)
```

5、绑定数据

可以绑定 SQL 语句中的 `?`

```
// 第一个参数：stmt句柄
// 第二个参数：第几个参数，以1开始
// 绑定的值
// 有许多sqlite_bind_开头的函数，用法类似
sqlite_bind_double(COpaquePointer, Int32, Double)
```

6、一些stmt句柄的操作

```
// 重置句柄
sqlite3_reset(pStmt: COpaquePointer)

// 关闭句柄
// 在结束 SQL 语句的使用之后，要调用这个函数
sqlite3_finalize(pStmt: COpaquePointer)
```

## 注意点
在 Swift 中使用 SQLite3 要注意的点就是注意类型，因为这是一个C语言的库，所以在 Swift 中使用有一些麻烦。
比如字符串传入的是C字符串，需要将 Swift 中的 String 进行转换，如：

```
"EXAPMLE".cStringUsingEncoding(NSUTF8StringEncoding)
```
类似的转换还有许多，都是需要注意的。

## 写在最后

一开始本来只是简要的写一下，结果发现内容很多，还有许多没写的，等待以后慢慢完善吧。

# 更新记录

2016年4月23日：修改一个地方的格式问题