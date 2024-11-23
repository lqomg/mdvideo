import logger from '@main/log';
import { createUUID } from '@main/utils';
import path from 'path';
import Cos from 'cos-nodejs-sdk-v5';
import { IMDElement, IMDProjectScene } from '@api/types';
import { cloneDeep } from 'lodash';
import { ICreateTemplate } from '@api/template';
import { localStore } from '@main/store';
import axios from 'axios';
import fs from 'fs-extra';
import { UPLOAD_TEMPLATE_DIR } from '@main/config';

export const uploadFile = async (filePath: string, cos: Cos, classify: string): Promise<string> => {
  if (filePath.startsWith('http')) {
    logger.info('在线的文件：' + filePath);
    return filePath;
  }
  const originname = path.basename(filePath);
  const ext = path.extname(filePath);
  const filename = createUUID() + ext;
  const key = `/templates/${classify || '经典常用'}/${filename}`;
  if (!fs.existsSync(filePath)) {
    logger.error('文件不存在' + filePath);
    return Promise.reject('文件不存在:' + filePath);
  }
  logger.info('上传文件中:' + filePath);

  return new Promise((res, rej) => {
    cos.uploadFile({
      Bucket: 'wvovw-1301321746',
      Region: 'ap-chengdu',
      Key: key,
      FilePath: filePath,
      onFileFinish: function (err, data, options) {
        logger.info(originname + '上传' + (err ? '失败' : '完成'));
        /* 非必须 */
        if (!err) {
          res(options.Key);
        } else {
          logger.error(err);
          rej(originname + '上传' + (err ? '失败' : '完成'));
        }
      },
      onProgress(p) {
        logger.info('进度: ' + p.percent);
      }
    });
  });
};

export const transformToJson = async (payload: ICreateTemplate['req']['payload'], cos: Cos) => {
  try {
    const { projectInfo, classify } = payload;
    const getUploadFile = (p: string) => uploadFile(p, cos, classify);
    const cover = await getUploadFile(payload.cover);
    const filePath = await getUploadFile(payload.filePath);
    if (projectInfo.audio) {
      projectInfo.audio = await getUploadFile(projectInfo.audio);
    }
    const scenes: IMDProjectScene[] = [];
    for (let i = 0; i < payload.scenes.length; i++) {
      const { commonStyle, elements, data, uuid } = payload.scenes[i];
      const backgroundImage = commonStyle.backgroundImage;
      const scene: IMDProjectScene = {
        elements: [],
        commonStyle,
        data,
        uuid
      };
      if (backgroundImage) {
        scene.commonStyle.backgroundImage = await getUploadFile(backgroundImage);
      }
      const nElements: IMDElement[] = [];
      for (let i = 0; i < elements.length; i++) {
        const { elName, propsValue } = elements[i];
        const nElement = cloneDeep(elements[i]);
        if (elName === 'md-audio' || elName === 'md-image') {
          if (propsValue.src) {
            nElement.propsValue.src = await getUploadFile(propsValue.src);
          }
        }
        if (elName === 'md-lottie') {
          if (propsValue.path) {
            nElement.propsValue.path = await getUploadFile(propsValue.path);
          }
        }
        if (elName === 'md-subtitle' || elName === 'md-text') {
          if (propsValue.voiceSrc) {
            nElement.propsValue.voiceSrc = await getUploadFile(propsValue.voiceSrc);
          }
          if (propsValue.fontPath) {
            nElement.propsValue.fontPath = await getUploadFile(propsValue.fontPath);
          }
        }
        if (elName === 'md-video') {
          if (propsValue.src) {
            nElement.propsValue.src = await getUploadFile(propsValue.src);
          }
          if (propsValue.cover) {
            nElement.propsValue.cover = await getUploadFile(propsValue.cover);
          }
        }
        nElements.push(nElement);
      }

      scene.elements = nElements;
      scenes.push(scene);
    }
    return {
      projectInfo,
      classify,
      cover,
      filePath,
      scenes
    };
  } catch (error) {
    logger.error(error);
    return null;
  }
};
const baseKey = 'cos-';
const BaseCosUrl = 'https://wvovw-1301321746.cos.ap-chengdu.myqcloud.com/';
const dowloadFile = async (p: string): Promise<string> => {
  if (p.startsWith('http')) {
    logger.info('在线的文件!');
    return p;
  }
  const key = baseKey + p;
  const localPath = localStore.get(key) as string;
  if (localPath) {
    return localPath;
  }
  const file = path.join(UPLOAD_TEMPLATE_DIR, p);
  await fs.ensureFileSync(file);
  return new Promise((res, rej) => {
    axios
      .get(BaseCosUrl + p, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        },
        responseType: 'stream'
      })
      .then((response) => {
        const writeStream = fs.createWriteStream(file);
        response.data.pipe(writeStream);
        writeStream.on('error', (error) => {
          logger.error(`文件下载失败：${error}`);
          rej(`文件下载失败：${error}`);
        });
        writeStream.on('finish', () => {
          logger.info(`文件下载完成`);
          localStore.set(key, file);
          res(file);
        });
      })
      .catch((error) => {
        logger.error(`文件下载失败：${error}`);
        rej(error);
      });
  });
};
export const transformToLocalJson = async (payload: ICreateTemplate['req']['payload']) => {
  try {
    const { projectInfo, classify } = payload;
    const cover = await dowloadFile(payload.cover);
    const filePath = await dowloadFile(payload.filePath);
    if (projectInfo.audio) {
      projectInfo.audio = await dowloadFile(projectInfo.audio);
    }
    const scenes: IMDProjectScene[] = [];
    for (let i = 0; i < payload.scenes.length; i++) {
      const { commonStyle, elements, data, uuid } = payload.scenes[i];
      const backgroundImage = commonStyle.backgroundImage;
      const scene: IMDProjectScene = {
        elements: [],
        commonStyle,
        data,
        uuid
      };
      if (backgroundImage) {
        scene.commonStyle.backgroundImage = await dowloadFile(backgroundImage);
      }
      const nElements: IMDElement[] = [];
      for (let i = 0; i < elements.length; i++) {
        const { elName, propsValue } = elements[i];
        const nElement = cloneDeep(elements[i]);
        if (elName === 'md-audio' || elName === 'md-image') {
          if (propsValue.src) {
            nElement.propsValue.src = await dowloadFile(propsValue.src);
          }
        }
        if (elName === 'md-lottie') {
          if (propsValue.path) {
            nElement.propsValue.path = await dowloadFile(propsValue.path);
          }
        }
        if (elName === 'md-subtitle' || elName === 'md-text') {
          if (propsValue.voiceSrc) {
            nElement.propsValue.voiceSrc = await dowloadFile(propsValue.voiceSrc);
          }
          if (nElement.propsValue.fontPath) {
            nElement.propsValue.fontPath = await dowloadFile(propsValue.fontPath);
          }
        }
        if (elName === 'md-video') {
          if (propsValue.src) {
            nElement.propsValue.src = await dowloadFile(propsValue.src);
          }
          if (propsValue.cover) {
            nElement.propsValue.cover = await dowloadFile(propsValue.cover);
          }
        }
        nElements.push(nElement);
      }
      scene.elements = nElements;
      scenes.push(scene);
    }
    return {
      projectInfo,
      classify,
      cover,
      filePath,
      scenes
    };
  } catch (error) {
    logger.error(error);
    return null;
  }
};
