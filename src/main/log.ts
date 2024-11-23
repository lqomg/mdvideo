import log4js from 'log4js';
import path from 'path';
import { LOG_PATH } from './config';

log4js.configure({
  appenders: {
    console: { type: 'console' },
    cheese: {
      type: 'dateFile',
      filename: path.join(LOG_PATH, 'mdvideo'),
      pattern: '.yyyy-MM-dd.mdv', // 每天生成按这个格式拼接到filename后边
      alwaysIncludePattern: true // 始终包含pattern
    }
  },
  categories: {
    default: { appenders: ['console', 'cheese'], level: 'ALL' }
  }
});
export const logger = log4js.getLogger();
export default logger;
