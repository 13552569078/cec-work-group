<template>
  <div class="eventJK_commonMD">
    <div class="title"><span>统计周期事件流出趋势分析</span></div>
    <div class="putcontent">
      <div class="echarts_box">
        <line-chart
          v-if="echartsOptions.series && echartsOptions.series.length > 0"
          :chart-data="echartsOptions"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import lineChart from '@/components/echarts/lineChart.vue'
import { eventInViewHistoryTendOptions } from './echartsOptions'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'HistoryTend',
  components: {
    lineChart
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
      const res = await moduleSrv.getOutflowTrend(params)
      if (res.code === SUCCESS_CODE) {
        const useEchartsOptions = eventInViewHistoryTendOptions
        useEchartsOptions.xAxis.data = []
        useEchartsOptions.series[0].data = []
        const qushiList = res.data || []
        qushiList.forEach(val => {
          useEchartsOptions.xAxis.data.push(val.month)
          useEchartsOptions.series[0].data.push(val.count)
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
