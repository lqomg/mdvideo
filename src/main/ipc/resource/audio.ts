import { IUploadAudio } from '@api/resource';
import { UPLOAD_AUDIO_DIR, UPLOAD_IMAGE_DIR } from '@main/config';
import { insertFile } from '@main/database/upload';
import logger from '@main/log';
import { createResponsePayload, createUUID, getVideoInfo } from '@main/utils';
import { IpcMain, ipcMain } from 'electron';
import fs from 'fs-extra';
import path from 'path';

const createUploadVideoPath = (id: string, ext = 'mp4') => {
  const p = path.join(UPLOAD_AUDIO_DIR, `./${id}.${ext}`);
  return path.normalize(p);
};

ipcMain.handle(
  'uploadAudio',
  async (
    _event: Electron.IpcMainInvokeEvent,
    args: IUploadAudio['req']
  ): Promise<IUploadAudio['res']> => {
    const { payload } = args;
    const { type = 'audio', name, filePath, ext, sourceType = 'audio' } = payload!;
    const id = createUUID();
    const videoPath = createUploadVideoPath(id, ext);
    await fs.copyFile(filePath, videoPath);
    logger.info('上传音频成功：' + videoPath);
    const meta = await getVideoInfo(videoPath);
    await insertFile({ path: videoPath, id, sourceType, ext, name, type });
    return createResponsePayload({
      path: videoPath,
      id,
      duration: meta?.duration || 0
    });
  }
);
