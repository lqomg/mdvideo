import { IMDPluginOptions } from '../helper';

import Props from './Props.vue';
import Sprite from './Sprite.vue';
import Tools from './Tools.vue';
export const CriclrPluginName = 'md-circle';

const image: IMDPluginOptions = {
  name: CriclrPluginName,
  defaultCommonStyle: ({ width, height }) => {
    return {
      width: 400,
      height: 400,
      top: height * 0.1,
      left: width * 0.1,
      backgroundColor: '#008cff',
      borderColor: '#008cff',
      borderStyle: 'solid',
      borderWidth: 5,
    };
  },
  defaultProps: {},
  layer: {
    icon: 'icon-radio-on',
    title: '圆形'
  },
  Props,
  Sprite,
  Tools
};

export default image;
