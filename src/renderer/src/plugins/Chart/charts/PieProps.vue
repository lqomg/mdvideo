<template>
  <div class="props">
    <ElCheckbox
      :checked="propsValue.showPieRing"
      @change="propsValue.showPieRing = !propsValue.showPieRing"
      >使用圆环图</ElCheckbox
    >
    <ElCheckbox
      :checked="propsValue.showPieRose"
      @change="propsValue.showPieRose = !propsValue.showPieRose"
      >显示南丁格尔图</ElCheckbox
    >
  </div>
  <div v-if="propsValue.showPieRing" class="props">
    <label class="tip">内圈半径</label>
    <ElInputNumber v-model="propsValue.pieRingRadius" :step="5"></ElInputNumber>
  </div>

  <div v-if="propsValue.showPieRose" class="props">
    <label class="tip">南丁格尔图</label>
    <ElRadioGroup v-model="propsValue.pieRoseType">
      <ElRadio :label="'radius'">百分比</ElRadio>
      <ElRadio :label="'area'">半径</ElRadio>
    </ElRadioGroup>
  </div>
</template>
<script setup lang="ts">
import { IMDElement } from '@renderer/types';
import { toRefs } from 'vue';

const props = defineProps<IMDElement>();
const { propsValue } = toRefs(props);
</script>
<style lang="scss" scoped></style>
