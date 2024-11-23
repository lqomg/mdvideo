<template>
  <div class="video">
    <ElImage
      v-show="!curIsPaly && cover"
      loading="lazy"
      :style="commonStyle"
      :src="$getLocalUrl(cover)"
    >
    </ElImage>
    <Icon v-show="!curIsPaly" name="shipin5"></Icon>
    <video
      v-show="curIsPaly || !props.propsValue.cover"
      ref="videoRef"
      :src="$getLocalUrl(props.propsValue.src)"
      :muted="!props.propsValue.bgAudio"
      :loop="props.propsValue.loop"
      :autoplay="false"
    ></video>
  </div>
</template>
<script setup lang="ts">
import { PluginProps } from '@renderer/types';
import { computed, toRefs, watch, ref } from 'vue';
import { getSpriteCommonStyle } from '../helper';
import { useVideo } from './useVideo';
import { getVideoFirstFrame } from '@renderer/utils';
const props = defineProps<PluginProps>();
const { isPlaying: curIsPaly, playCurrentTime, propsValue } = toRefs(props);
const { videoRef, isPlaying, currentTime, play, pause } = useVideo();
const cover = ref('');
const commonStyle = computed(() => {
  const style = getSpriteCommonStyle(props.commonStyle, props.scale || 1);
  return style;
});
watch(
  () => propsValue.value?.src,
  (v) => {
    getVideoFirstFrame(v)
      .then((url: string) => {
        cover.value = url;
      })
      .catch((err) => {
        console.error(err);
      });
  },
  {
    immediate: true
  }
);
watch(
  () => [
    playCurrentTime.value,
    curIsPaly.value,
    isPlaying.value,
    currentTime.value,
    props.offset,
    props.duration
  ],
  (v) => {
    if (playCurrentTime.value < props.offset) {
      return;
    }
    if (playCurrentTime.value > props.offset + props.duration + 1) {
      pause();
      currentTime.value = 0;
      return;
    }
    if (curIsPaly.value && !isPlaying.value) {
      play();
    }
    if (!curIsPaly.value && isPlaying.value) {
      pause();
    }
    if (!curIsPaly.value && !isPlaying.value) {
      currentTime.value = 0;
    }
  }
);
</script>
<style lang="scss" scoped>
.video {
  width: 100%;
  height: 100%;
  position: relative;
  :deep(.svg-icon) {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 100;
    font-size: 50px;
    color: var(--el-color-primary);
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
