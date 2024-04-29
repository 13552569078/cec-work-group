<template>
  <hv-panel title="运行总览">
    <hl-row gap-x="calc(var(--xxs) * 2.5)">
      <hl-col span="col-12">
        <SimpleTitle title="流入事件统计" class="m-b-xs" />
        <hl-group class="items-center m-t-md left1-wrap" full>
          <div class="card-item text-center">
            <div class="value">{{ eventsStatAnalasis.totalInflowEventNum }}</div>
            <div class="title">累计流入(件)</div>
          </div>
          <div class="card-item text-center">
            <div class="value">{{ eventsStatAnalasis.endRate }}</div>
            <div class="title">办结率(%)</div>
          </div>
        </hl-group>
        <div ref="chartContainer" class="echart-container"
          style="height: calc(var(--xxs) *  50);margin: calc(var(--xl) * 0.6) 0;"></div>
      </hl-col>
      <hl-col span="col-12">
        <SimpleTitle title="平台流入统计" class="m-b-xs" />
        <dy-tabs v-model="mode" :tabs="inflowTabs" @update:modelValue="changeMode" />
        <stripe-list :list="tableData" :cols="cols" :height="'calc(var(--xxs) * 248/4)'" class="m-t-xs"
          @row-click="flowRowClick" />
      </hl-col>
    </hl-row>
    <hl-row gap-x="calc(var(--xxs) * 2.5)">
      <hl-col span="col-12" class="left2-wrap">
        <SimpleTitle title="接入事件统计" class="m-b-xs" />
        <hl-group class="in-card-item" full>
          <hl-group full>
            <div class="card-item text-center cursor-pointer" @click="inClick(IN_NUM, IN_NUM_NAME)">
              <div class="value">{{ accessEventsAnalasis.accessEventNum }}</div>
              <div class="title">{{ IN_NUM_NAME }}(件)</div>
            </div>
          </hl-group>
          <hl-group full>
            <div class="card-item text-center">
              <div class="value">{{ accessEventsAnalasis.accessQoq }}</div>
              <div class="title">环比(%)</div>
            </div>
          </hl-group>
        </hl-group>
        <hl-group class="in-card-item2 m-t-md" full>
          <hl-group full>
            <div class="card-item text-center cursor-pointer" @click="inClick(IN_UN_NUM, IN_UN_NUM_NAME)">
              <div class="value">{{ accessEventsAnalasis.notEndNum }}</div>
              <div class="title">{{ IN_UN_NUM_NAME }}(件)</div>
            </div>
          </hl-group>
          <hl-group full>
            <div class="card-item text-center cursor-pointer" @click="inClick(IN_OVER_NUM, IN_OVER_NUM_NAME)">
              <div class="value">{{ accessEventsAnalasis.overTimeNotEndNum }}</div>
              <div class="title">{{ IN_OVER_NUM_NAME }}(件)</div>
            </div>
          </hl-group>
        </hl-group>
        <hl-group class="in-card-item2 m-t-md" full>
          <hl-group full>
            <div class="card-item text-center cursor-pointer" @click="inClick(IN_DONE_NUM, IN_DONE_NUM_NAME)">
              <div class="value">{{ accessEventsAnalasis.endNum }}</div>
              <div class="title">{{ IN_DONE_NUM_NAME }}(件)</div>
            </div>
          </hl-group>
          <hl-group full>
            <div class="card-item text-center cursor-pointer" @click="inClick(IN_DONE_OVER_NUM, IN_DONE_OVER_NUM_NAME)">
              <div class="value">{{ accessEventsAnalasis.overTimeEndNum }}</div>
              <div class="title">{{ IN_DONE_OVER_NUM_NAME }}(件)</div>
            </div>
          </hl-group>
        </hl-group>
      </hl-col>
      <hl-col span="col-12" class="right2-wrap">
        <SimpleTitle title="自处置事件统计" class="m-b-xs" />
        <hl-group class="self-card-item" full>
          <hl-group full>
            <div class="card-item text-center cursor-pointer" @click="selfClick(SELF_NUM, SELF_NUM_NAME)">
              <div class="value">{{ selfHandleAnalasis.selfHandleEventNum }}</div>
              <div class="title">{{ SELF_NUM_NAME }}(件)</div>
            </div>
          </hl-group>
          <hl-group full>
            <div class="card-item text-center">
              <div class="value">{{ selfHandleAnalasis.selfHandleQoq }}</div>
              <div class="title">环比(%)</div>
            </div>
          </hl-group>
        </hl-group>
        <hl-group class="self-card-item m-t-md" full>
          <hl-group full>
            <div class="card-item text-center cursor-pointer" @click="selfClick(SELF_DONE, SELF_DONE_NAME)">
              <div class="value">{{ selfHandleAnalasis.endNum }}</div>
              <div class="title">{{ SELF_DONE_NAME }}(件)</div>
            </div>
          </hl-group>
          <hl-group full>
            <div class="card-item text-center">
              <div class="value">{{ selfHandleAnalasis.endRate }}</div>
              <div class="title">办结率(%)</div>
            </div>
          </hl-group>
        </hl-group>
        <hl-group class="self-card-item m-t-md" full>
          <hl-group full>
            <div class="card-item text-center cursor-pointer" @click="selfClick(SELF_OVER_DONE, SELF_OVER_DONE_NAME)">
              <div class="value">{{ selfHandleAnalasis.overTimeNum }}</div>
              <div class="title">{{ SELF_OVER_DONE_NAME }}(件)</div>
            </div>
          </hl-group>
          <hl-group full>
            <div class="card-item text-center">
              <div class="value">{{ selfHandleAnalasis.overTimeRate }}</div>
              <div class="title">超时率(%)</div>
            </div>
          </hl-group>
        </hl-group>
      </hl-col>
    </hl-row>
  </hv-panel>

  <operating-statistic-dialog v-if="dialogParams.show" :dialog-params="dialogParams"
    @close="closeSituationStatisticsDialog" />
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted, computed } from 'vue';
import { useEChart } from 'hongluan-hooks';
import { useResponsiveChart } from 'fx-front-framework';
import * as echarts from 'echarts';
import { echartsSize, ECHARTS_RESPONSE_LIST } from '@/common';
import { useGlobalState } from '@/hooks';
import OperatingStatisticDialog from '../components/operating-statistic-dialog.vue';
import { apiRunVerviewObj } from '@/apis';
import { IlistSpace2, IlistSpace } from '@/apis/modules/dy-run-overview/model';
import { PLATFORM_DEFAULT, DEMENSION_FLOW, DEMENSION_IN, DEMENSION_SELF, IN_NUM, IN_UN_NUM, IN_OVER_NUM, IN_DONE_NUM, IN_DONE_OVER_NUM, SELF_NUM, SELF_DONE, SELF_OVER_DONE, IN_NUM_NAME, IN_UN_NUM_NAME, IN_OVER_NUM_NAME, IN_DONE_NUM_NAME, IN_DONE_OVER_NUM_NAME, SELF_NUM_NAME, SELF_DONE_NAME, SELF_OVER_DONE_NAME, FLOW_LIU_RU_LIANG, FLOW_BAN_JIE_LIANG, FLOW_CHAO_SHI_LIANG, FLOW_LIU_RU_LIANG_NAME, FLOW_BAN_JIE_LIANG_NAME, FLOW_CHAO_SHI_LIANG_NAME } from '../components/constant';

