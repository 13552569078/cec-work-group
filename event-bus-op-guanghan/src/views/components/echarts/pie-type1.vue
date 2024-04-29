<template>
  <hl-group full="full-x" align="items-center" gap="var(--md)" class="w-full" style="position: relative">
    <hl-row align="items-middle">
      <hl-col span="col" style="position: relative">
        <div ref="chartContainer" class="echart-container static"></div>
        <div class="echarts-bg" v-if="showBackground"></div>
      </hl-col>
      <hl-col span="col">
        <hl-scrollbar style="height: calc(var(--xl) * 6)" v-if="chartsData.length > 4">
          <hl-group dir="vertical" align="items-center" gap="var(--md)" class="static p-r-md w-100">
            <hl-group v-for="(item, index) in chartsData" :key="index" gap="var(--sm)" align="items-middle"
              class="cursor-pointer static" :style="`opacity:${item?.isHide ? 0.2 : 1}`" @click="hideSerie(item)">
              <span class="fill-rect static" :style="`background-color:${item.color}`"></span>
              <span class="font-md w-full standard-text">{{ item.name }}</span>
              <h3 class="value-wrap font-din static" :style="`color:${item?.color}`">
                <span class="value font-bin">{{ item.value }}</span>
                <span class="value-unit">{{ item.unit }}</span>
                <!-- <span class="value value-percent">22</span>
            <span class="value-unit">%</span> -->
              </h3>
            </hl-group>
          </hl-group>
        </hl-scrollbar>
        <hl-group dir="vertical" align="items-center" gap="var(--md)" class="static p-r-md w-100" v-else>
          <hl-group v-for="(item, index) in chartsData" :key="index" gap="var(--sm)" align="items-middle"
            class="cursor-pointer static" :style="`opacity:${item?.isHide ? 0.2 : 1}`" @click="hideSerie(item)">
            <span class="fill-rect static" :style="`background-color:${item.color}`"></span>
            <span class="font-md w-full standard-text">{{ item.name }}</span>
            <h3 class="value-wrap font-din static" :style="`color:${item?.color}`">
              <span class="value font-bin">{{ item.value }}</span>
              <span class="value-unit">{{ item.unit }}</span>
              <!-- <span class="value value-percent">22</span>
            <span class="value-unit">%</span> -->
            </h3>
          </hl-group>
        </hl-group>
      </hl-col>
    </hl-row>
    <div class="title-wrap" style="width: 50%; height: 100%; position: absolute; left: 0">
      <div class="title-con m-t-xs">
        <span class="title-value font-bin">{{ total }}</span>
        <span class="title-unit">{{ unit }}</span>
      </div>
      <div class="title-name standard-text">{{ title }}</div>
    </div>
  </hl-group>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, PropType, watch } from 'vue';
import * as echarts from 'echarts';
import { ECHARTS_RESPONSE_LIST } from '@/common';
import { useEChart } from 'hongluan-hooks';
import { useResponsiveChart } from 'fx-front-framework';
import { cloneDeep } from 'lodash-es';

const props = defineProps({
  chartsData: {
    type: Array as PropType<Array<{ name: string; value: number; color: string; isHide: boolean; originValue: number; unit: string }>>,
    default: () => []
  },
  unit: {
    type: String,
    default: '%'
  },
  total: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    default: '事件总数'
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
  },
  showBackground: {
    type: Boolean,
    default: true
  },
});

const { chartContainer, setChartOption, resizeChart, clearChart } = useEChart();
const { updateOptionToResponsive } = useResponsiveChart();

const renderChart = () => {
  const option = {
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        center: ['49.5%', '50%'],
        radius: ['75%', '85%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 1,
          borderColor: '#000000',
          borderWidth: 1
        },
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: props.chartsData.filter(item => {
          return !item.isHide;
        })
        // data: chartsData.value
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

const hideSerie = (item: ChartItem) => {
  item.isHide = !item?.isHide;
  nextTick(() => {
    renderChart();
  });
};

watch(
  () => props.chartsData,
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

interface ChartItem {
  name: string;
  value: number;
  isHide?: boolean;
  labelLine?: {
    show: boolean;
    lineStyle: {
      color: string;
    };
  };
  itemStyle?: { color: string };
}
</script>
<style lang="scss" scoped>
.echart-container {
  width: 100%;
  height: 100%;
  position: relative;
  // background-image: url('@/assets/images/echarts/pie-bg1.png');
  // background-repeat: no-repeat;
  // background-size: contain;
  // background-position: 48% 50%;
  color: #ffffff;
  z-index: 2;
}

.echarts-bg {
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/echarts/pie-bg.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
  position: absolute;
  z-index: -1;
  top: calc(var(--xl) * 1);
}

.fill-rect {
  display: inline-block;
  width: calc(var(--xl) * 0.3);
  height: calc(var(--xl) * 0.3);
}

.value-wrap {
  font-size: calc(var(--xl) * 0.52);
}

.value-unit {
  font-size: calc(var(--xl) * 0.48);
  color: #ffffff !important;
}

.value {
  font-size: calc(var(--xl) * 0.66);
  // font-family: AkzidenzGroteskBQ-Cnd, AkzidenzGroteskBQ;
}

.value-percent {
  margin-left: calc(var(--xl) * 0.8);
  // font-family: AkzidenzGroteskBQ-Cnd, AkzidenzGroteskBQ;
}

.title-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #ffffff;

  .title-value {
    font-size: calc(var(--xl) * 0.86);
    font-weight: bold;
    // font-family: AkzidenzGroteskBQ-Cnd, AkzidenzGroteskBQ;
  }

  .title-unit {
    font-size: calc(var(--xl) * 0.52);
  }

  .title-name {
    margin-top: calc(var(--xl) * 0.15);
    font-size: calc(var(--xl) * 0.52);
  }
}
</style>
