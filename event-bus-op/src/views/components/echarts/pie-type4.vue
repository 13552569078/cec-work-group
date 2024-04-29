<template>
  <hl-group full="full-x" align="items-center" gap="var(--md)" class="w-full" style="position: relative">
    <div ref="chartContainer" class="echart-container static" style="width: 36%"></div>
    <hl-group dir="vertical" align="items-top" gap="var(--md)" class="static p-r-md m-t-sm" style="width: 60%">
      <hl-group v-for="(item, index) in chartsData.slice(0, 2)" :key="index" gap="var(--sm)" align="items-middle" class="cursor-pointer static items-wrap w-full">
        <hl-group dir="vertical" class="w-full">
          <hl-group align="items-middle">
            <img src="~@/assets/images/echarts/rank1.png" class="rank-icon" v-if="index === 0" />
            <img src="~@/assets/images/echarts/rank2.png" class="rank-icon" v-if="index === 1" />
            <img src="~@/assets/images/echarts/rank3.png" class="rank-icon" v-if="index === 2" />
            <span class="rank-icon" v-if="![0, 1, 2].includes(index)"></span>
            {{ item.title }}
          </hl-group>
          <hl-group align="items-top items-between item-value-wrap" class="w-full">
            <div class="rank-icon"></div>
            <hl-group align="items-middle" class="w-full">
              <span>{{ item.eventTime }}</span>
              <span class="item-value m-l-md" v-if="item.overtimeFlag === 2"> 已超时</span>
              <span class="item-value-no m-l-md" v-if="item.overtimeFlag === 1"> 未超时</span>
            </hl-group>
          </hl-group>
        </hl-group>
      </hl-group>
    </hl-group>
    <div class="title-wrap" style="width: 38%; height: 100%; position: absolute; left: 0">
      <div class="title-con">
        <span class="title-value">{{ title.value }}</span>
        <span class="title-unit">{{ title.unit }}</span>
      </div>
      <div class="title-name">{{ title.name }}</div>
    </div>
  </hl-group>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, PropType, watch } from 'vue';
import * as echarts from 'echarts';
import { echartsSize, ECHARTS_RESPONSE_LIST } from '@/common';
import { useEChart } from 'hongluan-hooks';
import { useResponsiveChart } from 'fx-front-framework';
import { cloneDeep } from 'lodash-es';
import { composeEventHandlers } from 'hongluan-ui/es/utils';

const props = defineProps({
  chartsData: {
    type: Array as PropType<Array<{ title: string; eventTime?: string; overtimeFlag: number }>>,
    default: () => []
  },
  title: {
    type: Object as PropType<{ value: number; unit: string; name: string }>,
    default: () => {
      return {
        value: 333,
        unit: '%',
        name: '紧急事件'
      };
    }
  },
  radius: {
    type: Array as PropType<string[]>,
    default: () => ['20%', '70%']
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  widths: {
    type: Array as PropType<string[]>,
    default: () => ['20%', '40%']
  }
});

const { chartContainer, setChartOption, resizeChart, clearChart } = useEChart();
const { updateOptionToResponsive } = useResponsiveChart();

const renderChart = () => {
  const option = {
    series: [
      {
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['65%', '75%'],
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
            value: +props.title.value,
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
            value: (100 - Number(props.title.value)).toFixed(0)
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
  () => props.title.value,
  () => {
    renderChart();
  },
  {
    deep: true,
    immediate: true
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
  background-image: url('@/assets/images/echarts/pie-bg2.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 48% 50%;
  color: #ffffff;
}
.items-wrap {
  background-image: url('@/assets/images/echarts/item-bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  height: calc(var(--xl) * 1.84);
  font-size: calc(var(--xl) * 0.48);
  .item-value-wrap {
    color: #b5cee3;
    margin-top: calc(var(--xl) * 0.12);
  }
  .item-value {
    color: #ff4b48;
  }
  .item-value-no {
    color: #19ecad;
  }
}

.title-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .title-value {
    font-family: AkzidenzGroteskBQ-Cnd, AkzidenzGroteskBQ;
    font-size: calc(var(--xl) * 0.88);
    font-weight: bold;
  }
  .title-unit {
    font-size: calc(var(--xl) * 0.46);
  }
  .title-name {
    margin-top: calc(var(--xl) * 0.15);
    font-size: calc(var(--xl) * 0.48);
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
</style>
