<template>
  <div class="personal">
    <div class="info">
      <label>用户名标识：</label>
      <span>{{ userInfo.id }}</span>
    </div>
    <div class="info">
      <label>资源路径：</label>
      <span>{{ resourcePath || '请选择路径' }}</span>
      <span class="upload" @click="selectDirectory">修改</span>
    </div>
    <!-- 
    <div class="info">
      <label>邮箱：</label>
      <span>{{ userInfo.email }}</span>
    </div>
    <div class="info">
      <label>剩余AI语音数量：</label>
      <span>{{ userInfo.speech }}个字符</span>
    </div> -->

    <div class="info">
      <label>已合成AI语音数量：</label>
      <span>{{ userInfo.totalSpeech }} / {{ userInfo.allTotalSpeech }}个字符</span>
    </div>
    <div class="info">
      <label>版本：</label>
      <span>v{{ packageJson?.version || '---' }}</span>
    </div>
  </div>
  <ElAlert type="success" :closable="false" style="max-width: 800px;">
    <template #title> 素材资源须知! </template>
    <p style="letter-spacing: 1.5px">
      软件免费提供大量素材资源包(100GB)，包括图片、背景、视频、音频、表情包、背景音乐上百种字体等等。
      但由于服务器容量有限，网络流量费用等限制，需要你自行下载资源压缩包，解压之后在上方指定资源路径；
      下载地址请访问 MD Video 官网
      <ElLink type="primary" @click="opentUrl">https://mdvideo.wvovw.com</ElLink>
    </p>
  </ElAlert>
</template>
<script lang="ts" setup>
import { useAppConfigStore } from '@renderer/store';
import packageJson from '../../../../../package.json';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';
const appConfig = useAppConfigStore();
const { resourcePath, userInfo } = storeToRefs(appConfig);
onMounted(() => {
  document.querySelector('#folderInput')?.addEventListener('change', (e) => {
    const files = e.target?.files; // 获取所有被选择的文件或文件夹
    if (!files || !files[0]) return; // 防止没有选择任何内容时发生错误
    const dirName = (files[0].webkitRelativePath as string).split('\\')[0];
    const paths = (files[0].path as string).split('\\');
    let i = paths.findIndex((c) => c === dirName);
    if (i !== -1) {
      i = paths.length - 2;
    }
    const dir = paths.slice(0, i).join('\\');
    console.log(dir);
    if (dir) {
      appConfig.resourcePath = dir;
      appConfig.$patch({
        resourcePath: dir
      });
      ElMessage.success('保存成功！');
    }
  });
});
const opentUrl = () => {
  window.invoke('openUrl', 'https://mdvideo.wvovw.com/guide/get-resource.html');
};
const selectDirectory = async () => {
  const paths = await window.invoke('selectDirectory', {});
  const dir = paths?.[0];
  if (dir) {
    appConfig.resourcePath = dir;
    appConfig.$patch({
      resourcePath: dir
    });
    ElMessage.success('保存成功！');
  }
};
</script>

<style lang="scss" scoped>
.personal {
  width: 80%;
  margin: 20px;
  .info {
    margin-top: 10px;
    label {
      display: inline-block;
      width: 150px;
      text-align: right;
      color: var(--el-text-color-regular);
    }
    span {
      margin-left: 20px;
      color: var(--el-text-color-secondary);
    }
  }
  .upload {
    color: var(--el-color-primary) !important;
    font-size: smaller;
    cursor: pointer;
    #folderInput {
      opacity: 0;
      position: absolute;
      width: 80px;
    }
  }
}
</style>
