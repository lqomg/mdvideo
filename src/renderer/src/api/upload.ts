import { IUploadAudio, IUploadImage, IUploadVideo } from '@api/resource';
import { fileToBase64 } from '@renderer/utils';
import { UploadRawFile } from 'element-plus';

export const uploadAudio = async (rawFile: UploadRawFile, sourceType = 'voice') => {
  const name = rawFile.name;
  const filePath = rawFile.path;
  const { data } = await window.invoke<IUploadAudio['req'], IUploadAudio['res']>('uploadAudio', {
    payload: {
      filePath,
      type: rawFile.type,
      name,
      sourceType,
      ext: name.slice(name.lastIndexOf('.') + 1)
    }
  });
  data.name = name;
  return data;
};

export const uploadVideo = async (rawFile: UploadRawFile) => {
  const name = rawFile.name;
  const filePath = rawFile.path;
  const { data } = await window.invoke<IUploadVideo['req'], IUploadVideo['res']>('uploadVideo', {
    payload: {
      filePath,
      type: rawFile.type,
      name,
      ext: name.slice(name.lastIndexOf('.') + 1)
    }
  });
  return data;
};

export const uploadOnlineVideo = async (url: string) => {
  const name = 'dsl-online';
  const { data } = await window.invoke<IUploadVideo['req'], IUploadVideo['res']>('uploadVideo', {
    payload: {
      name,
      sourceType: 'online-video',
      filePath: url,
      type: 'mp4',
      ext: 'mp4'
    }
  });
  return data;
};

export const uploadImage = async (rawFile: UploadRawFile, type = 'image') => {
  const base64 = await fileToBase64(rawFile);
  const name = rawFile.name;
  const { data } = await window.invoke<IUploadImage['req'], IUploadImage['res']>('uploadImage', {
    payload: {
      file: base64 as any,
      type,
      name,
      ext: name.slice(name.lastIndexOf('.') + 1)
    }
  });
  return data;
};
