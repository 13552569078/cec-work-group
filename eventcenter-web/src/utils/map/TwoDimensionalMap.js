/* eslint-disable */
// 二维地图包引入
import 'leaflet/dist/leaflet.css'
import 'leaflet'
import '@supermap/iclient-leaflet'
import * as turf from '@turf/turf'
import '@supermap/iclient-leaflet'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import './pulse'
import './pulse.css'
const WKT = require('terraformer-wkt-parser')
require('../mapTool/leaflet-plugins/polylineDecorator/L.PolylineDecorator.js')
require('../mapTool/leaflet-plugins/animationMarker.js')

const MAPCONFIG = window.GLOBAL_CONFIG.erwei
export default class TwoDimensionalMap {
    constructor(mapId, mapUrl, center, zoom, minZoom, maxZoom, cb) {
            const mOption = {
                    center: center || MAPCONFIG.center, // 地图中心
                    zoom: zoom || MAPCONFIG.zoom, // 缩放比列
                    minZoom: minZoom || MAPCONFIG.minZoom,
                    maxZoom: maxZoom || MAPCONFIG.maxZoom,
                    zoomControl: false, // 禁用 + - 按钮
                    doubleClickZoom: false, // 禁用双击放大
                    attributionControl: false // 移除右下角leaflet标识
                }
                // 系统地图服务是否为超图服务   全局配置获取
            if (MAPCONFIG.isSuperMap) {
                mOption.crs = L.CRS.EPSG4326
            }
            if (!this.map) {
                this.map = L.map(mapId, mOption)
            }
            if (!MAPCONFIG.isSuperMap) {
                this.bottomLayer = L.tileLayer(mapUrl || MAPCONFIG.mapUrl).addTo(
                    this.map
                )
            } else {
                this.bottomLayer = L.supermap
                    .tiledMapLayer(mapUrl || MAPCONFIG.mapUrl)
                    .addTo(this.map)
            }
            this.map?.pm?.setLang('zh')
            cb && cb()
        }
        // x销毁
    destroyMap() {
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
            return L.polygon(latlngs, {...options, bindObj }).addTo(this.map)
        }
        // 绘制网格名称图层
        renderLayerText(layer, name='', iconConfig={className: 'my-div-icon text', iconSize: 20}) {
            const myIcon = L.divIcon({
                html: name,
                ...iconConfig
            })
            try {
                const layerCenter = turf.pointOnFeature(layer.toGeoJSON().features[0].geometry)
                return L.marker(layerCenter.geometry.coordinates.reverse(), {icon: myIcon, zIndexOffset: -99999, interactive: false}).addTo(this.map)
            } catch (error) {
                console.log('renderLayerText error', error);
            }
        }
        setZoom(level) {
            this.map.setZoom(level)
          }
        // fitbounds
    fitBounds(bounds, paddingOption = { padding: [150, 150] }) {
            this.map.fitBounds(bounds, paddingOption)
        }
        // 飞到相应的图层
    flyToBounds(bounds) {
            this.map.flyToBounds(bounds, {duration:0.5})
        }
         // 注册地图事件
         registerMapEvent(eventType, fn) {
            this.map.on(eventType, fn)
        }
              // 清除地图事件
    removeMapEvent(eventType) {
        this.map.off(eventType)
    }

    
        // 注册layer事件
    registerLayerEvent(layer, eventType, fn) {
            layer.on(eventType, fn)
        }
        // 清除图层
    removeLayer(layer) {
            this.map.removeLayer(layer)
        }
        // 添加图层
    addLayer(layer) {
            this.map.addLayer(layer)
        }
        // 渲染标记--图片icon,传了customeOptions将不使用imgUrl
    renderMarker(latlng, imgUrl, bindObj = {}, customeOptions) {
        const options = customeOptions || {
            icon: L.icon({
                iconUrl: imgUrl || require('@/assets/marker-icon.png'),
                iconSize: [58, 55],
                iconAnchor: [20, 45]
            }),
            bindObj,
            riseOnHover: true,
            riseOffset: 250,
            zIndexOffset: 8
        }
        return L.marker(latlng, options).addTo(this.map)
    }

