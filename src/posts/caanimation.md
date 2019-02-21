---
title: "CAAnimation"
date: 2016-06-24 20:31:57
category: 学习笔记
tags:
- 学习笔记
- 技术
- 开发
- Swift
- iOS
---

这是一篇以前写的笔记。无聊放上来吧。

<!-- more -->

# CABasicAnimation

## 一段展示了CABasicAnimation用法的代码

``` swift

import UIKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        setupScaleLayer()

        setupGroupLayer()
    }

    func setupScaleLayer() {
        let scaleLayer = CALayer()
        scaleLayer.backgroundColor = UIColor.blueColor().CGColor
        scaleLayer.frame = CGRect(x: 40, y: 40, width: 100, height: 100)
        scaleLayer.cornerRadius = 10

        view.layer.addSublayer(scaleLayer)

        let scaleAnimation = CABasicAnimation(keyPath: "transform.scale")
        scaleAnimation.fromValue = NSNumber(float: 1.0)
        scaleAnimation.toValue = NSNumber(float: 1.5)
        scaleAnimation.autoreverses = true
        scaleAnimation.fillMode = kCAFillModeForwards
        scaleAnimation.repeatCount = MAXFLOAT
        scaleAnimation.duration = 0.8

        scaleLayer.addAnimation(scaleAnimation, forKey: "scaleAnimation")

    }

    func setupGroupLayer() {
        let groupLayer = CALayer()
        groupLayer.frame = CGRect(x: 40, y: 200, width: 100, height: 100)
        groupLayer.cornerRadius = 10
        groupLayer.backgroundColor = UIColor.yellowColor().CGColor
        view.layer.addSublayer(groupLayer)

        let scaleAnimation = CABasicAnimation(keyPath: "transform.scale")
        scaleAnimation.fromValue = NSNumber(float: 1.0)
        scaleAnimation.toValue = NSNumber(float: 1.5)
        scaleAnimation.autoreverses = true
        scaleAnimation.repeatCount = MAXFLOAT
        scaleAnimation.duration = 0.8

        let moveAnimation = CABasicAnimation(keyPath: "position")
        moveAnimation.fromValue = NSValue(CGPoint: groupLayer.position)
        moveAnimation.toValue = NSValue(CGPoint: CGPoint(x: 320.0 - 80.0, y: groupLayer.position.y))
        moveAnimation.autoreverses = true
        moveAnimation.repeatCount = MAXFLOAT
        moveAnimation.duration = 2

        let rotateAnimation = CABasicAnimation(keyPath: "transform.rotation.x")
        rotateAnimation.fromValue = NSNumber(float: 0.0)
        rotateAnimation.toValue = NSNumber(float: 6.0 * Float(M_PI))
        rotateAnimation.autoreverses = true
        rotateAnimation.repeatCount = MAXFLOAT
        rotateAnimation.duration = 2

        let groupAnnimation = CAAnimationGroup()
        groupAnnimation.duration = 2
        groupAnnimation.autoreverses = true
        groupAnnimation.animation|s = [moveAnimation, scaleAnimation, rotateAnimation]
        groupAnnimation.repeatCount = MAXFLOAT

        groupLayer.addAnimation(groupAnnimation, forKey: "groupAnnimation")
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.


    }

}



```

## Key Path



Structure Field   |Description     |
------------------|----------------|
rotation.x | The rotation, in radians, in the x axis. |
rotation.y | The rotation, in radians, in the y axis. |
rotation.z | The rotation, in radians, in the z axis. |
rotation | The rotation, in radians, in the z axis.This is identical to setting the rotation.z field |
scale.x | Scale factor for the x axis. |
scale.y | Scale factor for the y axis. |
scale.z | Scale factor for the z axis. |
scale | Average of all three scale factors. |
translation.x | Translate in the x axis. |
translation.y | Translate in the y axis. |
translation.z | Translate in the z axis. |
translation | Translate in the x and y axis. Value is an NSSize or CGSize |

## Fill Mode

`fillMode`的作用就是决定当前对象过了非active时间段的行为. 比如动画开始之前,动画结束之后。如果是一个动画`CAAnimation`,则需要将其`removedOnCompletion`设置为`NO`,要不然`fillMode`不起作用. 下面来讲各个`fillMode`的意义

`kCAFillModeRemoved` 这个是默认值,也就是说当动画开始前和动画结束后,动画对layer都没有影响,动画结束后,layer会恢复到之前的状态

`kCAFillModeForwards` 当动画结束后,layer会一直保持着动画最后的状态

`kCAFillModeBackwards` 这个和`kCAFillModeForwards`是相对的,就是在动画开始前,你只要将动画加入了一个layer,layer便立即进入动画的初始状态并等待动画开始.你可以这样设定测试代码,将一个动画加入一个layer的时候延迟5秒执行.然后就会发现在动画没有开始的时候,只要动画被加入了layer,layer便处于动画初始状态


