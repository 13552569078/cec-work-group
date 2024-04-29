<template>
  <div class="my-3 h-1/4 bg-[#062F4F]">
    <div ref="chartRef" :style="{ height, width }" v-if="hasChart"></div>
    <div v-else :style="{ height, width }">
      <Empty type="2" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, PropType, Ref, ref, watch } from 'vue'
import { useECharts } from '/@/hooks/web/useECharts'

import { isEmpty } from '/@/utils/is/index'
import { default as cloneDeep } from 'lodash/cloneDeep'

import lineChart from './linechart'
import lineY2Chart from './liney2-chart'
import barLineChart from './bar-line-chart'
import barChart from './barchart'
import pieChart from './piechart'

const chartOption = {
  lineChart: lineChart,
  lineY2Chart: lineY2Chart,
  barLineChart: barLineChart,
  barChart: barChart,
  pieChart: pieChart
}
export default defineComponent({
  props: {
    width: {
      type: String as PropType<string>,
      default: '100%'
    },
    height: {
      type: String as PropType<string>,
      default: '350px'
    },
    option: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const chartRef = ref<HTMLDivElement | null>(null)
    const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>, 'dark')
    const hasChart = ref(true)
    onMounted(() => {
      initChart()
    })

    const transferChartData = (option: Object) => {
      let chartData = cloneDeep(chartOption[option.type])
      console.log(option.title, 'tilte')

      chartData.title.text = option.title || ''
      if (option.type === 'pieChart') {
        chartData.series[0].data = option.series
        chartData.series[1].data = option.series
        chartData.legend.data = option.series.map((value) => value.name)
      } else {
        chartData.series = option.series || []
      }
      option.xAxis && (chartData.xAxis.data = option.xAxis)
      option.legend && (chartData.legend.data = option.legend)

      if (option.y2Name) {
        chartData.yAxis[0].name = option.yName
        chartData.yAxis[1].name = option.y2Name
      } else {
        option.yName && (chartData.yAxis.name = option.yName)
      }
      return chartData
    }
    const initChart = () => {
      const optionData = transferChartData(props.option)
      if (isEmpty(optionData)) {
        hasChart.value = false
      } else {
        hasChart.value = true
        setOptions(optionData)
      }
    }
    watch(
      () => props.option,
      () => initChart(),
      {
        deep: true
      }
    )
    return { chartRef, hasChart }
  }
})
</script>
