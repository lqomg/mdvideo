/* eslint-disable prefer-const */
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
  const obj: any = {};
  try {
    jsonString.split(/(\n{1,})|;|；/).map((s) => {
      if (s && s.trim()) {
        let [k, v] = s
          .trim()
          .replace(/\s+/gi, '')
          .split(/=|:|；/)
          .map((v) => v.trim()) as any[];

        if (k && v !== undefined && v !== '') {
          if (v.includes('%')) {
            v = v.split('%')[0].trim?.() / 100;
          }
          if (v == 'true') {
            v = true;
          }
          if (v == 'false') {
            v = false;
          }
          if (!isNaN(Number(v))) {
            v = Number(v);
          }
          obj[k.replace(/@/gi, '').trim()] = v;
        }
      }
    });
    if (obj.fill) {
      obj.fill = obj.fill.split(',');
      obj.showFill = true;
    }
    if (obj.shadowColor) {
      obj.dropShadow = true;
      obj.dropShadowColor = obj.shadowColor;
      obj.showFill = false;
    }
    return obj;
  } catch (error) {
    console.error('转换失败：' + error);
    return {};
  }
};

export const trySceneConfigParseJson = (jsonString: string) => {
  const obj = {};
  try {
    jsonString.split(/(\n{1,})|;|；/).map((s) => {
      if (s && s.trim()) {
        let [k, v] = s
          .trim()
          .replace(/\s+/gi, '')
          .split(/=|:|：/)
          .map((v) => v.trim()) as any[];
        if (k && v !== undefined && v !== '') {
          if (v.includes('%')) {
            v = v.split('%')[0].trim?.() / 100;
          }
          if (v == 'true') {
            v = true;
          }
          if (v == 'false') {
            v = false;
          }
          if (!isNaN(Number(v))) {
            v = Number(v);
          }
          obj[k.replace(/&/gi, '').trim()] = v;
        }
      }
    });
    return obj;
  } catch (error) {
    console.error('转换失败：' + error);
    return {};
  }
};
export const isNeedToImage = (type: string) => ['code', 'table', 'list'].includes(type);

export const parseChart = (str: string) => {
  str = str.trim();
  if (str.startsWith('option')) {
    str = str.replace(/option(\s){0,4}=/, '').replace(/;$/, '');
  }
  try {
    return eval('(' + str + ')');
  } catch (error) {
    console.error(error)
    return {}
  }
}
