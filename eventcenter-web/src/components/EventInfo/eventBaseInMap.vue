<!--
 * @description 全局事件详情--事件详情
 * @date 2020-08-23
 * @author lism
-->
<template>
  <div class="event-base-map">
    <!-- <common-title :title="`事件详情-${tranformEventData.eventCode}`" /> -->
    <ul class="content">
      <li class="base-item two-column top-item">
        <label class="label">事件编码</label>
        <div class="value">{{ tranformEventData.eventCode || "-" }}</div>
      </li>
      <li class="base-item two-column top-item">
        <label class="label">发生时间</label>
        <div class="value">{{ tranformEventData.happenTime || "-" }}</div>
      </li>
      <li :class="['base-item', { 'two-column': tranformEventData.whistleLevel }]">
        <label class="label">事件标题</label>
        <div
          class="value hover-value"
          @click="changeSearchType(tranformEventData.title, '事件标题')"
        >{{ tranformEventData.title || "-" }}</div>
      </li>
      <li :class="['base-item', { 'two-column': tranformEventData.whistleLevel }]">
        <label class="label">事件类型</label>
        <div class="value">
          <span
            v-for="(item, index) in tranformEventData.eventTypeTextList"
            :key="item+index"
            @click="changeSearchType(item, '事件类型')"
            v-html="`${item && index > 0 ? '/' : ''}<span class=&quot;hover-value&quot;>${item}</span>`"
          /></div>
      </li>
      <!-- <li class="base-item two-column">
        <label class="label">事件状态</label>
        <div class="value">{{ tranformEventData.eventStateText || "-" }}</div>
      </li> -->
      <li class="base-item two-column">
        <label class="label">超时状态</label>
        <!-- 自处置详情于其他详情区分 -->
        <div
          v-if="eventType === 'self'"
          class="value"
        >
          {{ tranformEventData.overTimeFlagName || "-" }}
        </div>
        <div
          v-else
          :style="getTaskLeftStyle(tranformEventData.taskLeftTime)"
          class="value"
        >
          {{ tranformEventData.taskLeftTime || "-" }}
        </div>
      </li>
      <li class="base-item two-column">
        <label class="label">紧急程度</label>
        <div class="value">{{ tranformEventData.urgentText || "-" }}</div>
      </li>
      <!-- <li class="base-item two-column">
        <label class="label">事件标题</label>
        <div class="value">{{ tranformEventData.title || '-' }}</div>
      </li> -->
      <li class="base-item two-column">
        <label class="label">处置时限</label>
        <div class="value">{{ tranformEventData.limitTimeDesc || "-" }}</div>
      </li>
      <!-- 上报人、申请人 -->
      <li class="base-item two-column">
        <label class="label">上报人</label>
        <div
          class="value hover-value"
          @click="changeSearchType(tranformEventData.reporterName, '上报人')"
        >{{ tranformEventData.reporterName || "-" }}</div>
      </li>
      <!-- 上报人、申请人联系方式 -->
      <li :class="['base-item', { 'two-column': tranformEventData.whistleLevel }]">
        <label class="label">联系方式</label>
        <div class="value">{{ tranformEventData.reporterMobile || "-" }}</div>
      </li>
      <li class="base-item two-column">
        <label class="label">事件来源</label>
        <div class="value">{{ tranformEventData.sourceText || "-" }}</div>
      </li>
      <li
        v-if="tranformEventData.orgTypeName"
        class="base-item two-column"
      >
        <label class="label">处置级别</label>
        <div class="value">{{ tranformEventData.orgTypeName || "-" }}</div>
      </li>

      <!-- 新增关联对象 -->
      <li
        v-if="tranformEventData.relCateName"
        class="base-item two-column"
      >
        <label class="label">关联对象 </label>
        <div class="value">{{ tranformEventData.relCateName || "-" }}</div>
      </li>
      <li
        v-if="tranformEventData.relObjName"
        class="base-item two-column"
      >
        <label class="label">对象名称 </label>
        <div class="value">{{ tranformEventData.relObjName || "-" }}</div>
      </li>
      <!-- 单行 -->
      <li :class="['base-item', { 'two-column': tranformEventData.whistleLevel }]">
        <label class="label">事件描述</label>
        <div
          class="value hover-value"
          @click="changeSearchType(tranformEventData.eventDesc, '事件描述')"
        >{{ tranformEventData.eventDesc || "-" }}</div>
      </li>
      <!-- 如果有吹哨级别，则显示 -->
      <li
        v-if="tranformEventData.whistleLevel"
        class="base-item two-column"
      >
        <label class="label">吹哨级别</label>
        <div class="value">{{ tranformEventData.whistleLevel || "-" }}</div>
      </li>
      <li class="base-item location-map">
        <label class="label">发生地址</label>
        <div
          class="value"
        >
          <span>{{
            `${tranformEventData.originalDeptName || ""}`
          }}</span>&nbsp;
          <span class="hover-value" @click="changeSearchType(tranformEventData.eventAddress, '详细地址')">{{
            `${tranformEventData.eventAddress || ""}`
          }}</span>
        </div></li>
      <!-- 按要求地图长显 -->
      <li
        v-show="showMap"
        :class="['l-map']"
      >
        <div id="address-map">
          <!-- 自定义工具栏 -->
          <!-- <MapControl @zoomIn="_zoomIn" @zoomOut="_zoomOut" @reset="_reset" /> -->
        </div>
      </li>
    </ul>
    <event-media
      :event-media="media"
      :show-map-title="true"
    />
    <el-button
      v-if="['2', '3', '4'].includes(eventInfo.evaluateFlag)"
      type="primary"
      style="width: 100px; margin-top: 24px"
      @click="showEvaluation"
    >查看评价</el-button>
    <cmDialog
      v-if="dialogVisible"
      :dialog-visible="dialogVisible"
      :dig-type="digType"
      :dig-data="digData"
    />
  </div>
