<template>
  <ElSpace class="tools" :size="20">
    <ElSpace :size="10">
      <ElButton
        :disabled="!editorStore.canUndo()"
        link
        size="small"
        @click="editorStore.editorRedo()"
      >
        <template #icon>
          <i class="iconfont icon-25chehui"></i>
        </template>
        重做
      </ElButton>
      <ElButton
        :disabled="!editorStore.canRedo()"
        link
        size="small"
        @click="editorStore.editorUndo()"
      >
        <template #icon> <i class="iconfont icon-26quxiaochehui"></i> </template>
        撤销
      </ElButton>
      <div class="scale-control">
        <ElTooltip content="比例缩小" placement="top">
          <i class="iconfont icon-minus" @click="changeScale('-')"></i>
        </ElTooltip>
        <span>{{ (editorStore.scale * 100).toFixed(0) }}%</span>
        <ElTooltip content="比例放大" placement="top">
          <i class="iconfont icon-plus" @click="changeScale('+')"></i>
        </ElTooltip>
      </div>
    </ElSpace>

    <ElDivider direction="vertical"></ElDivider>
    <ElSpace :size="30">
      <ElDropdown trigger="click" :teleported="false">
        <ElButton plain type="primary"
          >{{ projectInfo.width > projectInfo.height ? '横版视频' : '竖版视频' }} &nbsp;
          <i class="iconfont icon-caret-bottom"></i
        ></ElButton>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem @click="changeVideoWH(1920, 1080)"
              ><span class="videowh">横 版<span>16:9</span></span></ElDropdownItem
            >
            <ElDropdownItem @click="changeVideoWH(720, 1280)"
              ><span class="videowh">竖 版<span>9:16</span></span></ElDropdownItem
            >
          </ElDropdownMenu>
        </template>
      </ElDropdown>

      <ElSpace :size="20">
        <ElInput
          v-model="editorStore.projectInfo.title"
          style="width: 180px"
          size="small"
          placeholder="在此输入视频名称"
        ></ElInput>
        <ElButton
          type="primary"
          plain
          :disabled="loading || !editorStore.projectInfo.title"
          :loading="loading"
          @click="exportMp4(true)"
        >
          <template #icon>
            <i class="iconfont icon-save"></i>
          </template>
          保存视频
        </ElButton>

        <CreateVideoBtn
          size="default"
          :disabled="loading || !editorStore.projectInfo.title"
          :loading="loading"
          :show-icon="true"
          :type="'primary'"
          @create-video="(clear) => exportMp4(false, clear)"
        />
      </ElSpace>
    </ElSpace>
    <ElDivider direction="vertical"></ElDivider>
    <ElSpace :size="20">
      <div class="play">
        <ElTooltip :content="!editorStore.isPlaying ? '预览' : '暂停预览'">
          <i
            :class="['iconfont', !editorStore.isPlaying ? 'icon-play-circle' : 'icon-pause-circle']"
            @click="previewVideo()"
          ></i>
        </ElTooltip>
      </div>
      <ElDivider direction="vertical"></ElDivider>
      <div class="music">
        <ElTooltip :content="editorStore.projectInfo.audioName ? '更换背景音乐' : '设置背景音乐'">
          <i class="iconfont icon-MusicNote" @click="setMusic"></i>
        </ElTooltip>
        <span
          v-if="editorStore.projectInfo.audioName"
          :title="'已使用：' + editorStore.projectInfo.audioName"
          class="music-title"
          >{{ editorStore.projectInfo.audioName }}
        </span>
        <AVLine
          v-if="editorStore.projectInfo.audio"
          :src="editorStore.projectInfo.audio"
          :canv-height="20"
          :canv-width="120"
        ></AVLine>

        <ElTooltip :content="'清空背景音乐'">
          <i
            v-if="editorStore.projectInfo.audioName"
            class="iconfont icon-close"
            @click="clearBgm"
          ></i>
        </ElTooltip>
      </div>
    </ElSpace>
  </ElSpace>
  <ElDialog
    v-model="dialogVisiable"
    :close-on-click-modal="false"
    title="设置背景音乐"
    :destroy-on-close="true"
    :width="'60%'"
  >
    <div class="music-set">
      <ElUpload
        ref="uploadRef"
        :show-file-list="false"
        class="upload-music"
        :accept="'audio/*'"
        :before-upload="beforeUploadMusic"
      >
        <template #trigger>
          <ElButton type="success" size="small">上传本地音乐</ElButton>
        </template>
      </ElUpload>
      <Material
        class="material-wrap"
        :directory="path"
        :default-display-type="'partition'"
        :apply="applyMusic"

        @change-directory="(v) => (path = v)"
      />
    </div>
  </ElDialog>
