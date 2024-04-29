<template>
  <div class="eventJK_commonMD">
    <div class="title"><span>任务量同比环比趋势</span></div>
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
import { eventInViewTongHuanBiOptions } from './echartsOptions'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'EventInTBHB',
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
      const res = await moduleSrv.getOutflowYearTrend(params)
      if (res.code === SUCCESS_CODE) {
        const useEchartsOptions = eventInViewTongHuanBiOptions
        useEchartsOptions.legend.data = []
        useEchartsOptions.series[0].data = []
        useEchartsOptions.series[1].data = []

        const uselastYearMonthList = res.data?.lastYearMonthList || []
        const usethisYearMonthList = res.data?.thisYearMonthList || []

        useEchartsOptions.legend.data = [`${uselastYearMonthList[0].month.split('-')[0]}年`, `${usethisYearMonthList[0].month.split('-')[0]}年`]

        useEchartsOptions.series[0].name = `${uselastYearMonthList[0].month.split('-')[0]}年`
        useEchartsOptions.series[1].name = `${usethisYearMonthList[0].month.split('-')[0]}年`

        uselastYearMonthList.forEach(val => {
          const eobj = {
            value: val.count,
            name: val.month,
            count: val.count
          }
          useEchartsOptions.series[0].data.push(eobj)
        })

        usethisYearMonthList.forEach((val, idx) => {
          const lastTB = uselastYearMonthList[idx].count
          let lastHB, lastHBName
          if (idx === 0) {
            lastHB = uselastYearMonthList[11].count
            lastHBName = uselastYearMonthList[11].month
          } else {
            lastHB = usethisYearMonthList[idx - 1].count
            lastHBName = usethisYearMonthList[idx - 1].month
          }
          const eobj = {
            value: val.count,
            name: val.month,
            count: val.count,
            tongbi: val.count - lastTB > 0 ? `+${(((val.count - lastTB) / (lastTB || 1)) * 100).toFixed(2)}` : (((val.count - lastTB) / (lastTB || 1)) * 100).toFixed(2),
            huanbi: val.count - lastHB > 0 ? `+${(((val.count - lastHB) / (lastHB || 1)) * 100).toFixed(2)}` : (((val.count - lastHB) / (lastHB || 1)) * 100).toFixed(2),
            huanbiNum: lastHB,
            huanbiMonth: lastHBName
          }
          useEchartsOptions.series[1].data.push(eobj)
        })

        useEchartsOptions.tooltip.formatter = (params) => {
          return `<div style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5; display:flex;justify-content: space-between;align-items: center;">
                    <span>${params[1].name}</span>
                    <span>${params[1].value}件</span>
                  </div>
                  <div style="display:flex;justify-content: flex-start;align-items: center; margin-top: 10px;">
                    ${params[0].marker}
                    <span style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5; width: 80px;">同比${params[0].name}</span>
                    <span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF; width: 60px; background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${params[0].value}件</span>
                    <span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF;background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${params[1].data.tongbi}%</span>
                  </div>
                  <div style="display:flex;justify-content: flex-start;align-items: center; margin-top: 10px;">
                    ${params[1].marker}
                    <span style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5; width: 80px;">环比${params[1].data.huanbiMonth}</span>
                    <span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF; width: 60px;background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${params[1].data.huanbiNum}件</span>
                    <span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF;background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${params[1].data.huanbi}%</span>
                  </div>`
        }

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
