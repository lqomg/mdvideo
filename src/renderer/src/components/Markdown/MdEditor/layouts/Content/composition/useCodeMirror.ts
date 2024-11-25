import { ref, onMounted, inject, ComputedRef, watch, shallowRef, toRef } from 'vue';
import { EditorView, minimalSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { languages } from '@codemirror/language-data';
import { markdown } from '@codemirror/lang-markdown';
import { indentWithTab, undo, redo } from '@codemirror/commands';
import {
  directive2flag,
  ToolDirective
} from '@renderer/components/Markdown/MdEditor/utils/content-help';
import { Themes } from '@renderer/components/Markdown/MdEditor/type';
import { configOption } from '@renderer/components/Markdown/MdEditor/config';
import bus from '@renderer/components/Markdown/MdEditor/utils/event-bus';

import { ContentProps } from '../props';
import { oneDark } from '../codemirror/themeOneDark';
import { oneLight } from '../codemirror/themeLight';
import createAutocompletion from '../codemirror/autocompletion';
import CodeMirrorUt from '../codemirror';
import usePasteUpload from './usePasteUpload';
import useAttach from './useAttach';
import createCommands from '../codemirror/commands';

/**
 * 文本编辑区组件
 *
 * @param props
 * @returns
 */
const useCodeMirror = (props: ContentProps) => {
  const tabWidth = inject('tabWidth') as number;
  const editorId = inject('editorId') as string;
  const theme = inject('theme') as ComputedRef<Themes>;
  const inputWrapperRef = ref<HTMLDivElement>();

  // 编辑器的实例不能用ref包裹，vue会处理内部属性
  // https://discuss.codemirror.net/t/invalid-child-in-posbefore-codemirror6/3371/5
  const codeMirrorUt = shallowRef<CodeMirrorUt>();

  const mdEditorCommands = createCommands(editorId, props);

  // 粘贴上传
  const pasteHandler = usePasteUpload(props);

  const defaultExtensions = [
    keymap.of([...mdEditorCommands, indentWithTab]),
    minimalSetup,
    markdown({ codeLanguages: languages }),
    // 横向换行
    EditorView.lineWrapping,
    EditorView.updateListener.of((update) => {
      update.docChanged && props.onChange(update.state.doc.toString());
    }),
    EditorView.domEventHandlers({
      paste: pasteHandler,
      blur: props.onBlur,
      focus: props.onFocus
    })
  ];

  const getExtensions = () => {
    const extensions = [
      ...defaultExtensions,
      theme.value === 'light' ? oneLight : oneDark,
      createAutocompletion(props.completions)
    ];
    return configOption.codeMirrorExtensions!(theme.value, extensions, [...mdEditorCommands]);
  };

  onMounted(() => {
    const view = new EditorView({
      doc: props.value,
      parent: inputWrapperRef.value
    });

    const nc = new CodeMirrorUt(view);
    codeMirrorUt.value = nc;

    setTimeout(() => {
      nc.setTabSize(tabWidth);
      nc.setDisabled(props.disabled!);
      nc.setReadOnly(props.readonly!);
      nc.setExtensions(getExtensions());
      props.placeholder && nc.setPlaceholder(props.placeholder);
      typeof props.maxlength === 'number' && nc.setMaxLength(props.maxlength);
      props.autofocus && view.focus();
    }, 0);

    bus.on(editorId, {
      name: 'ctrlZ',
      callback() {
        undo(view);
      }
    });

    bus.on(editorId, {
      name: 'ctrlShiftZ',
      callback() {
        redo(view);
      }
    });

    // 注册指令替换内容事件
    bus.on(editorId, {
      name: 'replace',
      callback(direct: ToolDirective, params = {}) {
        const { text, options } = directive2flag(direct, codeMirrorUt.value!, params);
        codeMirrorUt.value?.replaceSelectedText(text, options);
      }
    });
  });

  watch(
    [theme, toRef(props, 'completions')],
    () => {
      codeMirrorUt.value?.setExtensions(getExtensions());
    },
    {
      deep: true
    }
  );

  watch(
    () => props.value,
    () => {
      // 只有不是输入的时候才手动设置编辑区的内容
      if (codeMirrorUt.value?.getValue() !== props.value) {
        codeMirrorUt.value?.setValue(props.value);
      }
    }
  );

  watch(
    () => props.placeholder,
    () => {
      codeMirrorUt.value?.setPlaceholder(props.placeholder);
    }
  );

  watch(
    () => props.disabled,
    () => {
      codeMirrorUt.value?.setDisabled(props.disabled!);
    }
  );

  watch(
    () => props.readonly,
    () => {
      codeMirrorUt.value?.setDisabled(props.readonly!);
    }
  );

  watch(
    () => props.maxlength,
    () => {
      if (props.maxlength) {
        codeMirrorUt.value?.setMaxLength(props.maxlength);
      }
    }
  );

  // 附带的设置
  useAttach(codeMirrorUt);

  return {
    inputWrapperRef,
    codeMirrorUt
  };
};

export default useCodeMirror;
