<template>
  <event-list
    :list="list"
    :platTypeStyle="'cluster'"
    @clickLocation="handleClose"
  ></event-list>
</template>
<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { isEmpty } from 'lodash-es';
import mockSelfRes from './mockSelfRes';

const props = defineProps({
  clusterInfo: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['close']);

const list = ref([]);

const getList = async () => {
  const resList = props.clusterInfo.data.map((e: any) => e.properties.event);
  // const resList = mockSelfRes.data.list;
  if (resList?.length) {
    list.value = resList.map(e => {
      if (e.dealStatus) {
        return {
          title: e.eventTitle,
          name: `${e.eventTypeMaxName ?? '--'}/${e.eventTypeMiddleName ?? '--'}/${
            e.eventTypeName ?? '--'
          }`,
          address: e.eventAddress,
          coordx: e.coordx,
          coordy: e.coordy,
          id: e.id,
          time: e.eventTime,
          customEventType: 'self',
          eventStatus: e.dealStatus,
          dealStatus: e.dealStatus,
          overtimeFlag: e.overTimeFlag,
          showSelfHandle: true,
        };
      } else {
        return {
          id: e.id || e.eventId,
          title: e.title,
          time: e.eventTime,
          name: `${e.eventTypeLName ?? '--'}/${e.eventTypeMName ?? '--'}/${
            e.eventTypeName ?? '--'
          }`,
          address: e.eventAddress,
          showPosition: !isEmpty(e.coordx) && !isEmpty(e.coordy),
          value1: e.sendPlatform,
          value2: e.receivePlatform,
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
          ],
        };
      }
    });
  } else {
    list.value = [];
  }
};
getList();

const handleClose = () => {
  emit('close');
};

defineExpose({ getList });
</script>
<style lang="scss" scoped></style>
./mockSelfRes
