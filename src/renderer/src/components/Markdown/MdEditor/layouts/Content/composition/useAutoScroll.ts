import { inject, nextTick, onMounted, Ref, toRef, watch } from 'vue';
import scrollAuto, { scrollAutoWithScale } from '@renderer/components/Markdown/MdEditor/utils/scroll-auto';
import CodeMirrorUt from '../codemirror';
import { ContentProps } from '../props';

const useAutoScroll = (
  props: ContentProps,
  html: Ref<string>,
  codeMirrorUt: Ref<CodeMirrorUt | undefined>
) => {
  const editorId = inject('editorId') as string;

  let clearScrollAuto = () => {};
  let initScrollAuto = () => {};

  // 编译事件
  const rebindEvent = () => {
    clearScrollAuto();
    const cmScroller = document.querySelector<HTMLDivElement>('.cm-scroller');

    const previewEle = document.querySelector<HTMLElement>(
      `[id="${editorId}-preview-wrapper"][data-show="true"]`
    );
    const htmlEle = document.querySelector<HTMLElement>(
      `[id="${editorId}-html-wrapper"][data-show="true"]`
    );

    if (previewEle || htmlEle) {
      const scrollHandler = previewEle ? scrollAuto : scrollAutoWithScale;
      const cEle = previewEle || htmlEle;

      [initScrollAuto, clearScrollAuto] = scrollHandler(
        cmScroller!,
        cEle!,
        codeMirrorUt.value!
      );
    }

    if (props.scrollAuto) {
      initScrollAuto();
    }
  };

  watch(
    [
      html,
      toRef(props.setting, 'preview'),
      toRef(props.setting, 'htmlPreview'),
      toRef(props.setting, 'fullscreen'),
      toRef(props.setting, 'pageFullscreen')
    ],
    () => {
      nextTick(rebindEvent);
    }
  );

  // 切换滚动状态
  watch(
    () => props.scrollAuto,
    (sa) => {
      if (sa) {
        initScrollAuto();
      } else {
        clearScrollAuto();
      }
    }
  );

  onMounted(rebindEvent);
};

export default useAutoScroll;
