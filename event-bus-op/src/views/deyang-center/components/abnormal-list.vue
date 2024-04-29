<template>
 <event-list :height="'calc(var(--xl) * 15.6)'" :list="list"></event-list>
 <hl-group v-if="list && list.length" dir="horizontal" class="page-content m-t-md w-full">
    <hl-group align="items-middle">
      <span>事件数/</span>
      <span class="page-count">{{ total }}</span>
      件
    </hl-group>
    <hl-pagination size="sm" hide-on-single-page :current-page="currentPage" :page-size="pageSize" layout="prev, pager, next" :total="total" align="items-between" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </hl-pagination>
  </hl-group>
</template>

<script lang='ts' setup>
import { ref, withDefaults, computed } from 'vue';
import closeButton from '@/assets/images/dialog/close.png';
import { EventList } from '@/components';
import { apiIndexPagePendingObj } from '@/apis';
import { isEmpty } from 'lodash-es';
import { useGlobalState } from '@/hooks';
const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    getAbnormalList();
  }
});

const list = ref();
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);

const getAbnormalList = async () => {
  const params = {
    type: 3,
    district: searchParams.district,
    platform: searchParams.platform,
    startTime: searchParams.startTime,
    endTime: searchParams.endTime,
    pageNum: currentPage.value,
    pageSize: pageSize.value
  };
  const res = await apiIndexPagePendingObj.postAbnormalListPage(params);
  if (res.data.list.length) {
    list.value = res.data.list.map(e => ({
      id: e.id,
      title: e.title,
      time: e.eventTime,
      name: `${e.eventTypeLName ?? '--'}/${e.eventTypeMName ?? '--'}/${e.eventTypeName ?? '--'}`,
      address: e.address,
      showPosition: !isEmpty(e.coordx) && !isEmpty(e.coordy),
      value1: e.sourcePlatform,
      value2: e.destPlatform,
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
    list.value = [];
    total.value = 0;
  }
};

const handleSizeChange = () => {
  console.log('handleSizeChange');
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getAbnormalList();
};

getAbnormalList();

</script>

<style lang="scss">

</style>
