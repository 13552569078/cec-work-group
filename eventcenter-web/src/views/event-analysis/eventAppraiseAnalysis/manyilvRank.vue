<template>
  <div class="eventJK_commonMD">
    <div class="title"><span>处置方事件评价满分率排名</span></div>
    <div class="putcontent">
      <div class="echarts_box">
        <bar-chart
          v-if="echartsOptions.series && echartsOptions.series.length > 0"
          :chart-data="echartsOptions"
        />
        <div class="tip5lv">
          <div class="tt">评价满分率</div>
          <div class="rankbox">
            <div v-for="(val, idx) in rankList" :key="idx" class="lan">{{ val.fullScoreRate }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import barChart from '@/components/echarts/barChart.vue'
import { manyilvFiveOptions } from './echartsOptions'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'InPlatform',
  components: {
    barChart
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
  mixins: [],
  props: {
    propSearchDate: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      echartsOptions: {},
      rankList: []
    }
  },
  computed: {
  },
  watch: {
    propSearchDate: {
      deep: true,
      immediate: true,
      handler(nval) {
        if (!nval.sysCodes || !nval.dateArr) return
        this.getMdDataFn(nval.sysCodes, nval.dateArr)
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    async getMdDataFn(sysCodes, dateArr) {
      const params = {
        sysCodes,
        beginTime: dateArr[0],
        endTime: dateArr[1]
      }
      const res = await moduleSrv.getEvaluateAnalysisManFenOrChaPingRank(params)
      if (res.code === SUCCESS_CODE) {
        const useEchartsOptions = manyilvFiveOptions
        useEchartsOptions.yAxis.data = []
        useEchartsOptions.series[0].data = []
        useEchartsOptions.series[1].data = []
        useEchartsOptions.series[2].data = []
        const qushiList = res.data?.fullScoreList || []
        this.rankList = qushiList
        qushiList.forEach(val => {
          const eobj1 = {
            value: val.fullScoreCount,
            name: val.sysName,
            count: val.fullScoreCount
          }
          const eobj2 = {
            value: val.evaluateCount,
            name: val.sysName,
            count: val.evaluateCount
          }
          const eobj3 = {
            value: val.totalCount,
            name: val.sysName,
            count: val.totalCount
          }
          useEchartsOptions.yAxis.data.push(val.sysName)
          useEchartsOptions.series[0].data.push(eobj1)
          useEchartsOptions.series[1].data.push(eobj2)
          useEchartsOptions.series[2].data.push(eobj3)
        })
        this.echartsOptions = useEchartsOptions
      }
    }
  }
}
</script>
<style scoped lang="scss">
.echarts_box {
  width: 100%;
  height: 350px;
  position: relative;
  .tip5lv {
    position: absolute;
    top: 15px;
    right: 20px;
    .tt {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      margin-bottom: 15px;
    }
    .rankbox {
      height: 265px;
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      flex-direction: column;
      .lan {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #36A4FF;
        height: 53px;
        line-height: 53px;
        text-align: right;
      }
      .hei {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        height: 53px;
        line-height: 53px;
        text-align: right;
      }
    }
  }
}
</style>
