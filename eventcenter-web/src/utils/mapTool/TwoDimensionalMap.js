// 二维地图包引入
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '@supermap/iclient-leaflet'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
require('./leaflet-plugins/pulse')
require('./leaflet-plugins/pulse.css')
require('./water.scss')
import 'leaflet.motion/dist/leaflet.motion.min.js'
import 'leaflet.markercluster/dist/leaflet.markercluster.js'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet-hotline/dist/leaflet.hotline.min.js'
require('./leaflet-plugins/heatLayer')
const WKT = require('terraformer-wkt-parser')
import * as turf from '@turf/turf'

const matrixIds = [{
  'identifier': 1
}, {
  'identifier': 2
}, {
  'identifier': 3
}, {
  'identifier': 4
}, {
  'identifier': 5
}, {
  'identifier': 6
}, {
  'identifier': 7
}, {
  'identifier': 8
}, {
  'identifier': 9
}, {
  'identifier': 10
}, {
  'identifier': 11
}, {
  'identifier': 12
}, {
  'identifier': 13
}, {
  'identifier': 14
}, {
  'identifier': 15
}, {
  'identifier': 16
}, {
  'identifier': 17
}, {
  'identifier': 18
}, {
  'identifier': 19
}]

export default class TwoDimensionalMap {
  
