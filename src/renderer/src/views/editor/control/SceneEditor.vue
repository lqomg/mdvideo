<template>
  <div
    :style="{
          ...getCommonStyle(
            {
              ...getActiveScene().commonStyle as any,
              width: projectInfo.width,
              height: projectInfo.height,
              position: 'relative' as any,
          
            }, 
            scale
          ),
          overflow: 'hidden'
        }"
    class="scene"
  >
    <VueDragReSizeRotate
      v-for="item in elements"
      :key="item.uuid"
      :data-id="item.uuid"
      :lock-aspect-ratio="isLockAspectRatio(item)"
      :x="item.commonStyle.left * scale"
      :y="item.commonStyle.top * scale"
      :w="item.elName === 'md-text' ? 'auto' : item.commonStyle.width * scale"
      :h="item.elName === 'md-text' ? 'auto' : item.commonStyle.height * scale"
      :active="item.uuid === activeElementUUID"
      :z="item.commonStyle.zIndex || 1"
      :r="item.commonStyle.rotate"
      :prevent-deactivation="item.uuid === activeElementUUID"
      :resizable="!isDisabledResize(item)"
      :draggable="!isDisabledDrag(item)"
      :rotatable="!isDisabledRotate(item)"
      :class="item.display ? '' : 'hidden'"
      :class-name="`drag-class`"
      class-name-active="drag-active-class"
      @activated="onActivated(item.uuid)"
      @resizestop="resizeStop"
      @dragstop="dragStop"
      @rotating="rotating"
      @contextmenu.prevent="handleContextMenu(item)"
    >
      <div
        :class="
          editorStore.isPlaying
            ? ['sprite animate__animated animate__' + item.animations.in.type] +
              ' animate_' +
              item.animations.out.type
            : ''
        "
        :style="
          editorStore.isPlaying
            ? {
                '--animate-duration': item.animations.in.time + 's',
                '--animate-delay': item.animations.in.delay + 's'
              }
            : { width: '100%', height: '100%' }
        "
      >
        <Sprite v-bind="item"></Sprite>
      </div>
    </VueDragReSizeRotate>
  </div>
</template>
<script lang="ts" setup>
import Sprite from './sprite.vue';
import VueDragReSizeRotate from '@gausszhou/vue3-drag-resize-rotate';
import '@gausszhou/vue3-drag-resize-rotate/lib/bundle.esm.css';
import { getCommonStyle } from '@renderer/config/DataModel';
import { useEditorStore } from '@renderer/store';
import { storeToRefs } from 'pinia';
import { IMDCommonStyle, IMDElement } from '@renderer/types';
import { toRaw, computed, watch } from 'vue';
import { pluginManager } from '@renderer/plugins';
import { useSideBarStore } from '@renderer/store/modules/sideBar';
const editorStore = useEditorStore();
const { projectInfo, getActiveScene, scale, activeElementUUID } = storeToRefs(editorStore);
const sideBarStore = useSideBarStore();
const { attrOpen } = storeToRefs(sideBarStore);
const isDisabledResize = (el: IMDElement) => pluginManager.getPlugin(el.elName)?.disabledResize;

const isDisabledDrag = (el: IMDElement) => pluginManager.getPlugin(el.elName)?.disabledDrag;
const isLockAspectRatio = (el: IMDElement) => ['md-circle'].includes(el.elName);
const isDisabledRotate = (el: IMDElement) => pluginManager.getPlugin(el.elName)?.disabledRotate;
const resizeStop = (x: number, y: number, width: number, height: number) => {
  const commonStyle: IMDCommonStyle = toRaw(editorStore.getActiveElement()!.commonStyle);
  editorStore.updateElement({
    commonStyle: {
      ...commonStyle,
      top: y / scale.value,
      left: x / scale.value,
      width: width / scale.value,
      height: height / scale.value
    }
  });
};
const rotating = (r: number) => {
  const commonStyle: IMDCommonStyle = toRaw(editorStore.getActiveElement()!.commonStyle);
  editorStore.updateElement({
    commonStyle: {
      ...commonStyle,
      rotate: r
    }
  });
};
const onActivated = (uuid: string) => {
  attrOpen.value = true;
  activeElementUUID.value = uuid;
};
const handleContextMenu = (element: IMDElement) => {
  console.log('右键菜单拦截', element);
};

const elements = computed(() => {
  const eles = editorStore.getActiveScene().elements;
  return eles.map((el: any) => {
    let display = false;
    if (editorStore.curSceneDuration < 0.5) {
      display = true;
      el.display = display;
      return el;
    }
    const offset = el.offset;

    if (!el.duration) {
      el.duration = editorStore.getActiveScene().data.duration - offset;
    }
    const duration = el.duration;

    if (
      offset <= editorStore.curSceneDuration &&
      duration + offset >= editorStore.curSceneDuration
    ) {
      display = true;
    } else {
      display = false;
    }
    el.display = display;
    return el;
  });
});
const dragStop = (x: number, y: number, width: number, height: number) => {
  const commonStyle: IMDCommonStyle = toRaw(editorStore.getActiveElement()!.commonStyle);
  editorStore.updateElement({
    commonStyle: {
      ...commonStyle,
      top: y / scale.value,
      left: x / scale.value
    }
  });
};
</script>
<style lang="scss" scoped>
.scene {
  box-shadow: var(--el-box-shadow);
  .sprite {
    width: 100%;
    height: 100%;
  }
  div[display='false'] {
    display: none;
  }
  .drag-class {
    border: none;
    position: absolute;
  }
  .drag-class.hidden {
    display: none;
  }
  .drag-active-class {
    border: 1px dashed var(--el-border-color);
  }
}
</style>
