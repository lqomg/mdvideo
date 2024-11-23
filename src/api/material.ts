import { RequestPayload, ResponsePayload } from './types';
export interface IGetDirProps {
  files: { name: string; path: string, ext: string }[];
  directories: { name: string; path: string, }[];
}
export interface IGetMaterial {
  req: RequestPayload<{
    directoryPath: string;
  }>;
  res: ResponsePayload<IGetDirProps>;
}
