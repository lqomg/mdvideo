<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <div ref="timelineBox" class="timeline-wrap">
    <div ref="timelineRef" class="timeline" @mouseup="handleMouseUp">
      <div class="timeline-axis">
        <div
          class="draggable"
          :style="{ left: draggState.offsetLeft + 'px' }"
          @mousedown="handleMouseDown"
          @mouseup="draggState.isDragging = false"
        ></div>
        <div
          v-for="(left, index) in axios"
          :key="left + '' + index"
          class="axis"
          :style="{ left: left + 'px', width: offset + 'px' }"
        >
          <span v-if="isShowAxios(index)" class="axis-text"> {{ index }}s</span>
          <span v-if="index === axios.length - 1" class="axis-text-last">{{ axios.length }}s</span>
        </div>
      </div>
      <div class="timeline-no">
        <VueDragReSizeRotate
          v-if="activeElementUUID"
          :active="true"
          :prevent-deactivation="true"
          :h="50"
          :min-height="50"
          :max-height="50"
          :parent="true"
          :x="positionX"
          :w="positionW"
          :max-width="timelineRef?.clientWidth"
          :resizable="!isDisabledResize"
          class-name-handle="my-handle-class"
          axis="x"
          @resizestop="onResizeStop"
          @dragstop="onDragStop"
        >
          <div class="drag-dom"></div>
        </VueDragReSizeRotate>
      </div>
    </div>

    <div class="layers">
      <div
        v-for="layer in layers"
        :key="layer.left"
        :style="{ left: layer.left + 'px' }"
        class="layer"
      >
        <div
          v-if="layer.children.length === 1"
          :class="{ 'layer-item': true, active: layer.children[0].uuid === activeElementUUID }"
          :style="{ width: layerWidth + 'px' }"
          @click="setActiveElementUUID(layer.children[0].uuid)"
          v-html="layer.children[0].layerHtml"
        ></div>

        <ElPopover
          v-else
          :visible="layer.open"
          trigger="click"
          :width="160"
          :teleported="false"
          placement="bottom"
          :offset="10"
        >
          <div class="layer-items">
            <div
              v-for="l in layer.children"
              :key="l.uuid"
              :class="{
                'layer-item': true,
                active: l.uuid === activeElementUUID
              }"
              :style="{ width: layerWidth + 'px' }"
              @click="
                () => {
                  setActiveElementUUID(l.uuid);
                }
              "
              v-html="l.layerHtml"
            ></div>
          </div>
          <template #reference>
            <div
              class="layer-item layer-number"
              :style="{ width: layerWidth + 'px' }"
              @click="
                () => {
                  layer.open = true;
                  changeOpenLayer(layer);
                }
              "
            >
              {{ layer.children.length }}
            </div>
          </template>
        </ElPopover>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@renderer/store';
import { ref, reactive, watch, nextTick, onMounted, computed, onUnmounted } from 'vue';
import { pluginManager } from '@renderer/plugins';
import { useElementSize } from '@vueuse/core';
import VueDragReSizeRotate from '@gausszhou/vue3-drag-resize-rotate';
import { storeToRefs } from 'pinia';
import { get } from 'lodash';
import { v4 as getUUID } from 'uuid';
import { getCurrentNum, getLayerHtml } from './utils';
import { IMDElement } from '@api/types';
interface ILayerItem {
  layerId: string;
  left: number;
  open: boolean;
  children: any[];
}

const editorStore = useEditorStore();
const { activeElementUUID } = storeToRefs(editorStore);
const draggableWidth = 32 / 2;
const timelineRef = ref<HTMLDivElement>();
const timelineBox = ref<HTMLDivElement>();
const positionX = ref(0);
const positionW = ref(0);
const duration = computed(() => Math.ceil(editorStore.getActiveScene()?.data?.duration || 10));

onMounted(() => {
  timelineBox.value?.addEventListener('mousemove', handleMouseMove);
  timelineBox.value?.addEventListener('mouseup', handleMouseUp);
});
onUnmounted(() => {
  timelineBox.value?.removeEventListener('mousemove', handleMouseMove);
  timelineBox.value?.removeEventListener('mouseup', handleMouseUp);
});
const isDisabledResize = computed(() => {
  const ele = editorStore.getElementByUUID(editorStore.activeElementUUID);
  if (ele?.elName === 'md-subtitle' && ele.propsValue.voiceSrc && ele.propsValue.voiceDuration) {
    return true;
  }
  return false;
});
const timelineSize = useElementSize(timelineRef);
const offset = computed(() => {
  if (!timelineRef.value) return 10;
  const clientWidth = timelineSize.width.value;
  return clientWidth / duration.value;
});

