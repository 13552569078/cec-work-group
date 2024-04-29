<template>
  <hv-panel title="话题趋势">
    <template #action>
      <hl-select
        v-model="timeDimension"
        size="sm"
        style="width: calc(var(--xl) * 3.5)"
        class="m-r-md"
        @change="getTrendData"
      >
        <hl-option
          v-for="item in DAY_RANGE_OPTION.filter(
            (val) => val.value !== 1 && val.value !== 2
          )"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></hl-option>
      </hl-select>
      <dict-select
        v-model="platFormCode"
        dictType="event_platform"
        @change="getTrendData"
        class="palt-select"
        style="width: calc(var(--xl) * 5)"
        :full-x="false"
        size="sm"
        placeholder="全平台"
      />
    </template>
    <TopicLine
      v-if="chartData?.topicNameTop5List.length"
      style="height: calc(var(--xl) * 8)"
      :chartData="chartData"
    ></TopicLine>
    <hb-empty
      image-size="0"
      v-if="!chartData?.topicNameTop5List.length"
      description="暂无数据"
      style="height: calc(var(--xl) * 8)"
    />
  </hv-panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import { useTimeSelect } from '@/hooks';
import { DAY_RANGE_OPTION } from '@/common';
import { TopicLine } from '@/views/components/echarts';
import { apiEventAnalysisObj } from '@/apis';
import { IpostTopicTrendSpace } from '@/apis/modules/event-analysis/model';
import { SEARCH_TIME_DEFAULT } from './utils';

const timeDimension = ref(4);
const platFormCode = ref('');
const chartData = ref<IpostTopicTrendSpace.Data>();
const lastSixMonths = [
  dayjs().add(-5, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss'),
  dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
];

const getTrendData = async () => {
  const { startTime, endTime } = useTimeSelect(timeDimension.value);
  const { data } = await apiEventAnalysisObj.postTopicTrend(
    platFormCode.value,
    3,
    endTime,
    startTime
  );
  chartData.value = data;
};

getTrendData();
</script>
