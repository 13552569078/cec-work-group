<template>
  <hv-panel
    title="监督分析"
    size="4"
  >
    <hl-row gap="calc(var(--xxs) * 4)">
      <hl-col span="col-12">
        <SimpleTitle
          title="热点话题分析"
          class="m-b-sm"
        />
        <div
          v-for="item in topicMax"
          :key="item.label"
          class="host-bar-item cursor-pointer"
          @click.stop="topicMaxClick(item)"
        >
          <span class="label">{{ item.label }}</span>
          <span class="text ellipsis">{{ item.text }}</span>
          <span class="value">{{ item.value }}</span>
        </div>
        <stripe-list
          :list="topicList"
          :cols="topicCols"
          :height="'calc(var(--xxs) * 45)'"
          @row-click="topicListClick"
        />
      </hl-col>
      <hl-col span="col-12">
        <SimpleTitle
          title="重复事件预警"
          class="m-b-sm"
        />
        <hl-group
          wrap
          gap-x="calc(var(--xxs) * 0.5)"
          gap-y="calc(var(--xxs) * 1)"
          class="items-center m-b-sm"
        >
          <div
            v-for="(v, k) in repeatStaticsList.values()"
            :key="k"
            class="text-center repeat-item"
          >
            <p class="item-value">{{ v.value }}</p>
            <span class="common-value"><span>{{ v.label }}({{ v.unit }})</span></span>
          </div>
        </hl-group>
        <stripe-list
          :list="repeatSourceList"
          :cols="repeatSourceCols"
          :height="'calc(var(--xxs) * 40)'"
        />
      </hl-col>
    </hl-row>
    <hottest-statistics-dialog
      v-if="hottestStatisticsDialogParams.show"
      :name="hottestStatisticsDialogParams.name"
      @close="closeHottestStatisticsDialog"
    />
  </hv-panel>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { apiIndexPageObj } from '@/apis';
import { useGlobalState } from '@/hooks';
import HottestStatisticsDialog from '../components/hottest-statistics-dialog.vue';
const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    getData({ ...params });
  },
});
const topicList = ref();
const repeatStaticsList = ref(new Map([
  ['recognizeNum', {
    label: '智能识别重复',
    value: '--',
    unit: '件'
  }],
  ['handleNum', {
    label: '已处理',
    value: '--',
    unit: '件'
  }],
  ['confirmNum', {
    label: '确认重复',
    value: '--',
    unit: '件'
  }],
  ['rate', {
    label: '准确率',
    value: '--',
    unit: '%'
  }]
]
));

const repeatSourceList = ref();
const hottestStatisticsDialogParams = reactive({
  show: false,
  name: '',
});
const topicMax = reactive({
  most: { type: 'most', label: '数量最多:', text: '--', value: 0 },
  fastest: { type: 'fastest', label: '增长最快:', text: '--', value: '+0%' },
});
const topicCols = [
  {
    title: '',
    minWidth: '2em',
    align: 'left',
    slotName: 'tableIndex',
    fixed: 'left',
  },
  {
    title: '话题名称',
    prop: 'topicName',
  },
  {
    title: '话题数',
    prop: 'topicNum',
  },
];

const repeatSourceCols = [
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
const surveAnalysisTopicMax = async (params: any) => {
  const { data } = await apiIndexPageObj.surveAnalysisTopicMax(params);
  topicMax.most = {
    ...topicMax.most,
    text: data?.topTopicName || '--',
    value: data?.topTopicNum,
  };
  topicMax.fastest = {
    ...topicMax.most,
    text: data?.fastTopicName || '--',
    value: `+${data?.fastTopcRate || 0}%`,
  };
};
const surveAnalysisTopicList = async (params: any) => {
  topicList.value = [];
  const res = await apiIndexPageObj.surveAnalysisTopicList(params);
  topicList.value = res?.data || [];
};
const surveAnalysisEventRmvDupStatistics = async (params: any) => {
  const res = await apiIndexPageObj.surveAnalysisEventRmvDupStatistics(params);
  if (res?.data) {
    for (const k in res?.data) {
      if (repeatStaticsList.value.get(k)) {
        repeatStaticsList.value.get(k)!.value = res?.data[k as keyof typeof res.data] ?? '--';
      }
    }
  }
};
const surveAnalysisEventRmvDupPlatformSrcList = async (params: any) => {
  const res = await apiIndexPageObj.surveAnalysisEventRmvDupPlatformSrcList(params);
  repeatSourceList.value = res?.data || [];
};
const getData = async (params: any) => {
  surveAnalysisTopicMax(params);
  surveAnalysisTopicList(params);
  const { platform, platformCode, ...repeatListParams } = params;
  surveAnalysisEventRmvDupStatistics(repeatListParams);
  surveAnalysisEventRmvDupPlatformSrcList(repeatListParams);
};
getData(searchParams);
const topicMaxClick = (row: any) => {
  if (row.type === 'most') {
    hottestStatisticsDialogParams.name = row.text;
    hottestStatisticsDialogParams.show = true;
  }
};
const topicListClick = (row: any) => {
  hottestStatisticsDialogParams.name = row.topicName;
  hottestStatisticsDialogParams.show = true;
};
const closeHottestStatisticsDialog = () => {
  hottestStatisticsDialogParams.show = false;
};
</script>
<style lang="scss" scoped>
.host-bar-item {
  display: flex;
  align-items: center;
  padding-right: var(--xxs);
  margin-bottom: calc(var(--xxs) * 2);
  height: calc(var(--xxs) * 8);
  line-height: calc(var(--xxs) * 8);
  padding-left: calc(var(--xxs) * 8.5);
  background-image: url("@/assets/images/panelBox/host-bar-bg.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: left center;
  .label {
    flex-shrink: 0;
    color: #ddf2ff;
  }
  .text {
    flex-grow: 1;
    color: #ffffff;
  }
  .value {
    line-height: calc(var(--xxs) * 4.5);
    font-size: calc(var(--xxs) * 4.5);
    font-family: PangMenZhengDao;
    color: #ffffff;
    letter-spacing: 1px;
    background: linear-gradient(180deg, #ffffff 0%, #fc8b02 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.repeat-item {
  width: calc(50% - var(--xxs) * 0.5);
  height: calc(var(--xxs) * 10.8);
  background-image: url("@/assets/images/panelBox/repeat-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: #ddf2ff;
  padding-left: calc(var(--xxs) * 4.25);
  .item-value {
    margin-top: calc(var(--xxs) * 0.5);
    padding-top: calc(var(--xxs) * 0.5);
    font-size: calc(var(--xxs) * 4.5);
    font-family: PangMenZhengDao;
    color: #ffffff;
    line-height: calc(var(--xxs) * 4);
    letter-spacing: 1px;
    background: linear-gradient(180deg, #ffffff 0%, #ffec87 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: left;
  }
  .common-value {
    text-align: left;
    width: 100%;
    display: flex;
  }
}
</style>