const draggState = reactive({
  isDragging: false,
  startX: 0,
  offsetLeft: 0 - draggableWidth
});

const reloadPosition = (element: IMDElement) => {
  // eslint-disable-next-line prefer-const
  let { offset: eOffset = 0, duration: eDuration = 0 } = element || {};
  if (eDuration === 0 || eDuration > duration.value - eOffset) {
    eDuration = duration.value - eOffset;
  }
  nextTick(() => {
    positionW.value = offset.value * eDuration;
    positionX.value = offset.value * eOffset;
  });
};

const handleMouseDown = (event) => {
  draggState.isDragging = true;
  draggState.startX = event.pageX - draggState.offsetLeft;
};

const handleMouseMove = (event) => {
  if (!draggState.isDragging || !timelineRef.value) return;
  const { clientWidth } = timelineRef.value;
  draggState.offsetLeft = Math.max(
    0 - draggableWidth,
    Math.min(clientWidth - draggableWidth, event.pageX - draggState.startX)
  );
};

const handleMouseUp = () => {
  draggState.isDragging = false;
  const offsetLeft = draggState.offsetLeft;
  const str = ((offsetLeft + draggableWidth) / offset.value).toFixed(1);
  const n = getCurrentNum(str);
  editorStore.curSceneDuration = n;
};

watch(
  () => editorStore.curSceneDuration,
  (v) => {
    if (!timelineRef.value) return;
    draggState.offsetLeft = v * offset.value - draggableWidth;
  }
);

watch(
  () => [editorStore.getActiveElement(), offset.value],
  ([element]) => {
    if (element) {
      reloadPosition(element as IMDElement);
    }
  },
  { deep: true }
);

const onResizeStop = (x, y, w, h) => {
  const o = x / offset.value;
  const d = w / offset.value;
  editorStore.updateElement({
    offset: getCurrentNum(o),
    duration: getCurrentNum(d)
  });
};

const onDragStop = (x) => {
  const o = x / offset.value;
  editorStore.updateElement({
    offset: o
  });
};

const layerWidth = ref(28);

const layers = ref<ILayerItem[]>([]);

watch(
  () => [editorStore.getActiveScene()?.elements, editorStore.getActiveElement(), duration.value],
  () => {
    const elements = editorStore.getActiveScene()?.elements;
    let layerList: ILayerItem[] = [];
    elements.forEach((ele) => {
      const { elName, uuid, offset: eOffset } = ele;
      const { icon, title: lTitle } = pluginManager.getLayer(elName) || {};
      const title = get(ele, lTitle, lTitle);
      const layerHtml = getLayerHtml(ele);
      const left = eOffset * offset.value - 15;
      const index = layerList.findIndex((layer) => Math.abs(layer.left - left) < 20);
      const payload = {
        uuid,
        offset: eOffset,
        icon,
        title,
        layerHtml
      };
      if (index !== -1) {
        const layer = layerList[index];
        layer.children.push(payload);
      } else {
        layerList.push({
          open: false,
          left: left,
          layerId: getUUID(),
          children: [{ ...payload }]
        });
      }
    });
    layerList = layerList.sort((a, b) => a.left - b.left);
    const minWidth = layerList.reduce((p, c, i, arr) => {
      let min = p;
      if (arr[i + 1]?.left) {
        min = arr[i + 1].left - c.left;
        min = min < p ? min : p;
      }
      return min;
    }, 0);
    if (layerWidth.value < minWidth) {
      layerWidth.value = minWidth;
    }
    layers.value = layerList;
  }
);

const changeOpenLayer = (layer: ILayerItem) => {
  const nLayer = layers.value.map((l) => {
    if (l.layerId === layer.layerId) {
      l.open = layer.open;
    } else {
      l.open = !layer.open;
    }
    return l;
  });
  layers.value = nLayer;
};

const axios = computed(() => {
  const axios: number[] = [];
  for (let i = 0; i < duration.value; i++) {
    axios.push(offset.value * i);
  }
  return axios;
});

