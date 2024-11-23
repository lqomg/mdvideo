<template>
  <div class="scene-set">
    <div class="background-set">
      <h4>背景设置</h4>
      <div
        :style="{
          ...getCommonStyle(editorStore.getActiveScene().commonStyle as any),
          border: 'var(--el-border)',
          width: '100%',
          height: '140px'
        }"
      ></div>
      <ElSpace :style="{ marginTop: '10px' }">
        <ElButton @click="deleteBg()">删除背景</ElButton>
        <ElUpload
          ref="uploadRef"
          :show-file-list="false"
          :accept="'image/*'"
          :before-upload="beforeUploadBgImage"
        >
          <template #trigger>
            <el-button type="primary">上传背景</el-button>
          </template>
        </ElUpload>
      </ElSpace>
    </div>
    <div class="color-select">
      <p>选择纯色</p>
      <ElSpace wrap>
        <div
          v-for="color in DefatltSceneColor"
          :key="color"
          class="color-item"
          :style="{ backgroundColor: color }"
          @click="changeBgColor(color)"
        ></div>
        <div>
          <label>自定义：</label><ElColorPicker v-model="bgColor"  @active-change="changeBgColor" />
        </div>
      </ElSpace>
    </div>
    <div class="trans-select">
      <p>转场持续时间</p>
      <ElInputNumber
        v-model="editorStore.getActiveScene().data.transDuration"
        :min="0"
        :step="0.5"
        :max="3"
      ></ElInputNumber>

      <p>转场动画</p>
      <ElSpace wrap justify-content="center" :size="12">
        <div v-for="trans in TransitionsName" :key="trans.value">
          <ElPopover
            popper-style="padding:10"
            placement="left"
            :offset="30"
            :hide-after="10"
            :disabled="trans.value === 'none'"
          >
            <ElImage
              v-if="trans.value !== 'none'"
              :src="TransitionsImageSrcMap[trans.value]"
              style="width: 100%; height: 80px"
            ></ElImage>
            <template #reference>
              <ElButton
                :type="editorStore.getActiveScene().data.transName === trans.value ? 'primary' : ''"
                size="small"
                style="width: 64px; cursor: pointer"
                @click="changeTrans(trans.value)"
                >{{ trans.label }}</ElButton
              >
            </template>
          </ElPopover>
        </div>
      </ElSpace>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useEditorStore } from '@renderer/store';
import { DefatltSceneColor, TransitionsImageSrcMap } from './constanst';
import type { UploadInstance, UploadRawFile } from 'element-plus';
import { ref, watch } from 'vue';
import { IUploadImage, IUploadImageType } from '@api/resource';
import { fileToBase64 } from '@renderer/utils';
import { TransitionsName, getCommonStyle } from '@renderer/config/DataModel';
const editorStore = useEditorStore();
const uploadRef = ref<UploadInstance>();
const changeBgColor = (color: string) => {
  editorStore.getActiveScene().commonStyle.backgroundColor = color;
  editorStore.getActiveScene().commonStyle.backgroundImage = '';
};
const bgColor = ref('');

watch(
  () => editorStore.getActiveScene().commonStyle.backgroundColor,
  (c) => {
    if (c !== bgColor.value) {
      bgColor.value = c;
    }
  },
  { immediate: true }
);

const beforeUploadBgImage = async (rawFile: UploadRawFile) => {
  const base64 = await fileToBase64(rawFile);
  const name = rawFile.name;
  const { data } = await window.invoke<IUploadImage['req'], IUploadImage['res']>('uploadImage', {
    payload: {
      file: base64 as any,
      type: IUploadImageType.Background,
      name,
      ext: name.slice(name.lastIndexOf('.') + 1)
    }
  });
  if (data && data.path) {
    editorStore.getActiveScene().commonStyle.backgroundImage = `${data.path}`;
  }
  return false;
};
const deleteBg = () => {
  editorStore.getActiveScene().commonStyle.backgroundImage = '';
};
const changeTrans = (value: string) => {
  editorStore.getActiveScene().data.transName = value;
};
</script>
<style lang="scss" scoped>
.scene-set {
  .background-set {
    h4 {
      color: var(--el-text-color);
      margin: 10px 6px;
      opacity: 0.8;
    }
  }
  .color-select {
    & > p {
      color: var(--el-text-color-secondary);
    }
    label {
      color: var(--el-text-color-secondary);
    }
    .color-item {
      width: 42px;
      height: 30px;
      border: var(--el-border);
      cursor: pointer;
    }
  }
  .trans-select {
    & > p {
      color: var(--el-text-color-secondary);
    }

    .trans-item {
      width: 76px;
      padding: 6px;
      border-radius: 2px;
      border: var(--el-border);
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--el-text-color-primary);
      &.active {
        background-color: var(--el-color-primary);
        color: var(--el-color-white);
      }
    }
  }
}
</style>
