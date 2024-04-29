import { defineStore } from 'pinia'
import { store } from '/@/store'

export type MapState = {
  infowindow: Object | null
}
export const useMapStore = defineStore({
  id: 'map',
  state: (): MapState => ({
    infowindow: null // 地图弹框
  }),
  getters: {
    getInfowindow(state: MapState): object | null {
      return state.infowindow
    }
  },
  actions: {
    setInfoWindow(data: any) {
      debugger
      this.infowindow = data
    }
  }
})
// Need to be used outside the setup
export function useMapStoreWithOut() {
  return useMapStore(store)
}
