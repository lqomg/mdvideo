import { IMDCommonStyle } from '@api/types';
import { getRandomInt, sleep } from '@renderer/utils';
import html2canvas from 'html2canvas';


export const getRandomStrPivoder = (colors: string[]) => {
  let cls = [...colors];
  return () => {
    if (cls.length === 0) {
      cls = [...colors];
    }
    const n = getRandomInt(cls.length);
    const color = cls[n];
    cls.splice(n, 1);
    return color;
  };
};

export const htmlToImage = async (node: HTMLElement, fontSize = 28) => {
  try {
    // node.style.fontSize = fontSize + 'px';
    // node.style.padding = 20 + 'px';
    await sleep(500);
    const canvas = await html2canvas(node, {
      scale: 4,
      backgroundColor: null
    });
    const imageData = canvas.toDataURL('image/png', 1.0);
    return {
      data: imageData,
      info: {
        width: canvas.width,
        height: canvas.height
      }
    };
  } catch (error) {
    console.error(error);
    return {
      data: '',
      info: { width: 0, height: 0 }
    };
  }
};

export const tryParseJson = (jsonString: string) => {
  try {
    // 尝试使用标准的JSON.parse方法
    const obj = JSON.parse(jsonString);
    return obj;
  } catch (error) {
    // 如果出现错误，使用自定义解析函数
    try {
      const obj = eval('(' + jsonString + ')');
      return obj;
    } catch (error) {
      console.error(error)
      return null;
    }

  }
};

export const isNeedToImage = (type: string) => ['code', 'table', 'list'].includes(type);

export const parseCommonStyle = (styleObj: any = {}, width: number, height: number) => {
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
      if (val > 0 && val <= 1) {
        if (key === 'width' || key === 'left') {
          style[key] = val * width;
        } else if (key === 'height' || key === 'top') {
          style[key] = val * height;
        }
        style[key] = val * width;
      } else {
        style[key] = val;
      }
    } else {
      style[key] = styleObj[key];
    }
  }
  return style;
};