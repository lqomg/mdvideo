<template>
  <div v-if="isUpdate" class="progress">
    <div class="content">
      <div class="title">正在下载应用最新版本: {{ appName }}</div>
      <ElProgress type="circle" :percentage="percent" :width="200">
        <template #default="{ percentage }">
          <span class="percentage-value">{{ percentage }}%</span>
          <span class="percentage-label">当前更新进度</span>
        </template>
      </ElProgress>
      <span class="percentage-label"
        >也可以添加QQ群 <strong>576301295</strong>，在群文件中快速获取最新版本</span
      >
    </div>
  </div>
  <router-view />
</template>
<script setup lang="ts">
import { UPDATE_MESSAGE_STATUS } from '@api/contanst';
import { ElMessageBox, ElNotification } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useAppConfigStore } from './store/modules/appConfig';
const isUpdate = ref(false);
const percent = ref(0);
const appName = ref('');
const version = ref('');
const appConfigStore = useAppConfigStore();
const checkUpdater = () => {
  window.invoke('checkForUpdate', { updateUrl: appConfigStore.updateUrl });
  window.on('updateMessage', (_event: any, text: any) => {
    const { code, message } = text;
    console.log(text);
    switch (code) {
      case UPDATE_MESSAGE_STATUS.UPDATE:
        version.value = message?.version;
        appName.value = message?.path;
        isUpdate.value = true;
        break;
      case UPDATE_MESSAGE_STATUS.ERROR:
        isUpdate.value = false;
        ElNotification({
          type: 'error',
          message: '请联系管理员',
          title: '自动更新失败'
        });
        break;
      case UPDATE_MESSAGE_STATUS.DOWNLOAD:
        isUpdate.value = false;
        ElMessageBox.confirm(`下载完成，即将重新安装更新软件！`, '提示', {
          showCancelButton: false,
          showClose: false
        })
          .then(() => {
            window.invoke('isUpdateNow', {});
          })
          .catch(() => {
            window.invoke('isUpdateNow', {});
          });
        break;
      default:
        break;
    }
  });
  window.on('downloadProgress', (_event: any, progressObj: any) => {
    percent.value = Number((progressObj?.percent || 0).toFixed(1));
  });
};

onMounted(() => {
  setTimeout(checkUpdater, 10000);
});
</script>
<style scoped lang="scss">
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}
.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}
.progress {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: #fff;
    border-radius: 10px;
    padding: 50px 10px;
    .title {
      color: #000;
      font-weight: bold;
      letter-spacing: 1.5px;
      padding: 20px;
    }
  }
}
</style>
