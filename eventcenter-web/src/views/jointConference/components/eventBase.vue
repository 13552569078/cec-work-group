<template>
  <div class="event-base">
    <common-title :title="`事件详情`" />
    <ul class="content">
      <li class="base-item two-column">
        <label class="label">事件状态</label>
        <div class="value">{{ tranformEventData.eventStateText || '-' }}</div>
      </li>
      <li class="base-item two-column">
        <label class="label">超时状态</label>
        <div class="value">{{ tranformEventData.overtimeText || '-' }}</div>
      </li>
      <li class="base-item two-column">
        <label class="label">平台来源</label>
        <div class="value">{{ tranformEventData.overtimeText || '-' }}</div>
      </li>
      <li class="base-item two-column">
        <label class="label">事件来源</label>
        <div class="value">{{ tranformEventData.overtimeText || '-' }}</div>
      </li>
      <li class="base-item two-column">
        <label class="label">紧急程度</label>
        <div class="value">{{ tranformEventData.urgentText || '-' }}</div>
      </li>
      <li class="base-item two-column">
        <label class="label">事件类型</label>
        <div class="value">{{ tranformEventData.eventTypeText || '-' }}</div>
      </li>
      <li class="base-item two-column">
        <label class="label">上报人</label>
        <div class="value">{{ tranformEventData.reporterName || '-' }}</div>
      </li>
      <li class="base-item two-column">
        <label class="label">联系方式</label>
        <div class="value">{{ tranformEventData.reporterName || '-' }}</div>
      </li>
      <li class="base-item two-column">
        <label class="label">上报时间</label>
        <div class="value">{{ tranformEventData.happenTime || '-' }}</div>
      </li>
      <li class="base-item location-map">
        <label class="label">发生地址</label>
        <div class="value">
          <span>{{ `${tranformEventData.deptName || ''}${tranformEventData.eventAddress || ''}` || '-' }}</span>
          <span class="icon" @click.stop="troggleMap">查看地图</span>
        </div>
      </li>
      <li
        v-show="showMap"
        :class="['l-map', {'not-address': noCoord}]"
      >
        <div v-show="!noCoord" id="address-map" />
        <!-- 自定义工具栏 -->
        <MapControl @zoomIn="_zoomIn" @zoomOut="_zoomOut" @reset="_reset" />
      </li>
      <!-- <li class="base-item two-column">
        <label class="label">发生地址</label>
        <div class="value">{{ tranformEventData.eventAddress || '-' }}</div>
      </li> -->
      <!-- 单行 -->
      <li :class="['base-item', {'two-column': tranformEventData.whistleLevel}]">
        <label class="label">事件描述</label>
        <div class="value">{{ tranformEventData.eventDesc || '-' }}</div>
      </li>
    </ul>
    <event-media :event-media="media" />
  </div>
</template>

<script>
import eventMedia from '@/components/EventInfo/eventMedia.vue'
import leafletMapMixin from '@/mixin/leafletMapMixin'

export default {
  name: 'EventBase',
  components: {
    eventMedia
  },
  mixins: [leafletMapMixin],
  props: {
    eventInfo: {
      type: Object,
      default: () => {}
    },
    media: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      viewMap: false,
      mapInstance: null, // 地图实例
      bottomLayer: null, // 底图图层
      eventMarker: null,
      showMap: false // 地图显示开关
    }
  },
  computed: {
    // 地图占位背景，没有事件坐标
    noCoord() {
      const { coordx, coordy } = this.tranformEventData
      return !coordx || !coordy
    },
    reportName() {
      if (this.$route.path.indexOf('event/approval') > -1) {
        return '申请人'
      } else {
        return '上报人'
      }
    },
    reportMobileName() {
      if (this.$route.path.indexOf('event/approval') > -1) {
        return '申请人联系方式'
      } else {
        return '联系方式'
      }
    },
    // 把字典转换为字典方式存储，方便获取对应中文
    eventPlatformOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_platform')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventSourceOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_origin')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventUrgentOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_urgent_level')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventStateOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_state')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventOverTimeOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('overtime_flag')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    tranformEventData() {
      const event = this.eventInfo
      event.sourceText = this.eventSourceOptions.get(event.eventSrcId)
      event.urgentText = this.eventUrgentOptions.get(event.eventUrgent)
      event.eventStateText = this.eventStateOptions.get(event.eventState)
      event.overtimeText = this.eventOverTimeOptions.get(event.overtimeFlag)
      event.platText = this.eventPlatformOptions.get(event.platformSrc)
      // 把事件大、中、小类组合
      event.eventTypeText = `${event.eventTypeLName || '-'}/${
        event.eventTypeMNAME || '-'
      }/${event.eventTypeName || '-'}`
      if (event.eventTypeIdFourName) {
        event.eventTypeText += `/${event.eventTypeIdFourName}`
      }
      if (event.eventTypeIdFiveName) {
        event.eventTypeText += `/${event.eventTypeIdFiveName}`
      }
      return event
    }
  },
  watch: {
    showMap(val) {
      if (val) {
        // 显示地图
        this.$nextTick(() => {
          // 只有有坐标点的时候才进行渲染地图
          if (!this.twoD_map) {
            this.initTwoDMap('address-map')
            this.renderMarker()
          }
        })
      }
    }
  },

  methods: {
    troggleMap() {
      this.showMap = !this.showMap
    },
    // 图标闪烁
    renderMarker() {
      if (this.eventMarker) {
        this.twoD_map.removeLayer(this.eventMarker)
        this.eventMarker = null
      }
      // parsePointWktReverse
      const { coordx, coordy, gcj02, wgs84 } = this.tranformEventData
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
      const latlng = this.twoD_map.parsePointWktReverse(point)
      // 如果有坐标，则进行撒点
      if (latlng) {
        // 纬度在前、经度在后，是因为 leaflet 的 api 决定的
        this.eventMarker = this.twoD_map?.renderMarker(latlng)
        this.twoD_map.flyToPoint(latlng)
      } else {
        console.warn('没有提供坐标系:', this.tranformEventData)
      }
      console.info('event-info==', this.tranformEventData)
    }
  }
}
</script>

<style lang="scss" scoped>
.event-base {
  padding: 20px;
  color: #4b4b4b;
  // height: 100%;
  background-color: #fff;
  .content {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    .base-item {
      width: 100%;
      margin-top: 20px;
      &.two-column {
        width: 50%;
      }
      .label {
        text-align: left;
        display: inline-block;
        color: #8a8a8a;
        margin-bottom: 8px;
      }
      .value {
        padding-right: 20px;
      }
      &.location-map {
        .value {
          display: flex;
          .icon {
            width: 140px;
            align-self: flex-start;
          }
        }
        .icon {
          cursor: pointer;
          background-image: url(~@/assets/查看地址.png);
          background-repeat: no-repeat;
          background-position: bottom right;
          color: #36A4FF;
          padding-right: 20px;
          padding-left: 20px;
        }
      }
    }
  }

  .l-map {
    margin-top: 20px;
    height: 260px;
    width: 100%;
    position: relative;
    #address-map {
      height: 100%;
    }
  }
  .not-address {
    height: 197px;
    width: 291px;
    background-image: url('~@/assets/404_images/noAddress.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

}
</style>
