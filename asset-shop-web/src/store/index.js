import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

import app from '@l/store/app'
import settings from '@l/store/settings'
import user from '@l/store/user'
import route from '@l/store/route'
import message from '@l/store/message'
import pageTop from './modules/page-top'
import publicManage from './modules/public-manage'
import shopCar from './modules/shop-car'

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
    pageTop,
    publicManage,
    shopCar
  },
  getters
})

export default store
