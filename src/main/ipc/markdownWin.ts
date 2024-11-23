import { MainWinSendToMarkdownWin, MarkdownWinSendToMainWin } from '@api/index';
import { winsInstance } from '@main/winManager';
import { ipcMain } from 'electron';

ipcMain.handle(MainWinSendToMarkdownWin, (_event, args) => {
  winsInstance.markdownWin.webContents.send(MainWinSendToMarkdownWin, args);
});

ipcMain.handle(MarkdownWinSendToMainWin, (_event, args) => {
  winsInstance.mainWin.webContents.send(MarkdownWinSendToMainWin, args);
});
