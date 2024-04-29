import { createApp } from 'vue';
import { configUCenter } from 'fx-front-ucenter';
import customAxios from '@/apis/base/caxios';
import App from './App.vue';
import router from './router';
import store from './store';
import WujieVue from 'wujie-vue3';

import './assets/styles/index.scss';
import { GlobalAPI } from './common';
configUCenter(
  {
    api: {
      loginBaseUrl: GlobalAPI.config.LOGIN_URL_USER_CENTER, // 用户中心登录页url
      baseUrl: GlobalAPI.config.API_PREFIX_USER_CENTER, // 接口baseUrl
      clientId: GlobalAPI.config.CLIENT_ID_EVENT_HANDLE,
      callbackUrl: GlobalAPI.config.CALLBACK_URL_CENTRE_CONFIG + '/' + GlobalAPI.config.CLIENT_ID_EVENT_HANDLE,
    },
    axios: customAxios
  }
);

const app = createApp(App);
app.use(WujieVue);
app.use(store);
app.use(router);
app.mount('#app');
