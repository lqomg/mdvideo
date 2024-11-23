import { IMDPluginOptions, getCurrentUrl } from '../helper';

import Props from './Props.vue';
import Sprite from './Sprite.vue';
import Tools from './Tools.vue';
export const VideoPluginName = 'md-video';
import demoGif from '@resources/assets/demo.gif?url';
import demoMp4 from '@resources/assets/demo.mp4?url';
const video: IMDPluginOptions = {
  name: VideoPluginName,
  defaultCommonStyle: ({ width, height }) => {
    return {
      width: width * 0.4,
      height: height * 0.4,
      top: height * 0.2,
      left: width * 0.2
    };
  },
  defaultProps: {
    src: getCurrentUrl(demoMp4),
    cover: getCurrentUrl(demoGif),
    loop: true,
    bgAudio: true,
    startTime: 0,
    duration: 0,
    isBackground: false
  },
  layer: {
    icon: 'icon-VideoCamera',
    title: '视频'
  },
  Props,
  Sprite,
  Tools
};

export default video;
