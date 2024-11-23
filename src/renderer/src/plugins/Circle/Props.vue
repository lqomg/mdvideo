<template>
  <div class="text-props">
    <div class="props-item">
      <div class="font-align" style="border: none">
        <span class="tip">颜色</span>
        <ElColorPicker
          v-model="commonStyle.backgroundColor"
          size="large"
          show-alpha
          :predefine="PredefineColors"
          @active-change="(val: string | null) => onActiveChange('backgroundColor', val || '')"
        ></ElColorPicker>
      </div>
      <div class="font-align" style="border: none">
        <span class="tip">透明度</span>
        <ElInputNumber
          v-model="commonStyle.opacity"
          :disabled="true"
          :step="0.1"
          :min="0"
          :max="1"
        />
      </div>
      <ElDivider>边框配置</ElDivider>
      <div class="font-align" style="border: none">
        <span class="tip">边框样式</span>
        <ElRadioGroup v-model="commonStyle.borderStyle">
          <ElRadioButton label="none">无</ElRadioButton>
          <ElRadioButton label="solid">实线</ElRadioButton>
          <!-- <ElRadioButton label="dashed">虚线</ElRadioButton> -->
        </ElRadioGroup>
      </div>
      <div class="font-align" style="border: none">
        <span class="tip">边框颜色</span>
        <ElColorPicker
          v-model="commonStyle.borderColor"
          size="large"
          show-alpha
          @active-change="(val: string | null) => onActiveChange('borderColor', val || '')"
        ></ElColorPicker>
      </div>
      <div class="font-align" style="border: none">
        <span class="tip">边框宽度</span>
        <ElInputNumber v-model="commonStyle.borderWidth" :step="5" :min="0" :max="500" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { IMDElement } from '@renderer/types';
import { toRefs, toRaw } from 'vue';
import { set } from 'lodash';
import { PredefineColors } from '../helper';

// eslint-disable-next-line vue/no-setup-props-destructure
const props = defineProps<IMDElement>();
const emits = defineEmits(['changeElement']);
const { commonStyle } = toRefs(props);

const onActiveChange = (key: string, val: string) => {
  const style = toRaw(commonStyle.value);
  set(style, key, val);
  emits('changeElement', {
    commonStyle: {
      ...style
    }
  });
};
</script>
<style lang="scss" scoped>
.text-props {
  .props-item {
    :deep(.el-select-dropdown__item) {
      text-align: center;
    }
  }
  .font-align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: var(--el-border);
    color: var(--el-text-color-secondary);
    margin-top: 10px;
    .tip {
      font-size: 14px;
      margin-left: 10px;
    }
    &.style {
      .iconfont {
        width: 130px;
        font-size: 34px;
      }
    }
    .iconfont {
      cursor: pointer;
      font-size: 38px;
      border-left: var(--el-border);
      width: 60px;
      text-align: center;
      &.active {
        background-color: var(--el-bg-color-page);
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
