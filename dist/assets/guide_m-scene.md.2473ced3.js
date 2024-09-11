import{_ as s,o as a,c as n,Q as t}from"./chunks/framework.419948d5.js";const e="/assets/scene.a8ea35d6.mp4",b=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"guide/m-scene.md","filePath":"guide/m-scene.md","lastUpdated":1702378897000}'),o={name:"guide/m-scene.md"},l=t(`<h2 id="基础语法" tabindex="-1">基础语法 <a class="header-anchor" href="#基础语法" aria-label="Permalink to &quot;基础语法&quot;">​</a></h2><p>MD Video基本遵从Markdown默认的语法规范，使用分隔符 <code>---</code> 表示不同的视频场景;</p><p>这是最基本的配置，创建了两个场景，第一个场景背景颜色是红色，第二个是蓝色，并且第二个场景有一张图片。</p><div class="language-markdown vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">markdown</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">&amp;backgroundColor=#4183B4</span></span>
<span class="line"><span style="color:#E1E4E8;">&amp;transName=WaterWave</span></span>
<span class="line"><span style="color:#E1E4E8;">&amp;duration=2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;font-weight:bold;"># 风萧萧兮易水寒!</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;font-weight:bold;">---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">&amp;backgroundColor=#3CB371</span></span>
<span class="line"><span style="color:#E1E4E8;">&amp;duration=3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;font-weight:bold;"># 壮士一去兮不复还!</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">&amp;backgroundColor=#4183B4</span></span>
<span class="line"><span style="color:#24292E;">&amp;transName=WaterWave</span></span>
<span class="line"><span style="color:#24292E;">&amp;duration=2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;font-weight:bold;"># 风萧萧兮易水寒!</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;font-weight:bold;">---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">&amp;backgroundColor=#3CB371</span></span>
<span class="line"><span style="color:#24292E;">&amp;duration=3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;font-weight:bold;"># 壮士一去兮不复还!</span></span></code></pre></div><p>以上配置将会转为一下视频输出：</p><p><video src="`+e+'" autoplay controls></video></p><h2 id="配置" tabindex="-1">配置 <a class="header-anchor" href="#配置" aria-label="Permalink to &quot;配置&quot;">​</a></h2><blockquote><p>以下是场景支持的配置。存在AI语音时如果场景时间不足，将会自动延长</p></blockquote><table><thead><tr><th>全称</th><th>含义</th><th>默认</th><th>其他</th></tr></thead><tbody><tr><td><code>@duration</code></td><td>持续时长</td><td>6s</td><td>数字类型</td></tr><tr><td><code>@backgroundColor</code></td><td>背景颜色</td><td>白色</td><td></td></tr><tr><td><code>@transName</code></td><td>场景之间的过渡动画</td><td>无</td><td>可以为 Lens, MoveLeft,Oblique,Shake, Magnifier等 根据提示选择</td></tr><tr><td><code>@transDuration</code></td><td>场景之间的过渡动画的持续时间</td><td>0.5s</td><td></td></tr></tbody></table><h2 id="元素大小" tabindex="-1">元素大小 <a class="header-anchor" href="#元素大小" aria-label="Permalink to &quot;元素大小&quot;">​</a></h2><blockquote><p>设置元素<strong>宽度(width)</strong>，<strong>左间距(left)</strong>, <strong>X轴偏移量(offsetX)<strong>等时，值介于 “0” 至 “1” 之间时表示占视频宽度的比例，如0.5表示占视频</strong>宽度</strong>的50%；</p></blockquote><blockquote><p>设置元素<strong>高度(height)</strong>，<strong>顶部间距(top)</strong>, <strong>Y轴偏移量(offsetY)<strong>等时，值介于 “0” 至 “1” 之间时表示占视频高0度的比例，如0.5表示占视频</strong>高度</strong>的50%；</p></blockquote>',12),p=[l];function r(d,c,i,h,g,u){return a(),n("div",null,p)}const _=s(o,[["render",r]]);export{b as __pageData,_ as default};
