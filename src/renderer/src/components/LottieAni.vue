<template>
  <div ref="lottieRef" class="lottie-ani"></div>
</template>
<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import lottie, { AnimationItem } from 'lottie-web';
const lottieRef = ref<HTMLDivElement>();
const lottieAnimateItem = ref<AnimationItem>();
const props = defineProps({
  path: {
    type: String,
    default: ''
  },
  loop: {
    type: Boolean,
    default: true
  },
  autoplay: {
    type: Boolean,
    default: true
  }
});
watch(
  () => [props.path, lottieRef.value],
  () => {
    if (lottieAnimateItem.value) {
      lottieAnimateItem.value.destroy();
    }
    // 'http://127.0.0.1:4130/public/lottie/data/0acaa76a-5746-40dd-9e83-ff8d19625ffa/1fe71c92-e911-4f5b-a40b-71d594f0b071.json'
    lottieAnimateItem.value = lottie.loadAnimation({
      container: lottieRef.value!,
      name: props.path,
      renderer: 'canvas',
      autoplay: true,
      path: props.path
    });
  },
  { immediate: true }
);

onUnmounted(() => {
  lottieAnimateItem.value?.destroy();
});
</script>
<style lang="scss" scoped>
.lottie-ani {
  width: 100%;
  height: 100%;
}
</style>
