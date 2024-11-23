import logger from '@main/log';
import zipExe from '../../../resources/7-Zip/7z.exe?asset&asarUnpack';
import Seven from 'node-7z';
export const decodeZipFile = async (
  filePath: string,
  target: string,
  callback: (message: string) => void
) => {
  return new Promise((res, rej) => {
    try {
      // macos：https://www.npmjs.com/package/node-7z#options
      const stream = Seven.extractFull(filePath, target, {
        $bin: zipExe,
        $progress: true,
        password: 'wvovw@lq02'
      });
      stream.on('progress', (data) => {
        const { percent, fileCount } = data || {};
        if (percent && fileCount) {
          const mgs = `解压中...   \n\t当前解压进度： ${percent}%，已扫描文件数:${Math.ceil(
            fileCount * 1.2
          )}个`;
          callback(mgs);
        }
      });
      stream.on('end', (data) => {
        logger.info('解压文件成功:' + data);
        res(true);
      });
      stream.on('error', (data) => {
        logger.error('解压文件失败：' + filePath);
        logger.error(data);
        rej(false);
      });
    } catch (error) {
      logger.error('解压文件失败：' + filePath);
      rej(false);
    }
  });
};