    // 创建 marker
    createMarker(latlng, imgUrl, bindObj = {}, customeOptions) {
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

    // 通过 wkt 串绘制 marker ("POINT(120.132070284 33.3562376161)")
    renderMarkerByWkt(Pointwkt) {
        let point = this.parsePointWktReverse(Pointwkt)
        let latlng = {
            lat: point[0],
            lng: point[1]
        }
        return this.renderMarker(
            latlng,
            '', {}, {
                draggable: true,
                icon: L.icon({
                    iconUrl: require('@/assets/marker-icon.png'),
                    iconSize: [20, 36],
                }),
                riseOnHover: true,
                riseOffset: 250,
                zIndexOffset: 8
            }

        )
    }

    // 动态点闪烁
    renderPulse(latlng, iconSize = [16, 16], color = 'red') {
        try {
            // console.log('L=', L);
            const pulseIcon = new L.Icon.Pulse({
                iconSize,
                color
            })
            return L.marker(latlng, { icon: pulseIcon, zIndexOffset: 999 }).addTo(
                this.map
            )
        } catch (error) {
            console.log('renderPulse--error', error);
        }
    }
        // 飞向某个点位
    flyToPoint(latlng, zoom = MAPCONFIG.maxZoom, opts = { duration: 1, animate: true }) {
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
    renderCircle(latlng, options = { radius: 200 }) {
            return L.circle(latlng, options).addTo(this.map)
        }
        // popup
    createPopUp(latlng, htmlContent, popOpts = { closeButton: false }) {
            return L.popup(popOpts)
                .setLatLng(latlng || undefined)
                .setContent(htmlContent || '')
                .openOn(this.map)
        }
        // 转换wkt数据并反转经纬度
    parsePointWktReverse(wktStr) {
        const geoJson = WKT.parse(wktStr)
        return geoJson.coordinates.reverse()
    }
    convertGeomatryToWkt(geoJson) {
            return WKT.convert(geoJson)
        }
        // 转换wkt为Geometry-geojson然后渲染
    renderGeoJsonByWkt(
            wktStr,
            properties = {},
            options = {
                style: {
                    color: '#000000',
                    fillColor: '#000000',
                    fillOpacity: 0.5
                }
            }
        ) {
            const geometry = WKT.parse(wktStr)
            return L.geoJSON({ type: 'Feature', properties, geometry }, options).addTo(
                this.map
            )
        }
        // latlng数组生成fitbounds
    createLatLngBounds(latlngs) {
        return L.latLngBounds(latlngs)
    }
    
  // 获取一个点并计算给定距离(以度、弧度、英里或公里为单位)的目标点的位置。本项目使用默认值km
  getDestinationLatlng(latlng, distance = 0.5, bearing = 90) {
    const point = latlng.slice().reverse()
    const rPoint = turf.destination(point, distance, bearing)
    return rPoint.geometry.coordinates.slice().reverse()
  }
  // 获取亮点距离
  getDistanceByPoints(point1, point2) {
    return turf.distance(point1, point2)
  }
  // 获取中心点
  getCenterWktPoint(wktStr,isLatlng) {
    if (!wktStr) return "";
    const geometry = WKT.parse(wktStr);
    const center = turf.centroid(geometry);
    if (center.geometry && center.geometry.type === "Point") {
      let coor = center.geometry.coordinates;
      return isLatlng ? coor.reverse() : `POINT (${coor[0]} ${coor[1]})`;
    }
    return "";
  }
    // wkt转换为geometry
    parseWkt(wktStr) {
        return WKT.parse(wktStr);
    }
    //自定义轨迹线---
    renderGridManMoveLine(latlngs,loop) {
        const routeLine = L.polyline(latlngs,{weight:8,color:'#07FFC3',opacity:0.4,dashArray: [1, 2]}).addTo(this.map)
        const routeLineDash = L.polyline(latlngs,{weight:1,color:'#07FFC3',opacity:1,dashArray: [3, 6]}).addTo(this.map)
        var lineDistance = turf.length(routeLine.toGeoJSON(), {units: 'meters'});
        const realRouteLine = L.polyline([],{weight:10,color:'#36A4FF',opacity:0.6,dashArray: [1, 2]}).addTo(this.map)
        const decorator = L.polylineDecorator(routeLine,{
            patterns: [{
              repeat: 60,
              symbol: L.Symbol.arrowHead({
                  pixelSize: 5,
                  headAngle: 75,
                  polygon: false,
                  pathOptions: {
                      stroke: true,
                      weight: 2,
                      color: '#36A4FF',
                      opacity:1
                  }
              })
           }]
        }).addTo(this.map)
        const carIcon = L.icon({
          iconSize: [78, 78],
          iconAnchor: [39, 38],
          iconUrl: require('@/assets/dayuan.png')
        })
        const speedList = []
        latlngs.forEach(()=>{
          // speedList.push(Math.round(Math.random()*(5-1)+1))
          speedList.push(1)
        })
        const animatedMarker = L.animatedMarker(routeLine.getLatLngs(), {
          animationTime: 10000,
          lineDistance,
          speedList: speedList,
          icon: carIcon,
          playCall: updateRealLine
        }).addTo(this.map)
        var newLatlngs = [routeLine.getLatLngs()[0]]
        // 绘制已行走轨迹线（橙色那条）
        function updateRealLine(latlng,isFinish) {
          newLatlngs.push(latlng)
          realRouteLine.setLatLngs(newLatlngs)
          //结束了轨迹播放
          if(isFinish && loop) {
            newLatlngs = [routeLine.getLatLngs()[0]]
            realRouteLine.setLatLngs([])
            animatedMarker.stop();
            setTimeout(()=>{
              animatedMarker.start();
            },1000)
          }
        }
        this.map.fitBounds(routeLine.getBounds(),{maxZoom:16,animate:false,padding:[100,1000]})
        animatedMarker.start();
        return [animatedMarker,realRouteLine,routeLine,decorator,routeLineDash]
    }
}