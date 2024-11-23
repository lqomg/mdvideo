import { IMDCommonStyle } from '@api/types';

export const getTextStyle = (textStyle: Partial<IMDCommonStyle>) => {
  const newStyle: any = { ...textStyle };
  return newStyle;
};
