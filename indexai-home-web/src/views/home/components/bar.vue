<template>
  <div class="ecahrts-wrap" ref="chartContainer"></div>
</template>

<script setup lang="ts">
import { watch, onMounted, ref, PropType } from 'vue'
import * as echarts from 'echarts'
import { useResponsiveChart } from "/@/hooks/ecahrts/use-responsive-chart"
import { useEChart } from "/@/hooks/ecahrts/use-echart"

const props = defineProps({
  xData: {
    type: Array as PropType<string[]>,
    default: () => ['北京', '上海', '南京', '武汉']
  },
  yData: {
    type: Array as PropType<number[]>,
    default: () => [11, 15, 3, 1]
  }
});

const { updateOptionToResponsive } = useResponsiveChart();
const { chartContainer, setChartOption, resizeChart } = useEChart();


watch(
  () => props.xData,
  () => {
    renderChart();
  },
  {
    deep: true
  }
);


const renderChart = () => {
  const option = {
    tooltip: {
      trigger: 'axis',
      confine: true,
      appendToBody: true,
      axisPointer: {
        type: 'none'
      },
      extraCssText: 'border-radius: 0;',
      formatter: (params: any) => `
          <div style="backgroundColor:#fff;borderRaduis:0">
            ${params[0].marker}
            <span style='font-size: 12px;'>${params[0].axisValue} <span style="margin-left: 30px">${params[0].value}</span></span>
          </div>
          `
    },
    grid: {
      top: '6%',
      left: '4%',
      right: '4%',
      bottom: '4%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        show: true,
        interval: 0,
        fontSize: 12,
        color: '#CBE9FF',
        lineHeight: 6,
        margin: 14,
        rotate: 45, //倾斜角度
        formatter: (params: string) => {
          let newParamsName = ''
          const paramsNameNumber = params.length
          const provideNumber = 4 // 一行显示几个字符
          const rowNumber = Math.ceil(paramsNameNumber / provideNumber)
          if (paramsNameNumber > provideNumber) {
            for (let p = 0; p < rowNumber; p++) {
              let tempStr = ''
              const start = p * provideNumber
              const end = start + provideNumber
              if (p === rowNumber - 1) {
                tempStr = params.substring(start, paramsNameNumber)
              } else {
                tempStr = params.substring(start, end) + '\n'
              }
              newParamsName += tempStr
            }
          } else {
            newParamsName = params
          }
          return newParamsName.substr(0, 5)
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#607577'
        }
      },
      data: props.xData
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false
      },
      axisTick: {
        show: true
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#607577'
        }
      },
      axisLabel: {
        fontSize: 10,
        color: '#CBE9FF',
        lineHeight: 5
      }
    },
    series: [
      {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(14, 200, 149, 1)' },
            { offset: 1, color: 'rgba(138, 248, 212, 0)' }
          ]),
          borderRadius: [2, 2, 0, 0]
        },
        barWidth: 8,
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(56,75,103,0.16)'
        },
        data: props.yData,
        type: 'bar'
      }
    ]
  }
  updateOptionToResponsive(option)
  setChartOption(option);
  nextTick(() => {
    resizeChart();
  });
}

onMounted(() => {
  renderChart();
})

</script>

<style lang="scss" scoped>
.ecahrts-wrap {
  height: 100%;
  width: 100%;
}
</style>