const { chartContainer, setChartOption, resizeChart } = useEChart();
const { updateOptionToResponsive } = useResponsiveChart();

const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    getInflowEventsStat();
    getEventsListSixMonth();
    getAccessEventsAnalasis();
    getSelfHandleAnalasis();
    getInflowList();
  }
});

// 全局搜索 转义
const panelSearchParams = computed(() => {
  return {
    districtCode: searchParams.district,
    endTime: searchParams.endTime,
    startTime: searchParams.startTime
  };
});

// 运行总览-平台流入统计
const mode = ref(FLOW_LIU_RU_LIANG);
const inflowTabs = [
  {
    label: FLOW_LIU_RU_LIANG_NAME,
    value: FLOW_LIU_RU_LIANG,
  },
  {
    label: FLOW_BAN_JIE_LIANG_NAME,
    value: FLOW_BAN_JIE_LIANG,
  },
  {
    label: FLOW_CHAO_SHI_LIANG_NAME,
    value: FLOW_CHAO_SHI_LIANG,
  },
];

const cols = [
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
  }
];
const tableData = ref<IlistSpace.Data[]>([]);

const changeMode = () => {
  getInflowList();
};

const getInflowList = async () => {
  const { data } = await apiRunVerviewObj.list(panelSearchParams.value.districtCode, panelSearchParams.value.startTime, panelSearchParams.value.endTime, mode.value);
  tableData.value = data;
};

