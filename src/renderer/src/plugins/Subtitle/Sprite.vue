<template>
  <div
    class="subtitle"
    :style="{
      ...commonStyle,
      filter: ''
    }"
  >
    <span
      :style="{
        display: 'inline-block',
        filter: commonStyle.filter,
        // textIndent: commonStyle.letterSpacing,
        letterSpacing: commonStyle.letterSpacing,
        textShadow: commonStyle.textShadow || '1px 1px 1px black',
        ...(commonStyle.fillObj || {}),
        whiteSpace: 'pre-wrap'
      }"
      >{{ textList }}</span
    >
    <audio ref="audioRef" :src="$getLocalUrl(props.propsValue.voiceSrc)"></audio>
  </div>
</template>
<script setup lang="ts">
import { PluginProps } from '@renderer/types';
import { computed, toRefs, watch } from 'vue';
import { getSpriteCommonStyle } from '../helper';
import { useAudio } from './useAudio';

const props = defineProps<PluginProps>();
const { audioRef, isPlaying, currentTime, play, pause } = useAudio();
const { isPlaying: curIsPaly, playCurrentTime } = toRefs(props);
const commonStyle = computed(() => {
  const style = getSpriteCommonStyle(props.commonStyle, props.scale || 1);
  style.padding = props.commonStyle.paddingTop * (props.scale || 1) + 'px';
  return style;
});
const SIGN = '_$_';
const textList = computed(() => {
  const curSceneDuration = playCurrentTime.value || 0;
  const text = props.propsValue.text;
  const duration = (props.duration || 0) + 1;
  const regexp = /(。|？|\?|!|！|；|,|，)/gi;
  const texts = text.replace(regexp, SIGN);
  const totalLength = texts?.length;
  const list = texts.split(SIGN).filter((e) => e);
  const d = duration / (totalLength - list.length - 1);
  let subtitle = list?.at?.(-1) || '';
  let total = props.offset || 0;
  for (let i = 0; i < list.length; i++) {
    const t = list[i];
    const time = (t.length + 1) * d;
    total += time;
    if (total >= curSceneDuration) {
      subtitle = t;
      break;
    }
  }

  return subtitle;
});
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
.subtitle {
  audio {
    opacity: 0;
    width: 0;
    height: 0;
  }
}
</style>
