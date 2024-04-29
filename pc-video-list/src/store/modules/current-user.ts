import { MutationTree } from 'vuex';
import type { CurrentUser } from '../types';

const currentUser: CurrentUser = {
  userInfo: {
    account: '',
    functions: [],
    mobile: '',
    orgList: [],
    tenantId: '',
    tenantName: '',
    userId: '',
    userName: '',
    userType: 1,
  },
};

const mutations: MutationTree<CurrentUser> = {
  setUserInfo(state, info) {
    state.userInfo = info;
  },
};

export default {
  namespaced: true,
  state: currentUser,
  mutations,
};