</template>

<script>
import eventMedia from './eventMedia'
import cmDialog from '@/views/event/appraise/cmDialog.vue'
import moduleSrv from '@/api/dispatchWhh'
import { KEYWORD_TYPE_OPTIONS } from '@/constants'

export default {
  name: 'EventBase',
  components: {
    eventMedia,
    cmDialog
  },
  props: {
    eventInfo: {
      type: Object,
      default: () => { }
    },
    media: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      eventMarker: null,
      showMap: false, // 地图显示开关
      dialogVisible: false,
      digType: '',
      digData: {},
      KEYWORD_TYPE_OPTIONS
    }
  },
  computed: {
    eventType() {
      return this.$route.query?.eventType || 'list' // self 为自处置详情
    },
    // 地图占位背景，没有事件坐标
    noCoord() {
      const { coordx, coordy } = this.tranformEventData
      return !coordx || !coordy
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
      if (this.eventType === 'self') return this.eventInfo
      const event = this.eventInfo
      event.sourceText = this.eventSourceOptions.get(event.eventSrcId)
      event.urgentText = this.eventUrgentOptions.get(event.eventUrgent)
      event.eventStateText = this.eventStateOptions.get(event.eventState)
      event.overtimeText = this.eventOverTimeOptions.get(event.overtimeFlag)
      event.platText = this.eventPlatformOptions.get(event.platformSrc)
      // 把事件大、中、小类组合
      event.eventTypeText = `${event.eventTypeLName || '-'}/${event.eventTypeMNAME || '-'
      }/${event.eventTypeName || '-'}/${event.eventTypeIdFourName || ''}/${event.eventTypeIdFiveName || ''
      }`
      event.eventTypeText = event.eventTypeText.replace(/\/\//, '')
      // 事件类型抽取为数组，可单独搜索某级事件类型
      event.eventTypeTextList = [`${event.eventTypeLName || '-'}`, `${event.eventTypeMNAME || '-'
      }`, `${event.eventTypeName || '-'}`, `${event.eventTypeIdFourName || ''}`, `${event.eventTypeIdFiveName || ''
      }`]
      return event
    }
  },
  watch: {
    eventInfo: {
      immediate: true,
      handler(val) {
        if (val && val.id) {
          if (!this.twoD_map) {
            // this.initTwoDMap('address-map')
            // this.renderMarker()
          }
        }
      }
    }
  },

  methods: {
    changeSearchType(keyWord, typeName) {
      const params = {
        keyWord: keyWord,
        searchType: this.KEYWORD_TYPE_OPTIONS.find(item => item.dictDesc === typeName).dictValue
      }
      this.$emit('changeSearchType', params)
    },
    async showEvaluation() {
      this.digType = 'view'
      const params = {
        eventId: this.eventInfo.id
      }
      const res = await moduleSrv.getEvaluateResultByEventCode(params)
      if (res.code === 0) {
        this.digData = Object.assign(
          { eventInfo: this.eventInfo },
          { evaluateList: res.data }
        )
        this.dialogVisible = true
      }
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
    },
    // 超时样式
    getTaskLeftStyle(time) {
      if (!time) return {}
      let color = '#36a4ff'
      let bgColor = 'rgba(54,164,255,0.1)'
      if (time.indexOf('超时') > -1) {
        color = '#FF4D4F'
        bgColor = 'rgba(255,77,79,0.1)'
      } else if (time.indexOf('剩余') > -1) {
        color = '#4CC09E'
        bgColor = 'rgba(76,192,158,0.1)'
      }
      return {
        background: bgColor,
        borderRadius: '2px',
        border: `1px solid ${color}`,
        fontSize: '12px',
        color,
        padding: '0 4px',
        lineHeight: '18px',
        width: 'fit-content'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.event-base-map {
  padding: 20px;
  color: #4b4b4b;
  // height: 100%;
  .content {
    display: flex;
    flex-wrap: wrap;
    .base-item {
      width: 100%;
      margin-top: 20px;
      &.two-column {
        width: 50%;
      }
      .label {
        text-align: left;
        display: inline-block;
        margin-bottom: 10px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #8a8a8a;
      }
      .value {
        padding-right: 20px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #4b4b4b;
      }
      ::v-deep {
        .hover-value {
          cursor: pointer;
          &:hover {
            color: #36a4ff;
          }
        }
      }

      &.location-map {
        .value {
          .el-icon-map-location {
            font-size: 18px;
            color: #36a4ff;
            width: 80px;
            margin-left: auto;
            cursor: pointer;
          }
        }
      }
    }
    .top-item {
      margin-top: 0;
    }
  }

  .l-map {
    margin-top: 20px;
    height: 260px;
    width: 100%;
    #address-map {
      height: 100%;
    }
  }
  .not-address {
    height: 197px;
    width: 291px;
    background-image: url("~@/assets/404_images/noAddress.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}
</style>
