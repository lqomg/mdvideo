import { DefaultProjectInfo } from '@renderer/config/DataModel';
import { defineStore } from 'pinia';
import { nextTick } from 'vue';

export const usePreviewStore = defineStore('preview', {
  state() {
    return {
      isPlay: false,
      filePath: '',
      projectInfo: DefaultProjectInfo,
      showDownload: true
    };
  },
  actions: {
    playVideo(filePath: string, projectInfo: any) {
      this.filePath = filePath;
      this.projectInfo = projectInfo;
      nextTick(() => {
        this.isPlay = true;
      });
    },
    closeVideo() {
      this.filePath = '';
      this.isPlay = false;
    }
  }
});
