<template>
  <card-panel title="事件概览" :class="['left1', expandable ? 'card-expandable' : '']">
    <template #action>
      <button-group :buttons="tabs" @click="v => tab = v"/>
      <expandable-button mark="left1" />
    </template>
    <event-detail v-if="tab === 'EventDetail'" />
    <event-progress v-if="tab === 'EventProgress'"/>
  </card-panel>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { ButtonGroup, ExpandableButton } from '@/components';
import { ButtonItem, ExpandableCardParams } from '@/types';
import { ExpandableCardParamsKey, GlobalAPI } from '@/common';
import EventDetail from '../panels/event-overview/event-detail.vue';
import EventProgress from '../panels/event-overview/event-progress.vue';

const { left1: expandable } = inject<ExpandableCardParams>(ExpandableCardParamsKey)!;

const tabs = ref<ButtonItem[]>(GlobalAPI.config.WARTIME_MAP_CONFIG.eventOverview.tabs);
const tab = ref('EventDetail');

</script>
<style lang="scss" scoped>
.left1 {
  height: 30.37037037033333vh;
}
</style>
