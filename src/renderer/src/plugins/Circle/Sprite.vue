<template>
  <div class="image" :style="commonStyle"></div>
</template>
<script setup lang="ts">
import { PluginProps } from '@renderer/types';
import { computed } from 'vue';
import { getSpriteCommonStyle } from '../helper';
const props = defineProps<PluginProps>();
const commonStyle = computed(() => {
  const style = getSpriteCommonStyle(props.commonStyle, props.scale || 1);
  style.borderRadius = '50%';
  return style;
});
</script>
<style lang="scss" scoped>
.image {
  width: 100%;
  height: 100%;

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
