<template>
  <div class="chartView">
    <bar-chart
      v-if="chartOpation.chartData.dataset.source.length > 0"
      :chart-data="chartOpation.chartData"
    />
    <div v-else class="text">暂无数据</div>
  </div>
</template>

<script>
import barChart from '@/components/echarts/barChart.vue'
// import * as echarts from 'echarts'
export default {
  name: 'ChartResult',
  components: {
    barChart
  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chartOpation: {
        chartData: {
          // chart数据
          title: {
            text: '事件量统计图',
            textStyle: {
              fontSize: '14px',
              color: '#313131',
              fontFamily: 'Arial'
            }
          },
          grid: {
            show: false,
            left: '40px',
            right: '40px'
          },
          legend: {
            right: 30,
            borderColor: '#CBCCCB'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          dataset: {
            dimensions: [
              'product',
              '事件总数',
              '审核通过事件数',
              '结案事件数',
              '超时事件数'
            ],
            source: []
          },
          xAxis: {
            type: 'category',
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          },
          yAxis: [
            {
              type: 'value',
              name: ''
            },
            {
              type: 'value',
              name: '单位：件',
              nameTextStyle: {
                padding: [0, 40, 0, 0]
              }
            }
          ],
          series: []
        }
      }
    }
  },
  computed: {
    series() {
      const arr = []
      for (let i = 0; i < 4; i++) {
        const color =
            ['rgba(72,117,240,0.35)',
              'rgba(54,164,255,0.35)',
              'rgba(65,210,217,0.35)',
              'rgba(255,173,38,0.35)']
        const borderColor =
            ['#4875F0',
              '#36A4FF',
              '#41D2D9',
              '#FFAD26']
        const hoverColor =
            ['rgba(72, 117, 240, 0.65)',
              'rgba(54, 164, 255, 0.65)',
              'rgba(65, 210, 217, 0.65)',
              'rgba(255, 173, 38, 0.65)']
        arr.push({
          type: 'bar',
          showBackground: true,
          color: color[i],
          barWidth: '8%',
          borderWidth: '1px',
          borderType: 'solid',
          backgroundStyle: {
            color: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 3,
            borderWidth: 1
          },
          label: {
            distance: 2
          },
          itemStyle: {
            borderWidth: 1,
            borderColor: borderColor[i]
          },
          emphasis: {
            itemStyle: {
              color: hoverColor[i] // hover时改变柱子颜色
              // borderColor: '#36A4FF',
              // borderType: 'solid'
            }
          }
        })
      }
      return arr
    }
  },
  watch: {
    value: {
      deep: true,
      handler() {
        this.dataCount()
      }
    }
  },
  created() {
    this.chartOpation.chartData.series = this.series
    this.dataCount()
  },
  methods: {
    dataCount() {
      const arr = []
      this.value.forEach((res) => {
        const obj = {
          product: res.deptName,
          事件总数: res.totalCount,
          审核通过事件数: res.checkCount,
          结案事件数: res.endCount,
          超时事件数: res.overTimeCount
        }
        arr.push(obj)
      })
      this.chartOpation.chartData.dataset.source = arr
    }
  }
}
</script>

<style scoped lang="scss">
.chartView {
  width: 100%;
  height: 100%;
  .text {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
