/* eslint-disable */
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
export default {
  data() {
    return {
      orgWkt: '',
      orgName: '', // 网格名称
      orgTextLayer: null, // 机构名称图层
      orgLayer: null, // 机构图层
      AmapSearch: window.GLOBAL_CONFIG.erwei.AmapSearch || false, // 是否显示地址搜索服务
      searchPlaceText: '',
      placeSearch: null,
      showPanelClose: false,
      geocoder: null, // 地址编码服务
      eventMarker: null // 事件发生的图层
    }
  },
  watch: {
    orgWkt: {
      deep: true,
      handler(val) {
        this.echoWkt(val)
      }
    }
  },
  methods: {
    // 查询网格查询网格面数据
    getOrgWkt(gridId) {
      if (!gridId) return
      moduleSrv.getOrgWkt({ gridId }).then((res) => {
        if (res.code === SUCCESS_CODE) {
          const { name: orgName = '', geom: orgWkt = '' } = res.data || {}
          this.orgWkt = orgWkt
          this.orgName = orgName
        }
      })
    },
    // 绘制机构
    echoWkt(wkt) {
      if (this.orgLayer) {
        this.twoD_map?.removeLayer(this.orgLayer)
        this.twoD_map?.removeLayer(this.orgTextLayer)
      }
      const color = '#4caf50'
      if (!wkt) return
      this.orgLayer = this.twoD_map?.renderGeoJsonByWkt(
        wkt,
        {
          layerID: 'orgLayer'
        },
        {
          style: {
            color,
            fillColor: color,
            fillOpacity: 0.5
          }
        }
      )
      this.twoD_map?.flyToBounds(this.orgLayer.getBounds())

      // 绘制网格名称图层
      this.orgTextLayer = this.twoD_map?.renderLayerText(this.orgLayer, this.orgName)
    },
    // 判断是否显示 panel 关闭按钮
    async hasPanelClose() {
      await this.$nextTick()
      const _el = this.$refs.panelRef
      this.showPanelClose = _el.children?.length
    },
    _closePanel() {
      this.placeSearch && this.placeSearch.clear()
      this.showPanelClose = false
    },
    // 你地址解析
    getAddress(lnglat) {
      const that = this
      if (!lnglat) return
      const point = `${lnglat.lng}, ${lnglat.lat}`
      AMap.service(['AMap.Geocoder'], function() {
        if (!that.geocoder) {
          that.geocoder = new AMap.Geocoder()
        }
        that.geocoder?.getAddress(point, (status, result) => {
          console.log('status==', status, result)
          if (status === 'complete' && result.regeocode) {
            that.$set(that.form, 'eventAddress', result.regeocode.formattedAddress)
          }
        })
      })
    },
    // 地点搜索
    _searchPlace() {
      const that = this
      if (!this.searchPlaceText) {
        // 如果搜索地址为空，则清空查询项
        const _el = this.$refs.panelRef
        _el.removeChild(_el.children[0])
        return
      }
      AMap.service(['AMap.PlaceSearch'], function() {
        // 构造地点查询类
        const placeSearch = new AMap.PlaceSearch({
          pageSize: 5, // 单页显示结果条数
          pageIndex: 1, // 页码
          city: window.GLOBAL_CONFIG.erwei.city || '全国', // 兴趣点城市
          citylimit: true, // 是否强制限制在设置的城市内搜索
          extensions: 'all',
          panel: 'panel' // 结果列表将在此容器中进行展
        })
        that.placeSearch = placeSearch
        // 关键字查询
        placeSearch.search(that.searchPlaceText, function(status, result) {
          that.hasPanelClose()
          if (status !== 'complete') {
            // 列出常年的错误
            const errKeyMap = {
              SERVICE_NOT_AVAILABLE: '服务不可用',
              INVALID_USER_KEY: 'key不正确或过期',
              INVALID_USER_SCODE: '安全码未通过验证',
              INVALID_USER_DOMAIN: '绑定域名无效',
              USERKEY_PLAT_NOMATCH: '请求key与绑定平台不符',
              INSUFFICIENT_PRIVILEGES: '权限不足，服务请求被拒绝',
              USER_KEY_RECYCLED: 'Key被删除',
              INVALID_PARAMS: '请求参数非法',
              UNKNOWN_ERROR: '其他未知错误'
            }
            console.log('result==', result)
            that.$message.warning(errKeyMap[result] || result)
          }
        })
        // poi 面板列表项点击事件注册， markerClick poi 地区对应的 markket 被点击事件
        AMap.event.addListener(placeSearch, 'listElementClick', (e) => {
          // 绘制点，更新网格， 更新详情地址
          const { address, location } = e.data
          that.$set(that.form, 'eventAddress', address)
          that.renderMarker(location)
          // 通过定位查询网格
          that.searchGridDOByLonLat(location)
        })
      })
    },
    // 通过点位查询网格
    searchGridDOByLonLat(location) {
      const params = {
        geom: `POINT(${location.lng} ${location.lat})`,
        mapCoordinate: window.GLOBAL_CONFIG?.mapcoordinate // 数据取自配置文件
      }
      moduleSrv
        .searchGridDOByLonLat(params)
        .then((res) => {
          if (res.code === 0) {
            if (res.data) {
              this.$set(this.form, 'deptId', res.data.gridId)
              // 飞到指定点
              this.twoD_map.flyToPoint(location)
              this.getAddress(location)
            }
          } else {
            this.reseAddress()
          }
        })
        .catch((_err) => {
          console.log('通过点位查询网格-searchGridDOByLonLat', _err)
          this.reseAddress()
        })
    },
    // 绘制点位
    renderMarker(latlng, draggable = true) {
      const that = this
      if (this.eventMarker) this.twoD_map?.removeLayer(this.eventMarker)
      this.markerLatLng = `${latlng.lat},${latlng.lng}`
      this.form.coordx = latlng.lng // 经度
      this.form.coordy = latlng.lat // 纬度
      // 标记点位
      this.eventMarker = this.twoD_map?.renderMarker(
        latlng,
        '',
        {},
        {
          draggable,
          icon: L.icon({
            iconUrl: require('@/assets/marker-icon.png'),
            iconSize: [58, 55],
            iconAnchor: [20, 45]
          })
        }
      )
      this.twoD_map && this.twoD_map.registerLayerEvent(this.eventMarker, 'moveend', (sub) => {
        that.markerLatLng = `${sub.target._latlng.lat},${sub.target._latlng.lng}`
        that.form.coordx = sub.target._latlng.lat
        that.form.coordy = sub.target._latlng.lng
        // 更新网格信息
        that.searchGridDOByLonLat(sub.target._latlng)
      })
    }
  }
}
