import { ResponsePayload } from '@api/types';
import { nanoid } from 'nanoid';
import ffmpeg from '@main/ffmpeg';
import logger from '@main/log';
import path from 'path';
import fs from 'fs-extra';
import { VIDEO_COVER_DIR, IMAGE_COVER_DIR, UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '@main/config';

export * from './common';

export const createResponsePayload = <T>(
  data: T,
  code = 200,
  message = 'ok'
): ResponsePayload<T> => {
  return {
    code,
    message,
    data
  };
};

export const createUUID = () => {
  return nanoid();
  let d = new Date().getTime();

  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

export const getAudioDuration = (path: string): Promise<number> => {
  return new Promise((resolve) => {
    ffmpeg.ffprobe(path, function (err, metadata) {
      if (err) {
        console.error(err);
        resolve(0);
      } else {
        const { format = {} } = metadata;
        resolve(format.duration || 2);
      }
    });
  });
};

export const getVideoInfo = (
  path: string
): Promise<{ width: number; height: number; duration: number }> => {
  return new Promise((res, rej) => {
    ffmpeg.ffprobe(path, function (err, metadata) {
      if (err) {
        logger.error('解析视频信息失败：' + path);
        res(null);
      } else {
        const { format = {}, streams = [] } = metadata;
        let width = 1,
          height = 1;
        streams.forEach((element) => {
          if (element.width) {
            width = element.width || element.coded_width;
          }
          if (element.height) {
            height = element.height || element.coded_height;
          }
        });
        res({
          duration: format.duration,
          width,
          height
        });
      }
    });
  });
};

export const getVideoCover = async (
  filePath: string
): Promise<{
  cover: string;
  name: string;
}> => {
  let size = 100;
  try {
    const meta = fs.statSync(filePath);
    size = meta.size / 1024 / 1024;
  } catch (err) {
    logger.error(err);
  }

  return new Promise((res, rej) => {
    const coverName = 'image_%d.png';
    const uuid = createUUID();
    const savePath = path.join(VIDEO_COVER_DIR, createUUID() + '.gif');
    const dir = path.join(VIDEO_COVER_DIR, `./temp/${uuid}`);

    fs.ensureDirSync(dir);

    ffmpeg(filePath)
      .screenshots({
        folder: dir,
        filename: coverName,
        count: 10,
        size: size > 100 ? '50%' : '40%'
      })
      .on('error', (err) => {
        logger.error('生成封面失败-screenshots：', filePath);
        logger.error(err);
        res({
          cover: '',
          name: ''
        });
      })
      .on('end', () => {
        ffmpeg()
          .addInput(path.join(dir, 'image_1_%d.png'))
          .output(savePath)
          .fps(1)
          .on('end', () => {
            fs.emptyDir(dir);
            fs.remove(dir);
            logger.info('生成封面成功：', savePath);
            res({
              cover: savePath,
              name: coverName
            });
          })
          .on('error', (err) => {
            logger.error('生成封面失败-gif：', filePath);
            logger.error(err);
            res({
              cover: '',
              name: ''
            });
          })
          .run();
      });
  });
};

export const getImageCover = (
  filePath: string,
  size: { width: number; height: number } = { width: 200, height: 200 }
): Promise<{
  cover: string;
  name: string;
}> => {
  const dir = IMAGE_COVER_DIR;
  return new Promise((res, rej) => {
    const coverName = createUUID() + '.png';
    const savePath = path.join(dir, coverName);
    ffmpeg(filePath)
      .size(size.width + 'x' + size.height)
      .output(savePath)
      .on('end', () => {
        logger.info('缩略图生成成功', savePath);
        res({
          cover: savePath,
          name: coverName
        });
      })
      .on('error', (err) => {
        logger.error('缩略图生成失败', filePath, err);
        res({
          cover: '',
          name: ''
        });
      })
      .run();
  });
};



