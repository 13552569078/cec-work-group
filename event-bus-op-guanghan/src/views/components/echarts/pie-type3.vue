<template>
  <!-- <hl-group class="w-full">
    <div ref="chartContainer" class="echart-container"></div>
  </hl-group> -->
  <hl-group full="full-x" align="items-center" gap="var(--md)" class="w-full" style="position: relative">
    <div ref="chartContainer" class="echart-container static" style="width: 100%"></div>
    <div class="title-wrap" style="width: 100%; position: absolute; bottom: 0">
      <div class="title-con">
        <span class="title-value">{{ total }}</span>
        <span class="title-unit">{{ bottomUnit }}</span>
      </div>
      <div class="title-name standard-text">{{ title }}</div>
    </div>
    <div class="prencent">
      <span class="common-font-BQ">{{ percent }}</span
      ><span class="unit">{{ unit }}</span>
    </div>
  </hl-group>
</template>

<script setup lang="ts">
import { onMounted, nextTick, watch } from 'vue';
import * as echarts from 'echarts';
import { ECHARTS_RESPONSE_LIST } from '@/common';
import { useEChart } from 'hongluan-hooks';
import { useResponsiveChart } from 'fx-front-framework';

const props = defineProps({
  title: {
    type: String,
    default: '紧急事件'
  },
  unit: {
    type: String,
    default: '%'
  },
  total: {
    type: Number,
    default: 0
  },
  percent: {
    type: String,
    default: '0'
  },
  bottomUnit: {
    type: String,
    default: '件'
  },
  timer: {
    type: String,
    default: ''
  }
});

const { chartContainer, setChartOption, resizeChart, clearChart } = useEChart();
const { updateOptionToResponsive } = useResponsiveChart();

const renderChart = () => {
  const option = {
    series: [
      {
        name: 'Access From',
        type: 'pie',
        center: ['50%', '28%'],
        radius: ['36%', '40%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 1
        },
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: [
          {
            value: Math.floor(+props.percent),
            name: '',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 1,
                    color: 'rgba(110, 178, 239, 1)'
                  },
                  {
                    offset: 0,
                    color: 'rgba(183, 220, 255, 1)'
                  }
                ])
              }
            }
          },
          {
            name: '',
            itemStyle: {
              emphasis: {
                color: 'rgba(221, 242, 255, 0.1)'
              },
              normal: {
                color: 'rgba(221, 242, 255, 0.1)'
              }
            },
            value: 100 - Math.floor(+props.percent)
          }
        ]
      }
    ]
  };
  updateOptionToResponsive(option, ECHARTS_RESPONSE_LIST);
  clearChart();
  setChartOption(option);
  nextTick(() => {
    resizeChart();
  });
};

watch(
  () => props.timer,
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
</script>
<style lang="scss" scoped>
.echart-container {
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/echarts/pie-bg3.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 48% 50%;
  color: #ffffff;
}

.title-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: calc(var(--xl) * 2.3);
  .title-value {
    font-size: calc(var(--xl) * 0.88);
    font-weight: bold;
    font-family: AkzidenzGroteskBQ-Cnd, AkzidenzGroteskBQ;
  }
  .title-unit {
    font-size: calc(var(--xl) * 0.46);
  }
  .title-name {
    margin-top: calc(var(--xl) * 0.15);
    font-size: calc(var(--xl) * 0.48);
  }
}
.prencent {
  position: absolute;
  top: calc(var(--xl) * 1.24);
  text-align: center;
  font-size: calc(var(--xl) * 0.7);
  .unit {
    font-size: calc(var(--xl) * 0.46);
  }
}
.deliver {
  display: inline-block;
  width: calc(var(--xl) * 0.06);
  height: calc(var(--xl) * 0.48);
  background: linear-gradient(180deg, rgba(86, 109, 126, 0) 0%, #cfeaff 50%, rgba(43, 59, 72, 0) 100%);
}

.rank-icon {
  width: calc(var(--xl) * 0.91);
  height: calc(var(--xl) * 0.61);
  margin-right: calc(var(--xl) * 0.24);
}
.common-font-BQ {
  font-family: AkzidenzGroteskBQ-Cnd, AkzidenzGroteskBQ;
}
</style>
