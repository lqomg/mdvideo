/* eslint-disable no-case-declarations */
import { IMDElement, IMDProjectScene } from '@api/types';
import {
  FFGifImage,
  FFImage,
  FFScene,
  FFSubtitle,
  FFText,
  FFVideo,
  FFLottie,
  FFChart
} from 'ffcreator';
import {
  chinaPathToEn,
  getOnlineImage,
  getOnlineVideoOrAudio,
  scaleVideoByCenter,
  webpToPng
} from './utils';
import path from 'path';
import fs from 'fs-extra';
import { getFonts } from '@main/utils';
import { CACHE_DIR } from '@main/config';
import logger from '@main/log';
import { FFCircle, FFRoundedRect } from './ffcreator';
import { IStoreConfigStete } from '@api/store';

const convertToBase64 = (filePath: string) => {
  try {
    const fileData = fs.readFileSync(filePath);
    const base64Data = Buffer.from(fileData).toString('base64');
    return base64Data;
  } catch (err) {
    console.error(err);
    return filePath;
  }
};
export const getImagePath = (filepath: string) => {
  if (filepath.startsWith('http')) {
    return getOnlineImage(filepath);
  }
  if (/[\u4e00-\u9fa5]/.test(filepath)) {
    // return 'data:image/jpeg;base64,' + convertToBase64(filepath);
    // 中文路径不支持，转为base64的话生成视频慢，采用转场英文的方式
    return chinaPathToEn(filepath);
  }
  return filepath;
};

export const getFontByPath = async (
  fontPath?: string,
  fontName?: string,
  appConfig?: IStoreConfigStete
) => {
  if (!fontPath && fontName) {
    const fontList = await getFonts(appConfig);
    const doc = fontList.find((f) => f.fileName?.replace(/(\.ttf)|(\.otf)$/gi, '') === fontName);
    if (doc) {
      fontPath = doc.filePath;
    }
  }
  if (fontPath) {
    if (!fs.pathExistsSync(fontPath)) {
      logger.error('没有找到字体：' + fontPath);
      return '';
    }
  }
  return fontPath;
};
export const cleanCacheFolder = async (id: string) => {
  const cacheDir = path.join(CACHE_DIR, `./${id}`);
  await fs.emptyDir(cacheDir);
  await fs.remove(cacheDir);
};

export const getVideoOrAudioPath = (filepath: string) => {
  if (filepath.startsWith('http')) {
    return getOnlineVideoOrAudio(filepath);
  }
  return filepath;
};

