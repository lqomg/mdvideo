import { IUploadImage } from '@api/resource';
import { UPLOAD_IMAGE_DIR } from '@main/config';
import { insertFile } from '@main/database/upload';
import logger from '@main/log';
import { createResponsePayload, createUUID } from '@main/utils';
import { IpcMain, ipcMain } from 'electron';
import fs from 'fs-extra';
import path from 'path';

const createUploadImagePath = (id: string, ext = 'png') => {
  const p = path.join(UPLOAD_IMAGE_DIR, `./${id}.${ext}`);
  return path.normalize(p);
};

ipcMain.handle(
  'uploadImage',
  async (
    _event: Electron.IpcMainInvokeEvent,
    args: IUploadImage['req']
  ): Promise<IUploadImage['res']> => {
    const { payload } = args;
    const { type = 'image', name, file, ext } = payload;
    const id = createUUID();
    const base64Data = file.replace(/^data:image\/\w+;base64,/, ''); // 去除Base64编码头部
    const buffer = Buffer.from(base64Data, 'base64'); // 将Base64编码的字符串转换为Buffer对象
    const imagePath = createUploadImagePath(id, ext);
    await fs.writeFile(imagePath, buffer);
    logger.info('上传图片成功：' + imagePath);
    await insertFile({
      path: imagePath,
      id,
      sourceType: 'image',
      ext,
      name,
      type
    });
    return createResponsePayload({
      path: imagePath,
      id
    });
  }
);
