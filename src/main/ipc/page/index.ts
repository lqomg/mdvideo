import './create';
import './get';
import './preDownload';
import fs from 'fs-extra';
import { SaveVideoFile } from '@api/contanst';
import { ipcMain, app, dialog } from 'electron';
import path from 'path';
import logger from '@main/log';

ipcMain.handle(SaveVideoFile, (_event, args) => {
  const { filePath, fileName } = args;
  const name = path.basename(filePath);
  const defaultPath = path.join(app.getPath('desktop'), fileName || name);
  dialog
    .showSaveDialog({
      title: '保存视频到本地',
      buttonLabel: '选择文件夹',
      defaultPath,
      filters: [{ name: '*', extensions: ['mp4'] }]
    })
    .then((dir) => {
      if (!dir.canceled && dir.filePath) {
        fs.copyFile(filePath, dir.filePath).then(() => {
          dialog.showMessageBox({
            title: '导出提示',
            message: '视频导出成功'
          });
        });
      }
    })
    .catch((e) => {
      logger.error('导出失败，' + e);
    });
});
