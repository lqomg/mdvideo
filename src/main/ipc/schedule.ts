import { TaskStates } from '@api/contanst';
import { SendTaskList } from '@api/page';
import { taskInstance } from '@main/child/taskManager';
import { updatePage } from '@main/database/page';
import logger from '@main/log';

export const schedule = (mainWindow: any) => {
  setInterval(() => {
    try {
      const taskList = taskInstance.getTaskStatus();
      for (let i = 0; i < taskList.length; i++) {
        const { videoId, taskId, states, ...payload } = taskList[i];
        if (!taskInstance.updatedList.includes(taskId)) {
          if (states === TaskStates.Error || states === TaskStates.Complete) {
            updatePage(videoId, {
              ...payload,
              states
            });
            taskInstance.addUpdate(taskId);
          }
        }
      }
      mainWindow.send?.(SendTaskList, taskList);
    } catch (error) {
      logger.error('schedule', error);
    }
  }, 1000);
};
