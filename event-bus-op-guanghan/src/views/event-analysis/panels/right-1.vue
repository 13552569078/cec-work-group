<template>
  <hv-panel title="监督预警视图">
    <hl-group class="time-area" align="items-middle">
      <hl-group class="time-label">预警时间</hl-group>
      <hl-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :clearable="false"
        value-format="YYYY-MM-DD HH:mm:ss"
        @change="resetAllData"
      />
    </hl-group>
    <common-inner-title class="m-t-xs">
      <template #left>
        <hl-group full="full-x" gap="var(--xxs)" align="items-middle">
          预警数<span class="count yellow-font font-din count-font-size">{{
            superVisionData.warningCount
          }}</span
          >次
        </hl-group>
      </template>
      <template #right>
        <hl-group full="full-x" gap="var(--xxs)" align="items-middle">
          环比<span class="count font-din green-font count-font-size">{{
            superVisionData?.chainRatio
          }}</span
          >%
        </hl-group>
      </template>
    </common-inner-title>
    <hl-group class="w-full" style="height: calc(var(--xl) * 27.5)" dir="vertical">
      <hl-group style="height: calc(var(--xl) * 9.18)">
        <hl-group
          style="height: calc(var(--xl) * 6.4); margin-top: calc(var(--xl) * 0.5)"
          class="w-full con-wrap"
          align="item-between"
        >
          <PieType1
            class="analasis-charts"
            :charts-data="chartsData"
            title="预警总数"
            unit="次"
            :total="superVisionData.warningCount"
          ></PieType1>
        </hl-group>
      </hl-group>
      <hl-group class="search-area" align="items-middle">
        <hl-group class="search-label">预警名称</hl-group>
        <hl-input
          class="seach-name"
          v-model="warningParams.warningEventName"
          clearable
          @blur="resetPage"
          @clear="resetPage"
          size="sm"
        ></hl-input>
        <hl-group class="search-label">预警类型</hl-group>
        <hl-select
          class="seach-name"
          v-model="warningParams.warningType"
          @change="resetPage"
          size="sm"
        >
          <hl-option
            v-for="item in PRE_TYPE_OPTION"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></hl-option>
        </hl-select>
      </hl-group>
      <event-list
        :list="list"
        :platTypeStyle="'simple'"
        :height="'calc(var(--xl) * 14.4)'"
      />
      <hl-group dir="horizontal" class="page-content m-t-md w-full">
        <hl-group align="items-middle">
          <span>事件数/</span>
          <span class="page-count">{{ total }}</span>
          件
        </hl-group>
        <hl-pagination
          size="sm"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="total"
          align="items-between"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </hl-pagination>
      </hl-group>
    </hl-group>
    <repeat-event-detail
      v-if="repeatEventVisible"
      :id="currentRepeatEventId"
      @close="repeatEventVisible = false"
    />
  </hv-panel>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Indexable } from 'fx-front-utils';
import { PieType1 } from '@/views/components/echarts';
import { PRE_TYPE_OPTION, ECHARTS_COLOR } from '@/common';
import { useGlobalState, useRepeatEvent, useDate } from '@/hooks';

import { apiEventAnalysisObj } from '@/apis';
import { isEmpty } from 'lodash-es';
import RepeatEventDetail from '@/views/event-analysis/components/repeat-event-detail.vue';
const { dateRange } = useDate('last30Days');

const {
  repeatEventVisible,
  handleShowRepeatEvent,
  currentRepeatEventId,
} = useRepeatEvent();

const chartsData = ref<any[]>([]);
const superVisionData = reactive<Indexable<string>>({});

const warningParams = ref({
  warningType: '',
  warningEventName: '',
});
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);
const list = ref();

const getEventList = async () => {
  const params = {
    startTime: dateRange.value[0],
    endTime: dateRange.value[1],
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    ...warningParams.value,
  };
  const res = await apiEventAnalysisObj.list(params);
  if (res.data.list.length) {
    list.value = res.data.list.map(e => ({
      id: e.id,
      title: e.title,
      time: e.eventTime,
      name: `${e.eventTypeLName ?? '--'}/${e.eventTypeMName ?? '--'}/${
        e.eventTypeName ?? '--'
      }`,
      address: e.eventAddress,
      showPosition:
        e.warningType === 1 ? !isEmpty(e.coordx) && !isEmpty(e.coordy) : false,
      label1: '发起平台',
      value1: e.platformSrcName,
      label2: '预警类型',
      value2: PRE_TYPE_OPTION.find(j => j.value === e.warningType)?.label,
      warningType: e.warningType,
      showRepeat: e.warningType === 1,
    }));
    total.value = res.data.total;
  } else {
    list.value = [];
    total.value = 0;
  }
};
const colors = ['#A1D5FF', '#3FFF96'];
const getChartData = async () => {
  const params = {
    startTime: dateRange.value[0],
    endTime: dateRange.value[1],
  };
  const { data } = await apiEventAnalysisObj.postOverview(params);
  Object.assign(superVisionData, data);
  chartsData.value = [
    {
      name: '重复诉求预警',
      value: data?.repeatWarningCount ?? 0,
      unit: '次',
      color: colors[0],
      isHide: false,
      itemStyle: {
        normal: {
          color: colors[0],
        },
      },
    },
    {
      name: '即将超期预警',
      value: data?.outtimeWarningCount ?? 0,
      unit: '次',
      color: colors[1],
      isHide: false,
      itemStyle: {
        normal: {
          color: colors[1],
        },
      },
    },
  ];
};
getEventList();
getChartData();

const resetAllData = () => {
  getChartData();
  resetPage();
};

const resetPage = () => {
  currentPage.value = 1;
  getEventList();
};

const handleSizeChange = () => {
  console.log('handleSizeChange');
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getEventList();
};
</script>
<style lang="scss" scoped>
.time-area {
  margin-top: calc(var(--xl) * 0.16);
  font-size: calc(var(--xl) * 0.48);
  .time-label {
    width: calc(var(--xl) * 2.32);
    margin-right: calc(var(--xl) * 0.32);
  }
}
.search-area {
  font-size: calc(var(--xl) * 0.48);
  .search-label {
    width: calc(var(--xl) * 1.92);
    margin-right: calc(var(--xl) * 0.32);
  }
  .seach-name {
    margin-right: calc(var(--xl) * 0.48);
    width: calc(var(--xl) * 4);
  }
}

.page-content {
  justify-content: space-between;
  font-size: calc(var(--xl) * 0.48);
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;

  .page-count {
    color: #36b7ff;
  }
}

.count {
  font-size: calc(var(--xl) * 0.64);
}
</style>
