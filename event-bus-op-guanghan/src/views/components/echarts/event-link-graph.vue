<template>
  <div ref="chartContainer" class="echart-container"></div>
</template>

<script setup lang="ts">
import { watch, onMounted, PropType, nextTick } from 'vue';
import * as echarts from 'echarts';
import 'echarts-wordcloud/dist/echarts-wordcloud';
import 'echarts-wordcloud/dist/echarts-wordcloud.min';
import { echartsSize, ECHARTS_RESPONSE_LIST } from '@/common';
import { useEChart } from 'hongluan-hooks';
import { useResponsiveChart } from 'fx-front-framework';
import { isEmpty, throttle } from 'lodash-es';

const { chartContainer, setChartOption, resizeChart, addChartEvent, clearChart } = useEChart();
const { updateOptionToResponsive } = useResponsiveChart();

const emit = defineEmits(['clickGraph']);
const props = defineProps({
  chartsData: {
    type: Object,
    default: () => ({
      data: [],
      links: [],
      categories: [],
    })
  }
});

watch(
  () => props.chartsData,
  (n, o) => {
    !isEmpty(n) && renderChart();
  }
);

const renderChart = () => {
  clearChart();
  const option = {
    // backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
    //   offset: 0,
    //   color: '#f7f8fa'
    // }, {
    //   offset: 1,
    //   color: '#cdd0d5'
    // }]),
    backgroundColor: 'transparent',
    darkMode: true,
    // title: {
    //   text: '关系图谱',
    //   subtext: '事件-话题关系',
    //   top: 'top',
    //   left: 'center'
    // },
    tooltip: {
      formatter: param => {
        if (param.dataType === 'node') {
          return param.name;
        }
      },
      backgroundColor: 'rgba(42, 61, 80, 0.95)',
      borderColor: '#71b3f7',
      textStyle: {
        color: '#fff'
      }
    },
    // legend: [{
    //   formatter: function (name: string) {
    //     return echarts.format.truncateText(name, 240, '14px Microsoft Yahei', '…', {});
    //   },
    //   tooltip: {
    //     show: true
    //   },
    //   selectedMode: 'false',
    //   bottom: 20,
    //   data: props.chartsData.data.map(e => e.name)
    // }],
    toolbox: {
      show: false,
      feature: {
        dataView: { show: true, readOnly: true },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    animationDuration: 3000,
    animationEasingUpdate: 'quinticInOut',
    series: [{
      name: props.chartsData?.data[0]?.name,
      type: 'graph',
      layout: 'force',
      force: {
        repulsion: props.chartsData?.repulsion || 15000,
        friction: 0.4,
        layoutAnimation: true,
      },
      data: props.chartsData.data,
      links: props.chartsData.links,
      categories: props.chartsData.categories,
      focusNodeAdjacency: true,
      roam: true,
      label: {
        show: true,
        position: 'top',
        fontSize: 44,
      },
      lineStyle: {
        color: 'source',
        curveness: 0,
        type: 'solid'
      }
    }]
  };
  updateOptionToResponsive(option, ECHARTS_RESPONSE_LIST);
  setChartOption(option);
  const handle = throttle(data => {
    emit('clickGraph', data);
  }, 2000);
  addChartEvent('click', data => handle(data));
  nextTick(() => {
    resizeChart();
  });
};

onMounted(() => {
  // renderChart();
});
</script>
<style scoped>
.echart-container {
  width: 100%;
  height: 100%;
}
</style>