</template>
<script setup lang="ts">
import { ICreatePage } from '@api/page';
import { useEditorStore } from '@renderer/store/modules/editor';
import { ElMessage, ElMessageBox, UploadRawFile } from 'element-plus';
import { storeToRefs } from 'pinia';
import { ref, toRaw } from 'vue';
import { getScenes } from './utils';
import { useTaskStore, useCommonStore, useAppConfigStore } from '@renderer/store';
import { TaskStates } from '@api/contanst';
import { sleep } from '@renderer/utils';
import { uploadAudio } from '@renderer/api';
import { AVLine } from 'vue-audio-visual';
import Material from '@renderer/components/Material/index.vue';
import CreateVideoBtn from '@renderer/components/CreateVideoBtn.vue';
import { watchDebounced } from '@vueuse/core';
const editorStore = useEditorStore();
const loading = ref(false);
const taskId = ref('');
const percentage = ref(2);
const videoSrc = ref('');
const dialogVisiable = ref(false);
const taskStore = useTaskStore();
const appConfigStore = useAppConfigStore();
const { resourcePath } = storeToRefs(appConfigStore);
const path = ref(resourcePath?.value + '/音乐');
const keyword = ref('');
const { projectInfo, projectScenes, id, markdown, activeElementUUID, isMarkdownSource } =
  storeToRefs(editorStore);
let timer: any;

const preDownloadFile = async () => {
  const nScenes = await getScenes(toRaw(projectScenes.value));
  const payload = {
    _id: id?.value || '',
    projectInfo: toRaw(projectInfo.value),
    scenes: nScenes,
    isMarkdownSource: toRaw(isMarkdownSource?.value),
    markdown: toRaw(markdown?.value)
  };
  window.invoke<ICreatePage['req'], ICreatePage['res']>('preDownload', {
    payload: payload
  });
};
const setMusic = () => {
  dialogVisiable.value = true;
  path.value = resourcePath?.value + '/音乐';
};
watchDebounced(
  activeElementUUID,
  (v) => {
    const ele = editorStore.getElementByUUID(v);
    const names = ['md-video', 'md-audio', 'md-image'];
    if (ele && names.includes(ele?.elName)) {
      if (ele.propsValue?.src?.startsWith('http')) {
        preDownloadFile();
      }
    }
  },
  { debounce: 4000, maxWait: 15000 }
);

const clearBgm = () => {
  editorStore.projectInfo.audio = '';
  editorStore.projectInfo.audioName = '';
  keyword.value = '';
};

const previewVideo = () => {
  editorStore.activeElementUUID = '';
  const n = 17;
  editorStore.isPlaying = !editorStore.isPlaying;
  if (editorStore.isPlaying === false) {
    clearInterval(timer);
    return;
  } else {
    editorStore.curSceneDuration = 0;
  }
  let count = editorStore.curSceneDuration;
  timer = setInterval(() => {
    count = Number((count + n / 1000).toFixed(10));
    editorStore.curSceneDuration = count;
    if (editorStore.curSceneDuration >= editorStore.getActiveScene()?.data.duration) {
      editorStore.curSceneDuration = 0;
      editorStore.isPlaying = false;
      clearInterval(timer);
    }
  }, n);
};
const changeScale = (t: string) => {
  if (t === '+' && editorStore.scale < 1) {
    editorStore.scale = parseFloat((editorStore.scale + 0.01).toFixed(2));
  } else if (editorStore.scale > 0) {
    editorStore.scale = parseFloat((editorStore.scale - 0.01).toFixed(2));
  }
};
const changeVideoWH = (w: number, h: number) => {
  projectInfo.value.width = w;
  projectInfo.value.height = h;
};
const beforeUploadMusic = async (rawFile: UploadRawFile) => {
  loading.value = true;
  try {
    const { path, name } = (await uploadAudio(rawFile)) as any;
    loading.value = false;
    if (path) {
      editorStore.projectInfo.audio = path;
      editorStore.projectInfo.audioName = name;
      dialogVisiable.value = false;
      ElMessage.success('设置成功!');
    }
  } catch (error: any) {
    ElMessageBox.alert(error);
    loading.value = false;
  }
  return false;
};
const applyMusic = (item: any) => {
  if (item?.ext === 'mp3' && item?.path) {
    editorStore.projectInfo.audioName = item?.name;
    editorStore.projectInfo.audio = item?.path;
    ElMessage.success('使用成功!');
    dialogVisiable.value = false;
  } else {
    ElMessage.warning('文件类型不支持!');
  }
  return true;
};

