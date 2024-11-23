<template>
  <div class="attr-wrap">
    <ElTabs
      v-if="activeElement"
      :model-value="editorStore.attrActiveName"
      @tab-change="(v) => (editorStore.attrActiveName = v.toString())"
    >
      <ElTabPane label="图层属性" name="attr-prop">
        <Props v-bind="activeElement" @change-element="changeElement"></Props>
      </ElTabPane>
      <ElTabPane label="动画设置" name="attr-animate">
        <Animate />
      </ElTabPane>
    </ElTabs>
    <ElTabs v-else :model-value="'attr-scene'">
      <ElTabPane label="场景设置" name="attr-scene">
        <Scene />
      </ElTabPane>
      <ElTabPane label="图层管理" name="attr-layer">
        <Layer />
      </ElTabPane>
    </ElTabs>
  </div>
</template>
<script setup lang="ts">
import { pluginManager } from '@renderer/plugins';
import { useEditorStore } from '@renderer/store';
import { IMDElement } from '@renderer/types';
import { storeToRefs } from 'pinia';
import { computed, toRaw } from 'vue';
import Animate from './animate/index.vue';
import Scene from './scene/index.vue';
import Layer from './layer/index.vue';
const editorStore = useEditorStore();
const { activeElementUUID } = storeToRefs(editorStore);
const activeElement = computed(() => editorStore.getElementByUUID(activeElementUUID.value));
const Props = computed(() => {
  if (activeElement.value) {
    return pluginManager.getPropsCom(activeElement?.value?.elName);
  }
  return null;
});

const changeElement = (newElement: IMDElement) => {
  editorStore.updateElement(newElement);
};
</script>
<style lang="scss" scoped>
.attr-wrap {
  width: 100%;
  height: 100%;
  :deep(.el-tabs__nav) {
    width: 100%;
    float: none;
    display: flex;
  }
  :deep(.el-tabs__header) {
    margin: 0;
  }
  :deep(.el-tabs__item) {
    width: 50%;
    text-align: center;
  }
  :deep(.el-tabs) {
    height: 100%;
  }
  :deep(.el-tabs__content) {
    height: calc(100% - 42px);
  }
  :deep(.el-tab-pane) {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
<style lang="scss">
.public-props {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .public-props-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    color: var(--el-text-color-secondary);
    .tip {
      font-size: 16px;
    }
  }
}
</style>
