import { onMounted, inject, ref } from 'vue';
import { configOption, prefix, screenfullUrl } from '@renderer/components/Markdown/MdEditor/config';
import { appendHandler } from '@renderer/components/Markdown/MdEditor/utils/dom';
import bus from '@renderer/components/Markdown/MdEditor/utils/event-bus';
import { CHANGE_FULL_SCREEN } from '@renderer/components/Markdown/MdEditor/static/event-name';
import { ToolbarProps } from './props';

export const useSreenfull = (props: ToolbarProps) => {
  const editorId = inject('editorId') as string;
  let screenfull = configOption.editorExtensions?.screenfull?.instance;
  const screenfullJs = configOption.editorExtensions?.screenfull?.js;
  // 是否组件内部全屏标识
  const screenfullMe = ref(false);

  // 触发器
  const fullscreenHandler = (status?: boolean) => {
    if (!screenfull) {
      bus.emit(editorId, 'errorCatcher', {
        name: 'fullscreen',
        message: 'fullscreen is undefined'
      });
      return;
    }

    if (screenfull.isEnabled) {
      screenfullMe.value = true;

      const targetStatus = status === undefined ? !screenfull.isFullscreen : status;
      if (targetStatus) {
        screenfull.request();
      } else {
        screenfull.exit();
      }
    } else {
      console.error('browser does not support screenfull!');
    }
  };

  // 挂载监听事件
  const onScreenfullEvent = () => {
    if (screenfull && screenfull.isEnabled) {
      screenfull.on('change', () => {
        if (screenfullMe.value || props.setting.fullscreen) {
          screenfullMe.value = false;
          props.updateSetting('fullscreen');
        }
      });
    }
  };

  const screenfullLoad = () => {
    // 复制实例
    screenfull = window.screenfull;
    // 重新监听
    onScreenfullEvent();
  };

  onMounted(() => {
    onScreenfullEvent();

    if (!screenfull) {
      const screenScript = document.createElement('script');
      screenScript.src = screenfullJs || screenfullUrl;
      screenScript.onload = screenfullLoad;
      screenScript.id = `${prefix}-screenfull`;

      appendHandler(screenScript, 'screenfull');
    }
  });

  onMounted(() => {
    // 注册切换全屏监听
    bus.on(editorId, {
      name: CHANGE_FULL_SCREEN,
      callback: fullscreenHandler
    });
  });

  return { fullscreenHandler };
};
