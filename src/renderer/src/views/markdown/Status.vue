<template>
  <div :class="['status', messageStates.status]">
    {{ messageStates.message }}
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { EStatus } from './core/MarkdownManager';

const props = defineProps<{ status: EStatus }>();

const messageStates = computed(() => {
  if (props.status === EStatus.UPDATE) {
    return {
      status: 'update',
      message: '更新场景内容中...'
    };
  }
  if (props.status !== EStatus.SUCCESS) {
    return {
      status: 'add',
      message: '正在生成视频内容....'
    };
  }
  return {
    status: 'success',
    message: '预览视频'
  };
});
</script>

<style lang="scss" scoped>
.status {
  font-size: 12px;
  margin-bottom: 6px;
  text-align: left;
  width: 100%;
  padding-left: 30px;
  letter-spacing: 2px;
  &.update {
    color: var(--el-color-warning);
  }
  &.success {
    color: var(--el-color-success);
  }
  &.add {
    color: var(--el-color-primary);
  }
}
</style>
