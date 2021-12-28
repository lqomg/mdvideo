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
footer: Copyright © 2021 <a href="https://beian.miit.gov.cn/"><b>蜀ICP备17011586号</b></a>
---

## 即可上手MDvideo

<video src="/images/mdvideo.mp4" controls width="600"></video>

> 注意：
> * 以下内容用到旁白，需要配置语音引擎，见 [旁白](/guide/notice#自动语音合成为什么不生效)
> * 以下内容用到的资源文件，包括图片、视频和音频需要在本地，请下载之后在替换引入。
> * 可以将素材资源换位远程在线资源，但是可能会有未知错误


<Alert> 复制下面markdown文本到软件试一试吧~</Alert>


```html
| width | height | fps | name |
| - | - | - | - |
| 1920 | 1080 | 15 | Mdvdeio演示视频 |
---

[sceneBgColor:#11A659;transition:Colorful;transitionTime:1.5;duration:5;]
(top:0.28;left:0.2;fontSize:0.1;bgColor:#3A4187;animateEnd:0 0 1 1 0;animateTime:2;animateDelay:0;)
本视频由MdVideo构建

(top:0.48;left:0.06;fontSize:0.08;color:#1148EE;animateEnd:0 0 1 1 0;)
官网地址:https://mdvideo.gshll.com/

(top:0.6;left:0.06;fontSize:0.06;color:#1148EE;animateEnd:0 0 1 1 0;)
问题反馈：https://github.com/linqian02/mdvideo/issues

---

[sceneBgColor:#4D4848;transition:WindowShades;transitionTime:2;duration:9;]
(fontSize:0.08;color:#2B664E;animateEnd:0 0 1 1 0;animateTime:2;)
# 图片效果演示

![555555555.png](D:\image\1.png)

(width:0.5;height:0.6;top:0.05;left:0.05;animate:bounceInLeft 2 2;)
![](D:\image\2.png)

(width:0.4;height:0.4;top:0.25;left:0.3;animate:fadeInUp 1.5 3;)
![](D:\image\3.png)

(width:0.6;height:0.6;top:0.35;left:0.4;scale:0.9;animate:rollIn 2 4;)
![](D:\image\4.png)

---

[sceneBgColor:#4CA38F;transition:BackOff;transitionTime:2;duration:6;]
(fontSize:0.06;color:#9EDA10;animateEnd:0 0 1 1 0;animateTime:2;)
# 文字效果展示

(top:0.05;left:0.05;scale:1.1;fontSize:0.08;animate:rotateIn 2 2.5;)
一段演示文字

(top:0.051;left:0.7;rotate:20;fontSize:0.09;color:#AD7B7B;animate:fadeInLeft 1.5 2.5;)
一段演示文字

(top:0.401;left:0.35;scale:1.2;fontSize:0.09;color:#F11A90;animate:fadeInUp 1 2.5;)
一段演示文字

(top:0.7;left:0.15;opacity:0.6;fontSize:0.1;color:#269141;animate:fadeInDown 2 2.5;animateEnd:0 0 1 1 0;)
一段演示文字

(top:0.7;left:0.47;opacity:0.6;fontSize:0.14;color:#881212;animate:fadeInDown 1 3;)
一段演示文字

---

[sceneBgColor:#DCCFCF;transition:BackOff;transitionTime:2;duration:8;]
(fontSize:0.06;color:#F70C1C;animateEnd:0 0 1 1 0;animateTime:2;animateEase:Quartic.In;)
# 视频效果展示

(width:0.5;height:0.5;from:2;to:12;animate:rotateIn 2 3;)
@[](D:\video\1.mp4)

(width:0.5;height:0.5;left:0.5;to:10;animate:backIn 2 3;)
@[](D:\video\1.mp4)

(width:0.5;height:0.5;top:0.5;from:3;to:13;animate:rotateIn 2 3;)
@[](D:\video\1.mp4)

(width:0.5;height:0.5;top:0.5;left:0.5;from:7;to:17;animate:fadeIn 2 3;)
@[](D:\video\1.mp4)

---

[sceneBgColor:#2F3A76;transition:Oblique;transitionTime:2;duration:7;]
# 语音旁白演示

*这是一段语音旁白，会自动生成字幕*

---

[sceneBgColor:#854E4E;duration:10;]
# 音频剪辑演示

(to:10;)
&[](D:\audio\1.mp3)

---

[sceneBgColor:#4EBEA7;transition:BackOff;transitionTime:1.5;duration:6;]
(animateEnd:0 0 1 1 0;animateTime:1.5;)
# bug及问题反馈

(top:0.46;left:0.24;fontSize:0.06;animate:fadeIn 2 2.5;animateEnd:0 0 1 1 0;)
QQ群：576301295

(top:0.56;left:0.24;fontSize:0.06;animate:fadeIn 2 2.5;animateEnd:0 0 1 1 0;)
网址:https://mdvideo.gshll.com/

---

```

