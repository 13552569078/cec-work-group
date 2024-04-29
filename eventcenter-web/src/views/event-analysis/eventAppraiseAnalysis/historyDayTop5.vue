<template>
  <div class="eventJK_commonMD">
    <div class="title"><span>待评价事件类型TOP5</span></div>
    <div class="putcontent">
      <div class="echarts_box">
        <bar-chart
          v-if="echartsOptions.series && echartsOptions.series.length > 0"
          :chart-data="echartsOptions"
        />
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
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      echartsOptions: {}
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
      const res = await moduleSrv.getEvaluateAnalysisNoPJ(params)
      if (res.code === SUCCESS_CODE) {
        const useEchartsOptions = historyDayTopFiveOptions
        useEchartsOptions.yAxis.data = []
        useEchartsOptions.series[0].data = []
        const qushiList = res.data || []
        qushiList.forEach(val => {
          const eobj = {
            value: val.count,
            name: val.eventTypeName,
            count: val.count
          }
          useEchartsOptions.yAxis.data.push(val.eventTypeName)
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
}
</style>
