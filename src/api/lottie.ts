import { RequestPayload, ResponsePayload } from './types';

export interface IGetLottie {
  req: RequestPayload<{
    json: any;
  }>;
  res: ResponsePayload<{
    basePath: string;
    list: {
      categoryId: string;
      categoryName: string;
      children: any[];
    }[];
  }>;
}
