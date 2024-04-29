<template>
  <hv-panel :title="optionConfig.cardTitle">
    <hl-group
      full="full-x"
      dir="vertical"
      gap="var(--xxs)"
      style="height: calc(var(--xl) * 7.4)"
    >
      <!-- :chart-data="chartData" -->
      <platform-statistics-bar
        :chart-data="chartData"
        :title="optionConfig.chartsTitle"
        :doneLabel="optionConfig.doneLabel"
        :unDoneLabel="optionConfig.unDoneLabel"
      >
      </platform-statistics-bar>
    </hl-group>
  </hv-panel>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useGlobalState } from '@/hooks';
import { PlatformStatisticsBar } from '@/views/components/echarts';
import {
  apiIndexPageObj,
  apiIndexPageWaitingObj,
  apiIndexPagePendingObj,
  apiIndexPageFinishedObj,
} from '@/apis';
import { IpostAssignedDestStatSpace } from '@/apis/modules/index-page-pending/model';
import { ALL, WAITING, PENDING, FINISHED } from '../constant';

const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    getData({ ...params, status: params.eventStatus });
  },
});

const chartData = ref<IpostAssignedDestStatSpace.Data[]>([]);
const optionConfig = reactive({
  cardTitle: '交办去向',
  chartsTitle: '交办部门接收事件数/件',
  doneLabel: '已超时',
  unDoneLabel: '未超时',
});

const getData = (params: any) => {
  switch (params.status) {
    case ALL:
      Object.assign(optionConfig, {
        cardTitle: '平台统计',
        chartsTitle: '发起事件数/件',
        doneLabel: '已办结',
        unDoneLabel: '未办结',
      });
      getAllData(params);
      break;
    case WAITING:
      Object.assign(optionConfig, {
        cardTitle: '事件来源',
        chartsTitle: '发起事件数/件',
      });
      getWaitingData(params);
      break;
    case PENDING:
      Object.assign(optionConfig, {
        cardTitle: '交办去向',
      });
      getPendingData(params);
      break;
    case FINISHED:
      Object.assign(optionConfig, {
        cardTitle: '办理平台',
      });
      getFineshedData(params);
      break;
    default:
      break;
  }
};
const getAllData = async (params: any) => {
  const { startTime, endTime } = params;
  const { data } = await apiIndexPageObj.postPlatform({
    districtCode: params.district,
    startTime,
    endTime,
  });
  chartData.value = data.map(item => {
    return {
      platform: item.platformName,
      notOverTimeNum: item.noneCompletNum,
      overTimeNum: item.completedNum,
    };
  });
};
const getWaitingData = async (params: any) => {
  const { data } = await apiIndexPageWaitingObj.postPlatform({
    ...params,
    districtCode: params.district,
    platformCode: params.platform,
  });
  chartData.value = data.map(item => {
    return {
      platform: item.platformName,
      notOverTimeNum: item.timeinNum,
      overTimeNum: item.timeoutNum,
    };
  });
};
const getPendingData = async (params: any) => {
  const { data } = await apiIndexPagePendingObj.postAssignedDestStat(params);
  chartData.value = data;
};
const getFineshedData = async (params: any) => {
  const { data } = await apiIndexPageFinishedObj.postPlatformStat(params);
  chartData.value = data;
};

getData({ ...searchParams, status: searchParams.eventStatus });
</script>
