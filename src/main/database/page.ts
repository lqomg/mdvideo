import logger from '@main/log';
import { pageDB } from '.';

export const insertPage = async (payload: any) => {
  return pageDB.insertAsync(payload);
};

export const removePage = async (id: string) => {
  const numRemoved = await pageDB.removeAsync({ _id: id }, {});
  return numRemoved;
};

export const clearPage = async () => {
  return await pageDB.removeAsync({}, { multi: true });
};

export const updatePage = async (id: string, payload: any = {}) => {
  const oldDoc = await pageDB.findOneAsync({ _id: id });
  const historys = (oldDoc && oldDoc.historys) || [];
  historys.push(payload);
  const doc = await pageDB.updateAsync({ _id: id }, { $set: { ...payload, historys } }, {});
  return doc;
};

export const getPages = async (query: any = {}) => {
  const keyword = query.keyword;
  delete query.keyword;
  const q = {
    ...query
  };
  if (keyword) {
    q['$or'] = [
      {
        'projectInfo.title': new RegExp(keyword, 'ig')
      }
    ];
  }
  const docs = await pageDB.findAsync(q).sort({ updatedAt: -1 });
  const total = await pageDB.countAsync(q);
  return {
    total,
    docs
  };
};
