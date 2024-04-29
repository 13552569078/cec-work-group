<template>
  <hv-panel title="事件流转" size="4">
    <hl-group
      full="full-x"
      dir="vertical"
      gap="var(--xxs)"
      style="height: calc(var(--xl) * 29.4)"
    >
      <!-- 头部统计 -->
      <div class="gh-top m-t-xxs" style="height: calc(var(--xl) * 3.5)">
        <div class="item">
          <div class="con">
            <span class="value">{{ platformAndEventStatistics.platformNum }}</span>
            <span class="unit">件</span>
          </div>
          <div class="label">接入平台总数</div>
        </div>
        <div class="item">
          <div class="con">
            <span class="value">{{ platformAndEventStatistics.eventNum }}</span>
            <span class="unit">件</span>
          </div>
          <div class="label">汇聚事件总数</div>
        </div>
      </div>
      <!-- 平台统计 -->
      <hl-group class="title-wrap m-t-xxs" align="items-between">
        <div class="title">平台统计</div>
        <div class="opration">
          <c-tabs v-model="mode" :tabs="tabs" @click="clickTab" />
        </div>
      </hl-group>
      <div class="carousel m-t-xxs">
        <div
          class="carousel-left"
          :class="leftDisabled ? 'disabled-arrow' : null"
          @click="clickLeft"
        ></div>
        <div class="carousel-con">
          <div
            class="carousel-item"
            :class="platformCode === item.platformCode ? 'active' : null"
            v-for="item in platformList.slice(activeIndex, activeIndex + 3)"
            :key="item.platformCode"
            @click="changePlatform(item.platformCode)"
          >
            <div class="name ellipsis">{{ item.platformName }}</div>
            <div class="con ellipsis">
              <span>汇聚事件</span>
              <span class="value">{{ item.eventNum }}</span>
              <span>件</span>
            </div>
          </div>
        </div>
        <div
          class="carousel-right"
          :class="rightDisabled ? 'disabled-arrow' : null"
          @click="clickright"
        ></div>
      </div>
      <!-- 平台总览 -->
      <hl-group class="title-wrap m-t-xxs title-wrap-normal" align="items-between">
        <div class="title">平台总览</div>
      </hl-group>
      <hl-group
        style="height: calc(var(--xl) * 4)"
        align="items-center"
        class="overview-wrap"
      >
        <hl-group class="w-75" align="items-between items-middle">
          <div class="overView-item" v-for="(item, index) in overviewList" :key="index">
            <div class="value">{{ platformOverview[item.key] }}</div>
            <div class="label">{{ item.name }}</div>
          </div>
        </hl-group>
      </hl-group>
      <!-- 平台处置分析 -->
      <hl-group class="title-wrap title-wrap-normal" align="items-between">
        <div class="title">平台处置分析</div>
      </hl-group>
      <hl-group style="height: calc(var(--xl) * 2.34)" class="handle-wrap">
        <div class="handle-item">
          <div class="icon icon1"></div>
          <div class="con">
            <div class="value" @click="clickSelfHandleNum('selfHandleNum')">
              {{ platformHandleAnalysis.selfHandleNum }}
              <span class="unit">件</span>
            </div>
            <div class="label">自处置</div>
          </div>
        </div>
        <div class="handle-item">
          <div class="icon icon2"></div>
          <div class="con">
            <div class="value" @click="clickSelfHandleNum('selfEndNum')">
              {{ platformHandleAnalysis.selfEndNum }}
              <span class="unit">件</span>
            </div>
            <div class="label">自处置办结</div>
          </div>
        </div>
        <div class="handle-item">
          <div class="icon icon3"></div>
          <div class="con">
            <div class="value" @click="clickSelfHandleNum('selfOvertimeNum')">
              {{ platformHandleAnalysis.selfOvertimeNum }}
              <span class="unit">件</span>
            </div>
            <div class="label">自处置超时</div>
          </div>
        </div>
      </hl-group>
      <hl-group style="height: calc(var(--xl) * 2.34)" class="handle-wrap m-t-xs">
        <div class="handle-item">
          <div class="icon icon4"></div>
          <div class="con">
            <div class="value" @click="clickManualHandleNum('flowinNum')">
              {{ platformHandleAnalysis.flowinNum }}
              <span class="unit">件</span>
            </div>
            <div class="label">流入事件</div>
          </div>
        </div>
        <div class="handle-item">
          <div class="icon icon5"></div>
          <div class="con">
            <div class="value" @click="clickManualHandleNum('flowinEndNum')">
              {{ platformHandleAnalysis.flowinEndNum }}
              <span class="unit">件</span>
            </div>
            <div class="label">流入办结</div>
          </div>
        </div>
        <div class="handle-item">
          <div class="icon icon6"></div>
          <div class="con">
            <div class="value" @click="clickManualHandleNum('flowinOvertimeNum')">
              {{ platformHandleAnalysis.flowinOvertimeNum }}
              <span class="unit">件</span>
            </div>
            <div class="label">流入超时</div>
          </div>
        </div>
      </hl-group>
      <!-- 流入 -->
      <scroll-table
        :cols="flowInListCols"
        :table-data="platformHandleAnalysis.flowInList"
        :cursorKeys="flowInListCursorKeys"
        class="m-t-xxs"
        @clickCursorNum="clickInListNum"
      />
      <!-- 流出事件分析 -->
      <hl-group class="title-wrap title-wrap-normal" align="items-between">
        <div class="title">流出事件分析</div>
      </hl-group>
      <scroll-table
        :cols="flowOutListCols"
        :table-data="platformHandleAnalysis.flowOutList"
        :cursorKeys="flowOutListCursorKeys"
        @clickCursorNum="clickOutListNum"
      />
      <self-handle-dialog
        v-if="showSelfHandleDialog"
        :dialogParams="handleListDialogParams"
        :dialogType="handleListDialogType"
        @close="closeSelfHandleDialog"
      />
    </hl-group>
  </hv-panel>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { Indexable } from 'fx-front-utils';
