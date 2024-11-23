import { IMDProjectInfo, IMDProjectScene, RequestPayload, ResponsePayload } from './types';

export const SendTaskList = 'sendTaskList';
export interface ICreatePage {
  req: RequestPayload<{
    _id?: string;
    isTempate?: boolean;
    isSave?: boolean; // 只保存，不生成视频
    projectInfo: IMDProjectInfo;
    scenes: IMDProjectScene[];
    markdown?: any;
    isMarkdownSource?: boolean;
    clarity?: string;
  }>;
  res: ResponsePayload<{ videoId?: string; taskId?: string }>;
}

export interface IPageInfo {
  _id: string;
  projectInfo: IMDProjectInfo;
  scenes: IMDProjectScene[];
  isTempate: boolean;
  filePath?: string;
  cover?: string;
  markdown?: any;
  isMarkdownSource?: boolean;
}

export interface IGetPage {
  req: RequestPayload<{
    _id?: string;
    keyword?: string;
    vertical?: boolean;
  }>;
  res: ResponsePayload<{
    total: number;
    data: IPageInfo[];
  }>;
}

export interface IDeletePage {
  req: RequestPayload<{ _id: string }>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  res: ResponsePayload<{}>;
}
