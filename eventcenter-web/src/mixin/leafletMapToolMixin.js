import TwoDimensionalMap from '@/utils/mapTool/TwoDimensionalMap'
export default {
  data() {
    return {
      mapCaseClass: null// 二维地图类对象，真实map对象为mapCaseClass.map
    }
  },
  methods: {
    // type  1白底 2黑底  3影像
    initTwoDMap(mapId = 'map', type = 1) {
      const MAPCONFIG = window.GLOBAL_CONFIG.erwei
      this.mapCaseClass = new TwoDimensionalMap(mapId, type === 2 ? MAPCONFIG.darkMapUrl : type === 3 ? MAPCONFIG.yingxiangUrl : MAPCONFIG.mapUrl)
    }
  }
}
