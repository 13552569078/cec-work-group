import { defineStore } from 'pinia'
import { AppConfig } from '/@/api/app/model/user'
import { getDictData, setDictData, setSidebarStatus } from '/@/utils/storage/auth'
import { store } from '/@/store'
import moduleSrv from '/@/api/app/user-info'

export type AppState = {
  sidebar: AppConfig
  dictDatas: Array<any>
}
export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    sidebar: {
      opened: true, // 默认展开
      withoutAnimation: false
    },
    dictDatas: []
  }),
  getters: {
    getDictDatas: (state: AppState) => state.dictDatas,
    // 从全局字典中过滤需要使用的类型
    getDictsByType: (state: AppState) => (type: string) => {
      if (state.dictDatas && state.dictDatas.length == 0) {
        state.dictDatas = getDictData()
      }
      return state.dictDatas ? state.dictDatas.filter((item) => item.dictCode === type) : []
    }
  },
  actions: {
    toggleSideBar() {
      this.sidebar.opened = !this.sidebar.opened
      this.sidebar.withoutAnimation = false
      if (this.sidebar.opened) {
        setSidebarStatus('true')
      } else {
        setSidebarStatus('false')
      }
    },
    async setDictDatas() {
      const res = await moduleSrv.getDictDatas()
      if (res.data) {
        this.dictDatas = res.data || []
        setDictData(res.data)
      } else {
        console.warn('get dicts interface error', res.data.msg)
      }
    }
  }
})
// Need to be used outside the setup
export function useAppStoreWithOut() {
  return useAppStore(store)
}
