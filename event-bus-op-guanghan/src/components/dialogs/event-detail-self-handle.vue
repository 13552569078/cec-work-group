<template>
  <common-dialog title="事件详情" width="calc(var(--xl) * 29.58)" @close="$emit('close')">
    <hl-group class="w-full" full gap="var(--md)" dir="vertical">
      <hl-scrollbar style="height: calc(var(--xl) * 22)">

        <hl-group class="w-full" dir="vertical">
          <c-label class="m-b-md">基本信息</c-label>
          <event-info-self-handle :data="eventDetail" class="w-full" />
        </hl-group>

        <hl-group class="w-full" dir="vertical">
          <c-label class="m-b-md" :isLong="true">自处置情况</c-label>
          <event-status-self-handle :data="eventDetail" class="w-full" />
        </hl-group>
      </hl-scrollbar>
    </hl-group>
  </common-dialog>

</template>

<script lang="ts" setup>
import { useEventData, useGlobalState, useMapData } from '@/hooks';
import { FillWarning } from '@hongluan-ui/icons';

const props = defineProps({
  id: String
});

const emits = defineEmits(['close']);

const { eventDetailSelfHandle: eventDetail, getEventSelfHandleDetail: getEventDetail } = useEventData();

const fetchData = async () => {
  await getEventDetail(props.id as string);
};

fetchData();
</script>

<style lang="scss" scoped>
.label-value {
  color: #d0deee;
}
</style>
