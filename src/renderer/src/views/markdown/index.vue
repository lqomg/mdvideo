<template>
  <div class="markdown">
    <ElAlert v-show="loadingTxt" type="warning" :style="{ marginBottom: '12px' }">
      {{ loadingTxt }}
    </ElAlert>
    <div class="editor-config">
      <ElForm :inline="true" :label-width="90">
        <ElFormItem label="视频格式：">
          <ElRadioGroup v-model="videoType">
            <ElRadio label="1920*1080">横版视频</ElRadio>
            <ElRadio label="1080*1920">竖版视频</ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <!-- <ElFormItem label="默认模板：">
          <ElSelect :disabled="true"></ElSelect>
        </ElFormItem> -->
      </ElForm>
    </div>
    <div class="editor-preview">
      <!-- <div class="editor-folder" style="width: 620px"><Folder :text="text"></Folder></div> -->

      <div class="preview-wrap" style="width: 420px">
        <MarkTools
          :markdown-scenes="markdownScenes"
          :markdown-doc="text"
          :project-info="projectInfo"
          @reflesh="reflesh"
        ></MarkTools>
        <div class="preview-list">
          <Preview
            v-for="markdown in markdownScenes"
            :key="markdown.id"
            :markdown="markdown"
            :project-info="projectInfo"
          ></Preview>
        </div>
      </div>
      <div class="editor-wrap">
        <MdEditor
          v-model="text"
          :placeholder="placeholder"
          :preview="false"
          @on-change="(v) => (text = v)"
        ></MdEditor>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch,  toRaw } from 'vue';
import MdEditor from './MdEditor.vue';
import MarkTools from './MarkTools.vue';
import Preview from './Preview.vue';
import {
  IMDProjectInfo,
  IMDProjectScene,
  MainWinSendToMarkdownWin,
  MarkdownWinSendToMainWin
} from '@api/types';
import { cloneDeep } from 'lodash';
import { DefaultProjectInfo, DefaultProjectScene } from '@renderer/config/DataModel';
import { EStatus, MarkdownProps, markdownManager } from './core/MarkdownManager';
import { ICreatePage, IGetPage } from '@api/page';
import { useRoute } from 'vue-router';
import { watchDebounced } from '@vueuse/core';
import { ElMessage } from 'element-plus';
import { getNewProjectByMarkdown } from './getNewProject';
const text = ref('');
const loadingTxt = ref('');
const markdownScenes = ref<MarkdownProps[]>([]);
const projectInfo = ref<IMDProjectInfo>(cloneDeep(DefaultProjectInfo));
const videoType = ref('1920*1080');
const placeholder =
  ref(`输入Markdwon文本，使用未声明语言的代码块可以配置上一个元素的属性;如标题颜色设置：

## 枯藤老树昏鸦，小乔流水人家

\`\`\`元素配置
@color=red
@fontFamily=宋体
\`\`\`

使用分割线表示不同场景，其他配置请访问https://mdvideo.wvovw.com了解

`);
const route = useRoute();
const changeVideoWH = (w: number, h: number) => {
  projectInfo.value.width = w;
  projectInfo.value.height = h;
};
const reflesh = () => {
  markdownManager.markdwons = [];
  markdownManager.markdwon = '';
  markdownManager.history = [];
  markdownScenes.value = [];
  getMarkdown(text.value);
};
onMounted(async () => {
  const id = route?.params?.id as string;
  markdownManager.id = '';
  markdownManager.markdwons = [];
  markdownManager.markdwon = '';
  window.on(MarkdownWinSendToMainWin, (_event, args) => listening(args));
  if (id && id !== 'none') {
    const data = await getPage(id);
    const { isMarkdownSource, markdown } = data || {};
    if (isMarkdownSource && markdown) {
      const { scenes = [], doc = '' } = markdown;
      text.value = doc;
      markdownManager.setMarkdown(doc);
      if (scenes && scenes[0]?.scene) {
        markdownManager.markdwons = scenes;
      }
      markdownManager.id = id;
      getMarkdown(doc);
      // markdownScenes.value = markdownManager.markdwons;
    }
  }
});

