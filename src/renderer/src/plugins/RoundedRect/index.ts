import { IMDPluginOptions, getCurrentUrl } from '../helper';

import Props from './Props.vue';
import Sprite from './Sprite.vue';
import Tools from './Tools.vue';
export const RoundedRectPluginName = 'md-round-rect';

const image: IMDPluginOptions = {
  name: RoundedRectPluginName,
  defaultCommonStyle: ({ width, height }) => {
    return {
      width: 400,
      height: 300,
      top: height * 0.1,
      left: width * 0.1,
      backgroundColor: '#008cff',
      borderColor: '#008cff',
      borderStyle: 'solid',
      borderWidth: 5,
      borderRadius: 0
    };
  },
  defaultProps: {},
  layer: {
    icon: 'icon-juxing',
    title: '矩形/圆角'
  },
  Props,
  Sprite,
  Tools
};

export default image;
