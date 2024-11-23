import { ICreateTemplate, IApplyTemplate } from '@api/template';
import { createResponsePayload } from '@main/utils';
import { ipcMain } from 'electron';
import { getPolicyCos } from '@main/utils/getPolicyCos';
import { transformToJson, transformToLocalJson } from './utils';
import logger from '@main/log';

ipcMain.handle(
  'createTemplate',
  async (
    _event: Electron.IpcMainInvokeEvent,
    args: ICreateTemplate['req']
  ): Promise<ICreateTemplate['res']> => {
    try {
      const { payload } = args;
      const cos = await getPolicyCos();
      if (!cos) {
        return createResponsePayload({ msg: '获取权限失败' }, 403);
      }
      const data = await transformToJson(payload, cos);
      if (data) {
        return createResponsePayload({ data });
      } else {
        return createResponsePayload({ msg: '创建失败，请查看错误日志' });
      }
    } catch (error) {
      logger.error(error);
      return createResponsePayload({ msg: '创建失败，请查看错误日志' });
    }
  }
);

ipcMain.handle(
  'applyTemplate',
  async (
    _event: Electron.IpcMainInvokeEvent,
    args: IApplyTemplate['req']
  ): Promise<IApplyTemplate['res']> => {
    const { payload } = args;
    const data = await transformToLocalJson(payload);
    if (data) {
      return createResponsePayload({ data });
    } else {
      return createResponsePayload({ msg: '创建失败，请查看错误日志' });
    }
  }
);
