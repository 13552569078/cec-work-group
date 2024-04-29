<template>
  <hl-group full style="height: calc(var(--xl) * 23;position:relative;">
    <hl-group v-for="(item, index) in weatherList" :key="index" dir="vertical" align="items-between items-center" class="border-right dashed">
      <!-- top -->
      <hl-group dir="vertical" align="items-center">
        <hl-group class="h1 m-b-md" align="items-center">{{ dateFormat(new Date(item.date), 'MM/dd') }}</hl-group>
        <hl-group class="font-16 m-b-md" align="items-center">{{ item.week }}</hl-group>
        <hl-group class="m-b-md" align="items-center">
          <img style="width: 48px" :src="getWeatherIcon(item.code_day, '', 'd')" />
        </hl-group>
        <hl-group class="m-b-sm" align="items-center">{{ item.text_day }}</hl-group>
        <hl-group class="m-b-sm" align="items-center">{{ item.wd_day }}</hl-group>
        <hl-group class="m-b-sm" align="items-center">{{ item.wc_day }}</hl-group>
      </hl-group>
      <!-- bottom -->
      <hl-group dir="vertical">
        <hl-group class="m-b-md" align="items-center">
          <img style="width: 48px" :src="getWeatherIcon(item.code_night, '', 'n')" />
        </hl-group>
        <hl-group class="m-b-sm" align="items-center">{{ item.text_night }}</hl-group>
        <hl-group class="m-b-sm" align="items-center">{{ item.wd_night }}</hl-group>
        <hl-group class="m-b-sm" align="items-center">{{ item.wc_night }}</hl-group>
      </hl-group>
    </hl-group>
  </hl-group>
  <div class="chart-box" ref="charDom"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useEChart } from 'hongluan-hooks';
import { IpostGetDailyFcstsSpace } from '@/apis/modules/weather/model';
import { apiWeatherObj } from '@/apis/modules/weather';
import { dateFormat } from '@/common/utils';
import useIcon from '../hooks/use-icon';
const { getWeatherIcon } = useIcon();
const { setChartOption, chartContainer } = useEChart();
const store = useStore();

const props = defineProps({
  long: {
    type: String
  },
  lat: {
    type: String
  }
});

watch(
  () => [props.long, props.lat],
  () => {
    getWeatherList();
  }
);

const charDom = chartContainer;
const weatherList = ref<IpostGetDailyFcstsSpace.Data[]>([]);

const getWeatherList = async() => {
  const params = {
    days: 7,
    lonlat: `${props.long},${props.lat}`
  };
  const res = await apiWeatherObj.postGetDailyFcsts(params.lonlat, params.days);
  weatherList.value = res.data || [];
  initChart();
};

const initChart = () => {
  const lowData = weatherList.value?.map(item => item.low);
  const highData = weatherList.value?.map(item => item.high);
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '7%',
      right: '7%'
    },
    xAxis: {
      show: false,
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      show: false,
      type: 'value',
      axisLabel: {
        formatter: '{value} °C'
      }
    },
    series: [
      {
        name: '最高气温',
        type: 'line',
        data: highData,
        color: '#0ED495',
        label: {
          show: true,
          formatter: '{c}°C'
        }
      },
      {
        name: '最低气温',
        type: 'line',
        data: lowData,
        color: '#02B4FE',
        label: {
          show: true,
          position: 'end',
          padding: [10, 0],
          formatter: '{c}°C'
        }
      }
    ]
  };
  setChartOption(option);
};

onMounted(() => {
  getWeatherList();
});
</script>

<style lang="scss" scoped>
.chart-box {
  width: 100%;
  height: 116px;
  position: absolute;
  top: 44%;
  left: 0;
}
</style>
