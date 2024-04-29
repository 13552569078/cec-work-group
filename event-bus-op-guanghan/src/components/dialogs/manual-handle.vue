<template>
  <common-dialog :title="title" width="calc(var(--xl) * 19.32)" @close="handleClose" class="dialog-search-list">
    <hl-group class="m-b-md w-full" dir="horizontal" merge block full>
      <c-tabs v-model="searchParams.eventState" :tabs="EVENT_STATUS_OPTION" @click="fetchData" />
    </hl-group>

    <hl-group v-if="list.length !== 0" dir="vertical" full>
      <hl-scrollbar :style="`height: ${height};`" class="m-t-md">
        <event-list :list="list"></event-list>
      </hl-scrollbar>
      <hl-pagination class="m-t-lg" size="sm" :current-page="pagination.currentPage" :page-size="pagination.pageSize" layout="total, prev, pager, next" :total="pagination.total" align="items-left" @current-change="fetchData"> </hl-pagination>
    </hl-group>
    <hl-group v-else :style="`height: ${height};`" full>
      <hb-empty image-size="0" description="暂无数据" />
    </hl-group>
  </common-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { useGlobalState } from '@/hooks';
import { EVENT_STATUS_OPTION } from '@/common';
import { apiManualHanleObj as api } from '@/apis/modules/manual-handle';
import { IgetListSpace } from '@/apis/modules/manual-handle/model';

const emit = defineEmits(['close']);

const { refreshTime } = useGlobalState();

const title = '手动流转';

const list = ref<IgetListSpace.List[]>([]);

const props = defineProps({
  height: {
    type: String,
    default: 'calc(var(--xl) * 17.3)'
  }
});

const searchParams = ref({
  eventState: ''
});

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 手动流转 操作刷新列表
watch(refreshTime, () => {
  fetchData();
});

const fetchData = async () => {
  const res = await api.screenList({
    eventState: searchParams.value.eventState,
    pageNum: pagination.currentPage
  });
  list.value = res.data.list.map((item: IgetListSpace.List) => ({
    title: item.title,
    name: `${item.eventTypeName}/${item.eventTypeMNAME}/${item.eventTypeLName}` || '--',
    address: item.eventAddress,
    coordx: item.coordx,
    coordy: item.coordy,
    id: item.id,
    time: item.eventTime,
    value1: item.platformSrcName,
    value2: item.receivePlatform,
    overtimeList: [
      {
        name: '调度',
        value: item.dispatchOverTime
      },
      {
        name: '处置',
        value: item.handleOverTime
      },
      {
        name: '办结',
        value: item.endOverTime
      }
    ]
  }));
  pagination.total = res.data.total;
};

fetchData();

const handleClose = () => {
  emit('close');
};
</script>
<style lang="scss" scoped></style>
