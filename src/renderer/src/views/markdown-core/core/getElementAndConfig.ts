/* eslint-disable prefer-const */
/* eslint-disable no-case-declarations */
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfm } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';

import { nanoid } from 'nanoid';
import { Content, Paragraph, Image } from 'mdast-util-from-markdown/lib';
import { tryParseJson, isNeedToImage, trySceneConfigParseJson } from './utils';

export const markdownToAts = (text: string) => {
  return fromMarkdown(text, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()]
  });
};

const isImageNode = (node: Paragraph) => {
  const children = node.children;
  if (children.length === 1 && children[0].type === 'image') {
    return true;
  }
  return false;
};

const isSceneConfig = (str: string) => {
  return /^&/.test(str) && str.includes('=');
};

const isVideoNode = (node: Paragraph) => {
  const children = node.children;
  const linkChildren = children.find((c) => c.type === 'link');
  if (linkChildren && linkChildren.children?.[0]?.value === 'video') {
    return linkChildren?.url;
  }
  return false;
};
const isAudioNode = (node: Paragraph) => {
  const children = node.children;
  const linkChildren = children.find((c) => c.type === 'link');
  if (linkChildren && linkChildren.children?.[0]?.value === 'audio') {
    return linkChildren?.url;
  }
  return false;
};

const getImageNodeUrl = (node: Image) => {
  return node.url;
};
const isStrongNode = (node: Paragraph) => {
  const children = node.children;
  if (children.length === 1 && children[0].type === 'strong') {
    return true;
  }
  return false;
};
const isEmphasisNode = (node: Paragraph) => {
  const children = node.children;
  if (children.length === 1 && children[0].type === 'emphasis') {
    return true;
  }
  return false;
};
interface Props {
  text: string;
  docDom: HTMLElement;
}

export const getElementAndConfig = async ({ text, docDom }: Props) => {
  const htmlNodes = Array.from(docDom.childNodes).filter(
    (node) => node.nodeName !== '#text' && node.nodeValue !== '\n'
  );
  const nodes = markdownToAts(text).children;
  const elements: any[] = [];
  const configs: any[] = [];
  let sceneConfig: any = {
    duration: 6
  };
  let id = nanoid();
  // 先遍历出所有元素
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const htmlNode = htmlNodes[i] as HTMLElement;
    const htmlNodetext = (htmlNode?.textContent || '').trim();
    const nodeType = node.type;
    let element: any = { id, type: node.type };
    if (isNeedToImage(node.type)) {
      element.htmlNode = htmlNode;
    }
    if (nodeType === 'heading') {
      element.text = htmlNodetext;
      element.depth = node.depth;
    } else if (nodeType === 'blockquote') {
      element.text = htmlNodetext;
    } else if (nodeType === 'code') {
      const { lang, value } = node;
      // 配置项
      if (lang?.trim() === '元素配置' || !lang?.trim()) {
        const config = tryParseJson(value) || {
          msgError: '格式不正确'
        };
        const elementId = elements[elements.length - 1]?.id;
        if (elementId) {
          configs.push({ ...config, id: nanoid(), elementId });
        }
        continue;
      } else if (lang.trim() === 'chart') {
        element.type = 'chart';
        element.code = node.value;
      }
    } else if (nodeType === 'paragraph') {
      const videoUrl = isVideoNode(node);
      const audioUrl = isAudioNode(node);
      if (isSceneConfig(htmlNodetext?.trim())) {
        const config = trySceneConfigParseJson(htmlNodetext);
        sceneConfig = {
          ...sceneConfig,
          ...config
        };
        element = null;
      } else if (isImageNode(node)) {
        element.type = 'image';
        const alt = (node.children[0] as Image).alt;
        const url = getImageNodeUrl(node.children[0] as Image);
        if (url) {
          if (alt?.trim() === 'bg') {
            sceneConfig.backgroundImage = url;
            element = null;
          } else {
            element.src = getImageNodeUrl(node.children[0] as Image);
          }
        } else {
          console.error('无法获取图片地址', node.children[0]);
          element = null;
        }
      } else if (isStrongNode(node)) {
        element.type = 'strong';
        element.text = htmlNodetext;
      } else if (isEmphasisNode(node)) {
        element.type = 'emphasis';
        element.text = htmlNodetext;
      } else if (videoUrl) {
        element.type = 'video';
        element.src = videoUrl;
      } else if (audioUrl) {
        element.type = 'audio';
        element.src = audioUrl;
      } else {
        element.text = htmlNodetext;
        element.msg = '未确定的元素类型';
      }
    } else if (nodeType === 'list' || nodeType === 'table') {
      // elements.push(element);
    }
    if (element) {
      elements.push(element);
    }

    id = nanoid();
  }
  return { configs, elements, sceneConfig };
};
