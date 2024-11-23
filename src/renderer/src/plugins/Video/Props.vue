<template>
  <div class="text-props">
    <div class="props-item">
      <h4 class="lib-title">视频</h4>
      <div v-loading="loading" class="src"><video :src="propsValue.src" controls></video></div>
      <ElSpace :size="10" style="margin-top: 10px; margin-bottom: 10px">
        <CutVideo
          :video-path="cutVideoInfo.videoPath"
          :visiable="cutVideoInfo.visiable"
          @close="cutVideoInfo.visiable = false"
          @success="(props) => cutVideoSuccess(props)"
        >
          <ElButton type="primary" size="small" @click="cutVideo()">裁 剪</ElButton>
        </CutVideo>

        <ElUpload
          ref="uploadRef"
          :show-file-list="false"
          :accept="'video/*'"
          :before-upload="beforeUploadVideo"
        >
          <template #trigger>
            <ElButton size="small">替 换</ElButton>
          </template>
        </ElUpload>
        <ElButton size="small" @click="onlineImage()">在线视频</ElButton>
      </ElSpace>
    </div>
    <div class="props-item">
      <h4 class="lib-title">设置</h4>
      <div class="public-props">
        <!-- <div class="public-props-item">
          <span class="tip">开始时间</span>
          <ElInputNumber v-model="propsValue.startTime"></ElInputNumber>
        </div>
        <div class="public-props-item">
          <span class="tip"
            >持续时长<ElTooltip content="单位是秒(s);持续时间为0时，取视频开始时间到视频结束">
              <i class="iconfont icon-question-circle"></i></ElTooltip
          ></span>
          <ElInputNumber v-model="propsValue.duration"></ElInputNumber>
        </div> -->
        <div class="public-props-item">
          <span class="tip">是否播放视频背景音乐</span>
          <ElCheckbox v-model="propsValue.bgAudio" size="large"></ElCheckbox>
        </div>
        <div class="public-props-item">
          <span class="tip">是否循环播放视频</span>
          <ElCheckbox v-model="propsValue.loop" size="large"></ElCheckbox>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { uploadVideo } from '@renderer/api';
import { IMDElement } from '@renderer/types';
import { ElMessage, ElMessageBox, UploadRawFile } from 'element-plus';
import { reactive, ref, toRefs } from 'vue';
import CutVideo from '@renderer/components/CutVideo/index.vue';
// eslint-disable-next-line vue/no-setup-props-destructure
const props = defineProps<IMDElement>();
const { propsValue, commonStyle } = toRefs(props);
const loading = ref(false);
const onlineImage = () => {
  ElMessageBox.prompt('在线的视频地址', '在线视频', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPlaceholder: '在此输入地址,以mp4结尾',
    inputPattern: /^(http|https):\/\/.*(mp4|MP4)$/,
    inputErrorMessage: '地址存在错误'
  }).then(({ value }) => {
    propsValue.value.src = value;
  });
};
const cutVideoInfo = reactive({
  videoPath: '',
  visiable: false
});

const cutVideo = () => {
  cutVideoInfo.videoPath = propsValue.value.src;
  cutVideoInfo.visiable = true;
};
const cutVideoSuccess = (props: { path: string; cover: string; meta: any }) => {
  const { path, cover, meta } = props;
  propsValue.value.src = path;
  propsValue.value.cover = cover;
  propsValue.value.startTime = 0;
  propsValue.value.duration = meta?.duration;
  ElMessage.success('裁剪成功,已自动替换原视频');
  cutVideoInfo.visiable = false;
  cutVideoInfo.videoPath = '';
};
const beforeUploadVideo = async (rawFile: UploadRawFile) => {
  loading.value = true;
  try {
    const data = await uploadVideo(rawFile);
    loading.value = false;
    if (data && data.path) {
      propsValue.value.src = data.path;
      propsValue.value.cover = data.cover;
      propsValue.value.startTime = 0;
      propsValue.value.duration = data.meta?.duration;
    }
  } catch (error) {
    ElMessageBox.alert(error);
    loading.value = false;
  }
  return false;
};
</script>
<style lang="scss" scoped>
.text-props {
  .props-item {
    :deep(.el-select-dropdown__item) {
      text-align: center;
    }
    .src {
      width: 100%;
      video {
        width: 100%;
        max-height: 200px;
      }
    }
    .font {
      text-align: center;
    }
    .font-align {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: var(--el-border);
      color: var(--el-text-color-secondary);
      margin-top: 10px;
      .tip {
        font-size: 12px;
        margin-left: 10px;
      }
      &.style {
        .iconfont {
          width: 65px;
          font-size: 34px;
        }
      }
      .iconfont {
        cursor: pointer;
        font-size: 38px;
        border-left: var(--el-border);
        width: 60px;
        text-align: center;
        &.active {
          background-color: var(--el-bg-color-page);
          color: var(--el-color-primary);
        }
      }
    }
  }
}
</style>
