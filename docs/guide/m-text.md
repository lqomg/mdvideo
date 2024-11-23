
## 文本

MD Video会将加粗字体和斜体当成普通文本展示

<img src="/public/images/text.png" />

## 示例

<video src="/public/videos/text.mp4" autoplay  controls></video>

###  以下文本将会转为对应视频：

::: warning

部分字体需要导入相关资源，软件提供免费资源包下载！

:::

<pre class="demo-code">
&duration=4

**这是个普通文本信息**

```元素配置
@fontFamily=手写杂书体
@color=#00C8D1
@position=top
@offsetY=40
@fontSize=0.08
```

*这是个普通文本信息*

```元素配置
@color=#5C4D3D
@shadowColor=red
@fontSize=100
@rotate=30
@animate=fadeInLeft
@delay=1
```

**这是个普通文本信息**

```元素配置
@position=bottom
@fill=#FF0000,#00FF00,#0000FF
@offsetY=-60
@fontSize=100
@delay=2
```
</pre>

## 配置信息


| 全称             | 含义                               | 默认                           | 其他                                            |
| ---------------- | ---------------------------------- | ------------------------------ | ----------------------------------------------- |
| `@duration`      | 持续时长                           | 跟随[场景时长](/guide/m-scene) |                                                 |
| `@delay`         | 延迟出现时间                       | 0s                             |                                                 |
| `@left`          | 元素横向位置                       | 0                              | 当值介于0-1时，表示大小为视频宽度百分比         |
| `@top`           | 元素纵向位置                       | 0                              | 当值介于0-1时，表示大小为视频高度百分比         |
| `@position`      | [内置位置](/guide/m-position) 信息 | 缺省                           |                                                 |
| `@offsetX`       | 横向偏移量                         | 0                              | 存在position时才生效                            |
| `@offsetY`       | 纵向偏移量                         | 0                              | 存在position时才生效                            |
| `@rotate`        | 旋转角度                           | 0                              |                                                 |
| `@color`         | 文字颜色                           | #000 ,黑色                     |                                                 |
| `@fontFamily`    | 字体                               | 微软雅黑                       |                                                 |
| `@fontSize`      | 字体大小                           | 缺省                           | 当值介于0-1时，表示占比视频宽度                 |
| `@fontWeight`    | 字体加粗,                          | normal                         | 可选值为bold                                    |
| `@fontStyle`     | 字体样式（斜体）                   | normal                         | 可选值为italic                                  |
| `@letterSpacing` | 字体间距，表示每个文字之间的距离   | 6                              |                                                 |
| `@shadowColor`   | 文字阴影颜色                       | 缺省                           |                                                 |
| `@fill`          | 文字渐变色                         | 缺省                           | 值为三个色组，当shadowColor存在时此配置不会生效 |
