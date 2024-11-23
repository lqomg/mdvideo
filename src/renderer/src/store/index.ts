import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
export * from './modules/editor';
export * from './modules/common';
export * from './modules/appConfig';
export * from './modules/task';
export * from './modules/preview';
export * from './modules/markdown';
const store = createPinia();
store.use(
  createPersistedState({
    storage: localStorage
  })
);
export default store;
