<template>
  <div class="move-editor">
    <div class="move-mask"></div>
    <ElAlert type="error" :closable="false" style="z-index: 1000000; margin: 10px 0"
      >暂不支持移动动画的预览，请导出视频后查看最终效果</ElAlert
    >
    <div
      :style="{
            ...getCommonStyle(
              {
                ...getActiveScene().commonStyle as any,
                width: projectInfo.width,
                height: projectInfo.height,
                backgroundSize:'auto',
                position: 'relative' as any,
              }, 
              scale
            ),
            overflow: 'hidden'
          }"
      class="scene"
    >
      <div v-if="isPreview" id="preview">
        <div :style="{ width: '100%', height: '100%' }">
          <Sprite v-bind="elements[0]"></Sprite>
        </div>
      </div>

      <VueDragReSizeRotate
        v-for="item in elements"
        v-else
        :key="item.uuid"
        :data-id="item.uuid"
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
        :lock-aspect-ratio="true"
        class-name="drag-class"
        class-name-active="drag-active-class"
        @activated="onActivated(item.uuid)"
        @resizestop="resizeStop"
        @dragstop="dragStop"
        @rotating="rotating"
        @contextmenu.prevent="handleContextMenu(item)"
      >
        <div :style="{ width: '100%', height: '100%' }">
          <div class="animate-tool">
            <ElTag :type="item.uuid === 'animateing-start' ? 'success' : undefined">{{
              item.uuid === 'animateing-start' ? '开始状态' : '结束状态'
            }}</ElTag>
          </div>
          <Sprite v-bind="item"></Sprite>
        </div>
      </VueDragReSizeRotate>
    </div>
    <div class="tools">
      <ElSpace :alignment="'center'" :size="20">
        <ElFormItem size="small" label="持续时间:"
          ><ElInputNumber v-model="time" :min="0.5" style="width: 100px" size="small"
        /></ElFormItem>
        <ElFormItem size="small" label="过渡类型:"
          ><ElSelect v-model="ease" style="width: 100px" size="small" :teleported="false">
            <ElOption v-for="type in AnamiationEaseTypes" :key="type" :value="type" :label="type">
            </ElOption>
          </ElSelect>
        </ElFormItem>
        <ElSpace>
          <ElButton size="small" @click="editorStore.activeElementUUID = ''">取消</ElButton>
          <ElButton size="small" type="primary" @click="submit">确认</ElButton>
        </ElSpace>
        <ElSpace> <ElButton size="small" type="primary" @click="preivew">预览</ElButton></ElSpace>
      </ElSpace>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Sprite from './sprite.vue';
import VueDragReSizeRotate from '@gausszhou/vue3-drag-resize-rotate';
import '@gausszhou/vue3-drag-resize-rotate/lib/bundle.esm.css';
import { getCommonStyle } from '@renderer/config/DataModel';
import { useEditorStore } from '@renderer/store';
import { storeToRefs } from 'pinia';
import { IMDElement } from '@renderer/types';
import { ref, onMounted, toRaw, nextTick } from 'vue';
import { pluginManager } from '@renderer/plugins';
import { cloneDeep, get } from 'lodash';
import TWEEN from '@tweenjs/tween.js';
import { AnamiationEaseTypes } from '../attr/animate/constant';
const editorStore = useEditorStore();
const activeElementUUID = ref('animateing-start');
const { projectInfo, getActiveScene, scale } = storeToRefs(editorStore);
const elements = ref<IMDElement[]>([]);
const time = ref(1);
const ease = ref(AnamiationEaseTypes[0]);
const isPreview = ref(false);
const isDisabledResize = (el: IMDElement) => pluginManager.getPlugin(el.elName)?.disabledResize;

const isDisabledDrag = (el: IMDElement) => pluginManager.getPlugin(el.elName)?.disabledDrag;

