const animateInCssData = [
  { label: '淡入', value: 'fadeIn', bgX: -38, bgY: 0 },
  { label: '向左进入', value: 'fadeInRight', bgX: 160, bgY: -120 },
  { label: '向右进入', value: 'fadeInLeft', bgX: 120, bgY: -80 },
  { label: '向上进入', value: 'fadeInUp', bgX: 40, bgY: 0 },
  { label: '向下进入', value: 'fadeInDown', bgX: 160, bgY: -40 },
  { label: '向左长距进入', value: 'fadeInLeftBig' },
  { label: '向右长距进入', value: 'fadeInRightBig' },
  { label: '向上长距进入', value: 'fadeInUpBig' },
  { label: '向下长距进入', value: 'fadeInDownBig' },
  { label: '旋转进入', value: 'rotateIn', bgX: 200, bgY: 0 },
  { label: '左顺时针旋转', value: 'rotateInDownLeft' },
  // { label: '右逆时针旋转', value: 'rotateInDownRight' },
  // { label: '左逆时针旋转', value: 'rotateInUpLeft' },
  { label: '右逆时针旋转', value: 'rotateInUpRight' },
  { label: '弹入', value: 'bounceIn' },
  { label: '向左弹入', value: 'bounceInLeft' },
  { label: '向右弹入', value: 'bounceInRight' },
  { label: '向上弹入', value: 'bounceInUp' },
  { label: '向下弹入', value: 'bounceInDown' },
  // { label: '光速进入', value: 'lightSpeedIn', unclick: true },
  // { label: 'Y轴旋转', value: 'flip', unclick: true },
  // { label: '中心X轴旋转', value: 'flipInX', unclick: true },
  // { label: '中心Y轴旋转', value: 'flipInY', unclick: true },
  { label: '左长半径旋转', value: 'rollIn' },
  { label: '由小变大进入', value: 'zoomIn' },
  { label: '左变大进入', value: 'zoomInLeft' },
  { label: '右变大进入', value: 'zoomInRight' },
  { label: '向上变大进入', value: 'zoomInUp' },
  { label: '向下变大进入', value: 'zoomInDown' },
  { label: '向左滑动展开', value: 'slideInLeft' },
  { label: '向右滑动展开', value: 'slideInRight' },
  { label: '向上滑动展开', value: 'slideInUp' },
  { label: '向下滑动展开', value: 'slideInDown' }
];

const animateOutCssData = [
  { label: '渐隐', value: 'fadeOut', bgX: 40, bgY: -480 },
  { label: '向左退出', value: 'fadeOutLeft' },
  { label: '向右退出', value: 'fadeOutRight' },
  { label: '向上退出', value: 'fadeOutUp' },
  { label: '向下退出', value: 'fadeOutDown' },
  { label: '向左长距退出', value: 'fadeOutLeftBig' },
  { label: '向右长距退出', value: 'fadeOutRightBig' },
  { label: '向上长距退出', value: 'fadeOutUpBig' },
  { label: '向下长距退出', value: 'fadeOutDownBig' },
  { label: '旋转退出', value: 'rotateOut' },
  { label: '左顺时针旋转', value: 'rotateOutDownLeft' },
  { label: '右逆时针旋转', value: 'rotateOutDownRight' },
  { label: '左逆时针旋转', value: 'rotateOutUpLeft' },
  { label: '右逆时针旋转', value: 'rotateOutUpRight' },
  { label: '弹出', value: 'bounceOut' },
  { label: '向左弹出', value: 'bounceOutLeft' },
  { label: '向右弹出', value: 'bounceOutRight' },
  { label: '向上弹出', value: 'bounceOutUp' },
  { label: '向下弹出', value: 'bounceOutDown' }
  // { label: '光速进出', value: 'lightSpeedOut', unclick: true },
  // { label: '中心X轴旋转', value: 'flipOutX', unclick: true },
  // { label: '中心Y轴旋转', value: 'flipOutY', unclick: true },
  // { label: '左长半径旋转', value: 'rollOut' },
  // { label: '由小变大退出', value: 'zoomOut' },
  // { label: '左变大退出', value: 'zoomOutLeft' },
  // { label: '右变大退出', value: 'zoomOutRight' },
  // { label: '向上变大退出', value: 'zoomOutUp' },
  // { label: '向下变大退出', value: 'zoomOutDown' },
  // { label: '向左滑动收起', value: 'slideOutLeft' },
  // { label: '向右滑动收起', value: 'slideOutRight' },
  // { label: '向上滑动收起', value: 'slideOutUp' },
  // { label: '向下滑动收起', value: 'slideOutDown' }
];

const animateCssData = [
  {
    label: '入场动画',
    type: 'in',
    children: animateInCssData
  },
  {
    label: '出场动画',
    type: 'out',
    children: animateOutCssData
  }
];
const animateDataMap = {};
[...animateInCssData, ...animateOutCssData].forEach((item) => {
  animateDataMap[item.value] = item.label;
});

export { animateDataMap, animateInCssData, animateOutCssData, animateCssData };

export default animateCssData;
