<template>
  <div class="event-base">
    <common-title :title="`会议纪要信息`" />
    <ul class="content">
      <li class="base-item two-column">
        <label class="label">组织单位</label>
        <div class="value">{{ tranformEventData.meetingSummaryOrgName || '-' }}</div>
      </li>
      <li class="base-item two-column">
        <label class="label">记录人</label>
        <div class="value">{{ tranformEventData.meetingSummaryUserName || '-' }}</div>
      </li>
      <li class="base-item two-column">
        <label class="label">纪要提交时间</label>
        <div class="value">{{ tranformEventData.meetingSummaryTime || '-' }}</div>
      </li>
      <!-- 单行 -->
      <li :class="['base-item', {'two-column': tranformEventData.meetingSummaryConclusion}]">
        <label class="label">会议结论</label>
        <div class="value">{{ tranformEventData.meetingSummaryConclusion || '-' }}</div>
      </li>
      <li class="base-item two-column">
        <label class="label">纪要附件</label>
        <div
          v-for="(item,index) in tranformEventData.fileList "
          :key="index"
        >
          <div class="value media-list">
            <div class="name">{{ item.meetingSummaryFileName }}</div>
            <div class="down">
              <a :href="item.meetingSummaryFileDownUrl" :download="item.meetingSummaryFileDownUrl">
                <i class="el-icon-download" />
              </a>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'EventBase',
  components: {
  },
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
  computed: {

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
      return event
    }
  },

  methods: {
    // 资源下载
    _down(item) {
      console.log('item===', item)
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
       .media-list {
        display: flex;
        text-decoration: underline;
        color: #1595ff;
       .down {
          margin-left: 10px;
          cursor: pointer;
        }
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

}
</style>
