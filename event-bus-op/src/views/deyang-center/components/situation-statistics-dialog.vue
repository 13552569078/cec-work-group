<template>
  <common-dialog title="态势统计" width="calc(var(--xxs) * 337)" @close="handleClose" class="dialog-search-list">
    <template #right>
      <span>{{ areaAndTime }}</span>
    </template>
    <hl-group full gap-x="calc(var(--xxs) * 4)">
      <div class="title-bg-1 display-flex">
        <span class="title-label">维度名称</span>
        <span class="value flex-auto text-center">{{ DimensionMap[dimension] || '--' }}</span>
      </div>
      <div class="title-bg-1 display-flex">
        <span class="title-label">指标名称</span>
        <span class="value flex-auto text-center">{{ indicatorname }}</span>
      </div>
    </hl-group>
    <hl-row gap-x="calc(var(--xxs) * 4)">
      <hl-col :span="8">
        <SimpleTitle2 title="事件来源列表" class="m-y-md" />
        <stripe-list :list="eventSourceList" :cols="eventSourceCols" :height="'calc(var(--xxs) * 60)'" />
      </hl-col>
      <hl-col :span="16">
        <SimpleTitle2 title="趋势分析图表" class="m-y-md" />
        <TrendAnalysisChart v-if="trendAnalysisChartData" :data="trendAnalysisChartData" style="height:calc(var(--xxs) * 60)" />
      </hl-col>
      <hl-col :span="8">
        <SimpleTitle2 title="流入类型图表" class="m-y-md" />
        <InflowTypeChart v-if="inflowTypeChartData" :data="inflowTypeChartData" style="height:calc(var(--xxs) * 45.5)" />
      </hl-col>
      <hl-col :span="16">
        <SimpleTitle2 title="事件列表" class="m-y-md" />
        <!-- <stripe-list :list="eventList" :cols="eventCols" :height="'calc(var(--xxs) * 45.5)'"/> -->
        <event-progress-list :list="eventList" :cols="eventCols" :height="'calc(var(--xxs) * 45.5)'" />
        <hl-pagination class="m-t-sm" size="sm" :current-page="pagination.currentPage" :page-size="pagination.pageSize" layout="total, prev, pager, next" :total="pagination.total" align="items-right" @current-change="pageList" style="float: right;"></hl-pagination>
      </hl-col>
    </hl-row>
  </common-dialog>
</template>
<script lang="ts" setup>
import { ref, computed, reactive } from 'vue';
import { useGlobalState } from '@/hooks';
import { apiIndexPageObj } from '@/apis';
import TrendAnalysisChart from './trend-analysis-chart.vue';
import InflowTypeChart from './inflow-type-chart.vue';
const emit = defineEmits(['close']);
const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    // getData({ ...params });
  },
});
const areaAndTime = computed(() => {
  const districtName = searchParams.districtName || '--';
  const startTime = `${searchParams.startTime || '--'}`;
  const endTime = `${searchParams.endTime || '--'}`;
  return `(${districtName || '--'}，${startTime.split(' ')[0]} 至 ${endTime.split(' ')[0]})`;
});
const DimensionMap = {
  1: '事件类型',
  2: '事件地区',
  3: '紧急程度',
  4: '事件来源',
};

const props = defineProps({
  height: {
    type: String,
    default: 'calc(var(--xl) * 17.3)'
  },
  dimensionValue: {
    type: [Number, String],
    default: ''
  },
  dimension: {
    type: String,
    default: '--'
  },
  indicatorname: {
    type: String,
    default: '--'
  }
});
const eventSourceList = ref();
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});
const eventList = ref();
const trendAnalysisChartData = ref();
const inflowTypeChartData = ref();
const eventSourceCols = [
  {
    title: '',
    minWidth: '2em',
    align: 'left',
    slotName: 'tableIndex',
    fixed: 'left',
  },
  {
    title: '平台名称',
    prop: 'platformName',
  },
  {
    title: '事件数',
    prop: 'num',
  },
];
const eventCols = [
  {
    title: '',
    minWidth: '2em',
    align: 'left',
    slotName: 'tableIndex',
    fixed: 'left',
  },
  {
    title: '发生时间',
    prop: 'eventTime',
    minWidth: '12em',
  },
  {
    title: '事件标题',
    prop: 'title',
    minWidth: '9em',
    showTooltip: true,
  },
  {
    title: '事件类型',
    prop: 'eventTypeName',
    minWidth: '10em',
    showTooltip: true,
  },
  {
    title: '发起平台',
    prop: 'sendPlatformName',
    maxWidth: '10em',
    showTooltip: true,
  },
  {
    title: '接收平台',
    prop: 'receivePlatform',
    maxWidth: '10em',
    showTooltip: true,
  },
  {
    title: '流入类型',
    prop: 'inflowTypeName',
    minWidth: '5em',
  },
  {
    title: '事件流程',
    minWidth: '10em',
    slotName: 'eventProgress',
  },
  {
    title: '超时状态',
    prop: 'overtimeStatus',
    minWidth: '10em',
  },
];
const situationAnalysisStatEventSource = async (params:any) => {
  const res = await apiIndexPageObj.situationAnalysisStatEventSource(params);
  eventSourceList.value = res?.data || [];
};
const situationAnalysisStatEventList = async (params:any) => {
  const res = await apiIndexPageObj.situationAnalysisStatEventList(params);
  eventList.value = res?.data.list || [];
  pagination.total = res?.data.total;
};
const situationAnalysisStatTrend = async (params:any) => {
  const res = await apiIndexPageObj.situationAnalysisStatTrend(params);
  trendAnalysisChartData.value = res?.data || [];
};
const situationAnalysisStatInflow = async (params:any) => {
  const res = await apiIndexPageObj.situationAnalysisStatInflow(params);
  inflowTypeChartData.value = res?.data || [];
};
const getData = (params: any) => {
  const _params = { ...params, dimension: props.dimension, dimensionValue: props.dimensionValue };
  situationAnalysisStatEventSource(_params);
  situationAnalysisStatEventList(_params);
  situationAnalysisStatTrend(_params);
  situationAnalysisStatInflow(_params);
};
const pageList = (val: number) => {
  pagination.currentPage = val;
  const _params = { ...searchParams, dimension: props.dimension, dimensionValue: props.dimensionValue, pageNum: pagination.currentPage, pageSize: pagination.pageSize };
  situationAnalysisStatEventList(_params);
};
getData(searchParams);
const handleClose = () => {
  emit('close');
};
</script>
<style lang="scss" scoped>
.title-bg-1 {
  height: calc(var(--xxs) * 9.5);
  line-height: calc(var(--xxs) * 9.5);
  padding-left: calc(var(--xxs) * 16);
  background-image: url('@/assets/images/eventCenter/title-bg-1.png');
  background-size: auto 100%;
  background-position: left center;
  background-repeat: no-repeat;
  font-size: calc(var(--xxs) * 4);
  .title-label {
    width: calc(var(--xxs) * 23);
  }
  .value {
    flex: auto;
    font-size: calc(var(--xxs) * 5);
    font-family: PangMenZhengDao;
    color: #FFFFFF;
    background: linear-gradient(180deg, #FFFFFF 0%, #FFEC87 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
