<template>
  <hv-panel title="高频事件">
    <hl-scrollbar style="height: calc(var(--xl) * 7.65)">
      <hl-group dir="horizontal" gap="var(--md)" class="w-full">
        <scrolling-bar-chart
          :chart-data="chartData1"
          :show-precent="false"
          height="100%"
          title="接收量"
          :bar-style="{
            color: 'linear-gradient(90deg, #B8DDFF 0%, #76BEFF 100%)',
            width: '8px',
            background: 'rgba(61, 132, 211, 0.20)'
          }"
        />
        <scrolling-bar-chart
          :chart-data="chartData2"
          :show-precent="false"
          title="处置超时"
          height="100%"
          :bar-style="{
            color: 'linear-gradient(90deg, #B8DDFF 0%, #76BEFF 100%)',
            width: '8px',
            background: 'rgba(61, 132, 211, 0.20)'
          }"
        />
      </hl-group>
    </hl-scrollbar>
  </hv-panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ScrollingBarChart } from '@/views/components/echarts';
import { ScrollingBarChartData } from '@/types/echarts';
import { apiIndexPagePendingObj } from '@/apis';
import { useGlobalState } from '@/hooks';

const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    getData({ ...params, status: params.eventStatus });
  }
});

const chartData1 = ref<ScrollingBarChartData[]>([]);
const chartData2 = ref<ScrollingBarChartData[]>([]);

const getData = async (params: any) => {
  // 获取接受量
  const { data } = await apiIndexPagePendingObj.postReceiveStat(params);
  chartData1.value = data.map(item => {
    return {
      value: item.eventNum,
      label: item.eventTypeName
    };
  });
  // 获取超时处置
  const { data: dataTop } = await apiIndexPagePendingObj.postOverTimeStat(params);
  chartData2.value = dataTop.map(item => {
    return {
      value: item.overTimeNum,
      label: item.eventTypeName
    };
  });
};

getData(searchParams);
</script>
