import { ICreatePage } from '@api/page';
import { taskInstance } from '@main/child/taskManager';
import logger from '@main/log';
import { createResponsePayload } from '@main/utils';
import { ipcMain } from 'electron';

ipcMain.handle(
  'preDownload',
  async (
    _event: Electron.IpcMainInvokeEvent,
    args: ICreatePage['req']
  ): Promise<ICreatePage['res']> => {
    try {
      const { payload } = args;
      const { projectInfo, scenes } = payload;
      await taskInstance.downloadOnline({
        videoInfo: projectInfo,
        videoScenes: scenes,
        videoId: '',
        preDownloadFile: true,
        clarity: 'high'
      });
      return createResponsePayload({});
    } catch (error) {
      logger.error('preDownload',error);
      return createResponsePayload({});
    }
  }
);
