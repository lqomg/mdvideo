import { ComputedRef } from 'vue';
import { Themes } from '@renderer/components/Markdown/MdEditor/type';

const ScenePlugin = (
  md: markdownit,
  options: { themeRef: ComputedRef<Themes>; noMermaid: boolean }
) => {
  console.log(md.renderer.rules)
  const temp = md.renderer.rules.text!.bind(md.renderer.rules);
  md.renderer.rules.text = (tokens, idx, ops, env, slf) => {
    const token = tokens[idx];
    const code = token.content.trim();
    if (code.startsWith("&")) {
      console.log(temp!(tokens, idx, ops, env, slf))
      // return `<p class="scene-config">${code}</p>`;
    }
    return temp!(tokens, idx, ops, env, slf);
  };
};

export default ScenePlugin;
