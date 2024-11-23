/* eslint-disable @typescript-eslint/no-unused-vars */
import { IGetLocalFont } from '@api/font';
import { localStore } from '@main/store';
import { createResponsePayload, getFonts } from '@main/utils';
import { ipcMain } from 'electron';

ipcMain.handle(
  'getLocalFont',
  async (
    _event: Electron.IpcMainInvokeEvent,
    _args: IGetLocalFont['req']
  ): Promise<IGetLocalFont['res']> => {
    try {
      const appConfig = localStore.get('appConfig') as any;
      const fonts = await getFonts(appConfig);
      return createResponsePayload({
        list: fonts.map((doc) => {
          return {
            fontName: doc.fileName.replace(/(\.ttf)|(\.otf)$/gi, ''),
            fontFile: doc.filePath,
            id: doc.id
          };
        })
      });
    } catch (error) {
      console.log(error);
      return createResponsePayload({ list: [] });
    }
  }
);
