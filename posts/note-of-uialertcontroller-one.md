---
title: "UIAlertController 学习笔记（一）"
date: 2016-01-19 18:32:11
category: 学习笔记
tags:
- 学习笔记
- 技术
- 开发
- Swift
- iOS

---
`UIAlertController` 可以用来创建对话框和上拉式菜单，这是一个在开发中可能经常需要用到的东西，来看一下具体的使用方法吧。


# 正文

## 创建一个对话框

不多说，直接上完整的代码，再详细的解释一下。

```
@IBAction func showAlert(sender: UIButton) {
    //创建UIAlertController实例
    let alertController = UIAlertController(title: "Demo", message: "This is a demo", preferredStyle: .Alert)
    //创建UIAlertAction实例
    let okAction = UIAlertAction(title: "OK", style: UIAlertActionStyle.Default, handler: nil)
    let cancelAction = UIAlertAction(title: "Cancel", style: UIAlertActionStyle.Cancel, handler: nil)
    //将动作按钮添加到控制器
    alertController.addAction(okAction)
    alertController.addAction(cancelAction)

    presentViewController(alertController, animated: true, completion: nil)

}
```

这个函数已经与一个 `UIButton` 连接了，当点击所连接的Button的时候，就会调用这个函数。
让我们一行一行地来看

```
let alertController = UIAlertController(title: "Demo", message: "This is a demo", preferredStyle: .Alert)
```

创建一个 `UIAlertController` 的实例，有了它，你就可以使用 `presentViewController` 方法将对话框展现出来了，不过如果就这样是没有按钮的，所以我们还要创建 `UIAlertAction` 实例并添加到这个Controller上。

前两个参数，一个是主标题，一个副标题。

`preferredStyle`有:

1. `UIAlertControllerStyle.Alert`
2. `UIAlertControllerStyle.ActionSheet`

分别是对话框样式和上拉菜单样式。

```
let okAction = UIAlertAction(title: "OK", style: UIAlertActionStyle.Default, handler: nil)
let cancelAction = UIAlertAction(title: "Cancel", style: UIAlertActionStyle.Cancel, handler: nil)
//将动作按钮添加到控制器
alertController.addAction(okAction)
alertController.addAction(cancelAction)
```

这里的代码创建了 `UIAlertAction` 实例并且添加到了 `alertController` 上，这样才能出现按钮，`title` 是按钮名称， `style` 有 `UIAlertActionStyle.Default`， `UIAlertActionStyle.Cancel`， `UIAlertActionStyle.Destructive`，从名字就可以看出作用了，快快实践以下这三个参数有什么不同吧。`handler` 会在你点击了之后调用。

```
presentViewController(alertController, animated: true, completion: nil)
```

最后，显示，大功告成，是不是很简单呢。

## 带有文本输入框的对话框

还是直接上代码

```
@IBAction func login(sender: UIButton) {

    //创建一个UIAlertController对象，preferredStyle为.Alert
    let alertController = UIAlertController(title: "Login", message: "Please enter the information", preferredStyle: UIAlertControllerStyle.Alert)

    //添加Text Field,然后设置这个Text Field（在闭包中进行）
    alertController.addTextFieldWithConfigurationHandler{ (textField) -> Void in
        textField.placeholder = "Enter your username"
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
    }

    let cancelAction = UIAlertAction(title: "Cancel", style: UIAlertActionStyle.Cancel, handler: nil)

    alertController.addAction(loginAction)
    alertController.addAction(cancelAction)

    //显示 Alert View
    presentViewController(alertController, animated: true, completion: nil)
}
```

有了前面的基础，是不是很快就能看懂了呢。

这里再说一个新出现的方法

```
alertController.addTextFieldWithConfigurationHandler{ (textField) -> Void in
        textField.placeholder = "Enter your username"
}
```

调用它可以在对话框添加一个文本输入框，闭包中可以写一些对这个对话框进行设置的代码，比如我上面就给设置了文本输入框的 `placeholder`。

## 尝试丰富上面的例子
上面的带文本框的对话框可以当成是一个登陆的对话框，尝试修改代码使当没有用户名跟密码输入的时候无法点击登陆按钮。

**提示：**使用 `NSNotification`，UIAlertAction 实例有一个 `enable` 属性。

好了，这次就写到这里，下次再写写关于上拉菜单的内容，你也可以现在就自己尝试创建上拉菜单。

不知道我写的是太啰嗦还是太简单，有没有讲清楚呢？欢迎评论。

# 参考资料
1. [在iOS 8中使用UIAlertController](http://www.cocoachina.com/ios/20141126/10320.html)
2. [Alert Controller 中实现可编辑文本字输入框教程](http://swift.gg/2016/01/04/editable-text-field-alert-controller-tutorial/)
