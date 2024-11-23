<template>
  <div class="chart-props">
    <div class="public-props">
      <ElButton style="width: 80%" @click="chartDataEditorVisible = true">编辑图表数据</ElButton>
      <ElDivider />
      <div class="public-props-item">
        <span class="tip">背景颜色</span>
        <ElColorPicker
          v-model="commonStyle.backgroundColor"
          size="large"
          show-alpha
          @active-change="
            (val) => {
              emits('changeElement', {
                commonStyle: {
                  ...commonStyle,
                  backgroundColor: val
                }
              });
            }
          "
        ></ElColorPicker>
      </div>

      <div class="public-props-item">
        <span class="tip">数据颜色</span>
        <ElColorPicker
          v-model="propsValue.color"
          size="large"
          show-alpha
          @active-change="
            (val) => {
              emits('changeElement', {
                propsValue: {
                  ...propsValue,
                  color: val
                }
              });
            }
          "
        ></ElColorPicker>
      </div>

      <div class="public-props-item">
        <span class="tip">显示图例</span>
        <ElSelect v-model="propsValue.showLegend" style="width: 120px">
          <ElOption :value="'none'" :label="'不显示'">不显示</ElOption>
          <ElOption :value="'top'" :label="'显示在上方'">显示在上方</ElOption>
          <ElOption :value="'bottom'" :label="'显示在下方'">显示在下方</ElOption>
        </ElSelect>
      </div>
      <div class="public-props-item">
        <span class="tip">显示图形网格</span>
        <ElCheckbox
          :checked="propsValue.showSplitLine"
          @change="propsValue.showSplitLine = !propsValue.showSplitLine"
        ></ElCheckbox>
      </div>

      <div class="public-props-item">
        <span class="tip">显示标题</span>
        <ElCheckbox v-model="propsValue.showTitle" size="large"> </ElCheckbox>
      </div>
      <ElInput
        v-if="propsValue.showTitle"
        v-model="propsValue.title"
        type="textarea"
        placeholder="请在此处填写标题"
      ></ElInput>
    </div>
    <ElDivider />

    <LineProps v-if="CHART_TYPES[propsValue.chartType] === 'line'" v-bind="props"></LineProps>
    <PieProps v-if="CHART_TYPES[propsValue.chartType] === 'pie'" v-bind="props"></PieProps>
    <BarProps v-if="CHART_TYPES[propsValue.chartType] === 'bar'" v-bind="props"></BarProps>

    <ElDialog
      v-model="chartDataEditorVisible"
      :width="648"
      :append-to-body="true"
      :destroy-on-close="true"
      :show-close="false"
      title="编辑图表数据"
    >
      <ChartDataEditor
        :data="chartData"
        @close="chartDataEditorVisible = false"
        @save="(value) => updateData(value)"
      />
    </ElDialog>
  </div>
</template>
<script setup lang="ts">
import { IMDElement } from '@renderer/types';
import { ref, computed, toRefs, toRaw } from 'vue';
import { LineProps, BarProps, PieProps } from './charts';
import ChartDataEditor from './ChartDataEditor.vue';
import { ChartData, CHART_TYPES } from './constant';
// eslint-disable-next-line vue/no-setup-props-destructure
const props = defineProps<IMDElement>();
const emits = defineEmits(['changeElement']);
const { propsValue } = toRefs(props);
const chartDataEditorVisible = ref(false);

const chartData = computed(() => {
  return toRaw(propsValue.value.data);
});
const updateData = (data: ChartData) => {
  emits('changeElement', {
    propsValue: {
      ...toRaw(propsValue.value),
      data
    }
  });
  chartDataEditorVisible.value = false;
};
</script>
<style lang="scss" scoped>
.chart-props {
  padding: 10px 4px;
  :deep(.el-divider--horizontal) {
    margin: 12px 0;
  }
  :deep(.props) {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    color: var(--el-text-color-secondary);
    flex-wrap: wrap;
    label {
      font-size: 16px;
    }
  }
}
</style>
