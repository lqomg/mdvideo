import { createRequire } from 'module'
import { defineConfig, type DefaultTheme } from 'vitepress'

const require = createRequire(import.meta.url)
const pkg = require('vitepress/package.json')

export default defineConfig({
  lang: 'zh-CH',
  title: '呜噢哇',
  description: '将Markdown文档快速转为视频的编辑器.',
  lastUpdated: true,
  cleanUrls: false,

  sitemap: {
    hostname: 'https://www.wvovw.com',
    transformItems(items) {
      return items.filter((item) => !item.url.includes('migration'))
    }
  },

  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'zh-CN' }],
    ['meta', { name: 'og:site_name', content: 'MD Video, MD+ Video, wvovw，MDVideo，mdvideo' }],
    ['meta', { name: 'description', content: 'MD Video, MD+ Video, MD Video, mdvideo, 一个将markdown文档转为视频的便捷工具，文档里面的视频、音频、图片网址，都会抓取后插入视频，还可以根据文字生成AI语音的旁白朗读' }],
    ['meta', { name: 'keywords', content: 'MD Video, MD+ Video, mdvideo, MDvideo, Markdown To Video, 文档转视频, 视频处理工具 , Markdown转视频' }],
    // [
    //   'script',
    //   {
    //     src: 'https://cdn.usefathom.com/script.js',
    //     'data-site': 'AZBRSFGG',
    //     'data-spa': 'auto',
    //     defer: ''
    //   }
    // ]
  ],

  themeConfig: {
    logo: { src: '/logo.png', width: 24, height: 24 },

    nav: nav(),

    sidebar: {
      '/guide/': { base: '/guide/', items: sidebarGuide() }
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/lqomg/mdvideo' }
    ],
    footer: {
      message: 'www.wvovw.com MD+ Video.',
      copyright: 'Copyright © 2023-present Qian Lin'
    },
    // carbonAds: {
    //   code: 'qqq',
    //   placement: 'vuejsorg'
    // }
  }
})

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: '下载安装',
      link: '/guide/download',
      activeMatch: '/guide/'
    }
  ]
}

/* prettier-ignore */
function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '介绍',
      collapsed: false,
      items: [
        { text: 'MD Video是什么?', link: 'what-is-wvovw' },
        { text: '如何安装和使用', link: 'download' },
        { text: '如何获取素材资源', link: 'get-resource' },
        { text: '反馈与意见', link: 'issue' }
      ]
    },
    {
      text: 'Markdown转视频',
      collapsed: false,
      items: [
        { text: '场景', link: 'm-scene' },
        { text: '位置信息', link: 'm-position' },
        { text: '文本', link: 'm-text' },
        { text: 'AI字幕', link: 'm-subtitle' },
        { text: '图片', link: 'm-image' },
        { text: '视频', link: 'm-video' },
        { text: '音频', link: 'm-audio' },
        { text: '代码块，表格，任务列表', link: 'm-other' },
        { text: '动画效果', link: 'm-animate' },
        { text: '转场动画', link: 'm-transition' },
      ]
    },
    {
      text: '基础使用',
      collapsed: false,
      items: [
        { text: '工作台', link: 'work-space' },
        { text: '场景、背景', link: 'scene-bg' },
        { text: '文本、AI语音字幕', link: 'text-ai-subtitle' },
        { text: '视频、音频', link: 'video-audio' },
        { text: '图片、表情包', link: 'image-bqb' },
        { text: '人物角色', link: 'lottie' },
        { text: '短视频解析', link: 'dsl' },
        { text: '可视化图表', link: 'chart' }
      ]
    },
    {
      text: '自定义模板',
      collapsed: false,
      items: [
        { text: '开发中...', link: '' },
      ]
    }
  ]
}
