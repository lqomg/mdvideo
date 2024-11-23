<template>
  <div class="audio-props">
    <div class="props-item">
      <h4 class="lib-title">音频</h4>
      <div v-loading="loading" class="src">
        <AVCircle
          :src="propsValue.src"
          :outline-width="0"
          :progress-width="5"
          :outline-meter-space="5"
          :playtime="true"
        ></AVCircle>
      </div>
      <ElSpace :size="10" style="margin-top: 10px">
        <ElUpload
          ref="uploadRef"
          :show-file-list="false"
          :accept="'audio/*'"
          :before-upload="beforeUploadAudio"
        >
          <template #trigger>
            <ElButton type="primary" size="small">替换音频</ElButton>
          </template>
        </ElUpload>
        <ElButton type="success" size="small" @click="onlineImage()">在线音频</ElButton>
      </ElSpace>
    </div>
    <!-- <div class="props-item">
      <h4 class="lib-title">设置</h4>
      <div class="public-props">
        <div class="public-props-item">
          <span class="tip">开始时间</span>
          <ElInputNumber v-model="propsValue.startTime"></ElInputNumber>
        </div>
        <div class="public-props-item">
          <span class="tip"
            >持续时长<ElTooltip content="单位是秒(s);持续时间为0时，取视频开始时间到视频结束">
              <i class="iconfont icon-question-circle"></i></ElTooltip
          ></span>
          <ElInputNumber v-model="propsValue.duration"></ElInputNumber>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script setup lang="ts">
import { uploadAudio } from '@renderer/api';
import { IMDElement } from '@renderer/types';
import { ElMessageBox, UploadRawFile } from 'element-plus';
import { ref, toRefs } from 'vue';
import { AVWaveform, AVCircle, AVLine } from 'vue-audio-visual';
// eslint-disable-next-line vue/no-setup-props-destructure
const props = defineProps<IMDElement>();
const { propsValue, commonStyle } = toRefs(props);
const loading = ref(false);
const onlineImage = () => {
  ElMessageBox.prompt('在线的音频地址', '在线音频', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPlaceholder: '在此输入地址,以mp3|wav|ogg结尾',
    inputPattern: /^(http|https):\/\/.*\.(mp3|wav|ogg)$/i,
    inputErrorMessage: '地址存在错误'
  }).then(({ value }) => {
    propsValue.value.src = value;
  });
};

const beforeUploadAudio = async (rawFile: UploadRawFile) => {
  loading.value = true;
  try {
    const data = await uploadAudio(rawFile, 'audio');
    loading.value = false;
    if (data && data.path) {
      propsValue.value.src = data.path;
      propsValue.value.startTime = 0;
      propsValue.value.duration = data.duration;
    }
  } catch (error) {
    ElMessageBox.alert(error);
    loading.value = false;
  }
  return false;
};
</script>
<style lang="scss" scoped>
.audio-props {
  .src {
    display: flex;
    flex-direction: column;
    :deep(audio) {
      width: 100%;
      height: 40px;
    }
    :deep(canvas) {
      margin: 0 auto;
    }
  }
}
</style>
