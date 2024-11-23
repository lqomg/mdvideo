import { ICreatePage } from '@api/page';
import { taskInstance } from '@main/child/taskManager';
import { insertPage, updatePage } from '@main/database/page';
import logger from '@main/log';
import { createResponsePayload } from '@main/utils';
import { ipcMain } from 'electron';

ipcMain.handle(
  'createPage',
  async (
    _event: Electron.IpcMainInvokeEvent,
    args: ICreatePage['req']
  ): Promise<ICreatePage['res']> => {
    try {
      const { payload } = args;
      const {
        projectInfo,
        scenes,
        _id,
        isTempate = false,
        isSave = false,
        clarity = 'medium',
        markdown,
        isMarkdownSource
      } = payload;
      const pageData = {
        clarity,
        projectInfo,
        scenes,
        isMarkdownSource,
        markdown,
        vertical: projectInfo.height > projectInfo.width,
        isTempate
      };
      // 只保存，不生产视频
      let videoId = _id;
      if (_id) {
        await updatePage(_id, pageData);
      } else {
        const d = await insertPage(pageData);
        videoId = d._id;
      }
      if (isSave) {
        return createResponsePayload({ videoId });
      } else {
        let taskId = '';
        if (videoId) {
          taskId = await taskInstance.getTaskId({
            videoInfo: projectInfo,
            videoScenes: scenes,
            videoId,
            clarity
          });
        }
        return createResponsePayload({ taskId, videoId });
      }
    } catch (error) {
      logger.error(error);
    }
  }
);
