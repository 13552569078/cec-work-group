<template>
  <hv-panel title="高频分析">
    <template #action>
      <hl-group full="full-x" dir="vertical" gap="var(--xxs)">
        <c-tabs v-model="mode" :tabs="tabs" />
      </hl-group>
    </template>

    <div v-show="mode === 'eventType'">
      <hl-scrollbar
        style="height: calc(var(--xl) * 7.5)"
        v-if="searchParams.platform === EVENT_PLARFORM_CODE"
      >
        <scrolling-bar-chart
          v-if="chartData1.length"
          :chart-data="chartData1"
          :show-precent="true"
          height="100%"
          :bar-style="{
            color: 'linear-gradient(90deg, #B8DDFF 0%, #76BEFF 100%)',
            width: '8px',
            background: 'rgba(61, 132, 211, 0.20)',
          }"
          :isCursor="scrollCursorFlag"
          @click-bar="clickBar"
        />
      </hl-scrollbar>
      <hl-scrollbar v-else style="height: calc(var(--xl) * 7.5)">
        <hl-group
          dir="horizontal"
          gap="var(--md)"
          class="w-full"
          v-if="chartData3.length && chartData2.length"
        >
          <scrolling-bar-chart
            :chart-data="chartData2"
            :show-precent="false"
            height="100%"
            :title="`发起平台 : ${platformName}`"
            :bar-style="{
              color: 'linear-gradient(90deg, #B8DDFF 0%, #76BEFF 100%)',
              width: '8px',
              background: 'rgba(61, 132, 211, 0.20)',
            }"
          />
          <scrolling-bar-chart
            :chart-data="chartData3"
            :show-precent="false"
            :title="`接收平台 : ${platformName}`"
            height="100%"
            :bar-style="{
              color: 'linear-gradient(90deg, #B8DDFF 0%, #76BEFF 100%)',
              width: '8px',
              background: 'rgba(61, 132, 211, 0.20)',
            }"
          />
        </hl-group>
      </hl-scrollbar>
    </div>

    <div v-if="mode === 'keywords'">
      <keywords />
    </div>
    <self-handle-dialog
      v-if="showSelfHandleDialog"
      :dialogParams="handleListDialogParams"
      :dialogType="handleListDialogType"
      @close="closeSelfHandleDialog"
    />
  </hv-panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ScrollingBarChart } from '@/views/components/echarts';
import { useGlobalState, useUtils } from '@/hooks';
import { EVENT_PLARFORM_CODE } from '@/common/constant';
import { apiIndexPageObj } from '@/apis';
import Keywords from '../components/keywords.vue';
import SelfHandleDialog from '@/views/event-center/components/self-handle-dialog.vue';

const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    getData({ ...params, status: params.eventStatus });
  },
});

const { getDictName } = useUtils();

const mode = ref('eventType');
const tabs = [
  {
    label: '事件类型',
    value: 'eventType',
  },
  {
    label: '关键词',
    value: 'keywords',
  },
];
const scrollCursorFlag = true;

const chartData1 = ref<{ value: any; label: string }[]>([]); // 高频事件
const chartData2 = ref<{ value: any; label: string }[]>([]); // 发起平台
const chartData3 = ref<{ value: any; label: string }[]>([]); // 接收平台
const platformName = ref('');

const handleListDialogParams = ref();
// 弹窗列表类型，self-自处置 manual-流转
const handleListDialogType = ref('manual');
const showSelfHandleDialog = ref(false);

const getData = async (params: any) => {
  if (searchParams.platform === EVENT_PLARFORM_CODE) {
    // 高频事件
    const { data } = await apiIndexPageObj.postEvents({
      ...params,
      districtCode: params.district,
      platformCode: params.platform,
    });
    chartData1.value = data.map(item => {
      return {
        label: item.eventTypeName,
        value: item.eventNum,
        precent: item.eventRate,
        eventTypeId: item.eventTypeId,
      };
    });
    return;
  }
  platformName.value = await getDictName('event_platform', params.platform);
  // 发起平台
  const { data: data1 } = await apiIndexPageObj.postEvents({
    ...params,
    districtCode: params.district,
    platformCode: params.platform,
    direction: '1',
  });
  chartData2.value = data1.map(item => {
    return {
      label: item.eventTypeName,
      value: item.sendNum || 0,
      eventTypeId: item?.eventTypeId,
    };
  });
  // 接收平台
  const { data: data2 } = await apiIndexPageObj.postEvents({
    ...params,
    districtCode: params.district,
    platformCode: params.platform,
    direction: '2',
  });
  chartData3.value = data2.map(item => {
    return {
      label: item.eventTypeName,
      value: item.receiveNum || 0,
      eventTypeId: item?.eventTypeId,
    };
  });
};

getData(searchParams);

const clickBar = async (barItem: any) => {
  handleListDialogParams.value = {
    eventType: barItem.eventTypeId,
    eventStatus: '',
  };
  showSelfHandleDialog.value = true;
};

const closeSelfHandleDialog = () => {
  showSelfHandleDialog.value = false;
};

const refreshData = () => {
  getData(searchParams);
};

defineExpose({
  refreshData,
});
</script>
