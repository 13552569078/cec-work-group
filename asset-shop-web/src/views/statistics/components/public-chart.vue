<!--/*
* @Author: dingli
* @Desc: 上架分析
* @Date:
*/-->
<template>
  <div class="public-chart-wrap">
    <h3 class="info-title">上架分析</h3>
    <span class="btn-radio">
      <span class="btn-radio-item" :class="{active:timeFlag==6}" @click="clickTime(6)">近7天</span>
      <span class="btn-radio-item" :class="{active:timeFlag==29}" @click="clickTime(29)">近30天</span>
    </span>
    <div class="chart-box-wrap">
      <chart-box
        ref="refChartBox"
        :chart-option="optionVal"
      />
    </div>
    <empty v-if="!optionVal" text="暂无数据" type="no-data" style="height:100%;width:280px;" class="cls-empty" />
  </div>
</template>
<script>
import moment from 'moment-cn'
import chartBox from '@/components/echarts'
import empty from '@l/components/empty'
import { queryPublicAnalysis } from '@/api/statistics'
export default {
  name: 'PublicChart',
  components: { chartBox, empty },
  props: {},
  data() {
    return {
      timeFlag: 6,
      optionVal: null
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    clickTime(val) {
      this.timeFlag = val
      this.getData(true)
    },
    setOption(xdata, ydata1, ydata2) {
      const options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: `
          <p style="color:#4b4b4b;">{b}<p/>
          <p style="color:#4b4b4b;"><span style="display:inline-block;width:70px;">{a0}</span>{c0}</p>
          <p style="color:#4b4b4b;"><span style="display:inline-block;width:70px;">{a1}</span>{c1}</p>
          `
        },
        legend: {
          right: '4%',
          top: 24,
          selectedMode: false,
          itemWidth: 8,
          itemHeight: 8,
          itemStyle: {
            borderWidth: 1,
            borderRadius: 0
          },
          textStyle: {
            color: '#8a8a8a'
          }
        },
        grid: {
          top: 64,
          left: 30,
          right: 24,
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xdata,
            boundaryGap: false,
            axisLine: {
              show: false,
              lineStyle: {
                color: '#EDEDED'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: ['#E4E9ED']
              }
            },
            axisLabel: {
              textStyle: {
                color: '#BDBDBD',
                fontSize: 12
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '单位/次',
            minInterval: 1,
            Interval: 10,
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#E4E9ED']
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#EDEDED'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#BDBDBD',
                fontSize: 14
              }
            },
            nameTextStyle: {
              color: '#8a8a8a',
              fontSize: 14,
              fontWeight: 400,
              padding: [10, 10]
            }
          }
        ],
        series: [
          {
            name: '数字资源量',
            type: 'line',
            barMaxWidth: 10,
            large: true, // 开启大数据量优化
            data: ydata1,
            itemStyle: {
              borderWidth: 1,
              borderColor: '#36A4FF',
              color: '#36A4FF'
            }
          },
          {
            name: '资源申请量',
            type: 'line',
            barMaxWidth: 10,
            large: true, // 开启大数据量优化
            data: ydata2,
            itemStyle: {
              borderWidth: 1,
              borderColor: '#4CC09E',
              color: '#4CC09E'
            }
          }
        ]
      }
      this.optionVal = options
    },
    async getData(resize) {
      try {
        const params = {
          startTime: moment().subtract('days', this.timeFlag).format('YYYY-MM-DD') + ' 00:00:00',
          endTime: moment().format('YYYY-MM-DD') + ' 23:59:59'
        }
        console.log(params)
        let resdata = await queryPublicAnalysis(params)
        resdata = resdata.data
        const xdata = []
        const ydata1 = []
        const ydata2 = []
        resdata.forEach(d => {
          let date = d.date || ''
          date = date.replace(/\d{4}-/, '')
          xdata.push(date)
          ydata1.push(d.appCount)
          ydata2.push(d.assetCount)
        })
        if (resdata.length) {
          this.setOption(xdata, ydata1, ydata2)
        } else {
          this.optionVal = null
        }
        if (resize) {
          this.$nextTick(() => {
            this.$refs.refChartBox.resize()
          })
        }
      } catch (e) {
        // e
      }
    }
  }
}
</script>
<style scoped lang="scss">
.public-chart-wrap {
  position: relative;
  width: 100%;
  min-width: 575px;
  height: 400px;
  background: #FFFFFF;
}
.info-title {
  padding-top: 20px;
  margin-bottom: 0px;
  margin-left: 20px;
}
.chart-box-wrap {
  height: 350px;
}
.btn-radio {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 999;
}
.cls-empty {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}
</style>
