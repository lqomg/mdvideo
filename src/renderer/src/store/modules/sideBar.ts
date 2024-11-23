import { defineStore } from 'pinia';

export const useSideBarStore = defineStore('sideBar', {
  state() {
    return {
      sideOpen: true,
      attrOpen: true
    };
  }
});
