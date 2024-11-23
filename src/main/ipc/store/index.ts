/* eslint-disable @typescript-eslint/no-unused-vars */
import { IGetStoreConfig, ISetStoreConfig, IStoreConfigStete } from '@api/store';
import { app, ipcMain } from 'electron';
import path from 'path';
import { createResponsePayload } from '@main/utils';
import { cloneDeep } from 'lodash';
import { localStore } from '@main/store';
import logger from '@main/log';

// 获取安装目录（也就是文件安装目录中exe文件的目录）
const homeDir = path.dirname(app.getPath('exe'));
const defaultStoreState: IStoreConfigStete = {
  rootDir: homeDir,
  vertical: true,
  aiVioces: [],
  userInfo: {
    id: '',
    email: '',
    username: '',
    speech: 0,
    totalSpeech: 0,
    allTotalSpeech: 10000,
    voiceStr: ''
  },
  token: ''
};

ipcMain.handle(
  'getStoreConfig',
  (_event: Electron.IpcMainInvokeEvent, args: IGetStoreConfig['req']): IGetStoreConfig['res'] => {
    const p = localStore.get('appConfig');
    let response = cloneDeep(defaultStoreState);
    // const resourcePath = localStore.get('resourcePath') as string;
    if (p) {
      response = {
        ...response,
        ...p,
        // resourcePath
      };
    }
    return createResponsePayload(response);
  }
);

ipcMain.handle(
  'setStoreConfig',
  (_event: Electron.IpcMainInvokeEvent, args: ISetStoreConfig['req']): ISetStoreConfig['res'] => {
    const { payload = {} } = args;
    const p = localStore.get('appConfig');
    let response = cloneDeep(defaultStoreState);
    // const resourcePath = localStore.get('resourcePath') as string;
    if (p) {
      response = {
        ...response,
        ...p,
        // resourcePath
      };
    }
    const nConfig = { ...response, ...payload };
    localStore.set('appConfig', nConfig);
    return createResponsePayload(nConfig);
  }
);
