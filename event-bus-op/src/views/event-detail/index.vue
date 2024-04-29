<template>
  <hl-group dir="vertical" gap-x="var(--md)" gap-y="calc(var(--xs)* 1.5)" class="page-left">
    <left-1 :event-id="eventId" :eventDetail="eventDetail" />
  </hl-group>
  <hl-group dir="vertical" gap-x="var(--md)" gap-y="calc(var(--xs)* 1.5)" class="page-right">
    <right-1 v-if="showRight1" :event-id="eventId" :event-title="eventDetail?.title" />
    <right-2 :event-id="eventId" :event-detail="eventDetail" v-if="eventDetail?.id" />
  </hl-group>
</template>

<script setup lang="ts">
import { computed, watch, inject, nextTick, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useEventData, useGlobalState, useMapData, useMapTools } from '@/hooks';
import { EVENT_ICON_SIZE_FOCUS } from '@/common';
import left1 from './panels/left-1.vue';
import right1 from './panels/right-1.vue';
import right2 from './panels/right-2.vue';

const reload: any = inject('reload');

const route = useRoute();
const { eventDetail, getEventDetail } = useEventData();
const { eventMapWrapper, setEventData } = useMapData();
const { handleCloseBufferSearchPanel, currentEventId, currentEventCode } = useGlobalState();
const { flyToLast, flyTo, closeBuffer } = useMapTools();

const showRight1 = ref(false);

const eventId = computed(() => {
  return route.query.eventId;
});

watch(eventId, n => {
  n && reload();
  currentEventId.value = n as string;
  nextTick(() => {
    handleCloseBufferSearchPanel();
    flyToLast();
    closeBuffer();
  });
});

watch(() => currentEventId.value, n => {
  if (!n) {
    currentEventId.value = eventId.value as string;
    currentEventCode.value = eventDetail.value?.eventCode as string;
  }
});

const fetchData = async () => {
  currentEventId.value = eventId.value as string;
  await getEventDetail(eventId.value as string);
  showRight1.value = true;
};

fetchData();

const updateEventPoint = (event: any) => {
  const mapData = eventMapWrapper(event.value, EVENT_ICON_SIZE_FOCUS);
  setEventData([mapData]);
  flyTo(
    {
      center: mapData.coordinates,
      zoom: 14
    },
    true
  );
};

watch(
  () => eventDetail.value,
  (val: any) => {
    if (Object.keys(val).length) {
      updateEventPoint(eventDetail);
    }
  }
);
</script>

<style lang="scss" scoped>
.today-condition {
  position: absolute;
  top: calc(var(--xxs) * 24);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.float-number {
  position: absolute;
  left: size(32px);
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
}
</style>
