<template>
  <div class="preview" :class="markdown.status !== EStatus.SUCCESS ? 'preview-doing' : ''">
    <Status :status="markdown.status"></Status>
    <PreviewScene
      :scene="markdown.scene"
      :project-info="projectInfo"
      :scale="0.19"
      :is-playing="isPlaying"
      :play-current-time="playCurrentTime"
    ></PreviewScene>
    <div :class="`tools ${markdown.status !== EStatus.SUCCESS ? 'disabled' : ''}`">
      <div class="play" @click="previewVideo()">
        <i :class="!isPlaying ? 'icon-Play iconfont' : 'icon-pause iconfont'"></i>
      </div>
      <ElProgress class="process" :percentage="percentage" :show-text="false"></ElProgress>
      <div class="time-label">
        {{ getVideoTime(playCurrentTime) }} / {{ getVideoTime(markdown.scene.data?.duration) }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { IMDProjectInfo } from '@api/types';
import PreviewScene from '@renderer/components/PreviewScene/index.vue';
import { EStatus, MarkdownProps } from './core/MarkdownManager';
import Status from './Status.vue';
import { watch, computed, ref, toRefs } from 'vue';
import { useMarkdownStore } from '@renderer/store/modules/markdown';
import { sleep } from '@renderer/utils';

const props = defineProps<{
  markdown: MarkdownProps;
  projectInfo: IMDProjectInfo;
}>();
const { markdown, projectInfo } = toRefs(props);
const getVideoTime = (time: number) => {
  time = Math.ceil(time);
  const m = Math.floor(time / 60);
  const s = Math.ceil(time % 60);
  return `${m > 0 ? (m > 9 ? m : '0' + m) : '00'}:${s > 9 ? s : '0' + s}`;
};
const markdownStore = useMarkdownStore();
watch(
  () => [props.markdown.isNeedPlay, markdownStore.autoPlay],
  (v) => {
    if (v[0] && v[1]) {
      previewVideo();
    }
  }
);
const isPlaying = ref(false);
const playCurrentTime = ref(0);
const percentage = computed(() => {
  const duration = markdown.value.scene?.data?.duration || 0;
  const p = Math.ceil((playCurrentTime.value / duration) * 100);
  return p > 100 ? 100 : p;
});
let timer: any;
const previewVideo =async () => {
  if (!props.markdown.scene) {
    return;
  }
  const sceneDuration = props.markdown.scene.data.duration;
  const n = 17;
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value === false) {
    clearInterval(timer);
    return;
  }
  let count = 0;
  playCurrentTime.value = 0;
  timer = setInterval(() => {
    count = Number((count + n / 1000).toFixed(10));
    playCurrentTime.value = count;
    if (playCurrentTime.value >= sceneDuration) {
      playCurrentTime.value = sceneDuration;
      isPlaying.value = false;
      clearInterval(timer);
    }
  }, n);
};
</script>
<style lang="scss" scoped>
.preview {
  display: flex;
  align-items: center;
  flex-direction: column;
  min-height: 240px;

  justify-content: center;
  margin: 16px 0;
  border-radius: 4px;
  border-bottom: 1px solid var(--el-border-color);

  &.preview-doing {
    .preview-scene {
      outline: 5px solid #e6e23c24;
    }
  }
  .doing {
    width: 100%;
    height: 100%;
    display: flex;
    flex: 1;
    opacity: 0.8;
    // background-image: url('../../assets/images/diagonal.png');
    .el-progress {
      width: 90%;
      margin: 0 auto;
    }
  }
  .tools {
    width: 90%;
    padding: 6px;
    margin: 10px auto;
    background-color: #f6f4f17a;
    // background-image: url('../../assets/images/diagonal.png');
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    :deep(.el-progress-bar__inner) {
      transition: none !important;
    }
    .disabled {
      opacity: 0.5;
      pointer-events: none;
    }
    .play {
      width: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      border: 1px solid var(--el-border-color);
      height: 30px;
      border-radius: 50%;
      background-color: #ccc;
      cursor: pointer;
      i {
        font-size: 20px;
      }
    }
    .time-label {
      width: 120px;
    }
    .process {
      flex: 1;
      margin: 0 20px;
    }
  }
}
</style>
