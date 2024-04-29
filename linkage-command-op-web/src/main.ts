import { createApp } from 'vue';
import { setConfig } from 'fx-front-framework';
import { configUCenter } from 'fx-front-ucenter';

import { fxAxios } from '@/apis/base/mapper-helper';
import { CardPanel, CardPopper, CardPopover } from '@/components';

import router from './router';
import store from './store';
import { GlobalAPI, echartsFontSize } from './common';
import App from './App.vue';

import 'dayjs/locale/zh-cn';

import 'fx-front-framework/theme/index.scss';
import 'hongtu-draw/dist/hongtu-draw.css';
import '@hongtu-next/core/dist/mapbox-gl-enhance.css';
import '@hongtu-next/core/dist/index.css';
import '@hongtu-next/util/dist/measure-util.css';
import './assets/styles/index.scss';

configUCenter(
  {
    api: {
      loginBaseUrl: GlobalAPI.config.LOGIN_URL_USER_CENTER, // 用户中心登录页url
      baseUrl: GlobalAPI.config.API_PREFIX_USER_CENTER, // 接口baseUrl
      clientId: GlobalAPI.config.CLIENT_ID_COMMAND_OP,
      callbackUrl: GlobalAPI.config.CALLBACK_URL_CENTRE_CONFIG + '/' + GlobalAPI.config.CLIENT_ID_COMMAND_OP,
    },
    axios: fxAxios
  }
);

setConfig({
  visualized: {
    basicPX: echartsFontSize(1)
  }
});

const app = createApp(App);
app.provide('$store', store);
app.component('card-panel', CardPanel);
app.component('card-popper', CardPopper);
app.component('card-popover', CardPopover);
app.use(store).use(router).mount('#app');
