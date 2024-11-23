<template>
  <div class="image">
    <div :style="commonStyle">
      <LottieAnimate :path="props.propsValue.path"></LottieAnimate>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PluginProps } from '@renderer/types';
import { ref, computed, onMounted } from 'vue';
import { getSpriteCommonStyle } from '../helper';
import LottieAnimate from '@renderer/components/LottieAni.vue';
const props = defineProps<PluginProps>();
const commonStyle = computed(() => {
  const style = getSpriteCommonStyle(props.commonStyle, props.scale || 1);
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
