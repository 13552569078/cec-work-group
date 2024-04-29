<template>
  <hv-panel title="事件列表">
    <div v-if="total > 0" class="standard-text">查询结果<span class="hilight-num m-l-xxs m-r-xxs">{{ total }}</span>条</div>
    <template v-if="eventTabType === 'manual'">
      <origin-event-list ref="originEventList" :params="eventSearchParams" :autoTrigger="false" height="calc(var(--xl) * 25)" @update="handleUpdate"/>
    </template>
    <template v-else>
      <self-handle-event-list ref="selfHandleEventList" :params="eventSearchParams" :autoTrigger="false" height="calc(var(--xl) * 25)" @update="handleUpdate" />
    </template>

  </hv-panel>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useGlobalState, useMapData } from '@/hooks';
import { useMapTools } from '@/hooks';
import OriginEventList from '../components/origin-event-list.vue';
import SelfHandleEventList from '../components/self-handle-event-list.vue';

const { eventSearchParams, eventTabType } = useGlobalState();
const { eventData, eventMapWrapper, selfHnadleEventMapWrapper } = useMapData();

const props = defineProps({
  eventStatus: {
    type: String,
    default: ''
  }
});

const { flyTo } = useMapTools();

const total = ref(0);

const originEventList = ref();
const selfHandleEventList = ref();

const searchRefMapper = {
  manual: originEventList,
  selfHandling: selfHandleEventList
};

const handleUpdate = (eventList: any) => {
  total.value = eventList.total || eventList.totalRow || 0;

  eventData.value = eventList.list && eventList.list.length
    ? eventList.list.filter((item: any) => !isNaN(+item.coordx) && !isNaN(+item.coordy)).map((point: any) => {
      if (point.dealStatus !== undefined) {
        return selfHnadleEventMapWrapper(point);
      } else {
        return eventMapWrapper(point);
      }
    })
    : [];

  if (eventData.value.length) {
    flyTo({
      center: eventData.value[0].coordinates,
      zoom: 13
    });
  }
};

const search = () => {
  searchRefMapper[eventTabType.value as keyof typeof searchRefMapper].value.search();
};

const reset = () => {
  searchRefMapper[eventTabType.value as keyof typeof searchRefMapper].value.reset();
  total.value = 0;
};

watch(eventTabType, () => {
  total.value = 0;
});

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
  color: #96BEE0 !important;
}

.hilight-num {
  color: #FFC97A;
  font-size: calc(var(--xl) * 1);
  font-family: 'din';
}
</style>
