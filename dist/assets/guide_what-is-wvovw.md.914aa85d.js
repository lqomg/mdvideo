import{_ as n,o,c as e,Q as t}from"./chunks/framework.419948d5.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"guide/what-is-wvovw.md","filePath":"guide/what-is-wvovw.md","lastUpdated":1702378897000}'),a={name:"guide/what-is-wvovw.md"},d=t(`<h2 id="介绍" tabindex="-1">介绍 <a class="header-anchor" href="#介绍" aria-label="Permalink to &quot;介绍&quot;">​</a></h2><p>MD Video是一款将可以将Markdown文档转为视频的编辑器，支持视频实时预览，语法提示等等。</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>xax</p></div><pre class="demo-code">## MD Video(Markdown To Video)

# 演示视频
\`\`\`元素配置
@fontFamily=钟齐流江毛草
@fontSize=0.16
@color=red
@shadowColor=#0000FF
@animate=bounceInLeft

\`\`\`

![](https://mdvideo-1301321746.cos.ap-chengdu.myqcloud.com/动画.gif)

\`\`\`元素配置
@delay=2
@height=0.8
@width=0.8
@offsetY=80
\`\`\`

这是一款可以将Markdown文档中的元素提取出来，转为视频的工具。

并且它还是一个视频编辑器，支持将生成的视频在细节上面进一步做出的调整

![bg](https://mdvideo-1301321746.cos.ap-chengdu.myqcloud.com/bg.jpg)

---

&amp;transName=CircleCrop
&amp;backgroundColor=#3D7D2C

它支持将Markdown文档中的文字、图片，动态Gif、代码块、表格、列表等转为视频元素。甚至可以通过一定的方式，提取出文档中的视频、音频、图表等元素添加到视频中

\`\`\`元素配置
@speaker=101013
\`\`\`

**文字演示**

\`\`\`元素配置
@delay=2
@fontFamily=沐瑶软笔手写体
@fontSize=0.08
@shadowColor=#800080
@position=top
@animate=rollIn
@zIndex=10
\`\`\`
![](https://mdvideo-1301321746.cos.ap-chengdu.myqcloud.com/text.png)

\`\`\`元素配置
@delay=3
@animate=bounceInRight
@position=top-left
@width=0.4
@height=0.4
@rotate=-30
\`\`\`

![](https://mdvideo-1301321746.cos.ap-chengdu.myqcloud.com/gif.gif)


\`\`\`元素配置
@delay=4
@animate=fadeInLeftBig
@position=top-right
@width=0.4
@height=0.4
@rotate=30
\`\`\`

\`\`\`js
const markdowns = [&#39;m&#39;];

console.log(&#39;hello word&#39;)
\`\`\`

\`\`\`元素配置
@delay=5
@position=bottom-left
@width=0.4
@height=0.4
\`\`\`

| 表头 | 表头 | 表头 | 表头 |
| - | - | - | - |
| 单元内容 | 单元内容 | 单元内容 | 单元内容 |
| 单元内容 | 单元内容 | 单元内容 | 单元内容 |
| 单元内容 | 单元内容 | 单元内容 | 单元内容 |

\`\`\`元素配置
@delay=6
@position=bottom-right
@width=0.4
@height=0.4
\`\`\`

[video](https://mdvideo-1301321746.cos.ap-chengdu.myqcloud.com/%E4%BD%A0%E5%A5%BD%E9%AA%9A%E5%95%8A.mp4)

\`\`\`元素配置

@delay=11

\`\`\`
---

&amp;backgroundColor=#ADD8E6

\`\`\`chart
option = {
  xAxis: {
    type: &#39;category&#39;,
    boundaryGap: false,
    data: [&#39;Mon&#39;, &#39;Tue&#39;, &#39;Wed&#39;, &#39;Thu&#39;, &#39;Fri&#39;, &#39;Sat&#39;, &#39;Sun&#39;]
  },
  yAxis: {
    type: &#39;value&#39;
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: &#39;line&#39;,
      areaStyle: {}
    }
  ]
};
\`\`\`

\`\`\`元素配置
@animate=fadeInLeft
@delay=1
\`\`\`

![](https://mdvideo-1301321746.cos.ap-chengdu.myqcloud.com/echarts.png)

\`\`\`元素配置
@delay=8
\`\`\`

**https://echarts.apache.org/examples/zh/index.html**

\`\`\`元素配置
@position=top-left
@fontSize=0.03
@color=#0000FF
@offsetX=50
@offsetY=50
@delay=10
\`\`\`
除此之外，它还支持将Echart配置转为图表，就像上图这样。你可以直接去echart的官网示例中，复制配置粘贴到文档中即可

\`\`\`元素配置
@speaker=101015
\`\`\`

---

&amp;duration=60

[video](https://mdvideo-1301321746.cos.ap-chengdu.myqcloud.com/19-36-18.mp4)

\`\`\`元素配置
@width=1
@height=0.9
@top=0

\`\`\`

[audio](https://mdvideo-1301321746.cos.ap-chengdu.myqcloud.com/audio.mp3)

编写配置信息时支持一定的提示语法，就像当前视频演示的这样。

当你对通过文档生成的视频不满意时，你还可以通过点击右上角的编辑细节，进入更加精细化的操作

\`\`\`元素配置
@delay=40
@speaker=101003
\`\`\`

</pre>`,4),i=[d];function s(c,p,h,r,l,m){return o(),e("div",null,i)}const f=n(a,[["render",s]]);export{g as __pageData,f as default};
