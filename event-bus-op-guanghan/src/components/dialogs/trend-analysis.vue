<template>
  <common-dialog
    title="趋势分析"
    style="width:calc(var(--xl) * 29.32);"
  >
    <hl-group
      class="trend-area w-full"
      dir="vertical"
    >
      <hl-group
        class="search-area w-full"
        align="items-between"
      >
        <hl-group>
          <hl-group class="search-label" align="items-middle">平台选择</hl-group>
          <hl-group style="width: calc(var(--xl) * 5);">
            <dict-select v-model="trendCommonParams.platformCode" dictType="event_platform" class="w-full"/>
          </hl-group>
        </hl-group>
        <hl-group>
          <hl-group class="search-label" align="items-middle">地区选择</hl-group>
          <hl-group style="width: calc(var(--xl) * 5);">
            <area-select v-model="trendCommonParams.districtCode" />
          </hl-group>
        </hl-group>
        <hl-group>
          <hl-group class="search-label" align="items-middle">是否超时</hl-group>
          <dict-select v-model="trendCommonParams.overtimeFlag" :data="OVERTIME_OPTION"/>
        </hl-group>
      </hl-group>
      <hl-group class="analysis-area">
        <hl-group
          style="width: calc(var(--xl) * 14.27);"
          dir="vertical"
        >
          <c-label>事件量分析</c-label>
          <hl-group
            class="trend-content"
            dir="vertical"
          >
            <hl-group dir="vertical">
              <hl-group align="items-middle">
                <span class="m-r-xs">时间维度</span>
                <c-tabs
                  v-model="mode"
                  :tabs="TIME_RANGE_OPTION"
                  @update:modelValue="changeMode"
                />
              </hl-group>
              <hl-group style="height: calc(var(--xl) * 5.8);margin: calc(var(--xl) * 0.6) 0;" full="full-x">
                <EventAnalysisBar v-if="showCondition" :chartData="barData" />
                <EventAnalysisBar2 v-else :chartData="barData"/>
              </hl-group>
            </hl-group>
            <hl-group dir="vertical">
              <hl-group align="items-middle">
                <span class="m-r-xs">事件类型</span>
                <hl-group  style="width: calc(var(--xl) *  6.2);"><event-type-select v-model="eventType" :platform="trendCommonParams.platformCode" @update:modelValue="changeType" :hasDefaultValue="true" :showAll="true"/></hl-group>
              </hl-group>
              <hl-group style="height: calc(var(--xl) *  5.8);margin: calc(var(--xl) * 0.6) 0;" full="full-x">
                <EventAnalysisLine v-if="showCondition" :chartData="lineData" />
                <EventAnalysisLine2 v-else :chartData="lineData" />
              </hl-group>
            </hl-group>
          </hl-group>
        </hl-group>
        <hl-group
          style="margin-left:calc(var(--xl) * 0.6);flex: 1;"
          dir="vertical"
        >
          <c-label>环比分析</c-label>
          <hl-group class="way-title">
              <c-tabs
                v-if="!showCondition"
                v-model="way"
                :tabs="wayTabs"
                @update:modelValue="changeWay"
              />
            </hl-group>
          <hl-group
            class="trend-content w-full"
            dir="vertical"
          >
            <hl-group align="items-middle">
              <span class="static m-r-xs">时间选择</span>
              <quarter-time-select
              ref="quarterSelectRef"
              v-model="quarterAndMonthTimeObj"
              @change="getQoqAnalysis"
              :quarterWidth="'calc(var(--xl) * 2.59);'"
              :monthWidth="'calc(var(--xl) * 2.59);'"
              />
            </hl-group>
            <stripe-list :list="list" :cols="cols" :height="'calc(var(--xxl) * 11.95);'" style="margin-top:calc(var(--xl) * 0.6);"/>
          </hl-group>
        </hl-group>
      </hl-group>
    </hl-group>
  </common-dialog>
</template>

<script lang='ts' setup>
import { ref, inject, watch, computed } from 'vue';
import { StripeList } from '@/components';
import { EventAnalysisBar, EventAnalysisLine, EventAnalysisBar2, EventAnalysisLine2 } from '@/views/components/echarts';
import { apiIndexPageObj } from '@/apis';

