
## 视频


MDVideo 最开始的初衷仅仅是为了更好的对视频进行编辑，如裁剪、添加字幕和贴图等

通过一下方式为你`自己视频`添加一个`视频片段`

例如

- (原视频地址)[http://vjs.zencdn.net/v/oceans.mp4]
  
```markdown

[video](http://vjs.zencdn.net/v/oceans.mp4)


```

## 示例

<video src="/public/videos/video.mp4" autoplay  controls></video>

### 以下文本将会转为对应视频：

:::warning

宽度(width)和高度(height)为1表示铺满全屏，默认只占据视频宽度和高度的0.6倍

:::

<pre class="demo-code">
[video](http://vjs.zencdn.net/v/oceans.mp4)

```元素配置
@width=1
@height=1
```
</pre>


## 配置信息

| 全称        | 含义                               | 默认                           | 其他                                    |
| ----------- | ---------------------------------- | ------------------------------ | --------------------------------------- |
| `@width`    | 视频宽度                           | 0.6                            | [元素大小](/guide/m-scene#元素大小)     |
| `@height`   | 视频高度                           | 0.6                            | [元素大小](/guide/m-scene#元素大小)     |
| `@duration` | 持续时长                           | 跟随[场景时长](/guide/m-scene) |                                         |
| `@delay`    | 延迟出现时间                       | 0s                             |                                         |
| `@left`     | 元素横向位置                       | 0                              | 当值介于0-1时，表示大小为视频宽度百分比 |
| `@top`      | 元素纵向位置                       | 0                              | 当值介于0-1时，表示大小为视频高度百分比 |
| `@position` | [内置位置](/guide/m-position) 信息 | center                         |                                         |
| `@offsetX`  | 横向偏移量                         | 0                              | 存在position时才生效                    |
| `@offsetY`  | 纵向偏移量                         | 0                              | 存在position时才生效                    |
| `@rotate`        | 旋转角度                           | 0                              |                                                 |
| ~~`@ss`~~   | 视频裁剪开始时间                   | 0                              |                                         |
| ~~`@to`~~   | 视频裁剪结束时间                   | 0                              |                                         |
