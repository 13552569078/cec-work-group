<template>
  <hv-panel title="近6个月话题趋势">
    <template #action>
      <dict-select v-model="platFormCode" dictType="event_platform" @change="getTrendData" class="palt-select" style="width: calc(var(--xl) * 5)" :full-x="false" size="sm" placeholder="全平台" />
    </template>
    <TopicLine v-if="chartData?.topicNameTop5List.length" style="height: calc(var(--xl) * 8)" :chartData="chartData"></TopicLine>
    <hb-empty image-size="0" v-if="!chartData?.topicNameTop5List.length" description="暂无数据" style="height: calc(var(--xl) * 8)" />
  </hv-panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import { TIME_RANGE_OPTION } from '@/common';
import { TopicLine } from '@/views/components/echarts';
import { apiEventAnalysisObj } from '@/apis';
import { IpostTopicTrendSpace } from '@/apis/modules/event-analysis/model';
import { SEARCH_TIME_DEFAULT } from './utils';

const timeDimension = 3;
const platFormCode = ref('');
const chartData = ref<IpostTopicTrendSpace.Data>();
const lastSixMonths = [
  dayjs().add(-6, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss'),
  dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss')
];

const getTrendData = async () => {
  const { data } = await apiEventAnalysisObj.postTopicTrend(platFormCode.value, timeDimension, lastSixMonths[1], lastSixMonths[0]);
  chartData.value = data;
};

getTrendData();
</script>
