/* eslint-disable prefer-const */
/* eslint-disable no-case-declarations */
import { IMDProjectInfo, IMDProjectScene } from '@api/types';
import path from 'path';
import { FFCreator, FFImage, FFScene } from 'ffcreator';
import logger from '@main/log';
import { FFMPEG_PATH, FFPROBE_PATH } from '@main/ffmpeg';
import { ChildProcessMsg } from '.';
import { TaskStates } from '@api/contanst';
import { addComponent, getImagePath, getVideoOrAudioPath } from './addComponent';
import { webpToPng } from './utils';
FFCreator.setFFmpegPath(FFMPEG_PATH);
FFCreator.setFFprobePath(FFPROBE_PATH);

export interface IpreDownloadOnline {
  videoInfo: IMDProjectInfo;
  videoScenes: IMDProjectScene[];
  videoId: string;
}

export const preDownloadOnline = async ({ videoInfo, videoScenes }: IpreDownloadOnline) => {
  try {
    const { width, height, audio } = videoInfo;
    await getVideoOrAudioPath(audio || '');
    for (let i = 0; i < videoScenes.length; i++) {
      const page = videoScenes[i];
      const { commonStyle, data, elements } = page;
      const { transName, transDuration = 0 } = data;
      let duration = data.duration + transDuration;
      data.duration = duration;
      let { backgroundColor, backgroundImage } = commonStyle;
      const scene = new FFScene();
      scene.setBgColor(backgroundColor);
      scene.setDuration(duration);
      if (transName && transName !== 'none') {
        scene.setTransition(transName, transDuration);
      }
      if (backgroundImage) {
        let imgExt = path.extname(backgroundImage).split('.').pop();
        if (imgExt === 'webp') {
          backgroundImage = await webpToPng(backgroundImage);
          imgExt = 'png';
        } else {
          backgroundImage = await getImagePath(backgroundImage);
        }
        const bgImage = new FFImage({
          path: backgroundImage,
          x: 0,
          y: 0,
          width,
          height
        });
        bgImage.setAnchor(0);
        scene.addChild(bgImage);
      }
      const els = elements.sort((a, b) => a.commonStyle.zIndex - b.commonStyle.zIndex);
      for (let j = 0; j < els.length; j++) {
        const element = els[j];
        await addComponent(element, data, scene);
      }
    }
    logger.info(`提前下载部分资源成功!`);
    process.send!({
      msg: ChildProcessMsg.PreDownloadFileSuccess,
      data: {
        payload: {
          projectInfo: videoInfo,
          errorMsg: ''
        }
      }
    });
  } catch (err) {
    logger.error(`提前下载部分资源失败 : ${err}`, videoInfo);
    process.send!({
      msg: ChildProcessMsg.PreDownloadFileError,
      data: {
        payload: {
          projectInfo: videoInfo,
          states: TaskStates.Error,
          errorMsg: '未知错误'
        }
      }
    });
  }
};

export default preDownloadOnline;
