import { IStoreConfigStete } from '@api/store';
import { defineStore } from 'pinia';

export const useAppConfigStore = defineStore('config', {
  state(): IStoreConfigStete {
    return {
      userInfo: {
        id: '',
        speech: 0,
        totalSpeech: 0,
        allTotalSpeech: 10000,
        email: '',
        username: '',
        voiceStr: ''
      },
      token: '',
      vertical: false,
      rootDir: '',
      aiVioces: [],
      resourcePath: ''
    };
  },
  persist: true,
});
