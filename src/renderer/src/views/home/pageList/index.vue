<template>
  <div v-loading="loading" class="page-list">
    <div class="header">
      <div class="page-thumbnail-panel create">
        <div class="temp-create" @click="router.push({ name: 'editor', params: { id: 'none' } })">
          <i class="iconfont icon-Video"></i>
          <p class="paddingT10">新建作品</p>
        </div>
      </div>
      <div class="page-thumbnail-panel create create-mark">
        <div class="temp-create" @click="router.push({ name: 'markdown', params: { id: 'none' } })">
          <i class="iconfont icon-Markdown"></i>
          <p class="paddingT10">Markdown 转视频</p>
        </div>
      </div>
    </div>
    <ElDivider></ElDivider>
    <VideoTypes v-model:vertical="vertical"></VideoTypes>
    <div v-if="pageList.length" class="list">
      <ElScrollbar>
        <div v-for="page in pageList" :key="page._id" class="info">
          <div
            class="cover-image"
            :style="{ width: '250px', height: (!vertical ? 160 : 320) + 'px' }"
          >
            <ElImage :src="page.cover" :style="{ width: '100%', height: '100%' }" fit="cover">
              <template #error>
                <div class="image-slot">未生成相关视频</div>
              </template>
            </ElImage>
            <i
              v-if="page.filePath"
              title="预览/下载"
              class="iconfont icon-Play"
              @click="
                () => {
                  previewStore.showDownload = true;
                  previewStore.playVideo(page.filePath!, page.projectInfo);
                }
              "
            ></i>
          </div>

          <span class="title" :title="page.projectInfo.title"> {{ page.projectInfo.title }}</span>
          <div class="operation">
            <ElText
              type="primary"
              @click="router.push({ name: 'editor', params: { id: page._id } })"
              ><i class="icon-edit iconfont"></i>编辑</ElText
            >
            <span class="splice">|</span>
            <template v-if="page.isMarkdownSource && page.markdown">
              <ElText
                type="primary"
                @click="router.push({ name: 'markdown', params: { id: page._id } })"
                ><i class="icon-markdown iconfont"></i> 文本</ElText
              >
              <span class="splice">|</span>
            </template>

            <ElPopconfirm
              :teleported="false"
              title="确定删除吗?"
              cancel-button-text="取消"
              confirm-button-text="确定"
              @confirm="deletePage(page._id)"
            >
              <template #reference>
                <ElText type="danger">删除</ElText>
              </template>
            </ElPopconfirm>
            <template v-if="isAdmin">
              <span class="splice">|</span>
              <ElText type="primary" @click="createTemplate(page)">生成模板</ElText>
            </template>
          </div>
        </div>
      </ElScrollbar>
    </div>
    <ElEmpty
      v-else
      :description="`没有相关数据，请查看 ${!vertical ? '竖版' : '横版'} 作品，或者点击新建作品~`"
      style="margin-top: 5%"
    ></ElEmpty>
    <ElDialog v-model="dialoagVisiable" title="添加模板" :append-to-body="false">
      <ElForm style="padding: 20px">
        <ElFormItem label="分类">
          <ElInput v-model="templateClass" />
        </ElFormItem>
        <ElFormItem label="名称">
          <ElInput v-model="templateName" />
        </ElFormItem>
        <div style="text-align: right; margin-top: 50px">
          <ElSpace :size="40">
            <ElButton @click="dialoagVisiable = false">取 消</ElButton>
            <ElButton type="primary" @click="submitCreate">确 认</ElButton>
          </ElSpace>
        </div>
      </ElForm>
    </ElDialog>
  </div>
</template>
<script setup lang="ts">
import { IDeletePage, IGetPage, IPageInfo } from '@api/page';
import { useRouter } from 'vue-router';
import { computed, onMounted, ref, toRaw, watch } from 'vue';
import VideoTypes from '@renderer/views/editor/libs/VideoTypes.vue';
import { ElMessage } from 'element-plus';
import { useAppConfigStore, usePreviewStore } from '@renderer/store';
import { ICreateTemplate } from '@api/template';
import axiosService from '@renderer/service/axiosService';

const router = useRouter();
const pageList = ref<IPageInfo[]>([]);
const appConfigState = useAppConfigStore();
const previewStore = usePreviewStore();
const dialoagVisiable = ref(false);
const templateClass = ref('经典常用');
const templateName = ref('');
const currentPage = ref<IPageInfo>();
const loading = ref(false);
const isAdmin = computed(() => appConfigState.userInfo.username === 'admin');
onMounted(() => {
  getPages();
});
const vertical = ref(appConfigState.vertical);

watch(
  () => vertical.value,
  () => {
    appConfigState.$patch({
      vertical: vertical.value
    });
    getPages();
  }
);
const getPages = async () => {
  const { data } = await window.invoke<IGetPage['req'], IGetPage['res']>('getPage', {
    payload: {
      vertical: vertical.value
    }
  });
  pageList.value = data.data;
};

const deletePage = async (id: string) => {
  if (!id) return;
  await window.invoke<IDeletePage['req'], IDeletePage['res']>('deletePage', {
    payload: { _id: id }
  });
  ElMessage({ type: 'success', message: '删除成功！' });
  getPages();
};
const submitCreate = async () => {
  if (!currentPage.value || !templateClass.value.trim() || !templateName.value.trim()) {
    ElMessage.warning('请输入相关数据!');
    return;
  }

  const { scenes, filePath, cover, projectInfo } = toRaw(currentPage.value);

  if (!filePath || !cover) return;
  loading.value = true;
  dialoagVisiable.value = false;
  try {
    const { data } = await window.invoke<ICreateTemplate['req'], ICreateTemplate['res']>(
      'createTemplate',
      {
        payload: {
          scenes,
          filePath,
          cover,
          projectInfo,
          classify: templateClass.value
        }
      }
    );
    loading.value = false;
    if (!data.data) {
      ElMessage.error(data.msg || '未知错误'!);
    } else {
      const { classify, projectInfo, scenes, cover, filePath } = data.data;
      await axiosService.post('/template/create', {
        classify,
        projectInfo,
        scenes,
        cover,
        filePath,
        name: templateName.value
      });
      dialoagVisiable.value = false;
      ElMessage.success('模板生成成功!');
    }
  } catch (error) {
    loading.value = false;
    ElMessage.error(error || '未知错误'!);
  }
};

const createTemplate = (page: IPageInfo) => {
  currentPage.value = toRaw(page);
  templateName.value = page.projectInfo.name || page.projectInfo.title;
  dialoagVisiable.value = true;
};
</script>

<style lang="scss" scoped>
.page-list {
  padding: 16px;
  .header {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .code {
      width: 400px;
      height: 120px;
      margin-left: 40px;
    }
    .page-thumbnail-panel {
      width: 180px;
      height: 120px;
      min-width: 100px;
    }
    .paddingT10 {
      padding: 10px;
      margin: 0;
    }
    .page-thumbnail-panel.create {
      &.create-mark {
        margin-left: 20px;
      }
      text-align: center;

      .temp-create {
        display: inline-block;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: var(--el-border);
        transition: all 0.28s;
        cursor: pointer;
        flex-direction: column;
        color: var(--el-color-primary);
        &:hover {
          color: var(--el-color-success);
          border-color: var(--el-border);
          background-color: var(--el-fill-color);
        }
        .iconfont {
          font-size: 26px;
        }
        p {
          font-size: 16px;
        }
      }
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
        :deep(.image-slot) {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--el-text-color-secondary);
        }
        .iconfont {
          font-size: 40px;
          background-color: #fff;
          border-radius: 6px;
          padding: 10px;
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