const exportMp4 = async (isSave = false, clarity = 'low') => {
  console.log({
    id: id?.value,
    projectInfo: toRaw(projectInfo.value),
    scenes: toRaw(projectScenes.value),
    isMarkdownSource: isMarkdownSource?.value,
    markdown: markdown?.value
  });
  const hasTask = taskStore.tasks.find((task) => task.videoId === editorStore.id);
  if (hasTask && (!hasTask.states || hasTask.states === TaskStates.Waiting)) {
    ElMessageBox({
      title: '提示',
      type: 'warning',
      message: '存在相同的导出任务正在进行中，请等待当前任务完成再操作',
      appendTo: 'body'
    });
    return;
  }
  const nScenes = await getScenes(toRaw(projectScenes.value));
  const payload = {
    _id: id?.value || '',
    isSave,
    projectInfo: toRaw(projectInfo.value),
    scenes: nScenes,
    isMarkdownSource: toRaw(isMarkdownSource?.value),
    markdown: toRaw(markdown?.value),
    clarity
  };
  loading.value = true;
  try {
    const { data } = await window.invoke<ICreatePage['req'], ICreatePage['res']>('createPage', {
      payload: payload
    });
    await sleep(1000);
    loading.value = false;
    if (data.taskId && data.videoId) {
      taskId.value = data.taskId;
      editorStore.id = data.videoId;
      percentage.value = 0;
      videoSrc.value = '';
    }
    if (isSave && data.videoId) {
      editorStore.id = data.videoId;
      ElMessage.success('保存成功!');
    } else {
      ElMessageBox({
        title: '提示',
        type: 'success',
        appendTo: 'body',
        message: '新建导出任务成功，请在右上角任务列表查看进度'
      });
    }
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
<style lang="scss">
.music-set {
  display: flex;
  flex-direction: column;
  position: relative;
  max-height: 520px;
  min-height: 260px;
  overflow: hidden;
  .music-class {
    margin-top: 16px;
  }
  .material-wrap {
    height: 480px;
  }
  .upload-music {
    position: absolute;
    right: 40px;
    top: 12px;
  }
}
</style>
<style lang="scss" scoped>
.tools {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  width: 100vw;
  padding: 10px 20px;
  justify-content: flex-start;
  align-items: center;
  background-color: var(--el-bg-color-page);
  z-index: 1000;
  box-shadow: 0px 1px 6px 2px var(--el-color-primary);
  border-top: var(--el-border-color);

  .scale-control {
    display: flex;
    width: 100px;
    align-items: center;
    justify-content: space-between;
    margin-left: 20px;
    color: var(--el-text-color-secondary);
    i {
      cursor: pointer;
      color: var(--el-text-color-primary);
      font-weight: bold;
    }
  }
  .videowh {
    width: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      color: var(--el-text-color-secondary);
      padding-left: 6px;
    }
  }
  .save-mp4 {
    display: flex;
    .mp4-cover {
      width: 200px;
    }
  }
  .play {
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 30px;
      color: var(--el-color-primary-light-5);
      cursor: pointer;
      &.icon-play-circle {
        color: var(--el-color-primary);
      }
    }
  }

  .music {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    :deep(audio) {
      position: absolute;
      right: 50px;
      width: 20px;
      height: 30px;
    }
    :deep(canvas) {
      margin: 0 10px;
      margin-right: 30px;
    }
    i.icon-MusicNote {
      font-size: 30px;
      color: var(--el-color-primary);
      cursor: pointer;
    }

    .music-title {
      color: var(--el-text-color-secondary);
      display: inline-block;
      max-width: 200px;
      overflow: hidden;
      white-space: pre;
      display: inline-block;
      text-overflow: ellipsis;
      padding-left: 10px;
    }
    .icon-close {
      color: var(--el-color-danger);
      cursor: pointer;
      padding: 0 12px;
      font-size: 22px;
    }
  }
}
</style>

<style lang="scss">
.progress-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  .el-dialog__body {
    width: 80%;
  }
}
</style>
