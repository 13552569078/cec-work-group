<template>
  <div class="eventJK_commonMD">
    <div class="title"><span>历史每日流出任务量TOP5</span></div>
    <div class="putcontent">
      <div class="echarts_box">
        <div class="lishizhi"><span>历史平均值：</span><div class="pjzhdiv"><b>{{ average | changeNumToStr }}</b><span>件</span></div></div>
        <div class="echawp">
          <bar-chart
            v-if="echartsOptions.series && echartsOptions.series.length > 0"
            :chart-data="echartsOptions"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import barChart from '@/components/echarts/barChart.vue'
import { historyDayTopFiveOptions } from './echartsOptions'
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
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      echartsOptions: {},
      average: 0
    }
  },
  computed: {
  },
  watch: {
    propSearchDate: {
      deep: true,
      immediate: true,
      handler(nval) {
        this.getMdDataFn(nval)
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    async getMdDataFn(dateArr) {
      const params = {
        beginTime: dateArr[0],
        endTime: dateArr[1]
      }
      const res = await moduleSrv.getOutflowByDay(params)
      if (res.code === SUCCESS_CODE) {
        this.average = res.data?.average || 0
        const useEchartsOptions = historyDayTopFiveOptions
        useEchartsOptions.yAxis.data = []
        useEchartsOptions.series[0].data = []
        const qushiList = res.data?.days || []
        qushiList.forEach(val => {
          const eobj = {
            value: val.count,
            name: val.day,
            count: val.count
          }
          useEchartsOptions.yAxis.data.push(val.day)
          useEchartsOptions.series[0].data.push(eobj)
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
  .lishizhi {
    width: 100%;
    height: 107px;
    background: linear-gradient(243deg, rgba(0,164,255,0) 0%, rgba(0,164,255,0.1) 100%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    span {
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #202020;
    }
    .pjzhdiv {
      b {
        font-size: 30px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #202020;
      }
      span {
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        margin-left: 4px;
      }
    }
  }
  .echawp {
    width: 100%;
    height: 247px;
  }
}
</style>
