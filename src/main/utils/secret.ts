import CryptoJS from 'crypto-js';
const keyStr = 'wvovw-lq'; //十六位十六进制数作为密钥
const ivStr = 'wvovw-lq-lq'; // 偏移量

export const Encrypt = (data) => {
  return CryptoJS.AES.encrypt(data, keyStr).toString();
};

// encrypted 为是base64格式的密文
export const Decrypt = (encrypted) => {
  const bytes = CryptoJS.AES.decrypt(encrypted, keyStr);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export default {
  Decrypt,
  Encrypt
};
