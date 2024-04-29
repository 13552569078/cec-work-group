<template>
  <hv-panel title="近6个月话题监督">
    <template #action>
      <dict-select v-model="platFormCode" dictType="event_platform" @change="getRankData" style="width: calc(var(--xl) * 5)" :full-x="false" placeholder="全平台" size="sm" />
    </template>
    <stripe-list :list="tableData" :cols="COLS" :height="'calc(var(--xl) * 8)'" @row-click="rowClicked" />
    <EventLinkAtlas v-if="atlasVisible" :platFormCode="platFormCode" :topicName="topicName" @close="closeAtlas" />
  </hv-panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import EventLinkAtlas from '@/views/event-analysis/components/event-link-atlas.vue';
import { apiEventAnalysisObj } from '@/apis';
import { IpostTopicRankSpace } from '@/apis/modules/event-analysis/model';
import { COLS } from './utils';

const atlasVisible = ref(false);
const platFormCode = ref('');
const topicName = ref('');
const tableData = ref<IpostTopicRankSpace.Data[]>([]);

const lastSixMonths = [
  dayjs().add(-6, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss'),
  dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss')
];

// 话题target
const rowClicked = (row: any) => {
  topicName.value = row.topicName;
  atlasVisible.value = true;
};
const getRankData = async () => {
  const { data } = await apiEventAnalysisObj.postTopicRank(lastSixMonths[1], platFormCode.value, lastSixMonths[0]);
  tableData.value = data.map(item => {
    return {
      ...item,
      linkRate: item.linkRate === '--' ? '--' + '%' : item.linkRate + '%'
    };
  });
};
const closeAtlas = () => {
  atlasVisible.value = false;
};

getRankData();
</script>
