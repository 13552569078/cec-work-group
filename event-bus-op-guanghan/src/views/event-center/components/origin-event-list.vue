<template>
  <template v-if="list && list.length">
    <event-list :height="height" :list="list"></event-list>
    <hl-group v-if="list && list.length" dir="horizontal" class="page-content m-t-md w-full">
      <hl-group align="items-middle">
        <span>事件数/</span>
        <span class="page-count">{{ total }}</span>
        件
      </hl-group>
      <hl-pagination size="sm" hide-on-single-page :current-page="currentPage" :page-size="pageSize" layout="prev, pager, next" :total="total" align="items-between" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </hl-pagination>
    </hl-group>
  </template>
  <hl-group v-else :style="`height: ${height};`" full>
    <hb-empty image-size="0" description="暂无数据" />
  </hl-group>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { EventList } from '@/components';
import { apiIndexPageObj, apiIndexPagePendingObj, apiIndexPageWaitingObj, apiIndexPageFinishedObj } from '@/apis';
import { apiSelfHanleObj as api } from '@/apis';
import { ALL, WAITING, PENDING, FINISHED, EVENT_LIST_TABS } from '@/views/event-center/constant';
import { isEmpty } from 'lodash-es';

import { useGlobalState } from '@/hooks';

const props = defineProps({
  height: {
    type: String,
    default: 'calc(var(--xl) * 15.6)'
  },
  params: Object,
  autoTrigger: {
    type: Boolean,
    default: true
  }
});

const emits = defineEmits(['setTabsNum', 'update']);

const { searchParams } = useGlobalState({
  handleWatch: props.params
    ? ''
    : (params: any) => {
        resetList();
      }
});

const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);

const list = ref();

const apiFunc = {
  [ALL]: apiIndexPageObj.getPage.bind(apiIndexPageObj),
  [WAITING]: apiIndexPageWaitingObj.postPage.bind(apiIndexPageWaitingObj),
  [PENDING]: apiIndexPagePendingObj.postHandlingListPage.bind(apiIndexPagePendingObj),
  [FINISHED]: apiIndexPageFinishedObj.postEndListPage.bind(apiIndexPageFinishedObj)
};

// 事件数据处理
const eventWrapper = (res: any) => {
  let commonList = [];
  if (res.data.list.length) {
    commonList = res.data.list.map(e => ({
      id: e.id,
      title: e.title,
      time: e.eventTime,
      name: `${e.eventTypeLName ?? '--'}/${e.eventTypeMName ?? '--'}/${e.eventTypeName ?? '--'}`,
      address: e.eventAddress || e.address,
      showPosition: !isEmpty(e.coordx) && !isEmpty(e.coordy),
      value1: e.sendPlatform || e.sourcePlatform,
      value2: e.receivePlatform || e.destPlatform,
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
    total.value = res.data.totalRow === undefined ? res.data.total : res.data.totalRow;
    setTabsNumFun(total.value);
  } else {
    commonList = [];
    total.value = 0;
  }
  return commonList;
};

const getEventList = async () => {
  let params;
  const commonParams = {
    startTime: searchParams.startTime,
    endTime: searchParams.endTime,
    direction: 1,
    pageNum: currentPage.value,
    pageSize: pageSize.value
  };
  // 使用全局搜索参数
  if (!props.params) {
    switch (searchParams.eventStatus) {
      case ALL:
      case WAITING:
        params = {
          districtCode: searchParams.district,
          platformCode: searchParams.platform,
          eventStatus: searchParams.eventStatus,
          ...commonParams
        };
        break;
      case PENDING:
        params = {
          district: searchParams.district,
          platform: searchParams.platform,
          eventStatus: searchParams.eventStatus,
          status: searchParams.eventStatus,
          ...commonParams
        };
        break;
      case FINISHED:
        params = {
          district: searchParams.district,
          platform: searchParams.platform,
          eventStatus: searchParams.eventStatus,
          ...commonParams
        };
        break;
      default:
        break;
    }
  } else {
    params = {
      ...props.params,
      platformCode: props.params.platform,
      districtCode: props.params.district,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    };
  }

  const res = await apiFunc[searchParams.eventStatus as keyof typeof apiFunc](params as any);
  list.value = eventWrapper(res);
  emits('update', res.data);
};

const resetList = () => {
  currentPage.value = 1;
  getEventList();
};

if (props.autoTrigger) {
  watch(
    () => props.params,
    () => {
      resetList();
    },
    {
      deep: true
    }
  );
}
const setTabsNumFun = async (totalNum: number) => {
  switch (searchParams.eventStatus) {
    case ALL: {
      const params = {
        startTime: searchParams.startTime,
        endTime: searchParams.endTime,
        district: searchParams.district,
        platformCode: searchParams.platform
      };
      const { data } = await api.cardNumStat(params);
      emits('setTabsNum', data);
      break;
    }
    case PENDING: {
      const params = {
        startTime: searchParams.startTime,
        endTime: searchParams.endTime,
        district: searchParams.district,
        eventStatus: PENDING,
        platformCode: searchParams.platform
      };
      const { data } = await api.eventCountStat(params);
      const tabData = { pendingNum: data.handlingCount, warningNum: data.exceptionCount };
      emits('setTabsNum', tabData);
      break;
    }
    case WAITING: {
      const data = Object.assign(EVENT_LIST_TABS[searchParams.eventStatus][0], { watingNum: totalNum });
      emits('setTabsNum', data);
      break;
    }
    case FINISHED: {
      const data = Object.assign(EVENT_LIST_TABS[searchParams.eventStatus][0], { finishedNum: totalNum });
      emits('setTabsNum', data);
      break;
    }
  }
};

const handleSizeChange = () => {
  console.log('handleSizeChange');
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getEventList();
};
if (props.autoTrigger) {
  getEventList();
}

const reset = () => {
  list.value = [];
  resetPagination();
};

const resetPagination = () => {
  currentPage.value = 1;
};

const search = () => {
  resetPagination();
  getEventList();
};

defineExpose({
  search,
  reset
});

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
