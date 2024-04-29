import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';
import { DOMAIN } from '@/common';
import { RootState } from './types';
import weather from './modules/weather';

const vuexLocal = new VuexPersistence<RootState>({
  storage: window.localStorage,
  key: `${DOMAIN}.saveData`,
  modules: ['commonStore', 'weatherStore']
});

export default createStore({
  state: {
    version: '1.0.0'
  },
  mutations: {},
  actions: {},
  modules: {
    weatherStore: weather,
  },
  plugins: [vuexLocal.plugin]
});
