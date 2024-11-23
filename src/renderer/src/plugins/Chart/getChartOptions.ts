import { EChartsOption } from 'echarts/types/dist/shared';
import {
  BarDefaultOptions,
  CHART_TYPES,
  ChartData,
  LineDefaultOptions,
  PieDefaultOptions
} from './constant';
import { cloneDeep } from 'lodash';

export const getChartOptions = (props: { [k: string]: any }, isRender = false) => {
  const {
    chartType = 'line',
    color,
    data,
    lineWidth,
    showLegend,
    showTitle,
    title,
    showAreaStyle,
    areaColor,
    showScatterStyle,
    showSplitLine,
    symbolSize = 4,
    lineSmooth,
    showPieRing = false,
    showPieRose,
    pieRoseType,
    pieRingRadius = 30,
    horizontalBar = false,
    isFromMarkDown = false,
    barBackgroundColor = ''
  } = props;
  if (isFromMarkDown) {
    return props.data;
  }
  const { series = [], legends = [], labels = [] } = data as ChartData;
  let chartOptions: EChartsOption = {};
  const cType = CHART_TYPES[chartType];
  let gridTop = 10,
    gridBottom = 2;
  const len = series.length;
  const padding = 0;
  const totalWidth = 100 - padding * 2;
  const width = totalWidth / len;
  const axisLabel = {
    fontSize: isRender ? 26 : 14
  };
  switch (cType) {
    case 'line':
      chartOptions = cloneDeep(LineDefaultOptions);
      if (showScatterStyle) {
        chartOptions.xAxis = {
          axisLabel,
          type: 'category',
          data: labels,
          splitLine: { show: showSplitLine }
        };
        chartOptions.yAxis = {
          axisLabel,
          type: 'category',
          splitLine: { show: showSplitLine }
        };
        chartOptions.series = series.map((item, index) => {
          return {
            symbolSize: 20,
            name: legends[index],
            data: item.map((n, i) => {
              return [labels[i], n];
            }),
            type: 'scatter'
          };
        });
      } else {
        chartOptions.xAxis = {
          axisLabel,
          type: 'category',
          data: labels,
          splitLine: { show: showSplitLine }
        };
        chartOptions.yAxis = {
          axisLabel,
          type: 'value',
          splitLine: { show: showSplitLine }
        };
        chartOptions.series = series.map((item, index) => {
          return {
            name: legends[index],
            data: item,
            type: 'line',
            symbolSize,
            lineStyle: {
              width: lineWidth,
              color: series.length > 1 ? undefined : color
            },
            smooth: lineSmooth,
            areaStyle: showAreaStyle
              ? {
                color: series.length > 1 ? undefined : areaColor || undefined
              }
              : undefined
          };
        });
      }
      break;

    case 'pie':
      chartOptions = cloneDeep(PieDefaultOptions);
      chartOptions.series = series.map((item, index) => {
        const left = index * width;
        return {
          name: legends[index],
          type: 'pie',
          radius: showPieRing ? [pieRingRadius, '70%'] : '50%',
          center: ['50%', '50%'],
          left: left + '%',
          width: width + '%',
          height: 100 + '%',
          roseType: showPieRose ? pieRoseType : undefined,
          label: {
            show: true,
            shadowBlur: 0,
            overflow: 'truncate',
            fontSize: axisLabel.fontSize,
            position: 'outer',
            formatter(param) {
              // correct the percentage
              return param.name + ' (' + param.value + ')';
            }
          },
          data: item.map((val, i) => {
            return {
              value: val,
              name: labels[i]
            };
          }),
          emphasis: {
            itemStyle: {
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        };
      });
      break;
    case 'bar':
      chartOptions = cloneDeep(BarDefaultOptions);

      chartOptions.xAxis = {
        axisLabel,
        type: 'category',
        data: labels
      };
      chartOptions.yAxis = {
        axisLabel,
        type: 'value'
      };
      if (horizontalBar) {
        chartOptions.yAxis = {
          axisLabel,
          type: 'category',
          data: labels
        };
        chartOptions.xAxis = {
          axisLabel,
          type: 'value'
        };
      }
      chartOptions.series = series.map((item, index) => {
        return {
          name: legends[index],
          data: item,
          type: 'bar',
          color: color,
          showBackground: !!barBackgroundColor,
          backgroundStyle: {
            color: barBackgroundColor
          }
        };
      });
      break;
    default:
      break;
  }
  if (showTitle && title) {
    chartOptions.title = {
      text: title
    };
    gridTop += 30;
  }
  if (showLegend !== 'none' || cType === 'pie') {
    chartOptions.legend = {
      show: true,
      data: legends || [],
      top: showLegend === 'top' || cType === 'pie' ? 'top' : 'bottom'
    };
    if (showLegend === 'top') {
      gridTop += 30;
    } else {
      gridBottom += 30;
    }
  } else {
    chartOptions.legend = undefined;
  }

  chartOptions.grid = {
    ...(chartOptions.grid || {}),
    top: gridTop,
    bottom: gridBottom,
    containLabel: true
  };
  return chartOptions;
};
export default getChartOptions;
