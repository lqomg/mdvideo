<template>
  <ElCard class="operation">
    <template #header>主题与设置</template>
    <ElForm style="padding: 10px" label-width="80" size="small">
      <ElFormItem label="主题风格">
        <div class="colors">
          <div
            v-for="(color, i) in ColorSchemes"
            :key="color.name"
            :class="`color ${colorIndex === i ? 'active' : ''}`"
            @click="colorIndex = i"
          >
            <div
              v-for="c in color.colors"
              :key="c"
              :style="{
                height: '10px',
                width: '100%',
                background: c
              }"
            ></div>
          </div>
        </div>
      </ElFormItem>
      <ElFormItem label="视频类型">
        <ElRadioGroup v-model="videoType">
          <ElRadio label="horizontal">
            <div style="display: flex; align-items: center">
              <span style="margin-right: 10px">横版 &nbsp;</span>
              <div
                style="
                  box-shadow: var(--el-box-shadow);
                  border: var(--el-border);
                  width: 30px;
                  height: 20px;
                "
              ></div>
            </div>
          </ElRadio>
          <ElRadio label="vertical">
            <div style="display: flex; align-items: center">
              <span style="margin-right: 10px">竖版 &nbsp;</span>
              <div
                style="
                  box-shadow: var(--el-box-shadow);
                  border: var(--el-border);
                  width: 20px;
                  height: 30px;
                "
              ></div></div
          ></ElRadio>
        </ElRadioGroup>
      </ElFormItem>
    </ElForm>
    <ElDivider></ElDivider>
    <ol>
      <li>
        支持大部分Markdown语法的转化，具体效果需
        <strong>点击一键转换</strong> 生成相关视频并做微调；
      </li>
      <li>目前此功能处于实验阶段，你暂时不可以在此页面改变元素的相关属性，均使用默认值。</li>
      <li>将在后续的版本陆续支持属性编辑和即时预览功能</li>
      <li>问题反馈和优化建议请加官方QQ群: 576301295 或邮箱 2065367606@qq.com</li>
    </ol>
    <div class="btn">
      <ElButton type="primary" :disabled="text.trim() === ''" size="large" @click="onSubmit">
        点 击 一 键 转 换</ElButton
      >
    </div>
  </ElCard>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import JSON from './text.txt?raw';

import { ColorSchemes } from './contanst';
const text = ref(JSON);
const videoType = ref('horizontal');
const colorIndex = ref(0);
const onSubmit = () => {};
</script>
<style lang="scss" scoped>
.operation {
  height: 100%;
  :deep(.el-card__body) {
    padding: 0;
  }
  :deep(.el-form-item) {
    margin-bottom: 10px;
  }
  .colors {
    width: 98%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .color {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      padding: 6px;
      border: var(--el-border);
      border-radius: 3px;
      width: 48%;
      cursor: pointer;
      &.active {
        border-color: var(--el-color-primary);
        box-shadow: var(--el-box-shadow);
      }
    }
  }
  ol {
    li {
      padding: 6px;
      color: var(--el-text-color-regular);
    }
  }
  .btn {
    margin-top: 20px;
    width: 100%;
    text-align: center;
  }
}
</style>
