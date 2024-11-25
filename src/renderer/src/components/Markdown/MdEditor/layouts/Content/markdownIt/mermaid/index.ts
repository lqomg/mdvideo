import { ComputedRef } from 'vue';
import { Themes } from '@renderer/components/Markdown/MdEditor/type';
import { prefix } from '@renderer/components/Markdown/MdEditor/config';

const MermaidPlugin = (
  md: markdownit,
  options: { themeRef: ComputedRef<Themes>; noMermaid: boolean }
) => {
  const temp = md.renderer.rules.fence!.bind(md.renderer.rules);
  md.renderer.rules.fence = (tokens, idx, ops, env, slf) => {
    const token = tokens[idx];
    const code = token.content.trim();
    if (token.info === 'mermaid' && !options.noMermaid) {
      let line;
      if (tokens[idx].map && tokens[idx].level === 0) {
        line = tokens[idx].map![0];
        tokens[idx].attrSet('data-line', String(line));
      }

      return `<div class="${prefix}-mermaid" ${line !== undefined ? 'data-line=' + line : ''
        } data-mermaid-theme=${options.themeRef.value}>${code}</div>`;
    } else if (token.info === '元素配置') {
      let html = temp!(tokens, idx, ops, env, slf);
      html = html.replace('<pre>', '<pre class="element-config">')
      return html;
    }

    return temp!(tokens, idx, ops, env, slf);
  };
};

export default MermaidPlugin;
