<template>
  <div v-loading="loading" class="text-props" element-loading-text="语音合成中">
    <div class="props-item">
      <h4 class="lib-title">字幕内容</h4>
      <ElInput v-model="propsValue.text" type="textarea" :rows="5" :max="100"></ElInput>
      <div class="font-align" style="border: none">
        <span class="tip">字体间距</span>
        <ElInputNumber v-model="commonStyle.letterSpacing" :step="4"></ElInputNumber>
      </div>
      <!-- <div class="font-align" style="border: none">
        <span class="tip">内间距</span>
        <ElInputNumber v-model="commonStyle.paddingTop" :step="10"></ElInputNumber>
      </div> -->
    </div>
    <div class="props-item">
      <h4 class="lib-title">AI配音</h4>
      <div v-if="propsValue.voiceSrc" class="audio-src">
        <audio :src="propsValue.voiceSrc" controls></audio>
      </div>

      <ElSpace>
        <ElButton size="small" type="primary" @click="dialogVisible = !dialogVisible"
          >AI配音、上传音频</ElButton
        >
        <ElButton
          type="danger"
          size="small"
          :disabled="!!propsValue.videoSrc"
          @click="propsValue.videoSrc = ''"
        >
          清空</ElButton
        >
      </ElSpace>
      <h4 v-if="appConfigStore.aiVioces?.length" class="lib-title">常用配音</h4>
      <ElSpace :wrap="true">
        <ElButton
          v-for="(item, index) in appConfigStore.aiVioces.slice(0, 4)"
          :key="index"
          size="small"
          @click="createNVoice(item)"
        >
          {{ item.label }} -{{ item.name }}
        </ElButton>
      </ElSpace>
    </div>

    <div class="props-item">
      <h4>
        字体配置<ElTooltip>
          <template #content>
            <div style="width: 300px">
              支持系统字体，请将需要的字体下载到电脑中，可以去mdvideo.wvovw.com下载安装需要的字体
            </div>
          </template>
          <el-icon><QuestionFilled /></el-icon>
        </ElTooltip>
      </h4>
      <div class="font-align" style="border: none">
        <span class="tip">字体</span>
        <ElSelectV2
          v-model="commonStyle.fontFamily"
          placement="left"
          popper-class="font-select-list"
          :style="{ width: '200px', fontFamily: commonStyle.fontFamily }"
          :options="fontFamilyList"
          @change="changeFontFamily"
        >
          <template #default="{ item }">
            <span
              :style="{
                display: 'inline-block',
                color: 'var(--el-text-color-secondary)',
                fontSize: '16px',
                fontFamily: item.value
              }"
              >{{ item.label }}</span
            >
          </template>
        </ElSelectV2>
      </div>
      <div class="font-align" style="border: none">
        <span class="tip">字体大小</span>
        <ElInputNumber v-model="commonStyle.fontSize" :step="5"></ElInputNumber>
      </div>
      <div class="font-align" style="border: none">
        <span class="tip">颜色背景</span>
        <div
          style="width: 150px; display: flex; align-items: center; justify-content: space-between"
        >
          <ElColorPicker
            v-model="commonStyle.color"
            size="large"
            show-alpha
            @active-change="(val:string | null) => onActiveChange('color', val || '')"
          ></ElColorPicker>
          <ElColorPicker
            v-model="commonStyle.backgroundColor"
            show-alpha
            size="large"
            @active-change="(val:string | null) => onActiveChange('backgroundColor', val || '')"
          ></ElColorPicker>
        </div>
      </div>

      <div class="font-align style">
        <ElTooltip content="加粗">
          <i
            class="iconfont icon-jiacu"
            :class="commonStyle.fontWeight === 'bold' ? 'active' : ''"
            @click="
              () =>
                emits('changeElement', {
                  commonStyle: {
                    ...commonStyle,
                    fontWeight: commonStyle.fontWeight === 'normal' ? 'bold' : 'normal'
                  }
                })
            "
          ></i>
        </ElTooltip>
        <ElTooltip content="斜体">
          <i
            class="iconfont icon-02xieti"
            :class="commonStyle.fontStyle === 'italic' ? 'active' : ''"
            @click="
              () =>
                emits('changeElement', {
                  commonStyle: {
                    ...commonStyle,
                    fontStyle: commonStyle.fontStyle === 'italic' ? 'normal' : 'italic'
                  }
                })
            "
          ></i>
        </ElTooltip>
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
    </div>
    <ElDivider content-position="left">高级选项(仅能生效一种)</ElDivider>
    <div class="props-item">
      <h4>
        <Space>
          文字渐变<ElCheckbox
            v-model="commonStyle.showFill"
            :disabled="!!commonStyle.dropShadow"
          ></ElCheckbox>
        </Space>
      </h4>

      <Space
        v-if="commonStyle.fill?.length && commonStyle.showFill"
        style="margin: 0 20px"
        :size="20"
      >
        <template v-for="(item, index) in commonStyle.fill" :key="index">
          <ElColorPicker
            v-model="commonStyle.fill[index]"
            show-alpha
            @active-change="(val:string | null) => onActiveChange(`fill.[${index}]`, val || '')"
          ></ElColorPicker>
        </template>
      </Space>
    </div>
    <div class="props-item">
      <h4>
        <Space>
          文字阴影
          <ElCheckbox
            v-model="commonStyle.dropShadow"
            :disabled="!!commonStyle.showFill"
          ></ElCheckbox>
        </Space>
      </h4>
      <template v-if="commonStyle.dropShadow">
        <div class="font-align" style="border: none">
          <span class="tip">阴影颜色</span>
          <ElColorPicker
            v-model="commonStyle.dropShadowColor"
            size="large"
            show-alpha
            @active-change="
              (value) =>
                emits('changeElement', {
                  commonStyle: {
                    ...commonStyle,
                    dropShadowColor: value
                  }
                })
            "
          ></ElColorPicker>
        </div>
        <div class="font-align" style="border: none">
          <span class="tip">模糊程度</span>
          <ElInputNumber
            v-model="commonStyle.dropShadowBlur"
            :disabled="true"
            :step="1"
            :min="0"
            :max="10"
          >
          </ElInputNumber>
        </div>
        <div class="font-align" style="border: none">
          <span class="tip">偏移距离</span>
          <ElInputNumber v-model="commonStyle.dropShadowDistance" :step="1" :min="-100" :max="100">
          </ElInputNumber>
        </div>
      </template>
    </div>
  </div>
  <ElDialog v-model="dialogVisible" class="subtitle-dialog" :append-to-body="true" :width="'70%'"
    ><AudioDialog v-bind="props" @close="closeAudioDialog()"></AudioDialog
  ></ElDialog>
