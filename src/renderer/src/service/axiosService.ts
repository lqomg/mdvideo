import { useAppConfigStore } from '@renderer/store';
import axios from 'axios';
import { ElMessageBox } from 'element-plus';
import router from '../router';
export const baseURL =
  import.meta.env.MODE === 'development' ? 'http://localhost:4130/' : 'https://mdvideo.wvovw.com/api/';

export const axiosService = axios.create({
  baseURL,
  timeout: 100 * 1000
});

axiosService.defaults.headers['Content-Type'] = 'application/json;charse=UTF-8';
axiosService.defaults.timeout = 30000; // 超时时间

//请求拦截器
axiosService.interceptors.request.use(
  (config) => {
    const appConfigStore = useAppConfigStore();
    config.headers.Authorization = 'Bearer ' + appConfigStore.token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const notNeeds = ['/public/lottie/lottie.json'];
//响应拦截器即异常处理
axiosService.interceptors.response.use(
  (response) => {
    if (
      (response.data.code && response.data.status) ||
      notNeeds.includes(response.config.url as string)
    ) {
      return Promise.resolve(response.data);
    } else {
      ElMessageBox({
        type: 'error',
        message: response.data.message || response.data.msg || response.data.errMsg
      });
      return Promise.reject(response);
    }
  },
  (err) => {
    let loginOut = false;
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '错误请求';
          break;
        case 401:
          err.message = '未授权，请重新登录';
          loginOut = true;
          break;
        case 403:
          err.message = '没有访问权限，拒绝访问';
          break;
        case 404:
          err.message = '请求错误,未找到该资源';
          break;
        case 405:
          err.message = '请求方法未允许';
          break;
        case 408:
          err.message = '请求超时';
          break;
        case 500:
          err.message = err.response.data.message;
          break;
        case 501:
          err.message = '网络未实现';
          break;
        case 502:
          err.message = '网络错误';
          break;
        case 503:
          err.message = '服务不可用';
          break;
        case 504:
          err.message = '网络超时';
          break;
        default:
          err.message = `连接错误${err.response.msg}`;
      }
    } else {
      err.message = '连接到服务器失败';
    }

    ElMessageBox({
      type: 'error',
      title: '提示',
      message: err.message || err.response.msg
    }).then(() => {
      if (loginOut) {
        const appConfigStore = useAppConfigStore();
        appConfigStore.userInfo = {
          email: '',
          username: '',
          totalSpeech: 0,
          speech: 0,
          voiceStr: ''
        };
        appConfigStore.token = '';
        setTimeout(() => {
          router.push({ path: '/login' });
        }, 500);
      }
    });

    return Promise.resolve();
  }
);

export default axiosService;
