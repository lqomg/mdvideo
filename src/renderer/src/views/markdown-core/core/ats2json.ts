/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable no-case-declarations */
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfm } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';

import { getElementAndConfig } from './getElementAndConfig';
import { isNeedToImage, parseChart } from './utils';
import { htmlToImageManager } from './htmlToImageMananger';
import { getElementProvider } from './getElement';
import { IMDCommonStyle, IMDElement } from '@api/types';
import { createVoice } from '@renderer/api/createVoice';
import { findIndex, findLastIndex, isEmpty } from 'lodash';
import {
  parseCommonStyle,
  parseHeadingCommonStyle,
  parseBlockquoteCommonStyle,
  parseImageCommonStyle,
  parseStrongCommonStyle,
  parseSubtitleCommonStyle,
  parseVideoCommonStyle
} from './parseCommStyle';
import { animateInCssData } from '@renderer/config/animateCssData';

export const markdownToAts = (text: string) => {
  return fromMarkdown(text, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()]
  });
};

interface Props {
  text: string;
  docDom: HTMLElement;
  width?: number;
  height?: number;
}

export const ats2json = async (props: Props) => {
  const { text: docText, docDom, width = 1920, height = 1080 } = props;
  console.log(width,height)
  const { elements, configs, sceneConfig } = await getElementAndConfig({ text: docText, docDom });
  const getElement = getElementProvider({ width, height });
  const mdElements: IMDElement[] = [];
  let errorMsgs: string[] = [];
  let voiceIds: string[] = [];
  // 处理转换的元素
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const config = configs.find((c) => c.elementId === element.id) || {};
    let { duration = 0, delay = 0, elementId, id, ...styleObj } = config;
    if (styleObj.x !== undefined && styleObj.left === undefined) {
      styleObj.left = styleObj.x;
    }
    if (styleObj.y !== undefined && styleObj.top === undefined) {
      styleObj.top = styleObj.y;
    }
    let mdElement: IMDElement | undefined;
    const offset = Number(delay);
    duration = Number(duration);
    // 处理需要转为图片的元素
    if (isNeedToImage(element.type) && element.htmlNode) {
      const { data, info } = await htmlToImageManager.createImage({
        element,
        styleObj,
        videoInfo: { width, height }
      });
      element.url = data;
      element.imageInfo = info;
      const commonStyle = parseImageCommonStyle({
        styleObj: styleObj || {},
        width,
        height,
        element
      });
      mdElement = getElement({
        elName: 'md-image',
        duration,
        offset,
        commonStyle,
        propsValue: { src: data }
      });
    } else {
      let commonStyle: IMDCommonStyle;
      switch (element.type) {
        case 'heading':
          commonStyle = parseHeadingCommonStyle({
            styleObj: styleObj || {},
            width,
            height,
            element
          });
          mdElement = getElement({
            elName: 'md-text',
            commonStyle,
            duration,
            offset,
            propsValue: { text: element.text }
          });
          break;
        case 'blockquote':
          commonStyle = parseBlockquoteCommonStyle({
            styleObj: styleObj || {},
            width,
            height,
            element
          });

          mdElement = getElement({
            elName: 'md-text',
            commonStyle,
            duration,
            offset,
            propsValue: { text: element.text }
          });
          break;
        case 'strong':
        case 'emphasis':
          commonStyle = parseStrongCommonStyle(
            {
              styleObj: styleObj || {},
              width,
              height,
              element
            },
            element.type
          );
          mdElement = getElement({
            elName: 'md-text',
            commonStyle,
            duration,
            offset,
            propsValue: { text: element.text }
          });
          break;
        case 'image':
          commonStyle = parseImageCommonStyle({
            styleObj: styleObj || {},
            width,
            height,
            element
          });
          mdElement = getElement({
            elName: 'md-image',
            duration,
            offset,
            commonStyle,
            propsValue: { src: element.src }
          });
          break;
        case 'video':
          commonStyle = parseVideoCommonStyle({
            styleObj: styleObj || {},
            width,
            height,
            element
          });
          const loop = !!styleObj.loop;
          const bgAudio = !!styleObj.bgAudio;
          mdElement = getElement({
            elName: 'md-video',
            duration,
            offset,
            commonStyle,
            propsValue: { src: element.src, cover: '', loop, bgAudio }
          });
          break;
        case 'audio':
          mdElement = getElement({
            elName: 'md-audio',
            duration,
            offset,
            commonStyle: undefined,
            propsValue: { src: element.src }
          });
          break;
        case 'chart':
          const options = parseChart(element.code);
          if (isEmpty(options)) {
            errorMsgs.push('echart格式不正确转换失败');
          }
          if (options && !options.grid) {
            options.grid = {
              top: 10,
              bottom: 'auto',
              containLabel: true
            };
          }
          commonStyle = parseImageCommonStyle({
            styleObj: styleObj || {},
            width,
            height,
            element
          });
          mdElement = getElement({
            elName: 'md-chart',
            duration,
            offset,
            commonStyle,
            propsValue: { data: options, isFromMarkDown: true }
          })!;
          break;
        default:
          commonStyle = parseSubtitleCommonStyle({
            styleObj: styleObj || {},
            width,
            height,
            element
          });
          const subtitleText = element.text?.trim() as any;

          if (subtitleText) {
            if (styleObj.speaker) {
              voiceIds.push(styleObj.speaker);
            }
            commonStyle.zIndex = 100;
            mdElement = getElement({
              elName: 'md-subtitle',
              duration,
              offset,
              commonStyle,
              propsValue: { text: subtitleText, voiceId: styleObj.speaker }
            })!;
          }
          break;
      }
    }
    if (mdElement) {
      // 动画效果好
      if (styleObj.animate) {
        mdElement.animations.in.type = styleObj.animate;
        mdElement.animations.in.time = styleObj.animateSpeed || 1;
      } else {
        const types = ['heading', 'image', 'blockquote'];
        // 获取随机动画
        if (types.includes(element.type)) {
          const len = animateInCssData.length;
          const random = Math.floor(Math.random() * len);
          const animate = animateInCssData[random]?.value;
          if (animate) {
            mdElement.animations.in.type = animate;
            mdElement.animations.in.time = 1;
          }
        }
      }
      mdElements.push(mdElement);
    }
  }
  let offsetSubtitle = 0;

  // 处理语音合成
  for (let i = 0; i < mdElements.length; i++) {
    const mdElement = mdElements[i];
    const { elName, propsValue, offset } = mdElement;
    if (elName === 'md-subtitle' && propsValue.text) {
      const subtitleText = propsValue.text;
      let { voiceType, voiceId, voiceSpeed, voiceVolume } = mdElement.propsValue;
      if (!voiceId) {
        voiceId = voiceIds[voiceIds.length - 1] || '101004';
      }
      const { data, message } = await createVoice({
        voiceType,
        voiceId,
        voiceSpeed,
        voiceVolume,
        text: subtitleText
      });
      if (data && data.path && data.duration) {
        mdElement.propsValue.voiceSrc = data.path;
        mdElement.propsValue.voiceDuration = data.duration;
        mdElement.duration = data.duration;
        mdElement.offset = offset || offsetSubtitle;
      } else {
        const d = subtitleText?.length * 0.3;
        mdElement.duration = d;
        mdElement.offset = offset || offsetSubtitle;
        errorMsgs.push('AI旁白语音合成失败:' + message);
      }
      offsetSubtitle = mdElement.offset + mdElement.duration + 0.05;
    }
  }
  const lastIndex = findLastIndex(mdElements, (m) => m.elName === 'md-subtitle');
  let totalSubtitleDuration = 0;
  if (lastIndex !== -1) {
    totalSubtitleDuration = mdElements[lastIndex].duration + mdElements[lastIndex].offset;
  }
  sceneConfig.duration = sceneConfig.duration || 6;
  if (sceneConfig.duration < totalSubtitleDuration) {
    sceneConfig.duration = totalSubtitleDuration;
  }
  if (sceneConfig.iDuration) {
    sceneConfig.duration = sceneConfig.duration + sceneConfig.iDuration;
  }
  return {
    elements: mdElements,
    sceneConfig,
    errorMsgs
  };
};