// 添加对应类型组件
export const addComponent = async (
  element: IMDElement,
  data: IMDProjectScene['data'],
  scene: FFScene,
  appConfig: IStoreConfigStete
) => {
  let comp, url;
  const {
    left = 0,
    top = 0,
    width,
    height,
    fontSize = 20,
    fontFamily,
    fontWeight,
    fontStyle,
    letterSpacing = 1,
    showFill,
    textAlign,
    fill = [],
    backgroundColor = 'transparent',
    dropShadow,
    dropShadowAlpha,
    dropShadowAngle,
    dropShadowBlur,
    dropShadowColor,
    dropShadowDistance,
    color,
    rotate,
    opacity = 1,
    paddingTop: padding = 0
  } = element.commonStyle || {};
  const x = left + width / 2;
  const y = top + height / 2;
  const commomStyle = {
    x,
    y,
    width,
    height,
    rotate
  };
  const { propsValue, animations } = element;
  //todo 图片视频问题
  const getImgPath = (propsValue: any): string => {
    const { src } = propsValue;

    if (/^(http|https|www)/gi.test(src)) return src;
    return src;
  };

  switch (element.elName) {
    case 'md-image':
      let urlImg = getImgPath(propsValue);
      let imgExt = path.extname(urlImg).split('.').pop();
      if (imgExt === 'webp') {
        urlImg = await webpToPng(urlImg);
        imgExt = 'png';
      } else {
        urlImg = await getImagePath(urlImg);
      }
      if (imgExt === 'GIF' || imgExt === 'gif') {
        comp = new FFGifImage({
          path: urlImg,
          ...commomStyle
        });
      } else {
        comp = new FFImage({
          path: urlImg,
          ...commomStyle
        });
      }

      break;

    case 'md-text':
      {
        const text = propsValue.text;
        const len = text.length || 0;
        const w = len * fontSize + padding * 2 + letterSpacing * (len + 1);
        const h = padding * 2 + fontSize;
        const x = commomStyle.x - width / 2 + padding,
          y = commomStyle.y - height / 2 + padding;
        comp = new FFText({
          x,
          y,
          text
        });
        comp.setStyle({
          dropShadow,
          dropShadowAlpha,
          dropShadowAngle,
          dropShadowBlur,
          dropShadowColor,
          dropShadowDistance,
          fontSize,
          letterSpacing,
          fontWeight,
          fontFamily: [fontFamily, 'Microsoft Yahei', 'SimSun'],
          fontStyle,
          align: textAlign,
          backgroundColor,
          padding: padding,
          wordWrap: true,
          breakWords: true,
          wordWrapWidth: w,
          fill: showFill && fill?.length ? fill : color // gradient
        });
        if (commomStyle.rotate) {
          comp.setAnchor(0.5);
          comp.setXY(x + 0.5 * w, y + h * 0.5);
        }
        const fontPath = await getFontByPath(propsValue.fontPath, fontFamily, appConfig);
        if (fontPath) {
          comp.setFont(fontPath);
        }
      }
      break;
    case 'md-subtitle':
      {
        comp = new FFSubtitle({
          text: propsValue.text,
          backgroundColor,
          color,
          fontSize,
          ...commomStyle
        });
        comp.setStyle({
          dropShadow,
          dropShadowAlpha,
          dropShadowAngle,
          dropShadowBlur,
          dropShadowColor,
          dropShadowDistance,
          fontSize,
          letterSpacing,
          fontWeight,
          fontFamily: [fontFamily, 'Microsoft Yahei', 'SimSun'],
          fontStyle,
          align: textAlign,
          backgroundColor,
          padding: padding,
          wordWrap: true,
          breakWords: true,
          wordWrapWidth: commomStyle.width,
          fill: showFill && fill?.length ? fill : color // gradient
        });
        if (propsValue.voiceSrc) {
          const regexp = /(。|，|!|！|；)/gi;
          comp.setRegexp(regexp);
          comp.setSpeech(propsValue.voiceSrc);
          comp.setStartTime(element.offset);
          scene.addAudio({
            path: propsValue.voiceSrc,
            start: element.offset
          });
          comp.frameBuffer = 24;
          // comp.setDuration(propsValue.voiceDuration);
        }
        const fontPath = await getFontByPath(propsValue.fontPath, fontFamily);
        if (fontPath) {
          comp.setFont(fontPath);
        }
      }
      break;

    case 'md-video':
      const { src, startTime = 0, duration = 0 } = propsValue;
      let url = await getVideoOrAudioPath(src);

      const videoUrlCropped = `${CACHE_DIR}/${path.basename(url).split('.').shift()}_handled.${path
        .basename(url)
        .split('.')
        .pop()}`;
      const cUrl = await scaleVideoByCenter(
        url,
        commomStyle.width,
        commomStyle.height,
        videoUrlCropped
      );
      if (cUrl) {
        url = cUrl;
      }
      console.log(propsValue);
      const start = startTime,
        end = duration + startTime;
      comp = new FFVideo({
        path: url,
        ...commomStyle,
        ss: start <= 0 ? undefined : start,
        to: end <= 0 ? undefined : end,
        loop: propsValue.loop,
        audio: propsValue.bgAudio
      });

      break;
    case 'md-lottie': {
      const { path: filePath } = propsValue;
      // let data: any;
      // try {
      //   data = await fetch(filePath).then((res) => res.json());
      // } catch {
      //   logger.error('加载lottie数据出错：', filePath);
      // }
      // if (filePath) {
      comp = new FFLottie({
        ...commomStyle,
        loop: true,
        // data,
        file: filePath
      });
      // }

      break;
    }
    case 'md-audio': {
      const { src } = propsValue;
      const url = await getVideoOrAudioPath(src);
      scene.addAudio({
        path: url,
        start: element.offset || 0
      });
      break;
    }

    case 'md-chart':
      comp = new FFChart({
        ...commomStyle,
        option: propsValue.option,
        optionOpts: {
          lazyUpdate: true
        },
        theme: 'light'
      });
      break;
    case 'md-circle': {
      const {
        borderRadius = 0,
        backgroundColor,
        borderWidth,
        borderColor
      } = element.commonStyle || {};
      comp = new FFCircle({
        bgColor: backgroundColor,
        lineSize: borderWidth,
        lineColor: borderColor,
        borderColor: borderColor,
        radius: commomStyle.width / 2,
        ...commomStyle
      });

      break;
    }

    case 'md-round-rect': {
      const {
        borderRadius = 0,
        backgroundColor,
        borderWidth,
        borderColor
      } = element.commonStyle || {};
      commomStyle.x = commomStyle.x - commomStyle.width / 2 || 0;
      commomStyle.y = commomStyle.y - commomStyle.height / 2 || 0;
      comp = new FFRoundedRect({
        bgColor: backgroundColor,
        lineSize: borderWidth,
        lineColor: borderColor,
        borderColor: borderColor,
        radius: borderRadius,
        ...commomStyle
      });
      break;
    }
  }
  if (element.elName === 'md-audio') {
    return;
  }
  if (!comp) {
    logger.error('添加元素失败', JSON.stringify(element));
    return;
  }

  const { in: animationIn, out: animationOut, custom: animationCustom } = animations;
  const { offset, duration } = element;

  if (animationIn.type) {
    let { type, time = 1 } = animationIn;
    if (type === 'none') {
      type = 'fadeIn';
      time = 0;
    }
    comp.addEffect?.(type, time, offset);
  }

  if (animationCustom?.show) {
    const { from, to, time, ease } = animationCustom;
    const fromX = from.x + from.width / 2;
    const fromY = from.y + from.height / 2;
    const toX = to.x + to.width / 2;
    const toY = to.y + to.height / 2;
    const scale = from.width / to.width;
    comp.addAnimate({
      from: { x: fromX, y: fromY, scale },
      to: { x: toX, y: toY, scale: 1 },
      time: time,
      delay: offset,
      ease: ease
    });
  }
  if (animationOut.type && animationOut.type !== 'none') {
    let { type, time = 0.5, delay = 0 } = animationOut;
    if (type === 'none') {
      type = 'fadeOut';
    }
    if (duration) {
      delay = offset + duration;
    } else {
      delay = data.duration;
    }
    if (animationCustom?.show) {
      time = 0;
    }
    comp.addEffect(type, time, delay);
  }

  comp.setRotateDeg(commomStyle.rotate);
  comp.setOpacity(opacity);
  return comp;
};
