import { IMDProjectScene, IMDProjectInfo, IMDCommonStyle, IMDElement } from '@renderer/types';
import { StyleValue, toRaw } from 'vue';

export const VerticalVideoInfo = {
  WIDTH: 1080,
  HEIGHT: 1920
};
export const HorizontaVideoInfo = {
  WIDTH: 1920,
  HEIGHT: 1080
};

// 页面配置信息字段
export const DefaultProjectInfo: IMDProjectInfo = {
  name: '',
  title: 'MD Video',
  author: '',
  width: HorizontaVideoInfo.WIDTH,
  height: HorizontaVideoInfo.HEIGHT,
  fps: 60,
  cover: ''
};
export const DefaultCommonStyle: IMDCommonStyle = {
  position: 'absolute',
  width: 400,
  height: 300,
  top: 0,
  left: 0,
  rotate: 0,
  paddingTop: 0,
  paddingLeft: 0,
  paddingRight: 0,
  paddingBottom: 0,
  marginTop: 0,
  marginLeft: 0,
  marginRight: 0,
  marginBottom: 0,
  borderWidth: 0,
  borderColor: '',
  borderStyle: 'solid',
  borderRadius: 0,
  fontSize: 16,
  fontFamily: 'Microsoft Yahei',
  fontWeight: 'normal',
  lineHeight: 1.4,
  letterSpacing: 0,
  textAlign: 'center',
  color: '#000000',
  candidateColor: [],
  backgroundColor: '',
  backgroundImage: '',
  backgroundSize: 'cover',
  dropShadow: false,
  dropShadowColor: '#c1a1a1',
  dropShadowDistance: 0,
  opacity: 1,
  zIndex: 1,
  dropShadowAlpha: 0,
  dropShadowBlur: 0,
  dropShadowAngle: 0
};
export const DefaultProjectScene: IMDProjectScene = {
  elements: [],
  uuid: 'ajsdihanxxjajx_kasdaq',
  commonStyle: {
    backgroundColor: '#ffffff',
    backgroundImage: '',
    backgroundSize: 'cover'
  },
  data: {
    duration: 10,
    transName: 'none',
    transDuration: 0.5
  }
};

export const DefaultElementAnimate: IMDElement['animations'] = {
  in: {
    type: 'fadeIn',
    delay: 0,
    time: 0.5
  },
  out: {
    type: 'fadeOut',
    delay: 3,
    time: 0.5
  }
};

export const MinSceneDuration = 5;
export const MaxSceneDuration = 60 * 5;
/**
 * 获取元素样式
 * @param styleObj
 * @param scalePoint 缩放比例
 */
export const getCommonStyle = (styleObj: IMDCommonStyle, scalingRatio = 1, notPx = false) => {
  const needUnitStr: string[] = [
    'width',
    'height',
    'top',
    'left',
    'paddingTop',
    'paddingLeft',
    'paddingRight',
    'paddingBottom',
    'paddingBottom',
    'marginTop',
    'marginLeft',
    'marginRight',
    'marginBottom',
    'borderWidth',
    'fontSize',
    'borderRadius',
    'letterSpacing'
  ];
  const style: Partial<IMDCommonStyle> | any = {};

  for (const key in styleObj) {
    if (needUnitStr.includes(key)) {
      style[key] = styleObj[key] * scalingRatio;
      if (!notPx) {
        style[key] = style[key] + 'px';
      }
    } else {
      style[key] = styleObj[key];
    }
  }
  style.backgroundImage = style.backgroundImage
    ? `url('${style.backgroundImage.replace(/\\/gi, '//')}')`
    : '';
  if (style.showFill) {
    const fill = toRaw(style.fill);
    const obj = {};
    obj['background-image'] = `linear-gradient( ${fill[0]}, ${fill[1]},${fill[2]})`;
    obj['-webkit-background-clip'] = 'text';
    obj['-webkit-text-fill-color'] = 'transparent';
    style['fillObj'] = obj;
  }
  if (styleObj.dropShadow) {
    const dropShadowDistance = styleObj.dropShadowDistance * scalingRatio;
    const dropShadowBlur = styleObj.dropShadowBlur * scalingRatio;
    style.textShadow = `${dropShadowDistance}px ${dropShadowDistance}px ${dropShadowBlur}px ${styleObj.dropShadowColor}`;
  }
  return style;
};

export const TransitionsName = [
  {
    value: 'none',
    label: '无动画'
  },
  { label: 'Fat', value: 'Fat' },
  { label: '聚焦破碎', value: 'Lens' },
  { label: '摇晃进入', value: 'Shake' },
  { label: '双影淡出', value: 'Slice' },
  { label: '逐渐淡入', value: 'Stretch' },
  { label: '滑动翻篇', value: 'Fluidly' },
  { label: 'BackOff', value: 'BackOff' },
  { label: 'Oblique', value: 'Oblique' },
  { label: '向右划出', value: 'MoveLeft' },
  { label: 'Windows4', value: 'Windows4' },
  { label: '丰富多彩', value: 'Colorful' },
  { label: '渐进放大', value: 'Magnifier' },
  { label: '渐散划出', value: 'Tetrapod' },
  { label: '向右缩放', value: 'ZoomRight' },
  { label: 'Radiation', value: 'Radiation' },
  { label: '水波滑动', value: 'WaterWave' },
  { label: 'FastSwitch', value: 'FastSwitch' },
  { label: '窗帘闪开', value: 'WindowShades' },
  { label: '圆形裁剪', value: 'CircleCrop' },
  // { label: '三色圆环', value: 'TricolorCircle' },
  { label: '流沙效果', value: 'Quicksand' }
];

export const getTransitionLabel = (name: string) =>
  TransitionsName.find((t) => t.value === name)?.label;
