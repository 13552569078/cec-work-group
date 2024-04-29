import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
import { setSidebarStatus, setConfig } from '@/utils/auth'

const state = {
  sidebar: {
    opened: true, // 默认展开
    withoutAnimation: false
  },
  device: 'desktop', // pc
  config: null
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      setSidebarStatus(true)
    } else {
      setSidebarStatus(false)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    setSidebarStatus(false)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_CONFIG: (state, config) => {
    state.config = config
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  getConfig({ commit }) {
    moduleSrv.getConfig().then(res => {
      if (res.code === SUCCESS_CODE) {
        commit('SET_CONFIG', res.data)
        setConfig(res.data)
      } else {
        console.warn('getConfig interface error', res.message)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
