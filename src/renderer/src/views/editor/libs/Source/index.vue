<template>
  <div class="source-lib">
    <div class="source-add">
      <div class="lib" @click="editorStore.addElement('md-video')">
        <i class="iconfont icon-VideoCamera"></i>
        <span>添加视频</span>
      </div>
      <div class="lib" @click="editorStore.addElement('md-audio')">
        <i class="iconfont icon-audio"></i>
        <span>添加音频</span>
      </div>
    </div>
    <ElDivider style="margin: 6px 0" />
    <Material
      class="material-wrap"
      :directory="path"
      :default-display-type="'appstore'"
      @change-directory="(v) => (path = v)"
    />
  </div>
</template>
<script lang="ts" setup>
import Material from '@renderer/components/Material/index.vue';
import { useAppConfigStore, useEditorStore } from '@renderer/store';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
const editorStore = useEditorStore();
const appConfigStore = useAppConfigStore();
const { resourcePath } = storeToRefs(appConfigStore);
const path = ref(resourcePath?.value + '/视频');
</script>
<style lang="scss" scoped>
.source-lib {
  height: 100%;
  .source-add {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    .lib {
      width: 48%;
      height: 80px;
      text-align: center;
      border: var(--el-border);
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      cursor: pointer;
      &:hover {
        border-color: var(--el-color-primary);
      }
      i {
        font-size: 28px;
        color: var(--el-color-primary-light-3);
      }
      span {
        margin-top: 6px;
        color: var(--el-text-color-secondary);
        font-size: 13px;
      }
    }
  }
  .material-wrap {
    height: calc(100% - 130px);
  }
}
</style>
