import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR, CACHE_DIR, ONLONE_FILE_DIR } from '@main/config';
import ffmpeg from '@main/ffmpeg';
import logger from '@main/log';
import { createUUID } from '@main/utils';
import path from 'path';
import fs from 'fs';
import { Database } from 'ark.db';
import { toMD5 } from '@main/utils/md5';
const db = new Database(ONLONE_FILE_DIR);

export const chinaPathToEn = async (filePath: string): Promise<string> => {
  const dbMd5 = toMD5(filePath);
  const f = db.get(dbMd5);
  if (f) {
    return f;
  }
  return new Promise((res, rej) => {
    const extname = path.extname(filePath);
    const savePath = path.join(UPLOAD_IMAGE_DIR, createUUID() + extname);
    ffmpeg(filePath)
      .output(savePath)
      .on('end', async () => {
        logger.info('中文路径转换成功', savePath);
        db.set(dbMd5, savePath);
        res(savePath);
      })
      .on('error', (err) => {
        logger.error('中文路径转换失败', filePath, err);
        res(filePath);
      })
      .run();
  });
};

export const getOnlineImage = async (filePath: string): Promise<string> => {
  const dbMd5 = toMD5(filePath);
  const f = db.get(dbMd5);
  if (f) {
    return f;
  }
  return new Promise((res, rej) => {
    const extname = path.extname(filePath);
    const savePath = path.join(UPLOAD_IMAGE_DIR, createUUID() + extname);
    ffmpeg(filePath)
      .output(savePath)
      .on('end', async () => {
        logger.info('下载在线文件成功', savePath);
        db.set(dbMd5, savePath);
        res(savePath);
      })
      .on('error', (err) => {
        logger.error('下载在线图片文件成功', filePath, err);
        res(filePath);
      })
      .run();
  });
};

export const getOnlineVideoOrAudio = (filePath: string): Promise<string> => {
  const dbMd5 = toMD5(filePath);
  const f = db.get(dbMd5);
  if (f) {
    return f;
  }
  return new Promise((res, rej) => {
    const extname = path.extname(filePath);
    const savePath = path.join(UPLOAD_VIDEO_DIR, createUUID() + extname);
    ffmpeg(filePath)
      .output(savePath)
      .on('end', () => {
        logger.info('下载在线视频/音频文件成功', savePath);
        db.set(dbMd5, savePath);
        res(savePath);
      })
      .on('error', (err) => {
        logger.error('下载在线视频/音频文件失败', filePath, err);
        res(filePath);
      })
      .run();
  });
};

export const base64ToPng = (data: string) => {
  const base64 = data.replace(/^data:image\/\w+;base64,/, ''); //去掉图片base64码前面部分data:image/png;base64
  // new Buffer 操作权限太大，v6.0后使用Buffer.from()创建构造函数
  const dataBuffer = Buffer.from(base64, 'base64'); //把base64码转成buffer对象，
  const imagePath = path.join(UPLOAD_IMAGE_DIR, createUUID() + '.png');
  return new Promise((res, rej) => {
    fs.writeFile(imagePath, dataBuffer, function (err) {
      //用fs写入文件
      if (err) {
        logger.error('base64转PNG失败：', err);
        res('');
      } else {
        logger.info('base64转PNG成功：' + imagePath);
        res(imagePath);
      }
    });
  });
};

export const webpToPng = (filePath: string): Promise<string> => {
  const dbMd5 = toMD5(filePath);
  const f = db.get(dbMd5);
  if (f) {
    return f;
  }
  return new Promise((res, rej) => {
    const savePath = path.join(UPLOAD_IMAGE_DIR, createUUID() + '.png');
    ffmpeg(filePath)
      .output(savePath)
      .on('end', () => {
        logger.info('webp转Png成功', savePath);
        db.set(dbMd5, savePath);
        res(savePath);
      })
      .on('error', (err) => {
        logger.error('webp转Png失败', filePath, err);
        res(filePath);
      })
      .run();
  });
};

/**
 * 图片或视频按中心裁切
 * @param inputVideoPath 输入视频文件路径
 * @param targetWidth 目标宽度
 * @param targetHeight 目标长度
 * @param outputVideoPath 输出视频文件路径 -- 注意加上文件名及格式
 * @returns {Promise<unknown>}
 */
