---
hero:
  title: Markdown To Video
  desc: 一个将markdown文档转为视频的便捷工具
  actions:
    - text: 开始使用
      link: /guide
    - text: 立刻下载
      link: /guide/down
# https://zimeiti-1301321746.cos.ap-chongqing.myqcloud.com/MDVideo-v0.1.1-setup.exe
# features:
#   - icon: https://gw.alipayobjects.com/zos/bmw-prod/881dc458-f20b-407b-947a-95104b5ec82b/k79dm8ih_w144_h144.png
#     title: 方便快捷
#     desc: 方便简单视频的创建
#   - icon: https://gw.alipayobjects.com/zos/bmw-prod/d60657df-0822-4631-9d7c-e7a869c2f21c/k79dmz3q_w126_h126.png
#     title: Feature 2
#     desc: Balabala
#   - icon: https://gw.alipayobjects.com/zos/bmw-prod/d1ee0c6f-5aed-4a45-a507-339a4bfe076c/k7bjsocq_w144_h144.png
#     title: Feature 3
#     desc: Balabala
footer: Copyright © 2021<br /><a href="https://beian.miit.gov.cn/"><b>蜀ICP备17011586号</b></a>
---

## 即可上手MDvideo


<Alert> 复制下面markdown文本到软件试一试吧~</Alert>

  
<a target="_blank" href="/images/mdvideo.mp4">MDvideo演示视频</a>



> 注意：此内容用到旁白，需要配置语音引擎，见 [旁白](/guide/notice#自动语音合成为什么不生效)

> 以下内容是用到大量远程的在线资源，准备阶段可能会很长，建议使用本地资源替代

```html

| width | height | fps | name            | keep |
| - | - | - | - | - |
| 1920  | 1080   | 15  | mdVideo | true |

---
(animate:Colorful)

# 居中的标题

![](https://cdn.beekka.com/blogimg/asset/202109/bg2021090117.jpg)
一张淡出的图片加一段字幕，默认持续3秒钟

---
(backgroundColor:#8cc5ff)
## 带背景的标题

`这是一段发音的字幕，默认持续时间为这段文字发音的时间`

---
(animate:WaterWave)
(duration:5)

### 新闻标题

![](https://cdn.beekka.com/blogimg/asset/202109/bg2021090117.jpg)

(width:0.5;left:0.1;top:0.2)
![](http://www.ruanyifeng.com/blogimg/asset/201204/bg2012042702.jpg)

(type:text;textColor:red;fontSize:0.05;left:0.3;)
一张图片加贴图，配上一段特别的文字,持续5秒

---

@[2-12](http://vjs.zencdn.net/v/oceans.mp4)

这是一段持续10秒的视频剪辑

---

## 带背景的标题

&[10-25](https://www.cambridgeenglish.org/images/153149-movers-sample-listening-test-vol2.mp3)

`这是一段持续10秒的音频剪辑,加上一些也段的文字`


```

