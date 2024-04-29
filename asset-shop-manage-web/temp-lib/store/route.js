import { constantRoutes } from '@/router'
import { getPowerList } from '@/alter/route'

const state = {
  routes: constantRoutes,
  routesLoaded: false
}
const mutations = {
  SET_ROUTES(state, routes) {
    state.routes = routes
  },
  SET_ROUTESLOADED(state, status) {
    state.routesLoaded = status
  },
  RESET_ROUTES(state) {
    state.routes = constantRoutes
    state.routesLoaded = false
  }
}

const actions = {
  async getPowerRoutes({ commit }) {
    const powerRoutes = await getPowerList()
    commit('SET_ROUTESLOADED', true)
    commit('SET_ROUTES', powerRoutes)
    return powerRoutes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
