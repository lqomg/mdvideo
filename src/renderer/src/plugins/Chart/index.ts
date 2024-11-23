import { cloneDeep } from 'lodash';
import { IMDPluginOptions } from '../helper';
import { ChartData, ChartDataDefault } from './constant';

import Props from './Props.vue';
import Sprite from './Sprite.vue';
import Tools from './Tools.vue';
export const ChartPluginName = 'md-chart';

export type ChartPlugins = IMDPluginOptions & {
  defaultProps: {
    data: ChartData;
    chartType: string;
    [k: string]: any;
  };
};
const chart: ChartPlugins = {
  name: ChartPluginName,
  defaultCommonStyle: ({ width, height }) => {
    return {
      width: width * 0.5,
      height: height * 0.5,
      top: height * 0.1,
      left: width * 0.1
    };
  },
  defaultProps: {
    chartType: 'line',
    color: '#0084FF',
    data: cloneDeep(ChartDataDefault),
    lineWidth: 1,
    showLegend: 'none',
    showTitle: true,
    showAreaStyle: false,
    showScatterStyle: false,
    areaColor: '',
    symbolSize: 4,
    lineSmooth: false,
    showSplitLine: false,
    showPieRing: false,
    showPieRose: false,
    pieRoseType: 'radius',
    pieRingRadius: 50,
    horizontalBar: false,
    barBackgroundColor: ''
  },
  layer: {
    icon: 'icon-polyline',
    title: ''
  },
  Props,
  Sprite,
  Tools
};

export default chart;
