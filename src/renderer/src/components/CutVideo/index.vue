<!-- eslint-disable vue/no-mutating-props -->
<template>
  <slot></slot>
  <ElDialog
    v-model="props.visiable"
    class="cutvideo-dialog"
    :fullscreen="true"
    :append-to-body="true"
    :z-index="100"
    :show-close="false"
  >
    <template #header> <span class="title">裁剪视频</span></template>
    <div id="tiny-player"></div>
    <div class="video-cut">
      <ElSlider
        v-model="videoInfo.clipTime"
        range
        :min="0"
        :max="videoInfo.duration"
        :marks="videoInfo.marks"
        :step="0.01"
      />
      <ElButton plain type="primary" size="small" @click="previewCutVideo">预览结果</ElButton>
    </div>
    <div v-loading="loading" style="margin-top: 30px" element-loading-text="裁剪中，请稍等...">
      <ElButton size="small" @click="close()">取 消</ElButton>
      <ElButton type="success" size="small" @click="cutVideo()">确认裁剪</ElButton>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { nextTick, watch, reactive, ref } from 'vue';
import TinyPlayer, { PlayerOptions } from 'tiny-player';
import { ElMessage, ElSlider } from 'element-plus';
import { ICutVideo } from '@api/resource';

const props = defineProps<{
  videoPath: string;
  visiable: boolean;
}>();
const loading = ref(false);
const videoInfo = reactive({ duration: 0, clipTime: [0, 0], marks: {} });
let player: TinyPlayer;
const emits = defineEmits<{
  (event: 'close'): void;
  (event: 'success', props: { path: string; cover: string; meta: any }): void;
}>();
const close = () => {
  player?.destroy?.();
  emits('close');
};

const previewCutVideo = () => {
  const [start, end] = videoInfo.clipTime;
  player.cutVideo(start, end);
  nextTick(() => player.play());
};

const cutVideo = async () => {
  const [start, end] = videoInfo.clipTime;
  loading.value = true;
  const { data } = await window.invoke<ICutVideo['req'], ICutVideo['res']>('cutVideo', {
    payload: {
      start,
      to: end,
      filePath: props.videoPath
    }
  });
  loading.value = false;
  const { path, cover, meta } = data || {};
  if (path && cover) {
    emits('success', { path, cover, meta });
  } else {
    ElMessage.warning('裁剪视频失败，请联系管理员！');
  }
};

const initPlayer = (options: PlayerOptions) => {
  player = new TinyPlayer(options);

  player.on('loadedmetadata', () => {
    videoInfo.duration = Number(player.duration.toFixed(1));
    videoInfo.clipTime = [0, videoInfo.duration];
    videoInfo.marks = { 0: '开始时间', [videoInfo.duration]: '结束时间' };
  });
};

watch(
  () => props.visiable,
  (v) => {
    if (v) {
      nextTick(() => {
        initPlayer({
          container: document.getElementById('tiny-player') as HTMLElement,
          src: props.videoPath,
          type: 'normal',
          loop: false,
          controlOptions: {
            playTime: true, // 是否显示播放时间
            volumeControl: false, // 是否显示音量控制条
            fullScreenControl: false, // 是否显示全屏按钮
            nativeControls: false // 是否使用原生控制条
          }
        });
      });
    } else {
      player?.destroy?.();
    }
  }
);
</script>
<style lang="scss">
.cutvideo-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  top: -20px;
  // background-image: url('../../assets/images/diagonal.png');
  background-repeat: repeat;
  .title {
    color: var(--el-text-color-secondary);
    letter-spacing: 2px;
    font-size: 18px;
  }
  .el-dialog__body {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .video-cut {
    width: 100%;
    min-width: 500px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    & > button {
      margin-left: 30px;
    }
  }
  #tiny-player {
    min-height: 200px;
    min-width: 200px;
    max-height: 500px;
    max-width: 600px;
    .tp-video {
      max-height: 500px;
    }
  }
}
</style>
