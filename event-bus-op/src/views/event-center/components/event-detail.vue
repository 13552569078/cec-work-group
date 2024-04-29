<template>
  <common-dialog :title="title" width="calc(var(--xl) * 19.32)" @close="handleClose">
    <event-list :list="list"></event-list>
    <hl-pagination
      class="m-t-md"
      size="sm"
      hide-on-single-page
      :current-page="currentPage"
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="total"
      align="items-between"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </hl-pagination>
  </common-dialog>
</template>
<script lang='ts' setup>
import { ref } from 'vue';
import { apiIndexPageObj, apiIndexPagePendingObj, apiIndexPageWaitingObj, apiIndexPageFinishedObj } from '@/apis';
import closeButton from '@/assets/images/dialog/close.png';
import { useGlobalState } from '@/hooks';
import {
  WAITING,
  PENDING,
} from '@/views/event-center/constant';
import { isEmpty } from 'lodash-es';

const {
  searchParams,
} = useGlobalState();

const title = '紧急事件';
const list = ref();
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const getEventList = async () => {
  let res, commonList, params;
  const commonParams = {
    eventUrgent: 2,
    startTime: searchParams.startTime,
    endTime: searchParams.endTime,
    pageNum: currentPage.value,
    pageSize: pageSize.value,
  };
  switch (searchParams.eventStatus) {
    case WAITING:
      params = {
        districtCode: searchParams.district,
        platformCode: searchParams.platform,
        eventStatus: searchParams.eventStatus,
        ...commonParams
      };
      res = await apiIndexPageWaitingObj.postPage(params);
      if (res.data.list.length) {
        commonList = res.data.list.map(e => ({
          id: e.id,
          title: e.title,
          time: e.eventTime,
          name: `${e.eventTypeLName ?? '--'}/${e.eventTypeMName ?? '--'}/${e.eventTypeName ?? '--'}`,
          address: e.eventAddress,
          showPosition: !isEmpty(e.coordx) && !isEmpty(e.coordy),
          value1: e.sendPlatform,
          value2: e.receivePlatform,
          location: [+e.coordx, +e.coordy],
          overtimeList: [
            {
              name: '调度',
              value: e.dispatchOverTime,
            },
            {
              name: '处置',
              value: e.handleOverTime,
            },
            {
              name: '办结',
              value: e.endOverTime,
            },
          ]
        }));
        total.value = res.data.total;
      } else {
        commonList = [];
        total.value = 0;
      }
      break;
    case PENDING:
      params = {
        district: searchParams.district,
        platform: searchParams.platform,
        eventStatus: searchParams.eventStatus,
        status: searchParams.eventStatus,
        ...commonParams
      };
      res = await apiIndexPagePendingObj.postHandlingListPage(params);
      if (res.data.list.length) {
        commonList = res.data.list.map(e => ({
          id: e.id,
          title: e.title,
          time: e.eventTime,
          name: `${e.eventTypeLName ?? '--'}/${e.eventTypeMName ?? '--'}/${e.eventTypeName ?? '--'}`,
          address: e.address,
          showPosition: !isEmpty(e.coordx) && !isEmpty(e.coordy),
          value1: e.sourcePlatform,
          value2: e.destPlatform,
          location: [+e.coordx, +e.coordy],
          overtimeList: [
            {
              name: '调度',
              value: e.dispatchOverTime,
            },
            {
              name: '处置',
              value: e.handleOverTime,
            },
            {
              name: '办结',
              value: e.endOverTime,
            },
          ]
        }));
        total.value = res.data.totalRow;
      } else {
        commonList = [];
        total.value = 0;
      }
      break;
    default:
      break;
  }
  list.value = commonList;
};
getEventList();
const handleClose = () => {
  currentPage.value = 1;
};
const handleSizeChange = () => {
  console.log('handleSizeChange');
};
const handleCurrentChange = (val:number) => {
  currentPage.value = val;
  getEventList();
};
</script>
