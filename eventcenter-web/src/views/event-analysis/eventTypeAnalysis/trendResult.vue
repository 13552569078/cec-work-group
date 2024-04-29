<template>
  <div class="trend-result-container">
    <div class="event-type">
      <line-chart v-if="!eventTypeNoData" :chart-data="eventTypeData" />
      <div v-else>暂无数据</div>
    </div>
    <div class="event-area">
      <line-chart v-if="!eventAreaNoData" :chart-data="eventAreaData" />
      <div v-else>暂无数据</div>
    </div>
  </div>
</template>

<script>
import service from '@/api/dispatch'
import lineChart from '@/components/echarts/lineChart.vue'
export default {
  components: {
    lineChart
  },
  data() {
    return {
      eventAreaNoData: true,
      eventAreaData: {},
      eventTypeNoData: true,
      eventTypeData: {}
    }
  },
  methods: {
    search(searchForm) {
      service.getTrendEventType(searchForm).then((res) => {
        this.eventTypeNoData = true
        if (res.code !== 200) {
          this.$message({
            type: 'error',
            message: res.message || '服务器错误'
          })
          return
        }
        if (!res.data || !res.data.data || !res.data.data.length) return
        const xAxisData = res.data.data[0].data.map((item) => item.days)
        const legendData = res.data.data.map((item) => item.eventTypeName)
        const selectedData = {}
        const notSelectedArr = legendData.slice(
          Math.floor(legendData.length / 2)
        )
        notSelectedArr.forEach((i) => (selectedData[i] = false))
        const seriesData = res.data.data.map((item) => {
          return {
            name: item.eventTypeName,
            type: 'line',
            data: item.data.map((i) => i.count)
          }
        })
        this.eventTypeNoData = false
        this.eventTypeData = {
          color: [
            '#41D2D9',
            '#91D737',
            '#FFAD26',
            '#547799',
            '#36A4FF',
            '#4875F0',
            '#80A2FF',
            '#FF7773',
            '#6BB39B',
            '#E59167',
            '#F296C3',
            '#6E52EA',
            '#80C0FF',
            '#987CCE',
            '#4A9CC1',
            '#F5DA20',
            '#d4cffd',
            '#dc91bfd1'
          ],
          tooltip: {
            trigger: 'axis'
          },
          title: {
            text: '事件类型趋势图',
            textStyle: {
              fontSize: '14px'
            }
          },
          legend: {
            data: legendData,
            right: 0,
            selected: selectedData
          },
          grid: {
            left: '2%',
            right: '4%',
            bottom: '2%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData
          },
          yAxis: {
            type: 'value',
            name: '单位: 件',
            nameTextStyle: {
              padding: [0, 0, 0, 10]
            }
          },
          series: seriesData
        }
      })
      service.getTrendEventTypeArea(searchForm).then((res) => {
        this.eventAreaNoData = true
        if (res.code !== 200) {
          this.$message({
            type: 'error',
            message: res.message || '服务器错误'
          })
        }
        if (!res.data || !res.data.data || !res.data.data.length) return
        const xAxisData = res.data.data[0].data.map((item) => item.days)
        const legendData = res.data.data.map((item) => item.deptName)
        const seriesData = res.data.data.map((item) => {
          return {
            name: item.deptName,
            type: 'line',
            data: item.data.map((i) => i.count)
          }
        })
        this.eventAreaNoData = false
        // 根据值的不同，生产不同的颜色
        const color = legendData.map(_c => {
          return '#' + Math.floor(Math.random() * (256 * 256 * 256 - 1)).toString(16)
        })
        this.eventAreaData = {
          color,
          tooltip: {
            trigger: 'axis'
          },
          title: {
            text: '区域趋势图',
            textStyle: {
              fontSize: '14px'
            }
          },
          legend: {
            data: legendData,
            right: 0,
            left: '100px',
            selected: {}
          },
          grid: {
            left: '4%',
            top: '80px',
            right: '4%',
            bottom: '2%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData
          },
          yAxis: {
            type: 'value',
            name: '单位: 件',
            nameTextStyle: {
              padding: [0, 0, 0, 10]
            }
          },
          series: seriesData
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.trend-result-container {
  height: 100%;
  background-color: #f3f4fb;
  display: flex;
  flex-direction: column;
  margin: 0 -20px;
  .event-type {
    margin-bottom: 20px;
    border-top: 1px solid #ededed;
  }
  .event-type,
  .event-area {
    flex: 1;
    background-color: #fff;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
