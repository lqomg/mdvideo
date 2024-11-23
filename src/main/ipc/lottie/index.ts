/* eslint-disable @typescript-eslint/no-unused-vars */
import { ipcMain } from 'electron';
import { IGetLottie } from '@api/lottie';
import { groupBy } from 'lodash';
import { createResponsePayload } from '@main/utils';
import { localStore } from '@main/store';

ipcMain.handle(
  'getLottie',
  async (
    _event: Electron.IpcMainInvokeEvent,
    _args: IGetLottie['req']
  ): Promise<IGetLottie['res']> => {
    const data = _args.payload.json || [];
    const groupCategory = groupBy(data, 'categoryName');
    const basePath = localStore.get('appConfig')?.resourcePath;
    const list: { categoryId: string; categoryName: string; children: any[] }[] = [];
    for (const categoryName in groupCategory) {
      if (Object.prototype.hasOwnProperty.call(groupCategory, categoryName)) {
        const elements = groupCategory[categoryName];
        list.push({
          categoryName,
          categoryId: elements[0].categoryId,
          children: elements
        });
      }
    }
    return createResponsePayload({
      list,
      basePath
    });
  }
);
