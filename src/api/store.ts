import { TaskStates } from './contanst';
import { IMDProjectInfo, RequestPayload, ResponsePayload } from './types';

export interface IStoreConfigStete {
  vertical: boolean;
  updateUrl?: string;
  versionInfo?: string;
  imageUrl?: string;
  userInfo: {
    id: string;
    email: string;
    username: string;
    speech: number;
    voiceStr: string;
    totalSpeech: number;
    allTotalSpeech: number;
  };
  rootDir: string;
  token: string;
  aiVioces: {
    id: string | number;
    count: number;
    label: string;
    name: string;
    type: string;
    vType: string;
    speed: number;
    volume: number;
    emotion?: string;
  }[];
  resourcePath?: string;
}

export interface ITaskState {
  taskId: string;
  videoId: string;
  states?: TaskStates;
  percentage: number;
  cover: string;
  filePath: '';
  projectInfo: IMDProjectInfo;
}

export interface IGetStoreConfig {
  req: RequestPayload<{
    // config
  }>;
  res: ResponsePayload<IStoreConfigStete>;
}

export interface ISetStoreConfig {
  req: RequestPayload<Partial<IStoreConfigStete>>;
  res: ResponsePayload<IStoreConfigStete>;
}
