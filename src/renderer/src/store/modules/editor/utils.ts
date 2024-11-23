import { IMDCommonStyle } from '@renderer/types';

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const getNeedScaleCommonStyle = (commonStyle: IMDCommonStyle, scale: number = 1) => {
  commonStyle.width = commonStyle.width * scale;
  commonStyle.height = commonStyle.height * scale;
  commonStyle.left = commonStyle.left * scale;
  commonStyle.top = commonStyle.top * scale;
  return commonStyle;
};
/**
 * 存储localStorage
 */
export const setLocalStorage = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
export const getLocalStorage = (name) => {
  if (!name) return;
  const data = window.localStorage.getItem(name);

  return data ? JSON.parse(data) : undefined;
};

/**
 * 删除localStorage
 */
export const removeLocalStorage = (name) => {
  if (!name) return;
  window.localStorage.removeItem(name);
};
