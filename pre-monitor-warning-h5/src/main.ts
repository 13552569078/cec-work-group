import { createApp } from 'vue';
import { configUCenter } from 'fx-front-ucenter';
import customAxios from '@/apis/base/caxios';
import App from './App.vue';
import router from './router';
import store from './store';
import { GlobalAPI } from './common';
import VConsole from 'vconsole';

import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/notify/style';
import 'vant/es/image-preview/style';
import './assets/styles/index.scss';

if (process.env.NODE_ENV === 'production') {
  const vConsole = new VConsole();
}

configUCenter(
  {
    api: {
      loginBaseUrl: GlobalAPI.config.LOGIN_URL_USER_CENTER, // 用户中心登录页url
      baseUrl: GlobalAPI.config.API_PREFIX_USER_CENTER, // 接口baseUrl
      clientId: GlobalAPI.config.CLIENT_ID_TASK_HELPER,
      callbackUrl: GlobalAPI.config.CALLBACK_URL_CENTRE_CONFIG + '/' + GlobalAPI.config.CLIENT_ID_TASK_HELPER,
    },
    axios: customAxios
  }
);

const app = createApp(App);

app.use(store).use(router)
  .mount('#app');
