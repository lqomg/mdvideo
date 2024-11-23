/* eslint-disable prefer-const */
import { IMDCommonStyle } from '@api/types';
import { isEmpty } from 'lodash';

export const parseCommonStyle = (props: { styleObj: any; width: number; height: number }) => {
  const { styleObj = {}, width, height } = props;
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
      const val = Number(styleObj[key]);
      if (isNaN(val)) {
        console.warn(key, styleObj[key], '转换失败!');
        style[key] = styleObj[key];
      } else {
        if (val > 0 && val <= 1) {
          if (key === 'width' || key === 'left') {
            style[key] = val * width;
          } else if (key === 'height' || key === 'top') {
            style[key] = val * height;
          } else {
            style[key] = val * width;
          }
        } else {
          style[key] = val;
        }
      }
    } else {
      style[key] = styleObj[key];
    }
  }
  return style;
};

const getFontSize = (fontSize: number, width: number) => {
  if (fontSize <= 1) {
    return width * fontSize;
  }
  return fontSize;
};

export const getFontSizeByDepth = (width: number, depth = 100) => {
  if (depth >= 5) {
    return Math.ceil(width / 30);
  } else if (depth >= 4) {
    return Math.ceil(width / 28);
  } else if (depth >= 3) {
    return Math.ceil(width / 24);
  } else if (depth >= 2) {
    return Math.ceil(width / 20);
  } else {
    return Math.ceil(width / 18);
  }
};

export const getValue = (value: number, baseValue: number) => {
  if (value >= -1 && value <= 1) {
    value = baseValue * value;
  }
  return value;
};

const getPosition = (props: {
  vWidth: number;
  vHeight: number;
  width: number;
  height: number;
  position: string;
  offsetX?: number;
  offsetY?: number;
}) => {
  let { width, height, vHeight, vWidth, position, offsetX = 0, offsetY = 0 } = props;

  offsetX = getValue(offsetX, width);
  offsetY = getValue(offsetY, height);
  vWidth = getValue(vWidth, width);
  vHeight = getValue(vHeight, height);

  let left = offsetX;
  let top = offsetY;
  switch (position) {
    case 'center':
      left += width / 2 - vWidth / 2;
      top += height / 2 - vHeight / 2;
      break;
    case 'top':
      left += width / 2 - vWidth / 2;
      break;
    case 'bottom':
      left += width / 2 - vWidth / 2;
      top += height - vHeight;
      break;
    case 'top-left':
      left += 0;
      top += 0;
      break;
    case 'top-right':
      left += width - vWidth;
      break;
    case 'center-left':
      left += 0;
      top += height / 2 - vHeight / 2;
      break;
    case 'center-right':
      left += width - vWidth;
      top += height / 2 - vHeight / 2;
      break;
    case 'bottom-left':
      left += 0;
      top += height - vHeight;
      break;
    case 'bottom-right':
      left += width - vWidth;
      top += height - vHeight;
      break;

    default:
      break;
  }

  return {
    left,
    top
  };
};
interface ParseProps {
  styleObj: any;
  width: number;
  height: number;
  element: any;
}
// 标题的Style
export const parseHeadingCommonStyle = (props: ParseProps) => {
  const { element, styleObj, width, height } = props;
  const { depth, text } = element || {};
  styleObj.fontSize = getFontSize(
    styleObj.fontSize || getFontSizeByDepth(width, element.depth),
    width
  );
  styleObj.fontWeight = styleObj.fontWeight || 'bold';
  console.log(styleObj.fontSize);
  const letterSpacing = styleObj.letterSpacing || 0;
  const len = text.length;
  const vWidth = len * styleObj.fontSize + letterSpacing * (len + 1);
  const vHeight = styleObj.fontSize * 1.4;
  if (depth <= 1) {
    styleObj.position = styleObj.position || 'center';
  }
  styleObj.animate = styleObj.animate || 'bounceInDown';
  let position = styleObj.position;
  // 偏移量
  const offsetX = styleObj.offsetX === undefined ? 30 : styleObj.offsetX;
  const offsetY = styleObj.offsetY === undefined ? 30 : styleObj.offsetY;

  const { left, top } = getPosition({
    width,
    height,
    vHeight,
    vWidth,
    position,
    offsetX,
    offsetY
  });
  if (styleObj.left === undefined) {
    styleObj.left = left;
  }
  if (styleObj.top === undefined) {
    styleObj.top = top;
  }

  return parseCommonStyle(props);
};

