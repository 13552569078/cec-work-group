<template>
  <div ref="chartContainer" class="echart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, PropType, watch, nextTick } from 'vue';
import * as echarts from 'echarts';
import { echartsSize, ECHARTS_RESPONSE_LIST } from '@/common';
import { useEChart } from 'hongluan-hooks';
import { isEmpty } from 'lodash-es';
import { useResponsiveChart } from 'fx-front-framework';
import { IpostAssignedDestStatSpace } from '@/apis/modules/index-page-pending/model';
import { composeEventHandlers } from 'hongluan-ui/es/utils';

const props = defineProps({
  chartData: {
    type: Array as PropType<{ label: string, num: number }[]>,
    default: () => []
  },
  title: {
    type: String,
    default: '事件数/件'
  }
});

watch(
  () => props.chartData,
  (newVal, oldVal) => {
    !isEmpty(newVal) && renderChart();
  },
  {
    deep: true
  }
);

const { chartContainer, setChartOption } = useEChart();
const { updateOptionToResponsive } = useResponsiveChart();

const getMax = () => {
  const data1 = props.chartData.map(item => {
    return +item.num;
  });
  const max = Math.max(...data1);
  const len = data1.length;
  return new Array(len).fill(max);
};

const renderChart = () => {
  const option = {
    title: {
      text: props.title,
      left: '12',
      textStyle: {
        color: '#DDF2FF',
        fontSize: 38
      }
    },
    grid: {
      top: '10%',
      left: '0%',
      right: '0%',
      bottom: '0%',
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: [
      {
        axisLabel: {
          interval: 0,
          fontSize: 42,
          color: '#DDF2FF',
          lineHeight: 20,
          margin: 50,
          formatter: (params: string) => {
            return params.substr(0, 4);
          }
        },
        axisLine: {
          lineStyle: {
            color: '#2B394E'
          }
        },
        type: 'category',
        data: props.chartData.map(item => item.label)
      }, // 背景柱体，不显示数据在图表中，只显示背景色
      {
        type: 'category',
        show: false,
        data: getMax()
      }
    ],
    yAxis: [
      {
        position: 'left',
        splitNumber: 3,
        splitLine: {
          lineStyle: {
            type: 'solid',
            color: '#2B394E'
          }
        },
        axisTick: {
          show: true
        },
        // 整条y轴
        axisLine: {
          show: true,
          lineStyle: {
            color: '#2B394E'
          }
        },
        axisLabel: {
          fontSize: 42,
          color: '#DDF2FF',
          lineHeight: 20
        },
        type: 'value'
      }
    ],
    series: [
      {
        itemStyle: {
          borderRadius: [2, 2, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#FFEF82' // 起点颜色
          }, {
            offset: 1,
            color: 'rgba(255,218,75,0)' // 结束颜色
          }]),
        },
        barWidth: 40,
        type: 'bar',
        data: props.chartData.map((ele: any) => ele.num),
      },
      {
        xAxisIndex: 1,
        itemStyle: {
          show: false,
          color: 'red',
          opacity: 0 // 透明度
        },
        showBackground: true,
        data: getMax(), // 这个数据无所谓，反正不显示，只要data的长度和另外两个一样长就行了
        barWidth: '26%',
        backgroundStyle: {
          color: 'rgba(108, 128, 151, 0.20)'
        },
        z: 0,
        tooltip: {
          show: false,
          trigger: 'axis',
          type: 'none'
        },
        type: 'bar'
      }
    ]
  };
  updateOptionToResponsive(option, ECHARTS_RESPONSE_LIST);
  setChartOption(option);
};

onMounted(() => {
  nextTick(() => {
    renderChart();
  });
});
</script>
<style lang="scss" scoped>
.echart-container {
  height: 100%;
  width: calc(var(--xxs)* 400/4);
}
</style>