</template>
<script setup lang="ts">
import { IMDElement } from '@renderer/types';
import { ref, toRefs, toRaw, nextTick, onMounted } from 'vue';
import AudioDialog from '@renderer/components/AudioVoice/index.vue';
import { useEditorStore, useAppConfigStore } from '@renderer/store';
import { VoiceList } from '@renderer/components/AudioVoice/contanst';
import { ElMessage, ElMessageBox } from 'element-plus';
import { createVoice } from '@renderer/api/createVoice';
import { set } from 'lodash';
import { FontFamilyList } from '../Text/constant';
import { getFontList } from '@renderer/style/loadFont';
const editorStore = useEditorStore();
const appConfigStore = useAppConfigStore();
// eslint-disable-next-line vue/no-setup-props-destructure
const props = defineProps<IMDElement>();
const emits = defineEmits(['changeElement']);
const dialogVisible = ref(false);
const { propsValue, commonStyle } = toRefs(props);
const loading = ref(false);
const fontFamilyList = ref<any[]>([]);
onMounted(() => {
  getFontList().then((list) => {
    const lFonts = list.map((font) => {
      return {
        label: font.fontName,
        value: font.id,
        path: font.fontFile
      };
    });
    fontFamilyList.value = FontFamilyList.concat(lFonts);
  });
});
const createNVoice = async (item: any) => {
  const { id, type, volume, speed } = toRaw(item);
  loading.value = true;
  try {
    const { data, message } = await createVoice({
      text: propsValue.value.text,
      voiceType: type,
      voiceId: id,
      voiceSpeed: speed,
      voiceVolume: volume
    });

    if (data && data.path) {
      propsValue.value.voiceSrc = data.path;
      propsValue.value.voiceDuration = data.duration;
      emits('changeElement', {
        duration: Math.ceil(propsValue.value.voiceDuration)
      });
      nextTick(() => {});
      ElMessage.success('合成音频成功');
    } else {
      ElMessageBox.alert(`合成音频失败:` + message);
    }
    loading.value = false;
  } catch (error) {
    console.error(error);
    ElMessageBox.alert(`合成音频失败` + error);
    loading.value = false;
  }
};

const changeFontFamily = (v) => {
  const fontFamily = fontFamilyList.value.find((f) => f.value === v);
  const props = toRaw(propsValue.value);
  emits('changeElement', {
    propsValue: {
      ...props,
      fontPath: fontFamily?.path || ''
    }
  });
};

const onActiveChange = (key: string, val: string) => {
  const style = toRaw(commonStyle.value);
  set(style, key, val);

  emits('changeElement', {
    commonStyle: {
      ...style
    }
  });
};

const closeAudioDialog = async () => {
  if (propsValue.value.voiceSrc && propsValue.value.voiceDuration) {
    const { voiceId, voiceSpeed, voiceVolume } = propsValue.value;
    const v = VoiceList.find((v) => v.id === voiceId);
    if (v) {
      const aiVioces = appConfigStore.aiVioces || [];
      const index = aiVioces.findIndex((a) => a.id === v.id);
      let count = 0;
      if (index !== -1) {
        count = (aiVioces[index].count || 0) + 1;
        aiVioces.splice(index, 1);
      }
      aiVioces.unshift({
        ...v,
        volume: voiceVolume,
        speed: voiceSpeed,
        count
      });
      appConfigStore.$patch({
        aiVioces: aiVioces
      });
    }
    emits('changeElement', {
      duration: Math.ceil(propsValue.value.voiceDuration)
    });
    nextTick(() => {});
  } else {
    emits('changeElement', {
      duration: 0
    });
  }
  editorStore.activeElementUUID = '';
  nextTick(() => {
    editorStore.activeElementUUID = props.uuid;
    dialogVisible.value = false;
  });
};
</script>
<style lang="scss" scoped>
.text-props {
  .audio-src {
    display: flex;
    flex-direction: column;
    :deep(audio) {
      width: 90%;
      height: 30px;
      margin: 10px auto;
      margin-bottom: 20px;
    }
  }
  .props-item {
    :deep(.el-select-dropdown__item) {
      text-align: center;
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
        width: 160px;
        padding-right: 6px;
      }
      :deep(.el-slider__button) {
        width: 10px;
        height: 10px;
      }
    }
    .font {
      text-align: center;
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
}
</style>
<style lang="scss">
.subtitle-dialog {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0 10px !important;
  }
}
</style>
