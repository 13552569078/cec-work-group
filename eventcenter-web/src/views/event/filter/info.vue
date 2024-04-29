<!--
 * @description 全局事件详情
 * @date 2020-08-21
 * @author lism
-->
<template>
  <div class="event-infomation fs14">
    <div class="top">
      <div class="top-left">
        <!-- 事件详情 -->
        <event-base :event-info="eventInfo" :media="media" />
        <!-- 相似事件 -->
        <similar-event :similar-info="similarEvent" />
      </div>
      <div class="top-right">
        <!-- 事件流程 -->
        <process-time-line :process-list="process" />
      </div>
    </div>
    <div class="bottom">
      <el-button type="primary" @click="cancellation">作废</el-button>
      <el-button @click="goback">返回</el-button>
    </div>
    <!-- 确认框 -->
    <confirm-dialog :dialog-visible.sync="showConfirmDialog" :form-body="formBody" :similar-obj="similarEvent" />
  </div>
</template>
<script>
import eventBase from '@/components/EventInfo/eventBase'
import processTimeLine from '@/components/EventInfo/processTimeLine'
import similarEvent from './components/similarEvent'
import confirmDialog from './components/confirmDialog.vue'
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
export default {
  name: 'EventInfomation',
  components: {
    eventBase,
    processTimeLine,
    similarEvent,
    confirmDialog
  },
  data() {
    return {
      process: [], // 事件节点
      processFromInterface: [], // 该事件总的流程节点
      eventInfo: {}, // 事件基本信息
      similarEvent: {}, // 重复事件对象
      media: [], // 多媒体数据
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
      moduleSrv.getfilterEventDetail(this.eventId).then((res) => {
        if (res.code === SUCCESS_CODE) {
          const { process = [], media = [], event = {}, flows = [], similarEvent = {}} = res.data
          this.process = process
          this.processFromInterface = flows
          this.eventInfo = event
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
        path: '/event/filter'
      })
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
      background: #F7F9FC;
    }
  }
  .bottom {
    height: 64px;
    line-height: 64px;
    padding-left: 20px;
    background: #FFFFFF;
    box-shadow: 0px -2px 7px 0px rgba(0, 0, 0, 0.06);
  }
}
</style>
