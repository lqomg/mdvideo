import { VoiceList } from '@renderer/components/AudioVoice/contanst';
import { TransitionsName } from '@renderer/config/DataModel';
import { animateInCssData } from '@renderer/config/animateCssData';
import { AnimateSpeed } from '../editor/attr/animate/constant';
import { FontFamilyList } from '@renderer/plugins/Text/constant';

const colors = [
  { label: '黑色', value: '#000000' },
  { label: '白色', value: '#FFFFFF' },
  { label: '灰色', value: '#808080' },
  { label: '粉色', value: '#FFC0CB' },
  { label: '红色', value: '#FF0000' },
  { label: '绿色', value: '#00FF00' },
  { label: '蓝色', value: '#0000FF' },
  { label: '黄色', value: '#FFFF00' },
  { label: '紫色', value: '#800080' },
  { label: '橙色', value: '#FFA500' },
  { label: '海蓝', value: '#00C8D1' },
  { label: '巧克力色', value: '#675939' },
  { label: '蓝紫色', value: '#8051A3' },
  { label: '黄铜色', value: '#B9774C' },
  { label: '青铜色', value: '#837857' },
  { label: '士官服蓝色', value: '#2A52BE' },
  { label: '冷铜色', value: '#94511B' },
  { label: '铜色', value: '#B37E00' },
  { label: '珊瑚红', value: '#FF6E4A' },
  { label: '紫蓝色', value: '#8F46B4' },
  { label: '深绿色', value: '#0A5F41' },
  { label: '深铜绿色', value: '#7B7B3D' },
  { label: '深橄榄绿', value: '#5C4D3D' },
  { label: '深兰花色', value: '#6F46C1' },
  { label: '深紫色', value: '#8F3F91' },
  { label: '深石板蓝', value: '#2C3E50' },
  { label: '深铅灰色', value: '#6C6C5F' },
  { label: '深棕褐色', value: '#A57E68' },
  { label: '深绿松石色', value: '#4E6843' },
  { label: '暗木色', value: '#7C5D4F' },
  { label: '淡灰色', value: '#CBCACA' },
  { label: '土灰玫瑰红色', value: '#87705D' },
  { label: '长石色', value: '#F2E98E' },
  { label: '火砖色', value: '#CB8E8E' },
  { label: '森林绿', value: '#5E8861' },
  { label: '金色', value: '#FFD700' },
  { label: '铜绿色', value: '#A0C2B1' },
  { label: '青黄色', value: '#F2D094' },
  { label: '猎人绿', value: '#3D7D2C' },
  { label: '印度红', value: '#7B2D33' },
  { label: '浅蓝色', value: '#ADD8E6' },
  { label: '土黄色', value: '#F9A37F' },
  { label: '浅灰色', value: '#CDCDCD' },
  { label: '浅钢蓝色', value: '#B0C4DE' },
  { label: '浅木色', value: '#E6E2C0' },
  { label: '石灰绿色', value: '#97AF6F' },
  { label: '桔黄色', value: '#FFA07A' },
  { label: '褐红色', value: '#A85D4F' },
  { label: '中海蓝色', value: '#2C5282' },
  { label: '中蓝色', value: '#3F51B5' },
  { label: '中森林绿', value: '#4A6D39' },
  { label: '中鲜黄色', value: '#FAA633' },
  { label: '中兰花色', value: '#8B45DE' },
  { label: '中海绿色', value: '#247A4D' },
  { label: '中石板蓝色', value: '#4183B4' },
  { label: '中春绿色', value: '#3CB371' },
  { label: '中绿松石色', value: '#5D82C1' }
];
const fillColor = [
  {
    label: '红绿蓝',
    value: ['#FF0000', '#00FF00', '#0000FF']
  },
  {
    label: '橙黄绿',
    value: ['#FFA500', '#FFFF00', '#008000']
  },
  {
    label: '紫橙玫瑰色',
    value: ['#800080', '#808000', '#FF8C69']
  },
  {
    label: '樱花粉色',
    value: ['#FFC0CB', '#87CEEB', '#1E90FF']
  },
  {
    label: '金色深棕绿',
    value: ['#FFD700', '#B8860B', '#32CD32']
  },
  {
    label: '品红蓝色',
    value: ['#C71585', '#F48FB1', '#F8F8FF']
  },
  {
    label: '深红橙紫色',
    value: ['#B22233', '#D5ABAA', '#7B68EE']
  },
  {
    label: '深灰深紫色',
    value: ['#A7A6AF', '#D5C491', '#7A68EE']
  },
  {
    label: '品红偏蓝色',
    value: ['#C74DFF', '#6B25FE', '#9493FF']
  },
  {
    label: '银灰黄绿棕',
    value: ['#F4F4F4', '#7F93BC', '#7B7B7B']
  }
];
const animations = animateInCssData.map((c) => {
  return {
    label: c.label,
    value: c.value
  };
});
const positions = [
  { label: '垂直居中', value: 'center' },
  { label: '顶部居中', value: 'top' },
  { label: '底部居中', value: 'bottom' },
  { label: '左上角', value: 'top-left' },
  { label: '右上角', value: 'top-right' },
  { label: '垂直居左', value: 'center-left' },
  { label: '垂直居右', value: 'center-right' },
  { label: '左下角', value: 'bottom-left' },
  { label: '右下角', value: 'bottom-right' }
];

