import logger from '@main/log';
import { dialog, ipcMain, shell } from 'electron';
import ip from 'ip';
ipcMain.handle('openUrl', (_event, url) => {
  if (url) {
    shell.openExternal(url);
  }
  return;
});

ipcMain.handle('getIp', (_event) => {
  logger.info(ip.address());
  return ip.address();
});

ipcMain.handle('selectDirectory', async (_event) => {
  try {
    const re = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    return re.filePaths;
  } catch (error) {
    logger.error('打开文件夹失败：', error);
    return '';
  }
});

ipcMain.handle('openDirectory', async (_event, url) => {
  try {
    shell.openItem(url)
    return;
  } catch (error) {
    logger.error('打开文件夹失败：', error);
    return '';
  }
});
