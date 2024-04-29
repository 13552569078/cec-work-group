import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import user from './modules/user'
import route from './modules/route'
import dispatch from './modules/dispatch'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    route,
    dispatch
  },
  getters
})

export default store
