import { IMDPluginOptions, getCurrentUrl } from '../helper';

import Props from './Props.vue';
import Sprite from './Sprite.vue';
import Tools from './Tools.vue';
import demoMp3 from '@resources/assets/demo.mp3?asset';
export const AudioPluginName = 'md-audio';

const audio: IMDPluginOptions = {
  name: AudioPluginName,
  defaultCommonStyle: ({ width, height }) => {
    return {
      width: 80,
      height: 80,
      top: 10,
      left: 10
    };
  },
  defaultProps: {
    src: getCurrentUrl(demoMp3),
    startTime: 0,
    duration: 0,
    totalDuration: 3
  },
  disabledResize: true,
  disabledDrag: true,
  disabledRotate: true,
  layer: {
    icon: 'icon-audio',
    title: '音频'
  },
  Props,
  Sprite,
  Tools
};

export default audio;
