<!--
 * @description 任务中心-待办任务
 * @date 2020-09-08
 * @author lism
-->
<template>
  <div class="map-event-detail">
    <div class="map-event-title">
      <img
        src="@/assets/oneQuery/event_detail_title.png"
        alt=""
        @click="backToList"
      >
      <span>事件详情</span>
      <div
        v-if="eventInfo.eventStateName"
        :class="`state-wrapper ${_tranfromState(eventInfo)}-wrapper`"
      >
        <svg-icon :icon-class="_tranfromState(eventInfo)" />
        {{ eventInfo.eventStateName }}
      </div>
    </div>
    <div class="base-info">
      <event-base-in-map
        :event-info="eventInfo"
        :media="media"
        @changeSearchType="changeSearchType"
      />
    </div>
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatch'
import eventBaseInMap from '@/components/EventInfo/eventBaseInMap.vue'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'EvtDtl',
  components: {
    eventBaseInMap
  },
  props: {
    clickEventId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      process: [],
      processFromInterface: [],
      eventInfo: {},
      media: []
    }
  },
  watch: {
    clickEventId: {
      deep: true,
      handler(nval) {
        if (!nval) return
        this.getEventDetail(nval)
      }
    }
  },
  methods: {
    changeSearchType(params) {
      this.$emit('changeSearchType', params)
    },
    // 批量事件状态，给予不同的状态不同的标记
    _tranfromState(row) {
      const state = row.eventState || '0'
      if (['0', '1', '2', '4'].includes(state)) {
        // 待XXX
        return 'svg-warn'
      } else if (['3'].includes(state)) {
        // 待处理，为处理中的颜色
        return 'svg-handle'
      } else if (['5'].includes(state)) {
        // 办结
        return 'svg-success'
      } else if (['7'].includes(state)) {
        // 驳回
        return 'svg-error'
      } else if (['6'].includes(state)) {
        // 作废
        return 'svg-grey'
      } else {
        return 'svg-grey'
      }
    },
    // 事件详情接口
    getEventDetail(clickEventId) {
      moduleSrv.getEventDetail(clickEventId).then((res) => {
        if (res.code === SUCCESS_CODE) {
          const { process = [], media = [], event = {}, flows = [] } = res.data
          this.process = process
          this.processFromInterface = flows
          this.eventInfo = event
          this.media = media
        } else {
          console.warn('getEventDetail ----error')
        }
      })
    },
    backToList() {
      this.$emit('backToList')
    }
  }
}
</script>
<style lang="scss" scoped>
.map-event-detail {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 468px;
  height: calc(100% - 40px);
  z-index: 420;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0px 3px 10px 0px rgba(121, 126, 137, 0.3);
  border-radius: 4px;
  .map-event-title {
    padding-left: 20px;
    height: 60px;
    border-bottom: 1px solid #dddddd;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    color: #4b4b4b;
    > img {
      width: 16px;
      height: 16px;
      margin-right: 8px;
      cursor: pointer;
    }
    > span {
      margin-right: 8px;
    }
    .state-wrapper {
      width: 70px;
      height: 24px;
      border-radius: 2px;
      font-size: 14px;
      padding-left: 5px;
      display: flex;
      align-items: center;
      svg {
        margin-right: 3px;
      }
    }
    .svg-success-wrapper {
      color: $success;
      background: rgba(76, 192, 158, 0.15);
    }

    .svg-handle-wrapper {
      color: $primaryColor;
      background: rgba(69, 171, 215, 0.15) ;
    }

    .svg-warn-wrapper {
      color: $warn;
      background: rgba(250, 139, 22, 0.15);
    }

    .svg-error-wrapper {
      color: $error;
      background: rgba(255, 77, 79, 0.15);
    }

    .svg-grey-wrapper {
      color: $defaultGrey;
      background: rgba(169, 169, 169, 0.15);
    }
  }
  .base-info {
    height: calc(100% - 80px);
    overflow-y: scroll;
  }
}
</style>
