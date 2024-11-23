<template>
  <div :style="sceneCommonStyle" class="preview-scene">
    <VueDragReSizeRotate
      v-for="item in elements"
      :key="item.uuid"
      :data-id="item.uuid"
      :x="item.commonStyle.left * scale"
      :y="item.commonStyle.top * scale"
      :w="item.elName === 'md-text' ? 'auto' : item.commonStyle.width * scale"
      :h="item.elName === 'md-text' ? 'auto' : item.commonStyle.height * scale"
      :z="item.commonStyle.zIndex || 1"
      :r="item.commonStyle.rotate"
      :class="item.display ? '' : 'hidden'"
      class-name="drag-class"
      :resizable="false"
      :draggable="false"
      :rotatable="false"
    >
      <div
        :class="
          isPlaying
            ? ['sprite animate__animated animate__' + item.animations.in.type] +
              ' animate_' +
              item.animations.out.type
            : 'sprite'
        "
        :style="{
          '--animate-duration': item.animations.in.time + 's',
          '--animate-delay': item.animations.in.delay + 's'
        }"
      >
        <Sprite
          :element="item"
          :project-info="props.projectInfo"
          :scale="scale"
          :is-playing="isPlaying"
          :play-current-time="playCurrentTime"
        ></Sprite>
      </div>
    </VueDragReSizeRotate>
  </div>
</template>
<script setup lang="ts">
import Sprite from './Sprite.vue';
import { IMDProjectInfo, IMDProjectScene } from '@renderer/types';
import { computed, ref, toRefs } from 'vue';
import VueDragReSizeRotate from '@gausszhou/vue3-drag-resize-rotate';
import '@gausszhou/vue3-drag-resize-rotate/lib/bundle.esm.css';
import { getCommonStyle } from '@renderer/config/DataModel';
import { cloneDeep } from 'lodash';
const props = defineProps<{
  scene: IMDProjectScene;
  projectInfo: IMDProjectInfo;
  scale: number;
  isPlaying: boolean;
  playCurrentTime: number;
}>();
const { scene, projectInfo, scale, playCurrentTime, isPlaying } = toRefs(props);
const sceneCommonStyle = computed(() => {
  return {
    ...getCommonStyle(
      {
        ...(scene.value.commonStyle as any),
        width: projectInfo.value.width,
        height: projectInfo.value.height,
        position: 'relative' as any
      },
      scale.value
    ),
    overflow: 'hidden'
  };
});
const elements = computed(() => {
  const eles = cloneDeep(scene.value.elements);
  const sceneDuration = scene.value.data.duration;
  const ls = eles.map((el: any) => {
    let display = false;
    if (playCurrentTime.value <= 0) {
      display = true;
      el.display = display;
      return el;
    }
    const offset = el.offset || 0;
    if (!el.duration) {
      el.duration = sceneDuration - offset;
    }
    const duration = el.duration;

    if (offset <= playCurrentTime.value && duration + offset >= playCurrentTime.value) {
      display = true;
    } else {
      display = false;
    }
    el.display = display;
    return el;
  });
  return ls;
});
</script>
<style lang="scss" scoped>
.preview-scene {
  box-shadow: var(--el-box-shadow-lighter);
  .sprite {
    width: 100%;
    height: 100%;
  }
  .drag-class {
    border: none;
    position: absolute;
  }
  .drag-class.hidden {
    display: none;
  }
}
</style>
