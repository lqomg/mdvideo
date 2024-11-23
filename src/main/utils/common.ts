import fs from 'fs-extra';
import path from 'path';
import SystemFonts from 'system-font-families';
import { getDirectoryStructure } from '@main/ipc/material/getDir';
import logger from '@main/log';
import { IStoreConfigStete } from '@api/store';

export const mkdirs = (dirname: string, callback: () => void) => {
  const exists = fs.existsSync(dirname);
  if (exists) {
    callback();
  } else {
    mkdirs(path.dirname(dirname), function () {
      fs.mkdirSync(dirname);
    });
  }
};
export const fsExistsSync = (paths) => {
  try {
    fs.statSync(paths);
  } catch (error) {
    mkdirs(paths, () => {});
  }
};

const imageTypes = ['png', 'jpg', 'jpeg', 'gif'];
const videoTypes = ['mp4', 'avi', 'mov'];
const audioTypes = ['mp3', 'ogg', 'wav'];
const fontTypes = ['ttf', 'otf'];
export const isImage = (ext: string) => imageTypes.find((s) => ext.toLocaleLowerCase() === s);
export const isVideo = (ext: string) => videoTypes.find((s) => ext.toLocaleLowerCase() === s);
export const isGif = (ext: string) => ext === 'gif';
export const isAudio = (ext: string) => audioTypes.find((s) => ext.toLocaleLowerCase() === s);
export const isFont = (ext: string) => fontTypes.find((s) => ext.toLocaleLowerCase() === s);

export const getFonts = async (appConfig?: IStoreConfigStete) => {
  try {
    let fonts: any[] = [];
    const resourcePath = appConfig?.resourcePath;
    if (resourcePath) {
      const fontsPath = path.join(resourcePath, '字体');
      const { files } = await getDirectoryStructure(fontsPath);
      if (files.length) {
        fonts = files.map((f) => {
          return {
            id: f.name.replace('.' + f.ext, ''),
            fileName: f.name.replace('.' + f.ext, ''),
            filePath: f.path
          };
        });
      }
    }
    const systemFonts = new SystemFonts.default();
    let systemFontList = systemFonts.getFontsExtendedSync();
    const nots = ['Webdings', 'Wingdings'];
    systemFontList = systemFontList
      .map((font) => {
        return {
          id: font.family,
          fileName: '系统字体-' + font.family,
          filePath: font.files?.Regular
        };
      })
      .filter((f) => f.filePath && !nots.includes(f.id))
      .sort((a, b) => (a.filePath.startsWith('C:\\Windows') ? 1 : -1));

    return fonts.concat(systemFontList);
  } catch (error) {
    logger.error(error);
    return [];
  }
};
