<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <div class="inflow-type-chart display-flex items-middle items-between m-t-lg">
    <div ref="chartContainer" class="chart-wrap"></div>
    <hl-group dir="vertical" gap-y="calc(var(--xxs) * 6)" class="legend">
      <div v-for="item in chartData" :key="item.name" class="legend-item display-flex items-middle items-between">
        <div class="display-flex items-middle">
          <i :style="`background-color:${item.itemStyle.color}`"></i>
          <span class="name">{{item.name}}</span>
        </div>
        <div class="display-flex items-middle">
          <span class="value" :style="`color:${item.textColor}`">{{ item.value }}</span>
          <span class="unit">件</span>
        </div>
      </div>
    </hl-group>
  </div>
</template>
<script lang="ts" setup>
import { nextTick, onMounted, reactive } from 'vue';
import { useEChart } from 'hongluan-hooks';
import { useResponsiveChart } from 'fx-front-framework';
const props = defineProps({
  data: {
    type: Object,
    default: () => null
  }
});
const { chartContainer, setChartOption, resizeChart } = useEChart();
const { updateOptionToResponsive } = useResponsiveChart();
const chartData = reactive({
  eventNum: { value: 0, name: '接入事件', textColor: '#FFEF82', itemStyle: { color: '#FFEF82' } },
  selfHandleEventNum: { value: 0, name: '自处置事件', textColor: '#FFC120', itemStyle: { color: '#0BE1FD' } }
});
const renderChart = () => {
  chartData.eventNum.value = props.data?.eventNum || 0;
  chartData.selfHandleEventNum.value = props.data?.selfHandleEventNum || 0;
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: false
    },
    series: [
      {
        name: '流入类型',
        type: 'pie',
        radius: ['66%', '72%'],
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: false
          }
        },
        labelLine: {
          show: false
        },
        data: [chartData.eventNum, chartData.selfHandleEventNum]
      }
    ]
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
.inflow-type-chart {
  padding: 0 calc(var(--xxs) * 5);
}
.legend {
  width: calc(var(--xxs) * 50.5);
  color: #FFFFFF;
  .legend-item {
    position: relative;
    &::after {
      content: '';
      position: absolute;
      bottom: calc(var(--xxs) * 0.6);
      left: 0;
      width: 100%;
      height: calc(var(--xxs) * 2.5);
      background: rgba(221,242,255,0.15);
    }
  }
  i {
    margin-right: calc(var(--xxs) * 2);
    display: inline-block;
    width: calc(var(--xxs) * 3.5);
    height: calc(var(--xxs) * 3.5);
    border-radius: calc(var(--xxs) * 0.25);
  }
  .name {
    font-size: calc(var(--xxs) * 4);
  }
  .value {
    font-size: calc(var(--xxs) * 5);
    font-family: Impact;
    color: #FFEF82;
  }
  .unit {
    font-size: calc(var(--xxs) * 3.5);
  }
}
.chart-wrap {
  height: calc(var(--xxs) * 40);
  width: calc(var(--xxs) * 40);
  background-image: url('@/assets/images/eventCenter/pie-bg.png');
  background-size: auto 100%;
  background-position: left center;
  background-repeat: no-repeat;
}
</style>
