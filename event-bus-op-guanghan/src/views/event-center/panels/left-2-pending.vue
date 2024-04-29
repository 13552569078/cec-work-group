<template>
  <hv-panel title="紧急程度" v-if="searchParams.platform === EVENT_PLARFORM_CODE">
    <hl-group class="w-full">
      <div style="width: 57%"></div>
      <common-inner-title>
        <template #left>
          <hl-group full="full-x" gap="var(--xxs)" align="items-middle"> 紧急事件去向TOP3 </hl-group>
        </template>
        <template #right>
          <hl-button type="primary" size="" @click="searchVisible = true">查看详情</hl-button>
        </template>
      </common-inner-title>
    </hl-group>
    <hl-scrollbar style="height: calc(var(--xl) * 6.58)">
      <hl-group full="full-x" dir="vertical" gap="var(--xxs)">
        <pie-type2 class="analasis-charts" style="height: calc(var(--xl) * 6.4); margin-top: calc(var(--xl) * 0.3)"
          :title="pieTitle" :charts-data="chartData"></pie-type2>
      </hl-group>
    </hl-scrollbar>
  </hv-panel>
  <hv-panel title="紧急程度" v-if="searchParams.platform !== EVENT_PLARFORM_CODE">
    <hl-group class="w-full">
      <div style="width: 57%"></div>
      <common-inner-title>
        <template #left>
          <hl-group full="full-x" gap="var(--xxs)" align="items-middle">紧急事件列表</hl-group>
        </template>
        <template #right>
          <hl-button type="primary" size="" @click="searchVisible = true">查看详情</hl-button>
        </template>
      </common-inner-title>
    </hl-group>
    <hl-scrollbar style="height: calc(var(--xl) * 6.58)">
      <hl-group full="full-x" dir="vertical" gap="var(--xxs)">
        <pie-type4 class="analasis-charts" style="height: calc(var(--xl) * 6.4); margin-top: calc(var(--xl) * 0.3)"
          :title="pieTitle" :charts-data="chartList"></pie-type4>
      </hl-group>
    </hl-scrollbar>
  </hv-panel>
  <!-- 弹窗：事件详情 -->
  <event-detail v-if="searchVisible" @close="searchVisible = false" />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { apiIndexPagePendingObj } from '@/apis';
import { IpostEmergencyAssignedDestStatSpace, IlistSpace } from '@/apis/modules/index-page-pending/model';
import { useGlobalState } from '@/hooks';
import { EVENT_PLARFORM_CODE } from '@/common/constant';
import { EventSearchBasic } from '@/components';
import { PieType2, PieType4 } from '@/views/components/echarts';
import EventDetail from '@/views/event-center/components/event-detail';

const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    getData({ ...params, status: params.eventStatus });
  }
});

const searchVisible = ref(false);
const chartData = ref<IpostEmergencyAssignedDestStatSpace.Data[]>([]);
const chartList = ref<Omit<IlistSpace.Data, 'overTimeFlag' | 'id'>[]>([]);
const pieTitle = reactive({
  value: 0,
  unit: '%',
  name: '紧急事件'
});

const getData = async (params: any) => {
  // 获取占比和总数
  const { data } = await apiIndexPagePendingObj.postEmergencyRate(params);
  Object.assign(pieTitle, {
    value: data.emergencyRate === '--' ? data.emergencyRate : Number(data.emergencyRate),
    unit: data.emergencyRate === '--' ? '' : '%',
    name: '紧急事件'
  });
  // 获取去向TOP3
  const { data: dataTop } = await apiIndexPagePendingObj.postEmergencyAssignedDestStat(params);
  chartData.value = dataTop;
  // 紧急事件列表 非事务总线
  const { data: dataList } = await apiIndexPagePendingObj.list(params);
  chartList.value = dataList.map(item => {
    return {
      eventTime: item.eventTime,
      overtimeFlag: item.overTimeFlag,
      title: item.title
    };
  });
};

getData(searchParams);
</script>