export const cropVideoByCenter = (
  inputVideoPath: string,
  targetWidth: number,
  targetHeight: number,
  outputVideoPath: string
): Promise<string> => {
  outputVideoPath = `${CACHE_DIR}/${path
    .basename(outputVideoPath)
    .split('.')
    .shift()}_handled1.${path.basename(outputVideoPath).split('.').pop()}`;
  return new Promise((res, rej) => {
    ffmpeg()
      .input(inputVideoPath)
      // .format('mp4')
      .videoFilters([
        {
          filter: 'crop',
          options: {
            w: targetWidth,
            h: targetHeight
          }
        }
      ])
      .output(outputVideoPath)
      .on('start', function (commandLine) {
        logger.info('cropVideoByCenter执行命令: ' + commandLine);
        logger.info('cropVideoByCenter开始裁剪:', outputVideoPath);
      })
      .on('progress', function (progress) {
        logger.info('cropVideoByCenter进度: ', progress.percent);
      })
      .on('error', function (err) {
        logger.error('cropVideoByCenter出错了');
        rej(err);
      })
      .on('end', function () {
        logger.info('cropVideoByCenter结束:', outputVideoPath);
        res(outputVideoPath);
      })
      .run();
  });
};

/**
 * 获取视频的宽高
 * @param media 视频路径
 * @returns {Promise<unknown>}
 */
const getDimension = (media: string): Promise<{ width: number; height: number }> => {
  logger.info('Getting Dimentions from:', media);
  return new Promise((res, rej) => {
    ffmpeg.ffprobe(media, async function (err, metadata) {
      if (err) {
        logger.error('Error occured while getting dimensions of:', media);
        rej('Error occured while getting dimensions of:' + err);
      }
      res({
        width: metadata.streams[0].width || metadata.streams[1].width,
        height: metadata.streams[0].height || metadata.streams[1].height
      });
    });
  });
};

/**
 * 改变视频尺寸 填充视频
 * @param originVideo 原始的视频
 * @param targetWidth 目标宽
 * @param targetHeight 目标高
 * @param outputPath 输出的文件路径 -- 带上文件名
 * @param autoPad
 * @param padColor 填充颜色
 * @returns {Promise<unknown>}
 */
export const resizeVideoByCenter = (
  originVideo: string,
  targetWidth: number,
  targetHeight: number,
  outputPath: string,
  autoPad = false,
  padColor?: string
): Promise<string> => {
  logger.info('resizeVideo  TargetVideoWH', targetWidth + 'x' + targetHeight);
  return new Promise((res, rej) => {
    //设置输出帧的大小
    let ff = ffmpeg()
      .input(originVideo)
      .size(`${Math.ceil(targetWidth)}x${Math.ceil(targetHeight)}`);

    //autoPad: boolean
    if (autoPad && padColor) {
      ff = ff.autoPad(autoPad, padColor);
    }

    ff.output(outputPath)
      .on('start', function (commandLine) {
        logger.info('Spawned resizingVideo with command: ' + commandLine);
        logger.info('Start resizingVideo:', originVideo);
      })
      .on('progress', function (progress) {
        logger.info('resizingVideo 进度: ', progress.percent);
      })
      .on('error', function (err) {
        logger.error('Problem performing resizingVideo function', err);
        rej(err);
      })
      .on('end', function () {
        logger.info('End resizingVideo:', outputPath);
        res(outputPath);
      })
      .run();
  });
};

/**
 * 生成按照比例缩放的视频
 * @param originVideo 初始的视频路径
 * @param targetWidth 目标宽
 * @param targetHeight 目标高
 * @param outputPath 输出路径
 * @returns {Promise<unknown>}
 */
export const scaleVideoByCenter = async (
  originVideo: string,
  targetWidth: number,
  targetHeight: number,
  outputPath: string
) => {
  // const output = 'scaledOutput.mp4'
  const urlMd = toMD5(originVideo + targetHeight + targetWidth);
  const localFile = db.get(urlMd);
  if (localFile) return localFile;
  const { width, height } = await getDimension(originVideo);
  const filePath = await resizeVideoByCenter(
    originVideo,
    targetWidth,
    targetHeight,
    outputPath,
    true
  );
  db.set(urlMd, filePath);
  return filePath;
  //如果原视频的宽高比 大于 目标宽高比 --
  if ((width / height).toFixed(2) > (targetWidth / targetHeight).toFixed(2)) {
    // y=0 case
    // landscape to potrait case
    const x = width - (targetWidth / targetHeight) * height;
    logger.info(`New In trim Res: ${width - x}x${height}`);
    // const cropping = 'tempCropped-' + output
    const cropped = await cropVideoByCenter(originVideo, width - x, height, outputPath);
    return await resizeVideoByCenter(cropped, targetWidth, targetHeight, outputPath);
  } else if ((width / height).toFixed(2) < (targetWidth / targetHeight).toFixed(2)) {
    //当原视频的宽高比 小于 目标宽高比 -- 需要填充
    return await resizeVideoByCenter(originVideo, targetWidth, targetHeight, outputPath, true);
  } else {
    return await resizeVideoByCenter(originVideo, targetWidth, targetHeight, outputPath);
  }
};
