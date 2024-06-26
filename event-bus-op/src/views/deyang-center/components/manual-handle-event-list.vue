<template>
    <hl-group v-if="list.length !== 0" dir="vertical" full>
      <hl-scrollbar :style="`height: ${height};`">
        <event-list :list="list"></event-list>
      </hl-scrollbar>
      <hl-pagination class="m-t-lg" size="sm" :current-page="pagination.currentPage" :page-size="pagination.pageSize" layout="total, prev, pager, next" :total="pagination.total" align="items-left" @current-change="handleCurrentChange"> </hl-pagination>
    </hl-group>
    <hl-group v-else :style="`height: ${height};`" full>
      <hb-empty image-size="0" description="暂无数据" />
    </hl-group>

</template>
<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { useGlobalState } from '@/hooks';
import { apiManualHanleObj as api } from '@/apis/modules/manual-handle';
import { IgetListSpace } from '@/apis/modules/manual-handle/model';

const { refreshTime, searchParams: globalSearchParams } = useGlobalState();

const list = ref<IgetListSpace.List[]>([]);

const props = defineProps({
  height: {
    type: String,
    default: 'calc(var(--xl) * 15.6)'
  },
  type: {
    type: String,
    default: ''
  }
});

const searchParams = ref<{
  eventState: string | number
}>({
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
  if (props.type === 'pending') {
    searchParams.value.eventState = 2;
  }

  const res = await api.screenList({
    eventState: searchParams.value.eventState,
    createBeginTime: globalSearchParams.startTime,
    createEndTime: globalSearchParams.endTime,
    district: globalSearchParams.district,
    platformSrc: globalSearchParams.platform,
    pageNum: pagination.currentPage,
    pageSize: pagination.pageSize
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

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val;
  fetchData();
};

fetchData();
</script>
<style lang="scss" scoped></style>
