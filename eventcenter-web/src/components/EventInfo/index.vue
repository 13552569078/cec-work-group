<!--
 * @description 全局事件详情 -- 布局改造
 * @date 2022-02-28
 * @author lism
-->
<template>
  <div class="event-infomation fs14">
    <div class="top">
      <div class="top-left">
        <!-- 联席会议信息 -->
        <meeting-infos v-if="eventInfo.hasStartMeeting === 1" :infos-list="meetingList" />
        <meeting-summary v-if="eventInfo.meetingStatus === 1" :event-info="eventInfo" />
        <!-- 事件详情 -->
        <event-base :event-info="eventInfo" :media="media" />
      </div>
      <div class="top-right">
        <!-- 事件流程 -->
        <self-porcess v-if="eventType==='self'" :event-info="eventInfo" />
        <event-porcess v-else :event-info="eventInfo" />
        <process-time-self-line v-if="eventType==='self'" :process-list="process" :event-info="eventInfo" />
        <process-time-line v-else :process-list="process" :event-info="eventInfo" />
      </div>
    </div>
    <div class="bottom">
      <!-- 各种操作流程按钮、经办没有操作按钮，事件查询只有取消认领按钮查询，其他经办事件走 getToDoButtons 权限 -->
      <event-buttons
        :event-id="eventId"
        :task-id="taskId"
        :event-info="eventInfo"
        class="event-buttons"
        :class="sidebarStatus ? 'open' : 'close'"
        @print="printDetail"
      />
    </div>
  </div>
</template>

<script>
import eventBase from './eventBase'
import processTimeLine from './processTimeLine'
import processTimeSelfLine from './processTimeSelfLine'
import selfPorcess from './self-porcess.vue'
import eventPorcess from './event-porcess.vue'
import eventButtons from './eventButtons'
import meetingSummary from './meetingSummary.vue'
import meetingInfos from './meetingInfos.vue'
import Print from '@/utils/print'
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
export default {
  name: 'EventInfomation',
  components: {
    eventBase,
    processTimeLine,
    eventButtons,
    meetingSummary,
    meetingInfos,
    selfPorcess,
    processTimeSelfLine,
    eventPorcess
  },
  data() {
    return {
      process: [], // 事件节点
      processFromInterface: [], // 该事件总的流程节点
      eventInfo: {}, // 事件基本信息
      media: [], // 多媒体数据
      actions: [],
      meetingList: [] // 联席会议信息列表
    }
  },
  computed: {
    eventId() {
      return this.$route.query.id
    },
    eventType() {
      return this.$route.query?.eventType || 'list' // self 为自处置详情
    },
    taskId() {
      // 从事件详情中获取
      // return this.eventInfo.taskId
      return this.$route.query.taskId
    },
    sidebarStatus() {
      return this.$store.getters?.sidebar?.opened
    }
  },

  async created() {
    if (this.eventType === 'self') {
      // 自处置详情 单独走详情
      await this.getSelfEventDetail()
      return
    }
    if (this.$route.query.type === '城管历史事件查询') {
      await this.gettcEventHisDetail()
    } else {
      await this.getEventDetail()
    }
  },

  methods: {
    // 事件详情接口
    getEventDetail() {
      moduleSrv.getEventDetail(this.eventId, this.taskId).then((res) => {
        if (res.code === SUCCESS_CODE) {
          const { process = [], media = [], meetingList = [], event = {}, flows = [] } = res.data
          this.process = process.map((item, index) => {
            // 默认折叠
            if (index === 0) {
              item.collapse = false
            } else {
              item.collapse = true
            }
            return item
          })
          this.processFromInterface = flows
          this.eventInfo = event
          this.meetingList = meetingList
          this.media = media
        } else {
          console.warn('getEventDetail ----error')
        }
      })
    },
    // 事件详情接口 自处置
    async getSelfEventDetail() {
      const { data } = await moduleSrv.getSelfDetail(this.eventId)
      this.eventInfo = {
        id: data.uuid,
        dealStatus: data.dealStatus,
        eventCode: data.uuid,
        title: data.eventTitle,
        eventStateText: data.dealStatusName,
        overTimeFlagName: data.overTimeFlagName,
        urgentText: '一般',
        limitTimeDesc: '--',
        sourceText: data.platformSrcName,
        reporterName: data.reporterName,
        reporterMobile: data.reporterMobile,
        eventTypeText: `${data.eventTypeMaxName}/${data.eventTypeMiddleName}/${data.eventTypeName}`,
        createTime: data.createTime,
        happenTime: data.createTime,
        eventDesc: data.eventDesc,
        eventAddress: data.eventAddress,
        coordx: data.coordx,
        coordy: data.coordy,
        ...data
      }
      this.media = data.baseMediaList
      this.process = [
        {
          showMore: false,
          activityName: '上报',
          startTime: data.createTime,
          comment: '自处置上报',
          media: data.baseMediaList,
          action: '上报',
          userName: data.platformSrcName
        }
      ]
      if (data.dealStatus !== '0') {
        // 0待处置 1完结 2作废
        this.process.unshift({
          showMore: true,
          activityName: data.dealStatus === '1' ? '办结' : '作废',
          startTime: data.dealTime,
          comment: data.dealComment,
          action: data.dealStatus === '1' ? '办结' : '作废',
          userName: data.platformSrcName,
          dealUserName: data.dealUserName,
          dealUserPhone: data.dealUserPhone,
          media: data.processMediaList,
          overTimeFlagName: data.overTimeFlagName,
          responsibleDepartment: data.responsibleDepartment
        })
      }
    },
    // 事件详情接口  城管历史事件查询
    gettcEventHisDetail() {
      moduleSrv.gettcEventHisDetail(this.eventId, this.taskId).then((res) => {
        if (res.code === SUCCESS_CODE) {
          const { process = [], media = [], event = {}, flows = [] } = res.data
          this.process = process.map((item, index) => {
            // 默认折叠
            if (index === 0) {
              item.collapse = false
            } else {
              item.collapse = true
            }
            return item
          })
          this.processFromInterface = flows
          this.eventInfo = event
          this.media = media
        } else {
          console.warn('getEventDetail ----error')
        }
      })
    },
    // 打印
    printDetail() {
      this.$nextTick(() => {
        const eventInfoHtml = document.getElementsByClassName('event-base')[0]
        Print(eventInfoHtml)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
    position: relative;
  }
}
</style>
