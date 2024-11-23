import { IGetSources, IUploadSources, UploadSourceState } from '@api/resource';
import { UPLOAD_RESOURCE_DIR } from '@main/config';
import logger from '@main/log';
import { createResponsePayload, createUUID } from '@main/utils';
import { decodeZipFile } from '@main/utils/zip';
import { ipcMain, BrowserWindow } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import { throttle } from 'lodash';
import { insertSource, getSources, clearAllSource, SourceDBTypes } from '@main/database/resource';
import { localStore } from '@main/store';

/*
 * bgs 背景
 * images 图片
 * videos 视频
 * audios 音频
 * qbq 表情包
 * bg3d
 * bgColors
 * fonts
 **/

const sengUploadSource = throttle((data: any, code = 200) => {
  const webContents = BrowserWindow.getFocusedWindow()?.webContents;
  webContents?.send(UploadSourceState, createResponsePayload(data, code));
}, 500);

const createRandomDir = async (count: number, base: string) => {
  const random = Math.ceil(4 + Math.random() * count);
  const random1 = Math.ceil(6 + Math.random() * count);
  const random2 = Math.ceil(2 + Math.random() * count);
  let p = '';
  for (let i = 0; i < random; i++) {
    const dir = createUUID();
    await fs.ensureDirSync(path.join(base, dir));
    for (let j = 0; j < random1; j++) {
      const dir1 = createUUID();
      await fs.ensureDirSync(path.join(base, dir + '/' + dir1));
      for (let k = 0; k < random2; k++) {
        const dir2 = createUUID();
        if (k === 2) {
          p = path.join(base, dir + '/' + dir1 + '/' + dir2);
        }
        await fs.ensureDirSync(path.join(base, dir + '/' + dir1 + '/' + dir2));
      }
    }
  }
  return p;
};

ipcMain.handle(
  'uploadSources',
  async (
    _event: Electron.IpcMainInvokeEvent,
    args: IUploadSources['req']
  ): Promise<IUploadSources['res']> => {
    const { payload } = args;
    const { path: filePath, filename = 'target' } = payload;
    const targetDir = 'target';

    try {
      const oldTargetPath = localStore.get('appConfig')?.resourcePath;;
      logger.info('原始文件夹：' + oldTargetPath);
      let targetPath = oldTargetPath as string;
      if (!targetPath) {
        targetPath = await createRandomDir(1, UPLOAD_RESOURCE_DIR);
      } else {
        logger.info('已存在的文件夹：' + targetPath);
        logger.info('删除老数据');
        sengUploadSource({
          msg: '删除老数据中....',
          status: 'doing'
        });
      }
      await fs.removeSync(UPLOAD_RESOURCE_DIR);
      await clearAllSource();
      logger.info('文件夹:' + targetPath);
      await decodeZipFile(filePath, targetPath, (msg: string) => {
        sengUploadSource({
          msg: msg,
          status: 'doing'
        });
      });
      const jsonFiles = path.join(targetPath, `./${targetDir}/json`);
      if (!fs.statSync(jsonFiles).isDirectory()) {
        logger.error('不存在解压的文件夹');
        return createResponsePayload({ msg: '不存在解压的文件夹', fileList: [] }, 500);
      }
      sengUploadSource({
        msg: '解压完成，整理数据中...',
        status: 'doing'
      });
      const files = await fs.readdir(jsonFiles, { encoding: 'utf8' });
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = path.join(jsonFiles, '/' + file);
        if (fs.statSync(filePath).isFile()) {
          const fileName = path.basename(file, '.json');
          const json = await fs.readFileSync(filePath).toString();
          if (SourceDBTypes.includes(fileName as any)) {
            let list = JSON.parse(json) || [];
            if (list?.length) {
              list = list.map((p) => {
                if (p.filePath) {
                  p.filePath = path.join(targetPath + '/' + targetDir, p.filePath);
                }
                if (p.cover) {
                  p.cover = path.join(targetPath + '/' + targetDir, p.cover);
                }
                return p;
              });
            }
            await insertSource(list, fileName as any);
          } else {
            logger.error('不存在的数据类型：' + fileName);
          }
        }
      }
      localStore.set('resourcePath', targetPath);
      return createResponsePayload({ fileList: [] });
    } catch (err: any) {
      logger.error('素材资源包解析失败', err.message);
      const msg = '素材资源包解析失败，请联系管理员!';
      if (msg.includes('no such file or directory')) {
        sengUploadSource({ msg }, 500);
      }
      return createResponsePayload({ msg, fileList: [] }, 500);
    }
  }
);

ipcMain.handle(
  'getSources',
  async (
    _event: Electron.IpcMainInvokeEvent,
    args: IGetSources['req']
  ): Promise<IGetSources['res']> => {
    const { payload } = args;
    const { vertical, keyword = '', type = 'bgs', className = '' } = payload;
    const { total = 0, docs = [] } = await getSources(
      { vertical, keyword, className },
      type as any
    );
    return createResponsePayload({
      total,
      data: docs
    });
  }
);
