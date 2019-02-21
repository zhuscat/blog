---
title: TypeScript rootDirs 是怎么工作的
date: 2018-06-08 09:11:28
category: 学以致用
tags:
- TypeScript
- 配置
---

在 TypeScript 中可以利用 rootDirs 指定虚拟目录，若不了解，可以阅读[Module Resolution · TypeScript](https://www.typescriptlang.org/docs/handbook/module-resolution.html)。

## 解析步骤

在上面链接的文章中有一个假象的国际化场景，通过配置 `rootDirs`，编译器可以解析并不存在的相对模块导入，配置如下所示，其中，并不存在一个文件夹为 `src/${locale}`。

```json
{
  "compilerOptions": {
    "rootDirs": [
      "src/zh",
      "src/de",
      "src/#{locale}"
    ]
  }
}
```

假设我们的项目所在地是 `/dev/project`，有 `/dev/project/src/zh/messages.ts` 文件，有 `/dev/project/src/de/messages.ts` 文件以及 `/dev/project/src/index.ts` 文件，在进行了上述的配置之后，在 `/dev/project/src/index.ts` 文件中导入 `import messages from ‘./#{locale}/messages`，该模块可以被成功解析，实际上编译器认为模块为 `/dev/project/src/zh/messages.ts`，这是怎么做到的呢？

编译时，在 `index.ts` 中的导入语句的相对路径会转换为绝对路径，即 `/dev/project/src/#{locale}/messages`，接着遍历 `rootDirs` 列表，找出与这个路径相比最长的前缀匹配路径，最终确定的是 `/dev/project/src/#{locale}/`，将 `/dev/project/src/${locale}/messages` 与 `/dev/project/src/#{locale}/` 相同的部分去掉，确定要加载的为 **messages**，候选位置为 `/dev/project/src/${locale}/messages`，编译器将会按照相对路径模块导入的解析方法进行模块解析，不过 `/dev/project/src/${locale}/` 目录并不存在，于是编译器会从 `rootDirs` 列表从上到下进行遍历（除去之前选定的那个目录），然后将 **messages** 与路径进行拼接，新的尝试的路径为 `/dev/project/src/zh/`，模块候选位置为 `/dev/project/src/zh/messages`，在此处找到了模块，因此将 `/dev/project/src/zh/messages.ts` 作为模块解析结果。

## 需要注意的
1. `rootDirs` 对编译输出并没有影响，只是让编译器知道模块的含义。

**注**：在 TypeScript 2.8 下进行的测试
