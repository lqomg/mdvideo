import { getVideoInfo, isAudio, isFont, isGif, isImage, isVideo } from '@main/utils';
import fs from 'fs-extra';
import path from 'path';

export const getDirectoryStructure = async (directoryPath: string) => {
  const files: { name: string; path: string; ext: string }[] = []; // 存放文件列表
  const directories: { name: string; path: string }[] = []; // 存放子目录列表

  try {
    const items = fs.readdirSync(directoryPath); // 读取指定路径下的所有项

    for (let i = 0; i < items.length; i++) {
      const itemPath = path.join(directoryPath, items[i]); // 组合当前项的完整路径

      if (fs.statSync(itemPath).isFile()) {
        const ext = path.extname(itemPath).slice(1);
        // const info = {};
        // if (isVideo(ext) || isImage(ext) || isGif(ext) || isAudio(ext) || isFont(ext)) {
        //   const meta = await getVideoInfo(itemPath);
        //   console.log(meta);
        // }
        files.push({
          name: items[i].replace(/(\.ttf)|(\.otf)$/gi, ''),
          path: itemPath,
          ext
        }); // 如果是文件则添加到files数组中
      } else {
        directories.push({
          name: items[i],
          path: itemPath
        });
      }
    }
  } catch (error) {
    console.log(`Error reading directory ${directoryPath}:`, error);
    return { files, directories };
  }
  files.sort((a, b) => a.ext.localeCompare(b.ext));
  return { files, directories };
};