  constructor(mapId, mapUrl, center, zoom, minZoom, maxZoom, isSuperMapU, maxBoundsU, cb) {
    const MAPCONFIG = window.GLOBAL_CONFIG.erwei
    console.log('map222', center, MAPCONFIG.center)
    const isSuperMap = isSuperMapU !== undefined ? isSuperMapU : MAPCONFIG.isSuperMap
    const maxBounds = maxBoundsU !== undefined ? maxBoundsU : MAPCONFIG.maxBounds
    const mOption = {
      center: center || MAPCONFIG.center, // 地图中心
      zoom: zoom || MAPCONFIG.zoom, // 缩放比列
      minZoom: minZoom || MAPCONFIG.minZoom,
      maxZoom: maxZoom || MAPCONFIG.maxZoom,
      zoomControl: false, // 禁用 + - 按钮
      doubleClickZoom: false, // 禁用双击放大
      attributionControl: false // 移除右下角leaflet标识
    }
    // 系统地图服务是否为超图服务  84坐标   全局配置获取
    if (isSuperMap) {
      mOption.crs = L.CRS.EPSG4326
    }
    if (maxBounds && maxBounds.length) {
      mOption.maxBounds = L.latLngBounds(maxBounds[0], maxBounds[1])
    }
    this.map = L.map(mapId, mOption)
    if (!isSuperMap) {
      this.bottomLayer = L.tileLayer(mapUrl || MAPCONFIG.mapUrl).addTo(
        this.map
      )
    } else {
      // this.bottomLayer = L.supermap
      //   .tiledMapLayer(mapUrl || MAPCONFIG.mapUrl)
      //   .addTo(this.map)
      // this.bottomLayer = L.tileLayer.wms(MAPCONFIG.mapUrl, {
      //     layers: 'HLMAP',
      //     format: 'image/png',
      //     version: '1.1.0',
      //     crs: L.CRS.EPSG4326
      // }).addTo(this.map);

      this.bottomLayer = L.supermap.wmtsLayer(mapUrl || MAPCONFIG.mapUrl, {
        layer: 'vec',
        style: 'default',
        tilematrixSet: 'c',
        matrixIds: matrixIds,
        format: 'tiles',
        requestEncoding: 'KVP'
      })
        .addTo(this.map)
    }
    this.map?.pm?.setLang('zh')
    this.map.on('pm:remove', (e) => {
      console.log('del', e)
    })
    // this.map.pm.setLang('zh')
    cb && cb()
  }
  setView(larlng, zoom) {
    this.map.setView(larlng, zoom)
  }
  icon(options) {
    return L.icon(options)
  }
  divIconWhh(options) {
    return L.divIcon(options)
  }
  divIcon() {
    return L.divIcon({
      html: `<div id="grad3">
              <div class="biggest-circle">
                <div class="middle-circle">
                  <div class="inner-circlea"></div>
                </div>
              </div>
            </div>`,
      iconSize: [0, 0],
      iconAnchor: [30, 30]
    })
  }
  setZoom(level) {
    this.map.setZoom(level)
  }
  // x销毁
  destroyMap() {
    this.map.remove()
    this.map = null
  }
  // 通过多边形by latlngs
  renderPolygonBylatlngs(
    latlngs,
    bindObj = {},
    options = {
      color: 'rgb(93,182,250)',
      fillColor: 'rgb(93,182,250)',
      fillOpacity: 0.45
    }
  ) {
    const layer = L.polygon(latlngs, {
      ...options,
      bindObj
    }).addTo(this.map)
    return layer
  }
  // 通过多边形by latlngs
  renderPolygonBylatlngsWhh(
    latlngs,
    bindObj = {},
    options = {
      color: 'rgb(93,182,250)',
      fillColor: 'rgb(93,182,250)',
      fillOpacity: 0.45
    }
  ) {
    const layer = L.polygon(latlngs, {
      ...options,
      bindObj
    })
    return layer
  }
  // fitbounds
  fitBounds(bounds, paddingOption = {
    padding: [150, 150]
  }) {
    this.map.fitBounds(bounds, paddingOption)
  }
  // 注册layer事件
  registerLayerEvent(layer, eventType, fn) {
    layer.on(eventType, fn)
  }
  layerGroup(layers) {
    return L.layerGroup(layers)
  }
  // 清除图层
  removeLayer(layer) {
    this.map.removeLayer(layer)
  }
  // 清添加图层
  addLayer(layer) {
    this.map.addLayer(layer)
  }
  renderHotLine(data, options) {
    return L.hotline(data, options).addTo(this.map)
  }
  // 渲染标记--图片icon,传了customeOptions将不使用imgUrl
  renderMarkerWhhYuan(latlng, options) {
    return L.marker(latlng, options)
  }
  renderMarkerWhh(latlng, imgUrl, bindObj = {}, customeOptions) {
    const options = customeOptions || {
      icon: L.icon({
        iconUrl: imgUrl,
        iconSize: [36, 36]
      }),
      bindObj,
      riseOnHover: true,
      riseOffset: 250,
      zIndexOffset: 8
    }
    return L.marker(latlng, options)
  }
  // 渲染标记--图片icon,传了customeOptions将不使用imgUrl
  renderMarker(latlng, imgUrl, bindObj = {}, customeOptions) {
    const options = customeOptions || {
      icon: L.icon({
        iconUrl: imgUrl,
        iconSize: [36, 36]
      }),
      bindObj,
      riseOnHover: true,
      riseOffset: 250,
      zIndexOffset: 8
    }
    return L.marker(latlng, options).addTo(this.map)
  }
  // 动态点闪烁
  renderPulse(latlng, iconSize = [16, 16], fillColor = 'red', color = 'red') {
    const pulseIcon = L.icon.pulse({
      iconSize,
      fillColor,
      color
    })
    return L.marker(latlng, {
      icon: pulseIcon,
      zIndexOffset: 999
    }).addTo(
      this.map
    )
  }
  // 飞向某个点位
  flyToPoint(latlng, zoom = 15, opts = {
    duration: 1,
    animate: true
  }) {
    this.map.flyTo(latlng, zoom, opts)
  }
  // 翻转经纬度  不改变原数组
  reverseLnglat(lnglat) {
    return lnglat.slice().reverse()
  }
  // 获取真实map对象
  getMap() {
    return this.map
  }
  // 画圆
  renderCircle(latlng, options = {
    radius: 200
  }) {
    return L.circle(latlng, options).addTo(this.map)
  }
  // pointwhh
  createPointWhh(x, y) {
    return L.point(x, y)
  }
  // popupwhh
  createPopUpWhh(popOpts = {}) {
    return L.popup(popOpts)
  }
  // popup
  createPopUp(latlng, htmlContent, popOpts = {
    closeButton: false
  }) {
    return L.popup(popOpts)
      .setLatLng(latlng || undefined)
      .setContent(htmlContent || '')
      .openOn(this.map)
  }
  // Point转换wkt数据并反转经纬度
  parsePointWktReverse(wktStr) {
    const geoJson = WKT.parse(wktStr)
    return geoJson.coordinates.reverse()
  }
  // Line转换wkt数据并反转经纬度
  parseLinesWktReverse(wktStr) {
    const geoJson = WKT.parse(wktStr)
    const coordinatesUse = geoJson.coordinates
    const coordinatesUseArray = []
    coordinatesUse.forEach(val => {
      val.reverse()
      coordinatesUseArray.push(val)
    })
    return coordinatesUseArray
  }
  // Polygon转换wkt数据并反转经纬度
  parsePolygonWktReverse(wktStr) {
    const geoJson = WKT.parse(wktStr)
    const coordinatesUse = geoJson.coordinates
    // 2层循环
    const coordinatesUseArray1 = []
    coordinatesUse.forEach(val1 => {
      const coordinatesUseArray2 = []
      val1.forEach(val2 => {
        val2.reverse()
        coordinatesUseArray2.push(val2)
      })
      coordinatesUseArray1.push(coordinatesUseArray2)
    })
    return coordinatesUseArray1
  }
  // MultiPolygon转换wkt数据并反转经纬度
  parseMultiPolygonWktReverse(wktStr) {
    const geoJson = WKT.parse(wktStr)
    const coordinatesUse = geoJson.coordinates
    // 3层循环
    const coordinatesUseArray1 = []
    coordinatesUse.forEach(val1 => {
      const coordinatesUseArray2 = []
      val1.forEach(val2 => {
        const coordinatesUseArray3 = []
        val2.forEach(val3 => {
          val3.reverse()
          coordinatesUseArray3.push(val3)
        })
        coordinatesUseArray2.push(coordinatesUseArray3)
      })
      coordinatesUseArray1.push(coordinatesUseArray2)
    })
    return coordinatesUseArray1
  }
  // geometry转换为wkt
  convertGeomatryToWkt(geometry) {
    return WKT.convert(geometry)
  }
  // wkt转换为geometry
  parseWkt(wktStr) {
    return WKT.parse(wktStr)
  }
  // 转换wkt为Geometry-geojson然后渲染
  renderGeoJsonByWkt(
    wktStr,
    properties = {},
    options = {
      style: {
        color: '#0961ae',
        fillColor: '#0961ae',
        fillOpacity: 0.5
      }
    }
  ) {
    const geometry = WKT.parse(wktStr)
    return L.geoJSON({
      type: 'Feature',
      properties,
      geometry
    }, options).addTo(
      this.map
    )
  }
  // latlng数组生成fitbounds
  createLatLngBounds(latlngs) {
    return L.latLngBounds(latlngs)
  }
  // 折线by latlngs
  renderPolylineBylatlngs(
    latlngs,
    bindObj = {},
    options = {
      color: '#ff3d00',
      weight: 5
    }
  ) {
    const layer = L.polyline(latlngs, {
      ...options,
      bindObj
    }).addTo(this.map)
    return layer
  }
  // maker在线上运动轨迹
  renderMovingPolylineBylatlngs(
    latlngs,
    options = {
      color: '#ff3d00',
      weight: 5
    },
    motionOptions = {
      auto: true,
      duration: 5000
    },
    markerOptions = {
      removeOnEnd: false,
      showMarker: true,
      icon: L.icon({
        iconUrl: '/static/grid_management_platform/erweiicons/location-red.png',
        iconSize: [25, 32],
        iconAnchor: [12.5, 32]
      })
    }
  ) {
    const layer = L.motion
      .polyline(latlngs, options, motionOptions, markerOptions)
      .addTo(this.map)
    return layer
  }
  // LonLat 是否在区域范围内  此处需要传geojson，传数组的话turf.polygon可能会出错
  iscontains(point, areaFeature) {
    return turf.booleanPointInPolygon(turf.point(point), areaFeature)
  }
  // 渲染一个热力图
  renderHeatLayer(
    heatLatlngs,
    opts = {
      radius: 30,
      minOpacity: 0.5
    }
  ) {
    return L.heatLayer(heatLatlngs, opts).addTo(this.map)
  }
  renderHeatLayerWhh(
    heatLatlngs,
    opts = {
      radius: 30,
      minOpacity: 0.5
    }
  ) {
    return L.heatLayer(heatLatlngs, opts)
  }
  // Geometry-geojson然后渲染
  renderGeoJson(
    geoJson,
    options = {
      style: {
        color: '#0961ae',
        fillColor: '#0961ae',
        fillOpacity: 0.5
      }
    }
  ) {
    return L.geoJSON(geoJson, options).addTo(this.map)
  }
  // 点聚合对象
  createNewCluster(options) {
    return L.markerClusterGroup(options || {})
  }
  // 渲染标记--图片icon,传了customeOptions将不使用imgUrl
  createMrker(wkt, imgUrl, bindObj = {}, customeOptions) {
    const geometry = WKT.parse(wkt)
    const options = customeOptions || {
      icon: L.icon({
        iconUrl: imgUrl,
        iconSize: [32, 32]
      }),
      bindObj,
      riseOnHover: true,
      riseOffset: 250,
      zIndexOffset: 8
    }
    return L.marker(geometry.coordinates.reverse(), options)
  }
  // 获取中心点
  getCenterWktPoint(wktStr) {
    if (!wktStr) return ''
    const geometry = WKT.parse(wktStr)
    const center = turf.center(geometry)
    if (center.geometry && center.geometry.type === 'Point') {
      const coor = center.geometry.coordinates
      return `POINT (${coor[0]} ${coor[1]})`
    }
    return ''
  }
  // 红色水波纹
  renderRedWater(latlng, iconAnchor) {
    return this.renderMarker(latlng, '', '', {
      icon: L.divIcon({
        html: `<div id="grad2">
                  <div class="biggest-circle">
                      <div class="middle-circle">
                          <div class="inner-circle"></div>
                      </div>
                  </div>
                </div>`,
        iconAnchor: [30, 34]
      }),
      bindObj: {}
    })
  }
}
