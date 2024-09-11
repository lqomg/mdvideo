import{_ as t,o as d,c as e,Q as o}from"./chunks/framework.419948d5.js";const a="/assets/text.61d0da54.png",r="/assets/text.0657bbd2.mp4",b=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"guide/m-text.md","filePath":"guide/m-text.md","lastUpdated":1702378897000}'),n={name:"guide/m-text.md"},c=o('<h2 id="文本" tabindex="-1">文本 <a class="header-anchor" href="#文本" aria-label="Permalink to &quot;文本&quot;">​</a></h2><p>MD Video会将加粗字体和斜体当成普通文本展示</p><img src="'+a+'"><h2 id="示例" tabindex="-1">示例 <a class="header-anchor" href="#示例" aria-label="Permalink to &quot;示例&quot;">​</a></h2><p><video src="'+r+`" autoplay controls></video></p><h3 id="以下文本将会转为对应视频" tabindex="-1">以下文本将会转为对应视频： <a class="header-anchor" href="#以下文本将会转为对应视频" aria-label="Permalink to &quot;以下文本将会转为对应视频：&quot;">​</a></h3><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>部分字体需要导入相关资源，软件提供免费资源包下载！</p></div><pre class="demo-code">&amp;duration=4

**这是个普通文本信息**

\`\`\`元素配置
@fontFamily=手写杂书体
@color=#00C8D1
@position=top
@offsetY=40
@fontSize=0.08
\`\`\`

*这是个普通文本信息*

\`\`\`元素配置
@color=#5C4D3D
@shadowColor=red
@fontSize=100
@rotate=30
@animate=fadeInLeft
@delay=1
\`\`\`

**这是个普通文本信息**

\`\`\`元素配置
@position=bottom
@fill=#FF0000,#00FF00,#0000FF
@offsetY=-60
@fontSize=100
@delay=2
\`\`\`
</pre><h2 id="配置信息" tabindex="-1">配置信息 <a class="header-anchor" href="#配置信息" aria-label="Permalink to &quot;配置信息&quot;">​</a></h2><table><thead><tr><th>全称</th><th>含义</th><th>默认</th><th>其他</th></tr></thead><tbody><tr><td><code>@duration</code></td><td>持续时长</td><td>跟随<a href="/guide/m-scene.html">场景时长</a></td><td></td></tr><tr><td><code>@delay</code></td><td>延迟出现时间</td><td>0s</td><td></td></tr><tr><td><code>@left</code></td><td>元素横向位置</td><td>0</td><td>当值介于0-1时，表示大小为视频宽度百分比</td></tr><tr><td><code>@top</code></td><td>元素纵向位置</td><td>0</td><td>当值介于0-1时，表示大小为视频高度百分比</td></tr><tr><td><code>@position</code></td><td><a href="/guide/m-position.html">内置位置</a> 信息</td><td>缺省</td><td></td></tr><tr><td><code>@offsetX</code></td><td>横向偏移量</td><td>0</td><td>存在position时才生效</td></tr><tr><td><code>@offsetY</code></td><td>纵向偏移量</td><td>0</td><td>存在position时才生效</td></tr><tr><td><code>@rotate</code></td><td>旋转角度</td><td>0</td><td></td></tr><tr><td><code>@color</code></td><td>文字颜色</td><td>#000 ,黑色</td><td></td></tr><tr><td><code>@fontFamily</code></td><td>字体</td><td>微软雅黑</td><td></td></tr><tr><td><code>@fontSize</code></td><td>字体大小</td><td>缺省</td><td>当值介于0-1时，表示占比视频宽度</td></tr><tr><td><code>@fontWeight</code></td><td>字体加粗,</td><td>normal</td><td>可选值为bold</td></tr><tr><td><code>@fontStyle</code></td><td>字体样式（斜体）</td><td>normal</td><td>可选值为italic</td></tr><tr><td><code>@letterSpacing</code></td><td>字体间距，表示每个文字之间的距离</td><td>6</td><td></td></tr><tr><td><code>@shadowColor</code></td><td>文字阴影颜色</td><td>缺省</td><td></td></tr><tr><td><code>@fill</code></td><td>文字渐变色</td><td>缺省</td><td>值为三个色组，当shadowColor存在时此配置不会生效</td></tr></tbody></table>`,10),i=[c];function s(l,h,p,f,m,_){return d(),e("div",null,i)}const x=t(n,[["render",s]]);export{b as __pageData,x as default};
