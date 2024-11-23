<template>
  <VirtualScroll class="lib-list" :list="props.list" :height="54" :buffer-count="8">
    <template #default="{ item }">
      <div class="audio-item">
        <div class="icon" @click.stop="playAudio(item)">
          <i
            :class="[
              'iconfont',
              playAudioInfo.id === item._id ? 'icon-pause-circle' : 'icon-play-circle'
            ]"
          ></i>
        </div>
        <div class="info">
          <span class="name"> {{ item.fileName }}</span>
          <span class="duration">
            <ElTag size="small" effect="plain">类别：{{ item.className }}</ElTag>
            <ElTag size="small">时长: {{ item.duration?.toFixed?.(1) || 'N/A' }}s</ElTag>
          </span>
        </div>
        <div class="apply">
          <ElButton
            type="primary"
            :disabled="editorStore.projectInfo.audioName === item.fileName"
            size="small"
            @click="applyMusic(item)"
            >使用此音乐</ElButton
          >
        </div>
      </div>
    </template>
  </VirtualScroll>
</template>
<script lang="ts" setup>
import { useEditorStore } from '@renderer/store';
import { ElMessage } from 'element-plus';
import { nextTick, reactive, ref, watch, onUnmounted, computed } from 'vue';
import { VirtualScroll } from 'vue3-virtual-scroll';
import 'vue3-virtual-scroll/dist/style.css';
const props = defineProps<{ list: any[] }>();

const emits = defineEmits<{
  (event: 'close'): void;
}>();
const resouceLists = ref<any[]>([]);
const Audios = ref(new Audio());
const editorStore = useEditorStore();
const playAudioInfo = reactive({
  id: '',
  src: ''
});
onUnmounted(() => {
  if (Audios.value) {
    Audios.value.pause();
  }
});

const applyMusic = (item: any) => {
  editorStore.projectInfo.audio = item.filePath;
  editorStore.projectInfo.audioName = item.fileName;
  ElMessage.success('使用成功!');
  emits('close');
};
const playAudio = (item: any) => {
  const { _id, filePath } = item;
  Audios.value.src = filePath;
  if (playAudioInfo.id === _id) {
    playAudioInfo.src = '';
    playAudioInfo.id = '';
    Audios.value.pause();
    return;
  }
  playAudioInfo.src = filePath;
  playAudioInfo.id = _id;
  Audios.value.load();
  nextTick(() => {
    Audios.value.play();
  });
};
watch(
  () => props.list,
  (v) => {
    resouceLists.value = v;
  },
  {
    immediate: true
  }
);
</script>

<style lang="scss" scoped>
.lib-list {
  margin-bottom: 10px;
  flex-grow: 0;
  flex-shrink: 1;
  min-height: 400px;
  :deep(.scroll-container__list) {
    padding-left: 0;
    padding-bottom: 0;
    list-style: none;
    padding-inline-start: 0;
  }

  .audio-item {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    border-bottom: var(--el-border);
    padding: 6px 0;
    cursor: pointer;
    &:hover {
      background-color: var(--el-bg-color-page);
    }
    .className {
      position: absolute;
    }
    .icon {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 6px 20px;
      color: var(--el-text-color-secondary);
      i {
        font-size: 28px;
      }
    }
    .info {
      display: flex;
      flex-shrink: 0;
      flex-grow: 1;
      align-items: center;
      .name {
        width: 300px;
        overflow: hidden;
        white-space: pre;
        display: inline-block;
        text-overflow: ellipsis;
        padding-bottom: 4px;
        color: var(--el-text-color-secondary);
      }
      .duration {
        margin-left: 20px;

        :deep(.el-tag) {
          margin-right: 6px;
          transition: none;
        }
      }
    }
    .apply {
      padding: 0 20px;
      padding-right: 40px;
    }
  }
}
</style>
