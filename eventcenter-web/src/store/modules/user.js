import { getToken, setToken, clearLocalStorage } from '@/utils/auth'
import * as router from '@/router'
import moduleSrv from '@/api/user'
import mockMenu from '@/mock/menu'

const getDefaultState = () => {
  return {
    token: getToken(),
    appCode: window.location.pathname.replace(/\//g, '').replace('.html', '') || 'event', // 默认取自二级路径为 appCode, 如果 url传了 appCode，则以传递的为主, 如果为空，则已本地配置为主
    profile: {},
    powerList: [], // 用户配置的权限菜单
    orgRoleList: [], // 组织角色列表
    selectedOrgRole: {}, // 选择的组织角色home_menu.png
    systemConfiglist: [], // 系统配置列表
    appInfo: {}, // 应用信息
    bsDicts: [], // 基础数据字典
    speTypeTree: [], // 生命线事件专项
    ldzhspeTypeTree: []// 联动指挥专项
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_APPCODE: (state, code) => {
    state.appCode = code
  },
  SET_TOKEN: (state, token) => {
    setToken(token)
    state.token = token
  },
  SET_PROFILE: (state, profile) => {
    state.profile = profile
  },
  SET_POWERLIST: (state, powerList) => {
    state.powerList = powerList
  },
  SET_ORG_ROLE_LIST: (state, val) => {
    state.orgRoleList = val
  },
  SET_SELECTED_ORG_ROLE: (state, val) => {
    state.selectedOrgRole = val
  },
  SET_SYSTEM_CONFIG_LIST: (state, val) => {
    state.systemConfiglist = val
  },
  SET_APP_INFO: (state, val) => {
    state.appInfo = val
  },
  SET_BS_DICTS: (state, val) => {
    state.bsDicts = val
  },
  SET_speTypeTree: (state, val) => {
    state.speTypeTree = val
  },
  SET_ldzhspeTypeTree: (state, val) => {
    state.ldzhspeTypeTree = val
  }
}

const actions = {
  // user login
  async login({ commit }, form) {
    await moduleSrv.toLogin(form).then(res => {
      if (res.code === 0) {
        commit('SET_TOKEN', res.data && res.data.token)
        commit('SET_ORG_ROLE_LIST', res.data && res.data.orgRoleList)
      } else {
        console.warn('toLogin 接口报错')
      }
    })
  },

  async switchOrgRole({ commit }, orgRole) {
    commit('SET_SELECTED_ORG_ROLE', orgRole)
    const params = {
      orgId: orgRole.org.id,
      roleId: orgRole.role.id
    }
    await moduleSrv.switchOrgRole(params).then(res => {
      if (res.code === 0) {
        commit('SET_TOKEN', res.data && res.data.token)
      } else {
        console.warn('switchOrgRole 接口报错')
      }
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      moduleSrv.getUserFromToken().then(res => {
        if (res.code === 0) {
          commit('SET_PROFILE', res.data)
          try {
            commit('SET_ORG_ROLE_LIST', res.data.orgRoleList || [])
            if (res.data.orgRoleList.length === 1) {
              commit('SET_SELECTED_ORG_ROLE', res.data.orgRoleList[0])
            } else {
              commit('SET_SELECTED_ORG_ROLE', res.data.orgRoleList.find(item => item.id === res.data.orgRoleId) || {})
            }
          } catch (err) {
            console.log('getInfo catch error', err)
          }
          resolve(res.data)
        }
      }).catch(e => {
        reject(e)
      })
    })
  },

  // 获取基础数据字典
  getDictsFromBs({ commit }, params) {
    // 获取树结构的字典
    moduleSrv.getDictsFromBs(params).then(res => {
      // 去除掉自身APP
      commit('SET_BS_DICTS', res.data || [])
    })
  },

  // 菜单获取
  getMenus({ commit }) {
    return new Promise((resolve) => {
      // 根据配置开关，来获取菜单数据来源, 资源类型(P平台 D目录 M菜单 B按钮)
      const params = {
        'appCode': state.appCode,
        'roleId': state.profile?.currentOrgRole?.role?.id,
        'resTypeList': ['D', 'M']
      }
      moduleSrv.getMenuList(params).then(res => {
        if (res.code === 0) {
          const menuList = res.data || []
          if (menuList.filter(menu => menu.type === 'A').length > 2) {
            this.$message('请查看应用编码是否正确，检索到了多个应用')
            console.warn('请查看应用编码是否正确，检索到了多个应用')
          }
          // 开发环境下：区县的时候使用mock菜单  社会治理使用接口菜单
          commit('SET_POWERLIST', process.env.NODE_ENV === 'development' && !window.GLOBAL_CONFIG.isShzl ? mockMenu.children : menuList)
          // commit('SET_POWERLIST', menuList)
        } else {
          console.warn('getMenuList 接口报错')
        }
        resolve()
      })
    })
  },
  // 根据 code 查询该应用的信息，包含了退出地址
  getAppInfo({ commit }) {
    return new Promise((resolve, reject) => {
      const params = {
        code: state.appCode
      }
      moduleSrv.getAppInfoByCode(params).then(res => {
        if (res.code === 0) {
          commit('SET_APP_INFO', res.data || {})
          resolve(res.data)
        }
      }).catch(e => {
        reject(e)
      })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      moduleSrv.toLogOut().then(res => {
        const $router = router.default.app.$router
        if (res.code === 0) {
          clearLocalStorage() // must remove  token  first
          router.resetRouter()
          try {
            if (state.appInfo.logoutUrl) {
              // 如果配置了跳转地址，则跳转相应地址，否则跳转自身的登陆
              window.location.href = state.appInfo.logoutUrl
            } else {
              $router.push('/login')
              window?.$wujie?.props?.method?.logout?.()
            }
          } catch (error) {
            $router.push('/login')
            window?.$wujie?.props?.method?.logout?.()
          }
          commit('RESET_STATE')
          resolve()
        }
      })
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      clearLocalStorage() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  // 系统参数列表
  systemConfiglist({ commit }, params) {
    moduleSrv.systemConfiglist(params).then(res => {
      if (res.code === 0) {
        commit('SET_SYSTEM_CONFIG_LIST', res.data || [])
      } else {
        console.warn('systemConfiglist interface error', res.msg)
      }
    })
  },

  // 获取专项类型树
  getSpeTypeDictsFromBs({ commit }) {
    // 获取树结构的字典
    moduleSrv.getDictsFromBs({ dictType: 'lifeline_special_type', isTreeStruct: true }).then(res => {
      commit('SET_speTypeTree', res.data || [])
    })
    // 联动指挥的专项
    moduleSrv.getDictsFromBs({ dictType: 'linkage_special_type', isTreeStruct: true }).then(res => {
      commit('SET_ldzhspeTypeTree', res.data || [])
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
