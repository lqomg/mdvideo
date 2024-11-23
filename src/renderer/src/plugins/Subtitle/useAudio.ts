import { onMounted, onBeforeUnmount, ref } from 'vue';

export const useAudio = () => {
  // 获取 video 元素
  const audioRef = ref<HTMLVideoElement>();

  // 控制播放状态
  const isPlaying = ref(false);

  // 当前时间
  const currentTime = ref(0);


  // 总时长
  const duration = ref(0);

  // 是否显示控制条
  const showControls = ref(false);


  // 播放/暂停
  const play = () => {
    audioRef.value.currentTime = currentTime.value;
    audioRef.value.play();
    isPlaying.value = true;
  };

  const pause = () => {
    audioRef.value.pause();
    isPlaying.value = false;
  };

  // 更新当前时间和总时长
  const updateCurrentTime = () => {
    currentTime.value = audioRef.value.currentTime;
    duration.value = audioRef.value.duration;
  };

  // 监听 video 的 timeupdate 事件和 loadedmetadata 事件
  onMounted(() => {
    audioRef.value.addEventListener('timeupdate', updateCurrentTime);
    audioRef.value.addEventListener('loadedmetadata', updateCurrentTime);
  });

  // 在组件卸载前移除事件监听器
  onBeforeUnmount(() => {
    audioRef.value.removeEventListener('timeupdate', updateCurrentTime);
    audioRef.value.removeEventListener('loadedmetadata', updateCurrentTime);
  });

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    showControls,
    play,
    pause
  };
};
