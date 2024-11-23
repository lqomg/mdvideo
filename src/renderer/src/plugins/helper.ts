import { getCommonStyle } from '@renderer/config/DataModel';
import { IMDCommonStyle, IMDElement } from '@renderer/types';
import { Component } from 'vue';

export interface IMDVideoInfo {
  width: number;
  height: number;
}
export interface IMDPluginOptions {
  Props: Component<IMDElement>;
  Sprite: Component<IMDElement>;
  Tools: Component<IMDElement>;
  name: string;
  defaultCommonStyle: ((info: IMDVideoInfo) => Partial<IMDCommonStyle>) | Partial<IMDCommonStyle>;
  defaultProps:
    | { [k: string]: any }
    | ((info: IMDVideoInfo) => {
        [k: string]: any;
      });
  _registered?: boolean;
  layer: {
    icon: string;
    title: string;
  };
  autoDragResize?: boolean;
  disabledResize?: boolean;
  disabledDrag?: boolean;
  disabledRotate?: boolean;
}

export const PredefineColors = [
  'rgba(255, 69, 0, 0)',
  'rgba(255, 69, 0, 1)',
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
];
export interface IMDPlugin {
  [k: string]: Omit<IMDPluginOptions, '_registered' | 'name'>;
}

export const getSpriteCommonStyle = (commonStyle: IMDCommonStyle, scale: number = 1) => {
  const style = getCommonStyle(commonStyle, scale);
  style.width = '100%';
  style.height = '100%';
  style.top = 0;
  style.left = 0;
  return style;
};

export const getCurrentUrl = (path: string) => path.replace(/^(\/@fs\/)|(\?asset)$/gi, '');