`kCAFillModeBoth` 理解了上面两个,这个就很好理解了,这个其实就是上面两个的合成.动画加入后开始之前,layer便处于动画初始状态,动画结束后layer保持动画最后的状态.

# CAKeyFrameAnimation

## 一段展示了CAKeyFrameAnimation用法的代码

``` swift


import UIKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        setupRectLayer()
    }

    func setupRectLayer() {
        let rectLayer = CALayer()
        rectLayer.frame = CGRect(x: 15, y: 200, width: 30, height: 30)
        rectLayer.cornerRadius = 15
        rectLayer.backgroundColor = UIColor.blackColor().CGColor
        view.layer.addSublayer(rectLayer)

        let rectRunAnimation = CAKeyframeAnimation(keyPath: "position")

        rectRunAnimation.values = [NSValue(CGPoint: rectLayer.frame.origin), NSValue(CGPoint: CGPoint(x: 320 - 15, y: rectLayer.frame.origin.y)), NSValue(CGPoint: CGPoint(x: 320 - 15, y: rectLayer.frame.origin.y + 100)), NSValue(CGPoint: CGPoint(x: 15, y: rectLayer.frame.origin.y + 100)), NSValue(CGPoint: rectLayer.frame.origin)]

        rectRunAnimation.keyTimes = [NSNumber(float: 0.0), NSNumber(float: 0.6), NSNumber(float: 0.7), NSNumber(float: 0.8), NSNumber(float: 1.0)]

        rectRunAnimation.timingFunctions = [CAMediaTimingFunction(name: kCAMediaTimingFunctionEaseInEaseOut), CAMediaTimingFunction(name: kCAMediaTimingFunctionLinear), CAMediaTimingFunction(name: kCAMediaTimingFunctionLinear), CAMediaTimingFunction(name: kCAMediaTimingFunctionLinear)]

        rectRunAnimation.repeatCount = 1000
        rectRunAnimation.autoreverses = false
        rectRunAnimation.calculationMode = kCAAnimationLinear
        rectRunAnimation.duration = 4
        rectLayer.addAnimation(rectRunAnimation, forKey: "rectRunAnimation")
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.


    }

}



```

## values属性

指明关键帧的点

## path

也可以给animation设置`path`,设置path会覆盖`values`

## keyTimes


## timeFunctions

```

kCAMediaTimingFunctionLinear

kCAMediaTimingFunctionEaseIn
kCAMediaTimingFunctionEaseOut
kCAMediaTimingFunctionEaseInEaseOut
kCAMediaTimingFunctionDefault
```

## calculationMode

1. `kCAAnimationLinear` 线性，默认


2. `kCAAnimationDiscrete` 离散，`keyTimes`依旧有效
3. `kCAAnimationPaced` 平均，`keyTimes`跟`timeFunctions`失效
4. `kCAAnimationCubic` 平均
5.  `kCAAnimationCubicPaced` 平均

# 实现暂停开始的代码

## 代码展示

``` swift

func pauseLayer(layer: CALayer) {
    let pausedTime = layer.convertTime(CACurrentMediaTime(), fromLayer: nil)
    layer.speed = 0.0
    layer.timeOffset = pausedTime
}

func resumeLayer(layer: CALayer) {
    let pausedTime = layer.timeOffset
    layer.speed = 1.0
    layer.timeOffset = 0.0
    layer.beginTime = 0.0
    let timeSincePause = layer.convertTime(CACurrentMediaTime(), fromLayer: nil) - pausedTime
    layer.beginTime = timeSincePause

}
```

## 关于暂停开始动画两个函数的理解

暂停的时候，记录下暂停的时间，把layer的速度设置成了0.0，这样的话附加在layer上面的动画速度也变成了0.0，时间停止走动。

接着给layer一个timeOffset,可以让layer停在那个时刻。

重新开始动画，把layer的speed设置成1.0，layer的时间又可以开始走了，然后重设timeOffset和beginTime，接着计算出上次暂停到现在调用函数的时间，把layer的beginTime设置成这段时间。

这里就是我久久不能理解的地方，现在我的理解是：

假设暂停了动画，时间走过6个单位后，重新开始动画，那么，就会将beginTime设置成6个单位，beginTime是相对于父级的时间，意思就是相对父级6个单位之后进行动画。而此时父级已经走过了6个单位，于是直接接着播放动画。

# 执行动画的细节


要在添加动画之前对动画的各个属性进行设置，一旦添加了动画再进行设置就没有用了

给Layer添加动画的时候，会对动画执行一次拷贝，执行的动画是那份拷贝。

# CATransform3D

## CATransform3DMakeRotation

`CATransform3DMakeRotation`总是按最短路径来选择，当顺时针和逆时针的路径相同时，使用逆时针。若需要使其按顺时针旋转，用`CAKeyframeAnimation`并在顺时针路径上增加几个关键点即可。