import { OVERTIME_OPTION, DEFAULT_SET_TIME, TIME_RANGE_OPTION, getQuarterAndMonthTime } from '@/common';
import { useGlobalState } from '@/hooks';

const { defaultAreaId } = useGlobalState();

// 默认为当年当月
const quarterAndMonthTimeObj = ref({
  year: new Date().getFullYear() + '',
  quarter: '',
  month: (new Date().getMonth() + 1 + '').padStart(2, '0'),
});
const quarterSelectRef = ref();
const trendCommonParams = ref({
  // districtCode: 58723,
  // districtCode: +(process.env.DEFAULT_AREA_ID as string),
  districtCode: defaultAreaId.value,
  platformCode: '100',
  overtimeFlag: '',
});

const defaultPlatformCode = ('100');
const showCondition = computed(() => trendCommonParams.value.platformCode === defaultPlatformCode);

const eventType = ref();

const mode = ref(1);
const way = ref(1);
const wayTabs = [
  {
    label: '发起',
    value: 1,
  },
  {
    label: '接收',
    value: 2,
  },
];

const cols = [
  {
    title: '序号',
    minWidth: '2em',
    align: 'left',
    slotName: 'tableIndex',
    fixed: 'left'
  },
  { title: '事件类型', prop: 'eventType' },
  { title: '事件数', prop: 'eventNum' },
  { title: '环比', prop: 'linkRate' },
];
const list = ref();
const barData = ref();
const lineData = ref();
let isInit = true;

const getQoqAnalysis = async () => {
  let timeArr = [];
  timeArr = isInit || quarterSelectRef.value?.quarterAndMonthTimeValue.length === 0 ? getQuarterAndMonthTime(DEFAULT_SET_TIME) : quarterSelectRef.value?.quarterAndMonthTimeValue;
  const params = {
    startTime: timeArr[0],
    endTime: timeArr[1],
    ...trendCommonParams.value,
    direction: trendCommonParams.value.platformCode === '100' ? '' : way.value
  };
  const res = await apiIndexPageObj.getQoqAnalysis(params);
  if (res.data.length) {
    list.value = res.data.map(e => ({
      ...e,
      linkRate: e.linkRate === '-' || e.linkRate === '--%' ? e.linkRate : `${e.linkRate}%`
    }));
  } else {
    list.value = [];
  }

  isInit = false;
};

const getEventNumAnalysis = async (isChangeType?:boolean) => {
  const params = {
    eventType: eventType.value,
    timeDimension: mode.value,
    ...trendCommonParams.value
  };
  const res = await apiIndexPageObj.getEventNumAnalysis(params);
  if (!isChangeType) {
    barData.value = res.data;
  }
  lineData.value = res.data;
};

getQoqAnalysis();
getEventNumAnalysis();

const changeTime = () => {
  getQoqAnalysis();
};

const changeType = () => {
  getEventNumAnalysis(true);
};

const changeMode = () => {
  getEventNumAnalysis();
};

const changeWay = () => {
  getQoqAnalysis();
};

watch(trendCommonParams, () => {
  getQoqAnalysis();
  getEventNumAnalysis();
}, {
  deep: true
});

</script>

<style lang="scss" scoped>
.trend-area {
  font-size: calc(var(--xl) * 0.48);
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #ffffff;
  .search-area {
    .search-label {
      width: calc(var(--xl) * 2.32);
    }
  }
  .analysis-area {
    position: relative;
    margin-top: calc(var(--xl) * 1.2);
    .trend-title {
      font-size: calc(var(--xl) * 0.6);
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    }
    .way-title {
      position: absolute;
      right: calc(var(--xl) * 0.3);
      top: calc(var(--xl) * 0.1);
    }
    .trend-content {
      margin-top: calc(var(--xl) * 0.6);
      padding: calc(var(--xl) * 0.6);
      background: rgba(43, 59, 72, 0.546);
      border-radius: 4px;
      // opacity: 0.7;
    }
  }

}
</style>
