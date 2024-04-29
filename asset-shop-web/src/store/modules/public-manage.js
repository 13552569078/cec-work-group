/**
 * @Description: 字典值
 * @Author: dingli
 */
import { queryVersion } from '@/api/index'
const getDefaultState = () => {
  return {
    navList: [],
    active: localStorage.getItem('public-manage-nav-active') || '', // navList中的key
    assetType: localStorage.getItem('public-manage-assetType') || undefined, // 资源类型
    publishStatus: localStorage.getItem('public-manage-publishStatus') || undefined // 0未上架、1已上架、2已下架、3未注册
  }
}

const state = getDefaultState()

const mutations = {
  SET_NAVLIST: (state, info) => {
    state.navList = info
  },
  SET_ACTIVE_NAV: (state, key) => {
    state.active = key
    localStorage.setItem('public-manage-nav-active', key)
  },
  SET_ASSET_TYPE: (state, key) => {
    state.assetType = key
    localStorage.setItem('public-manage-assetType', key)
  },
  SET_PUBLISH_STATUS: (state, key) => {
    state.publishStatus = key
    localStorage.setItem('public-manage-publishStatus', key)
  }
}

const actions = {
  setNavlist({ commit, state }, list) {
    commit('SET_NAVLIST', list)
  },
  setActiveNav({ commit, state }, key) {
    commit('SET_ACTIVE_NAV', key)
  },
  setAssetType({ commit, state }, key) {
    commit('SET_ASSET_TYPE', key)
  },
  setPublishStatus({ commit, state }, key) {
    commit('SET_PUBLISH_STATUS', key)
  },
  async getNavlist({ commit, state }, { shopCode, isList, type }) {
    try {
      const list = []
      if (shopCode) {
        const res = await queryVersion({ shopCode })
        res.data.forEach(d => {
          // 上架未提交、注册未提交、更新未提交、升级未提交 展示表单页
          if (!([0, 10, 15, 20].includes(+d.packStatus))) {
            list.push({
              ...d,
              key: 'public',
              shopCode: shopCode,
              version: d.packVersion,
              state: d.packStatus,
              auditMsg: d.auditMsg,
              versionId: d.packVersionId
            })
          } else {
            list.push({
              ...d,
              key: 'current',
              shopCode: shopCode,
              version: d.packVersion,
              state: d.packStatus,
              auditMsg: d.auditMsg,
              versionId: d.packVersionId
            })
          }
        })
      }
      // 应用 初始状态是10未注册、其他是0未上架
      if (list.length === 0) {
        list.push({
          key: 'current',
          version: '',
          state: +type === 99 ? 10 : 0,
          auditMsg: '',
          init: true
        })
      }

      // 会同时存在2个public版本
      if (list[1] && list[1].key === 'public') {
        list[1].key = 'public-1'
      }
      commit('SET_NAVLIST', list)
      let toPathKey = localStorage.getItem('public-manage-nav-active')
      if (toPathKey !== 'history') {
        const isHas = list.find(d => d.key === toPathKey)
        if (!isHas) {
          toPathKey = list[list.length - 1].key
          commit('SET_ACTIVE_NAV', toPathKey)
        }
      }
      if (isList) return list
      return toPathKey
    } catch (e) {
      console.error(e)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

