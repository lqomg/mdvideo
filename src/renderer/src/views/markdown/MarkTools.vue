<template>
  <div v-loading="loading" class="tools">
    <ElSpace>
      <ElCheckbox
        :checked="markdownStore.autoPlay"
        size="small"
        @change="
          (v) => {
            markdownStore.autoPlay = v as boolean;
          }
        "
        >自动播放</ElCheckbox
      >
      <ElTooltip content="重新根据Markdown文档生成预览视频，当视频预览元素存在乱序情况时点击!">
        <ElButton :icon="Refresh" size="small" link @click="() => emits('reflesh')">重置</ElButton>
      </ElTooltip>
    </ElSpace>
    <ElSpace :size="16">
      <ElTooltip content="进入视频编辑器编辑视频">
        <ElButton size="small" :icon="Edit" @click="toEdit">编辑细节</ElButton>
      </ElTooltip>
      <ElTooltip content="基于目前Markdown文本立刻合成视频">
        <CreateVideoBtn size="small" @create-video="createVideo" :show-icon="true"></CreateVideoBtn>
      </ElTooltip>
    </ElSpace>
  </div>
</template>
<script setup lang="ts">
import { ref, toRaw, toRefs } from 'vue';
import { MarkdownProps } from './core/MarkdownManager';
import { Edit, Help, Refresh } from '@element-plus/icons-vue';
import { useMarkdownStore } from '@renderer/store';
import CreateVideoBtn from '@renderer/components/CreateVideoBtn.vue';
import { useRouter } from 'vue-router';
import { ICreatePage } from '@api/page';
import { sleep } from '@renderer/utils';
import { ElMessageBox } from 'element-plus';
import { getNewProjectByMarkdown } from './getNewProject';
import { IMDProjectInfo } from '@api/types';
const props = defineProps<{
  markdownScenes: MarkdownProps[];
  markdownDoc: string;
  projectInfo: IMDProjectInfo;
}>();
const emits = defineEmits<{
  (event: 'reflesh'): void;
}>();
const { markdownScenes, markdownDoc, projectInfo } = toRefs(props);
const markdownStore = useMarkdownStore();
const router = useRouter();
const loading = ref(false);
const toEdit = async () => {
  loading.value = true;
  await getNewProjectByMarkdown({
    markdownScenes: toRaw(markdownScenes.value),
    markdownDoc: markdownDoc.value,
    projectInfo: toRaw(projectInfo.value)
  });
  loading.value = false;
  router.push({ name: 'editor', params: { id: 'markdown' } });
};

const createVideo = async (clarity: string) => {
  loading.value = true;
  try {
    const payload: any = await getNewProjectByMarkdown({
      markdownScenes: toRaw(markdownScenes.value),
      markdownDoc: markdownDoc.value,
      projectInfo: toRaw(projectInfo.value)
    });
    payload.clarity = clarity;
    await window.invoke<ICreatePage['req'], ICreatePage['res']>('createPage', {
      payload: payload
    });
    await sleep(500);
    loading.value = false;
    ElMessageBox({
      title: '提示',
      type: 'success',
      appendTo: 'body',
      message: '新建导出任务成功，请在右上角任务列表查看进度'
    });
  } catch (error) {
    ElMessageBox({
      title: '提示',
      type: 'warning',
      appendTo: 'body',
      message: '导出失败，请联系管理员：' + error
    });
    loading.value = false;
  }
};
</script>
<style lang="scss" scoped>
.tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 0 12px;
  border-bottom: 1px solid var(--el-border-color);
}
</style>
