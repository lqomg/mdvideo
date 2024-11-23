import { IMDPluginOptions } from '../helper';

import Props from './Props.vue';
import Sprite from './Sprite.vue';
import Tools from './Tools.vue';
export const TextPluginName = 'md-text';
const text: IMDPluginOptions = {
  name: TextPluginName,
  defaultCommonStyle: ({ width, height }) => ({
    width: width * 0.8,
    height: height * 0.2,
    top: height * 0.1,
    left: width * 0.1,
    paddingTop: 10,
    textAlign: 'center',
    fontStyle: 'normal',
    fontWeight: 'normal',
    letterSpacing: 5,
    showFill: false,
    fill: ['#ffaacc', '#B15959', '#00ff99'],
    lineHeight: 1.3,
    dropShadow: false, // 启用阴影
    dropShadowColor: '#B15959', // 阴影颜色
    dropShadowBlur: 6, // 阴影模糊度
    dropShadowAngle: Math.PI / 6, // 阴影角度，弧度制
    dropShadowDistance: 4, // 阴影距离
    dropShadowAlpha: 1
  }),
  defaultProps: {
    text: '添加文本'
  },
  layer: {
    icon: 'icon-wenzi',
    title: 'propsValue.text'
  },
  Props,
  Sprite,
  Tools
};

export default text;
