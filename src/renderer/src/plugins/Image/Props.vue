<template>
  <div class="image-props">
    <div class="props-item">
      <h4 class="lib-title">图片</h4>
      <div class="src">
        <ElImage v-loading="loading" :src="propsValue.src" :fit="'cover'" style="height: 100px" />
      </div>
      <ElSpace :size="10" style="margin-top: 10px">
        <ElButton type="default" size="small" @click="visiableDialoag = true">裁剪</ElButton>
        <ElUpload
          ref="uploadRef"
          :show-file-list="false"
          :accept="'image/*'"
          :before-upload="beforeUploadBgImage"
        >
          <template #trigger>
            <ElButton type="primary" size="small">替换图片</ElButton>
          </template>
        </ElUpload>
        <ElButton type="success" size="small" @click="onlineImage()">在线图片</ElButton>
      </ElSpace>
    </div>
    <ElDivider />
    <div style="width: 100%; text-align: center">
      <ElButton size="small" type="primary" @click="editorStore.setBackground()"
        >设置图片为视频背景</ElButton
      >
    </div>
    <ElDivider />
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
  <ElDialog
    v-model="visiableDialoag"
    title="图片裁剪"
    :destroy-on-close="true"
    :append-to-body="true"
    :show-close="false"
    :width="640"
  >
    <div class="image-croper">
      <div class="croper">
        <VueCropper
          ref="cropperRef"
          :img="propsValue.src"
          :output-size="1"
          :output-type="'png'"
          :center-box="true"
          :original="false"
          :auto-crop="true"
          @real-time="realTime"
        ></VueCropper>
      </div>
      <div class="croper-operation">
        <ElButton @click="() => cropperRef.rotateRight?.()">旋转</ElButton>
        <ElButton @click="visiableDialoag = false">取消</ElButton>
        <ElButton v-loading="loading" type="primary" @click="saveImage()">保存</ElButton>
      </div>
    </div>
  </ElDialog>
</template>
<script setup lang="ts">
import { IUploadImage, IUploadImageType } from '@api/resource';
import { IMDElement } from '@renderer/types';
import { ElMessage, ElMessageBox, UploadRawFile } from 'element-plus';
import { ref, toRefs } from 'vue';
import 'vue-cropper/dist/index.css';
import { nanoid } from 'nanoid';
import { VueCropper } from 'vue-cropper';
import { uploadImage } from '@renderer/api/upload';
import { useEditorStore } from '@renderer/store';
// eslint-disable-next-line vue/no-setup-props-destructure
const props = defineProps<IMDElement>();
const { propsValue, commonStyle } = toRefs(props);
const editorStore = useEditorStore();
const visiableDialoag = ref(false);
const previews = ref<any>({});
const loading = ref(false);
const cropperRef = ref();
const onlineImage = () => {
  ElMessageBox.prompt('在线的图片地址', '在线图片', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPlaceholder: '在此输入地址,以jpeg、jpg、png或gif结尾',
    inputPattern: /^(http|https):\/\/.*(jpeg|jpg|png|gif)$/,
    inputErrorMessage: '地址存在错误'
  }).then(({ value }) => {
    propsValue.value.src = value;
  });
};
const saveImage = () => {
  cropperRef.value.getCropData?.(async (base64) => {
    const name = nanoid() + '.png';
    loading.value = true;

    const { data } = await window.invoke<IUploadImage['req'], IUploadImage['res']>('uploadImage', {
      payload: {
        file: base64 as any,
        type: IUploadImageType.Crop,
        name,
        ext: name.slice(name.lastIndexOf('.') + 1)
      }
    });
    loading.value = false;
    if (data && data.path) {
      propsValue.value.src = data.path;
      visiableDialoag.value = false;
    } else {
      ElMessage.warning('保存图片失败');
    }
  });
};
const beforeUploadBgImage = async (rawFile: UploadRawFile) => {
  loading.value = true;
  const data = await uploadImage(rawFile, IUploadImageType.LocalImage);
  loading.value = false;
  if (data && data.path) {
    propsValue.value.src = data.path;
  }
  return false;
};
const realTime = (data: any) => {
  previews.value = data;
};
</script>
<style lang="scss">
.image-croper {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;

  .croper {
    height: 400px;
    width: 500px;
    flex-shrink: 0;
  }
  .croper-operation {
    border-top: var(--el-border);
    padding: 10px;
    padding-right: 60px;
    width: 100%;
    margin-top: 10px;
    text-align: right;
  }
}
</style>
<style lang="scss" scoped>
.image-props {
  .props-item {
    :deep(.el-select-dropdown__item) {
      text-align: center;
    }
    margin-top: 10px;
    .src {
      width: 100%;
      border: var(--el-border);
      img {
        width: 100%;
        max-height: 100px;
      }
    }
  }
  .shadow-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    label {
      color: var(--el-text-color-secondary);
    }
    :deep(.el-slider) {
      width: 180px;
      padding-right: 6px;
    }
    :deep(.el-slider__button) {
      width: 10px;
      height: 10px;
    }
  }
}
</style>
