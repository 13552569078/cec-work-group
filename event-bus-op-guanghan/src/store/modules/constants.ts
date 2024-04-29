// initial state
import { MutationTree } from 'vuex';

interface Constants {
  navs: { [x: string]: any },
  scenes: string[],
  navActiveClass: string[],
  navBgClass: string[],
  control: {
    monitorControl: {
      isShowAdd?: boolean,
      isShowJudge?: boolean,
    },
    warningControl: {
      isShowJudge?: boolean,
    }
  }
}

const constants: Constants = {
  navs: [],
  control: {
    monitorControl: {},
    warningControl: { isShowJudge: true }
  },
  scenes: [
    'keyArea',
    'fireFight',
    'floodPrevent'
  ],
  navActiveClass: ['active-start', 'active-middle', 'active-end'],
  navBgClass: ['-start', '-middle', '-end']
};

const mutations: MutationTree<Constants> = {
  setNavs(state, data) {
    state.navs = data;
  },
  setControl(state, data) {
    state.control = data;
  },
};

export default {
  namespaced: true,
  state: constants,
  mutations
};