// 运行总览-流入事件统计
const eventsStatAnalasis = reactive({
  'endRate': '0',
  'totalInflowEventNum': 0
});

const getInflowEventsStat = async () => {
  const { data } = await apiRunVerviewObj.postInflowStat(panelSearchParams.value.districtCode, panelSearchParams.value.startTime, panelSearchParams.value.endTime);
  Object.assign(eventsStatAnalasis, data);
};

// 运行总览-流入事件近六个月事件数量
const eventsListSixMonth = ref<IlistSpace2.Data[]>([]);

const renderChart = () => {
  const option = {
    title: {
      text: '事件数',
      left: '30',
      textStyle: {
        color: '#CCF2FF',
        fontSize: 40
      }
    },
    grid: {
      top: '15%',
      left: '0%',
      right: '0%',
      bottom: '0%',
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      axisLabel: {
        interval: 0,
        fontSize: 42,
        color: '#CCF2FF',
        lineHeight: 20,
        margin: 50,
        // rotate: props.chartData?.length > 5 ? 30 : 0
      },
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(221,242,255,0.2)'
        }
      },
      type: 'category',
      data: eventsListSixMonth.value.map((item: IlistSpace2.Data) => item.month),
    },
    yAxis: [
      {
        position: 'left',
        splitNumber: 3,
        splitLine: {
          lineStyle: {
            type: 'solid',
            color: 'rgba(221,242,255,0.2)'
          }
        },
        axisTick: {
          show: false
        },
        // 整条y轴
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(221,242,255,0.2)'
          }
        },
        axisLabel: {
          fontSize: 44,
          fontWeight: 'bold',
          color: '#CCF2FF',
          lineHeight: 20
        },
        type: 'value'
      }
    ],
    color: ['#FFC41A'],
    series: [{
      data: eventsListSixMonth.value.map((item: IlistSpace2.Data) => item.num),
      type: 'line',
      smooth: true,
      symbol: 'none',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [ // 渐变颜色
            {
              offset: 0.1,
              color: 'rgba(255,196,26,0.4)',
            },
            {
              offset: 1,
              color: 'rgba(255,196,26,0)',
            },
          ],
          global: false,
        },
      }
    }]
  };
  updateOptionToResponsive(option, ECHARTS_RESPONSE_LIST);
  setChartOption(option);
  nextTick(() => {
    resizeChart();
  });
};
const getEventsListSixMonth = async () => {
  const { data } = await apiRunVerviewObj.postEventslist(panelSearchParams.value.districtCode, panelSearchParams.value.startTime, panelSearchParams.value.endTime);
  eventsListSixMonth.value = data;
  renderChart();
};

// 运行总览-接入事件统计
const accessEventsAnalasis = reactive({
  'accessEventNum': 0,
  'accessQoq': '0',
  'endNum': 0,
  'notEndNum': 0,
  'overTimeEndNum': 0,
  'overTimeNotEndNum': 0
});
const getAccessEventsAnalasis = async () => {
  const { data } = await apiRunVerviewObj.postStat(panelSearchParams.value.districtCode, panelSearchParams.value.startTime, panelSearchParams.value.endTime);
  Object.assign(accessEventsAnalasis, data);
};

// 运行总览-自处置事件统计
const selfHandleAnalasis = reactive({
  'endNum': 0,
  'endRate': '0',
  'overTimeNum': 0,
  'overTimeRate': '0',
  'selfHandleEventNum': 0,
  'selfHandleQoq': '0'
});

