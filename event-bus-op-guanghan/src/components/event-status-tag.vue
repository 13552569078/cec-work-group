<template>
<span v-if="handleEmptyStr(EVENT_STATUS_MAPPER[`${eventStatus as keyof typeof EVENT_STATUS_MAPPER}`]) === '--'" class="standard-text">{{ handleEmptyStr(EVENT_STATUS_MAPPER[`${eventStatus as keyof typeof EVENT_STATUS_MAPPER}`]) }}</span>
<div v-else :class="classMethods(eventStatus)" class="p-l-xxs p-r-xxs">
  <span class="standard-text">{{ handleEmptyStr(EVENT_STATUS_MAPPER[`${eventStatus as keyof typeof EVENT_STATUS_MAPPER}`]) }}</span>
</div>
</template>

<script lang='ts' setup>
import { handleEmptyStr } from '@/common';
import { EVENT_STATUS_MAPPER, EVENT_STATUS_CLASS } from '@/views/event-center/constant';

const pros = defineProps({
  eventStatus: {
    type: String,
    default: ''
  }
});

const classMethods = (eventStatus: string) => {
  return `status-${EVENT_STATUS_CLASS[eventStatus as keyof typeof EVENT_STATUS_CLASS] || 'default'}`;
};

</script>

<style lang='scss' scoped>
.status-default {
  color: #2d567c;
  background-color: rgba(181, 206, 227, 1);
}
.status-pending {
  color: #FD892F;
  background-color: rgba(253, 137, 47, 0.24);
}
.status-finished {
  color: #72F5AC;
  background-color: rgba(114, 245, 172, 0.24);
}
.status-cancel {
  color: #2d567c;
  background-color: rgba(181, 206, 227, 1);
}
.status-waiting, .status-unclose, .status-unsubmit {
  color: #FFEA44;
  background-color: rgba(255, 234, 68, 0.24);
}
.status-reject, .status-unverify {
  color: #FD6161;
  background-color: rgba(240, 37, 75, 0.24);
}
</style>
