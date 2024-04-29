<template>
  <hv-panel title="事件源监督">
    <template #action>
      <hl-select
        v-model="timeDimension"
        size="sm"
        style="width: calc(var(--xl) * 3)"
        class="m-r-md"
        @change="getData"
      >
        <hl-option
          v-for="item in DAY_RANGE_OPTION.filter((val) => val.value !== 5)"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></hl-option>
      </hl-select>
    </template>
    <hl-group
      style="height: calc(var(--xl) * 6.5); margin-top: calc(var(--xl) * -0.2)"
      class="w-full con-wrap"
      align="item-between"
    >
      <pie-type1
        class="analasis-charts m-t-md"
        style="height: calc(var(--xl) * 6)"
        :charts-data="chartsData"
        title="事件总数"
        :total="eventTotal"
        unit="件"
        :showBackground="false"
      ></pie-type1>
    </hl-group>
    <hl-group
      class="item-list w-full"
      gap="var(--md)"
      style="margin-top: calc(var(--xl) * 0.2)"
    >
      <hl-group class="item p-md w-full" align="items-between items-middle">
        <span class="label">外部系统接入事件</span>
        <hl-group>
          <span
            ><b class="gradient-text m-r-xxs">{{ resData.outSysEventCount }}</b
            ><span class="unit">件</span></span
          >
          <span
            ><b class="gradient-text m-r-xxs">{{ resData.outSysEventRate }}</b
            ><span class="unit">%</span></span
          >
        </hl-group>
      </hl-group>
      <hl-group class="item p-md w-full" align="items-between items-middle">
        <span class="label">重复事件</span>
        <hl-group>
          <span
            ><b class="gradient-text m-r-xxs">{{ resData.repeatEventCount }}</b
            ><span class="unit">件</span></span
          >
          <span
            ><b class="gradient-text m-r-xxs">{{ resData.repeatEventRate }}</b
            ><span class="unit">%</span></span
          >
        </hl-group>
      </hl-group>
    </hl-group>
  </hv-panel>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import dayjs from 'dayjs';
import { useGlobalState, useTimeSelect } from '@/hooks';
import { PieType1 } from '@/views/components/echarts';
import { ECHARTS_COLOR, DAY_RANGE_OPTION } from '@/common';
import { apiEventAnalysisObj } from '@/apis';
import { IpostEventSrcSpace } from '@/apis/modules/event-analysis/model';

const { searchParams } = useGlobalState({
  handleWatch: () => {
    getData();
  },
});

const resData = reactive<IpostEventSrcSpace.Data>({
  eventSrcCountList: [],
  outSysEventCount: 0,
  outSysEventRate: '0',
  repeatEventCount: 0,
  repeatEventRate: '0',
});
const chartsData = ref<any[]>([]);
const eventTotal = ref(0);
const timeDimension = ref(4);
const startTimePadStr = '00:00:00';
const endTimePadStr = '23:59:59';

const getData = async () => {
  const { startTime, endTime } = useTimeSelect(timeDimension.value);
  const { data } = await apiEventAnalysisObj.postEventSrc(endTime, startTime);
  Object.assign(resData, data);
  chartsData.value = resData.eventSrcCountList.map((item, idx) => {
    return {
      name: item.eventSrcName,
      value: item.eventCount,
      unit: '件',
      color: ECHARTS_COLOR[idx % 7],
      isHide: false,
      itemStyle: {
        normal: {
          color: ECHARTS_COLOR[idx % 7],
        },
      },
    };
  });
  eventTotal.value = resData.eventSrcCountList.reduce((pre, current) => {
    return pre + Number(current.eventCount);
  }, 0);
};

getData();
</script>
<style lang="scss" scoped>
.item {
  background-image: url("@/assets/images/eventStat/bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: calc(var(--xl) * 1.6);
}
.label {
  font-size: calc(var(--xl) * 0.56);
}
.gradient-text {
  font-size: calc(var(--xl) * 0.6) !important;
  background: linear-gradient(180deg, #eeeeee 0%, #5eb5ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.unit {
  font-size: calc(var(--xl) * 0.42);
  color: #ffffff;
}
</style>
