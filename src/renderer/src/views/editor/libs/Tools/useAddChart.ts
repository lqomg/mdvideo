import { useEditorStore } from '@renderer/store';

import { reactive } from 'vue';
const editorStore = useEditorStore();
export const useAddChart = () => {
  const chartList = reactive([
    {
      name: 'line',
      label: '折线图',
      icon: 'icon-line',
      onClick: () => {
        editorStore.addElement('md-chart');
      }
    },
    {
      name: 'area',
      label: '面积图',
      icon: 'icon-area',
      onClick: () => {
        editorStore.addElement(
          'md-chart',
          {},
          {
            chartType: 'area',
            showAreaStyle: true
          }
        );
      }
    },
    {
      name: 'bar',
      label: '垂直柱状图',
      icon: 'icon-bar',
      onClick: () => {
        editorStore.addElement(
          'md-chart',
          {},
          {
            chartType: 'bar'
          }
        );
      }
    },
    {
      name: 'horizontalBar',
      label: '水平柱状图',
      icon: 'icon-bar-y-category',
      onClick: () => {
        editorStore.addElement(
          'md-chart',
          {},
          {
            chartType: 'horizontalBar',
            horizontalBar: true
          }
        );
      }
    },
    {
      name: 'scatter',
      label: '散点图',
      icon: 'icon-candlestick',
      onClick: () => {
        editorStore.addElement(
          'md-chart',
          {},
          {
            chartType: 'scatter',
            showScatterStyle: true
          }
        );
      }
    },
    {
      name: 'pie',
      label: '饼图',
      icon: 'icon-pie',
      onClick: () => {
        editorStore.addElement(
          'md-chart',
          {},
          {
            chartType: 'pie'
          }
        );
      }
    },
    {
      name: 'ring',
      label: '圆环图',
      icon: 'icon-pie-doughnut',
      onClick: () => {
        editorStore.addElement(
          'md-chart',
          {},
          {
            chartType: 'ring',
            showPieRing: true,
            pieRingRadius: 30
          }
        );
      }
    },
    {
      name: 'ring',
      label: '南丁格尔',
      icon: 'icon-rose',
      onClick: () => {
        editorStore.addElement(
          'md-chart',
          {},
          {
            chartType: 'ring',
            showPieRing: true,
            showPieRose: true,
            pieRingRadius: 30
          }
        );
      }
    }
  ]);
  return chartList;
};
