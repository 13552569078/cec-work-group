<template>
  <hl-dialog
    :model-value="$props.modelValue"
    :append-to-body="true"
    width="90%"
    full-body
    @closed="handleClosed">
    <template #title>
      <div class="panel-header-left">
        <hl-tabs v-model="activeNameCurrent" type="line" :show-pane="false" style="flex-grow: 1" nav-height="calc(var(--xxs) * 18)">
          <hl-tab-pane :label="`${systemName}详情`" name="detail" v-if="activeName === 'detail'"/>
          <hl-tab-pane label="监测数据" name="data" />
        </hl-tabs>
      </div>
      <div class="w-full"></div>
    </template>
    <modal-event-info v-if="activeNameCurrent === 'detail'" :eventId="$props.eventId"/>
    <modal-event-monitor-data v-else :eventId="$props.eventId" :startTime="$props.startTime"/>
  </hl-dialog>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import modalEventInfo from './modalEventInfo.vue';
import modalEventMonitorData from './modalEventMonitorData.vue';

const props = defineProps({
  modelValue: Boolean,
  eventId: String,
  activeName: String,
  startTime: String
});
const activeNameCurrent = ref(props.activeName);
const emit = defineEmits(['update:modelValue']);

const systemName = ref(inject('systemName'));
const handleClosed = () => {
  emit('update:modelValue', false);
};
</script>

<style lang="scss">
</style>