watch(videoType, (v) => {
  if (v === '1920*1080') {
    changeVideoWH(1920, 1080);
  } else {
    changeVideoWH(1080, 1920);
  }
  getMarkdown(text.value, true);
});
const listening = async (args: any) => {
  const { elements, errorMsgs, id, sceneConfig = {}, status } = JSON.parse(args);
  const payload: Partial<MarkdownProps> = {};
  markdownManager.markdwons = markdownManager.markdwons.map((m) => {
    if (m) {
      m.isNeedPlay = false;
    }
    return m;
  });
  if (status === EStatus.SUCCESS) {
    const scene: IMDProjectScene = {
      uuid: id,
      elements: elements,
      data: {
        duration: sceneConfig.duration || 6,
        transName: sceneConfig.transName || '',
        transDuration: sceneConfig.transDuration || 0.5
      },
      commonStyle: {
        backgroundColor:
          sceneConfig.backgroundColor || DefaultProjectScene.commonStyle.backgroundColor,
        backgroundImage: sceneConfig.backgroundImage || '',
        backgroundSize: 'cover'
      }
    };
    payload.errorMsgs = errorMsgs;
    payload.scene = scene;
    payload.status = status;
    payload.isNeedPlay = true;
  } else {
    payload.status = status;
  }
  if (errorMsgs?.[0]) {
    ElMessage.warning(errorMsgs?.[0]);
  }
  markdownManager.changeMarkdownById(id, { ...payload });
  markdownScenes.value = markdownManager.markdwons;
};

watchDebounced(
  markdownScenes,
  () => {
    getNewProjectByMarkdown({
      markdownScenes: toRaw(markdownScenes.value),
      projectInfo: toRaw(projectInfo.value),
      markdownDoc: text.value
    }).then((payload) => {
      window.invoke<ICreatePage['req'], ICreatePage['res']>('preDownload', {
        payload: payload
      });
    });
  },
  {
    debounce: 2000,
    maxWait: 15000
  }
);

watchDebounced(text, (v) => getMarkdown(v), { debounce: 1000, maxWait: 5000 });

const getPage = async (id: string) => {
  const { data } = await window.invoke<IGetPage['req'], IGetPage['res']>('getPage', {
    payload: {
      _id: id
    }
  });
  return data.data[0] || {};
};
const getMarkdown = (v: string, forceUpdate = false) => {
  markdownManager.setMarkdown(v);
  markdownScenes.value = markdownManager.markdwons;
  const markdowns = markdownManager.getAddMarkdown();
  if (markdowns.length > 0 || forceUpdate) {
    // 发送新增或者编辑的markdownDoc
    window.invoke(MainWinSendToMarkdownWin, {
      markdowns: cloneDeep(markdownManager.markdwons),
      projectInfo: toRaw(projectInfo.value)
    });
  }
};
</script>
<style lang="scss" scoped>
.markdown {
  width: 100%;
  .editor-config {
    padding: 12px;
    padding-bottom: 0;
  }
  .editor-preview {
    display: flex;
    height: calc(100% - 60px);
    .editor-wrap {
      flex: 1;
    }
    .editor-folder {
      flex-shrink: 0;
    }
    .preview-wrap {
      overflow: hidden;
      height: 100%;
      border-top: var(--el-border);
      .preview-list {
        height: calc(100% - 36px);
        overflow-y: auto;
        overflow-x: hidden;
        border-bottom: var(--el-border);
      }
    }
  }

  :deep(.splitpanes__splitter) {
    margin: 0 10px;
    border: none;
  }
  :deep(.splitpanes__splitter::after) {
    color: var(--el-color-primary);
  }
  :deep(.splitpanes__splitter::before) {
    color: var(--el-color-primary);
  }
  .operation {
    height: 100%;
    :deep(.el-card__body) {
      padding: 0;
    }
    :deep(.el-form-item) {
      margin-bottom: 10px;
    }
    .colors {
      width: 98%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      .color {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        padding: 6px;
        border: var(--el-border);
        border-radius: 3px;
        width: 48%;
        cursor: pointer;
        &.active {
          border-color: var(--el-color-primary);
          box-shadow: var(--el-box-shadow);
        }
      }
    }
    ol {
      li {
        padding: 6px;
        color: var(--el-text-color-regular);
      }
    }
    .btn {
      margin-top: 20px;
      width: 100%;
      text-align: center;
    }
  }
}
</style>
