import { tts } from 'tencentcloud-sdk-nodejs';
import { nanoid } from 'nanoid';
const TtsClient = tts.v20190823.Client;
// const { SecretId, SecretKey } = TENGXUN_ID;
const clientConfig = {
  credential: {
    secretId: '',
    secretKey: ''
  },
  region: 'ap-chengdu',
  profile: {
    httpProfile: {
      endpoint: 'tts.tencentcloudapi.com'
    }
  }
};

export const tengxunTextToVoiceProvider = (options) => {
  clientConfig.credential.secretId = options.secretId;
  clientConfig.credential.secretKey = options.secretKey;
  const client = new TtsClient(clientConfig);
  return async function (text) {
    const params = {
      Text: text,
      SessionId: nanoid(),
      ModelType: options.modelType || 0,
      Volume: options.volume || 0,
      VoiceType: Number(options.voiceType || 1003),
      Codec: 'mp3'
    };
    const data = await client.TextToVoice(params);
    return Buffer.from(data.Audio, 'base64');
  };
};
