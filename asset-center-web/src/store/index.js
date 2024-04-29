import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import dict from './modules/dict'

import app from '@l/store/app'
import settings from '@l/store/settings'
import user from '@l/store/user'
import route from '@l/store/route'
import message from '@l/store/message'
Vue.use(Vuex)

const state = {
  asidetitle: true
}

const mutations = {
  changebreadcumb(state, value) {
    state.breadcumb = value
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  modules: {
    app,
    settings,
    user,
    route,
    message,
    dict
  },
  getters
})

export default store
