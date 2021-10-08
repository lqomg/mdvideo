---
title: 进阶使用
order: 3
toc: menu
---

> 进阶使用是指一些常规的特定用法，都是依托于基础用法实现的。

## 音视频资源的引用

对于某个`音频`或者`视频`资源,我们只需要做一个标记，在不同地方多次使用时只需要使用此标记即可。

### 创建引用 

使用 `>` 创建引用。

```

视频资源： @[tag名称](资源路径)
音频资源： &[tag名称](资源路径)

```
如

```
> @[tagVideo](http://vjs.zencdn.net/v/oceans.mp4)
> &[tagAudio](https://www.cambridgeenglish.org/images/153149-movers-sample-listening-test-vol2.mp3)

```
以上就是创建一个叫做 `tagVideo`的视频资源引用和 `tagAudio`的音频资源引用

### 使用引用

创建引用完成之后，接下来就是在你需要的地方使用 `* tag名称 *` 来引用资源

如

```

*tagVideo*

*tagAudio*

```


### 添加裁剪时段

使用`[开始时间-结束时间]`可以对引用做裁剪

如：

```
*tagVideo[0-10]*

```
以上表示裁剪出 视频资源 `tagVideo` 中 0-10秒的视频片段

### 例子

以下是为一段视频添加字幕的例子,你可以赋值到软件使用

```
| width | height | fps | name            | keep |
| - | -| - | -| - |
| 1920  | 1080   | 15  | mdVideo测试视频 | true |

---

> @[tagVideo](http://vjs.zencdn.net/v/oceans.mp4)

---

*tagVideo[0-5]*

这只海鸥在天空飞翔，立马就要钻进大海里

---

*tagVideo[5-10]*

海里面的鱼儿被海鸥惊扰

---

*tagVideo[10-16]*

接着一大群海鸥争相进入大海，捕猎鱼群

---

*tagVideo[16-20]*

还看了一看到一条大鲨鱼，场面极为壮观

(type:text;textColor:red;fontSize:0.1;)
大鲨鱼

---

*tagVideo[20-30]*

### 没说的了，将就看吧

有啥问题群里反馈

```
