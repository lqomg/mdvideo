<template>
  <ElTabs v-model="tabsActive" tab-position="left">
    <ElTabPane label="AI配音" name="ai">
      <div class="ai">
        <div class="ai-role">
          <ElTabs v-model="activeVoice">
            <ElTabPane
              v-for="voiceType in VoiceType"
              :key="voiceType"
              :name="voiceType"
              :label="VoiceTypeLabel[voiceType]"
              class="voice-panel"
            >
              <div
                v-for="voice in voiceList"
                :key="voice.id"
                class="voice-item"
                :class="[
                  voice.id === propsValue.voiceId && voice.type === propsValue.voiceType
                    ? 'active'
                    : ''
                ]"
                @click="selectVoice(voice)"
              >
                {{ voice.name }} - {{ voice.label }}
              </div>
            </ElTabPane>
          </ElTabs>
        </div>
        <div class="ai-text">
          <div class="tip">
            左侧选择声音角色,在下面输入相关文案,点击“合成语音”提交文本即可合成语音。（单句文本不超过{{
              maxLen
            }}字）
          </div>
          <ElInput
            v-model="propsValue.text"
            type="textarea"
            placeholder="请在此输入需要合成的语音文本"
            :rows="10"
          ></ElInput>
          <div class="config">
            <div class="label">语速</div>
            <ElSlider v-model="propsValue.voiceSpeed" size="small" show-input :min="-2" :max="6" />
          </div>
          <div class="config">
            <div class="label">音量</div>
            <ElSlider v-model="propsValue.voiceVolume" size="small" show-input :min="0" :max="10" />
          </div>
          <div class="action">
            <ElButton v-loading="loading" type="primary" @click="onSubmit()">合成语音</ElButton>
            <ElButton type="text" disabled
              >你还可以输入{{ maxLen - (propsValue.text?.length || 0) }}字符</ElButton
            >
          </div>
        </div>
      </div>
    </ElTabPane>
    <ElTabPane label="上传" name="upload">
      <div class="upload">
        <ElUpload
          ref="uploadRef"
          style="width: 90%"
          drag
          :show-file-list="false"
          :accept="'audio/*'"
          :before-upload="beforeUploadAudio"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">将文件拖拽此处 <em>点击选择文件</em></div>
          <template #tip>
            <div class="el-upload__tip">只能上传.zip的压缩文件</div>
          </template>
        </ElUpload>
      </div>
    </ElTabPane>
  </ElTabs>
  <ElDivider></ElDivider>
  <div class="opeartion">
    <div>
      <div v-if="propsValue.voiceSrc" class="audio-play">
        <label>点击试听: &nbsp;</label>
        <audio controls>
          <source :src="propsValue.voiceSrc" type="audio/mpeg" />
          Your browser does not support this audio format.
        </audio>
      </div>
    </div>
    <ElSpace>
      <ElButton @click="onCancel()">清空音频并关闭</ElButton>
      <ElButton type="primary" @click="onSure()">确 认</ElButton>
    </ElSpace>
  </div>
</template>
<script setup lang="ts">
import { toRefs, ref, computed, toRaw, nextTick } from 'vue';
import { IMDElement } from '@renderer/types';
import { VoiceType, VoiceTypeLabel, VoiceList } from './contanst';
import { ElMessage, ElMessageBox, UploadRawFile } from 'element-plus';
import { uploadAudio } from '@renderer/api';
import { createVoice } from '@renderer/api/createVoice';
const maxLen = ref(150);
const props = defineProps<IMDElement>();
const emits = defineEmits(['close']);
const { propsValue } = toRefs(props);
const activeVoice = ref('common');
const tabsActive = ref('ai');
const voiceList = computed(() => {
  return VoiceList.filter((v) => v.vType === activeVoice.value);
});
const selectVoice = (voice: any) => {
  propsValue.value.voiceType = voice.type;
  propsValue.value.voiceId = voice.id;
};
const loading = ref(false);
const onSubmit = async () => {
  const { voiceType, voiceId, voiceSpeed, voiceVolume, text } = toRaw(propsValue.value);
  loading.value = true;

  const { data, message } = await createVoice({
    text,
    voiceType,
    voiceId,
    voiceSpeed,
    voiceVolume
  });
  if (data && data.path && data.duration) {
    propsValue.value.voiceSrc = '';
    nextTick(() => {
      propsValue.value.voiceSrc = data.path;
      propsValue.value.voiceDuration = data.duration;
    });
    ElMessage.success('AI语音合成完成！');
  } else {
    ElMessage.warning(message);
  }
  loading.value = false;
};
const onCancel = () => {
  propsValue.value.voiceSrc = '';
  propsValue.value.voiceDuration = 0;
  emits('close');
};
const onSure = () => {
  if (!propsValue.value.voiceSrc || !propsValue.value.voiceDuration) {
    ElMessageBox.confirm('没有生成任何字幕旁白/音频，确认关闭吗?').then(() => emits('close'));
  }
  emits('close');
};
const beforeUploadAudio = async (rawFile: UploadRawFile) => {
  loading.value = true;
  try {
    const data = await uploadAudio(rawFile, 'voice');
    loading.value = false;
    if (data && data.path) {
      propsValue.value.voiceSrc = data.path;
      propsValue.value.voiceDuration = data.duration;
    }
  } catch (error) {
    ElMessageBox.alert(error);
    loading.value = false;
  }
  return false;
};
</script>
<style lang="scss" scoped>
.ai {
  display: flex;
  .ai-role {
    flex-shrink: 0;
    width: 480px;
    background-color: var(--el-bg-color-page);
    :deep(.el-tabs__item) {
      padding: 0 10px;
    }

    .voice-panel {
      height: 220px;
      overflow-y: auto;
      display: flex;
      flex-wrap: wrap;
      margin: 0 10px;
      border: var(--el-border);
      background-color: var(--el-bg-color);
      align-content: flex-start;
      .voice-item {
        padding: 4px;
        margin: 4px 6px;
        flex-grow: 0;
        width: 130px;
        cursor: pointer;
        text-align: center;
        &.active {
          background-color: var(--el-bg-color-page);
          color: var(--el-color-primary);
        }
      }
    }
  }
  .ai-text {
    height: 500px;
    padding: 10px;
    .tip {
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }
    :deep(.el-textarea) {
      margin-top: 10px;
    }
    :deep(.el-textarea__inner) {
      border-radius: 0;
    }
    .config {
      display: flex;
      align-items: center;
      margin-top: 10px;
      .label {
        flex-grow: 0;
        width: 50px;
      }
    }
    .action {
      margin-top: 20px;
    }
  }
}
.upload {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.opeartion {
  display: flex;
  padding: 10px;
  padding-bottom: 20px;
  justify-content: flex-end;
  .audio-play {
    display: flex;
    align-items: center;
    margin-right: 50px;
    label {
      padding-left: 6px;
      color: var(--el-text-color-secondary);
    }
    audio {
      height: 30px;
    }
    audio:focus {
      outline: none;
    }
  }
}
</style>
