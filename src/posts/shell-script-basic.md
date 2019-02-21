---
title: Shell Script 基本语法
date: 2017-08-27 21:38:34
category: 学习笔记
tags:
- shell script
- linux
- unix
---

假定大家是有编程基础以及使用 bash 的命令行的经验，因此只是简单的列举一下语法以及需要注意的地方。

## 注释
注释使用 `#` 号，如

```bash
# this is a comment
```

## 第一个简单的 script

```bash
#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
echo -e "Hello World!\n"
exit 0
```

先说说第一行，这里的意思是告诉系统，用 `/bin/bash` 这个程序去执行下面的内容。

接着就没有什么好说的了，`export PATH` 是将 `PATH` 设为环境变量，这个程序就是简单的输出 `Hello World!`

## 默认变量

平时使用一些命令的时候都会带有参数，那么在 shell script 中，如何获取这些参数呢，通过 `$0 $1 $2 … $n` 这变量即可，比如下面这条：

```
runapp one two three
```

- `$0` 为 `runapp`
- `$1` 为 `one`
- `$2` 为 `two`
- `$3` 为 `three`

另外还有几个特殊的变量：

- `$#` 代表变量个数，不包括 `$0`
- `$@` 代表 `$1 $2 $3 … $n`，如用上面的例子，则为 `one two three`
- `$*` 代表 `$1c$2c$3c…$n`，`c` 表示分隔字符默认情况下为空格，用上面的例子则为 `one two three`

另外，在 `shell script` 中，我们可以使用 `shift` 对变量进行偏移，如

```bash
#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

shift 2
echo $1
echo $2
exit 0
```

在输入

```bash
./example.sh one two three four
```

由于  `shift`  了 2 个变量，最终输出为  `three`  跟  `four`

## 条件

```bash
if [ condition1 ]; then
  # doFirst
elif [ condition2 ]; then
  # doSecond
else
  # doThird
fi
```

大体语法如上所示，我们可以在条件判断中使用 `&&` 跟 `||`

比如

```bash
if [ condition1 ] && [ condition2 ]; then
  # doSomething
fi
```

注意 `[` 右边的空格和 `]` 左边的空格是必须的，还需要注意的一点是，`&&` 与 `||` 的优先级是相同的，并从左向右执行，而我们接触的大多数语言中 `&&` 的优先级比 `||` 高。

另一种条件判断的语句是 `case … esac`，可以将其类比为 JavaScript 中的 switch 语句，语法如下：

```bash
case $var in
  "case1")
    # doCase1
    ;;
  "case2")
    # doCase2
    ;;
  *)
    # doDefault
    ;;
esac
```

注意 `)` 和 `;;` 都是必须的，而 `*)` 相当于 JavaScript 的 switch 语句中的 `default`

## 函数

```bash
function foo() {
  # doSomethingHere...
}
```

函数也可以有内置变量，比如这样调用上面的函数：

```bash
foo 1
```

则在函数体中，`$1` 为 `1`

## 循环

第一种：

```bash
while [ condition ]
do
# do something...
done
```

第二种：

```bash
until [ condition ]
do
# do something...
done
```

上面这两个语句的不同点事， `while` 是满足 `condition` 则执行下面的语句，而 `until` 是满足 `condition` 则停止执行。

另外还有 `for` 循环，实例如下

```bash
for num in one two three
do
  echo $num
done
```

输出为

```
one
two
three
```

此外 `for` 循环还能这么写：

```bash
for ( ( i = 1; i <= 2; i=i+1 ) )
do
  echo $i
done
```

输出为

```
1
2
```
