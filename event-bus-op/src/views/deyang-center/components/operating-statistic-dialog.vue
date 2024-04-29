<template>
  <common-dialog title="运行统计" width="calc(var(--xxs) * 337)" @close="handleClose" class="dialog-search-list">
    <template #right>
      <span>{{ areaAndTime }}</span>
    </template>
    <hl-group full gap-x="calc(var(--xxs) * 4)">
      <div class="title-bg-1 display-flex">
        <span class="title-label">平台名称</span>
        <span class="value flex-auto text-center">{{ dialogParams.platformName }}</span>
      </div>
      <div class="title-bg-1 display-flex">
        <span class="title-label">指标名称</span>
        <span class="value flex-auto text-center">{{ dialogParams.targetName }}</span>
      </div>
    </hl-group>
    <hl-row gap-x="calc(var(--xxs) * 4)">
      <hl-col :span="8">
        <SimpleTitle2 title="事件类型TOP10" class="m-y-md" />
        <stripe-list :list="top10Data" :cols="top10Cols" :height="'calc(var(--xxs) * 60)'" />
      </hl-col>
      <hl-col :span="16">
        <SimpleTitle2 title="趋势分析（近6个月）" class="m-y-md" />
        <TrendAnalysisChart :data="trendAnalysisChartData" style="height:calc(var(--xxs) * 60)" />
      </hl-col>
      <hl-col :span="8">
        <SimpleTitle2 title="事件区域" class="m-y-md" />
        <Event-Area :chart-data="AreachartData" style="height:calc(var(--xxs) * 45.5);" />
      </hl-col>
      <hl-col :span="16">
        <SimpleTitle2 title="事件列表" class="m-y-md" />
        <!-- 此处对接事件列表组件 -->
        <!-- <stripe-list :list="eventList" :cols="eventCols" :height="'height:calc(var(--xxs) * 45.5)'" /> -->
      </hl-col>
    </hl-row>
  </common-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useGlobalState } from '@/hooks';
import { apiRunVerviewObj } from '@/apis';
import { IpostTop10Space, IpostAnalysisSpace, IpostRegionSpace } from '@/apis/modules/dy-run-overview/model';
import TrendAnalysisChart from './trend-analysis-chart.vue';
import EventArea from './event-area.vue';

const emit = defineEmits(['close']);

const props = defineProps({
  dialogParams: {
    type: Object,
    default: () => ({
      show: false,
      dimension: '',
      dimensionValue: '',
      platform: '',
      platformName: '',
      targetName: '',
    })
  },
});

const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);

const searchParmsCom = computed(() => {
  return {
    ...props.dialogParams,
    timeDimension: searchParams.timeDimension,
    pageNum: currentPage.value,
    pageSize: pageSize.value,
  };
});

const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    getTop10List();
    gettrendAnalysis();
    getEventArea();
  },
});

const areaAndTime = computed(() => {
  const districtName = searchParams.districtName || '--';
  const startTime = `${searchParams.startTime || '--'}`;
  const endTime = `${searchParams.endTime || '--'}`;
  return `(${districtName || '--'}，${startTime.split(' ')[0]} 至 ${endTime.split(' ')[0]})`;
});

// 事件类型TOP10
const top10Data = ref<IpostTop10Space.Data[]>([]);
const top10Cols = [{
  title: '',
  minWidth: '2em',
  align: 'left',
  slotName: 'tableIndex',
  fixed: 'left',
},
{
  title: '事项名称',
  prop: 'eventTypeName',
},
{
  title: '事件数',
  prop: 'num',
},
{
  title: '环比',
  prop: 'qoq',
},
];

const getTop10List = async () => {
  const { data } = await apiRunVerviewObj.postTop10(searchParmsCom.value);
  top10Data.value = data;
};

// 趋势分析（近6个月）
const trendAnalysisChartData = ref<{ date: number, num: number }[]>([]);

const gettrendAnalysis = async () => {
  const { data } = await apiRunVerviewObj.postAnalysis(searchParmsCom.value);
  trendAnalysisChartData.value = data.map((item: IpostAnalysisSpace.Data) => {
    return {
      date: item.month,
      num: item.num
    };
  });
};

// 事件区域
const AreachartData = ref<{ label: string, num: number }[]>([]);
const getEventArea = async () => {
  const { data } = await apiRunVerviewObj.postRegion(searchParmsCom.value);
  AreachartData.value = data.map((item: IpostRegionSpace.Data) => {
    return {
      label: item.regionName,
      num: item.num
    };
  });
};

// 时间列表  postEventlist接口  searchParmsCom传参封装

const handleClose = () => {
  emit('close');
};

onMounted(() => {
  getTop10List();
  gettrendAnalysis();
  getEventArea();
});
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
