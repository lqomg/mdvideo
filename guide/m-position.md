
## 基础位置

为了方便处理元素位置，提供@position配置项，以帮助快速定位元素


> 借助offsetX,offsetY可以帮助微调位置信息，此配置对大部分元素生效


<pre class="demo-code">

![](https://mdvideo.wvovw.com/logo.png)

```元素配置
@position=center
```
</pre>

<img src="/public/images/position.png" />

可以为以下八个值

- top：顶部居中
- bottom：底部居中
- center：垂直居中
- top-left：左上角
- top-right：右上角
- center-left：垂直居中靠左
- center-right：垂直居中靠右
- bottom-left：左下角
- bottom-right：右下角

## 示例

<video src="/public/videos/position.mp4" autoplay  controls></video>

### 以下文本将会转为对应视频：

<pre class="demo-code">

&backgroundColor=#2A52BE
&duration=10

![](https://mdvideo.wvovw.com/logo.png)

```元素配置
@position=top-left
@width=0.1
@height=0.1
@delay=0
```

![](https://mdvideo.wvovw.com/logo.png)

```元素配置
@position=top
@width=0.1
@height=0.1
@delay=1
```

![](https://mdvideo.wvovw.com/logo.png)

```元素配置
@position=top-right
@width=0.1
@height=0.1
@delay=2
```

![](https://mdvideo.wvovw.com/logo.png)

```元素配置
@position=center-left
@width=0.1
@height=0.1
@delay=3
```

![](https://mdvideo.wvovw.com/logo.png)

```元素配置
@position=center
@width=0.1
@height=0.1
@delay=4
```

![](https://mdvideo.wvovw.com/logo.png)

```元素配置
@position=center-right
@width=0.1
@height=0.1
@delay=5
```

![](https://mdvideo.wvovw.com/logo.png)

```元素配置
@position=bottom-left
@width=0.1
@height=0.1
@delay=6
```

![](https://mdvideo.wvovw.com/logo.png)

```元素配置
@position=bottom
@width=0.1
@height=0.1
@delay=7
```

![](https://mdvideo.wvovw.com/logo.png)

```元素配置
@position=bottom-right
@width=0.1
@height=0.1
@delay=8
```
</pre>


## 位置微调

在存在position配置的情况，可借助offsetX和offsetY微调位置信息

如:
<pre>

![](https://mdvideo.wvovw.com/logo.png)

```元素配置
@position=center
@offsetX=100
@offsetY=100
```
</pre>

表示居中之后横向移动100px，纵向移动100px


## 配置信息

| 全称        | 含义                     | 默认                      | 其他     |
| ----------- | ------------------------ | ------------------------- | -------- |
| `@position` | 基础位置，               | center,不同元素可能不一样 | 参见上表 |
| `@offsetX`  | 相对基础位置的横轴偏移量 | 0                         |          |
| `@offsetY`  | 相对基础位置的纵轴偏移量 | 0                         |          |