<!--
 * @description 任务中心-待办任务
 * @date 2020-09-08
 * @author lism
-->
<template>
  <div class="come_box_wuse">
    <div class="title">超时事件分析</div>
    <div class="content">
      <div v-if="moduleData.length > 0" class="echarts_box">
        <div v-for="(val, idx) in moduleData" :key="idx" :class="{'eachone': true, 'active':idx <= 2}">
          <div class="l">{{ val.name }}</div>
          <div class="m">
            <div class="prce" :style="{'width': val.percent + '%'}" />
          </div>
          <div class="r">{{ val.count | changeNumToWan }}件</div>
        </div>
      </div>
      <div v-else class="nodata">暂无数据</div>
    </div>
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'EventSource',
  components: {
  },
  filters: {
    changeNumToWan(num) {
      const val = num
      if (+val > 9999) {
        return `${(val / 10000).toFixed(0)}万`
      } else {
        return `${val}`
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
      moduleData: []
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
      moduleSrv.getBusOverTimeAnalysis(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          const useModuleData = res.data || []
          useModuleData.forEach(val => {
            this.$set(val, 'percent', (val.count / (useModuleData[0].count || 1) * 100).toFixed(5))
          })
          this.moduleData = useModuleData
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.content {
  padding: 0 0px 0px 0px;
  .echarts_box {
    width: 100%;
    height: 420px;
    overflow-x: hidden;
    overflow-y: auto;
    .eachone {
      width: 100%;
      height: 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      &:hover {
        background-image: linear-gradient(270deg, rgba(0,164,255,0.00) 0%, rgba(0,164,255,0.08) 100%);
      }
      .l {
        width: 180px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #666666;
        letter-spacing: 0;
        font-weight: 400;
        padding-left: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .m {
        flex-grow: 1;
        .prce {
          height: 20px;
          opacity: 0.6;
          background: rgba(54,164,255,0.35);
          border: 1px solid #36A4FF;
        }
      }
      .r {
        width: 150px;
        padding-right: 30px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #36A4FF;
        letter-spacing: 0;
        text-align: right;
        font-weight: 400;
      }
    }
    .active {
      .l {
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: #36A4FF;
        letter-spacing: 0;
        font-weight: 600;
      }
    }
  }
  .nodata {
    width: 100%;
    height: 420px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #999999;
    letter-spacing: 0;
    font-weight: 600;
  }
}
</style>
