import { DATABASE_FOLDER } from '../config';
import path from 'path';
import Datastore from '@seald-io/nedb';
const timestampData = true;

export const pageDB = new Datastore({
  filename: path.join(DATABASE_FOLDER, './page.db'),
  timestampData,
  autoload: true
});

export const uploadDB = new Datastore({
  filename: path.join(DATABASE_FOLDER, './upload.db'),
  timestampData,
  autoload: true
});

export const sourceDB = new Datastore({
  filename: path.join(DATABASE_FOLDER, './resource.db'),
  timestampData,
  autoload: true
});

export const imagesSourceDB = new Datastore({
  filename: path.join(DATABASE_FOLDER, './imagesResource.db'),
  timestampData,
  autoload: true
});
export const videosSourceDB = new Datastore({
  filename: path.join(DATABASE_FOLDER, './videosResource.db'),
  timestampData,
  autoload: true
});
export const audioSourceDB = new Datastore({
  filename: path.join(DATABASE_FOLDER, './audioResource.db'),
  timestampData,
  autoload: true
});
export const bgsSourceDB = new Datastore({
  filename: path.join(DATABASE_FOLDER, './bgsResource.db'),
  timestampData,
  autoload: true
});
export const qbqSourceDB = new Datastore({
  filename: path.join(DATABASE_FOLDER, './qbqResource.db'),
  timestampData,
  autoload: true
});
export const musicsDB = new Datastore({
  filename: path.join(DATABASE_FOLDER, './musicResource.db'),
  timestampData,
  autoload: true
});

export const voiceDB = new Datastore({
  filename: path.join(DATABASE_FOLDER, './aivoice.db'),
  timestampData,
  autoload: true
});

export const bg3dDB = new Datastore({
  filename: path.join(DATABASE_FOLDER, './bg3d.db'),
  timestampData,
  autoload: true
});
export const bgColorsDB = new Datastore({
  filename: path.join(DATABASE_FOLDER, './bgColors.db'),
  timestampData,
  autoload: true
});
export const fontsDB = new Datastore({
  filename: path.join(DATABASE_FOLDER, './fonts.db'),
  timestampData,
  autoload: true
});
