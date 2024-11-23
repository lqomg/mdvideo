<template>
  <ElAlert :type="'error'" :closable="false" style="margin: 8px; width: 96%; padding: 4px">
    <template #title>提示</template>
    <p style="letter-spacing: 2px">
      你还没有导入相关的素材资源包，本软件免费提供超过120GB的素材，10万+个素材资源，包括图片，视频，音频，表情包，字体，背景音乐等等。您可以在<ElText
        type="success"
        size="small"
        style="cursor: pointer"
        @click="() => router.push('/home/setting?name=resource')"
        >点击此处</ElText
      >中导入相关资源！让创作更简单！
    </p>
  </ElAlert>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
