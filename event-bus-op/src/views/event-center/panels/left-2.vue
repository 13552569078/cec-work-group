<template>
  <hv-panel title="办理统计">
    <template #action>
      <hl-group class="sort-icon">
        <span>排序</span>
      </hl-group>
      <hl-group
        style="width: calc(var(--xl) * 4);"
        dir="vertical"
        gap="var(--xxs)"
      >
        <hl-select
          class="w-full"
          v-model="mode"
          placeholder="请选择"
          @change="getPlatformStat"
        >
          <hl-option
            v-for="item in tabs"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </hl-select>
      </hl-group>
    </template>
    <history-list :list="list" />
  </hv-panel>
</template>

<script setup lang="ts">
import { ref, inject, watch } from 'vue';
import { HistoryList } from '@/components';

import { apiIndexPageObj } from '@/apis';
import { useGlobalState } from '@/hooks';

const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    mode.value = 1;
    getPlatformStat();
  },
});

const mode = ref(1);

const tabs = [
  {
    label: '接收量',
    value: 1,
  },
  {
    label: '办结率',
    value: 2,
  },
  {
    label: '处置超时率',
    value: 3,
  },
];
const list = ref();

const getPlatformStat = async () => {
  try {
    const params = {
      startTime: searchParams.startTime,
      endTime: searchParams.endTime,
      districtCode: searchParams.district,
      orderByField: mode.value,
    };
    const res = await apiIndexPageObj.getHandle(params);
    if (res.data?.length) {
      list.value = res.data.map(e => ({
        titleValue: e.platformName,
        label1: '接收事件数',
        value1: `${e.evenNum}件`,
        label2: '办结率',
        value2: `${e.completedRate}%`,
        label3: '处置超时率',
        value3: `${e.timeoutRate}%`,
      }));
    } else {
      list.value = [];
    }
  } catch (error) {
    console.log(error);
  }
};

getPlatformStat();
</script>
<style lang="scss" scoped>
.sort-icon {
  margin-right: calc(var(--xl) * 0.45);
  padding-right: calc(var(--xl) * 0.08);
  width: calc(var(--xl) * 1.96);
  height: calc(var(--xl) * 0.9);
  background-image: url(@/assets/images/eventCenter/left-sort.png);
  background-size: 100% 100%;
  // border: 1px solid #758fab;
  padding: 0 calc(var(--xl) * 0.2);
  font-size: calc(var(--xl) * 0.42);
  justify-content: flex-end;
  align-items: center;
  .toggle {
    margin-right: calc(var(--xl) * 0.05);
    --icon-size: calc(var(--md) * 0.7);
  }
}
:deep(.hl-input .input-inner) {
   color: #96BEE0 !important;
}
</style>
