/* eslint-disable prefer-const */
/* eslint-disable no-case-declarations */
import { IMDProjectInfo, IMDProjectScene } from '@api/types';
import { CACHE_DIR, OUT_PUT_DIR } from '@main/config';
import path from 'path';
import fs from 'fs-extra';
import { FFCreator, FFImage, FFScene } from 'ffcreator';
import logger from '@main/log';
import { createUUID, getVideoCover } from '@main/utils';
import { FFMPEG_PATH, FFPROBE_PATH } from '@main/ffmpeg';
import { ChildProcessMsg } from '.';
import { TaskStates } from '@api/contanst';
import { webpToPng } from './utils';
import { toLowVideo } from '@main/ipc/page/toLowVideo';
import { addComponent, cleanCacheFolder, getImagePath, getVideoOrAudioPath } from './addComponent';
import { IStoreConfigStete } from '@api/store';
FFCreator.setFFmpegPath(FFMPEG_PATH);
FFCreator.setFFprobePath(FFPROBE_PATH);

export interface ICreateFFTask {
  videoInfo: IMDProjectInfo;
  videoScenes: IMDProjectScene[];
  videoId: string;
  preDownloadFile?: boolean;
  clarity: 'high' | 'low' | 'medium';
  appConfig: IStoreConfigStete;
}

export const createFFTask = async (payload: ICreateFFTask) => {
  try {
    const { videoId, clarity = 'hight', appConfig } = payload;
    let scale = 1,
      fps = 30,
      crf = 10;
    if (clarity === 'low') {
      scale = 4;
      crf = 28;
    } else if (clarity === 'medium') {
      scale = 2;
      crf = 20;
    }
    const taskData = toLowVideo(payload.videoInfo, payload.videoScenes, scale);
    const videoInfo = taskData.projectInfo;
    const videoScenes = taskData.scenes;
    const { width, height, audio } = videoInfo;
    const id = videoId;
    const outputDir = path.join(OUT_PUT_DIR, './' + id);
    const cacheDir = path.join(CACHE_DIR, './' + id);
    const uuid = createUUID();
    // 使用FFCreatorCenter时，output无效哦
    const output = path.join(outputDir, './' + uuid + '.mp4');
    const localAudio = await getVideoOrAudioPath(audio || '');
    fs.ensureDirSync(outputDir);
    fs.ensureDirSync(cacheDir);
    const creatorConfig = {
      cacheDir,
      outputDir,
      output,
      width,
      height,
      fps,
      highWaterMark: '3mb',
      audio: localAudio
        ? {
            path: localAudio,
            volume: 0.2,
            loop: true
          }
        : undefined,
      debug: false,
      parallel: 8,
      crf,
      clarity
    };
    let creator = new FFCreator(creatorConfig);

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
      creator.addChild(scene);
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
        const comp = await addComponent(element, data, scene,appConfig);
        if (comp) scene.addChild(comp);
      }
    }
    const startTime = new Date().getTime();
    logger.info('开始合成:');
    creator.start();
    creator.on('error', (e) => {
      cleanCacheFolder(id);
      logger.error(`CreatorVideo error : ${e.error}`, payload.videoInfo);
      creator.destory?.();
      process.send!({
        msg: ChildProcessMsg.GetTaskStates,
        data: {
          videoId,
          payload: {
            videoId,
            projectInfo: payload.videoInfo,
            states: TaskStates.Error,
            errorMsg: e.error
          }
        }
      });
    });

    creator.on('progress', (e) => {
      logger.info(`进度---- :`, Number((e.percent * 100).toFixed(0)));
      process.send!({
        msg: ChildProcessMsg.GetTaskStates,
        data: {
          videoId,
          payload: {
            videoId,
            projectInfo: payload.videoInfo,
            percentage: Number((e.percent * 100).toFixed(0)),
            states: TaskStates.Waiting
          }
        }
      });
    });
    creator.on('complete', async (e) => {
      logger.info(`CreatorVideo success : `, e.output);
      logger.info(`${videoId}-总共用时：` + (new Date().getTime() - startTime) / 1000 + 's');
      const { output, useage } = e;
      creator.destory?.();
      const { cover } = await getVideoCover(output);
      process.send!({
        msg: ChildProcessMsg.GetTaskStates,
        data: {
          videoId,
          payload: {
            videoId,
            projectInfo: payload.videoInfo,
            states: TaskStates.Complete,
            useage,
            filePath: output,
            cover
          }
        }
      });
    });
    // return creator;
  } catch (err) {
    cleanCacheFolder(payload.videoId);
    logger.error(`CreatorVideo error : ${err}`, payload.videoInfo);
    process.send!({
      msg: ChildProcessMsg.GetTaskStates,
      data: {
        videoId: payload.videoId,
        payload: {
          videoId: payload.videoId,
          projectInfo: payload.videoInfo,
          states: TaskStates.Error,
          errorMsg: '未知错误'
        }
      }
    });
  }
};

export default createFFTask;
