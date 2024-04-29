<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <div ref="chartContainer" class="w-full"></div>
</template>
<script lang="ts" setup>
import { nextTick, onMounted } from 'vue';
import { useEChart } from 'hongluan-hooks';
import { useResponsiveChart } from 'fx-front-framework';
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
});
const { chartContainer, setChartOption, resizeChart } = useEChart();
const { updateOptionToResponsive } = useResponsiveChart();
const renderChart = () => {
  const data = Array.isArray(props.data) && props.data.length > 0 ? props.data : [];
  const xData: string[] = [];
  const yData: number[] = [];
  data.forEach((d:any) => {
    xData.push(d.date);
    yData.push(d.num);
  });
  const option = {
    title: {
      text: '事件数/件',
      left: '30',
      textStyle: {
        color: '#CCF2FF',
        fontSize: 42
      }
    },
    grid: {
      top: '15%',
      left: '0%',
      right: '0%',
      bottom: '0%',
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      // boundaryGap: false,
      axisLabel: {
        interval: 0,
        fontSize: 40,
        color: '#DDF2FF',
        lineHeight: 40,
      },
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          width: 2,
          color: 'rgba(221,242,255,0.2)'
        }
      },
      type: 'category',
      data: xData,
    },
    yAxis: [
      {
        position: 'left',
        splitNumber: 3,
        splitLine: {
          lineStyle: {
            type: 'solid',
            width: 2,
            color: 'rgba(221,242,255,0.2)'
          }
        },
        axisTick: {
          show: false
        },
        // 整条y轴
        axisLine: {
          show: true,
          lineStyle: {
            width: 2,
            color: 'rgba(221,242,255,0.2)'
          }
        },
        axisLabel: {
          fontSize: 40,
          fontWeight: 'bold',
          color: '#DDF2FF'
        },
        type: 'value'
      }
    ],
    color: ['#70B2F7'],
    series: [{
      data: yData,
      type: 'line',
      smooth: false,
      symbol: 'emptyCircle',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [ // 渐变颜色
            {
              offset: 0.1,
              color: 'rgba(112,178,247,0.4)',
            },
            {
              offset: 1,
              color: 'rgba(112,178,247,0)',
            },
          ],
          global: false,
        },
      }
    }]
  };
  updateOptionToResponsive(option);
  setChartOption(option);
  nextTick(() => {
    resizeChart();
  });
};
onMounted(() => {
  renderChart();
});
</script>
<style scoped lang="scss">
</style>