const getSelfHandleAnalasis = async () => {
  const { data } = await apiRunVerviewObj.postSelfHandleStat(panelSearchParams.value.districtCode, panelSearchParams.value.startTime, panelSearchParams.value.endTime);
  Object.assign(selfHandleAnalasis, data);
};

const dialogParams = reactive({
  show: false,
  dimension: '1',
  dimensionValue: '1',
  platform: '',
  platformName: '',
  targetName: '',
});

const closeSituationStatisticsDialog = () => {
  dialogParams.show = false;
};

const flowRowClick = (row: IlistSpace.Data) => {
  Object.assign(dialogParams, {
    show: true,
    dimension: DEMENSION_FLOW,
    dimensionValue: mode.value,
    platform: row.platformCode,
    platformName: row.platformName,
    targetName: mode.value === FLOW_LIU_RU_LIANG ? FLOW_LIU_RU_LIANG_NAME : mode.value === FLOW_BAN_JIE_LIANG ? FLOW_BAN_JIE_LIANG_NAME : FLOW_CHAO_SHI_LIANG_NAME
  });
};
const inClick = (dimensionValue: string, targetName: string) => {
  Object.assign(dialogParams, {
    show: true,
    dimension: DEMENSION_IN,
    dimensionValue,
    platform: '',
    platformName: PLATFORM_DEFAULT,
    targetName
  });
};
const selfClick = (dimensionValue: string, targetName: string) => {
  Object.assign(dialogParams, {
    show: true,
    dimension: DEMENSION_SELF,
    dimensionValue,
    platform: '',
    platformName: PLATFORM_DEFAULT,
    targetName
  });
};

onMounted(() => {
  getInflowEventsStat();
  getEventsListSixMonth();
  getAccessEventsAnalasis();
  getSelfHandleAnalasis();
  getInflowList();
});
</script>
<style lang="scss" scoped>
.left1-wrap {
  .card-item {
    width: calc(var(--xxs) * 123/4);
    height: calc(var(--xxs) * 52/4);
    background-image: url('@/assets/images/deyang/center/left2-card-bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    color: #DDF2FF;

    .value {
      margin-bottom: 0;
      font-size: calc(var(--xxs) * 18/4);
      font-family: PangMenZhengDao;
      color: #FFFFFF;
      background: linear-gradient(360deg, #FFB650 0%, #FFFFFF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      position: relative;
      top: calc(var(--xxs)*(-2))
    }

    .title {
      font-size: calc(var(--xxs) * 14/4);
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #DDF2FF;
      position: relative;
      top: calc(var(--xxs)*(-3))
    }
  }
}

.left2-wrap {
  .in-card-item {
    width: 100%;
    height: calc(var(--xxs) * 52/4);
    background-image: url('@/assets/images/deyang/center/left2-bg3.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .in-card-item2 {
    .card-item {
      width: 100%;
      height: calc(var(--xxs) * 52/4);
      background-image: url('@/assets/images/deyang/center/left2-bg2.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }

  .value {
    margin-bottom: 0;
    font-size: calc(var(--xxs) * 18/4);
    font-family: PangMenZhengDao;
    color: #FFFFFF;
    letter-spacing: 1px;
    background: linear-gradient(180deg, #FFFFFF 0%, #00E6FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
    top: calc(var(--xxs)*(-2))
  }

  .title {
    font-size: calc(var(--xxs) * 14/4);
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #DDF2FF;
    position: relative;
    top: calc(var(--xxs)*(-3))
  }
}

.right2-wrap {

  .self-card-item {
    width: 100%;
    height: calc(var(--xxs) * 52/4);
    background-image: url('@/assets/images/deyang/center/left2-bg4.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .value {
      margin-bottom: 0;
      font-size: calc(var(--xxs) * 18/4);
      font-family: PangMenZhengDao;
      color: #FFFFFF;
      background: linear-gradient(180deg, #FFFFFF 0%, #FFEC87 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .title {
      font-size: calc(var(--xxs) * 14/4);
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #DDF2FF;
      position: relative;
      top: calc(var(--xxs)*(-1))
    }
  }
}
</style>
