import { uploadDB } from '.';

export const insertFile = async (payload: { id: string; path: string; [k: string]: any }) => {
  return uploadDB.insertAsync({
    ...payload
  });
};

export const removeFile = async (id: string) => {
  const numRemoved = await uploadDB.removeAsync({ id }, {});
  return numRemoved;
};

export const updateFile = async (id: string, payload: any = {}) => {
  const doc = await uploadDB.updateAsync({ id }, { $set: { ...payload } }, {});
  return doc;
};

export const getFile = async (query: any = {}) => {
  const docs = await uploadDB.findAsync(query);
  const total = await uploadDB.countAsync(query);
  return {
    total,
    docs
  };
};
