<template>
  <div ref="chartContainer" class="echart-container" style="width: 100%; height: 100%"></div>
</template>

<script setup lang="ts">
import { watch, onMounted, PropType, nextTick } from 'vue';
import * as echarts from 'echarts';
import 'echarts-wordcloud/dist/echarts-wordcloud';
import 'echarts-wordcloud/dist/echarts-wordcloud.min';
import { echartsSize, ECHARTS_RESPONSE_LIST, ECHARTS_COLOR } from '@/common';
import { useEChart } from 'hongluan-hooks';
import { useResponsiveChart } from 'fx-front-framework';
import { isEmpty } from 'lodash-es';

const { chartContainer, setChartOption, resizeChart } = useEChart();
const { updateOptionToResponsive } = useResponsiveChart();

const props = defineProps({
  chartsData: {
    type: Array as PropType<Array<{ name: string; value: number }>>,
    default: () => []
  }
});

watch(
  () => props.chartsData,
  (n, o) => {
    renderChart();
  }
);

const renderChart = () => {
  const option = {
    tooltip: {
      show: true
    },
    series: [
      {
        type: 'wordCloud',
        sizeRange: [15, echartsSize(200)],
        size: ['100%', '100%'],
        rotationRange: [0, 0],
        rotationStep: 45,
        gridSize: 110,
        shape: 'pentagon',
        width: '100%',
        height: '100%',
        textStyle: {
          color: (item: any) => {
            return ECHARTS_COLOR[item.dataIndex % 7];
          },
          fontFamily: 'sans-serif',
          fontWeight: 'normal',
          emphasis: {
            shadowBlur: 10,
            shadowColor: '#00ff00'
          }
        },
        data: props.chartsData
      }
    ]
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

defineExpose({
  resizeChart
});
</script>
