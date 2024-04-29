import { createApp } from 'vue';
import { setConfig } from 'fx-front-framework';
import hongtuCore from '@hongtu-next/core';
import { UserAuth } from './common';

import App from './App.vue';
import router from './router';
import store from './store';
import { echartsFontSize } from './common/utils';

import { HvPanel, HvModal } from './components/';
import { useMeeting } from '@/hooks';

import 'dayjs/locale/zh-cn';

import './assets/styles/index.scss';

setConfig({
  visualized: {
    basicPX: echartsFontSize(1) as number
  }
});

const { initHySdkWs, destoryHySdk, hyFlieNameList } = useMeeting();

UserAuth.getTokenFromUrl(userInfo => {
  // 开发环境不登录会议
  if (process.env.NODE_ENV === 'development') return;
  // 会议登录
  initHySdkWs(userInfo);
  console.log(userInfo, '当前用户信息');
});

window.onbeforeunload = function () {
  destoryHySdk();
};

const app = createApp(App);
app.provide('$store', store);
app.component('HvPanel', HvPanel);
app.component('HvModal', HvModal);
app.use(hongtuCore).use(store).use(router).mount('#app');
