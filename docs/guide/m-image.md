
## 图片

图片元素只能独立占据某一行

如以下配置

<pre class="demo-code">

![](https://mdvideo.wvovw.com/logo.png)

```元素配置
@position=center
```
</pre>


<video src="/public/videos/image.mp4" autoplay  controls></video>

## 配置信息

| 全称        | 含义                               | 默认                           | 其他                                    |
| ----------- | ---------------------------------- | ------------------------------ | --------------------------------------- |
| `@width`    | 图片宽度                           | 0.6                            | [元素大小](/guide/m-scene#元素大小)     |
| `@height`   | 图片高度                           | 0.6                            | [元素大小](/guide/m-scene#元素大小)     |
| `@duration` | 持续时长                           | 跟随[场景时长](/guide/m-scene) |                                         |
| `@delay`    | 延迟出现时间                       | 0s                             |                                         |
| `@left`     | 元素横向位置                       | 0                              | 当值介于0-1时，表示大小为视频宽度百分比 |
| `@top`      | 元素纵向位置                       | 0                              | 当值介于0-1时，表示大小为视频高度百分比 |
| `@position` | [内置位置](/guide/m-position) 信息 | center                         |                                         |
| `@offsetX`  | 横向偏移量                         | 0                              | 存在position时才生效                    |
| `@offsetY`  | 纵向偏移量                         | 0                              | 存在position时才生效                    |
| `@rotate`        | 旋转角度                           | 0                              |                                                 |
