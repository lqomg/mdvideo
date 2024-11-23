import { defineComponent, onBeforeUnmount } from 'vue';
import { prefix } from '@renderer/components/Markdown/MdEditor/config';
import bus from '@renderer/components/Markdown/MdEditor/utils/event-bus';
import { useProvidePreview, useExpansionPreview } from '@renderer/components/Markdown/MdEditor/composition';

import ContentPreview from '@renderer/components/Markdown/MdEditor/layouts/Content/ContentPreview';
import { MdPreviewProps } from '@renderer/components/Markdown/MdEditor/type';
import { mdPreviewProps as props, mdPreviewEmits as emits } from '@renderer/components/Markdown/MdEditor/props';

const MdPreview = defineComponent({
  name: 'MdPreview',
  props,
  emits,
  setup(props: MdPreviewProps, ctx) {
    // ID不允许响应式（解构会失去响应式能力），这会扰乱eventbus
    // eslint-disable-next-line vue/no-setup-props-destructure
    const { editorId, noKatex, noMermaid, noHighlight } = props;

    // provide 部分prop
    useProvidePreview(props);
    // 插入扩展的外链
    useExpansionPreview(props);
    // 卸载组件前清空全部事件监听
    onBeforeUnmount(() => {
      bus.clear(editorId);
    });

    return () => {
      return (
        <div
          id={editorId}
          class={[
            prefix,
            props.class,
            props.theme === 'dark' && `${prefix}-dark`,
            `${prefix}-previewOnly`
          ]}
          style={props.style}
        >
          <ContentPreview
            modelValue={props.modelValue}
            onHtmlChanged={(html) => {
              if (props.onHtmlChanged) {
                props.onHtmlChanged(html);
              } else {
                ctx.emit('onHtmlChanged', html);
              }
            }}
            onGetCatalog={(list) => {
              if (props.onGetCatalog) {
                props.onGetCatalog(list);
              } else {
                ctx.emit('onGetCatalog', list);
              }
            }}
            mdHeadingId={props.mdHeadingId}
            noMermaid={noMermaid}
            sanitize={props.sanitize}
            noKatex={noKatex}
            formatCopiedText={props.formatCopiedText}
            noHighlight={noHighlight}
            previewOnly
          />
        </div>
      );
    };
  }
});

export default MdPreview;
