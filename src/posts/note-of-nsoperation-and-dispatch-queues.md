---
title: "NSOperation 与 Dispatch Queues 学习笔记"
date: 2016-01-14 19:04:02
category: 学习笔记
tags:
- 学习笔记
- 技术
- 开发
- Swift
- iOS

---
本文为 NSOperation 和 Dispatch Queues 的学习笔记，参考资料为[iOS 并发：从 NSOperation 和 Dispatch Queues 开始](http://swift.gg/2016/01/08/ios-concurrency-getting-started-with-nsoperation-and-dispatch-queues/)，文章基本上可以算是这篇文章的一个概括，将各个函数的用法摘录下来了，对于学习过这方面内容的人可以起到快速回顾的作用。

如果可能的话，以后会再添加关于这方面的内容到这篇文章中。

<!-- more -->

# Grand Central Dispatch

系统会缺省为每个应用提供一个串行队列和四个并发队列，这些队列全局可用，一个串行队列为主派发队列，在应用主线程执行任务，这个队列被用来更新应用的UI，四个并发队列（全局派发队列）可以使用 `dispatch_get_global_queue` 函数获得，它们有四个不同的优先级，分别是：

1. DISPATCH_QUEUE_PRIORITY_HIGH
2. DISPATCH_QUEUE_PRIORITY_DEFAULT
3. DISPATCH_QUEUE_PRIORITY_LOW
4. DISPATCH_QUEUE_PRIORITY_BACKGROUND

## 主派发队列获取

```
let mainQueue = dispatch_get_main_queue()
```

## 创建自己的串行队列

```
let newSerialQueue = dispatch_queue_create("com.example.serialQueue", DISPATCH_QUEUE_SERIAL)
```

## 全局派发队列获取

```
let queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_HIGH, 0)
```

## 创建自己的并行队列

```
let newConcurrentQueue = dispatch_queue_create("com.example.concurrentQueue", DISPATCH_QUEUE_CONCURRENT)
```
## 向队列提交任务

```
dispatch_async(queue){ () -> Void in
    // your task goes here
}
```

# Operation Queues

1. Operation Queues 不遵循先进先出，可以设置Operation的优先级，可以在Operation之间添加依赖。
2. Oeration Queues 是并发执行的，但可以通过依赖关系让任务顺序执行。
3. Opration Queues 是 NSOperationQueue类的实例，任务被封装在 NSOperation 的实例中。

`NSOperation` 是一个抽象类，只能使用其子类，iOS SDK中已经有两个可以使用的子类：

1. NSBlockOperation
2. NSInvocationOperation

## 用 `NSOperationQueue` 创建一条队列并执行任务

```
let queue = NSOperationQueue()

queue.addOperationWithBlock { () -> Void in

    // some tasks

    NSOperationQueue.mainQueue().addOperationWithBlock ({ () -> Void in
        //update UI
    })
}
```

## 用 `NSOperationQueue` 创建一条队列并以`NSBlockOperation`的形式添加任务

```
let queue = NSOperationQueue()

let operation1 = NSBlockOperation(block: {
    //some tasks
    NSOperationQueue.mainQueue().addOperationWithBlock({
        //update UI
    })
})

queue.addOperation(operation1)
```

## 设置 `NSOperationQueue` 的优先级

可以将 `queuePriority` 属性设为以下值改变执行优先级

```
public enum NSOperationQueuePriority : Int {
    case VeryLow
    case Low
    case Normal
    case High
    case VeryHigh
}
```

## 使用 `NSOperation` 还可以设置 Completion Handler

```
operation1.completionBlock = {
    print("Operation 1 completed")
}
```

## 设置依赖性

```
//假设有operation1, operation2, operation3, operation4

operation2.addDependency(operation1)
operation3.addDependency(operation2)
```

这样执行次序为operation1 -> operation2 -> operation3，而operation4没有设置依赖，会并发执行。

取消 Operation

```
queue.cancelAllOperations()
```

这条语句会使还未被执行的 Operation 被取消，当你对多个 Operation 设置依赖的时候可以看出效果。

# 参考资料

1. [iOS 并发：从 NSOperation 和 Dispatch Queues 开始](http://swift.gg/2016/01/08/ios-concurrency-getting-started-with-nsoperation-and-dispatch-queues/)