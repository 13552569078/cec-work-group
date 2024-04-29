<template>
  <div class="eventJK_commonMD">
    <div class="title"><span>已办结事件总数、已评价、待评价、未配置分析</span></div>
    <div class="putcontent">
      <div class="echarts_box">
        <div class="left">
          <line-chart
            v-if="lineEchartsOptions.series && lineEchartsOptions.series.length > 0"
            :chart-data="lineEchartsOptions"
            @_chart="getCurEchartFn"
          />
        </div>
        <div class="right">
          <div class="curyuefen">{{ curMonthUse }}</div>
          <pie-chart
            v-if="pieEchartsOptions.series && pieEchartsOptions.series.length > 0"
            :chart-data="pieEchartsOptions"
          />
          <div class="huanbg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import lineChart from '@/components/echarts/lineChart.vue'
import pieChart from '@/components/echarts/pieChart.vue'
import { eventInViewTongHuanBiOptions, tbhbRightOptions } from './echartsOptions'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'EventInTBHB',
  components: {
    lineChart,
    pieChart
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
      lineEchartsDatas: [],
      lineEchartsOptions: {},
      pieEchartsOptions: {},
      curMonthUse: ''
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
        this.getLineMdDataFn(nval.sysCodes, nval.dateArr)
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    async getLineMdDataFn(sysCodes, dateArr) {
      const params = {
        sysCodes,
        beginTime: dateArr[0],
        endTime: dateArr[1]
      }
      const res = await moduleSrv.getEvaluateAnalysisFourLine(params)
      if (res.code === SUCCESS_CODE) {
        const useEchartsOptions = eventInViewTongHuanBiOptions
        useEchartsOptions.xAxis.data = []
        useEchartsOptions.series[0].data = []
        useEchartsOptions.series[1].data = []
        useEchartsOptions.series[2].data = []
        useEchartsOptions.series[3].data = []
        const uselastYearMonthList = res.data || []
        uselastYearMonthList.forEach(val => {
          useEchartsOptions.xAxis.data.push(val.month)
          useEchartsOptions.series[0].data.push(val.evaluateCount)
          useEchartsOptions.series[1].data.push(val.stayCount)
          useEchartsOptions.series[2].data.push(val.noConfigCount)
          useEchartsOptions.series[3].data.push(val.endCount)
        })
        this.lineEchartsOptions = useEchartsOptions

        // 处理饼图，默认展示当前月，也就是最后一条
        this.lineEchartsDatas = uselastYearMonthList
        this.getPieMdDataFn(this.lineEchartsDatas[this.lineEchartsDatas.length - 1])
      }
    },
    getCurEchartFn(curEchart) {
      curEchart.getZr().on('click', params => {
        const pointInPixel = [params.offsetX, params.offsetY]
        if (curEchart.containPixel('grid', pointInPixel)) {
        // 点击第几个柱子
          const pointInGrid = curEchart.convertFromPixel({ seriesIndex: 0 }, pointInPixel)
          // 也可以通过params.offsetY 来判断鼠标点击的位置是否是图表展示区里面的位置
          // 也可以通过name[xIndex] != undefined，name是x轴的坐标名称来判断是否还是点击的图表里面的内容
          // x轴数据的索引
          const xIndex = pointInGrid[0]
          const curClickedData = this.lineEchartsDatas[xIndex]
          console.log(curClickedData)
          this.getPieMdDataFn(curClickedData)
        }
      })
    },
    async getPieMdDataFn(curClickedData) {
      // echarts数据处理
      const useEchartsOptions = tbhbRightOptions
      useEchartsOptions.legend.data = []
      useEchartsOptions.series[0].name = ''
      useEchartsOptions.series[0].data = []
      const datasptlegend = [
        {
          name: `已评价：${curClickedData.evaluateCount}（${((curClickedData.evaluateCount / (curClickedData.endCount || 1)) * 100).toFixed(2)}%）`,
          nameuse: '已评价'
        },
        {
          name: `待评价：${curClickedData.stayCount}（${((curClickedData.stayCount / (curClickedData.endCount || 1)) * 100).toFixed(2)}%）`,
          nameuse: '待评价'
        },
        {
          name: `未配置：${curClickedData.noConfigCount}（${((curClickedData.noConfigCount / (curClickedData.endCount || 1)) * 100).toFixed(2)}%）`,
          nameuse: '未配置'
        }
      ]
      const datasptseries = [
        {
          value: curClickedData.evaluateCount,
          name: `已评价：${curClickedData.evaluateCount}（${((curClickedData.evaluateCount / (curClickedData.endCount || 1)) * 100).toFixed(2)}%）`,
          radio: ((curClickedData.evaluateCount / (curClickedData.endCount || 1)) * 100).toFixed(2),
          count: curClickedData.evaluateCount
        },
        {
          value: curClickedData.stayCount,
          name: `待评价：${curClickedData.stayCount}（${((curClickedData.stayCount / (curClickedData.endCount || 1)) * 100).toFixed(2)}%）`,
          radio: ((curClickedData.stayCount / (curClickedData.endCount || 1)) * 100).toFixed(2),
          count: curClickedData.stayCount
        },
        {
          value: curClickedData.noConfigCount,
          name: `未配置：${curClickedData.noConfigCount}（${((curClickedData.noConfigCount / (curClickedData.endCount || 1)) * 100).toFixed(2)}%）`,
          radio: ((curClickedData.noConfigCount / (curClickedData.endCount || 1)) * 100).toFixed(2),
          count: curClickedData.noConfigCount
        }
      ]
      useEchartsOptions.legend.data = datasptlegend
      useEchartsOptions.legend.formatter = (name) => {
        if (datasptlegend.length) {
          const item = datasptlegend.filter((item) => item.name === name)[0]
          return `{name|${item.nameuse}}`
        }
      }
      useEchartsOptions.series[0].name = curClickedData.month
      useEchartsOptions.series[0].data = datasptseries
      this.pieEchartsOptions = useEchartsOptions
      this.curMonthUse = curClickedData.month
    }
  }
}
</script>
<style scoped lang="scss">
.echarts_box {
  width: 100%;
  height: 350px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    width: calc(66% - 1px);
    height: 350px;
  }
  .right {
    width: calc(34% - 1px);
    height: 350px;
    position: relative;
    .curyuefen {
      position: absolute;
      left: 50%;
      top: 156px;
      margin-left: -30px;
      line-height: 35px;
      font-size: 16px;
      font-weight: bold;
    }
    .huanbg {
      width: 180px;
      height: 180px;
      background: url('~@/assets/workbench/oval@2x.png') no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -90px 0 0 -90px;
      pointer-events: none;
    }
  }
}
</style>
