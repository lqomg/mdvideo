import path from 'path';
import fs from 'fs-extra';

const appDataPath = path.join(__dirname, '../../../../../wvovwAppData');
const OUT_PUT_DIR = path.join(appDataPath, './output');
const CACHE_DIR = path.join(appDataPath, './cachecurrent');
const LOG_PATH = path.join(appDataPath, './logs');
const VIDEO_COVER_DIR = path.join(appDataPath, './videoCover');
const IMAGE_COVER_DIR = path.join(appDataPath, './imageCover');

const UPLOAD_IMAGE_DIR = path.join(appDataPath, './uploads/images');
const UPLOAD_VIDEO_DIR = path.join(appDataPath, './uploads/videos');
const UPLOAD_AUDIO_DIR = path.join(appDataPath, './uploads/audios');
const UPLOAD_VOIVE_DIR = path.join(appDataPath, './uploads/voices');
const DATABASE_FOLDER = path.join(appDataPath, './database');
const UPLOAD_RESOURCE_DIR = path.join(appDataPath, './resource');
const UPLOAD_TEMPLATE_DIR = path.join(appDataPath, './template');

fs.ensureDirSync(CACHE_DIR);
fs.ensureDirSync(VIDEO_COVER_DIR);
fs.ensureDirSync(IMAGE_COVER_DIR);
fs.ensureDirSync(OUT_PUT_DIR);
fs.ensureDirSync(UPLOAD_IMAGE_DIR);
fs.ensureDirSync(UPLOAD_VIDEO_DIR);
fs.ensureDirSync(UPLOAD_AUDIO_DIR);
fs.ensureDirSync(DATABASE_FOLDER);
fs.ensureDirSync(UPLOAD_VOIVE_DIR);
fs.ensureDirSync(UPLOAD_RESOURCE_DIR);
fs.ensureDirSync(LOG_PATH);
fs.ensureDirSync(UPLOAD_TEMPLATE_DIR);
const ONLONE_FILE_DIR = path.join(appDataPath, './onlineFiles.json');
fs.ensureFileSync(ONLONE_FILE_DIR);
export {
  CACHE_DIR,
  OUT_PUT_DIR,
  UPLOAD_IMAGE_DIR,
  UPLOAD_VIDEO_DIR,
  UPLOAD_AUDIO_DIR,
  UPLOAD_VOIVE_DIR,
  DATABASE_FOLDER,
  UPLOAD_RESOURCE_DIR,
  VIDEO_COVER_DIR,
  ONLONE_FILE_DIR,
  IMAGE_COVER_DIR,
  LOG_PATH,
  UPLOAD_TEMPLATE_DIR
};
