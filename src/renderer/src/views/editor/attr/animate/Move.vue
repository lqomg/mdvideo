<template>
  <div class="move-animate">
    <div class="title">移动效果</div>
    <ElSpace>
      <ElTag :type="name === 'none' ? undefined : 'info'" @click="changeType('none')">无效果</ElTag>
      <ElTag :type="name === 'move' ? undefined : 'info'" @click="changeType('move')">移 动</ElTag>
    </ElSpace>
  </div>
</template>
<script setup lang="ts">
import { useEditorStore } from '@renderer/store';
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { DefaultCustomeAnimate } from './constant';
import { cloneDeep } from 'lodash';
const editStore = useEditorStore();
const name = ref('none');
const { activeElementUUID } = storeToRefs(editStore);
const activeElement = editStore.getActiveElement();
const changeType = (v: string) => {
  name.value = v;
  const ele = editStore.getElementByUUID(activeElementUUID.value);
  if (!ele) return;
  let custom = ele.animations.custom;
  if (!custom) {
    custom = cloneDeep(DefaultCustomeAnimate);
    const { width, height, rotate, top, left, opacity } = ele.commonStyle;
    custom.from.x = left;
    custom.from.y = top;
    custom.from.width = width;
    custom.from.height = height;
    custom.from.opacity = opacity;
    custom.from.scale = 1;
    custom.from.rotate = rotate;

    custom.to.x = left + 100;
    custom.to.y = top + 100;
    custom.to.width = width;
    custom.to.height = height;
    custom.to.opacity = opacity;
    custom.to.scale = 1;
    custom.to.rotate = rotate;
  }
  custom.show = v === 'move';
  ele.animations.custom = custom;
};
watch(
  () => activeElement,
  () => {
    const ele = editStore.getActiveElement();
    if (ele) {
      const { animations } = ele;
      name.value = animations.custom?.show ? 'move' : 'none';
    }
  },
  {
    deep: true,
    immediate: true
  }
);
</script>

<style lang="scss" scoped>
.move-animate {
  padding: 10px;
  .title {
    color: var(--el-text-color-secondary);
    font-size: 16px;
    margin-bottom: 10px;
  }
}
</style>
