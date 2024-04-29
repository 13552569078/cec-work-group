<template>
  <card-panel title="指挥中枢" :class="['left2']">
    <template #action>
      <button-group :buttons="buttons" @click="v => tab = v"/>
    </template>
    <event-handle v-if="tab === 'EventHandle'"/>
    <dispose-suggest v-else-if="tab === 'DisposeSuggest'" />
    <knowledge-recommend v-else-if="tab === 'KnowledgeRecommend'" />
  </card-panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ButtonGroup } from '@/components';
import { ButtonItem } from '@/types';
import { GlobalAPI } from '@/common';
import DisposeSuggest from '../panels/command-center/dispose-suggest.vue';
import EventHandle from '../panels/command-center/event-handle.vue';
import KnowledgeRecommend from '../panels/command-center/knowledge-recommend.vue';

const buttons = ref<ButtonItem[]>(GlobalAPI.config.WARTIME_MAP_CONFIG.commandCenter.tabs);
const tab = ref('EventHandle');
</script>
<style lang="scss" scoped>
.left2 {
  // height: 31.851851851851853vh;
  height: 29.72222222222222vh;
}
</style>
