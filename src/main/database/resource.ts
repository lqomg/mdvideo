import logger from '@main/log';
import {
  audioSourceDB,
  bgsSourceDB,
  bg3dDB,
  bgColorsDB,
  fontsDB,
  imagesSourceDB,
  qbqSourceDB,
  videosSourceDB,
  musicsDB
} from '.';

export const getSourceDB = (type: string) => {
  if (type === 'images') {
    return imagesSourceDB;
  } else if (type === 'videos') {
    return videosSourceDB;
  } else if (type === 'audios') {
    return audioSourceDB;
  } else if (type === 'bgs') {
    return bgsSourceDB;
  } else if (type === 'qbq') {
    return qbqSourceDB;
  } else if (type === 'bg3d') {
    return bg3dDB;
  } else if (type === 'bgColors') {
    return bgColorsDB;
  } else if (type === 'fonts') {
    return fontsDB;
  } else if (type === 'musics') {
    return musicsDB;
  }
  logger.error('不支持的资源类型：' + type);
  throw new Error('不支持的资源类型：' + type);
};
export type ISourceDBType =
  | 'images'
  | 'videos'
  | 'audios'
  | 'bgs'
  | 'qbq'
  | 'bg3d'
  | 'bgColors'
  | 'fonts'
  | 'musics';
export const SourceDBTypes: ISourceDBType[] = [
  'images',
  'videos',
  'audios',
  'bgs',
  'qbq',
  'bg3d',
  'bgColors',
  'fonts',
  'musics'
];
export const insertSource = async (payload: any[], type: ISourceDBType) => {
  const sourceDB = getSourceDB(type);
  return sourceDB.insertAsync(payload);
};

export const removeSource = async (id: string, type: ISourceDBType) => {
  const sourceDB = getSourceDB(type);
  const numRemoved = await sourceDB.removeAsync({ id }, {});
  return numRemoved;
};

export const clearSource = async (type: ISourceDBType) => {
  const sourceDB = getSourceDB(type);
  return await sourceDB.removeAsync({}, { multi: true });
};
export const clearAllSource = async () => {
  for (let i = 0; i < SourceDBTypes.length; i++) {
    const type = SourceDBTypes[i];
    const sourceDB = getSourceDB(type);
    await sourceDB.removeAsync({}, { multi: true });
  }
  return true;
};
export const updateSource = async (id: string, payload: any = {}, type: ISourceDBType) => {
  const sourceDB = getSourceDB(type);
  const doc = await sourceDB.updateAsync({ id }, { $set: { ...payload } }, {});
  return doc;
};

export const getSources = async (query: any = {}, type: ISourceDBType) => {
  logger.info('查询数据：', query);
  const keyword = query.keyword;
  delete query.keyword;
  if (query.vertical === undefined) {
    delete query.vertical;
  }
  if (query.className === '') {
    delete query.className;
  }
  const q = {
    ...query
  };
  if (keyword) {
    q['$or'] = [
      {
        className: new RegExp(keyword, 'ig')
      },
      {
        name: new RegExp(keyword, 'ig')
      },
      {
        fileName: new RegExp(keyword, 'ig')
      }
    ];
  }
  const sourceDB = getSourceDB(type);
  const docs = await sourceDB.findAsync(q);
  const total = await sourceDB.countAsync(q);
  return {
    total,
    docs
  };
};
