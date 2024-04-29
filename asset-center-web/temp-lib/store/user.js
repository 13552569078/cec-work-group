import { user } from '../api'
const { login, getUserInfo, login_url } = user

import { getToken, setToken, removeToken } from '@/utils/auth'
import DefaultUserIcon from '../assets/frame/user.png'
import { getWindowParentRef } from '@/utils'

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
      console.log('---login---')
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
    // console.log(userInfoData)
    commit('SET_USERID', userInfoData.data.empid)
    commit('SET_USERNAME', userInfoData.data.empname)
  },

  logout({ commit, state }) {
    window.embed && window.parent.postMessage({ method: 'logout' }, getWindowParentRef())
    const url = user.logout + '&token=' + getToken()
    console.log(url, 'url')
    window.location.href = url
  },

  resetToken({ commit }, redirectPath) {
    removeToken()
    // resetRouter()
    commit('RESET_STATE')
    console.log('------', window.top !== window.self)
    if (window.top !== window.self) { return window.parent.postMessage({ method: 'logout' }, getWindowParentRef()) }
    window.location.href = login_url + encodeURIComponent(window.location.href)
    // window.location.href = redirectPath
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

