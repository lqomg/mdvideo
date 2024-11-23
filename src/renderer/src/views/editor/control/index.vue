<template>
  <div ref="controlRef" class="control">
    <div class="tips">
      <ElAlert v-show="tipMsg" type="warning" :description="tipMsg"></ElAlert>
    </div>
    <MoveEditor v-if="isEditAnimate" />
    <SceneEditor v-else />

    <div class="editor-tool" :style="{ display: activeElementUUID ? 'flex' : 'none' }">
      <ElTooltip content="删除" placement="right"
        ><i
          class="iconfont icon-Trash"
          @click="editorStore.deleteElementByUUID(activeElementUUID)"
        ></i
      ></ElTooltip>
      <ElTooltip
        v-for="item in layerZIndexList"
        :key="item.value"
        :content="item.title"
        placement="right"
        ><i
          :class="'iconfont ' + item.icon"
          @click="editorStore.resetElementZIndex(item.value, activeElementUUID)"
        ></i
      ></ElTooltip>
    </div>
    <div class="time-line">
      <TimeLine></TimeLine>
    </div>

    <Tool />
  </div>
</template>
<script lang="ts" setup>
import Tool from './tool.vue';
import TimeLine from './timeline/index.vue';
import '@gausszhou/vue3-drag-resize-rotate/lib/bundle.esm.css';
import SceneEditor from './SceneEditor.vue';
import MoveEditor from './MoveEditor.vue';
import { useEditorStore } from '@renderer/store';
import { storeToRefs } from 'pinia';
import { ref, toRaw, watch, onMounted, computed } from 'vue';
import { layerZIndexList } from '../config';
import { useWindowSize, watchDebounced, useElementSize } from '@vueuse/core';
import { useSideBarStore } from '@renderer/store/modules/sideBar';
const editorStore = useEditorStore();
const { projectInfo, scale, activeElementUUID } = storeToRefs(editorStore);
const controlRef = ref<HTMLElement | null>(null);
const sideBarStore = useSideBarStore();
const { attrOpen } = storeToRefs(sideBarStore);
const isEditAnimate = computed(() => {
  return (
    attrOpen.value &&
    editorStore.attrActiveName === 'attr-animate' &&
    editorStore.getActiveElement()?.animations?.custom?.show
  );
});

const { width, height } = useWindowSize();
const { width: cWidth } = useElementSize(controlRef);
const tipMsg = ref('单字幕合成的语音时长超过60秒,超出内容将会被截取');

watch(cWidth, () => {
  resizeWindow();
});
const resizeWindow = () => {
  if (controlRef.value) {
    const { clientWidth, clientHeight } = controlRef.value;
    const { width, height } = projectInfo.value;
    if (width > height) {
      if (clientWidth >= width) {
        editorStore.scale = 1;
      } else {
        editorStore.scale = Number(((clientWidth - 100) / width).toFixed(2));
      }
    } else {
      if (clientHeight >= height) {
        editorStore.scale = 1;
      } else {
        editorStore.scale = Number(((clientHeight - 320) / height).toFixed(2));
      }
    }

    controlRef.value.addEventListener('click', (e: any) => {
      const className = (e?.target?.className as string) || '';
      if (className?.includes?.('control')) {
        editorStore.activeElementUUID = '';
      }
    });
  }
};

watchDebounced(
  () => [
    width.value,
    editorStore.getActiveScene()?.data.duration,
    height.value,
    projectInfo.value.width,
    projectInfo.value.height
  ],
  () => {
    resizeWindow();
  },
  {
    debounce: 400
  }
);
</script>
<style lang="scss" scoped>
.control {
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  .tips {
    margin: 10px auto;
    width: 90%;
    min-height: 20px;
  }
  .editor-tool {
    display: block;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: absolute;
    right: -1px;
    top: 100px;
    border: var(--el-border);
    i {
      font-size: 20px;
      margin: 4px 0;
      color: var(--el-color-primary);
      cursor: pointer;
    }
  }

  .time-line {
    margin: 50px 0;
    margin-top: 20px;
    width: 100%;
  }
}
</style>
