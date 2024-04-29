<template>
  <template v-if="list && list.length">
    <event-list-scroll
      :height="height"
      :list="list"
      :platTypeStyle="'realTime'"
      :seamlessScroll="true"
    ></event-list-scroll>
  </template>
  <hl-group v-else :style="`height: ${height};`" full>
    <hb-empty image-size="0" description="暂无数据" />
  </hl-group>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { useGlobalState } from '@/hooks';
import { apiIndexPageObj } from '@/apis';
import { isEmpty } from 'lodash-es';

const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    getData({ ...searchParams });
  },
});

const props = defineProps({
  height: {
    type: String,
    default: 'calc(var(--xl) * 15.6)',
  },
  params: Object,
  autoTrigger: {
    type: Boolean,
    default: true,
  },
  realTimeEventTabType: {
    type: String,
    default: '',
  },
});

const list = ref();
const urgentMap = new Map([
  ['1', '一般'],
  ['2', '紧急'],
]);

const getData = async (params: any) => {
  list.value = [];
  const realTimeParams = {
    districtCode: params.districtCode,
    eventUrgent: props.realTimeEventTabType,
  };
  const res = await apiIndexPageObj.postRealTime(realTimeParams);
  if (res.data?.length) {
    list.value = res.data.map(e => ({
      id: e.id || e.eventId,
      title: e.title,
      time: e.eventTime,
      name: `${e.eventTypeLName ?? '--'}/${e.eventTypeMName ?? '--'}/${
        e.eventTypeName ?? '--'
      }`,
      address: e.eventAddress,
      showPosition: !isEmpty(e.coordx) && !isEmpty(e.coordy),
      eventUrgentText: `${urgentMap.get(e.eventUrgent) || '--'}`,
      eventUrgent: e.eventUrgent,
      eventStatus: `${e.eventStatus}`,
      convergeStateText: `${e.convergeStateName}`,
      convergeState: `${e.convergeState}`,
      showSelfHandle: e.convergeState === 2,
    }));
  } else {
    list.value = [];
  }
};
getData({ ...searchParams });

const refreshData = () => {
  nextTick(() => {
    getData({ ...searchParams });
  });
};

defineExpose({
  refreshData,
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
