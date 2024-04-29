import { createApp } from 'vue';
import { setConfig, EChartUtils } from 'fx-front-framework';
import { configUCenter, handleTokenGuard } from 'fx-front-ucenter';
import { fxAxios } from '@/apis/base/mapper-helper';
import { GlobalAPI } from '@/common';
import App from './App.vue';
import router from './router';
import store from './store';
import WujieVue from 'wujie-vue3';

import '@hongtu-next/core/dist/index.css';
import './assets/styles/index.scss';

setConfig({
  visualized: {
    basicPX: EChartUtils.echartsFontSize(1, 1080)
  }
});

configUCenter(
  {
    api: {
      loginBaseUrl: GlobalAPI.config.LOGIN_URL_USER_CENTER, // 用户中心登录页url
      baseUrl: GlobalAPI.config.API_PREFIX_USER_CENTER, // 接口baseUrl
      clientId: GlobalAPI.config.CLIENT_ID_EVENT_HANDLE,
      callbackUrl: GlobalAPI.config.CALLBACK_URL_CENTRE_CONFIG + '/' + GlobalAPI.config.CLIENT_ID_EVENT_HANDLE,
    },
    axios: fxAxios
  }
);

const app = createApp(App);

router.beforeEach(handleTokenGuard);
app.use(WujieVue);
app.use(store);
app.use(router);
app.mount('#app');
