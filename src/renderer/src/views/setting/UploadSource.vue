<template>
  <div class="upload-source">
    <div>
      <ElAlert type="success" :closable="false">
        <template #title> 资源上传须知! </template>
        <p style="letter-spacing: 1.5px">
          软件免费提供超过120GB的素材资源包，包括图片、背景、视频、音频、表情包、背景音乐上百种字体等等。
          但由于服务器容量有限，网络流量费用等限制，需要你自行下载资源压缩包在此处上传，本软件会自动解析资源包匹配相应素材；
          下载地址请访问 MD Video 官网
          <ElLink type="primary" @click="opentUrl">https://mdvideo.wvovw.com</ElLink>
        </p>
      </ElAlert>
    </div>
    <div class="upload">
      <ElUpload
        ref="uploadRef"
        drag
        :show-file-list="false"
        :accept="'application/zip'"
        :before-upload="beforeUploadBgImage"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖拽此处 / <em>点击选择文件</em></div>
        <template #tip>
          <div class="el-upload__tip">只能上传.zip的压缩文件</div>
        </template>
      </ElUpload>
    </div>
    <div v-if="loading" class="loading">
      <h4>
        素材资源文件较大时，处理可能需要花费很多时间，请耐心等候，勿关闭软件窗口，你甚至可以去
        <ElText type="primary">喝杯茶....</ElText>
      </h4>
      <div class="tips">{{ loadingText }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessageBox, UploadInstance } from 'element-plus';
import { IUploadSources } from '@api/resource';
import { UploadFilled } from '@element-plus/icons-vue';
const uploadRef = ref<UploadInstance>();
const loading = ref(false);
const loadingText = ref('解压中...');
onMounted(() => {
  window.on?.('uploadSourceState', (_eve, arg) => {
    const { code, data = {} } = arg || {};
    if (code === 200 && data.status === 'doing') {
      loadingText.value = data.msg || '解析中...';
    } else {
      loadingText.value = '';
      loading.value = false;
    }
  });
});
const opentUrl = () => {
  window.invoke('openUrl', 'https://mdvideo.wvovw.com/guide/get-resource.html');
};
const beforeUploadBgImage = async (rawFile: any) => {
  const path = rawFile.path;
  const allFiles = ['wvovw-s.zip', 'wvovw-m.zip', 'wvovw-l.zip', 'wvovw.zip'];
  const filename = rawFile.name;
  if (!allFiles.includes(filename)) {
    ElMessageBox({
      type: 'warning',
      message: '请上传软件指定的资源包'
    });
    return;
  }
  console.log(rawFile);
  loading.value = true;
  const { code, data } = await window.invoke<IUploadSources['req'], IUploadSources['res']>(
    'uploadSources',
    {
      payload: {
        path,
        filename
      }
    }
  );
  loading.value = false;
  if (code !== 200) {
    ElMessageBox.confirm(data.msg || '导入素材资源失败，请联系开发者!');
  } else {
    ElMessageBox.alert('素材资源导入成功，请在工作台中新建作品查看相关素材资源!');
  }

  return false;
};
</script>
<style lang="scss" scoped>
.upload-source {
  .upload {
    width: 60%;
    text-align: center;
    margin: 20px auto;
  }
  .loading {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: var(--el-mask-color);
    left: 0;
    z-index: 1000;
    flex-direction: column;
    h4 {
      width: 800px;
      color: var(--el-text-color-primary);
    }
    .tips {
      width: 800px;
      color: var(--el-color-info);
    }
  }
}
</style>
