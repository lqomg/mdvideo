import { ECBasicOption, EChartsOption } from 'echarts/types/dist/shared';

export interface ChartData {
  labels: string[];
  legends: string[];
  series: number[][];
}
export const enum KEYS {
  C = 'C',
  X = 'X',
  Z = 'Z',
  Y = 'Y',
  A = 'A',
  G = 'G',
  L = 'L',
  F = 'F',
  D = 'D',
  B = 'B',
  P = 'P',
  MINUS = '-',
  EQUAL = '=',
  DIGIT_0 = '0',
  DELETE = 'DELETE',
  UP = 'ARROWUP',
  DOWN = 'ARROWDOWN',
  LEFT = 'ARROWLEFT',
  RIGHT = 'ARROWRIGHT',
  ENTER = 'ENTER',
  SPACE = ' ',
  TAB = 'TAB',
  BACKSPACE = 'BACKSPACE',
  ESC = 'ESCAPE',
  PAGEUP = 'PAGEUP',
  PAGEDOWN = 'PAGEDOWN',
  F5 = 'F5'
}

interface ChartTypes {
  [propName: string]: string;
}

export const CHART_TYPES: ChartTypes = {
  bar: 'bar',
  horizontalBar: 'bar',
  line: 'line',
  area: 'line',
  scatter: 'line',
  pie: 'pie',
  ring: 'pie'
};

export const ChartDataDefault: ChartData = {
  legends: ['系列1'],
  labels: ['类别1', '类别2', '类别3', '类别4', '类别5'],
  series: [[3, 20, 10, 7, 5]]
};
export const PieDefaultOptions: EChartsOption = {
  animationType: 'scale',
  animationEasing: 'elasticOut',
  animationDelay: function (idx) {
    return Math.random() * 200;
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ChartDataDefault.legends
  },
  series: ChartDataDefault.series.map((item, index) => {
    return {
      name: ChartDataDefault.legends[index],
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      roseType: 'area',
      label: {
        show: true,
        formatter(param) {
          // correct the percentage
          return param.name + ' (' + param.value + ')';
        }
      },
      data: item.map((val, i) => {
        return {
          value: val,
          name: ChartDataDefault.labels[i]
        };
      }),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    };
  })
};

export const LineDefaultOptions: EChartsOption = {
  animation: false,
  grid: {
    left: 0,
    right: 0,
    top: 10,
    bottom: 0,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ChartDataDefault.labels
  },
  legend: {
    data: ChartDataDefault.legends
  },
  yAxis: {
    type: 'value'
  },
  series: ChartDataDefault.series.map((item, index) => {
    return {
      name: ChartDataDefault.legends[index],
      data: item,
      type: 'line'
    };
  })
};

export const BarDefaultOptions: EChartsOption = {
  grid: {
    left: 0,
    right: 0,
    top: 10,
    bottom: 0,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ChartDataDefault.labels
  },
  legend: {
    data: ChartDataDefault.legends
  },
  yAxis: {
    type: 'value'
  },
  series: ChartDataDefault.series.map((item, index) => {
    return {
      name: ChartDataDefault.legends[index],
      data: item,
      type: 'bar'
    };
  })
};
