import { onMounted, onBeforeUnmount, ref } from 'vue';

export const useVideo = () => {
  // 获取 video 元素
  const videoRef = ref<HTMLVideoElement>();

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
    videoRef.value.currentTime = currentTime.value;
    videoRef.value.play();
    isPlaying.value = true;
  };

  const pause = () => {
    videoRef.value.pause();
    isPlaying.value = false;
  };

  // 更新当前时间和总时长
  const updateCurrentTime = () => {
    currentTime.value = videoRef.value.currentTime;
    duration.value = videoRef.value.duration;
  };

  // 监听 video 的 timeupdate 事件和 loadedmetadata 事件
  onMounted(() => {
    videoRef.value.addEventListener('timeupdate', updateCurrentTime);
    videoRef.value.addEventListener('loadedmetadata', updateCurrentTime);
  });

  // 在组件卸载前移除事件监听器
  onBeforeUnmount(() => {
    videoRef.value.removeEventListener('timeupdate', updateCurrentTime);
    videoRef.value.removeEventListener('loadedmetadata', updateCurrentTime);
  });

  return {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    showControls,
    play,
    pause
  };
};
