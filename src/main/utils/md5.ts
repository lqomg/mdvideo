import CryptoJS from 'crypto-js';

export const toMD5 = (text: string) => {
  return CryptoJS.MD5(text).toString();
};
