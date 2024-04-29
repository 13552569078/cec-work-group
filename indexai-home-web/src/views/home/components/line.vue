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
    default: () => ['2021', '2022', '2023', '2024']
  },
  yData: {
    type: Array as PropType<number[]>,
    default: () => [1, 5, 3, 1]
  },
  showMin: {
    type: Boolean,
    default: true
  },
  inverse: {
    type: Boolean,
    default: true
  },
  minValue: {
    type: Number,
    default: 1
  },
  axisTick: {
    type: Boolean,
    default: true
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
    color: ['rgba(255, 220, 2, 0.5)'],
    tooltip: {
      trigger: 'axis',
      confine: true,
      appendToBody: true,
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
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
      top: '5%',
      left: '4%',
      right: '4%',
      bottom: '1%',
      containLabel: true
    },
    xAxis: {
      axisLabel: {
        show: true,
        interval: 0,
        fontSize: 12,
        color: '#CBE9FF',
        lineHeight: 6,
        margin: 14,
        hideOverlap: true
      },
      axisTick: {
        show: props.axisTick
      },
      axisLine: {
        fontSize: 14,
        show: true,
        lineStyle: {
          color: '#607577'
        }
      },
      type: 'category',
      boundaryGap: false,
      data: props.xData
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false
      },
      minInterval: 1,
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
        lineHeight: 5,
        showMinLabel: props.showMin
      },
      min: props.minValue,
      inverse: props.inverse
    },
    series: [
      {
        data: props.yData,
        type: 'line',
        lineStyle: {
          width: 2,
          color: 'rgba(243, 255, 52, 1)'
        },
        showSymbol: false,
        areaStyle: {
          origin: props.inverse ? 'end' : 'start',
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 1,
              color: 'rgba(255, 220, 2, 0)'
            },
            {
              offset: 0,
              color: 'rgba(255, 220, 2, 0.5) '
            }
          ])
        }
      }
    ]
  }
  updateOptionToResponsive(option);
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
