import { IMDPluginOptions, getCurrentUrl } from '../helper';

import Props from './Props.vue';
import Sprite from './Sprite.vue';
import Tools from './Tools.vue';
export const LottiePluginName = 'md-lottie';

const lottie: IMDPluginOptions = {
  name: LottiePluginName,
  defaultCommonStyle: ({ width, height }) => {
    return {
      width: width * 0.2,
      height: height * 0.2,
      top: height * 0.1,
      left: width * 0.1
    };
  },
  defaultProps: {
    path: '',
    lottie: {}
  },
  layer: {
    icon: 'icon-Image',
    title: '图片'
  },
  Props,
  Sprite,
  Tools
};

export default lottie;