const isShowAxios = (i: number) => {
  let labelGap = 1;
  const len = axios.value.length;
  if (len > 240) {
    labelGap = 50;
  } else if (len > 180) {
    labelGap = 30;
  } else if (len > 60) {
    labelGap = 20;
  } else if (len > 40) {
    labelGap = 10;
  } else if (len > 30) {
    labelGap = 5;
  }

  return i % labelGap === 0;
};

const setActiveElementUUID = (uuid: string) => {
  const el = editorStore.getElementByUUID(uuid);
  if (el) {
    const curSceneDuration = editorStore.curSceneDuration;
    const { offset: eOffset, duration } = el;
    if (curSceneDuration > duration + eOffset) {
      editorStore.curSceneDuration = eOffset;
      draggState.offsetLeft = Number((eOffset * offset.value - draggableWidth).toFixed(1));
    }
    editorStore.activeElementUUID = uuid;
  }
};
</script>
<style lang="scss" scoped>
:deep(.my-handle-class) {
  position: absolute;
  height: 0;
  width: 0;
}
:deep(.my-handle-class-ml) {
  top: 0 !important;
  background-color: var(--el-color-primary-light-5);
  height: 50px !important;
  width: 8px !important;
  left: -8px !important;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  &::after {
    display: block;
    position: absolute;
    top: 14px;
    left: 2px;
    color: #fff;
    content: '|';
  }
}
:deep(.my-handle-class-mr) {
  top: 0 !important;
  background-color: var(--el-color-primary-light-5);
  height: 50px !important;
  width: 8px !important;
  right: -8px !important;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  &::after {
    display: block;
    position: absolute;
    top: 14px;
    left: 2px;
    color: #fff;
    content: '|';
  }
}
:deep(.vue-drag-resize-rotate) {
  border: none;
}
.drag-dom {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--el-color-primary-light-8);
  cursor: pointer;
}

.timeline-wrap {
  width: 100%;
  .timeline {
    margin-top: 20px;
    width: 100%;

    .timeline-axis {
      position: relative;
      height: 16px;
      width: 100%;
      font-size: 12px;
      .draggable {
        z-index: 100;
        position: absolute;
        transform: translateY(-50%);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-left: 16px solid transparent;
        border-top: 20px solid var(--el-color-primary);
        border-bottom: 20px solid transparent;
        border-right: 16px solid transparent;
      }
      .axis {
        position: absolute;
        height: 6px;
        color: var(--el-text-color-secondary);
        border-left: 1px solid var(--el-text-color-primary);
        border-top: 1px solid var(--el-text-color-primary);
        touch-action: none;
        user-select: none;
        .axis-text {
          position: absolute;
          bottom: 10px;
          touch-action: none;
          position: absolute;
          left: 0;
          color: #8f8ba9;
          width: 100%;
          text-align: center;
          transform: translateX(-50%);
          font-size: smaller;
        }
        .axis-text-last {
          position: absolute;
          bottom: 10px;
          touch-action: none;
          position: absolute;
          color: #8f8ba9;
          width: 100%;
          text-align: center;
          transform: translateX(50%);
          z-index: 0;
        }
      }
    }
    .timeline-no {
      width: 100%;
      height: 50px;
      background-color: var(--el-fill-color);
      position: relative;
      user-select: none;
      .timeline-duration {
        position: absolute;
        background-color: var(--el-color-primary-light-8);
        height: 100%;
        i {
          font-size: 28px;
          font-weight: 700;
          color: var(--el-color-primary);
        }
        i.left {
          position: absolute;
          left: -10px;
        }
        i.right {
          position: absolute;
          right: -10px;
        }
      }
    }
  }
  .layers {
    position: relative;
    top: 4px;
    :deep(.el-popover.el-popper) {
      padding: 0;
    }
    .layer {
      position: absolute;
      .layer-item {
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: var(--el-text-color-secondary);
        border: var(--el-border);
        border-radius: 3px;
        background-color: var(--el-fill-color-extra-light);
        cursor: pointer;
        &.active {
          border-color: var(--el-color-primary-light-7);
          border-width: 3px;
          color: var(--el-color-primary-light-3);
        }
        :deep(span) {
          display: inline-block;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: pre;
        }
      }
      .layer-items {
        display: flex;
        flex-wrap: wrap;
        .layer-item {
          margin: 6px 4px;
        }
      }
      :deep(i.iconfont) {
        font-size: 16px;
        position: relative;
        cursor: pointer;
        &.active {
          color: var(--el-color-primary);
          z-index: 100;
        }
      }
    }
  }
}
</style>
