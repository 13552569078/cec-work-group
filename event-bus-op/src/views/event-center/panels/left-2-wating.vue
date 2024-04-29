<template>
  <hv-panel title="紧急程度">
    <hl-group class="w-full">
      <div style="width: 57%"></div>
      <common-inner-title>
        <template #left>
          <hl-group full="full-x" gap="var(--xxs)" align="items-middle"> 紧急事件列表</hl-group>
        </template>
        <template #right>
          <hl-button type="primary" size="" @click="searchVisible = true">查看详情</hl-button>
        </template>
      </common-inner-title>
    </hl-group>
    <hl-scrollbar style="height: calc(var(--xl) * 6.58)">
      <hl-group full="full-x" dir="vertical" gap="var(--xxs)">
        <pie-type4 class="analasis-charts" style="height: calc(var(--xl) * 6.4);" :title="pieTitle" :charts-data="chartData"></pie-type4>
      </hl-group>
    </hl-scrollbar>
  </hv-panel>
  <!-- 弹窗：事件详情 -->
  <event-detail v-if="searchVisible" @close="searchVisible = false" />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { apiIndexPageWaitingObj } from '@/apis';
import { IpostUrgentListSpace } from '@/apis/modules/index-page-wating/model';
import { useGlobalState } from '@/hooks';
import { PieType4 } from '@/views/components/echarts';
import EventDetail from '@/views/event-center/components/event-detail';

const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    getData({ ...params, status: params.eventStatus });
  }
});

const searchVisible = ref(false);
const chartData = ref<Omit<IpostUrgentListSpace.Data, 'id'>[]>([]);
const pieTitle = reactive({
  value: 0,
  unit: '%',
  name: '发起紧急事件'
});

const getData = async (params: any) => {
  // 获取占比和总数
  const { data } = await apiIndexPageWaitingObj.postUrgentRate({ ...params, districtCode: params.district, platformCode: params.platform });
  Object.assign(pieTitle, {
    value: data.emergencyRate,
    unit: '%',
    name: '发起紧急事件'
  });
  // 获取去向TOP3
  const { data: dataList } = await apiIndexPageWaitingObj.postUrgentList({ ...params, districtCode: params.district, platformCode: params.platform });
  chartData.value = dataList;
};

getData(searchParams);
</script>
