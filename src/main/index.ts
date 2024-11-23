import { app, shell, BrowserWindow, session, globalShortcut } from 'electron';
import path, { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import './config';
import './ipc';
import './database';
import { checkUpdater } from './checkUpdater';
import { schedule } from './ipc/schedule';
import { winsInstance } from './winManager';
app.disableHardwareAcceleration();

function createWindow() {
  const mainWindow = winsInstance.createMainWin();
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    mainWindow.maximize();
    mainWindow.setMenu(null);
  });
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
  return mainWindow;
}
function createMarkdownWin() {
  const markdownWin = winsInstance.createMarkdownWin();

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    markdownWin.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#/markdownCore');
  } else {
    markdownWin.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: '#markdownCore'
    });
  }
  return markdownWin;
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  const mainWindow = createWindow();
  const markwodnWin = createMarkdownWin();

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });
  schedule(mainWindow);
  checkUpdater(mainWindow);
  if (is.dev) {
    mainWindow && mainWindow.webContents.openDevTools({ mode: 'right' });
    markwodnWin && markwodnWin.webContents.openDevTools({ mode: 'right' });
  }
  globalShortcut.register('CommandOrControl+Alt+P+6', function () {
    mainWindow && mainWindow.webContents.openDevTools({ mode: 'right' });
    markwodnWin && markwodnWin.webContents.openDevTools({ mode: 'right' });
  });
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  mainWindow.on('close', () => {
    if (markwodnWin?.isClosable()) {
      markwodnWin.close()
    }
  })
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

app.on('ready', () => {
  const filter = {
    urls: []
  };
  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    details.requestHeaders['Referer'] = 'https://a.wvovw.com';
    callback({ requestHeaders: details.requestHeaders });
  });
});
