import { defineStore } from 'pinia';

export const useMarkdownStore = defineStore('markdown', {
  state() {
    return {
      autoPlay: false,
    };
  },
  actions: {
    changeAutoPlay(n: boolean) {
      this.autoPlay = n;
    }
  }
});
