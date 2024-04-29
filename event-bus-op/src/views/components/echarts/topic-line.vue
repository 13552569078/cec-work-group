<template>
  <div ref="chartContainer" class="echart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, PropType, watch } from 'vue';
import { isEmpty } from 'lodash-es';
import { useEChart } from 'hongluan-hooks';
import { useResponsiveChart } from 'fx-front-framework';
import { echartsSize, ECHARTS_RESPONSE_LIST, ECHARTS_COLOR } from '@/common';
import { IpostTopicTrendSpace } from '@/apis/modules/event-analysis/model';

const props = defineProps({
  chartData: {
    type: Object as PropType<IpostTopicTrendSpace.Data>,
    default: () => {
      return {};
    }
  }
});

const { chartContainer, setChartOption, resizeChart, clearChart } = useEChart();
const { updateOptionToResponsive } = useResponsiveChart();

const legend = ref<IpostTopicTrendSpace.TopicNameTop5List[]>([]);
const xData = ref<string[]>([]);

const getSeries = () => {
  let list: any[] = [];
  const legends = props.chartData.topicNameTop5List;
  for (const item of props.chartData.topicTrendList) {
    list = [...list, ...item.topicCountTop5List];
  }
  return legends.map(item => {
    return {
      symbolSize: 0,
      lineStyle: {
        width: echartsSize(20)
      },
      name: item,
      data: list
        .filter(item2 => {
          return item2.topicName === item;
        })
        .map(item3 => {
          return item3.topicNum;
        }),
      type: 'line'
    };
  });
};

const renderChart = () => {
  if (isEmpty(props.chartData)) return false;
  legend.value = props.chartData.topicNameTop5List;
  xData.value = isEmpty(props.chartData.topicNameTop5List)
    ? []
    : props.chartData.topicTrendList.map((item: IpostTopicTrendSpace.TopicTrendList) => {
      return item.time;
    });
  const option = {
    title: {
      text: '话题数/件',
      left: 'left',
      textStyle: {
        color: '#ffffff',
        fontSize: 44
      }
    },
    color: ECHARTS_COLOR,
    grid: {
      top: '32',
      left: '0%',
      right: '0%',
      bottom: '0%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none'
      },
      extraCssText: 'border-radius: 0;'
    },
    legend: {
      data: legend.value,
      width: 1400,
      type: 'scroll',
      icon: 'rect',
      top: '0%',
      right: '3%',
      itemWidth: 32,
      itemHeight: 8,
      itemGap: 88,
      pageIconColor: '#71b3f7',
      pageIconInactiveColor: '#aaaaaa',
      textStyle: {
        fontSize: 44,
        color: '#ffffff'
      },
      pageTextStyle: {
        // 图例页信息的文字样式。
        color: '#ffffff'
      }
    },
    xAxis: {
      axisLabel: {
        interval: 0,
        fontSize: 42,
        color: '#ffffff',
        lineHeight: 20,
        margin: 50
      },
      axisLine: {
        lineStyle: {
          color: '#2B394E'
        }
      },
      type: 'category',
      data: xData.value
    },
    yAxis: {
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
    },
    series: getSeries()
  };
  updateOptionToResponsive(option, ECHARTS_RESPONSE_LIST);
  clearChart();
  setChartOption(option);
  nextTick(() => {
    resizeChart();
  });
};

watch(
  () => props.chartData,
  () => {
    renderChart();
  },
  {
    deep: true
  }
);

onMounted(() => {
  renderChart();
});

defineExpose({
  renderChart
});
</script>
<style>
.echart-container {
  width: 100%;
  height: 100%;
}
</style>
