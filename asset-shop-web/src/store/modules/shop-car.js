import { queryShopCarAdd, queryShopCarCount, queryShopCarList, queryShopCarClear, delShopCar } from '@/api/index'
import { Message } from 'fx-asset-ui'
// import store from '@/store'
const getDefaultState = () => {
  return {
    show: false,
    shopCarCount: 0,
    shopCarList: []
  }
}

const state = getDefaultState()
const getters = {
  shopCarList: state => state.shopCarList
}

const mutations = {
  OPEN_CART_DIALOG: (state) => {
    if (state.shopCarCount === 0) {
      Message.warning('请先加入购物车!')
    } else {
      state.show = true
    }
  },
  CLOSE_CART_DIALOG: (state) => {
    state.show = false
  },
  SET_CART_COUNT: (state, count) => {
    state.shopCarCount = count
  },
  SET_CART_LIST: (state, data) => {
    state.shopCarList = data
  }
}

const actions = {
  async addToCart({ commit, dispatch, state }, { params }) {
    const addRes = await queryShopCarAdd(params)
    if (addRes?.code === 0) {
      Message.success('加入购物车成功!')
      dispatch('getCartInfo')
    }
  },
  async delCart({ commit, dispatch, state }, id) {
    const addRes = await delShopCar(id)
    if (addRes?.code === 0) {
      dispatch('getCartInfo')
    }
  },
  async clearCart({ commit, dispatch, state }, params) {
    const addRes = await queryShopCarClear(params)
    if (addRes?.code === 0) {
      dispatch('getCartInfo')
    }
  },
  async getCartInfo({ commit, dispatch }) {
    Promise.all([queryShopCarCount(), queryShopCarList()]).then(res => {
      commit('SET_CART_COUNT', res[0].data ?? 0)
      commit('SET_CART_LIST', res[1].data ?? [])
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
