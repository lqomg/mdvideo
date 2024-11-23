import { IMDPluginOptions, getCurrentUrl } from '../helper';

import Props from './Props.vue';
import Sprite from './Sprite.vue';
import Tools from './Tools.vue';
import demoPng from '@resources/assets/demo.png?asset';
export const ImagePluginName = 'md-image';

const image: IMDPluginOptions = {
  name: ImagePluginName,
  defaultCommonStyle: ({ width, height }) => {
    return {
      width: width * 0.4,
      height: height * 0.4,
      top: height * 0.1,
      left: width * 0.1
    };
  },
  defaultProps: {
    src: getCurrentUrl(demoPng)
  },
  layer: {
    icon: 'icon-Image',
    title: '图片'
  },
  Props,
  Sprite,
  Tools
};

export default image;
