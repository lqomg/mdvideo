import { UPLOAD_VIDEO_DIR } from '@main/config';
import ffmpeg from '@main/ffmpeg';
import logger from '@main/log';
import path from 'path';
import { createUUID } from '.';
export const cutVideo = (filePath: string, start: number, to: number): Promise<string> => {
  const extname = path.extname(filePath);
  const id = createUUID();
  let newFilePath = path.join(UPLOAD_VIDEO_DIR, 'cut-video-' + id + extname);
  newFilePath = path.normalize(newFilePath);
  return new Promise((res, rej) => {
    ffmpeg(filePath)
      .seekInput(start)
      .duration(to - start)
      .output(newFilePath)
      .on('error', (err) => {
        logger.error('裁剪视频失败：', err);
        res('');
      })
      .on('end', () => {
        logger.log('裁剪视频：', newFilePath);
        res(newFilePath);
      })
      .run();
  });
};
