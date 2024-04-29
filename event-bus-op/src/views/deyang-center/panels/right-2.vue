<template>
  <hv-panel title="事件列表">
    <hl-group full="full-x" dir="vertical" gap="var(--xxs)">
      <hl-button class="standard-text" type="primary" @click="toggleEventSearchMode">事件搜索</hl-button>
    </hl-group>
    <hl-group class="w-full m-t-sm m-b-xs" align="items-between" gap="var(--md)">
      <c-tabs :isFull="true" v-model="eventTabType" :tabs="eventTabOptions">
        <template v-slot="{ option }">
          <span class="standard-text">
            {{ option.label }}
            <b style="color: #82ffa1">{{ option.eventNum ?? '--' }}</b> 件
          </span>
        </template>
      </c-tabs>
    </hl-group>
    <event-list :height="'calc(var(--xl) * 15)'" :list="list"></event-list>
    <hl-group dir="horizontal" class="page-content m-t-md w-full">
      <hl-group align="items-middle">
        <span>事件数/</span>
        <span class="page-count">{{ total }}</span>
        件
      </hl-group>
      <hl-pagination size="sm" hide-on-single-page :current-page="currentPage" :page-size="pageSize" layout="prev, pager, next" :total="total" align="items-between" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </hl-pagination>
    </hl-group>
  </hv-panel>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { EventList } from '@/components';
import { apiIndexPageObj, apiIndexPagePendingObj, apiIndexPageWaitingObj, apiIndexPageFinishedObj } from '@/apis';
import { ALL, WAITING, PENDING, FINISHED } from '@/views/event-center/constant';
import { OVERTIME_OPTION, URGE_FLAG_OPTION } from '@/common';
import { isEmpty } from 'lodash-es';

import { useGlobalState, useEventQuery } from '@/hooks';

const { searchParams, toggleEventSearchMode } = useGlobalState({
  handleWatch: (params: any) => {
    resetList();
  }
});

const { searchEventListQuery } = useEventQuery();

const props = defineProps({
  eventStatus: {
    type: String,
    default: ''
  }
});

const eventTabOptions = ref<{ label: string; eventNum: number; value: string }[]>([]);
const eventTabType = ref('wating');

const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);

const list = ref();

const getEventList = async () => {
  let res, commonList, params;
  const commonParams = {
    startTime: searchParams.startTime,
    endTime: searchParams.endTime,
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    ...searchEventListQuery.value
  };
  switch (props.eventStatus) {
    case ALL:
      params = {
        districtCode: searchParams.district,
        platformCode: searchParams.platform,
        eventStatus: searchParams.eventStatus,
        ...commonParams
      };
      res = await apiIndexPageObj.getPage(params);
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
              value: e.dispatchOverTime
            },
            {
              name: '处置',
              value: e.handleOverTime
            },
            {
              name: '办结',
              value: e.endOverTime
            }
          ]
        }));
        total.value = res.data.totalRow;
      } else {
        commonList = [];
        total.value = 0;
      }
      break;
    case WAITING:
      params = {
        districtCode: searchParams.district,
        platformCode: searchParams.platform,
        eventStatus: searchParams.eventStatus,
        ...commonParams
      };
      res = await apiIndexPageWaitingObj.postPage(params);
      eventTabOptions.value = [
        {
          label: '待调度',
          value: 'wating',
          eventNum: res.data.total
        }
      ];
      eventTabType.value = 'wating';
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
              value: e.dispatchOverTime
            },
            {
              name: '处置',
              value: e.handleOverTime
            },
            {
              name: '办结',
              value: e.endOverTime
            }
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
        eventTypeId: searchEventListQuery.value.eventType,
        ...commonParams
      };
      res = await apiIndexPagePendingObj.postHandlingListPage(params);
      eventTabOptions.value = [
        {
          label: '处置中',
          value: 'pending',
          eventNum: res.data.totalRow
        },
        {
          label: '异常',
          value: 'warning',
          eventNum: 0
        }
      ];
      eventTabType.value = 'pending';
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
              value: e.dispatchOverTime
            },
            {
              name: '处置',
              value: e.handleOverTime
            },
            {
              name: '办结',
              value: e.endOverTime
            }
          ]
        }));
        total.value = res.data.totalRow;
      } else {
        commonList = [];
        total.value = 0;
      }
      break;
    case FINISHED:
      params = {
        district: searchParams.district,
        platform: searchParams.platform,
        eventStatus: searchParams.eventStatus,
        eventTypeId: searchEventListQuery.value.eventType,
        ...commonParams
      };
      res = await apiIndexPageFinishedObj.postEndListPage(params);
      eventTabOptions.value = [
        {
          label: '已办结',
          value: 'finished',
          eventNum: res.data.totalRow
        }
      ];
      eventTabType.value = 'finished';
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
              value: e.dispatchOverTime
            },
            {
              name: '处置',
              value: e.handleOverTime
            },
            {
              name: '办结',
              value: e.endOverTime
            }
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

const resetList = () => {
  searchEventListQuery.value.eventType = '';
  currentPage.value = 1;
  getEventList();
};

const handleSizeChange = () => {
  console.log('handleSizeChange');
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getEventList();
};

getEventList();
</script>
<style lang="scss" scoped>
.page-content {
  justify-content: space-between;
  font-size: calc(var(--xl) * 0.48);
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  .page-count {
    color: #36b7ff;
  }
}
:deep(.hl-input .input-inner) {
  color: #96bee0 !important;
}
</style>
