<template>
  <div class="template-list">
    <VideoTypes v-model:vertical="vertical"></VideoTypes>
    <div class="classifys">
      <ElButton
        size="small"
        :type="classify === 'all' ? 'primary' : 'default'"
        @click="classify = 'all'"
        >全 部</ElButton
      >
      <ElButton
        v-for="item in classifyList"
        :key="item"
        :type="classify === item ? 'primary' : 'default'"
        size="small"
        @click="classify = item"
        >{{ item }}</ElButton
      >
    </div>
    <ElDivider></ElDivider>

    <div
      v-if="templateList.length"
      v-loading="loading"
      element-loading-text="加载模板资源中，请稍等..."
      class="list"
    >
      <ElScrollbar>
        <div v-for="page in templateList" :key="page._id" class="info">
          <div
            class="cover-image"
            :style="{ width: '200px', height: (!vertical ? 140 : 240) + 'px' }"
          >
            <ElImage
              :src="BaseCosUrl + page.cover"
              :style="{ width: '100%', height: '100%' }"
              fit="cover"
            />
            <i
              v-if="page.filePath"
              title="预览/下载"
              class="iconfont icon-Play"
              @click="previewTemplate(page)"
            ></i>
          </div>

          <span class="title" :title="page.projectInfo.title"> {{ page.projectInfo.title }}</span>
          <div class="operation">
            <ElText type="primary" @click="applyTemplate(page)">应用模板</ElText>
            <template v-if="isAdmin">
              <span class="splice">|</span>
              <ElPopconfirm
                :teleported="false"
                title="确定删除吗?"
                cancel-button-text="取消"
                confirm-button-text="确定"
                @confirm="deleteTemplate(page._id)"
              >
                <template #reference>
                  <ElText type="danger">删除</ElText>
                </template>
              </ElPopconfirm>
            </template>
          </div>
        </div>
      </ElScrollbar>
    </div>
    <ElEmpty v-else style="margin-top: 5%"
      ><template #description>
        <p style="color: var(--el-text-color-secondary)">
          当前条件下没有相关模板，请查看
          <ElText type="primary" @click="vertical = !vertical"
            >{{ !vertical ? '竖版' : '横版' }}
          </ElText>
          或更换分类
        </p>
      </template></ElEmpty
    >
  </div>
</template>
<script setup lang="ts">
import { IPageInfo } from '@api/page';
import { useRouter } from 'vue-router';
import { computed, onMounted, ref, toRaw, watch } from 'vue';
import VideoTypes from '@renderer/views/editor/libs/VideoTypes.vue';
import { ElMessage } from 'element-plus';
import { useAppConfigStore, usePreviewStore, useEditorStore } from '@renderer/store';
import axiosService from '@renderer/service/axiosService';
import { IApplyTemplate, ITemplateInfo } from '@api/template';
import { DefaultProjectInfo } from '@renderer/config/DataModel';
const BaseCosUrl = ref('https://wvovw-1301321746.cos.ap-chengdu.myqcloud.com/');
const router = useRouter();
const templateList = ref<IPageInfo[]>([]);
const appConfigState = useAppConfigStore();
const previewStore = usePreviewStore();
const editorStore = useEditorStore();
const classify = ref('all');
const loading = ref(false);
const isAdmin = computed(() => appConfigState.userInfo.username === 'admin');
onMounted(() => {
  getPages();
});
const vertical = ref(appConfigState.vertical);
const classifyList = ref<string[]>([]);
watch(
  () => [vertical.value, classify.value],
  () => {
    appConfigState.$patch({
      vertical: vertical.value
    });
    getPages();
  }
);
const previewTemplate = (page: any) => {
  if (page.filePath && page.projectInfo) {
    const filePath = BaseCosUrl.value + page.filePath;
    previewStore.showDownload = false;
    previewStore.playVideo(filePath, page.projectInfo);
  } else {
    ElMessage.warning('获取模板信息失败!');
  }
};
const applyTemplate = async (page: ITemplateInfo) => {
  const { filePath, cover, projectInfo, scenes, classify } = toRaw(page);
  loading.value = true;
  const { data } = await window.invoke<IApplyTemplate['req'], IApplyTemplate['res']>(
    'applyTemplate',
    {
      payload: {
        filePath,
        cover,
        projectInfo,
        scenes,
        classify
      }
    }
  );
  const editorData = data.data;
  loading.value = false;
  if (!editorData) {
    ElMessage.warning(data?.msg || '未知错误，请联系管理员！');
  }

  editorStore.projectScenes = editorData?.scenes || [];
  editorStore.projectInfo = editorData?.projectInfo || DefaultProjectInfo;
  editorStore.currentHistoryIndex = 0;
  editorStore.historyCache = [];
  if (editorStore.projectScenes.length > 0) {
    editorStore.activeSceneUUID = editorStore.projectScenes[0].uuid;
  }
  router.push({ name: 'editor', params: { id: 'template' } });
};
const getPages = async () => {
  try {
    const { data } = await axiosService.post('/template/getList', {
      page: 1,
      pageSize: 100,
      vertical: vertical.value,
      classify: classify.value === 'all' ? '' : classify.value
    });
    const { list, total, classifys = [] } = data || {};
    classifyList.value = classifys;
    templateList.value = list;
  } catch (error) {
    classifyList.value = [];
    templateList.value = [];
    console.error(error);
  }
};

const deleteTemplate = async (id: string) => {
  if (!id) return;
  await axiosService.post('/template/delete', {
    ids: id
  });
  ElMessage({ type: 'success', message: '删除成功！' });
  getPages();
};
</script>

<style lang="scss" scoped>
.template-list {
  padding: 16px;
  .classifys {
    button {
      margin-top: 12px;
    }
  }
  .list {
    height: calc(100% - 180px);
    :deep(.el-scrollbar__view) {
      display: flex;
      flex-wrap: wrap;
    }
    .info {
      display: flex;
      flex-direction: column;
      margin: 10px;
      border: var(--el-border);
      border-radius: 2px;
      .cover-image {
        position: relative;
        widows: 100%;
        .iconfont {
          font-size: 40px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--el-color-primary);
          opacity: 0.8;
          cursor: pointer;
        }
      }
      .title {
        color: var(--el-text-color-secondary);
        padding: 6px;
        width: 200px;
        text-overflow: ellipsis;
        white-space: pre;
      }
      .operation {
        display: flex;
        align-items: center;
        justify-content: space-around;
        border-top: var(--el-border);
        padding: 6px;
        span.el-text {
          cursor: pointer;
        }
        span.splice {
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
}
</style>
