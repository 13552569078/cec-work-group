<template>
  <hv-panel :title="`${systemName}分布`">
    <template #action>
      <hl-radio-group v-model="radioDateRangeType" custom merge indent @change="handleChangeDateRangeType">
        <hl-radio :label="7">
          <hl-button size="sm">近7天</hl-button>
        </hl-radio>
        <hl-radio :label="30">
          <hl-button size="sm">近30天</hl-button>
        </hl-radio>
        <!-- <hl-radio :label="365">
          <hl-button size="sm">近一年</hl-button>
        </hl-radio> -->
      </hl-radio-group>
    </template>

    <hl-row layout="grid" count="count-2" gap="var(--md)" class="m-t-lg">
      <hl-col v-for="(item, key, index) in alarmDistributionData" :key="index" span="col">
        <hb-data-collect align="items-between" class="border" full="full-x" padding-x="var(--sm)" padding-y="var(--xxs)">
          <cite class="dom-frame"><cite class="dom-frame"></cite></cite>
          <span class="text-secondary font-md">{{ mapperStatus[key] }}</span>
          <hl-group align="items-middle" class="static">
            <em class="font-lg font-bold font-din title">{{ item }}</em>
          </hl-group>
        </hb-data-collect>
      </hl-col>
    </hl-row>

    <hl-radio-group gap="var(--xs)" full v-model="radioPieChartType" class="m-t-lg" custom @change="handleChangePieType">
      <hl-radio label="1">
        <hl-button size="sm" block>按{{ systemName }}等级</hl-button>
      </hl-radio>
      <hl-radio label="2">
        <hl-button size="sm" block>按事件类型</hl-button>
      </hl-radio>
      <hl-radio label="3">
        <hl-button size="sm" block>按主体分组</hl-button>
      </hl-radio>
    </hl-radio-group>
    <hl-group style="height: calc(var(--xxs) * 60)" full="full-x" class="m-t-md">
      <fx-v-pie-chart :chart-data="distPieChartData" :legend="pieLegend"/>
    </hl-group>
    <hl-radio-group gap="var(--xs)" full v-model="radioLineChartType" class="m-t-md" custom @change="handleChangeLineType">
      <hl-radio label="1">
        <hl-button size="sm" block>按趋势</hl-button>
      </hl-radio>
      <hl-radio label="2">
        <hl-button size="sm" block>按时段</hl-button>
      </hl-radio>
    </hl-radio-group>
    <hl-group style="height: calc(var(--xxs) * 96)" full="full-x" class="m-t-md">
      <fx-v-line-chart
        v-if="radioLineChartType === '1' && distLineChartSeriesData"
        :grid="grid"
        :legend="legend"
        :series-data="distLineChartSeriesData"
        :chart-data="distLineChartDataByTrend"
        :tooltip="lineTooltip"
        :dataZoom="dataZoom" />
      <fx-v-stacked-bar-chart
        v-if="radioLineChartType === '2' && distBarChartDataByTime"
        :xAxis="xAxis"
        :grid="grid"
        :legend="distLineChartSeriesData"
        :chart-data="distBarChartDataByTime"
        :legendReal="legend"
        :dataZoom="dataZoom"
        :tooltip="lineTooltip"/>
    </hl-group>
  </hv-panel>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { getDaysBetween } from '@/common/utils';
import { useStatistics, useLoop } from '@/hooks';

const systemName = ref(inject('systemName'));

const { alarmDistributionData, distLineChartDataByTrend, distLineChartSeriesData, distBarChartDataByTime, distPieChartData, getAlarmDistribution, getDisPieChartData, getDisLineChartData, lineTooltip } = useStatistics();

const { setLoop } = useLoop();

// 日期选项 近7天、近30天、近1年
const radioDateRangeType = ref(7);
const dateRange = ref(getDaysBetween(radioDateRangeType.value));
// 饼图选项 - 默认「按报警等级」-1；「按事件类型」 - 2；「按主体分组」- 3；
const radioPieChartType = ref('1');
const radioLineChartType = ref('1');

const mapperStatus = {
  alarmNumber: '接报数',
  autoFinishNumber: '自动办结',
  eventCenterFinishedNumber: '事件中心办结',
  handlingNumber: '处置中',
  judgeRejectedNumber: '误报',
  unJudgeNumber: '待研判'
};

const pieLegend = {
  type: 'scroll',
  pageIconColor: '#fff',
  pageTextStyle: {
    color: '#fff'
  },
};

const dataZoom = ref([
  {
    id: 'dataZoomX',
    type: 'slider',
    xAxisIndex: [0],
    filterMode: 'filter',
    bottom: '5%',
    left: '10',
    // start: 20,
    // end: 80
  }
]);
const xAxis = ref({
  axisLabel: {
    interval: 'auto',
    fontSize: 12,
    color: '#6F8EA8',
    lineHeight: 20,
    margin: 5,
  },
});

const legend = {
  type: 'scroll',
  pageIconColor: '#fff',
  pageTextStyle: {
    color: '#fff'
  },
  top: '0%',
  right: '0%',
  left: 10
};
const grid = {
  top: '40',
  left: '0',
  right: '10',
  bottom: '50',
  containLabel: true
};
const seriesData = [
  {
    label: '重大风险',
    key: 'greatRisk',
    itemStyle: { color: '#FD6161' }
  },
  {
    label: '较大风险',
    key: 'biggerRisk',
    itemStyle: {
      color: '#FB7E00'
    }
  },
  {
    label: '一般风险',
    key: 'normalRisk',
    itemStyle: {
      color: '#D6B800'
    }
  },
  {
    label: '低风险',
    key: 'lowRisk',
    itemStyle: {
      color: '#3E7DFF'
    }
  }
];

const init = () => {
  getAlarmDistribution(dateRange.value);
  getDisPieChartData({
    statisticsTypeCode: radioPieChartType.value,
    ...dateRange.value
  });
  getDisLineChartData({
    statisticsTypeCode: radioLineChartType.value,
    ...dateRange.value
  });
};

init();

// 定时刷新
setLoop(init, 60);

const handleChangeDateRangeType = (val: number) => {
  dateRange.value = getDaysBetween(val);
  init();
};

const handleChangePieType = (val: string) => {
  getDisPieChartData({
    statisticsTypeCode: val,
    ...dateRange.value
  });
};

const handleChangeLineType = (val: string) => {
  getDisLineChartData({
    statisticsTypeCode: val,
    ...dateRange.value
  });
};
</script>
<style lang="scss" scoped>
:deep(.echart-fill-rect){
  margin-right: var(--xxs);
}
</style>