import { pick } from 'lodash-es';
import { useGlobalState } from '@/hooks';
import { apiEventFlowObj } from '@/apis';
import { IpostPlatformStatisticsSpace } from '@/apis/modules/event-flow/model';
import SelfHandleDialog from '@/views/event-center/components/self-handle-dialog.vue';

interface TableItem {
  [key: string]: string | number;
}

const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    getData({ ...params });
  },
});

const { eventGraphVisible, trendVisible } = useGlobalState();

const panelSearchParams = reactive({
  startTime: '',
  endTime: '',
  district: 0,
});

const showData = ref(true);
const mode = ref('');
const tabs = [
  {
    label: '流转地图',
    value: 'eventGraphVisible',
  },
  {
    label: '趋势分析',
    value: 'trendVisible',
  },
];
const platformAndEventStatistics = reactive({
  eventNum: '0',
  platformNum: '0',
});
const platformOverview = reactive<Indexable<string>>({
  endNum: '0',
  flowoutNum: '0',
  handleNum: '0',
  overtimeNum: '0',
});
const platformHandleAnalysis = reactive({
  flowinEndNum: 0,
  flowinNum: 0,
  flowinOvertimeNum: 0,
  selfEndNum: 0,
  selfHandleNum: 0,
  selfOvertimeNum: 0,
  flowInList: [],
  flowOutList: [],
});

const handleListDialogParams = ref();
// 弹窗列表类型，self-自处置 manual-流转
const handleListDialogType = ref('manual');
const showSelfHandleDialog = ref(false);

const platformCode = ref('');
const activeIndex = ref(0);
const platformList = ref<IpostPlatformStatisticsSpace.Data[]>([]);
const changePlatform = async (code: string) => {
  platformCode.value = code;
  await getPlatformOverviewData();
  await getPlatformHandleAnalysisData();
};

const leftDisabled = computed(() => {
  return activeIndex.value === 0;
});
const rightDisabled = computed(() => {
  if (platformList.value.length < 3) return true;
  return activeIndex.value === platformList.value.length - 3;
});

const clickTab = (tabVal: string) => {
  switch (tabVal) {
    case 'eventGraphVisible':
      eventGraphVisible.value = true;
      break;
    case 'trendVisible':
      trendVisible.value = true;
      break;
    default:
      break;
  }
};
const clickLeft = () => {
  if (leftDisabled.value) return;
  activeIndex.value -= 1;
};
const clickright = () => {
  if (rightDisabled.value) return;
  activeIndex.value += 1;
};

const clickSelfHandleNum = (key: string) => {
  handleListDialogType.value = 'self';
  handleListDialogParams.value = {
    platformCode: platformCode.value,
  };
  switch (key) {
    case 'selfHandleNum':
      handleListDialogParams.value.status = '';
      break;
    case 'selfEndNum':
      handleListDialogParams.value.status = '1';
      break;
    case 'selfOvertimeNum':
      handleListDialogParams.value.status = '2';
      break;
    default:
      break;
  }
  showSelfHandleDialog.value = true;
};

const clickManualHandleNum = (key: string) => {
  handleListDialogType.value = 'manual';
  handleListDialogParams.value = {
    platformCode: platformCode.value,
    direction: 2,
  };
  switch (key) {
    case 'flowinNum':
      handleListDialogParams.value.eventStatus = '';
      break;
    case 'flowinEndNum':
      handleListDialogParams.value.eventStatus = '5';
      break;
    case 'flowinOvertimeNum':
      handleListDialogParams.value.eventStatus = '';
      handleListDialogParams.value.overtimeFlag = '2';
      break;
    default:
      break;
  }
  showSelfHandleDialog.value = true;
};

