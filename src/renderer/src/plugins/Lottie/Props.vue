<template>
  <div class="lottie-props">
    <div class="props-item">
      <h4 class="lib-title">预览</h4>
      <div v-if="props.propsValue.path" class="lottie-pre">
        <LottieAni :path="$getLocalUrl(props.propsValue.path)"></LottieAni>
      </div>
    </div>
    <ElDivider />
    <h4>其他动作</h4>
    <div class="lottie-list">
      <div
        v-for="lottie in propsValue.lottie?.actions"
        :key="lottie.id"
        class="lottie"
        @click="changeLottie(lottie)"
      >
        <LottieAni :path="getLottiePath(propsValue.lottie.id, lottie.id)"></LottieAni>
        <label>{{ lottie.title }}</label>
      </div>
    </div>
    <div class="props-item">
      <div class="shadow-item">
        <label>透明度</label>
        <ElSlider
          v-model="commonStyle.opacity"
          :disabled="true"
          size="small"
          :step="0.1"
          :min="0"
          :max="1"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { IMDElement } from '@renderer/types';
import LottieAni from '@renderer/components/LottieAni.vue';
import { ref, toRefs } from 'vue';

import { getLottiePath } from '@renderer/views/editor/libs/Lottie/utils';
// eslint-disable-next-line vue/no-setup-props-destructure
const props = defineProps<IMDElement>();
const { propsValue, commonStyle } = toRefs(props);
const changeLottie = (lottie: any) => {
  propsValue.value.path = getLottiePath(propsValue.value.lottie.id, lottie.id);
};
</script>

<style lang="scss" scoped>
.lottie-props {
  .props-item {
    :deep(.el-select-dropdown__item) {
      text-align: center;
    }
    margin-top: 10px;
    .lottie-pre {
      width: 100%;
      height: 100px;
      border: var(--el-border);
    }
  }

  .lottie-list {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    max-height: 480px;
    overflow-y: auto;
    .lottie {
      cursor: pointer;
      width: 80px;
      height: 92px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: var(--el-bg-color-page);
      margin-bottom: 10px;
      padding: 10px;
      label {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}
</style>
