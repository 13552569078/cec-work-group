<template>
  <div class="graph-result-container">
    <div class="event-type">
      <div class="top">
        <div class="title">事件类型分布</div>
        <div class="switch">
          <el-radio-group v-model="eventTypeGraph" size="medium">
            <el-radio-button label="饼状图" />
            <el-radio-button label="柱状图" />
          </el-radio-group>
        </div>
      </div>
      <div class="bottom">
        <bar-chart
          v-if="eventTypeGraph === '柱状图' && Object.keys(eventTypeDataBar).length"
          :chart-data="eventTypeDataBar"
        />
        <pie-chart
          v-if="eventTypeGraph === '饼状图' && Object.keys(eventTypeDataPie).length"
          :chart-data="eventTypeDataPie"
        />
        <div v-if="eventTypeNoData">暂无数据</div>
      </div>
    </div>
    <div class="event-area">
      <div class="top">
        <div class="title">事件区域分布</div>
        <div class="switch">
          <el-radio-group v-model="eventAreaGraph" size="medium">
            <el-radio-button label="饼状图" />
            <el-radio-button label="柱状图" />
          </el-radio-group>
        </div>
      </div>
      <div class="bottom">
        <bar-chart
          v-if="eventAreaGraph === '柱状图' && Object.keys(eventAreaDataBar).length"
          :chart-data="eventAreaDataBar"
        />
        <pie-chart
          v-if="eventAreaGraph === '饼状图' && Object.keys(eventAreaDataPie).length"
          :chart-data="eventAreaDataPie"
        />
        <div v-if="eventAreaNoData">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/api/dispatch'
import barChart from '@/components/echarts/barChart.vue'
import pieChart from '@/components/echarts/pieChart.vue'
export default {
  components: {
    barChart,
    pieChart
  },
  data() {
    return {
      eventTypeGraph: '饼状图',
      eventAreaGraph: '柱状图',
      eventAreaNoData: true,
      eventAreaDataBar: {},
      eventAreaDataPie: {},
      eventTypeNoData: true,
      eventTypeDataBar: {},
      eventTypeDataPie: {}
    }
  },
  methods: {
    search(searchForm) {
      service.getGraphEventType(searchForm).then((res) => {
        this.eventTypeNoData = true
        if (!res.data.data) return
        const yAxisData = res.data.data.map((item) => item.eventTypeName)
        const xAxisData = res.data.data.map((item) => item.count)
        const pieData = res.data.data.map((item) => {
          return {
            name: item.eventTypeName,
            value: item.count
          }
        })
        this.eventTypeNoData = false
        this.eventTypeDataBar = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          title: {
            text: '单位: 件',
            right: 10,
            textStyle: {
              color: '#8A8A8A',
              fontSize: '12px'
            }
          },
          grid: {
            top: '3%',
            left: '3%',
            right: '2%',
            bottom: '2%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            axisLabel: {
              textStyle: {
                color: '#8A8A8A'
              }
            },
            splitLine: {
              lineStyle: {
                color: '#EDEDED',
                width: 1
              }
            }
          },
          yAxis: {
            type: 'category',
            data: yAxisData,
            axisLabel: {
              textStyle: {
                color: '#8A8A8A'
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false // 坐标轴刻度线
            }
          },
          series: [
            {
              name: '事件数',
              type: 'bar',
              data: xAxisData,
              barWidth: 12,
              barMaxWidth: 20,
              itemStyle: {
                normal: {
                  color: 'rgba(54, 164, 255, 0.35)',
                  borderColor: '#36A4FF',
                  borderType: 'solid'
                }
              },
              emphasis: {
                itemStyle: {
                  color: 'rgba(54, 164, 255, 0.65)', // hover时改变柱子颜色
                  borderColor: '#36A4FF',
                  borderType: 'solid'
                }
              }
            }
          ]
        }
        this.eventTypeDataPie = {
          tooltip: {
            trigger: 'item'
          },
          series: [
            {
              name: '事件数',
              type: 'pie',
              radius: ['46%', '60%'],
              avoidLabelOverlap: true,
              label: {
                show: true
              },
              emphasis: {
                label: {
                  show: true
                }
              },
              labelLine: {
                show: true,
                length: 80,
                length2: 40
              },
              data: pieData,
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    textStyle: {
                      color: '#8A8A8A'
                    }
                  }
                }
              }
            }
          ]
        }
      })
      service.getListEventType(searchForm).then((res) => {
        this.eventAreaNoData = true
        if (!res.data.data) return
        const yAxisData = res.data.data.map((item) => item.deptName)
        const xAxisData = res.data.data.map((item) => item.totalCount)
        const pieData = res.data.data.map((item) => {
          return {
            name: item.deptName,
            value: item.totalCount
          }
        })
        this.eventAreaNoData = false
        this.eventAreaDataBar = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          title: {
            text: '单位: 件',
            right: 10,
            textStyle: {
              color: '#8A8A8A',
              fontSize: '12px'
            }
          },
          grid: {
            top: '3%',
            left: '3%',
            right: '2%',
            bottom: '2%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            axisLabel: {
              textStyle: {
                color: '#8A8A8A'
              }
            },
            splitLine: {
              lineStyle: {
                color: '#EDEDED',
                width: 1
              }
            }
          },
          yAxis: {
            type: 'category',
            data: yAxisData,
            axisLabel: {
              textStyle: {
                color: '#8A8A8A'
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false // 坐标轴刻度线
            }
          },
          series: [
            {
              name: '事件数',
              type: 'bar',
              data: xAxisData,
              barMaxWidth: 20,
              barWidth: 12,
              itemStyle: {
                normal: {
                  color: 'rgba(54, 164, 255, 0.35)',
                  borderColor: '#36A4FF',
                  borderType: 'solid'
                }
              },
              emphasis: {
                itemStyle: {
                  color: 'rgba(54, 164, 255, 0.65)', // hover时改变柱子颜色
                  borderColor: '#36A4FF',
                  borderType: 'solid'
                }
              }
            }
          ]
        }
        this.eventAreaDataPie = {
          tooltip: {
            trigger: 'item'
          },
          series: [
            {
              name: '事件数',
              type: 'pie',
              radius: ['46%', '60%'],
              avoidLabelOverlap: true,
              label: {
                show: true
              },
              emphasis: {
                label: {
                  show: true
                }
              },
              labelLine: {
                show: true,
                length: 80,
                length2: 40
              },
              data: pieData,
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    textStyle: {
                      color: '#8A8A8A'
                    }
                  }
                }
              }
            }
          ]
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.graph-result-container {
  height: 100%;
  background-color: #f3f4fb;
  display: flex;
  .event-type {
    flex: 1;
    margin-right: 20px;
    background-color: #fff;
    padding: 20px;
  }
  .event-area {
    flex: 1;
    background-color: #fff;
    padding: 20px 0 20px 20px;
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    margin-bottom: 20px;
    .title {
      color: #313131;
      font-weight: bold;
      font-size: 14px;
    }
  }
  .bottom {
    height: calc(100% - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
