import { ICutVideo, IUploadVideo } from '@api/resource';
import { UPLOAD_VIDEO_DIR, UPLOAD_IMAGE_DIR } from '@main/config';
import { insertFile } from '@main/database/upload';
import logger from '@main/log';
import { createResponsePayload, createUUID, getVideoCover, getVideoInfo } from '@main/utils';
import { IpcMain, ipcMain } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import ffmpeg from '@main/ffmpeg';
import { cutVideo } from '@main/utils/cutVideo';

const createUploadVideoPath = (id: string, ext = 'mp4') => {
  const p = path.join(UPLOAD_VIDEO_DIR, `./${id}.${ext}`);
  return path.normalize(p);
};

const getOnloneVideo = (url: string): Promise<string> => {
  const newFilePath = createUploadVideoPath(createUUID());
  return new Promise((resolve, reject) => {
    ffmpeg(url)
      .output(newFilePath)
      .on('error', (error) => {
        logger.error('下载在线视频失败:' + error);
        resolve('');
      })
      .on('end', () => {
        resolve(newFilePath);
      })
      .run();
  });
};

ipcMain.handle(
  'uploadVideo',
  async (
    _event: Electron.IpcMainInvokeEvent,
    args: IUploadVideo['req']
  ): Promise<IUploadVideo['res']> => {
    const { payload } = args;
    const { type, name, filePath, ext, sourceType = 'video' } = payload!;
    let newFilePath = filePath;
    const id = createUUID();
    try {
      const videoPath = createUploadVideoPath(id, ext);
      // todo
      if (newFilePath.startsWith('http')) {
        const p = await getOnloneVideo(filePath);
        if (p) {
          newFilePath = p;
          logger.info('下载在线视频成功:' + filePath, newFilePath);
        } else {
          return createResponsePayload({
            path: '',
            meta: null,
            cover: '',
            id
          });
        }
      }
      await fs.copyFile(newFilePath, videoPath);
      const meta = await getVideoInfo(newFilePath);
      const cover = await getVideoCover(newFilePath, meta!);
      logger.info('上传视频成功：' + videoPath);
      await insertFile({ path: videoPath, id, sourceType, ext, name, type });
      return createResponsePayload({
        path: videoPath,
        cover: cover.cover,
        meta,
        id
      });
    } catch (error) {
      logger.error('上次视频失败:', error);
      return createResponsePayload({
        path: '',
        cover: '',
        meta: {
          width: 0,
          height: 0,
          duration: 0
        },
        id: ''
      });
    }
  }
);

ipcMain.handle(
  'cutVideo',
  async (
    _event: Electron.IpcMainInvokeEvent,
    args: ICutVideo['req']
  ): Promise<ICutVideo['res']> => {
    const { payload } = args;
    const { start, to, filePath } = payload;
    console.log(payload);
    try {
      const newFilePath = await cutVideo(filePath, start, to);
      if (!newFilePath) {
        return createResponsePayload({
          path: '',
          cover: '',
          meta: null
        });
      }
      const meta: any = await getVideoInfo(newFilePath);
      const cover = await getVideoCover(newFilePath);
      return createResponsePayload({
        path: newFilePath,
        cover: cover.cover,
        meta
      });
    } catch (error) {
      logger.error('裁剪视频:', error);
      return createResponsePayload({
        path: '',
        cover: '',
        meta: {
          width: 0,
          height: 0,
          duration: 0
        }
      });
    }
  }
);
