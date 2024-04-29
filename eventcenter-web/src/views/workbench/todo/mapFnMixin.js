import service from '@/api/dispatch'

const iconMap = {
  '1': require('@/assets/workbench/一般.png'),
  '2': require('@/assets/workbench/重大.png'),
  '3': require('@/assets/workbench/特大.png')
}
export default {
  data() {
    return {
      centerMarker: null,
      nearGirdsLayers: [],
      circleMoveLayers: [],
      circleLayer: null,
      radiusLine: null,
      videoMarkers: [],
      gridmanMarkers: [],
      videoPopObj: null,
      gridManObj: null,
      lastEvent: {
        near: false,
        center: false,
        id: ''
      },
      moveLayers: [],
      eventMarkers: []
    }
  },
  beforeDestroy() {
    this.clearCenterEvent()
    this.clearNear()
    this.clearEventMarkers()
  },
  methods: {
    getEventLatlng(eventObj, isWkt) {
      // 渲染定位点
      const { coordx, coordy, gcj02, wgs84 } = eventObj
      let point
      if (window.GLOBAL_CONFIG.mapcoordinate === '10' && gcj02) {
        point = gcj02
      } else if (window.GLOBAL_CONFIG.mapcoordinate === '50' && wgs84) {
        point = wgs84
      } else {
        point = `POINT(${coordx} ${coordy})`
      }
      if (point.indexOf('undefined') > -1) {
        return
      }
      // 对 point 进行转换
      return isWkt ? point : this.twoD_map.parsePointWktReverse(point)
    },
    //  渲染半径圆
    _eventNearFn(eventObj) {
      const latlng = this.getEventLatlng(eventObj)
      if (!latlng) {
        this.$message.warning('未获取到事件坐标')
        return
      }
      this.clearNear()
      // 同一个事件 二次点击 取消上图
      if (this.lastEvent.id === eventObj.id && this.lastEvent.near) {
        this.lastEvent.near = false
        return
      }
      // 切换事件 清除定位
      if (this.lastEvent.id !== eventObj.id) {
        this.clearCenterEvent()
        this.lastEvent.center = false
      }
      this.lastEvent.id = eventObj.id
      this.lastEvent.near = true
      this.twoD_map.flyToPoint(latlng, 16, { duration: 0.5, animate: false })
      this.circleLayer = this.twoD_map.renderCircle(latlng, { radius: 500, color: '#1D6FFF', weight: 2, fillOpacity: 0.1 })
      this.circleMoveLayers.push(this.circleLayer)
      const radiusMarkerlatLng = this.twoD_map.getDestinationLatlng(latlng, 0.5, 90)
      const eventMarker = this.twoD_map.renderMarker(
        latlng, '', '',
        {
          icon: L.icon({
            iconUrl: require('@/assets/workbench/定位todo.png'),
            iconSize: [36, 36],
            iconAnchor: [18, 36]
          }),
          bindObj: {},
          riseOnHover: true,
          riseOffset: 300,
          zIndexOffset: 1
        }
      )
      this.circleMoveLayers.push(eventMarker)
      this.circleMovePoint = this.twoD_map.renderMarker(
        radiusMarkerlatLng, '', '',
        {
          icon: L.icon({
            iconUrl: require('@/assets/workbench/circlepoint1_b.png'),
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          }),
          bindObj: {},
          riseOnHover: true,
          riseOffset: 250,
          zIndexOffset: 999,
          draggable: true
        }
      )
      this.circleMoveLayers.push(this.circleMovePoint)
      const radiusValMarker = this.twoD_map.renderMarker(
        radiusMarkerlatLng, '', '',
        {
          icon: L.divIcon({
            html: `<div class="radius-val">半径<br>500米</div>`
          }),
          bindObj: {},
          riseOnHover: true,
          riseOffset: 250,
          zIndexOffset: 99
        }
      )
      this.circleMoveLayers.push(radiusValMarker)
      this.radiusLine = L.polyline([latlng, radiusMarkerlatLng], { color: '#1D6FFF', weight: 2 }).addTo(this.twoD_map.map)
      this.circleMoveLayers.push(this.radiusLine)
      this.twoD_map.registerLayerEvent(this.circleMovePoint, 'drag', (e) => {
        this.radiusLine.setLatLngs([latlng, e.latlng])
        const radius = this.twoD_map.getDistanceByPoints(latlng.slice().reverse(), [e.latlng.lng, e.latlng.lat])
        this.circleLayer.setRadius(radius * 1000)
        radiusValMarker.setLatLng(e.latlng)
        radiusValMarker.setIcon(
          L.divIcon({
            html: `<div class="radius-val">半径<br>${(radius * 1000).toFixed(1)}米</div>`
          })
        )
      })
      this.twoD_map.registerLayerEvent(this.circleMovePoint, 'dragend', (e) => {
        const endLatlng = e.target._latlng
        const radius = this.twoD_map.getDistanceByPoints(latlng.slice().reverse(), [endLatlng.lng, endLatlng.lat])
        this.getCameras(eventObj, radius * 1000)
        this.getGridman(eventObj, radius * 1000)
      })
      // 首次
      this.getCameras(eventObj, 500)
      this.getGridman(eventObj, 500)
    },
    // 周边摄像头
    async getCameras(eventObj, radius) {
      this.videoMarkers.forEach(layer => {
        this.twoD_map.removeLayer(layer)
      })
      this.videoMarkers = []
      const params = {
        // coodinate: window.GLOBAL_CONFIG?.mapcoordinate === '10' ? 'gcj02' : 'wg84',
        wkt: this.getEventLatlng(eventObj, true),
        interval: Math.ceil(radius)
      }
      const res = await service.getNearCameras(params)
      const arr = res.data || []
      arr.forEach(item => {
        const marker = this.twoD_map.renderMarker(
          this.twoD_map.parsePointWktReverse(item.wkt), '', '',
          {
            icon: L.icon({
              iconUrl: require('@/assets/workbench/摄像头.png'),
              iconSize: [50, 50],
              iconAnchor: [25, 50]
            }),
            bindObj: item,
            riseOnHover: true,
            riseOffset: 250,
            zIndexOffset: 899
          }
        )
        this.twoD_map.registerLayerEvent(marker, 'click', (e) => {
          const obj = e.target.options.bindObj
          this.videoPopObj = obj
          if (this.gridManObj) {
            this.gridManObj = null
            this.stopGuiji()
          }
        })
        this.videoMarkers.push(marker)
      })
    },
    // 周边网格员
    async getGridman(eventObj, radius) {
      this.gridmanMarkers.forEach(layer => {
        this.twoD_map.removeLayer(layer)
      })
      this.gridmanMarkers = []
      const params = {
        wkt: this.getEventLatlng(eventObj, true),
        interval: Math.ceil(radius),
        coodinate: window.GLOBAL_CONFIG?.mapcoordinate || '50'
      }
      const res = await service.getGridPowerList({ ...params })
      let arr = res.data || []
      arr = arr.filter(item => !!item.lastLocation)
      arr.forEach(item => {
        const marker = this.twoD_map.renderMarker(
          this.twoD_map.parsePointWktReverse(item.lastLocation), '', '',
          {
            icon: L.divIcon({
              html: `<div class="gridman-marker-bggm"><div class="gm-name">${item.name}</div></div>`,
              iconSize: [50, 50],
              iconAnchor: [19, 50]
            }),
            bindObj: item,
            riseOnHover: true,
            riseOffset: 900,
            zIndexOffset: 899
          }
        )
        this.twoD_map.registerLayerEvent(marker, 'click', (e) => {
          const obj = e.target.options.bindObj
          this.gridManObj = obj
          if (this.videoPopObj) {
            this.videoPopObj = null
          }
        })
        this.gridmanMarkers.push(marker)
      })
    },
    // 定位事件
    _centerEvent(eventObj) {
      this.clearCenterEvent()
      // 同一个事件 二次点击 取消上图
      if (this.lastEvent.id === eventObj.id && this.lastEvent.center) {
        this.lastEvent.center = false
        // 清除事件图标
        this.eventMarkers.forEach(marker => {
          this.twoD_map.addLayer(marker)
        })
        return
      }
      // 定位和周边如果两次事件id不一致 则清除
      if (this.lastEvent.id !== eventObj.id) {
        this.clearNear()
        this.lastEvent.near = false
      }
      this.lastEvent.id = eventObj.id
      this.lastEvent.center = true
      this.eventMarkers.forEach(marker => {
        this.twoD_map.removeLayer(marker)
      })
      const latLng = this.getEventLatlng(eventObj)
      if (!latLng) {
        this.$message.warning('未获取到事件坐标')
        return
      }
      // 定位图标放大 覆盖
      this.centerMarker = this.twoD_map.renderMarker(
        latLng,
        '',
        {},
        {
          bindObj: eventObj,
          zIndexOffset: 999,
          riseOnHover: true,
          // interactive: false,
          // eslint-disable-next-line no-undef
          icon: L.icon({
            iconUrl: iconMap[eventObj.eventUrgent] || require('@/assets/workbench/定位todo.png'),
            iconSize: iconMap[eventObj.eventUrgent] ? [50, 50] : [48, 48],
            iconAnchor: iconMap[eventObj.eventUrgent] ? [25, 50] : [24, 48]
          })
        }
      )
      this.twoD_map.registerLayerEvent(this.centerMarker, 'click', e => {
        const eventObj = e.target.options.bindObj
        const query = {
          taskId: eventObj.taskId,
          id: eventObj.id
        }
        if (this.$route.query.speType) query.speType = this.$route.query.speType
        this.$router.push({
          path: '/workbench/todo/info',
          query
        })
      })
      this.twoD_map.flyToPoint(latLng, eventObj.gridCode ? 16 : 14, { duration: 0.5, animate: false })
      this.getNearGrids(eventObj)
    },
    // 周边网格
    async getNearGrids(eventObj) {
      const gCode = eventObj.gridCode || eventObj.communityCode || eventObj.streetCode
      if (!gCode) {
        this.$message.warning('未获取到事件发生网格')
        return
      }
      const res = await service.getNearGrids({ gridCode: gCode, containsSelf: true })
      const grids = res.data || []
      grids.forEach(item => {
        if (item.geom) {
          const layer = this.twoD_map.renderGeoJsonByWkt(item.geom, item, {
            color: item.code === gCode ? '#FF4333' : '#FFA41E',
            // dashArray: [6, 8],
            weight: 1,
            fillColor: item.code === gCode ? '#FF4333' : '#FFA41E',
            fillOpacity: 0.2,
            bindObj: item
          })
          this.twoD_map.registerLayerEvent(layer, 'mousemove', (e) => {
            e.target.setStyle && e.target.setStyle({ fillOpacity: 0.4 })
          })
          this.twoD_map.registerLayerEvent(layer, 'mouseout', (e) => {
            e.target.setStyle && e.target.setStyle({ fillOpacity: 0.2 })
          })
          this.twoD_map.registerLayerEvent(layer, 'click', (e) => {
            this.gridObj = e.target.options.bindObj
            this.gridDialogVisible = true
          })
          this.nearGirdsLayers.push(layer)
          // 网格飞地
          if (item.geomCenter && item.geomCenter.split(',').length > 1) {
            const wktArr = item.geomCenter.split(',')
            wktArr.forEach(wkt => {
              const label = this.twoD_map.renderMarker(this.twoD_map.parsePointWktReverse(wkt), '', '', {
                icon: L.divIcon({ html: `<div class="polygon-label-icon polygon-label-icon-${item.code === gCode}">${item.name}</div>`, iconSize: [118, 20] }),
                interactive: false,
                opacity: 1
              })
              this.nearGirdsLayers.push(label)
            })
          } else {
            const label = this.twoD_map.renderMarker(this.twoD_map.parsePointWktReverse(this.twoD_map.getCenterWktPoint(item.geom)), '', '', {
              icon: L.divIcon({ html: `<div class="polygon-label-icon polygon-label-icon-${item.code === gCode}">${item.name}</div>`, iconSize: [118, 20] }),
              interactive: false,
              opacity: 1
            })
            this.nearGirdsLayers.push(label)
          }
        }
      })
    },
    // 定位产生的图层 清除
    clearCenterEvent() {
      if (this.centerMarker) {
        this.twoD_map.removeLayer(this.centerMarker)
        this.centerMarker = null
      }
      this.nearGirdsLayers.forEach(layer => {
        this.twoD_map.removeLayer(layer)
      })
      this.nearGirdsLayers = []
    },
    // z周边产生的图层清楚
    clearNear() {
      this.stopGuiji()
      this.circleMoveLayers.forEach(layer => {
        this.twoD_map.removeLayer(layer)
      })
      this.circleMoveLayers = []
      this.circleLayer = null
      this.circleMovePoint = null
      this.radiusLine = null
      this.videoMarkers.forEach(layer => {
        this.twoD_map.removeLayer(layer)
      })
      this.videoMarkers = []
      this.videoPopObj = null
      this.gridmanMarkers.forEach(layer => {
        this.twoD_map.removeLayer(layer)
      })
      this.gridmanMarkers = []
      this.gridManObj = null
    },
    // 轨迹
    _showGuiji(gobj) {
      this.stopGuiji()
      // gobj.recordLine = 'LINESTRING(109.23292153052635 35.58529402021082,109.23875889777452 35.58459618855817,109.23983194322459 35.580095028286934,109.23294299143537 35.57911799884289)'
      if (gobj.recordLine) {
        this.showGjStop = true
        const lineGeom = this.twoD_map.parseWkt(gobj.recordLine)
        if (lineGeom.type === 'LineString') {
          const latlngs = lineGeom.coordinates.map(lnglat => lnglat.slice().reverse())
          this.moveLayers = this.twoD_map.renderGridManMoveLine(latlngs, true)
        } else {
          this.$message.warning('轨迹数据有误')
        }
      } else {
        this.$message.warning('该网格员无轨迹数据！')
      }
      console.log('this.showGjStop = true', this.showGjStop)
    },
    stopGuiji() {
      this.moveLayers.forEach(layer => {
        this.twoD_map.removeLayer(layer)
      })
      this.moveLayers = []
      this.showGjStop = false
    },
    // 事件上图-跟随列表
    _renderEventMarkers(arr) {
      this.clearCenterEvent()
      this.clearEventMarkers()
      arr.forEach(item => {
        const latLng = this.getEventLatlng(item)
        if (latLng) {
          const marker = this.twoD_map.renderMarker(
            latLng,
            '',
            {},
            {
              bindObj: item,
              zIndexOffset: 899,
              riseOnHover: true,
              // interactive: false,
              // eslint-disable-next-line no-undef
              icon: L.icon({
                iconUrl: iconMap[item.eventUrgent] || require('@/assets/workbench/定位todo.png'),
                iconSize: iconMap[item.eventUrgent] ? [50, 50] : [48, 48],
                iconAnchor: iconMap[item.eventUrgent] ? [25, 50] : [24, 48]
              })
            }
          )
          this.twoD_map.registerLayerEvent(marker, 'click', e => {
            const eventObj = e.target.options.bindObj
            const query = {
              taskId: eventObj.taskId,
              id: eventObj.id
            }
            if (this.$route.query.speType) query.speType = this.$route.query.speType
            this.$router.push({
              path: '/workbench/todo/info',
              query
            })
          })
          this.eventMarkers.push(marker)
        }
      })
    },
    clearEventMarkers() {
      this.eventMarkers.forEach(marker => {
        this.twoD_map.removeLayer(marker)
      })
      this.eventMarkers = []
    }
  }
}

