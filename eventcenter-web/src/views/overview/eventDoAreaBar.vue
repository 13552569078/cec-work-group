<!--
 * @description 任务中心-待办任务
 * @date 2020-09-08
 * @author lism
-->
<template>
  <div class="come_box_wuse">
    <div class="title">事件任务处置分布</div>
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
import barChart from '@/components/echarts/barChart'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'EventSource',
  components: {
    barChart
  },
  props: {
    sysCodeAllLength: {
      type: Number,
      default: () => 0
    },
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

  methods: {
    getDataFn({ sysCodes, beginTime, endTime }) {
      const params = {
        sysCodes,
        beginTime,
        endTime
      }
      moduleSrv.getBusDisposition(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          const useModuleData = res.data || []

          const useOption = {
            tooltip: {
              trigger: 'axis',
              backgroundColor: 'rgba(20, 29, 51, 0.8)',
              borderColor: '#CC933D',
              borderWidth: 1,
              formatter: (params) => {
                let htmltags = ''
                params.forEach((val, idx) => {
                  htmltags += `<div style="display:flex;justify-content: space-between;align-items: center;">${val.marker}<span style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5;">${val.name}</span><span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF;background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${val.data.count}件</span><span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF;background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${val.data.value}%</span></div>`
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
              left: 35,
              top: 30,
              right: 10,
              bottom: 55
            },
            xAxis: [{
              type: 'category',
              data: ['12345', '综治', '事务总线', 'Thu', 'Fri', 'Sat', 'Sun'],
              axisLabel: {
                fontFamily: 'PingFangSC-Regular',
                fontSize: '16px',
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
              name: '单位：%',
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
                name: '事件任务处置分布',
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar',
                showBackground: false,
                backgroundStyle: {
                  color: 'rgba(74,173,255,0.35)'
                },
                barWidth: '24px',
                itemStyle: {
                  borderColor: '#4AADFF',
                  borderWidth: 1,
                  borderType: 'solid',
                  color: 'rgba(74,173,255,0.35)'
                }
              }
            ]
          }
          const usexAxisData = []
          const useseriesData = []
          useModuleData.forEach(val => {
            usexAxisData.push(val.name)
            useseriesData.push({
              value: +val.radio,
              name: val.name,
              count: val.count
            })
          })
          useOption.xAxis[0].data = usexAxisData
          useOption.series[0].data = useseriesData
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
    height: 280px;
  }
}
</style>
