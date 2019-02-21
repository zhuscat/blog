---
title: "UIAlertController 学习笔记（二）"
date: 2016-01-28 20:13:03
category: 学习笔记
tags:
- 学习笔记
- 技术
- 开发
- Swift
- iOS

---

上次写了关于 UIAlertController 中对话框模式的内容，今天就写一下上拉菜单模式的内容，顺便再写一点关于 UIPopoverPresentationController 的内容。

<!-- more -->

# 正文

## 上次留下的问题

[上次](http://zhuscat.com/2016/01/19/note-of-uialertcontroller-one/)在最后写了一个尝试丰富上面的例子的板块，这次就先直接给出代码，再写其他内容。关于代码的内容就不再多做解释。

```

@IBAction func login(sender: UIButton) {

    let alertController = UIAlertController(title: "Login", message: "Please enter the information", preferredStyle: UIAlertControllerStyle.Alert)

    alertController.addTextFieldWithConfigurationHandler{ (textField) -> Void in
        textField.placeholder = "Enter your username"
        NSNotificationCenter.defaultCenter().addObserver(self, selector: ("alertTextFieldDidChange:"), name: UITextFieldTextDidChangeNotification, object: textField)
    }

    alertController.addTextFieldWithConfigurationHandler{ (textField) -> Void in
        textField.placeholder = "Enter your password"
        textField.secureTextEntry = true
    }

    let loginAction = UIAlertAction(title: "Login", style: UIAlertActionStyle.Default){
        (action) -> Void in
        if let username = alertController.textFields?[0].text {
            print(username)
        }
        if let password = alertController.textFields?[1].text {
            print(password)
        }
        NSNotificationCenter.defaultCenter().removeObserver(self, name: UITextFieldTextDidChangeNotification, object: nil)
    }

    let cancelAction = UIAlertAction(title: "Cancel", style: UIAlertActionStyle.Cancel, handler: nil)

    loginAction.enabled = false

    alertController.addAction(loginAction)
    alertController.addAction(cancelAction)

    presentViewController(alertController, animated: true, completion: nil)
}

func alertTextFieldDidChange(notification: NSNotification) {
    if let alertController = self.presentedViewController as? UIAlertController {
        let login = alertController.textFields![0]
        let okAction = alertController.actions[0] as UIAlertAction

        okAction.enabled = login.text!.characters.count > 2
    }
}
```


## 创建上拉菜单

直接上代码，如果看过我上一次的笔记，可以发现创建一个上拉菜单与创建对话框十分相似，这里也并没有什么理解困难的地方，唯一不同的是多了一个对 `popover` 的设置。那么这个设置有什么用的，这里的设置就是为了 iPad 设置的，如果没有设置这些内容，程序在 iPad 上会崩溃。

看完代码之后，就来说说 `popoverPresentationController` 的内容。

```
@IBAction func showActionSheet(sender: UIButton) {
    let alertController = UIAlertController(title: "actionSheet", message: "This is an action sheet", preferredStyle: .ActionSheet)
    let action1 = UIAlertAction(title: "Reset", style: .Destructive, handler: nil)
    let action2 = UIAlertAction(title: "Action1", style: .Default, handler: nil)
    let action3 = UIAlertAction(title: "Action2", style: .Default, handler: nil)
    let action4 = UIAlertAction(title: "Cancel", style: .Cancel, handler: nil)

    alertController.addAction(action1)
    alertController.addAction(action2)
    alertController.addAction(action3)
    alertController.addAction(action4)


    if let popover = alertController.popoverPresentationController {
        popover.sourceView = sender
        popover.sourceRect = sender.bounds
        popover.permittedArrowDirections = UIPopoverArrowDirection.Any
    }

    presentViewController(alertController, animated: true, completion: nil)
}
```

关于 `popoverPresentationController` 这个属性，苹果官方文档是这么说的。

> The nearest popover presentation controller that is managing the current view controller. (read-only)

> If the view controller or one of its ancestors is managed by a popover presentation controller, this property contains that object. This property is nil if the view controller is not managed by a popover presentation controller.

> If you created the view controller but have not yet presented it, accessing this property creates a popover presentation controller when the value in the modalPresentationStyle property is UIModalPresentationPopover. If the modal presentation style is a different value, this property is nil.

在我们这个例子里面，它就是管理 `alertController` 的 `popover presentation controller`，它是一个 `UIPopoverPresentationController` 实例，管理在 popover 中的内容。在展示 `alertController` 之前，并且 `alertController` 的 `modalPresentationStyle` 是`UIModalPresentationPopover` 的时候，访问这个属性会创建一个 `popover presentation controllr`， 显然，我们这里的代码符合这种要求。

`sourceView` 和 `sourceRect` 对锚点（那个弹出框的箭头）起到了定位的作用，这里定位在点击的按钮的旁边。

**注：**还可以通过设置 `barButtonItem` 定位。

`permittedArrowDirections` 是箭头允许的方向，但箭头不一定就是你指定的方向，系统会尽量让其成为你所指定的方向。

好了，关于 UIAlertController 的学习笔记就到这里啦，这里还说到了 UIPopoverPresentationController，当然，讲得并不细致，相信下次也会写关于它的内容，欢迎评论！

# 参考资料
1. [在iOS 8中使用UIAlertController](http://www.cocoachina.com/ios/20141126/10320.html)
2. Documentation and API Reference