// 加粗字体
export const parseStrongCommonStyle = (props: ParseProps, type?: string) => {
  const { element, styleObj, width, height } = props;
  const { text } = element || {};
  if (isEmpty(styleObj)) {
    styleObj.position = 'top';
    styleObj.offsetY = 0.1;
  }
  styleObj.fontSize = getFontSize(styleObj.fontSize || getFontSizeByDepth(width, 4), width);
  styleObj.fontWeight = styleObj.fontWeight || (type === 'strong' ? 'bold' : 'normal');
  styleObj.fontStyle = styleObj.fontStyle || 'normal';
  const letterSpacing = styleObj.letterSpacing || 0;
  const len = text.length;
  const vWidth = len * styleObj.fontSize + letterSpacing * (len + 1);
  const vHeight = styleObj.fontSize * 1.4;
  let position = styleObj.position || 'center';
  // 偏移量
  const offsetX = styleObj.offsetX || 0;
  const offsetY = styleObj.offsetY || 0;
  const { left, top } = getPosition({
    width,
    height,
    vHeight,
    vWidth,
    position,
    offsetX,
    offsetY
  });
  if (styleObj.left === undefined) {
    styleObj.left = left;
  }
  if (styleObj.top === undefined) {
    styleObj.top = top;
  }
  return parseCommonStyle(props);
};
// 引用STyle
export const parseBlockquoteCommonStyle = (props: ParseProps) => {
  const { element, styleObj, width, height } = props;
  const { text } = element || {};
  const letterSpacing = styleObj.letterSpacing || 6;
  const shadowColor = styleObj.shadowColor || '#A85D4F';
  styleObj.color = styleObj.color || '#2A52BE';
  styleObj.fontFamily = styleObj.fontFamily || 'SimSun';
  styleObj.letterSpacing = letterSpacing;
  styleObj.shadowColor = shadowColor;
  styleObj.fontSize = getFontSize(styleObj.fontSize || getFontSizeByDepth(width, 5), width);
  styleObj.fontWeight = styleObj.fontWeight || 'bold';
  const nTexts = text.split(/\n/gi).filter((t) => t?.trim());
  let maxLen = 0;
  nTexts.forEach((str) => {
    if (maxLen < str.length) {
      maxLen = str.length;
    }
  });
  const len = maxLen;
  const vWidth = len * styleObj.fontSize + letterSpacing * (len + 1);
  const vHeight = styleObj.fontSize * 1.2 * nTexts.length;
  styleObj.textAlign = styleObj.textAlign || 'left';
  let position = styleObj.position || 'center';
  // 偏移量
  const offsetX = styleObj.offsetX || 0;
  const offsetY = styleObj.offsetY || 0;
  const { left, top } = getPosition({
    width,
    height,
    vHeight,
    vWidth,
    position,
    offsetX,
    offsetY
  });
  if (styleObj.left === undefined) {
    styleObj.left = left;
  }
  if (styleObj.top === undefined) {
    styleObj.top = top;
  }
  return parseCommonStyle(props);
};
// 图片Style
export const parseImageCommonStyle = (props: ParseProps) => {
  const { element, styleObj, width, height } = props;
  if (isEmpty(styleObj)) {
    styleObj.position = 'center';
    styleObj.width = 0.6;
    styleObj.height = 0.6;
  }
  styleObj.width = styleObj.width || 0.6;
  styleObj.height = styleObj.height || 0.6;
  const vWidth = styleObj.width;
  const vHeight = styleObj.height;
  const position = styleObj.position || 'center';
  // 偏移量
  const offsetX = styleObj.offsetX || 0;
  const offsetY = styleObj.offsetY || 0;
  const { left, top } = getPosition({
    width,
    height,
    vHeight,
    vWidth,
    position,
    offsetX,
    offsetY
  });

  if (styleObj.left === undefined) {
    styleObj.left = left;
  }
  if (styleObj.top === undefined) {
    styleObj.top = top;
  }
  return parseCommonStyle(props);
};

export const parseVideoCommonStyle = (props: ParseProps) => {
  const { element, styleObj, width, height } = props;
  if (isEmpty(styleObj)) {
    styleObj.position = 'center';
    styleObj.width = 0.6;
    styleObj.height = 0.6;
  }

  const vWidth = styleObj.width || 0.6;
  const vHeight = styleObj.height || 0.6;
  const position = styleObj.position || 'center';
  // 偏移量
  const offsetX = styleObj.offsetX || 0;
  const offsetY = styleObj.offsetY || 0;
  const { left, top } = getPosition({
    width,
    height,
    vHeight,
    vWidth,
    position,
    offsetX,
    offsetY
  });

  if (styleObj.left === undefined) {
    styleObj.left = left;
  }
  if (styleObj.top === undefined) {
    styleObj.top = top;
  }
  if (!styleObj.width) {
    styleObj.width = 0.6;
  }
  if (!styleObj.height) {
    styleObj.height = 0.6;
  }
  return parseCommonStyle(props);
};

//字幕Style
export const parseSubtitleCommonStyle = (props: ParseProps) => {
  const { styleObj } = props;
  delete styleObj.left;
  delete styleObj.top;
  delete styleObj.position;
  return parseCommonStyle(props);
};
