---
title: "Swifter 读书笔记"
date: 2016-04-26 16:47:03
category: 学习笔记
tags:
- 学习笔记
- 技术
- 开发
- Swift
- iOS
---
读了《SWITER 100个Swift必备Tips》，记录了一些东西。

<!-- more -->

1. 将 `protocol` 的方法声明为 `mutating` ，可以改变 `struct` 或者 `enum` 中的属性值
2. 初始化方法顺序：先设置子类自己需要初始化的参数，再调用父类的初始化方法，最后调用父类中需要改变的参数
3. 在 `init?` 中可以对 `self` 赋值
4. 获取 `Self` 类型的实例， `self.dynamicType.init()` ，要求需要有 `required` 关键字修饰的初始化方法
5. 初始化方法对属性的设定，以及在 `willSet` 和 `didSet` 中对属性的再次设定都不会再次触发属性观察器的调用
6. 属性观察调用顺序 `get`（实现 `didSet` 时， 用来获取 oldValue) `willSet` `set` `didSet`
7. protocol extension 可以为 protocol 中定义的方法提供一个默认的实现。
8. Swift 中是没有泛型接口(protocol)的，但是使用一个必须实现的别名，在一定程度上算是一种折衷
9. 添加编译符号：Build Settings -> Swift Compiler -> Custom Flags -> Other Swift Flags -> `-D FREE_VERSION`
10. 如果 Class 是 NSObject 的子类，Swift 会默认自动为所有的非 private 的类和成员加上 `@objc`
11. 用 `@objc(someName)` 来改变类或方法的名字（与 Objective-C 进行混编的时候 Objective-C 中的名字）
12. 在 Swift 2.0 之后，实现可选接口可以通过接口扩展的方式来实现
13. 在访问的时候不会已经被释放的话尽量使用 `unowned`，如果存在被释放的可能就用 `weak`
14. 使用初始化方法(init)的话，就不需要面临自动释放的问题了，每次在超过作用域后，自动内存管理都将为我们处理好内存相关的事情
15. C 中的 `const Type *` 对应于 Swift 中的 UnsafePointer，`Type *` 对应于 UnsafeMutablePointer
15. 调用 C 动态库，如果一个动态库暂时没有 module 化，可以使用桥接的形式使用
16. 字符串插值的时候将直接使用类型的 `Streamable`，`Printable`，`DebugPrintable` 接口，按照先后次序，前面没有使用用后面
17. 原来的 `NS_OPTIONS` 被映射为了满足 `OptionSetType` 接口的 `struct` 类型，以及一组静态的 `get` 属性
18. 对于原来的 `kNilOptions`，现在可以直接用一个空集合表示 `[]`
19. 使用 `@asmname` 可以将某个C函数直接映射成Swift中的函数
20. Swift的 `sizeofValue` 所返回的是这个值的实际大小，而不是内容的大小
21. 使用 `objc_getAssociatedObject` 和 `objc_setAssociatedObject` 在扩展中添加成员变量
22. `@synchronized` 在幕后做的事情是 调用了 `objc_sync` 中的 `objc_sync_enter` 和 `objc_sync_exit`，并加入了异常判断，在Swift中没有 `@synchronized`
23. 在命令行输入 `xcrun swift` 进入 Swift 命令行工具
24. `arc4random` 所返回的值无论在什么平台上都是一个 `UInt32`，另一个方法 `arc4random_uniform` 接收一个 `UInt32` 的数字n，将结果归一化到 0 到 n - 1 之间
25. 调用 `print` 打印对象或结构体之类的，可以实现 `CustomStringConvertible` 和 `CustomDebugStringConvertible` 来自定义打印内容
26. 在 Swift 2 时代中的错误处理的最佳实践，对于同步API使用异常机制，对于异步API使用泛型枚举
27. 对应target -> Build Settings -> Swift Compiler -> Custom Flags -> Other Swift Flags -> 添加 -assert-config Debug 强制启用断言 -assert-config Release 强制禁用断言
28. 在遇到确实因为输入的错误无法使程序继续运行的时候，考虑以 `fatalError` 的形式终止程序
29. 安全的资源组织方式，使用 `enum` 或者 `struct`，一些成熟的自动化工具：R.swift、SwiftGen
30. Playground 延时运行，`import XCPlayground`后，调用`XCPlaygroundPage.currentPage.needsIndefiniteExecution = true`
31. Log输出几个有用的编译符号：`#file` `#line` `#column` `#function`
32. 使用溢出处理的运算符可以在溢出时程序不崩溃
33. Swift 中的 `private` 是按文件限制范围的
34. Swift 中专门为 Core Data 假如了 `@NSManaged`
35. 闭包歧义跟多元组有关系