<template>
  <div class="event-porcess">
    <common-title title="处置流程" />
    <div v-if="eventState" class="ep-list">
      <div v-for="(ep,index) in realEventProcess" :key="index" class="ep-box">
        <div v-if="index > 0" :class="`ep-line ep-line-${ep.isActive}`" />
        <div class="ep-info">
          <div :class="`ep-bg ep-bg-${ep.nodeType} ep-bg-${ep.nodeType}-${ep.isActive}`" />
          <div :class="`ep-name ep-name-${ep.nodeType} ep-name-${ep.isActive}`">{{ ep.nodeName }}</div>
        </div>
      </div>
    </div>
    <div v-if="eventState === 0" class="event-wait-submit">请先提交上报该事件！</div>
  </div>
</template>

<script>
export default {
  name: 'EventcenterWebEventPorcess',
  props: {
    eventInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      eventProcess: [
        {
          nodeType: 'report',
          isActive: false,
          nodeName: '上报'
        },
        {
          nodeType: 'verify',
          isActive: false,
          nodeName: '审核'
        },
        {
          nodeType: 'dispatch',
          isActive: false,
          nodeName: '调度'
        },
        {
          nodeType: 'handle',
          isActive: false,
          nodeName: '处理'
        },
        {
          nodeType: 'settle',
          isActive: false,
          nodeName: '结案'
        }
      ]
    }
  },

  computed: {
    eventState() {
      let eventState = this.eventInfo.eventState
      // 0待提交 1待审核 2待调度 3待处理 4待结案 5已办结 6已作废
      if (eventState) eventState = parseInt(eventState)
      return eventState
    },
    realEventProcess() {
      if (this.eventState === 0) {
        return [] // 待提交--不展示
      } else if (this.eventState === 6) { // 作废--只又上报和作废两个节点
        return [
          {
            nodeType: 'report',
            isActive: true,
            nodeName: '上报'
          },
          {
            nodeType: 'cancle',
            isActive: false,
            nodeName: '作废'
          }
        ]
      } else {
        const state = this.eventState === 8 ? 4 : this.eventState// 待审批当成处理节点
        this.eventProcess.forEach((item, index) => {
          item.isActive = index < state
        })
        return this.eventProcess
      }
    }
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
.event-porcess{
  margin-top: 20px;
  padding: 0 20px;
  background: #ffffff;
  .ep-list {
    display: flex;
    margin-top: 20px;
    .ep-box{
      display: flex;
      align-items: center;
      .ep-info {
        .ep-bg {
          width: 36px;
          height: 36px;
          background-repeat: no-repeat;
          background-size: 100% 100%;
          &-report{
            background-image: url("~@/assets/eventInfo/eventProcess/上报a.png");
          }
          &-report-true{
            background-image: url("~@/assets/eventInfo/eventProcess/上报a.png");
          }
          &-verify{
            background-image: url("~@/assets/eventInfo/eventProcess/审核.png");
          }
          &-verify-true{
            background-image: url("~@/assets/eventInfo/eventProcess/审核a.png");
          }
          &-dispatch{
            background-image: url("~@/assets/eventInfo/eventProcess/调度.png");
          }
          &-dispatch-true{
            background-image: url("~@/assets/eventInfo/eventProcess/调度a.png");
          }
          &-handle{
            background-image: url("~@/assets/eventInfo/eventProcess/处理.png");
          }
          &-handle-true{
            background-image: url("~@/assets/eventInfo/eventProcess/处理a.png");
          }
          &-settle{
            background-image: url("~@/assets/eventInfo/eventProcess/结案.png");
          }
          &-settle-true{
            background-image: url("~@/assets/eventInfo/eventProcess/结案a.png");
          }
          &-cancle{
            background-image: url("~@/assets/eventInfo/eventProcess/作废.png");
          }
          &-cancle-true{
            background-image: url("~@/assets/eventInfo/eventProcess/作废.png");
          }
        }
        .ep-name {
          text-align: center;
          margin-top: 4px;
          &-true{
            color: #36a4ff;
          }
          &-cancle {
            color: #FF4D4F;
            &.ep-name-true{
              color: #FF4D4F;
            }
          }
        }
      }
      .ep-line {
        margin-top: -18px;
        width: 100px;
        height: 1px;
        border: 1px dashed #E7E7E7;
        &-true{
          border: 1px dashed #36a4ff;
        }
      }
    }
  }
  .event-wait-submit {
    margin-top: 20px;
    color: #8a8a8a;
  }
}
</style>
