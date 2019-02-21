---
title: 二维码的生成与扫描
date: 2016-04-25 19:01:56
category: 学习笔记
tags:
- 学习笔记
- 技术
- 开发
- Swift
- iOS
---
关于生成二维码、扫描二维码方面的知识。

<!-- more -->

## 生成二维码
步骤：

1. 创建滤镜
2. 把相关数据给滤镜
3. 生成图片

```
// 1
let filter = CIFilter(name: "CIQRCodeGenerator")!
filter.setDefaults()

// 2
let dataString = "http://zhuscat.com/"
let data = dataString.dataUsingEncoding(NSUTF8StringEncoding)
filter.setValue(data, forKeyPath: "inputMessage")

// 3
let outputImage = filter.outputImage!
```

**注意：**生成的图像比较模糊，需要进一步处理，可以使用以下函数（抄来的）：

```
func createNonInterpolatedUIImageFromCIImge(image: CIImage, size: CGFloat) -> UIImage{
    let extent = CGRectIntegral(image.extent)
    let scale = min(size / CGRectGetWidth(extent), size / CGRectGetHeight(extent))

    // 创建 bitmap
    let width = Int(CGRectGetWidth(extent) * scale)
    let height = Int(CGRectGetHeight(extent) * scale)

    let cs = CGColorSpaceCreateDeviceGray()
    let bitmapRef = CGBitmapContextCreate(nil, width, height, 8, 0, cs, CGImageAlphaInfo.None.rawValue)
    let context = CIContext(options: nil)
    let bitmapImage = context.createCGImage(image, fromRect: extent)
    CGContextSetInterpolationQuality(bitmapRef, CGInterpolationQuality.None)
    CGContextScaleCTM(bitmapRef, scale, scale)
    CGContextDrawImage(bitmapRef, extent, bitmapImage)
    let scaledImage = CGBitmapContextCreateImage(bitmapRef)
    return UIImage(CGImage: scaledImage!)
}
```

## 扫描二维码

步骤：

1. 创建 session
2. 添加输入设备
3. 添加输出
4. 添加视频层
5. 开始扫描

```
import UIKit
import AVFoundation

class ViewController: UIViewController, AVCaptureMetadataOutputObjectsDelegate {

    weak var session: AVCaptureSession?
    weak var layer: CALayer?

    override func viewDidLoad() {
        super.viewDidLoad()
    }

    override func touchesBegan(touches: Set<UITouch>, withEvent event: UIEvent?) {
    	// 1
        let session = AVCaptureSession()
        self.session = session

        // 2
        let device = AVCaptureDevice.defaultDeviceWithMediaType(AVMediaTypeVideo)
        let input = try? AVCaptureDeviceInput(device: device)
        session.addInput(input)

        // 3
        let output = AVCaptureMetadataOutput()
        output.setMetadataObjectsDelegate(self, queue: dispatch_get_main_queue())
        session.addOutput(output)
        output.metadataObjectTypes = [AVMetadataObjectTypeQRCode]

        // 4
        let layer = AVCaptureVideoPreviewLayer(session: session)
        layer.frame = view.bounds
        view.layer.addSublayer(layer)
        self.layer = layer

        // 5
        session.startRunning()
    }

    // 实现步骤3中需要的代理
    func captureOutput(captureOutput: AVCaptureOutput!, didOutputMetadataObjects metadataObjects: [AnyObject]!, fromConnection connection: AVCaptureConnection!) {
        if metadataObjects.count > 0 {
            let object = metadataObjects.last as! AVMetadataMachineReadableCodeObject
            print("\(object.stringValue)")

            session?.stopRunning()

            self.layer?.removeFromSuperlayer()

        }
    }
}
```