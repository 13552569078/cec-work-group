<!--
 * @description 事件状态监控
 * @date 2023-11-06
 * @author lism
-->
<template>
  <div class="eventmnwraper">
    <div class="contentbox">
      <div class="tpwraper">
        <div class="tabbox">
          <div class="etab" :class="{'selected': tabstatus === 'event'}" @click="clickTabFn('event')">事件状态</div>
          <div class="etab" :class="{'selected': tabstatus === 'task'}" @click="clickTabFn('task')">任务状态</div>
        </div>
        <div class="whtbg" />
      </div>

      <div class="commudlebox">
        <stsEvent v-if="tabstatus === 'event'" />
        <stsTask v-if="tabstatus === 'task'" />
      </div>
    </div>
  </div>
</template>

<script>
import stsEvent from './stsEvent.vue'
import stsTask from './stsTask.vue'

export default {
  name: 'Evtstatus',
  components: {
    stsEvent,
    stsTask
  },
  filters: {
    changeNumToStr(num) {
      if (num === undefined || num === null) {
        return 0
      } else {
        const useNum = Number(num)
        return useNum.toLocaleString()
      }
    }
  },
  data() {
    return {
      tabstatus: 'event'
    }
  },
  methods: {
    clickTabFn(type) {
      this.tabstatus = type
    }
  }
}
</script>
<style scoped lang="scss">
.eventmnwraper {
  width: 100%;
  height: 100%;
  .contentbox {
    background: #ffffff;
    width: 100%;
    height: 100%;
    overflow: auto;
    .tpwraper {
      width: 100%;
      height: 148px;
      background: url('~@/assets/workbench/table_top_bg@2x.png') -1px -1px no-repeat;
      background-size: calc(100% + 2px) calc(100% + 2px);
      padding: 5px 9px 0px 9px;
      .tabbox {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        .etab {
          width: 140px;
          height: 80px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #282828;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          position: relative;
          &.selected {
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #36A4FF;
            &::after {
              display: block;
              content: '';
              width: 28px;
              height: 32px;
              border-top: 16px solid transparent;
              border-right: 14px solid transparent;
              border-bottom: 16px solid rgba(250,253,255,0.8);;
              border-left: 14px solid transparent;
              position: absolute;
              left: 50%;
              bottom: 0px;
              margin-left: -14px;
            }
          }
        }
      }
      .whtbg {
        width: 100%;
        height: 72px;
        background: rgba(250, 253, 255, 0.8);
        border-radius: 8px;
      }
    }
    .commudlebox {
      margin-top: -60px;
    }
  }
}
</style>
