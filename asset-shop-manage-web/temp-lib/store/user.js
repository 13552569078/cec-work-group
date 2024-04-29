import { user } from '../api'
const { login, login_url, getUserInfo } = user

import { getToken, setToken, removeToken } from '../utils/auth'
import DefaultUserIcon from '../assets/frame/user.png'
import { getWindowParentRef } from '../utils'

const getDefaultState = () => {
  return {
    token: getToken(),
    userId: null,
    userName: '',
    avatar: DefaultUserIcon
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_USERNAME: (state, userName) => {
    state.userName = userName
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login(username.trim(), password).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  async getUserInfo({ commit, state }) {
    const userInfoData = await getUserInfo(state.token)
    commit('SET_USERID', userInfoData.data.empid)
    commit('SET_USERNAME', userInfoData.data.userName)
  },

  logout({ commit, state }) {
    window.embed && window.parent.postMessage({ method: 'logout' }, getWindowParentRef())
    const url = user.logout + '&token=' + getToken()
    window.location.href = url
  },

  resetToken({ commit }, redirectPath) {
    removeToken()
    commit('RESET_STATE')
    // window.location.href = redirectPath
    window.location.href = login_url + encodeURIComponent(window.location.href)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

