import { voiceDB } from '.';

export const insertVoice = async (payload: { md5Id: string; [k: string]: any }) => {
  return voiceDB.insertAsync({
    ...payload
  });
};

export const removeVoice = async (id: string) => {
  const numRemoved = await voiceDB.removeAsync({ id }, {});
  return numRemoved;
};

export const getVoiceByMd5Id = async (id: string) => {
  const docs = await voiceDB.findOneAsync({ md5Id: id });
  return docs;
};
