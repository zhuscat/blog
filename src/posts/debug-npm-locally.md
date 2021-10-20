---
title: 如何在本地调试 npm
date: 2021-10-20 09:55:16
category: 学以致用
tags:
- JavaScript
- npm
---

在被调试的包中执行：`npm link` 或者 `yarn link`

然后在其他项目中可以执行 `npm link package_name` 或者 `yarn link package_name`

**注：** `package_name` 是在 `package.json` 中定义的 `name`
