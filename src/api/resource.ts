import { RequestPayload, ResponsePayload } from './types';

export const UploadSourceState = 'uploadSourceState';

export interface ICreateVoice {
  req: RequestPayload<{
    text: string;
    volume: number;
    speed: number;
    type: number;
    voiceType: string;
  }>;
  res: ResponsePayload<{ path: string; duration: number }>;
}

export interface IUploadImage {
  req: RequestPayload<{ file: string; type: string; ext: string; name: string }>;
  res: ResponsePayload<{ path: string; id: string }>;
}

export const IUploadImageType = {
  Background: 'bg',
  LocalImage: 'local',
  Online: 'online', // 在线图片
  Crop: 'crop', // 裁剪
  Markdwon: 'markdwon'
};

export interface IUploadVideo {
  req: RequestPayload<{
    filePath: string;
    type: string;
    ext: string;
    name: string;
    sourceType?: string;
  }>;
  res: ResponsePayload<{
    path: string;
    id: string;
    cover: string;
    meta: {
      width: number;
      height: number;
      duration: number;
    } | null;
  }>;
}

export interface ICutVideo {
  req: RequestPayload<{
    filePath: string;
    start: number;
    to: number;
  }>;
  res: ResponsePayload<{
    path: string;
    cover: string;
    meta: {
      width: number;
      height: number;
      duration: number;
    } | null;
  }>;
}
export interface IUploadAudio {
  req: RequestPayload<{
    filePath: string;
    type: string;
    sourceType: string;
    ext: string;
    name: string;
  }>;
  res: ResponsePayload<{ path: string; id: string; duration: number }>;
}

export interface IUploadSources {
  req: RequestPayload<{ path: string; filename: string }>;
  res: ResponsePayload<any>;
}

export interface IGetSources {
  req: RequestPayload<{ vertical?: boolean; keyword: string; type: string; className?: string }>;
  res: ResponsePayload<{ total: number; data: any[] }>;
}
