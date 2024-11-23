<template>
  <MdPreview v-model="props.text" />
</template>
<script lang="ts" setup>
import MdPreview from '@renderer/components/Markdown/MdPreview/MdPreview';
const props = defineProps<{ text: string }>();
</script>

<style lang="scss" scoped>
.folder {
  margin-top: 10px;
  .info {
    padding: 6px 12px;
    font-size: 14px;
    letter-spacing: 2px;
    color: var(--el-text-color-primary);

    p {
      margin: 6px 0;
      margin-bottom: 10px;
    }
    pre {
      border-radius: 6px;
      padding: 2px 12px;
      margin: 0 12px;
      margin-bottom: 0;
      word-break: normal;
      letter-spacing: 2px;
      color: #a9b7c6;
      background-color: #161b22;
    }
  }
}
</style>
