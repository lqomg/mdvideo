import { groupBy } from 'lodash';
import { defineStore } from 'pinia';

export const useCommonStore = defineStore('commonStore', {
  state(): { musicList: any[]; musicTotal: number; resourceBasePath: string } {
    return {
      resourceBasePath: '',
      musicTotal: 0,
      musicList: []
    };
  },
  persist: true,
  getters: {
    getMusicListClassify(state) {
      const classify = groupBy(state.musicList, 'className');
      return Object.keys(classify);
    }
  },
  actions: {
    getMusicListByClassName(className: string) {
      return this.musicList.filter((item) => item.className === className);
    },
    getMusicListByName(name: string) {
      return this.musicList.filter((item) =>
        item.fileName?.toLocaleLowerCase?.()?.includes(name.toLocaleLowerCase())
      );
    }
  }
});
