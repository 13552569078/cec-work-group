<template>
  <hv-panel title="话题监督">
    <template #action>
      <hl-select
        v-model="timeDimension"
        size="sm"
        style="width: calc(var(--xl) * 3.5)"
        class="m-r-md"
        @change="getRankData"
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
        @change="getRankData"
        style="width: calc(var(--xl) * 5)"
        :full-x="false"
        placeholder="全平台"
        size="sm"
      />
    </template>
    <stripe-list
      :list="tableData"
      :cols="COLS"
      :height="'calc(var(--xl) * 8)'"
      @row-click="rowClicked"
    />
    <EventLinkAtlas
      v-if="atlasVisible"
      :platFormCode="platFormCode"
      :topicName="topicName"
      :recent20Flag="1"
      @close="closeAtlas"
    />
  </hv-panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import { useTimeSelect } from '@/hooks';
import { DAY_RANGE_OPTION } from '@/common';
import EventLinkAtlas from '@/views/event-analysis/components/event-link-atlas.vue';
import { apiEventAnalysisObj } from '@/apis';
import { IpostTopicRankSpace } from '@/apis/modules/event-analysis/model';
import { COLS } from './utils';

const atlasVisible = ref(false);
const platFormCode = ref('');
const topicName = ref('');
const tableData = ref<IpostTopicRankSpace.Data[]>([]);
const timeDimension = ref(4);

const lastSixMonths = [
  dayjs().add(-5, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss'),
  dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
];

// 话题target
const rowClicked = (row: any) => {
  topicName.value = row.topicName;
  atlasVisible.value = true;
};
const getRankData = async () => {
  const { startTime, endTime } = useTimeSelect(timeDimension.value);
  const { data } = await apiEventAnalysisObj.postTopicRank(
    endTime,
    platFormCode.value,
    startTime
  );
  tableData.value = data.map(item => {
    return {
      ...item,
      linkRate: item.linkRate === '--' ? '--' + '%' : item.linkRate + '%',
    };
  });
  tableData.value = [];
};
const closeAtlas = () => {
  atlasVisible.value = false;
};

getRankData();
</script>
