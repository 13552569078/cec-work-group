<template>
  <hv-panel title="事件类型分布">
    <hl-scrollbar style="height: calc(var(--xl) * 7.65)">
      <hl-group dir="horizontal" gap="var(--md)" class="w-full">
        <scrolling-bar-chart
          :chart-data="chartData1"
          :show-precent="false"
          height="100%"
          title="发起量"
          :bar-style="{
            color: 'linear-gradient(90deg, #B8DDFF 0%, #76BEFF 100%)',
            width: '8px',
            background: 'rgba(61, 132, 211, 0.20)',
          }"
        />
        <scrolling-bar-chart
          :chart-data="chartData2"
          :show-precent="false"
          title="调度超时"
          height="100%"
          :bar-style="{
            color: 'linear-gradient(90deg, #B8DDFF 0%, #76BEFF 100%)',
            width: '8px',
            background: 'rgba(61, 132, 211, 0.20)',
          }"
        />
      </hl-group>
    </hl-scrollbar>
  </hv-panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ScrollingBarChart } from '@/views/components/echarts';
import { useGlobalState } from '@/hooks';
import { apiIndexPageWaitingObj } from '@/apis';

const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    getData({ ...params, status: params.eventStatus });
  },
});

const chartData1 = ref<{ value: any; label: string }[]>([]);
const chartData2 = ref<{ value: any; label: string }[]>([]);

const getData = async (params: any) => {
  // 调度用时
  const { data } = await apiIndexPageWaitingObj.postHotEvent({
    ...params,
    districtCode: params.district,
    platformCode: params.platform,
  });
  chartData1.value = data.sendList.map(item => {
    return {
      label: item.eventTypeName,
      value: item.eventNum,
    };
  });
  chartData2.value = data.timeoutList.map(item => {
    return {
      label: item.eventTypeName,
      value: item.eventNum,
    };
  });
};

getData(searchParams);
</script>
