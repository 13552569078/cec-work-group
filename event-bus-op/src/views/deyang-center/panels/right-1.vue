<template>
  <hv-panel title="态势分析" size="4">
    <hl-row gap-x="calc(var(--xxs) * 4)">
      <hl-col span="col-12">
        <SimpleTitle title="高频事件分析" class="m-b-xs" />
        <stripe-list :list="eventFrequentList" :cols="eventFrequentCols" :height="'calc(var(--xxs) * 56)'" @row-click="eventFrequentListClick" />
      </hl-col>
      <hl-col span="col-12">
        <SimpleTitle title="关键词分析" class="m-b-sm" />
        <Keywords />
      </hl-col>
      <hl-col span="col-12">
        <SimpleTitle title="事件性质分析" class="m-b-sm" />
        <hl-row gap="calc(var(--xxs) * 2.5)">
          <hl-col :span="12" v-for="item in eventNatureList" :key="item.id">
            <div class="text-center nature-item cursor-pointer" @click.stop="eventNatureListClick(item)">
              <p class="p-none value">{{ item.value }}</p>
              <p class="p-none m-none title">{{ item.label }}(件)</p>
            </div>
          </hl-col>
        </hl-row>
      </hl-col>
      <hl-col span="col-12">
        <SimpleTitle title="事件区域分析" class="m-b-xs" />
        <stripe-list :list="eventAreaList" :cols="eventAreaCols" :height="'calc(var(--xxs) * 56)'" @row-click="eventAreaListClick" />
      </hl-col>
    </hl-row>
    <situation-statistics-dialog
      v-if="situationStatisticsDialogParams.show"
      :dimension="situationStatisticsDialogParams.dimension"
      :dimensionValue="situationStatisticsDialogParams.dimensionValue"
      :indicatorname="situationStatisticsDialogParams.indicatorname"
      @close="closeSituationStatisticsDialog"
    />
  </hv-panel>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useGlobalState } from '@/hooks';
import { apiIndexPageObj } from '@/apis';
import { SituationAnalysis } from '@/apis/modules/index-page/model';
import Keywords from '../components/keywords.vue';
import SituationStatisticsDialog from '../components/situation-statistics-dialog.vue';

const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    getData({ ...params });
  },
});
const eventFrequentCols = [
  {
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
];
const eventAreaCols = [
  {
    title: '',
    minWidth: '2em',
    align: 'left',
    slotName: 'tableIndex',
    fixed: 'left',
  },
  {
    title: '行政区划',
    prop: 'name',
  },
  {
    title: '事件数',
    prop: 'num',
  },
];
const eventFrequentList = ref();
const eventAreaList = ref();
interface EventNatureObj {
  urgent: Array<SituationAnalysis.EventNatureSourceData>;
  list: Array<SituationAnalysis.EventNatureSourceData>;
}
const eventNatureObj:EventNatureObj = reactive({
  urgent: [],
  list: []
});
const eventNatureList = computed(() => {
  const arr0 = eventNatureObj.urgent.map((d:SituationAnalysis.EventNatureSourceData) => ({ ...d, label: d.eventUrgentName, value: d.num }));
  const arr = eventNatureObj.list.map((d:SituationAnalysis.EventNatureSourceData) => ({ ...d, label: d.eventSourceName, value: d.num }));
  if (arr0.length === 0) {
    return [{ label: '一般事件', value: 0, eventUrgent: 2 }, { label: '一般事件', value: 0, eventUrgent: 1 }, ...arr];
  }
  return [...arr0, ...arr];
});
const situationStatisticsDialogParams = reactive({
  show: false,
  dimension: '',
  indicatorname: '',
  dimensionValue: '',
});
// 弹窗列表类型，self-自处置 manual-流转
const showSituationStatisticsDialog = ref(false);
const situationAnalysisArea = async(params:any) => {
  const res = await apiIndexPageObj.situationAnalysisArea(params);
  eventAreaList.value = res?.data || [];
  // eventAreaList.value = [
  //   { 'name': '旌阳区', 'num': 70 },
  //   { 'name': '旌阳区', 'num': 70 },
  //   { 'name': '旌阳区', 'num': 70 },
  //   { 'name': '旌阳区', 'num': 70 },
  //   { 'name': '旌阳区', 'num': 70 },
  //   { 'name': '旌阳区', 'num': 70 },
  // ];
};
const situationAnalysisFrequent = async(params:any) => {
  const res = await apiIndexPageObj.situationAnalysisFrequent({ ...params, pageNum: 1, pageSize: 20 });
  eventFrequentList.value = res?.data || [];
};
const situationAnalysisNatureUrgent = async(params:any) => {
  const res = await apiIndexPageObj.situationAnalysisNatureUrgent(params);
  eventNatureObj.urgent = res?.data || [];
};
const situationAnalysisNatureSource = async(params:any) => {
  const res = await apiIndexPageObj.situationAnalysisNatureSource(params);
  eventNatureObj.list = res?.data || [];
};
const getData = (params: any) => {
  situationAnalysisArea(params);
  situationAnalysisFrequent(params);
  situationAnalysisNatureUrgent(params);
  situationAnalysisNatureSource(params);
};

getData(searchParams);
const clickBar = async (name: string, type: string, value: any) => {
  situationStatisticsDialogParams.dimension = type;
  situationStatisticsDialogParams.indicatorname = name;
  situationStatisticsDialogParams.dimensionValue = value;
  situationStatisticsDialogParams.show = true;
};
/**
dimension 为1，dimensionValue就传事件类型编码，来源于接口/analysis/high/frequency的eventTypeCode字段
dimension 为2，dimensionValue就传行政区划ID  来源于接口/situation/analysis/area的id字段
dimension 为3，dimensionValue就传紧急程度字典，来源于接口/nature/urgent的eventUrgent字段
dimension 为4，dimensionValue就传事件来源字典，来源于接口/analysis/nature/source的eventSource字段
 */
const eventFrequentListClick = (row:any) => {
  clickBar(row.eventTypeName, '1', row.eventTypeCode);
};
const eventAreaListClick = (row:any) => {
  clickBar(row.name, '2', row.id);
};
const eventNatureListClick = (row:any) => {
  if (row.label === '紧急事件' || row.label === '一般事件') {
    clickBar(row.label, '3', row.eventUrgent);
  } else {
    clickBar(row.label, '4', row.eventSource);
  }
};
const closeSituationStatisticsDialog = () => {
  situationStatisticsDialogParams.show = false;
};

const refreshData = () => {
  getData(searchParams);
};

defineExpose({
  refreshData,
});
</script>
<style lang="scss" scoped>
.nature-item {
  height: calc(var(--xxs) * 17.25);
  background-image: url('@/assets/images/panelBox/block-bg.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: bottom center;
  color: #DDF2FF;
  .value {
    margin-bottom: var(--xxs);
    line-height: calc(var(--xxs) * 4.5);
    font-size: calc(var(--xxs) * 4.5);
    font-family: PangMenZhengDao;
    color: #FFFFFF;
    background: linear-gradient(180deg, #FFFFFF 0%, #00E6FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
