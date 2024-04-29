<template>
  <hv-panel title="事件信息" size="4">
    <template #action>
      <!-- <c-tabs v-model="eventInfoTabName" :tabs="tabs" /> -->
      <hl-group style="width: calc(var(--xl) * 4);" dir="vertical" gap="var(--xxs)">
        <hl-select  style="position: absolute; top: calc(var(--xxs) * -2); right: 0;" class="w-full" size="sm" v-model="eventInfoTabName" placeholder="请选择">
          <hl-option v-for="item in tabs" :key="item.value" :label="item.label" :value="item.value" />
        </hl-select>
      </hl-group>
    </template>
    <hl-scrollbar style="height: calc(var(--xl) * 28); background-color: #091728;">
      <event-info :data="eventDetail" v-if="eventInfoTabName === 'baseInfo'" class="w-full"
        style="margin-top: calc(var(--xl) * 0.6)" />
      <event-handle-process :data="eventDetail" v-else-if="eventInfoTabName === 'handleFlow'"
        style="height: calc(var(--xl) * 23.68); margin-top: calc(var(--xl) * 0.6)" />
      <event-radius-query :eventDetail="eventDetail" v-else-if="eventInfoTabName === 'radiusQuery'"
        style="height: calc(var(--xl) * 23.68); margin-top: calc(var(--xl) * 0.6)" class="w-full" />
    </hl-scrollbar>
  </hv-panel>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useGlobalState } from '@/hooks';

const { eventInfoTabName, currentMode } = useGlobalState();
const props = defineProps({
  eventDetail: {
    default: () => {
      return {};
    }
  }
});

const tabs = [
  {
    label: '基本信息',
    value: 'baseInfo'
  },
  {
    label: '处置流程',
    value: 'handleFlow'
  },
  {
    label: '半径查询',
    value: 'radiusQuery'
  }
];

watch(eventInfoTabName, val => {
  if (val === 'radiusQuery') {
    currentMode.value = 'bufferSearch';
  } else {
    currentMode.value = '';
  }
});

</script>
