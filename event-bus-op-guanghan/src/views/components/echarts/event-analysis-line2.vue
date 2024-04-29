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
import { composeEventHandlers } from 'hongluan-ui/es/utils';
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

const seriesItemStyle = {
  itemStyle: {
    borderRadius: [2, 2, 0, 0]
  },
  type: 'line',
  // stack: 'one'
};

const chartLegend = [
  {
    label: props.doneLabel,
    key: 'sendNum',
    type: 'line',
    sampling: 'average',
    width: 4,
    itemStyle: {
      color: '#70B2F7',
      borderWidth: 1,
      width: 4,
      borderColor: '#70B2F7'
    },
    symbol: 'none',
    // stack: 'a',
  },
  {
    label: props.unDoneLabel,
    key: 'receiveNum',
    type: 'line',
    sampling: 'average',
    width: 4,
    itemStyle: {
      color: '#FD892F',
      borderWidth: 1,
      width: 4,
      borderColor: '#FD892F'
    },
    symbol: 'none',
    // stack: 'a',
  }
];

const getSeriesData = () =>
  chartLegend.map(item => ({
    ...item,
    ...seriesItemStyle,
    itemStyle: item?.itemStyle ?? seriesItemStyle.itemStyle,
    name: item.label,
    data: props.chartData?.map((ele: any) => ele[item.key])
  }));

const renderChart = () => {
  const option = {
    title: {
      text: '发起事件数/件',
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
      itemHeight: 4,
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
<style scoped>
.echart-container {
  width: 100%;
  height: 100%;
}
</style>
