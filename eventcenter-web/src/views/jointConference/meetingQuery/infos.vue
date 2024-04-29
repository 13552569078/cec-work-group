<template>
  <div class="event-infomation fs14">
    <div class="top">
      <div class="top-left">
        <div class="status-cla">
          <span :class="`${_tranfromState(eventInfo)}-wrapper`">
            <svg-icon :icon-class="_tranfromState(eventInfo)" />
            {{ eventInfo.meetingStatus === 1 ? '已完结' : '待完结 ' }}
          </span>
        </div>
        <!-- 联席会议信息 -->
        <meeting-infos :infos-list="meetingList" />
        <meeting-summary v-if="eventInfo.meetingStatus === 1" :event-info="eventInfo" />
        <!-- 事件详情 -->
        <event-base :event-info="eventInfo" :media="media" />
      </div>
      <div class="top-right">
        <!-- 事件流程 -->
        <process-time-line :process-list="process" />
      </div>
    </div>
    <div class="bottom">
      <el-button @click="goback">返回</el-button>
    </div>
  </div>
</template>
<script>
import eventBase from '../components/eventBase.vue'
import processTimeLine from '@/components/EventInfo/processTimeLine'
import meetingInfos from '../components/meetingInfos.vue'
import meetingSummary from '../components/meetingSummary.vue'
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
export default {
  name: 'EventInfomation',
  components: {
    eventBase,
    processTimeLine,
    meetingInfos,
    meetingSummary
  },
  data() {
    return {
      process: [], // 事件节点
      processFromInterface: [], // 该事件总的流程节点
      eventInfo: {}, // 事件基本信息
      similarEvent: {}, // 重复事件对象
      media: [], // 多媒体数据
      meetingList: [], // 联席会议信息列表
      actions: [],
      showConfirmDialog: false,
      formBody: {}
    }
  },
  computed: {
    eventId() {
      return this.$route.query.id
    },
    sidebarStatus() {
      return !this.$store.getters?.sidebar?.opened
    }
  },

  async created() {
    await this.getEventDetail()
  },

  methods: {
    // 事件详情接口
    getEventDetail() {
      moduleSrv.getTcEventt({
        id: this.eventId
      }).then((res) => {
        if (res.code === SUCCESS_CODE) {
          const { process = [], media = [], meetingList = [], event = {}, flows = [], similarEvent = {}} = res.data
          this.process = process
          this.processFromInterface = flows
          this.eventInfo = event
          this.meetingList = meetingList
          this.similarEvent = similarEvent
          this.media = media
          this.formBody.eventCode = event.eventCode || ''
        } else {
          console.warn('getEventDetail ----error')
        }
      })
    },

    // 返回
    goback() {
      this.$router.push({
        path: '/joint-conference/meeting-query'
      })
    },
    // 批量事件状态，给予不同的状态不同的标记
    _tranfromState(row) {
      const state = row.meetingStatus || 0
      if ([0].includes(state)) {
        // 待XXX
        return 'svg-warn'
      } else if ([1].includes(state)) {
        // 办结
        return 'svg-success'
      }
    },
    // 作废
    cancellation() {
      this.formBody = {
        ...this.formBody,
        eventIds: [this.eventId],
        comment: ''
      }
      this.showConfirmDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
.event-infomation {
  height: 100%;
  position: relative;
  .top {
    height: calc(100% - 64px);
    display: flex;
    &-left {
      margin-right: 20px;
      background-color: #fff;
    }
    &-left, &-right {
      flex: 1;
      overflow-y: auto;
    }
    &-right {
      background: #FFFFFF;
    }
  }
  .bottom {
    height: 64px;
    line-height: 64px;
    padding-left: 20px;
    background: #FFFFFF;
    box-shadow: 0px -2px 7px 0px rgba(0, 0, 0, 0.06);
  }
  @extend %event_content_flex;
    .svg-success-wrapper {
      color: $success;
    }
    .svg-handle-wrapper {
      color: $primaryColor;
    }
    .svg-warn-wrapper {
      color: $warn;
    }
    .svg-error-wrapper {
      color: $error;
    }
    .svg-grey-wrapper {
      color: $defaultGrey;
    }
    .status-cla{
      position: relative;
    float: right;
    top: 21px;
    right: 20px;
    }
}
</style>
