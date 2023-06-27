---
title: LaTex Tips
date: 2016-12-06 13:58:29
category: 学习笔记
tags:
- LaTex
- 技巧
- 学习笔记
- 写作
---

记录了一些 LaTex 的小知识点与资料，不是教程。



## 起步

```latex
\documentclass{article}
% 导言区
\begin{document}
Hello world
\end{document}
```

## 添加标题作者

```latex
\documentclass{article}
\title{Hello world}
\author{zhuscat}
\date{\today}
\begin{document}
\maketitle
Hello world
\end{document}
```

## 支持中文

```latex
\documentclass[UTF8]{ctexart}
\title{Hello world}
\author{zhuscat}
\date{\today}
\begin{document}
\maketitle
你好世界
\end{document}
```

## 加粗

```latex
\textbf{Bold}
```

## 字号

```latex
\begin{small}
小字体
\end{small}
```

## 列表

```latex
\begin{itemize}
    \item item1
    \item item2
    \item item3
    \item item4
\end{itemize}
```

## 参考文献

```latex
\documentclass[UTF8]{ctexart}
\usepackage{cite}
\begin{document}
Hello world\cite{ref1}
\begin{thebibliography}{10}
\bibitem{ref1}
Reference one.
\end{thebibliography}
\end{document}
```
## 写伪代码

使用 `algorithmicx` 包

基本命令：

```latex
\State <text>

\If{<condition>} <text> \EndIf

\If{<condition>} <text> \Else <text> \EndIf

\If{<condition>} <text> \ElsIf{<condition>}  <text> \Else <text> \EndIf

\For{<condition>} <text> \EndFor

\ForAll{<condition>} <text> \EndFor

\While{<condition>} <text> \EndWhile

\Repeat <text> \Until{<condition>}

\Loop <text> \EndLoop

\Require <text>

\Ensure <text>

\Function{<name>}{<params>} <body> \EndFunction

\State \Return <text>

\Comment{<text>}
```
修改`algorithem`, `require`, `ensure` 标签：

```latex
\floatname{algorithm}{算法}
\renewcommand{\algorithmicrequire}{\textbf{输入:}}
\renewcommand{\algorithmicensure}{\textbf{输出:}}
```

例子：

```latex
\documentclass[UTF8]{ctexart}
\usepackage{cite}
\usepackage{algorithm}
\usepackage{algorithmicx}
\usepackage{algpseudocode}
\floatname{algorithm}{算法}
\renewcommand{\algorithmicrequire}{\textbf{数据:}}
\renewcommand{\algorithmicensure}{\textbf{输出:}}
\begin{document}
	\begin{algorithm}
		\begin{algorithmic}[1]
			\Require 两个数相加
			\Ensure 两个数的和
			\Function {Add}{$num1, num2$}
				\State $result \gets num1 + num2$
				\State \Return{$result$}
			\EndFunction
		\end{algorithmic}
	\end{algorithm}
\end{document}
```
## 数学符号以及希腊字母

参考 [常用数学符号的 LaTeX 表示方法](http://www.mohu.org/info/lshort-cn.pdf)

## 学习资料

1. [一份其实很短的 LaTex 入门文档](http://liam0205.me/2014/09/08/latex-introduction/)
2. [一份不太简短的 LATEX2e 介绍](http://www.mohu.org/info/lshort-cn.pdf)
3. [LaTeX/Algorithms 伪代码](http://hustsxh.is-programmer.com/posts/38801.html)
4. [ShareLatex](https://cn.sharelatex.com)