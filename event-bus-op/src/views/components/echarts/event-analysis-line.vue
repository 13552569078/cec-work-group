<template>
  <div ref="chartContainer" class="echart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, PropType, watch } from 'vue';
import * as echarts from 'echarts';
import { echartsSize, ECHARTS_RESPONSE_LIST } from '@/common';
import { isEmpty } from 'lodash-es';
import { useEChart } from 'hongluan-hooks';
import { useResponsiveChart } from 'fx-front-framework';
import { IgetEventNumAnalysisSpace } from '@/apis/modules/index-page/model';

const props = defineProps({
  chartData: {
    type: Array as PropType<IgetEventNumAnalysisSpace.Data[]>,
    default: () => [
    ]
  },
  title: {
    type: String,
    default: '事件数/件'
  },
  doneLabel: {
    type: String,
    default: '发起量'
  },
  unDoneLabel: {
    type: String,
    default: '接收量'
  }
});
const chartLegend = [
  {
    label: '事件数',
    key: 'totalNum',
    type: 'line',
    symbol: 'circle',
    symbolSize: 10,
    sampling: 'average',
    itemStyle: {
      color: '#fff',
      borderWidth: 1,
      borderColor: '#fff'
    },
    stack: 'a',
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: ' rgba(255,255,255,0.4)'
        },
        {
          offset: 1,
          color: 'rgba(255,255,255,0) '
        }
      ])
    }
  }
];

watch(
  () => props.chartData,
  (newVal, oldVal) => {
    !isEmpty(newVal) && renderChart();
  },
  {
    deep: true
  }
);

const { chartContainer, setChartOption, resizeChart } = useEChart();
const { updateOptionToResponsive } = useResponsiveChart();

const getSeriesData = () =>
  chartLegend.map(item => ({
    ...item,
    name: item.label,
    data: props.chartData?.map((ele: any) => ele[item.key])
  }));

const renderChart = () => {
  const option = {
    title: {
      text: '事件数',
      left: 'left',
      textStyle: {
        color: '#ffffff',
        fontSize: 44
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
    legend: {
      data: chartLegend.map(item => item.label),
      top: '3%',
      right: '3%',
      itemWidth: 26,
      itemHeight: 26,
      itemGap: 80,
      textStyle: {
        fontSize: 44,
        color: '#A1A5B7'
      }
    },
    xAxis: {
      axisLabel: {
        interval: 0,
        fontSize: 42,
        color: '#ffffff',
        lineHeight: 20,
        margin: 50,
        rotate: props.chartData?.length > 5 ? 30 : 0
      },
      axisLine: {
        lineStyle: {
          color: '#2B394E'
        }
      },
      type: 'category',
      data: props.chartData?.map(item => item.time)
    },
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
          color: '#ffffff',
          lineHeight: 20
        },
        type: 'value'
      }
    ],
    series: [...getSeriesData()]
  };
  updateOptionToResponsive(option, ECHARTS_RESPONSE_LIST);
  setChartOption(option);
  nextTick(() => {
    resizeChart();
  });
};

onMounted(() => {
  renderChart();
});
</script>
<style>
.echart-container {
  width: 100%;
  height: 100%;
}
</style>
