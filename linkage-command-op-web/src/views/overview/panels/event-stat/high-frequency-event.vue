<template>
  <div class="high-frequency-event-tab h-full">
    <div class="display-flex items-between items-bottom">
      <span>单位：件</span>
      <custom-select :options="options" :default="selectedTime" @change="getTimeVal" />
    </div>
    <div class="chart-box" style="height:calc(100% - var(--xxs) * 7)">
      <fx-v-stacked-bar-chart
        style="height:100%"
        :grid="Grid"
        :legend="legendData"
        :chart-data="barChartData"
        :legendReal="Legend"
        :tooltip="LineTooltip"
        :x-axis="xAxis"
        :y-axis="YAxis"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import dayjs from 'dayjs';
import { useCurrentArea, useDataRefresher } from '@/hooks';
import { DATE_FORMAT, GlobalAPI, TIME_END_STR, TIME_START_STR } from '@/common';
import { apiEventStatisticsObj } from '@/apis/modules/event-statistics';
import CustomSelect from './select.vue';
import { LineTooltip, Legend, Grid, YAxis } from './chart-config';

const { areaCode } = useCurrentArea();

const eventTypeCodeList = ref<string[]>([]);
const selectedTime = ref<number>(GlobalAPI.config.NORMAL_MAP_CONFIG.eventStatistics.timeFilter[0].value);
const options = ref(GlobalAPI.config.NORMAL_MAP_CONFIG.eventStatistics.timeFilter);
const barChartData = ref<any[]>([]);

const xAxis = {
  type: 'category',
  boundaryGap: true,
  axisLabel: {
    color: '#CBE9FF',
    fontSize: 14,
    formatter: (value: string) => value.length > 4 ? value.substring(0, 4) + '...' : value
  },
};
const legendData = ref([
  {
    label: '特别重大',
    key: 'level1',
    barWidth: 22,
    itemStyle: { color: '#FF4A4A' },
  },
  {
    label: '重大',
    key: 'level2',
    barWidth: 22,
    itemStyle: {
      color: '#FDA02F',
    },
  },
  {
    label: '较大',
    key: 'level3',
    barWidth: 22,
    itemStyle: {
      color: '#FFE72A',
    },
  },
  {
    label: '一般',
    key: 'level4',
    barWidth: 22,
    itemStyle: {
      color: '#00A3FF',
    },
  },
]);

const getTimeVal = (val: number) => {
  selectedTime.value = val;
  getEventNumByType();
};
const getEventNumByType = async() => {
  const params = {
    areaCode: areaCode.value,
    eventTypeCodeList: eventTypeCodeList.value,
    currentStartTime: dayjs(Date.now()).add(selectedTime.value, 'day').format(DATE_FORMAT) + TIME_START_STR,
    currentEndTime: dayjs(Date.now()).format(DATE_FORMAT) + TIME_END_STR,
  };
  const result = await apiEventStatisticsObj.postStatEventNumByType(params);

  barChartData.value.length = 0;
  if (result.data.length) {
    result.data.forEach((t, index) => {
      barChartData.value.push({
        xValue: t.eventTypeName,
        ...t
      });
    });
  }
};

watch(areaCode, () => {
  getEventNumByType();
}, {
  immediate: true,
});

useDataRefresher(() => getEventNumByType());
</script>
<style lang="scss" scoped>
:deep(.echart-container){
  min-height: calc(var(--xxl) * 3) !important;
}
</style>
