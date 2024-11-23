<template>
  <div class="props">
    <ElCheckbox
      :checked="propsValue.showAreaStyle"
      @change="propsValue.showAreaStyle = !propsValue.showAreaStyle"
      >面积图形</ElCheckbox
    >
    <ElCheckbox
      :checked="propsValue.showScatterStyle"
      @change="propsValue.showScatterStyle = !propsValue.showScatterStyle"
      >散点图形</ElCheckbox
    >
    <ElCheckbox
      :checked="propsValue.lineSmooth"
      @change="propsValue.lineSmooth = !propsValue.lineSmooth"
      >使用平滑曲线</ElCheckbox
    >
  </div>
  <div class="props">
    <label class="tip">线条宽度</label>
    <ElInputNumber v-model="propsValue.lineWidth" :step="0.5"></ElInputNumber>
  </div>
  <div v-if="propsValue.showAreaStyle && !propsValue.showScatterStyle" class="props">
    <label class="tip">面积图颜色</label>
    <ElColorPicker
      v-model="propsValue.areaColor"
      size="large"
      show-alpha
      @active-change="
        (val) => {
          emits('changeElement', {
            propsValue: {
              ...propsValue,
              areaColor: val
            }
          });
        }
      "
    ></ElColorPicker>
  </div>
  <div class="props">
    <label class="tip">圆点大小</label>
    <ElInputNumber v-model="propsValue.symbolSize" :step="1"></ElInputNumber>
  </div>
</template>
<script setup lang="ts">
import { IMDElement } from '@renderer/types';
import { toRefs } from 'vue';

const props = defineProps<IMDElement>();
const { propsValue } = toRefs(props);
const emits = defineEmits(['changeElement']);
</script>
<style lang="scss" scoped></style>
