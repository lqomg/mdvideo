<template>
  <div class="props">
    <ElCheckbox v-model="propsValue.horizontalBar">水平柱状图</ElCheckbox>
  </div>
  <div class="props">
    <label>柱状背景</label>
    <ElColorPicker
      v-model="propsValue.barBackgroundColor"
      size="large"
      show-alpha
      @active-change="
        (val) => {
          emits('changeElement', {
            propsValue: {
              ...propsValue,
              barBackgroundColor: val
            }
          });
        }
      "
    ></ElColorPicker>
  </div>
</template>
<script setup lang="ts">
import { IMDElement } from '@renderer/types';
import { toRefs } from 'vue';

const props = defineProps<IMDElement>();
const { propsValue } = toRefs(props);
const emits = defineEmits(['changeElement']);
</script>
