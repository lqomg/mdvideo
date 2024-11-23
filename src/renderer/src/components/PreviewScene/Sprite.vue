<template>
  <Sprite
    v-if="Sprite"
    v-bind="props.element"
    :project-info="props.projectInfo"
    :scale="props.scale"
    :is-playing="isPlaying"
    :play-current-time="playCurrentTime"
  ></Sprite>
  <ElEmpty v-else description="插件注册失败" :image-size="1" style="width: 100%; height: 100%">
    <template #image> </template
  ></ElEmpty>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { pluginManager } from '@renderer/plugins';

import type { IMDElement, IMDProjectInfo } from '@renderer/types';
const props = defineProps<{
  element: IMDElement;
  projectInfo: IMDProjectInfo;
  scale: number;
  isPlaying: boolean;
  playCurrentTime: number;
}>();
const Sprite = computed(() => {
  return pluginManager.getSpriteCom(props.element.elName);
});
</script>
