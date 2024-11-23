<template>
  <div class="duoline-box">
    <div class="duoline-sine">{{ editorStore.curDupDuration || 0 }}s</div>
    <div class="duoline-wrap">
      <div ref="duolineRef" class="duoline" @mouseup="handleMouseUp">
        <div class="duoline-axis">
          <div
            class="draggable"
            :style="{ left: draggState.offsetLeft + 'px' }"
            @mousedown="handleMouseDown"
            @mouseup="draggState.isDragging = false"
          ></div>
          <div
            v-for="(left, index) in axios"
            :key="left"
            class="axis"
            :style="{ left: left + 'px', width: offset + 'px' }"
          >
            <span class="axis-text"> {{ index }}s</span>
            <span v-if="index === axios.length - 1" class="axis-text-last"
              >{{ axios.length }}s</span
            >
          </div>
        </div>
        <div class="duoline-no">
          <VueDragReSizeRotate
            v-if="activeElementUUID"
            :active="true"
            :prevent-deactivation="true"
            :h="30"
            :min-height="30"
            :max-height="30"
            :parent="true"
            :x="positionX"
            :w="positionW"
            :max-width="duolineRef?.clientWidth"
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
          v-for="item in layers"
          :key="item.uuid"
          :style="{ left: item.left + 'px' }"
          class="layer"
          @click="() => (editorStore.activeElementUUID = item.uuid)"
        >
          <i
            :class="[
              'iconfont ' + item.icon,
              item.uuid === editorStore.activeElementUUID ? 'active' : ''
            ]"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@renderer/store';
import {
  ref,
  defineProps,
  reactive,
  watch,
  nextTick,
  toRefs,
  onMounted,
  computed,
  onUnmounted
} from 'vue';
import { pluginManager } from '@renderer/plugins';
import { useElementSize } from '@vueuse/core';
import VueDragReSizeRotate from '@gausszhou/vue3-drag-resize-rotate';
import { storeToRefs } from 'pinia';
const editorStore = useEditorStore();
const { activeElementUUID } = storeToRefs(editorStore);
const draggableWidth = 32 / 2;

const duolineRef = ref<HTMLDivElement>();
const positionX = ref(0);
const positionW = ref(0);
const props = defineProps({
  duration: {
    type: Number,
    default: () => 10
  }
});
const { duration } = toRefs(props);
onMounted(() => {
  const duplineBoxDom = document.querySelector('.duoline-box')!;
  duplineBoxDom.addEventListener('mousemove', handleMouseMove);
  duplineBoxDom.addEventListener('mouseup', handleMouseUp);
  if (activeElementUUID.value) {
    // eslint-disable-next-line prefer-const
    let { offset: eOffset = 0, duration: eDuration = 0 } =
      editorStore.getElementByUUID(activeElementUUID.value) || {};
    if (eDuration === 0) {
      eDuration = duration.value - eOffset - 1;
    }

    positionW.value = offset.value * eDuration;
    nextTick(() => {
      positionX.value = offset.value * eOffset;
    });
  }
});

const handleMouseMove = (event) => {
  if (!draggState.isDragging || !duolineRef.value) return;
  const { clientWidth } = duolineRef.value;
  draggState.offsetLeft = Math.max(
    0 - draggableWidth,
    Math.min(clientWidth - draggableWidth, event.pageX - draggState.startX)
  );
};

const duolineSize = useElementSize(duolineRef);

const draggState = reactive({
  isDragging: false,
  startX: 0,
  offsetLeft: 0 - draggableWidth
});

const handleMouseDown = (event) => {
  draggState.isDragging = true;
  draggState.startX = event.pageX - draggState.offsetLeft;
};

const handleMouseUp = () => {
  draggState.isDragging = false;
};
watch(
  () => draggState.offsetLeft,
  (offsetLeft) => {
    editorStore.curDupDuration = Number(((offsetLeft + draggableWidth) / offset.value).toFixed(1));
  }
);
watch(activeElementUUID, () => {
  if (!activeElementUUID.value) return;

  // eslint-disable-next-line prefer-const
  let { offset: eOffset = 0, duration: eDuration = 0 } =
    editorStore.getElementByUUID(activeElementUUID.value) || {};
  if (eDuration === 0) {
    eDuration = duration.value - eOffset - 1;
  }

  positionW.value = offset.value * eDuration;
  nextTick(() => {
    positionX.value = offset.value * eOffset;
  });
});

const onResizeStop = (x, y, w, h) => {
  const o = x / offset.value;
  const d = w / offset.value;
  editorStore.updateElement({
    offset: o,
    duration: d
  });
};

const onDragStop = (x, y) => {
  const o = x / offset.value;
  editorStore.updateElement({
    offset: o
  });
};
const offset = computed(() => {
  if (!duolineRef.value) return 10;
  const clientWidth = duolineSize.width.value;
  return clientWidth / (duration.value - 1);
});

const layers = computed(() => {
  const elements = editorStore.getActiveScene().elements;
  const layers = elements.map((ele) => {
    const { elName, uuid, offset: eOffset } = ele;
    const { icon, title } = pluginManager.getLayer(elName) || {};
    const l = {
      uuid,
      left: eOffset * offset.value - 15,
      icon,
      title
    };
    return l;
  });
  return layers;
});
const axios = computed(() => {
  const axios: number[] = [];
  for (let i = 0; i < duration.value - 1; i++) {
    axios.push(offset.value * i);
  }
  return axios;
});
</script>
<style lang="scss" scoped>
.duoline-box {
  width: 80%;
  display: flex;
  align-items: center;
  margin: 0 auto;
  :deep(.my-handle-class) {
    position: absolute;
    height: 0;
    width: 0;
  }
  :deep(.my-handle-class-ml) {
    top: 0 !important;
    background-color: var(--el-color-primary-light-5);
    height: 30px !important;
    width: 4px !important;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  :deep(.my-handle-class-mr) {
    top: 0 !important;
    background-color: var(--el-color-primary-light-5);
    height: 30px !important;
    width: 4px !important;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
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
  .duoline-sine {
    display: flex;
    width: 20px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: var(--el-color-primary);
    margin-right: 16px;
  }
  .duoline-wrap {
    width: 100%;
    .layers {
      position: relative;
      .layer {
        position: absolute;
        width: 30px;
        height: 50px;
        overflow: hidden;
        i.iconfont {
          font-size: 28px;
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
  .duoline {
    margin-top: 20px;
    width: 100%;

    .duoline-axis {
      position: relative;
      height: 10px;
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
          z-index: -1;
        }
      }
    }
    .duoline-no {
      width: 100%;
      height: 30px;
      background-color: var(--el-bg-color-page);
      position: relative;
      .duoline-duration {
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
  .operation {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-left: 10px;
    i {
      font-size: 20px;
      color: var(--el-color-primary);
      font-weight: bold;
      margin-bottom: 10px;
      cursor: pointer;
      &.disabled {
        color: var(--el-text-color-placeholder);
      }
    }
  }
}
</style>
