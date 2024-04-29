<template>
  <div class="warp">
    <div class="title">本部门</div>
    <div class="card-wrap m-t-20">
      <div v-for="(item, index) in cardList" :key="index" class="card-item">
        <div class="icon" :style="{ 'backgroundImage': `url(${item.icon})` }" />
        <div class="con-wrap">
          <div class="num" :class="[{'blue':index===0}]">{{ item.value }}<span v-if="item.unit">{{ item.unit }}</span></div>
          <div class="label">{{ item.label }}</div>
        </div>
      </div>
    </div>
    <div class="m-t-20">
      <div ref="chart" style="width: 100%; height: 300px;" />
    </div>
  </div>
</template>

<script>
import eventAnalysisApi from '@/api/eventAnalysis'
import echarts from '@/components/echarts/common'
import { LineChart } from 'echarts/charts'
echarts.use([LineChart])

export default {
  name: 'ThisDep',
  props: {
    serachParams: {
      // 查询
      required: true,
      type: Object,
      default: () => {
        return {
          'beginDate': '',
          'deptCode': '',
          'endDate': ''
        }
      }
    }
  },
  data() {
    return {
      cardList: [{
        label: '应处理数',
        value: '',
        key: 'toBeProcessedNum',
        icon: require('@/assets/eventAnalysis/icon1.png')
      }, {
        label: '处理数',
        value: '',
        key: 'processedNum',
        icon: require('@/assets/eventAnalysis/icon2.png')
      }, {
        label: '处理率',
        value: '',
        key: 'processedRate',
        unit: '%',
        icon: require('@/assets/eventAnalysis/icon3.png')
      }, {
        label: '超时数',
        value: '',
        key: 'overTimeNum',
        icon: require('@/assets/eventAnalysis/icon4.png')
      }, {
        label: '超时率',
        value: '',
        key: 'overTimeRate',
        unit: '%',
        icon: require('@/assets/eventAnalysis/icon5.png')
      }]
    }
  },
  methods: {
    init() {
      if (!this.serachParams.deptCode) return
      this.getCrad()
      this.initChart()
    },
    // 获取卡片
    async getCrad() {
      const { data } = await eventAnalysisApi.postThisDeptStat(this.serachParams)
      this.cardList = this.cardList.map((item) => {
        return {
          ...item,
          value: data[item.key]
        }
      })
    },
    // 绘制报表
    async initChart() {
      const { data } = await eventAnalysisApi.postThisDeptProcessStatList(this.serachParams)
      const Xdata = data.map((item) => {
        return item.statDate
      })
      const Ydata = data.map((item) => {
        return item.processedNum
      })
      const chart = echarts.init(this.$refs.chart)
      chart.setOption({
        title: {
          text: '处理数',
          subtext: '单位/件',
          textStyle: {
            color: '#4B4B4B', // 标题文字颜色
            fontSize: 14 // 标题文字大小
          }
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: '20%',
          left: '2%',
          bottom: '12%',
          right: '5%'
        },
        xAxis: {
          axisLine: {
            show: false,
            lineStyle: {
              color: 'transparent' // 设置 X 轴线条颜色为红色
            }
          },
          axisLabel: {
            textStyle: {
              color: '#BDBDBD' // 设置 X 轴刻度标签文字颜色为绿色
            }
          },
          data: Xdata
          // data: ['2021/12/11', '2021/12/12', '2021/12/13', '2021/12/14', '2023/12/15', '2021/12/15', '2023/12/17', '2021/12/18', '2021/12/19', '2021/12/20', '2021/12/21', '2023/12/22', '2021/12/23', '2021/12/24', '2021/12/25', '2021/12/26', '2021/12/27', '2021/12/28', '2021/12/29', '2022/12/30']
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: '#BDBDBD' // 设置刻度线颜色
            }
          }
        },
        series: [{
          name: '处理数',
          type: 'line',
          // data: [5, 20, 36, 10, 10, 5, 20, 36, 10, 10, 5, 20, 36, 10, 10, 5, 20, 36, 10, 10],
          data: Ydata,
          symbolSize: 6,
          itemStyle: {
            color: '#4CC09E'
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [{
                  offset: 0,
                  color: 'rgba(76,192,158,0.35)'
                },
                {
                  offset: 1,
                  color: 'rgba(76,192,158,0)'
                }
                ],
                false
              ),
              shadowColor: 'rgba(255, 214, 62, 0.10)',
              shadowBlur: 10
            }
          }
        }]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card-wrap {
  display: flex;
  gap: 20px;

  .card-item {
    flex: 1;
    display: flex;
    background-color: #F9FAFE;
    padding: 20px;

    .icon {
      height: 64px;
      width: 64px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }

    .con-wrap {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      margin-left: 16px;

      .num {
        &.blue{
          color: #36A4FF;
        }
        color: #4B4B4B;
        font-size: 16px;
        font-family: PingFangSC, PingFang SC;
      }

      .label {
        color: #8A8A8A;
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
      }
    }
  }
}
.m-t-20{
  margin-top: 20px;
}
.title {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  color: #4B4B4B;
  border-left: 4px solid #36A4FF;
  padding-left: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
