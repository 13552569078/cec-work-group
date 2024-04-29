<!--
 * @description 任务中心-待办任务
 * @date 2020-09-08
 * @author lism
-->
<template>
  <div class="come_box_wuse">
    <div class="title">超时事件分析</div>
    <div class="content">
      <div class="echarts_box">
        <bar-chart
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
import barChart from '@/components/echarts/barChart.vue'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'EventSource',
  components: {
    barChart
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
      moduleSrv.getBusOverTimeAnalysis(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          const useModuleData = res.data.reverse() || []
          const useOption = {
            tooltip: {
              trigger: 'axis',
              backgroundColor: 'rgba(20, 29, 51, 0.8)',
              borderColor: '#CC933D',
              borderWidth: 1,
              formatter: (params) => {
                let htmltags = ''
                params.forEach((val, idx) => {
                  htmltags += `<div style="display:flex;justify-content: space-between;align-items: center;">${val.marker}<span style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5;">${val.name}</span><span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF;background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${val.data.value}件</span></div>`
                })
                return `<div style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5;">${params[0].seriesName}</div>${htmltags}`
              },
              axisPointer: {
                type: 'shadow',
                shadowStyle: {
                  color: '#cccccc',
                  opacity: 0.15
                }
              }
            },
            grid: {
              left: 150,
              top: 0,
              right: 100,
              bottom: 10
            },
            yAxis: [{
              type: 'category',
              data: ['12345', '综治', '事务总线', 'Thu', 'Fri', 'Sat', 'Sun', 'Fri', 'Sat', 'Sun'],
              axisLabel: {
                fontFamily: 'PingFangSC-Regular',
                fontSize: '16px',
                color: '#666666',
                align: 'left',
                padding: [0, 0, 0, -115],
                width: 150
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: '#EDEDED'
                }
              }
            }, {
              type: 'category',
              data: [120, 200, 150, 80, 70, 110, 130, 70, 110, 130],
              axisLabel: {
                color: '#36A4FF',
                fontFamily: 'PingFangSC-Regular',
                fontSize: '16px',
                align: 'right',
                padding: [0, -85, 0, 0],
                formatter: function(value) {
                  const val = value
                  if (+val > 9999) {
                    return `${val / 10000}万件`
                  } else {
                    return `${val}件`
                  }
                }
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: '#EDEDED'
                }
              }
            }],
            xAxis: {
              type: 'value',
              axisLabel: {
                show: false,
                fontFamily: 'PingFangSC-Medium',
                fontSize: '14px',
                color: '#BDBDBD',
                fontWeight: 'bold'
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#EDEDED'
                }
              },
              nameTextStyle: {
                fontFamily: 'PingFangSC-Medium',
                fontSize: '14px',
                color: '#BDBDBD',
                fontWeight: 'bold'
              }
            },
            // dataZoom: [{
            //   yAxisIndex: [0, 1],
            //   show: true,
            //   start: 50,
            //   end: 100,
            //   width: 15,
            //   left: 0
            // }],
            series: [
              {
                name: '超时事件分析',
                data: [120, 200, 150, 80, 70, 110, 130, 70, 110, 130],
                type: 'bar',
                showBackground: false,
                backgroundStyle: {
                  color: 'rgba(74,173,255,0.35)'
                },
                barWidth: '20px',
                itemStyle: {
                  borderColor: '#4AADFF',
                  borderWidth: 1,
                  borderType: 'solid',
                  color: 'rgba(74,173,255,0.35)'
                }
              }
            ]
          }
          const useyAxisData1 = []
          const useyAxisData2 = []
          const useseriesData = []
          useModuleData.forEach(val => {
            useyAxisData1.push(val.name)
            useyAxisData2.push(val.count)
            useseriesData.push({
              value: +val.count,
              name: val.name
            })
          })
          useOption.yAxis[0].data = useyAxisData1
          useOption.yAxis[1].data = useyAxisData2
          useOption.series[0].data = useseriesData
          // if (useModuleData.length > 8) {
          //   useOption.dataZoom[0].show = true
          //   useOption.dataZoom[0].start = 50
          // } else {
          //   useOption.dataZoom[0].show = false
          //   useOption.dataZoom[0].start = 0
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
    height: 420px;
  }
}
</style>
