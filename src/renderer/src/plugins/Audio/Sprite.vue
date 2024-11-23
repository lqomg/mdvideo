<template>
  <div class="audio">
    <i :class="['iconfont icon-MusicNotes', curIsPaly ? 'active' : '']"></i>
    <audio ref="audioRef" :src="$getLocalUrl(propsValue.src)"></audio>
  </div>
</template>
<script setup lang="ts">
import { watch, ref, toRefs } from 'vue';
import { useAudio } from './useAudio';
import { PluginProps } from '@api/types';
const props = defineProps<PluginProps>();
const { isPlaying: curIsPaly, playCurrentTime } = toRefs(props);
const { audioRef, isPlaying, currentTime, play, pause } = useAudio();

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
.audio {
  width: 20px;
  height: 20px;
  i {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    position: relative;
    color: var(--el-color-primary);
    &.active {
      animation: spin 2s infinite linear;
    }
  }
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