const clickInListNum = (item: TableItem) => {
  handleListDialogType.value = 'manual';
  handleListDialogParams.value = {
    platformCode: platformCode.value,
    sendPlatformCode: item.platformCode,
    direction: 2,
  };
  switch (item.clickCol) {
    case 'flowinNum':
      handleListDialogParams.value.eventStatus = '';
      break;
    case 'endNum':
      handleListDialogParams.value.eventStatus = '5';
      break;
    case 'overtimeNum':
      handleListDialogParams.value.eventStatus = '';
      handleListDialogParams.value.overtimeFlag = '2';
      break;
    default:
      break;
  }
  showSelfHandleDialog.value = true;
};

const clickOutListNum = (item: TableItem) => {
  handleListDialogType.value = 'manual';
  handleListDialogParams.value = {
    platformCode: platformCode.value,
    outPlatformCode: item.platformCode,
    direction: 1,
  };
  showSelfHandleDialog.value = true;
};

const closeSelfHandleDialog = () => {
  showSelfHandleDialog.value = false;
};

// 获取事件流转-平台和事件汇聚统计
const getPlatformAndEventStatisticsData = async () => {
  const { data } = await apiEventFlowObj.postPlatformAndEventStatistics(
    panelSearchParams.district,
    panelSearchParams.endTime,
    panelSearchParams.startTime
  );
  Object.assign(platformAndEventStatistics, data);
};
// 事件流转-平台统计
const getPlatformStatisticsData = async () => {
  const { data } = await apiEventFlowObj.postPlatformStatistics(
    panelSearchParams.district,
    panelSearchParams.endTime,
    panelSearchParams.startTime
  );
  platformList.value = data;
  if (!platformCode.value && data.length) {
    platformCode.value = platformList.value[0].platformCode;
  }
};
// 事件流转-平台总览
const getPlatformOverviewData = async () => {
  const { data } = await apiEventFlowObj.postPlatformOverview({
    ...panelSearchParams,
    platformCode: platformCode.value,
  });
  Object.assign(platformOverview, data);
};
// 事件流转-平台处置分析
const getPlatformHandleAnalysisData = async () => {
  const { data } = await apiEventFlowObj.postPlatformHandleAnalysis({
    ...panelSearchParams,
    platformCode: platformCode.value,
  });
  Object.assign(platformHandleAnalysis, data);
};
const getData = async (params: any) => {
  showData.value = false;
  Object.assign(panelSearchParams, pick(params, 'startTime', 'endTime', 'district'));
  await getPlatformAndEventStatisticsData();
  await getPlatformStatisticsData();
  await getPlatformOverviewData();
  await getPlatformHandleAnalysisData();
  showData.value = true;
};

// 初始化数据
getData({ ...searchParams });

const overviewList = ref([
  {
    name: '平台处置',
    key: 'handleNum',
  },
  {
    name: '平台办结',
    key: 'endNum',
  },
  {
    name: '平台超时',
    key: 'overtimeNum',
  },
  {
    name: '流出事件',
    key: 'flowoutNum',
  },
]);
const flowInListCols = [
  {
    label: '流入来源',
    key: 'platformName',
  },
  {
    label: '流入事件(件)',
    key: 'flowinNum',
  },
  {
    label: '已办结(件)',
    key: 'endNum',
  },
  {
    label: '处置超时(件)',
    key: 'overtimeNum',
  },
];
const flowInListCursorKeys = ['flowinNum', 'endNum', 'overtimeNum'];
const flowOutListCols = [
  {
    label: '流出去向',
    key: 'platformName',
  },
  {
    label: '流出事件(件)',
    key: 'flowoutNum',
  },
];
const flowOutListCursorKeys = ['flowoutNum'];

const refreshData = () => {
  getData({ ...searchParams });
};

