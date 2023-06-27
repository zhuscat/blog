---
title: 协变、逆变、双向协变
date: 2021-12-09 23:57:00
category: 思绪贴士
tags:
- TypeScript
- 类型系统
---

## 关于协变

协变类型保留底层类型之间的子类型关系

如 `Triangle` 是 `Shape` 的子类，那么 `Triangle[]`也是`Shape[]`的子类，`LinkedList<Triangle>`是`LinkedList<Shape>`的子类。

在大部分编程语言中，函数的返回值是协变的，如：

`() => Triangle` 是 `() => Shape` 的子类型

## 关于逆变

逆变是反转了底层类型之间的子类型关系
在大部分编程语言中，函数的参数是逆变的，比如：

`(s: Shape) => void` 是 `(t: Triangle) => void` 的子类型，怎么理解？

比如我用到一个类型为 `(t: Triangle) => void` 变量，我能做的事情是调用这个函数，传入一个 `Triangle` 类型的变量进行，那么 `(s: Shape) => void` 类型的变量赋值给 `(t: Triangle) => void` 会有问题吗，我们看看 `Triangle` 类型的变量能不能赋值给 `(s: Shape) => void`，结果是可以的，因为 `Triangle` 是 `Shape` 的子类，所以 `Shape` 有的属性/方法 `Triangle` 都有

### 双变

不过 TypeScript 中的函数具有双变性：

https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-function-parameters-bivariant

为什么这样设计呢？看上面链接中的一段代码：

```typescript
function trainDog(d: Dog) { ... }
function cloneAnimal(source: Animal, done: (result: Animal) => void): void { ... }
let c = new Cat();

// Runtime error here occurs because we end up invoking 'trainDog' with a 'Cat'
cloneAnimal(c, trainDog);
```

像上面的代码是可以编译通过的，然而在运行时会造成一个错误，就是因为 TS 中函数是双变的，你可能觉得这样不合适，那么想一下，你觉得 `Triangle[]` 可以赋值给 `Shape[]` 吗？我们期望是可以的，否则很多地方的代码会变得非常烦人了。比如我们肯定希望 `Triangle[]` 可以作为 `drawShapes(shapes: Shape[]) => void` 的参数
那这就要求 `Triangle[]` 的每个成员都需要能够赋值给 `Shape[]`

因为数组是有方法的，比如 `push` 方法，那么 `Triangle[].push` 需要可以赋值给 `Shape[].push`
也就是说 `(x: Triangle) => number` 可以赋值给 `(x: Shape) => number`

如果上面的描述能够成立的话，这就不仅仅要求函数的参数具有逆变性，还需要有协变性，也就是说，TypeScript 的函数具有双变性，这是设计上的一种 Trade Off

我们可以设置 TS 的[--strictFunctionTypes](https://www.typescriptlang.org/tsconfig/#strictFunctionTypes)开启函数子类型的强制性检查，这样函数参数就只能逆变了