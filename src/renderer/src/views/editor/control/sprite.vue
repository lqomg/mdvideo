<template>
  <Sprite
    v-if="Sprite"
    v-bind="props"
    :project-info="editorStore.projectInfo"
    :scale="editorStore.scale"
    :play-current-time="editorStore.curSceneDuration"
    :is-playing="editorStore.isPlaying"
  ></Sprite>
  <ElEmpty v-else description="插件注册失败" :image-size="1" style="width: 100%; height: 100%">
    <template #image> </template
  ></ElEmpty>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { pluginManager } from '@renderer/plugins';

import type { IMDElement } from '@renderer/types';
import { useEditorStore } from '@renderer/store';
const props = defineProps<IMDElement>();
const editorStore = useEditorStore();
const Sprite = computed(() => {
  return pluginManager.getSpriteCom(props.elName);
});
</script>
