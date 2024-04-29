<template>
  <hv-panel title="调度用时">
    <hl-scrollbar style="height: calc(var(--xl) * 7.53)">
      <hl-group dir="horizontal" gap="var(--md)" class="w-full">
        <card-list :chartData="chartData1" title="待调度"></card-list>
        <card-list :chartData="chartData2" title="历史调度" :show-unit="false"></card-list>
      </hl-group>
    </hl-scrollbar>
  </hv-panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CardList } from '@/components';
import { useGlobalState } from '@/hooks';
import { apiIndexPageWaitingObj } from '@/apis';
import { EMPTY_STRING } from '@/common';

const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    getData({ ...params, status: params.eventStatus });
  }
});

const chartData1 = ref<{ value: any; label: string }[]>([]);
const chartData2 = ref<{ value: any; label: string }[]>([]);

const getData = async (params: any) => {
  // 调度用时
  const { data } = await apiIndexPageWaitingObj.postTimeAnalysis({ ...params, districtCode: params.district, platformCode: params.platform });
  chartData1.value = [
    {
      label: '30分钟之内',
      value: data.within30minNum || 0
    },
    {
      label: '30分钟以上',
      value: data.over30minNum || 0
    },
    {
      label: '24小时以上',
      value: data.over24hourNum || 0
    }
  ];

  chartData2.value = [
    {
      label: '平均用时',
      value: data.averageTime || 0
    },
    {
      label: '平均用时环比',
      value: data.averageTimeLinkRate !== EMPTY_STRING ? `${data.averageTimeLinkRate}%` : EMPTY_STRING + '%'
    },
    {
      label: '最长用时',
      value: data.maxTime || 0
    }
  ];
};

getData(searchParams);
</script>
