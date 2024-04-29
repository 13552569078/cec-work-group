<template>
  <hv-panel title="跨部门协同" size="5">
    <hl-group class="w-full">
      <div style="width: 57%"></div>
      <common-inner-title>
        <template #left>
          <hl-group full="full-x" gap="var(--xxs)" align="items-middle" v-if="searchParams.platform === EVENT_PLARFORM_CODE">协同事件去向TOP3</hl-group>
          <hl-group full="full-x" gap="var(--xxs)" align="items-middle" v-else>部门协同对象TOP3</hl-group>
        </template>
      </common-inner-title>
    </hl-group>
    <hl-scrollbar style="height: calc(var(--xl) * 7.53)">
      <hl-group full="full-x" dir="vertical" gap="var(--xxs)" v-if="searchParams.platform === EVENT_PLARFORM_CODE">
        <pie-type2 class="analasis-charts" style="height: calc(var(--xl) * 6.4); margin-top: calc(var(--xl) * 0.3)" :title="pieTitle" :charts-data="chartData1" :span="1"></pie-type2>
      </hl-group>
      <hl-group full="full-x" dir="vertical" gap="var(--xxs)" v-if="searchParams.platform !== EVENT_PLARFORM_CODE">
        <pie-type2 class="analasis-charts" style="height: calc(var(--xl) * 6.4); margin-top: calc(var(--xl) * 0.3)" :title="pieTitle" :charts-data="chartData2" :span="1"></pie-type2>
      </hl-group>
    </hl-scrollbar>
  </hv-panel>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { PieType2 } from '@/views/components/echarts';
import { apiIndexPageFinishedObj } from '@/apis';
import { IPieType2 } from '@/types/echarts';
import { useGlobalState } from '@/hooks';
import { EVENT_PLARFORM_CODE } from '@/common/constant';

const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    getData({ ...params, status: params.eventStatus });
  }
});

const chartData1 = ref<IPieType2[]>([]);
const chartData2 = ref<IPieType2[]>([]);

const pieTitle = reactive({
  value: 0,
  unit: '%',
  name: '协同处置事件'
});

const getData = async (params: any) => {
  // 获取占比和总数
  const { data } = await apiIndexPageFinishedObj.postCollDisposalRate(params);
  Object.assign(pieTitle, {
    value: data.rate === '--' ? data.rate : Number(data.rate),
    unit: data.rate === '--' ? '' : '%',
    name: '协同处置事件'
  });
  // 获取去向TOP3
  const { data: dataTop } = await apiIndexPageFinishedObj.postCollaborativeDestStat(params);
  chartData1.value = dataTop.map(item => {
    return {
      platform: item.platform,
      emergencyNum: item.eventNum
    };
  });
  // 对象去向TOP3
  const { data: dataObj } = await apiIndexPageFinishedObj.postCollaborativeObjectStat(params);
  chartData2.value = dataObj.map(item => {
    return {
      platform: item.platform,
      emergencyNum: item.eventNum
    };
  });
};

getData(searchParams);
</script>
