/* eslint-disable no-case-declarations */
import { IMDElement } from '@api/types';
import { useAddChart } from '../../libs/Tools/useAddChart';
import { getLottieImage } from '../../libs/Lottie/utils';

export const getPositionsState = (offset: number, duration: number, off: number) => {
  return {
    left: off * offset,
    width: off * (duration - 1)
  };
};

export const getLayerHtml = (ele: IMDElement) => {
  const { propsValue, elName } = ele;
  const chartList = useAddChart();
  switch (elName) {
    case 'md-text':
      return `<span style="text-align:center;">${propsValue.text?.trim()?.slice(0, 1)}</span>`;
    case 'md-subtitle':
      return `<span style="text-align:center;">${propsValue.text?.trim()?.slice(0, 1)}</span>`;
    case 'md-chart':
      // eslint-disable-next-line no-case-declarations
      const chartItem = chartList.find((chart) => chart.name === propsValue.chartType);
      return `<i class="${chartItem && chartItem.icon}  iconfont"></i>`;
    case 'md-image':
      return `<img width='90%' height="90%" src="${propsValue.src}" />`;
    case 'md-video':
      return `<i class="icon-VideoCamera iconfont"></i>`;
    case 'md-audio':
      return `<i class="icon-audio iconfont"></i>`;
    case 'md-circle':
      return `<i class="iconfont icon-radio-on"></i>`
    case 'md-round-rect':
      return `<i class="iconfont icon-juxing"></i>`
    case 'md-lottie':
      const { lottie } = propsValue || {};
      const imgeUrl = getLottieImage(lottie?.id, lottie?.actions[0]?.id);
      return `<img src="${imgeUrl}" width="20px" height="20px" />`;

    default:
      return '';
  }
};

export const getCurrentNum = (str: number | string) => {
  return Number(Number(str).toFixed(3));
  const arr = str.split('.');
  let n = Number(str);
  const nx = Number(arr[1]?.slice?.(0, 1));
  if (!nx) {
    return parseInt(n);
  }
  if (nx < 3) {
    n = Math.floor(Number(str));
  } else if (nx >= 3 && nx <= 7) {
    n = Math.floor(Number(str)) + 0.5;
  } else {
    n = Math.ceil(Number(str));
  }
  return n;
};
