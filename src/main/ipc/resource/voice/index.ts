import { createTxVoice } from './createTxVoice';

import { createResponsePayload, createUUID, getAudioDuration } from '@main/utils';
import { ipcMain } from 'electron';
import path from 'path';
import { UPLOAD_VOIVE_DIR } from '@main/config';
import fs from 'fs-extra';
import { ICreateVoice } from '@api/resource';
import logger from '@main/log';
import { toMD5 } from '@main/utils/md5';
import { getVoiceByMd5Id, insertVoice } from '@main/database/voice';

const createUploadMp3Path = (id: string) => {
  return path.join(UPLOAD_VOIVE_DIR, `./${id}.mp3`);
};

ipcMain.handle(
  'createVoice',
  async (
    _event: Electron.IpcMainInvokeEvent,
    args: ICreateVoice['req']
  ): Promise<ICreateVoice['res']> => {
    const { text, volume, speed, type } = args.payload;
    const jsonStr = JSON.stringify({ text, volume, speed, type });
    const md5Id = toMD5(jsonStr);
    const doc = await getVoiceByMd5Id(md5Id);
    if (doc && doc.path && doc.duration) {
      return createResponsePayload({
        path: doc.path,
        duration: doc.duration
      });
    }
    try {
      const buffer = await createTxVoice({
        text,
        volume,
        speed,
        type
      });
      if (!buffer) {
        return createResponsePayload({
          path: ``,
          duration: 0
        });
      }
      const id = createUUID();
      const voicePath = createUploadMp3Path(id);
      await fs.outputFile(voicePath, buffer);
      const duration = await getAudioDuration(voicePath);
      logger.info('新语音合成：');
      logger.info('path:' + voicePath);
      logger.info('duration:' + duration);
      insertVoice({
        text,
        volume,
        speed,
        type,
        md5Id,
        path: voicePath,
        duration
      });
      return createResponsePayload({
        path: voicePath,
        duration
      });
    } catch (error) {
      logger.error('语音合成失败：' + error);
      logger.error(args.payload);
      return createResponsePayload({
        path: '',
        duration: 0
      });
    }
  }
);
