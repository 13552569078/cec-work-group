import { createApp } from 'vue';
import hongtuCore from '@hongtu-next/core';
import { setConfig } from 'pc-fx-framework';
import mitt from 'mitt';

import App from './App.vue';
import router from './router';
import store from './store';
import { echartsFontSize } from './common/utils';
import { UserAuth } from './common';

import { HvPanel, HvModal } from './components/';

import 'dayjs/locale/zh-cn';

import './assets/styles/index.scss';

const $eventBus = mitt();

setConfig({
  visualized: {
    basicPX: echartsFontSize(1) as number
  }
});

UserAuth.getTokenFromUrl();
const app = createApp(App);
app.provide('$mitter', $eventBus);
app.provide('$store', store);
app.component('HvPanel', HvPanel);
app.component('HvModal', HvModal);
app.use(hongtuCore).use(store).use(router).mount('#app');
