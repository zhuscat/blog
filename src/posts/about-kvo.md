---
title: KVO 知识
date: 2016-04-10 14:35:41
category: 学习笔记
tags:
- 学习笔记
- 技术
- 开发
- Swift
- iOS
---

KVO 相关知识

<!-- more -->

## 自动通知

系统默认是自动通知

在 Swift 中，需要确保观察者和被观察者都是NSObject的子类。
并且，被观察的属性前面要加上 `dynamic` 关键字。

如下代码：
```
class Object: NSObject {
    dynamic var propertyOne: String = "property"
    dynamic var propertyTwo: Int = 0
}
```

然后就可以为这个类的实例添加观察者了。比如我添加一个控制器为其观察者。

```
class ViewController: UIViewController {

    var object = Object()

    override func viewDidLoad() {
        super.viewDidLoad()
        object.addObserver(self, forKeyPath: "propertyOne", options: NSKeyValueObservingOptions.New, context: nil)
        object.addObserver(self, forKeyPath: "propertyTwo", options: NSKeyValueObservingOptions.New, context: nil)
    }

    override func observeValueForKeyPath(keyPath: String?, ofObject object: AnyObject?, change: [String : AnyObject]?, context: UnsafeMutablePointer<Void>) {
        if keyPath == "propertyOne" {
            print("propertyOne:\(change![NSKeyValueChangeNewKey] as! String)")
        } else if keyPath == "propertyTwo" {
            print("propertyTwo:\(change![NSKeyValueChangeNewKey] as! Int)")
        } else {
            super.observeValueForKeyPath(keyPath, ofObject: object, change: change, context: context)
        }
    }

    deinit {
        self.removeObserver(self, forKeyPath: "propertyOne")
        self.removeObserver(self, forKeyPath: "propertyTwo")
    }

    override func touchesBegan(touches: Set<UITouch>, withEvent event: UIEvent?) {
        object.propertyOne = "propertyChange"
        object.propertyTwo = 2
    }
}

```

如此在点击屏幕的时候可以看到输出。

注意，需要在适当的时机移除观察者，否则即使控制器销毁了，通知仍然会发出，此时程序会崩溃。

## 手动通知

可以将某属性设置为不自动通知，在 Object 类中增加：

```
override class func automaticallyNotifiesObserversForKey(key: String) -> Bool {
    if key == "propertyOne" {
        return false
    } else {
        return super.automaticallyNotifiesObserversForKey(key)
    }
}
```

这样就不会在 `propertyOne` 改变的时候自动通知了。

手动通知的要点是两个方法：

1. `func willChangeValueForKey(key: String)`
2. `func didChangeValueForKey(key: String)`

在想要通知的时候写如下代码就行了：

```
object.willChangeValueForKey("propertyOne")
object.propertyOne = "propertyChange"
object.didChangeValueForKey("propertyOne")
```