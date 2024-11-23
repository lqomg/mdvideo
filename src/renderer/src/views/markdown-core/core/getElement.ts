import { IMDCommonStyle, IMDElement } from '@api/types';
import { DefaultCommonStyle, DefaultElementAnimate } from '@renderer/config/DataModel';
import { pluginManager } from '@renderer/plugins';
import { cloneDeep, isFunction } from 'lodash';
import { nanoid } from 'nanoid';

export const getElementProvider = ({ width, height }: { width: number; height: number }) => {
  return ({
    elName,
    duration = 0,
    offset = 0,
    commonStyle = {},
    propsValue = {}
  }: {
    elName: string;
    duration?: number;
    offset?: number;
    commonStyle?: Partial<IMDCommonStyle>;
    propsValue?: any;
  }) => {
    const plugin = pluginManager.getPlugin(elName);
    if (!plugin) {
      console.error('插件' + elName + '未找到');
      return;
    }
    const { defaultCommonStyle, defaultProps = {} } = plugin;
    const uuid = nanoid();
    const element: IMDElement = {
      uuid,
      elName,
      animations: cloneDeep(DefaultElementAnimate),
      duration,
      offset,
      commonStyle: {
        ...DefaultCommonStyle,
        ...(isFunction(defaultCommonStyle)
          ? defaultCommonStyle({ width, height })
          : defaultCommonStyle),
        ...commonStyle
      },
      propsValue: { ...defaultProps, ...propsValue }
    };
    return element;
  };
};
