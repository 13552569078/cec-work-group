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
      clearKuangxuanMarker: null,
      isClickGridLayer: false,
      nearGirdsLayers: [],
      lastEvent: {
        near: false,
        center: false,
        id: ''
      },
      moveLayers: [],
      eventMarkers: [],
      polygonOptions: {
        finishOnDoubleClick: false, // 双击结束绘制的开关；此特性当前版本不生效，且最新版本有 Bug, 暂不做版本升级
        templineStyle: {
          color: '#FF4D4F'
        },
        hintlineStyle: {
          color: '#FF4D4F'
        },
        pathOptions: {
          color: '#FF4D4F'
        },
        snappable: true,
        snapDistance: 20
      }
    }
  },
  beforeDestroy() {
    this.clearCenterEvent()
    this.clearGrids()
    this.clearEventMarkers()
    this.clearKuangxuan()
    this.removeClickMap()
  },
  methods: {
    setClickMap() {
      this.twoD_map.registerMapEvent('click', (e) => {
        if (this.showDetail || this.isKuangxuanMode || this.isClickGridLayer) return
        const checkedNodes = this.$refs.eventAddressRef.getCheckedNodes()
        if (checkedNodes.length > 0) {
          const areaTreePath = checkedNodes[0].path
          // areaTreePath.length 为 1当前选中为最上级区域
          if (areaTreePath.length > 1) {
            // 非最上级区域，点击空白返回父级
            this.gridId = areaTreePath[areaTreePath.length - 2]
            this.setGridArea(this.gridId)
          }
        }
      })
    },
    removeClickMap() {
      this.twoD_map.removeMapEvent('click')
    },
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
    // 定位事件
    _centerEvent(eventObj) {
      this.clearCenterEvent()
      this.clearGrids()
      this.clearKuangxuan()
      // 同一个事件 二次点击 取消上图
      // if (this.lastEvent.id === eventObj.id && this.lastEvent.center) {
      //   this.lastEvent.center = false
      //   // 清除事件图标
      //   this.eventMarkers.forEach(marker => {
      //     this.twoD_map.addLayer(marker)
      //   })
      //   return
      // }
      // // 定位和周边如果两次事件id不一致 则清除
      // if (this.lastEvent.id !== eventObj.id) {
      //   this.lastEvent.near = false
      // }
      // this.lastEvent.id = eventObj.id
      // this.lastEvent.center = true
      this.eventMarkers.forEach(marker => {
        this.twoD_map.removeLayer(marker)
      })
      const latLng = this.getEventLatlng(eventObj)
      if (!latLng) {
        this.$message.warning('未获取到事件坐标')
        return
      }
      console.log(latLng, 'center')
      // 定位图标放大 覆盖
      this.centerMarker = this.twoD_map.renderMarker(
        latLng,
        '',
        {},
        {
          zIndexOffset: 999,
          riseOnHover: true,
          // interactive: false,
          // eslint-disable-next-line no-undef
          icon: L.icon({
            iconUrl: require('@/assets/marker-icon.png'),
            iconSize: iconMap[eventObj.eventUrgent] ? [50, 50] : [48, 48],
            iconAnchor: iconMap[eventObj.eventUrgent] ? [25, 50] : [24, 48]
          })
        }
      )
      this.twoD_map.flyToPoint(latLng, 16, { duration: 0.5, animate: false })
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
            color: item.gridCode === gCode ? '#4CC09E' : '#1D6FFF',
            // dashArray: [6, 8],
            weight: 1,
            fillColor: item.gridCode === gCode ? '#4CC09E' : '#1D6FFF',
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
                icon: L.divIcon({ html: `<div class="polygon-label-icon polygon-label-icon-${item.gridCode === gCode}">${item.name}</div>`, iconSize: [118, 20] }),
                interactive: false,
                opacity: 1
              })
              this.nearGirdsLayers.push(label)
            })
          } else {
            const label = this.twoD_map.renderMarker(this.twoD_map.parsePointWktReverse(this.twoD_map.getCenterWktPoint(item.geom)), '', '', {
              icon: L.divIcon({ html: `<div class="polygon-label-icon polygon-label-icon-${item.gridCode === gCode}">${item.name}</div>`, iconSize: [118, 20] }),
              interactive: false,
              opacity: 1
            })
            this.nearGirdsLayers.push(label)
          }
        }
      })
    },
    // 查询所选网格
    async getSelectedAreaGrid(gridId) {
      this.clearCenterEvent()
      this.clearGrids()
      this.clearKuangxuan()
      const res = await service.getOrgWkt({ gridId })
      const resChilren = await service.getByIdWithChildren({ id: gridId })
      const curGrid = res.data
      const grids = curGrid.haveChild ? resChilren.data?.children : [res.data]
      if (!curGrid || !curGrid?.geomCenter) {
        this.$message.warning('未获取到网格坐标')
        return
      }
      // 此处网格中心返回为反 "POINT(35.58976339757623 109.06330834496026)"
      const centerArr = curGrid.geomCenter.split(' ')
      const coordy = centerArr[0].split('POINT(')[1]
      const coordx = centerArr[1].split(')')[0]
      const centerPoint = `POINT(${coordx} ${coordy})`
      const latLng = this.twoD_map.parsePointWktReverse(centerPoint)
      const zoom = curGrid.level * 2 + 2

      grids.forEach(item => {
        if (item.geom) {
          const layer = this.twoD_map.renderGeoJsonByWkt(item.geom, item, {
            color: '#1D6FFF',
            // dashArray: [6, 8],
            weight: 1,
            fillColor: '#1D6FFF',
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
            this.isClickGridLayer = true
            this.setGridArea(item.id)
            setTimeout(() => {
              this.isClickGridLayer = false
            }, 1000)
          })
          this.nearGirdsLayers.push(layer)
          // 网格飞地
          if (item.geomCenter && item.geomCenter.split(',').length > 1) {
            const wktArr = item.geomCenter.split(',')
            wktArr.forEach(wkt => {
              const label = this.twoD_map.renderMarker(this.twoD_map.parsePointWktReverse(wkt), '', '', {
                icon: L.divIcon({ html: `<div class="polygon-label-icon polygon-label-icon-${item.id === gridId}">${item.name}</div>`, iconSize: [118, 20] }),
                interactive: false,
                opacity: 1
              })
              this.nearGirdsLayers.push(label)
            })
          } else {
            const label = this.twoD_map.renderMarker(this.twoD_map.parsePointWktReverse(this.twoD_map.getCenterWktPoint(item.geom)), '', '', {
              icon: L.divIcon({ html: `<div class="polygon-label-icon">${item.name}</div>`, iconSize: [118, 20] }),
              interactive: false,
              opacity: 1
            })
            this.nearGirdsLayers.push(label)
          }
        }
      })
      const params = {
        gridId: curGrid.id,
        level: curGrid.level,
        frameWkt: ''
      }
      this.mapParams = params
      this.$nextTick(() => {
        this.oneQuerySearch()
      })
      this.twoD_map.flyToPoint(latLng, zoom, { duration: 0.5, animate: false })
    },
    // 点击框选地图按钮
    changeKuangXuanStatus(flag) {
      this.isClickKuangxuan = true
      this.isKuangxuanMode = flag
      this.showSearch = !flag
      this.clearGrids()
      this.clearEventMarkers()
      this.clearKuangxuan()
      if (this.isKuangxuanMode) {
        this.twoD_map.map.pm.enableDraw('Polygon', this.polygonOptions)
      } else {
        this.getSelectedAreaGrid(this.gridId)
      }
    },
    handleKuangXuan() {
      const _this = this
      // 绘制事件监听
      _this.twoD_map.map.on('pm:drawstart', (e) => {
        console.log(e, '绘制开始第一个点')
      })
      _this.twoD_map.map.on('pm:drawend', (e) => {
        console.log(e, '禁⽌绘制、绘制结束')
      })
      _this.twoD_map.map.on('pm:create', async(e) => {
        _this.curKuangxuanLayer = e.layer
        this.isClickKuangxuan = false
        this.showSearch = true
        const { lat, lng } = e.layer._latlngs[0][e.layer._latlngs.length - 1]
        const clearPoint = `POINT(${lng} ${lat})`
        const clearPointLatLng = this.twoD_map.parsePointWktReverse(clearPoint)
        _this.clearKuangxuanMarker = this.twoD_map.renderMarker(clearPointLatLng, '', '', {
          zIndexOffset: 1099,
          icon: L.divIcon({ html: `<div class="polygon-close-label">清除 <i class="el-icon-close"></i></div>`, iconSize: [68, 28], iconAnchor: [-14, 14] }),
          // interactive: false,
          opacity: 1
        })
        _this.twoD_map.registerLayerEvent(_this.clearKuangxuanMarker, 'click', (e) => {
          _this.changeKuangXuanStatus(true)
        })
        this.getEventInKuangxuan(e.layer)
      })
      _this.twoD_map.map.on('pm:globalremovalmodetoggled', (e) => {
        console.log(e, '清除图层时调用')
      })
    },

    // 定位产生的图层 清除
    clearCenterEvent() {
      if (this.centerMarker) {
        this.twoD_map.removeLayer(this.centerMarker)
        this.centerMarker = null
      }
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
    // 事件打点-跟随列表
    _renderEventMarkers(arr) {
      const _this = this
      this.clearEventMarkers()
      arr.forEach(item => {
        const latLng = this.getEventLatlng(item)
        if (latLng) {
          const marker = this.twoD_map.renderMarker(
            latLng,
            '',
            {},
            {
              zIndexOffset: 899,
              riseOnHover: true,
              markerData: item,
              // interactive: false,
              // eslint-disable-next-line no-undef
              icon: L.icon({
                iconUrl: require('@/assets/marker-icon.png'),
                iconSize: iconMap[item.eventUrgent] ? [50, 50] : [48, 48],
                iconAnchor: iconMap[item.eventUrgent] ? [25, 50] : [24, 48]
              })
            }
          )
          this.twoD_map.registerLayerEvent(marker, 'click', (e) => {
            _this.showEventDetail(item)
          })
          this.eventMarkers.push(marker)
        }
      })
    },
    // 禁用绘制框选
    disableKuangxuan() {
      this.twoD_map.map.pm.disableDraw('Polygon')
    },
    // 渲染框选图层
    renderKuangxuan(layer, zoom = 15) {
      this.twoD_map.addLayer(layer)
      this.twoD_map.setZoom(zoom)
    },
    // 获取框选中的事件列表
    getEventInKuangxuan(layer) {
      const _this = this
      const kuangxuanPolygonWKT = _this.twoD_map.convertGeomatryToWkt(layer.toGeoJSON().geometry)
      const params = {
        frameWkt: kuangxuanPolygonWKT,
        gridId: '',
        level: ''
      }
      try {
        this.mapParams = params
        this.$nextTick(() => {
          this.oneQuerySearch()
        })
      } catch (e) {
        _this.$message({
          message: '事件查询失败！',
          type: 'error'
        })
      }
    },
    // 获取当前地图zoom
    getMapZoom() {
      return this.twoD_map.map._zoom
    },
    // 清除框选
    clearKuangxuan() {
      // 先清除之前的框选，再触发框选功能
      this.markLayer && this.twoD_map.removeLayer(this.markLayer)
      this.curKuangxuanLayer && this.twoD_map.removeLayer(this.curKuangxuanLayer)
      this.clearKuangxuanMarker && this.twoD_map.removeLayer(this.clearKuangxuanMarker)
    },
    // 清除网格
    clearGrids() {
      this.nearGirdsLayers.forEach(layer => {
        this.twoD_map.removeLayer(layer)
      })
      this.nearGirdsLayers = []
    },
    // 清除事件打点
    clearEventMarkers() {
      this.eventMarkers.forEach(marker => {
        this.twoD_map.removeLayer(marker)
      })
      this.eventMarkers = []
    }
  }
}