defineExpose({
  refreshData,
});
</script>
<style scoped lang="scss">
.title-wrap {
  height: calc(var(--xl) * 1.2);
  background: url("@/assets/images/eventCenter/ghleft/header-bg.png") no-repeat;
  background-size: 71% 100%;

  .title {
    font-size: calc(var(--xl) * 0.6);
    color: #ffffff;
    background: linear-gradient(180deg, #ffffff 0%, #8ad1f9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
  }

  &.title-wrap-normal {
    background: none;
  }
}

.gh-top {
  height: calc(var(--xl) * 3.58);
  background: url("@/assets/images/eventCenter/ghleft/top1-bg.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: space-around;

  .item {
    margin-top: calc(var(--xl) * -0.2);
    display: flex;
    align-items: center;
    flex-direction: column;

    .con {
      .value {
        font-size: calc(var(--xl) * 0.9);
        font-weight: bold;
        color: #ffffff;
        background: linear-gradient(180deg, #eeeeee 0%, #5eb5ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        cursor: pointer;
      }

      .unit {
        font-size: calc(var(--xl) * 0.4);
        color: #ffffff;
      }
    }

    .label {
      font-size: calc(var(--xl) * 0.5);
      letter-spacing: calc(var(--xl) * 0.07);
    }
  }
}

.carousel {
  display: flex;
  justify-content: space-between;
  gap: calc(var(--xl) * 0.45);

  .carousel-left {
    width: calc(var(--xl) * 0.68);
    height: calc(var(--xl) * 2.6);
    background: url("@/assets/images/eventCenter/ghleft/left.png") no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
  }

  .carousel-con {
    display: flex;
    flex: 1;
    justify-content: left;
    gap: calc(var(--xl) * 0.45);

    .carousel-item {
      width: calc(var(--xl) * 5.3);
      height: calc(var(--xl) * 2.6);
      background: url("@/assets/images/eventCenter/ghleft/platform-normal.png") no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      .name {
        font-size: calc(var(--xl) * 0.64);
        color: #ffffff;
      }

      .con {
        font-size: calc(var(--xl) * 0.5);
        .value {
          color: #82ffa1;
        }
      }

      &.active {
        background: url("@/assets/images/eventCenter/ghleft/platform-active.png")
          no-repeat;
        background-size: 100% 100%;

        .name {
          font-size: calc(var(--xl) * 0.64);
          color: #ffc97a;
        }
      }
    }
  }

  .carousel-right {
    width: calc(var(--xl) * 0.68);
    height: calc(var(--xl) * 2.6);
    background: url("@/assets/images/eventCenter/ghleft/right.png") no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
  }

  .disabled-arrow {
    cursor: not-allowed !important;
  }
}

.handle-wrap {
  height: calc(var(--xl) * 2.34);
  background: url("@/assets/images/eventCenter/ghleft/handle-bg.png") no-repeat;
  background-size: 100% 100%;
  background-position: bottom;
  display: flex;
  justify-content: space-between;
  padding: 0 calc(var(--xl) * 0.2);

  .handle-item {
    display: flex;
    flex: 1;
    justify-content: left;

    .icon {
      width: calc(var(--xl) * 3.15);
      height: calc(var(--xl) * 2.34);

      &.icon1 {
        background: url("@/assets/images/eventCenter/ghleft/icon1.png") no-repeat;
        background-size: contain;
        background-position: bottom;
      }

      &.icon2 {
        background: url("@/assets/images/eventCenter/ghleft/icon2.png") no-repeat;
        background-size: contain;
        background-position: bottom;
      }

      &.icon3 {
        background: url("@/assets/images/eventCenter/ghleft/icon3.png") no-repeat;
        background-size: contain;
        background-position: bottom;
      }

      &.icon4 {
        background: url("@/assets/images/eventCenter/ghleft/icon4.png") no-repeat;
        background-size: contain;
        background-position: bottom;
      }

      &.icon5 {
        background: url("@/assets/images/eventCenter/ghleft/icon5.png") no-repeat;
        background-size: contain;
        background-position: bottom;
      }

      &.icon6 {
        background: url("@/assets/images/eventCenter/ghleft/icon6.png") no-repeat;
        background-size: contain;
        background-position: bottom;
      }
    }

    .con {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: calc(var(--xl) * 0.1);

      .value {
        font-size: calc(var(--xl) * 0.8);
        cursor: pointer;
        .unit {
          color: #96bee0;
          font-size: calc(var(--xl) * 0.52);
        }
      }

      .label {
        color: #ffffff;
        font-size: calc(var(--xl) * 0.52);
      }
    }
  }
}

.overview-wrap {
  background: url("@/assets/images/eventCenter/ghleft/zl-bg.png") no-repeat;
  background-size: 100% 100%;

  .overView-item {
    margin-top: calc(var(--xl) * -0.8);
    width: calc(var(--xl) * 3.2);
    height: calc(var(--xl) * 2.8);
    background: url("@/assets/images/eventCenter/ghleft/zl-item-bg.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .value {
      margin-top: calc(var(--xl) * -0.4);
      font-size: calc(var(--xl) * 1);
      color: #ffc97a;
      font-weight: bold;
    }

    .label {
      font-size: calc(var(--xl) * 0.58);
      color: #ffffff;
    }
  }
}
</style>
