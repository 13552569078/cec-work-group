/**
 * @Description: 字典值
 * @Author: dingli
 * @Date: 2022-1-20
 */
import route, { getRouteList } from '@/router/system'
const getDefaultState = (route) => {
  const tabList = []
  route.forEach(d => {
    if (!d.hidden) {
      let children = []
      if (d.children && d.children.length) {
        d.children.forEach(dc => {
          if (!dc.hidden) {
            children.push({ ...dc, label: dc.meta.title, value: dc.meta.title, path: dc.path })
          }
        })
      }
      if (children.length === 1 && !children[0].path) {
        children = []
      }
      tabList.push({ ...d, label: d.meta.title, value: d.meta.title, path: d.path, children })
    }
  })
  return {
    tabList: tabList,
    currentTab: '资源模板'
  }
}

const state = getDefaultState(route)

const mutations = {
  SET_TOP_TAB: (state, info) => {
    state.currentTab = info
  },
  SET_LIST: (state, list) => {
    state.tabList = list
  }
}

const actions = {
  setTopTab({ commit, state }, tab) {
    if (tab === state.currentTab) return
    commit('SET_TOP_TAB', tab)
  },
  setTabList({ commit, state }) {
    const obj = getDefaultState(getRouteList())
    commit('SET_LIST', obj.tabList)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
