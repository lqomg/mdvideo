import { IMDProjectInfo, IMDProjectScene, RequestPayload, ResponsePayload } from './types';

export interface ITemplateInfo {
  cover: string;
  filePath: string;
  projectInfo: IMDProjectInfo;
  classify: string;
  scenes: IMDProjectScene[];
}

export interface ICreateTemplate {
  req: RequestPayload<ITemplateInfo>;
  res: ResponsePayload<{
    data?: ITemplateInfo;
    msg?: string;
  }>;
}

export interface IApplyTemplate {
  req: RequestPayload<ITemplateInfo>;
  res: ResponsePayload<{
    data?: ITemplateInfo;
    msg?: string;
  }>;
}
