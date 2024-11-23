import { watch, inject, ComputedRef, onMounted, shallowRef, nextTick } from 'vue';
import { prefix, mermaidUrl, configOption } from '@renderer/components/Markdown/MdEditor/config';
import { appendHandler } from '@renderer/components/Markdown/MdEditor/utils/dom';
import { uuid } from '@renderer/components/Markdown/MdEditor/utils';

import { ContentPreviewProps } from '../ContentPreview';
const mermaidCache = new Map();

/**
 * 注册katex扩展到页面
 *
 */
const useMermaid = (props: ContentPreviewProps) => {
  const theme = inject('theme') as ComputedRef<string>;
  const { editorExtensions } = configOption;
  const mermaidConf = editorExtensions?.mermaid;

  const mermaidRef = shallowRef(mermaidConf?.instance);
  const reRenderRef = shallowRef(false);

  const setMermaidTheme = () => {
    const mermaid = mermaidRef.value;
    if (!props.noMermaid && mermaid) {
      mermaid.initialize({
        startOnLoad: false,
        theme: theme.value === 'dark' ? 'dark' : 'default'
      });
      reRenderRef.value = !reRenderRef.value;
    }
  };

  watch(
    () => theme.value,
    () => {
      mermaidCache.clear();
      setMermaidTheme();
    }
  );

  onMounted(() => {
    if (props.noMermaid) {
      return;
    }

    // 没有提供实例，引入mermaid
    if (!mermaidConf?.instance) {
      const jsSrc = mermaidConf?.js || mermaidUrl;

      if (/\.mjs/.test(jsSrc)) {
        import(
          /* @vite-ignore */
          /* webpackIgnore: true */
          jsSrc
        ).then((module) => {
          mermaidRef.value = module.default;
          setMermaidTheme();
        });
      } else {
        const mermaidScript = document.createElement('script');
        mermaidScript.id = `${prefix}-mermaid`;
        mermaidScript.src = jsSrc;

        mermaidScript.onload = () => {
          mermaidRef.value = window.mermaid;
          setMermaidTheme();
        };

        appendHandler(mermaidScript, 'mermaid');
      }
    }
  });

  const replaceMermaid = () => {
    return;
    //TODO
    nextTick(() => {
      if (!props.noMermaid && mermaidRef.value) {
        const mermaidSourceEles = document.querySelectorAll<HTMLElement>(`div.${prefix}-mermaid`);
        const svgContainingElement = document.createElement('div');
        svgContainingElement.style.width = document.body.offsetWidth + 'px';
        svgContainingElement.style.height = document.body.offsetHeight + 'px';
        svgContainingElement.style.position = 'fixed';
        svgContainingElement.style.zIndex = '-10000';
        svgContainingElement.style.top = '-10000';

        document.body.appendChild(svgContainingElement);
        let count = mermaidSourceEles.length;
        mermaidSourceEles.forEach(async (item) => {
          let mermaidHtml = mermaidCache.get(item.innerText) as string;
          const idRand = 'mermaid-' + uuid();

          if (!mermaidHtml) {
            // @9以下使用renderAsync，@10以上使用render
            const render = mermaidRef.value.renderAsync || mermaidRef.value.render;
            let svg: { svg: string } | string = '';
            try {
              svg = await render(idRand, item.innerText, svgContainingElement);
            } catch (error) {
              // console.error(error);
            }

            // 9:10
            mermaidHtml = typeof svg === 'string' ? svg : svg.svg;
            mermaidCache.set(item.innerText, mermaidHtml);
          }
          const p = document.createElement('p');
          p.className = `${prefix}-mermaid`;
          p.setAttribute('data-processed', '');
          p.innerHTML = document.querySelector('#' + idRand)?.outerHTML || '';
          if (item.dataset.line !== undefined) {
            p.dataset.line = item.dataset.line;
          }

          item.replaceWith(p);

          if (--count === 0) {
            document.body.removeChild(svgContainingElement);
            svgContainingElement.remove();
          }
        });
      }
    });
  };

  return { mermaidRef, reRenderRef, replaceMermaid };
};

export default useMermaid;
