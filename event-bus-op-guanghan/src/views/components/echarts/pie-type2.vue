<template>
  <hl-group full="full-x" align="items-center" gap="var(--md)" class="w-full" style="position: relative">
    <div ref="chartContainer" class="echart-container static" style="width: 36%"></div>
    <hl-group dir="vertical" align="items-center" gap="var(--xs)" class="static p-r-md m-t-sm" style="width: 60%">
      <hl-group v-for="(item, index) in chartsData" :key="index" gap="var(--sm)" align="items-middle"
        class="cursor-pointer static items-wrap w-full">
        <hl-group dir="vertical" class="w-full" v-if="span === 2">
          <hl-group align="items-middle">
            <img src="~@/assets/images/echarts/rank1.png" class="rank-icon" v-if="index === 0" />
            <img src="~@/assets/images/echarts/rank2.png" class="rank-icon" v-if="index === 1" />
            <img src="~@/assets/images/echarts/rank3.png" class="rank-icon" v-if="index === 2" />
            {{ item.platform }}
          </hl-group>
          <hl-group align="items-middle items-between item-value-wrap" class="w-full">
            <div class="rank-icon"></div>
            <hl-group align="items-between items-middle" class="w-full">
              <span>事件数 <span class="item-value"> {{ item.emergencyNum }}</span>件</span>

              <span></span>
              <span class="deliver m-l-md m-r-md"></span>
              <span>已超时 <span class="item-value-no"> {{ item.overTimeNum }}</span>件</span>
            </hl-group>
          </hl-group>
        </hl-group>
        <hl-group align="items-between" class="w-full" v-if="span === 1">
          <hl-group align="items-middle">
            <img src="~@/assets/images/echarts/rank1.png" class="rank-icon" v-if="index === 0" />
            <img src="~@/assets/images/echarts/rank2.png" class="rank-icon" v-if="index === 1" />
            <img src="~@/assets/images/echarts/rank3.png" class="rank-icon" v-if="index === 2" />
            {{ item.platform }}
          </hl-group>
          <span><span class="item-value"> {{ item.emergencyNum }}</span>件</span>
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
import { ECHARTS_RESPONSE_LIST } from '@/common';
import { useEChart } from 'hongluan-hooks';
import { useResponsiveChart } from 'fx-front-framework';

const props = defineProps({
  chartsData: {
    type: Array as PropType<Array<{ emergencyNum: number; overTimeNum?: number; platform: string }>>,
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
  // 跨列行数
  span: {
    type: Number,
    default: 2
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
        name: 'Access From',
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['65%', '75%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 1,
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
            value: Number(props.title.value),
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
  position: relative;
}

.items-wrap {
  background-image: url('@/assets/images/echarts/item-bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  height: calc(var(--xl) * 1.8);
  font-size: calc(var(--xl) * 0.48);

  .item-value-wrap {
    color: #b5cee3;
    font-size: calc(var(--xl) * 0.48);
    margin-top: calc(var(--xl) * 0.12);
  }

  .item-value {
    color: #b5cee3;
    font-weight: bold;
    font-size: calc(var(--xl) * 0.6);
    font-family: AkzidenzGroteskBQ-Cnd, AkzidenzGroteskBQ;
  }

  .item-value-no {
    color: #ff4b48;
    font-weight: bold;
    font-size: calc(var(--xl) * 0.6);
    font-family: AkzidenzGroteskBQ-Cnd, AkzidenzGroteskBQ;
  }
}

.title-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

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

.rank-icon {
  width: calc(var(--xl) * 0.91);
  height: calc(var(--xl) * 0.61);
  margin-right: calc(var(--xl) * 0.24);
}

.deliver {
  display: inline-block;
  width: calc(var(--xl) * 0.06);
  height: calc(var(--xl) * 0.48);
  background: linear-gradient(180deg, rgba(86, 109, 126, 0) 0%, #cfeaff 50%, rgba(43, 59, 72, 0) 100%);
}
</style>
