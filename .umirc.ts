import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'MDvideo',
  favicon: './images/logo.png',
  logo: './images/logo.png',
  outputPath: 'dist',
  mode: 'site',
  // more config: https://d.umijs.org/config
  metas: [
    {
      name: 'keywords',
      content: 'mdvideo, MDvideo, Markdown To Video, 文档转视频, 视频处理工具 ',
    },
    {
      name: 'description',
      content: 'MDvideo,一个将markdown文档转为视频的便捷工具，文档里面的视频、音频、图片网址，都会抓取后插入视频，还可以根据文字生成人工语音的旁白朗读',
    },
    {
      bar: 'mdvideo,mdVideom,视频处理工具',
    },
  ],
});
