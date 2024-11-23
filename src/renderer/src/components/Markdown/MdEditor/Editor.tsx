import { defineComponent, onBeforeUnmount, reactive } from 'vue';
import { prefix } from '@renderer/components/Markdown/MdEditor/config';
import ToolBar from '@renderer/components/Markdown/MdEditor/layouts/Toolbar';
import Content from '@renderer/components/Markdown/MdEditor/layouts/Content';
import Footer from '@renderer/components/Markdown/MdEditor/layouts/Footer';
import bus from '@renderer/components/Markdown/MdEditor/utils/event-bus';

import { EditorProps, EditorContext } from '@renderer/components/Markdown/MdEditor/type';
import { getSlot } from '@renderer/components/Markdown/MdEditor/utils/vue-tsx';

import MdCatalog from '@renderer/components/Markdown/MdCatalog';

import {
  useOnSave,
  useProvide,
  useExpansion,
  useConfig,
  useCatalog,
  useExpose
} from './composition';

import { editorProps as props, editorEmits as emits } from './props';

const Editor = defineComponent({
  name: 'MdEditorV3',
  props,
  emits,
  setup(props: EditorProps, ctx: EditorContext) {
    // ID不允许响应式（解构会失去响应式能力），这会扰乱eventbus
    // eslint-disable-next-line vue/no-setup-props-destructure
    const { editorId, noKatex, noMermaid, noPrettier, noUploadImg, noHighlight } = props;

    const state = reactive({
      scrollAuto: props.scrollAuto
    });

    // 快捷键监听
    useOnSave(props, ctx);
    // provide 部分prop
    useProvide(props);
    // 插入扩展的外链
    useExpansion(props);
    // 部分配置重构
    const [setting, updateSetting] = useConfig(props, ctx);
    // 目录状态
    const catalogVisible = useCatalog(props);
    // 卸载组件前清空全部事件监听
    onBeforeUnmount(() => {
      bus.clear(editorId);
    });

    useExpose(props, ctx, catalogVisible, setting, updateSetting);

    return () => {
      const defToolbars = getSlot({ props, ctx }, 'defToolbars');
      const defFooters = getSlot({ props, ctx }, 'defFooters');

      return (
        <div
          id={editorId}
          class={[
            prefix,
            props.class,
            props.theme === 'dark' && `${prefix}-dark`,
            setting.fullscreen || setting.pageFullscreen ? `${prefix}-fullscreen` : ''
          ]}
          style={props.style}
        >
          <ToolBar
            noPrettier={noPrettier}
            toolbars={props.toolbars}
            toolbarsExclude={props.toolbarsExclude}
            setting={setting}
            updateSetting={updateSetting}
            tableShape={props.tableShape}
            defToolbars={defToolbars}
            noUploadImg={noUploadImg}
          />
          <Content
            value={props.modelValue}
            setting={setting}
            mdHeadingId={props.mdHeadingId}
            noMermaid={noMermaid}
            noPrettier={noPrettier}
            sanitize={props.sanitize}
            placeholder={props.placeholder}
            noKatex={noKatex}
            scrollAuto={state.scrollAuto}
            formatCopiedText={props.formatCopiedText}
            autofocus={props.autoFocus}
            disabled={props.disabled}
            readonly={props.readOnly}
            maxlength={props.maxLength}
            autoDetectCode={props.autoDetectCode}
            noHighlight={noHighlight}
            onChange={(value) => {
              if (props.onChange) {
                props.onChange(value);
              } else {
                ctx.emit('update:modelValue', value);
                ctx.emit('onChange', value);
              }
            }}
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
            onBlur={(e) => {
              if (props.onBlur) {
                props.onBlur(e);
              } else {
                ctx.emit('onBlur', e);
              }
            }}
            onFocus={(e) => {
              if (props.onFocus) {
                props.onFocus(e);
              } else {
                ctx.emit('onFocus', e);
              }
            }}
            completions={props.completions}
          />
          {props.footers?.length > 0 && (
            <Footer
              modelValue={props.modelValue}
              footers={props.footers}
              defFooters={defFooters}
              scrollAuto={state.scrollAuto}
              onScrollAutoChange={(v) => (state.scrollAuto = v)}
            />
          )}
          {catalogVisible.value && (
            <MdCatalog
              theme={props.theme}
              class={`${prefix}-catalog-editor`}
              editorId={editorId}
              mdHeadingId={props.mdHeadingId}
              key="internal-catalog"
            />
          )}
        </div>
      );
    };
  }
});

export default Editor;
