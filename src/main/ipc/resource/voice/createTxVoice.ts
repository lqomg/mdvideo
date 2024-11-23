import logger from '@main/log';
import { localStore } from '@main/store';
import { createUUID } from '@main/utils';
import { Decrypt } from '@main/utils/secret';
import { tts } from 'tencentcloud-sdk-nodejs';
const TtsClient = tts.v20190823.Client;
const clientConfig = {
  credential: {
    secretId: '',
    secretKey: ''
  },
  region: '',
  profile: {
    httpProfile: {
      endpoint: 'tts.tencentcloudapi.com'
    }
  }
};

export const createTxVoice = async (options: {
  text: string;
  volume: number;
  speed: number;
  type: number;
}) => {

  try {
    // const appConfig = localStore.get('appConfig') as any;
    // const voiceStr = appConfig?.userInfo?.voiceStr;
    // const { SecretId, SecretKey } = JSON.parse(Decrypt(voiceStr));
    // clientConfig.credential.secretId = SecretId;
    // clientConfig.credential.secretKey = SecretKey;
    const { text, volume, speed, type } = options;
    const client = new TtsClient(clientConfig);
    const params = {
      Text: text,
      SessionId: createUUID(),
      // ModelType:modelType || 0,
      Speed: speed || 0,
      Volume: volume || 5,
      VoiceType: Number(type || 1003),
      Codec: 'mp3'
    };
    const data = await client.TextToVoice(params);
    if (data && data.Audio) {
      return Buffer.from(data.Audio, 'base64');
    }
    return null;
  } catch (error) {
    logger.error('合成失败,' + error);
    return null;
  }
};
