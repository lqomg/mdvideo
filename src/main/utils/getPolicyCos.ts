import { localStore } from '@main/store';
import axios from 'axios';
import { app } from 'electron';
import Cos from 'cos-nodejs-sdk-v5';
import logger from '@main/log';
export const getPolicyCos = async () => {
  // /app/getPolicy
  const appConfig = localStore.get('appConfig') as any;
  const url = 'http://127.0.0.1:4130/app/getPolicy';
  try {
    const data = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: 'Bearer ' + appConfig.token
        }
      }
    );
    const cosToken = data.data?.data;
    if (!cosToken) return false;
    const cos = new Cos({
      getAuthorization(_options, callback) {
        const { credentials, startTime, expiredTime } = cosToken;
        const options = {
          TmpSecretId: credentials.tmpSecretId,
          TmpSecretKey: credentials.tmpSecretKey,
          SecurityToken: credentials.sessionToken,
          // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
          StartTime: startTime, // 时间戳，单位秒，如：1580000000
          ExpiredTime: expiredTime, // 时间戳，单位秒，如：1580000000
          ScopeLimit: true // 细粒度控制权限需要设为 true，会限制密钥只在相同请求时重复使用
        };
        callback(options);
      }
    });
    return cos;
  } catch (err) {
    logger.error('获取认证失败', err);
    return false;
  }
};
