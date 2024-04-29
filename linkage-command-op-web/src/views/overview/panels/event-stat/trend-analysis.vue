<template>
  <div class="trend-analysis-tab h-full">
    <div class="display-flex items-between items-bottom">
      <span>单位：件</span>
      <div class="selectors-wrapper">
        <custom-select v-if="eventTypes.length > 0" :options="eventTypes" :default="selectedEventType" @change="getEventLevelVal"></custom-select>
        <custom-select :options="time" :default="selectedTime" @change="getTimeVal"></custom-select>
      </div>
    </div>
    <div class="chart-box" style="height:calc(100% - var(--xxs) * 7)">
      <fx-v-line-chart
        style="height:100%;"
        :grid="Grid"
        :legend="Legend"
        :series-data="lineSeriesData"
        :chart-data="lineChartData"
        :tooltip="LineTooltip"
        :x-axis="XAxis"
        :y-axis="YAxis"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useCurrentArea, useDataRefresher } from '@/hooks';
import { GlobalAPI } from '@/common';
import { apiEventStatisticsObj } from '@/apis/modules/event-statistics';
import CustomSelect from './select.vue';
import { LineTooltip, Legend, Grid, XAxis, YAxis } from './chart-config';

const { areaCode } = useCurrentArea();

const configEventTypes = GlobalAPI.config.NORMAL_MAP_CONFIG.eventStatistics.eventTypes || [];
const eventTypes = ref<Array<{label: string; value: string;}>>([...configEventTypes]);

const currentYear = new Date().getFullYear();
const time = [
  { value: `${currentYear - 2}`, label: `${currentYear - 2}` },
  { value: `${currentYear - 1}`, label: `${currentYear - 1}` },
  { value: `${currentYear}`, label: `${currentYear}` },
];
const selectedEventType = ref('all');
const selectedTime = ref(time[time.length - 1].value);
const eventTypeCodeList = ref<string[]>([]);

const lineChartData = ref<any[]>([]);

const lineSeriesData = [
  {
    label: '特别重大',
    key: '特别重大',
    itemStyle: { color: '#FD6161' },
    areaStyleColor: ['rgba(253,97,97,0.3)', 'rgba(5,94,146,0)'],
  },
  {
    label: '重大',
    key: '重大',
    itemStyle: { color: '#FD892F' },
    areaStyleColor: ['rgba(253,137,47,0.3)', 'rgba(5,94,146,0)'],
  },
  {
    label: '较大',
    key: '较大',
    itemStyle: { color: '#FFEA44' },
    areaStyleColor: ['rgba(255,234,68,0.3)', 'rgba(5,94,146,0)'],
  },
  {
    label: '一般',
    key: '一般',
    itemStyle: { color: '#00A3FF' },
    areaStyleColor: ['rgba(110,188,255,0.32)', 'rgba(5,94,146,0)'],
  },
  {
    label: '全部',
    key: '全部',
    itemStyle: { color: '#71F8FC' },
    areaStyleColor: ['rgba(211,211,211,0.39)', 'rgba(5,94,146,0)'],
  },
];

const getTopEventTypes = async() => {
  if (!configEventTypes.length) {
    const startStr = selectedTime.value + '-01-01 00:00:00';
    const endStr = selectedTime.value + '-12-31 23:59:59';
    const result = await apiEventStatisticsObj.postTopEventTypes({
      areaCode: areaCode.value,
      currentStartTime: startStr,
      currentEndTime: endStr,
    });
    eventTypes.value = result.data.map(d => ({
      label: d.eventTypeName,
      value: d.eventTypeCode
    }));
    eventTypes.value.unshift({ label: '全部', value: 'all' });
  }
};

const getEventLevelVal = (val: string) => {
  selectedEventType.value = val;
  getEventNumByDate();
};
const getTimeVal = (val: string) => {
  selectedTime.value = val;
  getEventNumByDate();
  getTopEventTypes();
};

const getEventNumByDate = async() => {
  const startStr = selectedTime.value + '-01-01 00:00:00';
  const endStr = selectedTime.value + '-12-31 23:59:59';

  if (selectedEventType.value === 'all') {
    eventTypeCodeList.value = eventTypes.value.filter(t => t.value !== 'all').map(t => t.value);
  } else {
    eventTypeCodeList.value = [selectedEventType.value];
  }
  const params = {
    areaCode: areaCode.value,
    eventTypeCodeList: eventTypeCodeList.value,
    currentStartTime: startStr,
    currentEndTime: endStr,
  };
  const result = await apiEventStatisticsObj.postStatEventNumByDate(params);
  lineChartData.value.length = 0;
  if (result.data.length && result.data[0].trend.length) {
    result.data[0].trend.forEach(t => {
      lineChartData.value.push({ xValue: t.label });
    });
    lineChartData.value.forEach((cd, idx) => {
      result.data.forEach(d => {
        lineChartData.value[idx][d.eventLevelName] = +d.trend[idx].num;
      });
    });
  }
};

watch(areaCode, () => {
  getEventNumByDate();
  getTopEventTypes();
}, {
  immediate: true,
});

useDataRefresher(() => getEventNumByDate());
</script>
<style lang="scss" scoped>
:deep(.echart-container){
  min-height: calc(var(--xxl) * 3) !important;
}
</style>
