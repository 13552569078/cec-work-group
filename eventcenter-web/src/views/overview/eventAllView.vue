<!--
 * @description 任务中心-待办任务
 * @date 2020-09-08
 * @author lism
-->
<template>
  <div class="come_box_wuse">
    <div class="title">事件总览</div>
    <div class="content">
      <div class="eav_each">
        <div class="top">
          <svg-icon class="bmy" icon-class="接收" />
          <span>接收事件总数（件）</span>
        </div>
        <div class="btm">{{ moduleData.totalCount | changeNumToStr }}</div>
      </div>

      <div class="eav_each">
        <div class="top">
          <svg-icon class="bmy" icon-class="已派发" />
          <span>已派发事件数量（件）</span>
        </div>
        <div class="btm">{{ moduleData.dispatchCount | changeNumToStr }}</div>
      </div>

      <div class="eav_each">
        <div class="top">
          <svg-icon class="bmy" icon-class="已办结" />
          <span>已办结事件数量（件）</span>
        </div>
        <div class="btm">{{ moduleData.endCount | changeNumToStr }}</div>
      </div>

      <div class="eav_each">
        <div class="top">
          <svg-icon class="bmy" icon-class="处理中" />
          <span>处理中事件数量（件）</span>
        </div>
        <div class="btm">{{ moduleData.handingCount | changeNumToStr }}</div>
      </div>

      <div class="eav_each">
        <div class="top">
          <svg-icon class="bmy" icon-class="超时" />
          <span>超时事件数量（件）</span>
        </div>
        <div class="btm">{{ moduleData.overTimeCount | changeNumToStr }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'EventAllView',
  components: {
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
  props: {
    searchFormProps: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      moduleData: {}
    }
  },
  watch: {
    searchFormProps: {
      deep: true,
      handler(nVal) {
        if (!nVal.beginTime || !nVal.endTime) return
        this.getDataFn(nVal)
      }
    }
  },
  created() {
  },
  methods: {
    getDataFn({ sysCodes, beginTime, endTime }) {
      const params = {
        sysCodes,
        beginTime,
        endTime
      }
      moduleSrv.getBuOverview(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.moduleData = res.data || {}
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.content {
  padding: 0 30px 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .eav_each {
    background: rgba(0,164,255,0.03);
    border-radius: 4px;
    height: 140px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 19%;
    &:hover {
      background: rgba(0,164,255,0.08);
      box-shadow: 0 4px 14px 1px rgba(0,164,255,0.05);
      border-radius: 4px;
    }
    .top {
      display: flex;
      justify-content: center;
      align-items: center;
      .bmy {
        width: 16px;
        height: 16px;
      }
      span {
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #666666;
        letter-spacing: 0;
        font-weight: 400;
        margin-left: 8px;
      }
    }
    .btm {
      font-family: DINAlternate-Bold;
      font-size: 30px;
      color: #202020;
      letter-spacing: 0;
      text-align: center;
      font-weight: bold;
      margin-top: 16px;
    }
  }
}
</style>
