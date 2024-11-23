<template>
  <slot></slot>
  <ElDialog
    v-model="previewStore.isPlay"
    class="playvideo-dialog"
    :fullscreen="true"
    :show-close="false"
    :z-index="9999999"
  >
    <template #header> </template>
    <div v-if="previewStore.filePath" :style="videoStyle">
      <video :src="previewStore.filePath" controls :autoplay="true" style="width: 100%"></video>
    </div>
    <div v-else>
      <ElEmpty :description="'未生成相关视频文件'"></ElEmpty>
    </div>
    <div style="margin-top: 10px">
      <ElButton type="primary" size="small" @click="previewStore.closeVideo()">关闭预览</ElButton>
      <ElButton v-if="previewStore.showDownload" type="success" size="small" @click="saveFile()"
        >本地下载</ElButton
      >
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { SaveVideoFile } from '@api/contanst';
import { usePreviewStore } from '@renderer/store/modules/preview';
import { computed } from 'vue';

const previewStore = usePreviewStore();

const videoStyle = computed(() => {
  const { width, height } = previewStore.projectInfo;
  if (width > height) {
    return {
      width: '960px',
      height: '540px',
      display: 'flex'
    };
  }
  return {
    width: 540 / 1.5 + 'px',
    height: 960 / 1.5 + 'px',
    display: 'flex'
  };
});
const saveFile = () => {
  window.invoke(SaveVideoFile, {
    filePath: previewStore.filePath,
    fileName: previewStore?.projectInfo?.title || previewStore?.projectInfo?.name
  });
};
</script>
<style lang="scss">
.playvideo-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('../../assets/images/diagonal.png');
  background-repeat: repeat;
  background-color: #606266;
  .el-dialog__body {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}
</style>
