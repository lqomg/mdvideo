import { RequestPayload, ResponsePayload } from './types';

export interface IGetLocalFont {
  req: RequestPayload<undefined>;
  res: ResponsePayload<{
    list: { fontName: string; fontFile: string; id: string }[];
  }>;
}
