import{_ as t,o,c as n,Q as e}from"./chunks/framework.419948d5.js";const i="/assets/position.9b86406b.png",d="/assets/position.a36dfceb.mp4",w=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"guide/m-position.md","filePath":"guide/m-position.md","lastUpdated":1702378897000}'),a={name:"guide/m-position.md"},p=e('<h2 id="基础位置" tabindex="-1">基础位置 <a class="header-anchor" href="#基础位置" aria-label="Permalink to &quot;基础位置&quot;">​</a></h2><p>为了方便处理元素位置，提供@position配置项，以帮助快速定位元素</p><blockquote><p>借助offsetX,offsetY可以帮助微调位置信息，此配置对大部分元素生效</p></blockquote><pre class="demo-code">\n![](https://mdvideo.wvovw.com/logo.png)\n\n```元素配置\n@position=center\n```\n</pre><img src="'+i+'"><p>可以为以下八个值</p><ul><li>top：顶部居中</li><li>bottom：底部居中</li><li>center：垂直居中</li><li>top-left：左上角</li><li>top-right：右上角</li><li>center-left：垂直居中靠左</li><li>center-right：垂直居中靠右</li><li>bottom-left：左下角</li><li>bottom-right：右下角</li></ul><h2 id="示例" tabindex="-1">示例 <a class="header-anchor" href="#示例" aria-label="Permalink to &quot;示例&quot;">​</a></h2><p><video src="'+d+`" autoplay controls></video></p><h3 id="以下文本将会转为对应视频" tabindex="-1">以下文本将会转为对应视频： <a class="header-anchor" href="#以下文本将会转为对应视频" aria-label="Permalink to &quot;以下文本将会转为对应视频：&quot;">​</a></h3><pre class="demo-code">
&amp;backgroundColor=#2A52BE
&amp;duration=10

![](https://mdvideo.wvovw.com/logo.png)

\`\`\`元素配置
@position=top-left
@width=0.1
@height=0.1
@delay=0
\`\`\`

![](https://mdvideo.wvovw.com/logo.png)

\`\`\`元素配置
@position=top
@width=0.1
@height=0.1
@delay=1
\`\`\`

![](https://mdvideo.wvovw.com/logo.png)

\`\`\`元素配置
@position=top-right
@width=0.1
@height=0.1
@delay=2
\`\`\`

![](https://mdvideo.wvovw.com/logo.png)

\`\`\`元素配置
@position=center-left
@width=0.1
@height=0.1
@delay=3
\`\`\`

![](https://mdvideo.wvovw.com/logo.png)

\`\`\`元素配置
@position=center
@width=0.1
@height=0.1
@delay=4
\`\`\`

![](https://mdvideo.wvovw.com/logo.png)

\`\`\`元素配置
@position=center-right
@width=0.1
@height=0.1
@delay=5
\`\`\`

![](https://mdvideo.wvovw.com/logo.png)

\`\`\`元素配置
@position=bottom-left
@width=0.1
@height=0.1
@delay=6
\`\`\`

![](https://mdvideo.wvovw.com/logo.png)

\`\`\`元素配置
@position=bottom
@width=0.1
@height=0.1
@delay=7
\`\`\`

![](https://mdvideo.wvovw.com/logo.png)

\`\`\`元素配置
@position=bottom-right
@width=0.1
@height=0.1
@delay=8
\`\`\`
</pre><h2 id="位置微调" tabindex="-1">位置微调 <a class="header-anchor" href="#位置微调" aria-label="Permalink to &quot;位置微调&quot;">​</a></h2><p>在存在position配置的情况，可借助offsetX和offsetY微调位置信息</p><p>如:</p><pre>
![](https://mdvideo.wvovw.com/logo.png)

\`\`\`元素配置
@position=center
@offsetX=100
@offsetY=100
\`\`\`
</pre><p>表示居中之后横向移动100px，纵向移动100px</p><h2 id="配置信息" tabindex="-1">配置信息 <a class="header-anchor" href="#配置信息" aria-label="Permalink to &quot;配置信息&quot;">​</a></h2><table><thead><tr><th>全称</th><th>含义</th><th>默认</th><th>其他</th></tr></thead><tbody><tr><td><code>@position</code></td><td>基础位置，</td><td>center,不同元素可能不一样</td><td>参见上表</td></tr><tr><td><code>@offsetX</code></td><td>相对基础位置的横轴偏移量</td><td>0</td><td></td></tr><tr><td><code>@offsetY</code></td><td>相对基础位置的纵轴偏移量</td><td>0</td><td></td></tr></tbody></table>`,18),s=[p];function h(l,r,c,m,g,v){return o(),n("div",null,s)}const _=t(a,[["render",h]]);export{w as __pageData,_ as default};
