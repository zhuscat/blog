---
title: "fish shell"
date: 2016-04-17 17:50:18
category: 实用工具
tags:
- 实用工具
---
今天安装了 fish shell，之前一直用的是 bash，使用了之后发现真的方便了好多，这里简单的记录一下。



## 安装
首先说一下我是在 Mac OS X 下使用的。最方便的当然是使用 Homebrew 了，在终端中输入：

`brew install fish`

等待安装完成后，再将 fish shell 设置为默认的 shell

1. 更改 `/ect/shells` 文件，向其中添加一行，内容为 `/usr/local/bin/fish`
2. 在终端中执行命令 `chsh -s /usr/local/bin/fish`，重启终端之后，就是 fish shell 了

## 配置

fish shell 的一个特色是语法的高亮，并且内置了一些配色方案，可以在终端中执行 `fish_config` 进入 Web 管理界面，里面还有许多其他可以配置的东西。

另外说一下关于环境变量的东西，之前使用 bash 的时候在 `.bash_profile` 里面写了一些东西。改成 fish shell 之后需要写入 `~/.config/fish/config.fish` （如果没有这个文件的话就自行创建一个）

比如我之前设置了在 `.bash_profile` 中写了：

`export PATH=$PATH:/path`

在 `config.fish` 中是这么写的：

`set -x PATH /path $PATH`

另外，原来我设置了 MySQL 的 alias，那么现在需要在 `config.fish` 中写入：

`alias mysql="/usr/local/mysql/bin/mysql"`

fish shell 有许多易用的地方，比如 tab 补全，用右方向键填充其给你的智能建议，通过高亮的颜色提示你命令是否可以运行，目录文件是否存在等等，极大的提高了 shell 的易用性。

当然，还有其他很多特色，详细的信息可以去 [fish shell 的官方网站](http://fishshell.com) 查看。


