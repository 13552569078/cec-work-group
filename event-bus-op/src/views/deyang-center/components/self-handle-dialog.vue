<template>
  <common-dialog :title="title" width="calc(var(--xl) * 19.32)" @close="handleClose" class="dialog-search-list">
    <self-handle-event-list :listParams="dialogParams" :listType="dialogType" />
  </common-dialog>
</template>
<script lang="ts" setup>
import SelfHandleEventList from './self-handle-event-list.vue';
const emit = defineEmits(['close']);

const props = defineProps({
  title: {
    type: String,
    default: '事件列表'
  },
  height: {
    type: String,
    default: 'calc(var(--xl) * 17.3)'
  },
  dialogParams: {
    type: Object,
    default: () => ({})
  },
  dialogType: {
    type: String,
    default: 'self'
  },
});

const handleClose = () => {
  emit('close');
};
</script>
<style lang="scss" scoped></style>
