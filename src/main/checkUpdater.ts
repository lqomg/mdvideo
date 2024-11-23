import { UPDATE_MESSAGE_STATUS } from '@api/contanst';
import { BrowserWindow, ipcMain, app } from 'electron';
import { autoUpdater } from 'electron-updater';
export const baseURL = '';
let uploadUrl = '';
// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text: any, mainWindow: any) {
  mainWindow?.send('updateMessage', text);
}
ipcMain.handle('checkForUpdate', (_event: any, args: any) => {
  if (args?.updateUrl) {
    uploadUrl = args?.updateUrl;
  }
  autoUpdater.setFeedURL(uploadUrl);
  autoUpdater.checkForUpdates();
});

export const checkUpdater = (mainWindow: BrowserWindow) => {
  
  autoUpdater.on('error', function (error: Error) {
    console.error(error);
    sendUpdateMessage(
      {
        code: UPDATE_MESSAGE_STATUS.ERROR,
        message: error,
        error: JSON.stringify(error)
      },
      mainWindow
    );
  });
  autoUpdater.on('checking-for-update', function () {
    sendUpdateMessage(
      {
        code: UPDATE_MESSAGE_STATUS.CHECKING
      },
      mainWindow
    );
  });
  autoUpdater.on('update-available', function (info: any) {
    sendUpdateMessage(
      {
        code: UPDATE_MESSAGE_STATUS.UPDATE,
        message: info
      },
      mainWindow
    );
  });
  autoUpdater.on('update-not-available', function (info: any) {
    sendUpdateMessage(
      {
        code: UPDATE_MESSAGE_STATUS.NOT_UPDATE,
        message: info
      },
      mainWindow
    );
  });

  autoUpdater.on('download-progress', function (progressObj: any) {
    mainWindow.webContents.send('downloadProgress', progressObj);
  });

  autoUpdater.on('update-downloaded', function (...args: any) {
    sendUpdateMessage(
      {
        code: UPDATE_MESSAGE_STATUS.DOWNLOAD,
        message: args
      },
      mainWindow
    );
  });

  ipcMain.handle('isUpdateNow', (args: any) => {
    sendUpdateMessage(
      {
        code: UPDATE_MESSAGE_STATUS.SUCCESS,
        message: args
      },
      mainWindow
    );
    setTimeout(() => {
      autoUpdater.quitAndInstall();
    }, 2000);
  });


};
