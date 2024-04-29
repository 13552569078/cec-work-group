<template>
  <hv-panel title="处置用时">
    <template #action>
      <dy-tabs style="position: relative; top: calc(var(--xxs)*3)" v-model="mode" :tabs="tabs" @update:modelValue="getHandleTime" />
    </template>
    <stripe-list :list="list" :cols="cols" :height="'calc(var(--xl) * 7.58)'" />
  </hv-panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { StripeList } from '@/components';

import { apiIndexPageFinishedObj } from '@/apis';
import { useGlobalState } from '@/hooks';

const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    mode.value = 1;
    getHandleTime();
  },
});

const basicCols = [
  {
    title: '排名',
    minWidth: '2em',
    align: 'left',
    slotName: 'tableIndex',
    fixed: 'left',
  },
  { title: '平台名称', prop: 'platform' },
];

const cols = ref();

const list = ref();
const mode = ref(1);
const tabs = [
  {
    label: '处置用时',
    value: 1,
  },
  {
    label: '处置效率',
    value: 2,
  },
];

const getHandleTime = async () => {
  try {
    let res;
    const params = {
      startTime: searchParams.startTime,
      endTime: searchParams.endTime,
      district: searchParams.district,
    };
    if (mode.value === 1) {
      cols.value = [
        ...basicCols,
        { title: '平均处置用时', prop: 'handleTimeAvg' },
        { title: '环比', prop: 'qoqRate' },
      ];
      res = await apiIndexPageFinishedObj.postHandleTime(params);
    } else {
      cols.value = [
        ...basicCols,
        { title: '平均处置效率', prop: 'handleEfficAvg' },
        { title: '环比', prop: 'qoqRate' },
      ];
      res = await apiIndexPageFinishedObj.postHandleEfficient(params);
    }
    if (res.data?.length) {
      list.value = res.data.map(r => ({ ...r, qoqRate: r.qoqRate + '%' }));
    } else {
      list.value = [];
    }
  } catch (error) {
    console.log(error);
  }
};

getHandleTime();
</script>
