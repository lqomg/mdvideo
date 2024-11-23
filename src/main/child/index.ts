import createFFTask, { ICreateFFTask } from '@main/child/createTask';
import { createUUID } from '@main/utils';
import preDownloadOnline from './preDownloadOnline';

export const ChildProcessMsg = {
  GetTaskId: 'getTaskId',
  GetTaskStates: 'getTaskStatus',
  PreDownloadFileSuccess: 'PreDownloadFileSuccess',
  PreDownloadFileError: 'PreDownloadFileError'
};

process.on('message', function (data: ICreateFFTask) {
  const taskId = createUUID();
  if (data.preDownloadFile) {
    preDownloadOnline(data);
  } else {
    createFFTask(data);
    process.send!({
      msg: ChildProcessMsg.GetTaskId,
      data: {
        taskId,
        videoId: data.videoId
      }
    });
  }
});
