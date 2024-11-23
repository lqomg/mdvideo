import { IGetPage, IDeletePage } from '@api/page';
import { getPages, removePage } from '@main/database/page';
import { createResponsePayload } from '@main/utils';
import { ipcMain } from 'electron';

ipcMain.handle(
  'getPage',
  async (_event: Electron.IpcMainInvokeEvent, args: IGetPage['req']): Promise<IGetPage['res']> => {
    const { payload } = args;
    const { _id, keyword = '', vertical } = payload;
    const query = { keyword };
    if (_id) {
      query['_id'] = _id;
    }
    if (vertical !== undefined) {
      query['vertical'] = vertical;
    }
    const { total, docs } = await getPages(query);
    return createResponsePayload({ total, data: docs as any });
  }
);

ipcMain.handle(
  'deletePage',
  async (
    _event: Electron.IpcMainInvokeEvent,
    args: IDeletePage['req']
  ): Promise<IDeletePage['res']> => {
    const { payload } = args;
    const { _id } = payload;
    const num = await removePage(_id);
    return createResponsePayload({ num });
  }
);
