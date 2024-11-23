<template>
  <div
    ref="textRef"
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
        textShadow: commonStyle.textShadow,
        ...(commonStyle.fillObj || {}),
        whiteSpace: 'pre-wrap',
        padding: 6,
        paddingLeft: commonStyle.letterSpacing / 2 + 6
      }"
      >{{ props.propsValue?.text }}</span
    >
  </div>
</template>
<script setup lang="ts">
import { PluginProps } from '@renderer/types';
import { computed, ref, watch } from 'vue';
import { getSpriteCommonStyle } from '../helper';
import { useElementSize } from '@vueuse/core';
import { useEditorStore } from '@renderer/store';
const props = defineProps<PluginProps>();

const commonStyle = computed(() => {
  const scale = props.scale || 1;
  const style = getSpriteCommonStyle(props.commonStyle, scale);
  style.left = 0;
  style.top = 0;
  style.position = 'static';
  style.padding = props.commonStyle.paddingTop * scale + 'px';
  const width = props.projectInfo.width * 0.95 * scale + 'px';
  style.maxWidth = width;
  return style;
});

const textRef = ref();
const editorStore = useEditorStore();
const { width, height } = useElementSize(textRef);
watch(
  () => [width.value, height.value],
  (v) => {
    const { uuid, scale } = props;
    const element = editorStore.getElementByUUID(uuid);
    if (element) {
      const commonStyle = element.commonStyle;
      editorStore.updateElement({
        commonStyle: {
          ...commonStyle,
          width: (width.value + commonStyle.paddingTop) / scale,
          height: (height.value + commonStyle.paddingTop) / scale
        }
      });
    }
  }
);
</script>
