import { computed, ComputedRef, inject, onMounted, ref, toRef, watch } from 'vue';
import mdit from 'markdown-it';
import ImageFiguresPlugin from 'markdown-it-image-figures';
import TaskListPlugin from 'markdown-it-task-lists';
import { debounce } from '@vavt/util';
import bus from '@renderer/components/Markdown/MdEditor/utils/event-bus';
import { generateCodeRowNumber } from '@renderer/components/Markdown/MdEditor/utils';
import { HeadList, Themes } from '@renderer/components/Markdown/MdEditor/type';
import { configOption } from '@renderer/components/Markdown/MdEditor/config';

import useHighlight from './useHighlight';
import useMermaid from './useMermaid';
import useKatex from './useKatex';

import MermaidPlugin from '../markdownIt/mermaid';
import ScenePlugin from '../markdownIt/sceneConfig';
import KatexPlugin from '../markdownIt/katex';
import AdmonitionPlugin from '../markdownIt/admonition';
import HeadingPlugin from '../markdownIt/heading';
import CodeTabsPlugin from '../markdownIt/codetabs';
import { ContentPreviewProps } from '../ContentPreview';

const initLineNumber = (md: mdit) => {
  [
    'paragraph_open',
    'table_open',
    'ordered_list_open',
    'bullet_list_open',
    'blockquote_open',
    'hr'
  ].forEach((rule) => {
    md.renderer.rules[rule] = (tokens, idx, options, _env, self) => {
      let line;
      if (tokens[idx].map && tokens[idx].level === 0) {
        line = tokens[idx].map![0];
        const token = tokens[idx + 1]
        if (token?.type === 'inline' && token?.content?.startsWith("&")) {
          tokens[idx].attrSet('data-config', String(1));
        }
        tokens[idx].attrSet('data-line', String(line));
      }
      return self.renderToken(tokens, idx, options);
    };
  });

  ['html_block', 'fence'].forEach((rule) => {
    const backup = md.renderer.rules[rule];

    md.renderer.rules[rule] = (tokens, idx, options, env, self) => {
      let line;
      const _htmlCode = backup!(tokens, idx, options, env, self);

      if (tokens[idx].map && tokens[idx].level === 0) {
        line = tokens[idx].map![0];
        return _htmlCode.replace(/^(<[^>]*)/, `$1 data-line="${line}"`);
      }

      return _htmlCode;
    };
  });
};

const useMarkdownIt = (props: ContentPreviewProps, previewOnly: boolean) => {
  const { editorConfig, markdownItConfig } = configOption;
  //
  const editorId = inject('editorId') as string;
  // 是否显示行号
  const showCodeRowNumber = inject('showCodeRowNumber') as boolean;
  const themeRef = inject('theme') as ComputedRef<Themes>;

  const headsRef = ref<HeadList[]>([]);

  const hljsRef = useHighlight(props);
  const katexRef = useKatex(props);
  const { reRenderRef, replaceMermaid } = useMermaid(props);

  const md = mdit({
    html: true,
    breaks: true
  });

  markdownItConfig!(md);

  md.use(KatexPlugin, { katexRef });
  md.use(ImageFiguresPlugin, { figcaption: true });
  md.use(AdmonitionPlugin);
  md.use(TaskListPlugin);
  md.use(HeadingPlugin, { mdHeadingId: props.mdHeadingId, headsRef });
  md.use(CodeTabsPlugin, { editorId });
  // md.use(ScenePlugin, { themeRef, noMermaid: props.noMermaid });
  if (!props.noMermaid) {
    md.use(MermaidPlugin, { themeRef, noMermaid: props.noMermaid });
  }

  md.set({
    highlight: (str, language) => {
      let codeHtml;

      // 不高亮或者没有实例，返回默认
      if (!props.noHighlight && hljsRef.value) {
        const hljsLang = hljsRef.value.getLanguage(language);
        if (hljsLang) {
          codeHtml = hljsRef.value.highlight(str, {
            language,
            ignoreIllegals: true
          }).value;
        } else {
          codeHtml = hljsRef.value.highlightAuto(str).value;
        }
      } else {
        codeHtml = md.utils.escapeHtml(str);
      }

      const codeSpan = showCodeRowNumber
        ? generateCodeRowNumber(codeHtml.trim())
        : `<span class="code-block">${codeHtml.trim()}</span>`;

      return `<pre><code class="language-${language}" language=${language}>${codeSpan}</code></pre>`;
    }
  });

  initLineNumber(md);

  const html = ref(props.sanitize(md.render(props.modelValue)));

  const updatedTodo = () => {
    // 触发异步的保存事件（html总是会比text后更新）
    bus.emit(editorId, 'buildFinished', html.value);
    props.onHtmlChanged(html.value);
    // 传递标题
    props.onGetCatalog(headsRef.value);
    // 生成目录
    bus.emit(editorId, 'catalogChanged', headsRef.value);
    replaceMermaid();
  };

  onMounted(updatedTodo);

  const markHtml = debounce<any, void>(
    async () => {
      // 清理历史标题
      headsRef.value = [];
      html.value = props.sanitize(md.render(props.modelValue));
      updatedTodo();
    },
    editorConfig?.renderDelay !== undefined
      ? editorConfig?.renderDelay
      : previewOnly
        ? 0
        : 500
  );

  const needReRender = computed(() => {
    return (props.noKatex || katexRef.value) && (props.noHighlight || hljsRef.value);
  });

  watch([toRef(props, 'modelValue'), needReRender, reRenderRef], markHtml);

  // 添加目录主动触发接收监听
  onMounted(() => {
    bus.on(editorId, {
      name: 'pushCatalog',
      callback() {
        bus.emit(editorId, 'catalogChanged', headsRef.value);
      }
    });
  });

  return { html };
};

export default useMarkdownIt;
