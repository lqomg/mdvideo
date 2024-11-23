import { ChildProcess, fork } from 'child_process';
import { resolve } from 'path';
import { ICreateFFTask } from './createTask';
import { ChildProcessMsg } from '.';
import logger from '@main/log';

class TaskManager {
  private static instance: TaskManager | null;
  private childProcess!: ChildProcess;
  private taskListMap!: Map<string, { videoId: string;[k: string]: any }>;
  public updatedList!: any[];
  public preDownloadFileCount: number;
  private constructor() {
    this.updatedList = [];
  }
  static getInstance(force=false) {
    if (!this.instance || force) {
      const child = fork(resolve(__dirname, 'child.js'), ['child']);
      this.instance = new TaskManager();
      this.instance.taskListMap = new Map();
      this.instance.childProcess = child;
      this.instance.preDownloadFileCount = 0;
      this.instance.init();
    }
    return this.instance;
  }

  private init() {
    this.childProcess.on('message', (data: { msg: string; data: any }) => {
      if (data.msg === ChildProcessMsg.GetTaskId) {
        const { taskId, videoId } = data.data;
        const oldTaskId = this.getTaskIdByVideoId(videoId);
        if (oldTaskId) {
          this.taskListMap.delete(oldTaskId);
        }
        this.taskListMap.set(taskId, { videoId });
      }
      if (data.msg === ChildProcessMsg.GetTaskStates) {
        const { videoId, payload } = data.data;
        const taskId = this.getTaskIdByVideoId(videoId);
        if (taskId && videoId) {
          const npayload = this.taskListMap.get(taskId);

          this.taskListMap.set(taskId, {
            ...npayload,
            ...payload
          });
        }
      }
      // 提前下载资源
      if (
        data.msg === ChildProcessMsg.PreDownloadFileSuccess ||
        data.msg === ChildProcessMsg.PreDownloadFileError
      ) {
        this.preDownloadFileCount = this.preDownloadFileCount - 1;
      }
    });
    this.childProcess.on('close', (code: string, err: string) => {
      logger.error('子进程自动退出：' + code, err);
      this.taskListMap.clear();
      TaskManager.getInstance(true);
    });
  }
  private getTaskIdByVideoId(id: string) {
    for (const [key, val] of this.taskListMap) {
      if (val.videoId === id) {
        return key;
      }
    }
    return '';
  }
  sleep(wait = 10000) {
    return new Promise((res) => {
      setTimeout(() => {
        res(true);
      }, wait);
    });
  }
  async getTaskId(props: ICreateFFTask): Promise<string> {
    if (this.preDownloadFileCount > 0) {
      const primise = new Promise((res) => {
        const timer = setInterval(() => {
          if (this.preDownloadFileCount <= 0) {
            clearInterval(timer);
            res(true);
          }
        }, 1000);
      });
      await Promise.race([primise, this.sleep(20000)]);
    }
    try {
      this.childProcess.send(props);
      return new Promise((res, rej) => {
        const timer = setInterval(() => {
          const taskId = this.getTaskIdByVideoId(props.videoId);
          if (taskId) {
            clearInterval(timer);
            res(taskId);
          }
        }, 1000);
      });
    } catch (err) {
      logger.error('子进程出错：' + err);
      return Promise.resolve('');
    }
  }
  getTaskStatus(taskId?: string) {
    if (taskId) {
      const taskInfo = this.taskListMap.get(taskId);
      return taskInfo;
    }

    const taskList: any = [];
    for (const [key, val] of this.taskListMap) {
      taskList.push({
        taskId: key,
        ...(val || {})
      });
    }
    return taskList;
  }

  addUpdate(taskId: string) {
    this.updatedList.push(taskId);
  }

  downloadOnline(props: ICreateFFTask) {
    if (this.preDownloadFileCount >= 1) {
      logger.info('正在提前加载资源....')
      return Promise.resolve(true)
    }
    this.preDownloadFileCount = this.preDownloadFileCount + 1;
    try {
      this.childProcess.send({ ...props, preDownloadFile: true });
      return new Promise((res, rej) => {
        setTimeout(() => {
          res(true);
        }, 100);
      });
    } catch (err) {
      logger.error('子进程出错：' + err);
      return Promise.resolve('');
    }
  }
}

export const taskInstance = TaskManager.getInstance();
