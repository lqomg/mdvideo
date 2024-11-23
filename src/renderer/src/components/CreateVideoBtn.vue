<template>
  <div class="create-video-btn">
    <ElButton
      :size="props.size"
      :disabled="props.disabled"
      :loading="props.loading"
      :type="props.type"
      @click="exportVideo"
    >
      <template v-if="props.showIcon" #icon>
        <i class="iconfont icon-download"></i>
      </template>
      导出视频</ElButton
    >
    <ElDialog v-model="dialogVisible" title="选择视频清晰度" :width="560" top="30vh">
      <ElRadioGroup v-model="clarity">
        <ElRadio :label="'low'">流畅(480P)</ElRadio>
        <ElRadio :label="'medium'">高清(960P)</ElRadio>
        <ElRadio :label="'high'">超清(1920P)</ElRadio>
        <ElRadio :label="''" :disabled="true">2k(暂不支持)</ElRadio>
      </ElRadioGroup>
      <br />
      <br />
      <ElAlert
        v-if="clarity === 'low'"
        type="success"
        title="以最快的速度合成视频，但视频清晰度会降低，建议在编辑预览时使用!"
        :closable="false"
      >
      </ElAlert>
      <ElAlert
        v-if="clarity === 'medium'"
        title=" 合成视频速度变慢，但视频清晰度显著提升!"
        type="info"
        :closable="false"
      >
      </ElAlert>
      <ElAlert
        v-if="clarity === 'high'"
        title="视频清晰度最高，但合成速度相对最慢，建议在最终生成视频时选择此项!"
        type="warning"
        :closable="false"
      >
      </ElAlert>
      <ElDivider />
      <div style="text-align: right; padding-bottom: 10px">
        <ElSpace :size="20">
          <ElButton @click="dialogVisible = false">取消</ElButton>
          <ElButton
            type="primary"
            @click="
              () => {
                dialogVisible = false;
                emits('createVideo', clarity);
              }
            "
            >确定</ElButton
          >
        </ElSpace>
      </div>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const dialogVisible = ref(false);
const clarity = ref('low');
const emits = defineEmits<{
  (event: 'createVideo', clarity: string): void;
}>();

const props = defineProps<{
  size: any;
  disabled?: boolean;
  showIcon?: boolean;
  type?: any;
  loading?: boolean;
}>();
const exportVideo = () => {
  dialogVisible.value = true;
  clarity.value = 'low';
};
</script>

<style scoped lang="scss">
.create-video-btn {
  width: auto;
}
</style>
