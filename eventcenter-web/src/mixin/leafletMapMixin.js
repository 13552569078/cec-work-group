import TwoDimensionalMap from '@/utils/map/TwoDimensionalMap'

export default {
  data() {
    return {
      twoD_map: null // 二维地图类对象，真实map对象为twoD_map.map
    }
  },
  methods: {
    initTwoDMap(mapId = 'map', type = 1) {
      this.twoD_map = new TwoDimensionalMap(mapId)
    },
    _zoomIn() {
      this.twoD_map?.map?.zoomIn()
    },
    _zoomOut() {
      this.twoD_map?.map?.zoomOut()
    },
    _reset() {
      // 如果有 marker 点位， 则回到该点位，否则回到初始化的中心点
      const markerPosition = this.eventMarker?.getLatLng() || window.GLOBAL_CONFIG.erwei?.center
      this.twoD_map?.map?.setView(markerPosition)
    }
  },
  beforeDestroy() {
    if (this.twoD_map) {
      this.twoD_map.destroyMap()
    }
  }
}
