<template>
  <div class="partition">
    <!-- <div v-if="isImage(props.ext)" style="width: 120px; height: 100px">
    <ElImage :src="props.path"></ElImage>
  </div> -->
    <Icon :name="getIconByExt(props.ext)"></Icon>
    <span class="title">{{ props.name }}</span>
  </div>
</template>
<script setup lang="ts">
import { getIconByExt, isImage } from './utils';
const props = defineProps<{
  ext: string;
  name: string;
  path: string;
}>();
</script>

<style scoped lang="scss">
.partition {
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-right: 12px;
  font-size: 16px;
  color: var(--el-text-color-primary);
  svg {
    font-size: 20px;
  }

  .title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre;
    padding-left: 6px;
    // direction: rtl;
    text-align: left;
  }
}
</style>
