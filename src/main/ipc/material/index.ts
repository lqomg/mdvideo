import { IGetMaterial } from '@api/material';
import { createResponsePayload } from '@main/utils';
import { ipcMain } from 'electron';
import { getDirectoryStructure } from './getDir';

ipcMain.handle(
  'getMaterials',
  async (
    _event: Electron.IpcMainInvokeEvent,
    args: IGetMaterial['req']
  ): Promise<IGetMaterial['res']> => {
    const { payload } = args;
    const { directoryPath } = payload;
    const { files, directories } = await getDirectoryStructure(directoryPath)
    return createResponsePayload({
      files,
      directories
    });
  }
);
