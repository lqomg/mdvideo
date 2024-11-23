import { createApp } from 'vue';

// import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'animate.css/animate.min.css';
import './style/index.scss';
import ElementPlus from 'element-plus';
import App from './App.vue';
import router from './router';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { i18n } from './i18n';
import pinia from './store';
import { Icon } from './components/global/Icon'
import './style/iconfont/iconfont.css';
import './style/iconfont-svg/iconfont.js';
import './style/loadFont';
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.component('Icon', Icon)
app.config.globalProperties.$getLocalUrl = (path: string) => {
  return path?.replace?.(/\s/g, '%20')
}
app.use(router);
app.use(pinia);
app.use(ElementPlus);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
app.use(ElementPlus, { i18n: i18n.global.t });
app.use(i18n);
app.mount('#app');
