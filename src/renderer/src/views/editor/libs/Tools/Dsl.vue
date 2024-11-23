<template>
  <div v-loading="loading" class="dsl-tool" :element-loading-text="loadingMsg">
    <div class="tips">
      支持但不限于抖音、快手、微视、西瓜视频、微博、皮皮虾、陌陌、哔哩哔哩等视频平台!
    </div>

    <ElInput v-model="textarea" :rows="6" type="textarea" placeholder="请再次输入短视频地址">
    </ElInput>

    <ElButton
      type="primary"
      :disabled="textarea.trim().length === 0"
      style="margin-top: 12px"
      @click="dslUrl"
      >解析视频</ElButton
    >
  </div>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { nextTick, ref } from 'vue';
import { uploadOnlineVideo } from '@renderer/api';
import axiosService from '@renderer/service/axiosService';
import { useEditorStore } from '@renderer/store';
// https://v.douyin.com/JWpm4Fd/
const textarea = ref('');
const editorStore = useEditorStore();
const loading = ref(false);
const loadingMsg = ref('');
const getUrl = (str: string) => {
  const reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
  const strValue = str.match(reg);
  if (strValue && strValue.length > 0) {
    return strValue[0];
  }
  return null;
};
const dslUrl = async () => {
  const url = getUrl(textarea.value) as string;
  if (!url) {
    ElMessage.error('请输入正确的地址');
  }
  try {
    loading.value = true;
    loadingMsg.value = '解析中，请稍等...';
    const res = await axiosService({
      url: `/tool/dslUrl`,
      method: 'post',
      data: {
        url: encodeURIComponent(url)
      }
    });
    const data = res.data;
    if (data && data.url) {
      loadingMsg.value = '解析完成，正在读取视频数据...';
      nextTick(() => {});
      const videoInfo = await uploadOnlineVideo(data.url);
      const { path, cover } = videoInfo || {};
      if (path && cover) {
        editorStore.addElement('md-video', {}, { src: path, cover });
      }
      loading.value = false;
      ElMessage.success('解析成功，已自动为你添加到当前场景中！');
    } else {
      loading.value = false;
      ElMessage.error('请输入正确的地址');
    }
  } catch (error) {
    loading.value = false;
    ElMessage.error('请输入正确的地址');
  }
};
</script>
<style lang="scss" scoped>
.dsl-tool {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .tips {
    font-size: 14px;
    color: var(--el-text-color-regular);
    margin: 10px 0;
  }
}
</style>
