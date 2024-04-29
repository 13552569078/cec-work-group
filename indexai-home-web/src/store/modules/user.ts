import { defineStore } from 'pinia'
import { store } from '/@/store'
import {
  clearLocalStorage,
  getToken,
  removeToken,
  setOrgId,
  setProfile,
  setToken,
  setUserid
} from '/@/utils/storage/auth'
import moduleSrv from '/@/api/app/user-info'
import { LoginParams } from '/@/api/app/model/user'
import loadjson from '/@/utils/loadJson'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

interface UserState {
  token: string | null
  profile: any
  menudatas: any[]
}
export const useUserStore = defineStore('user', {
  state: (): UserState => {
    return {
      token: getToken() || '',
      profile: null,
      menudatas: []
    }
  },
  getters: {
    getToken: (state: UserState) => state.token,
    getProfile: (state: UserState) => state.profile,
    getMenudatas: (state: UserState) => state.menudatas
  },
  actions: {
    // 登录
    async login(userInfo: LoginParams) {
      try {
        const response = await moduleSrv.login(userInfo, false)
        const { data, code } = response
        if (code === 0) {
          this.token = data && data.token
          // 存储OrgId
          if (data.orgRoleList) {
            const id = data.orgRoleList[0]?.org?.id
            setOrgId(id)
          }
          setProfile(data)
          setToken(data && data.token)
          setUserid(data && data.id)
        }
        return Promise.resolve(response)
      } catch (e) {
        ElMessage.error('服务暂不可用，尝试重连中……')
        return Promise.reject(e)
      }
    },
    // 根据token获取用户信息
    getUserInfo() {
      return new Promise((resolve) => {
        moduleSrv.getUserFromToken(true).then(async (res) => {
          if (res.data) {
            // this.profile = res.data
            // // 把个人信息保存本地
            // setProfile(res.data)
            // 存储OrgId
            if (res.data.orgRoleList) {
              const id = res.data.orgRoleList[0]?.org?.id
              setOrgId(id)
            }
            // 获取用户权限菜单
            const powoerlist = defaultSettings.menuDataFromInterface
              ? res.data?.resList?.find(
                  (item: { appId: any }) => String(item.appId) === String(defaultSettings.appId)
                )?.children || []
              : await loadjson('mock', 'menu', [])
            this.setMenu(powoerlist)
            resolve(res.data)
          }
        })
      })
    },
    // user logout
    async logout(invalidateFlag: boolean) {
      const router = useRouter()
      if (!invalidateFlag) {
        await moduleSrv.logout()
      }

      clearLocalStorage() // must remove  token  first
      // 判断是否嵌入其他平台
      if (defaultSettings?.isFromOhterPlatform) {
        //是否配置跳转用户中心地址
        if (defaultSettings?.loginUrl) {
          window.location.href = defaultSettings.loginUrl
        } else {
          router.push('/login')
        }
      } else {
        // 跳转本平台的登陆页面
        router.push('/login')
      }
    },
    // 设置菜单信息
    setMenu(data: any[]) {
      this.menudatas = data
    },
    // 重置系统
    resetToken(redirectPath: string) {
      const router = useRouter()
      ;(window as any).embed && (window as any).parent.postMessage({ method: 'logout' }, '*')

      return new Promise<void>((resolve) => {
        removeToken()
        // resetRouter()
        this.token = ''
        this.profile = null
        this.menudatas = []
        const loginUrl = redirectPath ? `/login?redirect=${redirectPath}` : '/login'
        !defaultSettings.isFromOhterPlatform || (window as any).debug
          ? router.push(loginUrl)
          : (window.location.href = defaultSettings.loginUrl)
        resolve()
      })
    }
  }
})
// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store)
}
