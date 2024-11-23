import { IMDPluginOptions } from '../helper';

import Props from './Props.vue';
import Sprite from './Sprite.vue';
import Tools from './Tools.vue';
export const SubtitlePluginName = 'md-subtitle';
const subtitle: IMDPluginOptions = {
  name: SubtitlePluginName,
  defaultCommonStyle: ({ width, height }) => {
    const fontSize = Math.ceil(width / (width > height ? 34 : 30));
    return {
      width: width * 0.88,
      height: fontSize * 1.6 + 26,
      fontSize: fontSize,
      textAlign: 'center',
      letterSpacing: 4,
      lineHeight: 1.4,
      paddingTop: 10,
      top: height - fontSize * 1.6 - 30,
      left: width * 0.1,
      color: '#FFFFFF',
      fill: ['#ffaacc', '#B15959', '#00ff99'],
      dropShadow: false, // 启用阴影
      dropShadowColor: '#B15959', // 阴影颜色
      dropShadowBlur: 6, // 阴影模糊度
      dropShadowAngle: Math.PI / 6, // 阴影角度，弧度制
      dropShadowDistance: 4, // 阴影距离
      dropShadowAlpha: 1
    };
  },
  disabledResize: true,
  disabledDrag: true,
  disabledRotate: true,
  defaultProps: {
    text: '最近，世界知名咨询公司发布了一份报告，显示全球城市化进程仍在继续，但同时也指出，城市化进程带来了一系列问题，需要引起人们的高度关注。',
    voiceSrc: '',
    voiceType: 'tengxun',
    voiceId: '101004',
    voiceSpeed: 0,
    voiceVolume: 5,
    voiceDuration: 0
  },
  layer: {
    icon: 'icon-05xiabiao',
    title: 'propsValue.text'
  },
  Props,
  Sprite,
  Tools
};

export default subtitle;
