<template>
  <ElPopover trigger="click" title="导出任务进度列表" width="400" :teleported="false">
    <div v-show="taskStore.tasks?.length > 0" class="task-list">
      <div v-for="task in taskStore.tasks" :key="task.taskId">
        <div v-if="task.states === TaskStates.Complete" class="task-item">
          <ElBadge value="成功" type="success">
            <ElSpace :size="10">
              <ElButton
                type="primary"
                title="播放"
                text
                size="small"
                @click="
                  () => {
                    previewStore.playVideo(task.filePath, task.projectInfo);
                  }
                "
                ><template #icon><i class="iconfont icon-play-circle"></i></template
              ></ElButton>
              <ElText>{{ task.projectInfo.title }}- {{ task.videoId }}</ElText>
            </ElSpace>
          </ElBadge>
        </div>
        <div v-else-if="task.states === TaskStates.Error" class="task-item">
          <ElBadge value="失败" type="warning">
            <ElSpace :size="10">
              <ElButton type="danger" text size="small"
                ><template #icon><i class="iconfont icon-info-circle"></i></template
              ></ElButton>
              <ElText>{{ task.projectInfo.title }}- {{ task.videoId }}</ElText>
            </ElSpace>
          </ElBadge>
        </div>
        <div v-else-if="task.states === TaskStates.Waiting" class="task-item">
          <ElBadge value="进行中" type="primary">
            <ElProgress :stroke-width="10" :percentage="task.percentage"></ElProgress>
          </ElBadge>
        </div>
        <div v-else class="task-item">
          <ElBadge value="等待中" type="info">
            <ElSpace :size="10">
              <ElButton type="info" text size="small"
                ><template #icon><i class="iconfont icon-coffee"></i></template
              ></ElButton>
              <ElText>任务资源/队列等待中...</ElText>
            </ElSpace>
          </ElBadge>
        </div>
      </div>
    </div>
    <ElEmpty
      v-if="taskStore.tasks?.length === 0"
      :image-size="50"
      description="没有相关进行中的任务"
    ></ElEmpty>
    <template #reference>
      <ElBadge
        :value="taskMsg"
        :type="
          (taskStateCount.waitingValue && 'primary') ||
          (taskStateCount.errorValue && 'danger') ||
          (taskStateCount.completeValue && 'success') ||
          'primary'
        "
      >
        <ElButton size="small" link
          ><template #icon><i class="iconfont icon-video"></i></template>任务列表</ElButton
        >
      </ElBadge>
    </template>
  </ElPopover>
</template>
<script lang="ts" setup>
import { usePreviewStore, useTaskStore } from '@renderer/store';
import { computed } from 'vue';
import { TaskStates } from '@api/contanst';

const taskStore = useTaskStore();
const previewStore = usePreviewStore();
const taskStateCount = computed(() => taskStore.getTaskStateCount);
const taskMsg = computed(() => {
  if (taskStateCount.value.waitingValue) {
    return '进行中 ' + taskStateCount.value.waitingValue;
  }
  return (
    taskStateCount.value.waitingValue ||
    taskStateCount.value.errorValue ||
    taskStateCount.value.completeValue
  );
});
</script>

<style lang="scss" scoped>
.task-list {
  .task-item {
    padding: 2px 0;
    border-top: var(--el-border);
    .iconfont {
      font-size: 20px;
    }
    :deep(.el-badge) {
      width: 340px;
      display: flex;
      align-items: center;
      min-height: 32px;
    }
    :deep(.el-progress) {
      flex: 1;
    }
    :deep(.el-badge__content.is-fixed) {
      top: 16px;
    }
    :deep(.el-text) {
      max-width: 280px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: pre;
    }
  }
}
</style>
