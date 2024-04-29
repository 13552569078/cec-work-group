<template>
  <common-dialog title="热点话题分析" size="6" width="calc(var(--xxs) * 218)" @close="handleClose">
    <div class="title-bg-1 display-flex">
      <span class="title-label">话题名称</span>
      <span class="value flex-auto text-center ellipsis">{{ name }}</span>
    </div>
    <SimpleTitle2 title="话题趋势" class="m-y-md" />
    <TrendTopicChart :data="trendTopicChartData" style="height:calc(var(--xxs) * 55.75)" />
    <SimpleTitle2 title="关联事件" class="m-y-md" />
    <RelevanceEvent ref="relevanceEventRef" :topicName="name" :platFormCode="searchParams.platform" :recent20Flag="recent20Flag" style="height:calc(var(--xxs) * 55.75)" />
  </common-dialog>
</template>
<script lang="ts" setup>
import { ref, nextTick } from 'vue';
import { useGlobalState } from '@/hooks';
import { apiIndexPageObj } from '@/apis';
import TrendTopicChart from './trend-topic-chart.vue';
import RelevanceEvent from './relevance-event.vue';
const emit = defineEmits(['close']);

const props = defineProps({
  height: {
    type: String,
    default: 'calc(var(--xl) * 17.3)'
  },
  dialogParams: {
    type: Object,
    default: () => ({})
  },
  name: {
    type: String,
    default: '--'
  }
});
const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    // getData({ ...params });
  },
});
const trendTopicChartData = ref();
const relevanceEventRef = ref();
const relevanceEventChartData = ref();
// 是否只展示近20条关联数据（事件关联数量太多，echarts图效果较差）
const recent20Flag = ref(1);

const getTrendTopicChartData = async (params:any) => {
  params.topicName = props.name;
  const { data } = await apiIndexPageObj.surveAnalysisTopicTrend(params);
  trendTopicChartData.value = data || [];
};
const getData = (params: any) => {
  getTrendTopicChartData(params);
  nextTick(() => {
    relevanceEventRef.value?.getTopicEvent();
  });
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
