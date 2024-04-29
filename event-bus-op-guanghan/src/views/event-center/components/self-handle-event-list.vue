<template>
  <hl-group class="m-t-xs" v-if="list.length !== 0" dir="vertical" full>
    <event-list :list="list" :platTypeStyle="platTypeStyle" :height="height" style="margin-top: -0.5rem !important"></event-list>
    <hl-pagination class="m-t-lg" size="sm" :current-page="pagination.currentPage" :page-size="pagination.pageSize" layout="total, prev, pager, next" :total="pagination.total" align="items-left" @current-change="handleCurrentChange"> </hl-pagination>
  </hl-group>
  <hl-group v-else :style="`height: ${height};`" full>
    <hb-empty image-size="0" description="暂无数据" />
  </hl-group>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, nextTick } from 'vue';
import { isEmpty } from 'lodash-es';
import { useGlobalState } from '@/hooks';
import { apiIndexPageObj, apiSelfHanleObj } from '@/apis';

import { IgetListSpace } from '@/apis/modules/self-handle/model';

const props = defineProps({
  height: {
    type: String,
    default: 'calc(var(--xl) * 15.6)'
  },
  listParams: {
    type: Object,
    default: () => ({})
  },
  listType: {
    type: String,
    default: 'self'
  },
  params: Object,
  autoTrigger: {
    type: Boolean,
    default: true
  }
});

const emits = defineEmits(['update']);

const { searchParams: globalSearchParams } = useGlobalState({
  handleWatch: props.params
    ? ''
    : (params: any) => {
        nextTick(() => {
          fetchData();
        });
      }
});

const list = ref<IgetListSpace.List[]>([]);

const platTypeStyle = ref('mix');

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

const fetchData = async () => {
  let searchParams = null;
  if (!props.params) {
    searchParams = {
      startTime: globalSearchParams.startTime,
      endTime: globalSearchParams.endTime,
      district: globalSearchParams.district,
      districtCode: globalSearchParams.district,
      platformCode: globalSearchParams.platform,
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize,
      ...props.listParams
    };
  } else {
    searchParams = {
      ...props.params,
      districtCode: globalSearchParams.district,
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize,
      eventTitle: props.params.title,
      platformCode: props.params.platform,
      dealStatus: props.params.eventStatus
    };
  }

  if (props.listType === 'self') {
    platTypeStyle.value = 'other';
    const res = await apiSelfHanleObj.list(searchParams);
    list.value = res.data.list.map((item: IgetListSpace.List) => ({
      title: item.eventTitle,
      name: `${item.eventTypeMaxName}/${item.eventTypeMiddleName}/${item.eventTypeName}` || '--',
      address: item.eventAddress,
      coordx: item.coordx,
      coordy: item.coordy,
      id: item.id,
      time: item.eventTime,
      customEventType: 'self',
      eventStatus: item.dealStatus,
      overtimeFlag: item.overTimeFlag,
      showSelfHandle: true
    }));
    pagination.total = res.data.totalRow;
    emits('update', res.data);
  } else if (props.listType === 'manual') {
    platTypeStyle.value = 'mix';
    const res = await apiIndexPageObj.getPage(searchParams);
    if (res.data.list.length) {
      list.value = res.data.list.map(e => ({
        id: e.id || e.eventId,
        title: e.title,
        time: e.eventTime,
        name: `${e.eventTypeLName ?? '--'}/${e.eventTypeMName ?? '--'}/${e.eventTypeName ?? '--'}`,
        address: e.eventAddress,
        showPosition: !isEmpty(e.coordx) && !isEmpty(e.coordy),
        value1: e.sendPlatform,
        value2: e.receivePlatform,
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
      pagination.total = res.data.totalRow;
    } else {
      list.value = [];
      pagination.total = 0;
    }
    emits('update', res.data);
  }
};

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val;
  fetchData();
};

if (props.autoTrigger) {
  watch(
    () => props.params,
    () => {
      fetchData();
    },
    {
      deep: true
    }
  );
}

if (props.autoTrigger) {
  fetchData();
}

const resetPagination = () => {
  pagination.currentPage = 1;
  pagination.total = 0;
};

const reset = () => {
  list.value = [];
  resetPagination();
};

const search = () => {
  resetPagination();
  fetchData();
};

defineExpose({
  search,
  reset
});
</script>
<style lang="scss" scoped></style>