const isDisabledRotate = (el: IMDElement) => true;
const resizeStop = (x: number, y: number, width: number, height: number) => {
  const nElements = elements.value.map((v) => {
    if (v.uuid === activeElementUUID.value) {
      v.commonStyle = {
        ...v.commonStyle,
        top: y / scale.value,
        left: x / scale.value,
        width: width / scale.value,
        height: height / scale.value
      };
    }
    return v;
  });
  elements.value = nElements;
};
const preivew = () => {
  isPreview.value = true;
  nextTick(() => {
    const [start, end] = elements.value;
    const box = document.querySelector('#preview') as any;
    if (!box) return;
    const startCommonStyle = toRaw(start.commonStyle);
    const endCommonStyle = toRaw(end.commonStyle);
    const coords = {
      x: startCommonStyle.left * scale.value,
      y: startCommonStyle.top * scale.value,
      w: startCommonStyle.width * scale.value,
      h: startCommonStyle.height * scale.value,
      rotate: startCommonStyle.rotate
    };
    const endCoords = {
      x: endCommonStyle.left * scale.value,
      y: endCommonStyle.top * scale.value,
      w: endCommonStyle.width * scale.value,
      h: endCommonStyle.height * scale.value,
      rotate: endCommonStyle.rotate
    };
    const t = new TWEEN.Tween(coords, false);
    const tease = get(TWEEN.Easing, ease.value);
    t.to(endCoords, time.value * 1000);
    if (tease) {
      t.easing(tease);
    }

    t.onUpdate(() => {
      box.style.transform = `translate(${coords.x}px, ${coords.y}px) rotate(${Math.floor(
        coords.rotate
      )}deg)`;
      box.style.width = `${coords.w}px`;
      box.style.height = `${coords.h}px`;
    }).start();

    // Setup the animation loop.
    function animate(time) {
      t.update(time);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    setTimeout(() => {
      isPreview.value = false;
    }, time.value * 1000 + 100);
  });
};
const rotating = (r: number) => {
  const nElements = elements.value.map((v) => {
    if (v.uuid === activeElementUUID.value) {
      v.commonStyle = {
        ...v.commonStyle,
        rotate: r
      };
    }
    return v;
  });
  elements.value = nElements;
};
const onActivated = (uuid: string) => {
  activeElementUUID.value = uuid;
};
const handleContextMenu = (element: IMDElement) => {
  console.log('右键菜单拦截', element);
};
const submit = () => {
  const startElement = elements.value.find((v) => v.uuid === 'animateing-start')!;
  const endElement = elements.value.find((v) => v.uuid === 'animateing-end')!;
  const activeElement = editorStore.getActiveElement();
  if (!activeElement) return;
  const nCustome = activeElement.animations?.custom;
  const startCommonStyle = startElement.commonStyle;
  const endCommonStyle = endElement.commonStyle;
  if (nCustome) {
    nCustome.from = {
      ...nCustome.from,
      x: startCommonStyle.left,
      y: startCommonStyle.top,
      width: startCommonStyle.width,
      height: startCommonStyle.height,
      rotate: startCommonStyle.rotate
    };
    nCustome.to = {
      ...nCustome.from,
      x: endCommonStyle.left,
      y: endCommonStyle.top,
      width: endCommonStyle.width,
      height: endCommonStyle.height,
      rotate: endCommonStyle.rotate
    };
    nCustome.time = time.value;
    nCustome.ease = ease.value;
  }
  editorStore.updateElement({
    animations: {
      ...activeElement.animations,
      custom: nCustome
    },
    commonStyle: {
      ...activeElement.commonStyle,
      ...startCommonStyle
    }
  });
  editorStore.attrActiveName = 'attr-prop';
  // editorStore.activeElementUUID = '';
};
onMounted(() => {
  const element = editorStore.getActiveElement();
  if (!element?.animations?.custom) return;
  const custom = element.animations.custom;
  const { from, to } = custom;
  const cElement = cloneDeep(element);
  const copyElement = cloneDeep(element);
  const commonStyle = element.commonStyle;
  time.value = custom.time;
  ease.value = custom.ease || AnamiationEaseTypes[0];
  cElement.commonStyle = {
    ...commonStyle,
    height: from.height,
    width: from.width,
    left: from.x,
    top: from.y,
    rotate: from.rotate,
    opacity: from.opacity
  };
  copyElement.commonStyle = {
    ...commonStyle,
    height: to.height,
    width: to.width,
    left: to.x,
    top: to.y,
    rotate: to.rotate,
    opacity: to.opacity
  };
  cElement.uuid = 'animateing-start';
  copyElement.uuid = 'animateing-end';
  elements.value = [cElement, copyElement];
});
const dragStop = (x: number, y: number, width: number, height: number) => {
  const nElements = elements.value.map((v) => {
    if (v.uuid === activeElementUUID.value) {
      v.commonStyle = {
        ...v.commonStyle,
        top: y / scale.value,
        left: x / scale.value
      };
    }
    return v;
  });
  elements.value = nElements;
};
</script>
<style lang="scss" scoped>
.move-editor {
  .scene {
    box-shadow: var(--el-box-shadow);
    background-image: url('../../../assets/images/diagonal.png');
    background-repeat: repeat;
    z-index: 99999;
  }
  .tools {
    padding: 10px;
    z-index: 999999;
    position: relative;
    :deep(.el-space__item) {
      padding-bottom: 0;
    }
    :deep(.el-form-item--small) {
      margin-bottom: 0;
    }
  }
  .animate-tool {
    position: absolute;
    top: -30px;
    z-index: 10000;
  }
  .move-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ccc;
    opacity: 0.5;
    z-index: 99999;
  }

  .sprite {
    width: 100%;
    height: 100%;
  }
  .drag-class {
    border: none;
    position: absolute;
  }
  .drag-active-class {
    border: 1px dashed var(--el-border-color);
  }
}
</style>
