<template>
  <div class="md-chart" :style="{ backgroundColor: props.commonStyle.backgroundColor }">
    <v-chart v-if="chartOptions" class="chart" :autoresize="true" :option="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, LineChart, BarChart, ScatterChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { toRefs, computed } from 'vue';
import { PluginProps } from '@renderer/types';

import getChartOptions from './getChartOptions';
use([
  CanvasRenderer,
  PieChart,
  ScatterChart,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);

// provide(THEME_KEY, 'dark');

const props = defineProps<PluginProps>();
const { propsValue } = toRefs(props);

const chartOptions = computed(() => {
  return getChartOptions(propsValue.value);
});
</script>

<style scoped lang="scss">
.md-chart {
  width: 100%;
  height: 100%;
  .chart {
    height: 100%;
    width: 100%;
  }
}
</style>
