---
title: "UIImagePickerController 学习笔记"
date: 2016-01-30 22:25:39
category: 学习笔记
tags:
- 学习笔记
- 技术
- 开发
- Swift
- iOS

---

UIImagePickerController 用来从拍照、照片、相簿中获取图片，看看如何使用吧。
<!-- more -->

# 正文

## 检测设备是否支持

UIImagePickerController 需要设置数据来源，数据来源有：

```
enum UIImagePickerControllerSourceType : Int {
    case PhotoLibrary
    case Camera
    case SavedPhotosAlbum
}
```

默认是 `UIImagePickerControllerSourceType.PhotoLibrary` 。

如果你需要在多设备上使用 UIImagePickerController，最好在呈现前检测一下设备是否支持，比如有些设备没有摄像头，就不支持 `.Camera` 。

检测方式：

```
if UIImagePickerController.isSourceTypeAvailable(.Camera) {
    print("camera available")
}
if UIImagePickerController.isSourceTypeAvailable(.PhotoLibrary) {
    print("photo library available")
}
if UIImagePickerController.isSourceTypeAvailable(.SavedPhotosAlbum) {
    print("saved photos album available")
}
```

## 创建并设置

```
let imagePicker = UIImagePickerController()
imagePicker.sourceType = UIImagePickerControllerSourceType.SavedPhotosAlbum
imagePicker.allowsEditing = true
imagePicker.delegate = self
presentViewController(imagePicker, animated: true, completion: nil)
```
以上代码先创建了一个 UIImagePickerController 实例，然后设置了 `sourceType`，`allowsEditing` 为 `true` 表示可以对图像进行编辑（选择图片后会出现一个框，你可以对图片进行操作），然后设置了其代理为 `self`，代理等一下写，最后呈现出这个 UIImagePickerController 。

## 代理

第一个方法：

```
optional func imagePickerController(_ picker: UIImagePickerController,
      didFinishPickingMediaWithInfo info: [String : AnyObject])
```

这个方法在选取了图片后调用，info 是一个字典，可以获取你所选取的照片（也可以是影片等多媒体）的信息。

键的值有如下：

```
let UIImagePickerControllerMediaType: String
let UIImagePickerControllerOriginalImage: String
let UIImagePickerControllerEditedImage: String
let UIImagePickerControllerCropRect: String
let UIImagePickerControllerMediaURL: String
let UIImagePickerControllerReferenceURL: String
let UIImagePickerControllerMediaMetadata: String
let UIImagePickerControllerLivePhoto: String
```

具体信息可以看苹果官方文档，这里不再赘述。

**注：**我们有义务让UIImagePickerController从界面中消失。

第二个方法：

```
optional func imagePickerControllerDidCancel(_ picker: UIImagePickerController)
```

这个方法会在点击了取消按钮之后调用。

## 实例

下面这个例子是这样的，在主界面有一个按钮，点击了按钮之后出现 UIImagePickerController 的界面，选取一张图片之后显示在主界面上。

```
import UIKit

class ViewController: UIViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate {

    let imageView = UIImageView()

    override func viewDidLoad() {
        super.viewDidLoad()
        // 设置 imageView 的大小位置
        imageView.frame = CGRect(origin: CGPoint(x: 0, y: view.bounds.size.height / 2), size: CGSize(width: view.bounds.size.width, height: view.bounds.size.height / 2))
        // 图像超出时剪裁
        imageView.clipsToBounds = true
        imageView.contentMode = UIViewContentMode.ScaleAspectFill
        view.addSubview(imageView)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    @IBAction func showPickerViewSavedPic(sender: UIButton) {
        let imagePicker = UIImagePickerController()
        imagePicker.sourceType = UIImagePickerControllerSourceType.SavedPhotosAlbum
        imagePicker.allowsEditing = true
        imagePicker.delegate = self
        presentViewController(imagePicker, animated: true, completion: nil)
    }

    func imagePickerController(picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : AnyObject]) {
        let image = info[UIImagePickerControllerEditedImage] as! UIImage
        imageView.image = image
        dismissViewControllerAnimated(true, completion: nil)
    }
}
```

**注意：** `UIImageViewController` 实例的代理还要实现 `UINavigationControllerDelegate`

如果有任何疑问的话，欢迎评论。

# 更新记录

2016年4月21日：增加“注意”项目

# 参考
1. [UIImagePickerController从拍照、图库、相册获取图片](http://www.cocoachina.com/ios/20140923/9730.html)