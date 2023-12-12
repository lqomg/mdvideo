## 基础语法

MD Video基本遵从Markdown默认的语法规范，使用分隔符 `---` 表示不同的视频场景;

这是最基本的配置，创建了两个场景，第一个场景背景颜色是红色，第二个是蓝色，并且第二个场景有一张图片。

```markdown

&backgroundColor=#4183B4
&transName=WaterWave
&duration=2

# 风萧萧兮易水寒!

---

&backgroundColor=#3CB371
&duration=3

# 壮士一去兮不复还!

```

以上配置将会转为一下视频输出：

<video src="/public/videos/scene.mp4" autoplay  controls></video>



## 配置

> 以下是场景支持的配置。存在AI语音时如果场景时间不足，将会自动延长

| 全称               | 含义                         | 默认 | 其他                                                           |
| ------------------ | ---------------------------- | ---- | -------------------------------------------------------------- |
| `@duration`        | 持续时长                     | 6s   | 数字类型                                                       |
| `@backgroundColor` | 背景颜色                     | 白色 |                                                                |
| `@transName`       | 场景之间的过渡动画           | 无   | 可以为  Lens, MoveLeft,Oblique,Shake, Magnifier等 根据提示选择 |
| `@transDuration`   | 场景之间的过渡动画的持续时间 | 0.5s |                                                                |

## 元素大小


> 设置元素**宽度(width)**，**左间距(left)**, **X轴偏移量(offsetX)**等时，值介于 “0” 至 “1” 之间时表示占视频宽度的比例，如0.5表示占视频**宽度**的50%；

> 设置元素**高度(height)**，**顶部间距(top)**, **Y轴偏移量(offsetY)**等时，值介于 “0” 至 “1” 之间时表示占视频高0度的比例，如0.5表示占视频**高度**的50%；









