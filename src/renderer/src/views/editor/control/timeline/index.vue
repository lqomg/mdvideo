<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="timeline-box">
    <div class="timeline-sine">{{ editorStore.curSceneDuration.toFixed(1) || 0 }}s</div>
    <Timeline />
    <div class="operation">
      <ElTooltip content="增加场景时间" placement="right" :show-after="500">
        <i
          class="iconfont icon-plus"
          :class="{ disabled: duration > MaxSceneDuration }"
          @click="editorStore.addSceneDuration()"
        ></i>
      </ElTooltip>
      <ElTooltip content="减少场景时间" placement="right" :show-after="500">
        <i
          class="iconfont icon-minus"
          :class="{ disabled: duration <= MinSceneDuration }"
          @click="editorStore.reduceSceneDuration()"
        ></i>
      </ElTooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@renderer/store';
import Timeline from './timeline.vue';
import { MaxSceneDuration, MinSceneDuration } from '@renderer/config/DataModel';
import { computed } from 'vue';

const editorStore = useEditorStore();

const duration = computed(() => editorStore.getActiveScene()?.data?.duration || 10);
</script>
<style lang="scss" scoped>
.timeline-box {
  width: 90%;
  display: flex;
  align-items: center;
  margin: 0 auto;
  .timeline-sine {
    display: flex;
    width: 20px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: var(--el-color-primary);
    margin-right: 16px;
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