const widthHeightChildren = [
  { label: 200, value: 200 },
  { label: 800, value: 800 },
  { label: 1, value: 1 },
  { label: 0.5, value: 0.5 },
  { label: 0.2, value: 0.2 },
];
const fontSizes = [
  { label: 50, value: 50 },
  { label: 100, value: 100 },
  { label: '视频宽度的1%', value: 0.01 },
  { label: '视频宽度的2%', value: 0.02 },
  { label: '视频宽度的10%', value: 0.1 },
]

export const completionLists = [
  {
    label: '@width',
    display: '宽度',
    type: 'variable',
    tip: 'w',
    detail: '元素宽度',
    info: `值是数字类型，可生效于图片、代码块、表格、视频等元素;`,
    children: widthHeightChildren
  },
  {
    label: '@height',
    display: '高度',
    type: 'variable',
    tip: 'h',
    detail: '元素高度',
    info: '值是数字类型，可生效于图片、代码块、表格、视频等元素;',
    children: widthHeightChildren
  },
  {
    label: '@left',
    display: '左面距离',
    type: 'variable',
    tip: 'w',
    detail: '元素左间距',
    info: '值是数字类型，可生效于图片、代码块、表格、视频等元素;',
    children: widthHeightChildren
  },
  {
    label: '@top',
    display: '顶部距离',
    type: 'variable',
    tip: 'h',
    detail: '元素上间距',
    info: '值是数字类型，可生效于图片、代码块、表格、视频等元素;',
    children: widthHeightChildren
  },
  {
    label: '@x',
    display: '左面距离',
    type: 'variable',
    tip: 'w',
    detail: '元素左间距',
    info: '值是数字类型，可生效于图片、代码块、表格、视频等元素;',
    children: widthHeightChildren
  },
  {
    label: '@y',
    display: '顶部距离',
    type: 'variable',
    tip: 'h',
    detail: '元素上间距',
    info: '值是数字类型，可生效于图片、代码块、表格、视频等元素;',
    children: widthHeightChildren
  },
  {
    label: '@duration',
    display: '时长',
    type: 'variable',
    detail: '存在时长',
    info: '表示元素在当前场景存在的时长，单位是秒，如@duration=3时，表示元素将在3秒后消失'
  },
  {
    label: '@delay',
    display: '延迟出现',
    type: 'variable',
    detail: '延迟出现',
    info: '元素在当前场景下间隔多少时间才出现，单位是秒，如@delay=3时，表示元素将在3秒后在出现'
  },
  {
    label: '@color',
    display: '颜色',
    type: 'text',
    tip: 'color',
    detail: '字体颜色',
    info: '设置文字、字幕、标题的字体颜色，如“red”、“blue”、“grey”，“#000000”,“#ffffff”等',
    children: colors
  },
  {
    label: '@fill',
    display: '文字渐变色',
    type: 'text',
    tip: 'fillColor',
    detail: '字体渐变色',
    info: '设置文字、字幕、标题的渐变色，存在时color将会失效，值为数组类型，如：red,blue,#c4c4a1',
    children: fillColor
  },
  {
    label: '@backgroundColor',
    display: '背景颜色',
    type: 'text',
    tip: 'color',
    detail: '元素背景颜色',
    info: '设置文字、字幕、标题的背景颜色，#000000”,“#ffffff”等，常见于设置标题、文本、字幕的背景颜色',
    children: colors
  },
  {
    label: '@fontFamily',
    display: '字体',
    type: 'constant',
    detail: '字体',
    tip: 'font',
    info: '设置文字、字幕、标题的字体，目前仅支持系统自带的字体，如： "Microsoft Yahei", "SimSun","KaiTi"等',
    children: FontFamilyList.slice(1)
  },
  {
    label: '@fontSize',
    display: '字体大小',
    type: 'variable',
    detail: '字体大小',
    tip: 'w',
    info: '设置字体大小,如20,30,40',
    children: fontSizes
  },
  {
    label: '@fontStyle',
    display: '字体风格',
    type: 'constant',
    detail: '字体风格',
    info: '设置字体风格，可以是italic(斜体)或者normal(正常)',
    children: [
      {
        label: '斜体',
        value: 'italic'
      },
      {
        label: '正常',
        value: 'normal'
      }
    ]
  },
  {
    label: '@rotate',
    display: '旋转角度',
    type: 'text',
    detail: '旋转角度',
    info: '设置文字、图片、视频等元素的旋转角度，默认是0'
  },
  {
    label: '@fontWeight',
    display: '字体加粗',
    type: 'constant',
    detail: '字体加粗',
    info: '设置字体是否加粗，可以是bold(加粗)或者normal(正常)',
    children: [
      {
        label: '加粗',
        value: 'bold'
      },
      {
        label: '正常',
        value: 'normal'
      }
    ]
  },
  {
    label: '@letterSpacing',
    display: '字体间距',
    type: 'variable',
    detail: '字体间距',
    info: '设置字体间距，表示每个文字之间的距离'
  },
  {
    label: '@shadowColor',
    display: '文字阴影',
    type: 'text',
    tip: 'color',
    detail: '文字阴影',
    info: '设置文字的阴影颜色，存在时fill(文字渐变)将会失效',
    children: colors
  },
  {
    label: '@speaker',
    display: '字幕发音人',
    type: 'text',
    detail: '字幕发音人',
    info: '设置字幕的发音人，目前仅接入腾讯AI的部分语音可前往https://curl.qcloud.com/UvsYBNSF试听',
    children: VoiceList.map((v) => {
      return {
        label: v.name + `(${v.label})`,
        value: v.id
      };
    })
  },
  {
    label: '@animate',
    display: '动画效果',
    type: 'text',
    detail: '动画效果',
    tip: 'animate',
    info: '设置元素的动画效果，如淡入淡出、旋转进入等',
    children: animations
  },
  {
    label: '@animateSpeed',
    display: '动画效果速度',
    type: 'text',
    detail: '动画效果速度',
    info: '设置元素的动画效果的完成速度，单位是秒，默认是0.5',
    children: AnimateSpeed
  },
  {
    label: '@position',
    display: '元素位置',
    type: 'variable',
    detail: '元素位置',
    info: '设置元素的基础元素位置，包括八个左上角、居中、右上角等等，可能需要配合offsetX、offsetY 使用；，当设置left和top时，此配置不会生效，',
    children: positions
  },
  {
    label: '@offsetX',
    display: '水平偏移量',
    type: 'text',
    detail: '水平偏移量',
    info: '设置元素的相对元素位置的水平方向上的偏移量，可以为负值; 需要存在position值生效'
  },
  {
    label: '@offsetY',
    display: '垂直偏移量',
    type: 'text',
    detail: '垂直偏移量',
    info: '设置元素的相对元素位置的垂直方向上的偏移量，可以为负值; 需要存在position值生效'
  }
];

export const sceneConfigCompletionLists = [
  {
    label: '&duration',
    display: '场景时长',
    type: 'variable',
    detail: '场景时长',
    info: '表示元素在场景存在的时长，单位是秒，如@duration=6'
  },
  {
    label: '&transName',
    display: '转场动画',
    type: 'text',
    detail: '转场动画效果',
    info: '转场动画效果，默认无效果',
    children: TransitionsName
  },
  {
    label: '&transDuration',
    display: '转场动画时长',
    type: 'variable',
    detail: '转场动画持续时长',
    info: '转场动画效果的持续时长，单位是秒，默认是0.5秒'
  },
  {
    label: '&backgroundColor',
    display: '设置视频背景颜色',
    type: 'text',
    tip: 'color',
    detail: '视频背景颜色',
    info: '当前场景/视频的背景颜色，默认是白色, #fff',
    children: colors
  }
];
