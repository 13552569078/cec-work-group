<template>
  <card-panel title="事件统计" class="left1">
    <template #action>
      <button-group :buttons="buttons" @click="v => tab = v"/>
    </template>
    <overview v-if="tab === 'overview'"></overview>
    <high-frequency-event v-else-if="tab === 'high_frequency_event'"></high-frequency-event>
    <trend-analysis v-else></trend-analysis>
  </card-panel>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ButtonGroup } from '@/components';
import { GlobalAPI } from '@/common';
import { ButtonItem } from '@/types';
import Overview from '../panels/event-stat/overview.vue';
import HighFrequencyEvent from '../panels/event-stat/high-frequency-event.vue';
import TrendAnalysis from '../panels/event-stat/trend-analysis.vue';

const buttons = ref<ButtonItem[]>(GlobalAPI.config.NORMAL_MAP_CONFIG.eventStatistics.tabs);
const tab = ref('overview');
</script>
<style lang="scss" scoped>
.left1 {
  height: 27.407407407407vh;
}
</style>
