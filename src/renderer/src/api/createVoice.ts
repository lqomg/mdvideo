import { ICreateVoice } from '@api/resource';
import axiosService from '@renderer/service/axiosService';
import { useAppConfigStore } from '@renderer/store';

export const createVoice = async ({
  text,
  voiceId,
  voiceType,
  voiceVolume,
  voiceSpeed
}: {
  text: string;
  voiceType: string;
  voiceId: any;
  voiceVolume: number;
  voiceSpeed: number;
}) => {
  const appConfigStore = useAppConfigStore();
  if (appConfigStore.userInfo.totalSpeech > appConfigStore.userInfo.allTotalSpeech) {
    return {
      data: {
        path: '',
        duration: 0
      },
      message: '检查到频繁触发AI语音合成，请联系管理员放开限制！'
    };
  }
  // const speech = appConfigStore.userInfo.speech || 0;
  // if (!appConfigStore.token) {
  //   return {
  //     data: {
  //       path: '',
  //       duration: 0
  //     },
  //     message: 'AI语音需要登录后操作，请先登录'
  //   };
  // }
  // if (speech < text?.length) {
  //   return {
  //     data: {
  //       path: '',
  //       duration: 0
  //     },
  //     message: 'AI语音生成字符额度不足，请联系管理员添加额度!'
  //   };
  // }
  try {
    const { data, message } = await window.invoke<ICreateVoice['req'], ICreateVoice['res']>(
      'createVoice',
      {
        payload: {
          text,
          voiceType,
          type: voiceId,
          speed: voiceSpeed,
          volume: voiceVolume
        }
      }
    );
    // const res = await axiosService({
    //   url: '/user/update/speech',
    //   method: 'post',
    //   data: {
    //     speech: text.length
    //   }
    // });
    // if (res?.data?.speech !== undefined) {
    //   appConfigStore.userInfo.speech = res?.data?.speech;
    //   appConfigStore.userInfo.totalSpeech = res?.data?.totalSpeech || 0;
    // } else {
    //   appConfigStore.userInfo.speech = speech - (text.length || 0);
    //   appConfigStore.userInfo.speech = (text.length || 0) + appConfigStore.userInfo.totalSpeech;
    // }

    appConfigStore.userInfo.totalSpeech = (text.length || 0) + appConfigStore.userInfo.totalSpeech;
    return {
      data,
      message
    };
  } catch (error) {
    return {
      data: {
        path: '',
        duration: 0
      },
      message: JSON.stringify(error)
    };
  }
};
