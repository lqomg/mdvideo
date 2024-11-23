<template>
  <div class="chart-lib">
    <div v-for="item in chartList" :key="item.name" class="chart" @click="item.onClick()">
      <i :class="'iconfont ' + item.icon"></i>
      <label>{{ item.label }}</label>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useAddChart } from './useAddChart';
const chartList = useAddChart();
</script>
<style lang="scss" scoped>
.chart-lib {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  .chart {
    width: 31%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
    &:nth-child(1) {
      margin-top: 10px;
    }
    &:nth-child(2) {
      margin-top: 10px;
    }
    &:nth-child(3) {
      margin-top: 10px;
    }
    i.iconfont {
      font-size: 24px;
      color: var(--el-color-primary-light-3);
      cursor: pointer;
    }
    label {
      color: var(--el-text-color-secondary);
      margin-top: 6px;
      font-size: small;
    }
  }
}
</style>
