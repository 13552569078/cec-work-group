<!--
 * @description 任务中心-待办任务
 * @date 2020-09-08
 * @author lism
-->
<template>
  <div class="come_box_wuse">
    <div class="title">事件趋势分析</div>
    <div class="content">
      <div class="echarts_box">
        <line-chart
          v-if="option.series && option.series.length > 0"
          :chart-data="option"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import 'echarts/lib/component/dataZoom'
import lineChart from '@/components/echarts/lineChart.vue'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'EventSource',
  components: {
    lineChart
  },
  props: {
    searchFormProps: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      option: {}
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
      moduleSrv.getBusTrend(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          const useModuleData = res.data || []
          const useOption = {
            color: ['#CC933D', '#957DFF', '#4AADFF', '#57DFE6', '#F7DB70'],
            tooltip: {
              trigger: 'axis',
              backgroundColor: 'rgba(20, 29, 51, 0.8)',
              borderColor: '#CC933D',
              borderWidth: 1,
              formatter: (params) => {
                console.log(params)
                let htmltags = ''
                params.forEach((val, idx) => {
                  htmltags += `<div style="display:flex;justify-content: space-between;align-items: center;">${val.marker}<span style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5; flex-grow: 1;">${val.seriesName}</span><span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF;background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${val.value}件</span></div>`
                })
                return `<div style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5;">${params[0].name}</div>${htmltags}`
              },
              axisPointer: {
                lineStyle: {
                  width: 32,
                  type: 'solid',
                  color: 'rgba(54,164,255,0.10)'
                }
              }
            },
            legend: {
              data: ['已上报', '已派发', '未受理', '处理中', '已办结'],
              right: 30,
              top: 5,
              textStyle: {
                fontFamily: 'PingFangSC-Regular',
                fontSize: '14px',
                color: '#666666'
              }
            },
            grid: {
              top: 40,
              left: '30',
              right: '50',
              bottom: '40',
              containLabel: true
            },
            xAxis: [{
              type: 'category',
              boundaryGap: false,
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              axisLabel: {
                fontFamily: 'PingFangSC-Regular',
                fontSize: '14px',
                color: '#666666'
              },
              axisLine: {
                lineStyle: {
                  color: '#EDEDED'
                }
              }
            }],
            yAxis: {
              type: 'value',
              axisLabel: {
                fontFamily: 'PingFangSC-Medium',
                fontSize: '14px',
                color: '#BDBDBD',
                fontWeight: 'bold'
              },
              splitLine: {
                lineStyle: {
                  color: '#EDEDED'
                }
              },
              name: '单位：件',
              nameTextStyle: {
                fontFamily: 'PingFangSC-Medium',
                fontSize: '14px',
                color: '#BDBDBD',
                fontWeight: 'bold'
              }
            },
            // dataZoom: [{
            //   xAxisIndex: 0,
            //   show: true,
            //   start: 0,
            //   end: 50,
            //   height: 15,
            //   bottom: 15
            // }],
            series: [
              {
                name: '已上报',
                type: 'line',
                data: [120, 132, 101, 134, 90, 230, 210]
              },
              {
                name: '已派发',
                type: 'line',
                data: [220, 182, 191, 234, 290, 330, 310]
              },
              {
                name: '未受理',
                type: 'line',
                data: [150, 232, 201, 154, 190, 330, 410]
              },
              {
                name: '处理中',
                type: 'line',
                data: [150, 232, 201, 154, 190, 330, 410]
              },
              {
                name: '已办结',
                type: 'line',
                data: [320, 332, 301, 334, 390, 330, 320]
              }
            ]
          }
          const usexAxisData = []
          const useseriesData1 = []
          const useseriesData2 = []
          const useseriesData3 = []
          const useseriesData4 = []
          const useseriesData5 = []
          useModuleData.forEach(val => {
            usexAxisData.push(val.day)
            useseriesData1.push(val.reportCount)
            useseriesData2.push(val.dispatchCount)
            useseriesData3.push(val.noAcceptCount)
            useseriesData4.push(val.handingCount)
            useseriesData5.push(val.overCount)
          })
          useOption.xAxis[0].data = usexAxisData
          useOption.series[0].data = useseriesData1
          useOption.series[1].data = useseriesData2
          useOption.series[2].data = useseriesData3
          useOption.series[3].data = useseriesData4
          useOption.series[4].data = useseriesData5
          // if (useModuleData.length > 8) {
          //   useOption.dataZoom[0].show = true
          //   useOption.dataZoom[0].end = 50
          // } else {
          //   useOption.dataZoom[0].show = false
          //   useOption.dataZoom[0].end = 100
          // }
          this.option = useOption
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.content {
  padding: 0 30px 0px 30px;
  .echarts_box {
    width: 100%;
    height: 400px;
  }
}
</style>
