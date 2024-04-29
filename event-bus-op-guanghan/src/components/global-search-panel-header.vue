<template>
  <div v-show="isGlobalSearchOpen">
    <hl-group class="panel" gap="var(--md)"
      v-if="showHeaderRouterList.includes(routerName as string)" align="items-middle">
      <!-- <box-close-button @click="toggleGlobalSearchBox"/> -->
      <hl-group class="items-middle" gap="var(--md)">

        <area-select v-if="!isAnalysis" v-model="searchParams.district" @change="handleAreaChange" class="header-dict" />

        <dict-select v-if="!isAnalysis" v-model="searchParams.platform" dictType="event_platform" class="header-dict"
          @change="globalSearchIsChanged" />

        <hl-group align="items-middle">
          <span class="static m-r-md small-text">时间选择</span>
          <hl-group class="w-full">
            <c-tabs :isFull="true" v-model="quickTimeMode" :tabs="timeTabs" @update:modelValue="changeCurrentTimeSelect" />
          </hl-group>

          <hl-popover placement="bottom-end" width="calc(var(--xxl) * 10)" trigger="click" class="m-r-md" @show="popMode = '收起'" @hide="popMode = '展开'">
            <template #reference>
              <hl-group class="m-l-md m-r-md toggle cursor-pointer small-text" style="width: calc(var(--xl) * 3); color: #139AFF;" align="items-middle">
                {{  popMode }}
                <hl-icon  effect="light" size="md" class="filter-handle hover:text-info transition" style="color: #139AFF;">
                  <two-chevron-bottom v-if="popMode === '展开'"  />
                  <two-chevron-top v-else  />
                </hl-icon>
              </hl-group>
            </template>
            <hl-group align="items-center" class="w-full">
              <quarter-time-select v-model="quarterAndMonthTimeObj" @change="handleQuarterAndMonthTimeChanged" />
            </hl-group>
          </hl-popover>
        </hl-group>

        <hl-group v-if="!isAnalysis" class="items-middle m-r-xl" gap="var(--md)">
          <span class="static small-text">事件状态</span>
          <hl-group>
            <c-tabs :isFull="true" v-model="searchParams.eventStatus" :tabs="options" @update:modelValue="globalSearchIsChanged" />
          </hl-group>
        </hl-group>
      </hl-group>

      <hl-button class="reset-btn small-text p-l-md p-r-md" @click="reset">重置</hl-button>
    </hl-group>
    <hl-group class="panel" gap="var(--md)" dir="vertical" v-if="['event-detail'].includes(routerName as string)">
      <hl-group class="tabs" gap="var(--md)" style="width: calc(var(--xl) * 7.45)">
        <hl-button  class="reset-btn small-text cursor-pointer" @click.stop="handleExit" style="width: calc(var(--xl) * 4)">退出事件</hl-button >
        <hl-button  class="reset-btn small-text cursor-pointer plain" @click.stop="handleResetEventDetailPage" style="width: calc(var(--xl) * 4)">重置</hl-button >
      </hl-group>
    </hl-group>
  </div>

  <footer-nav :currentPage="currentPage" @changeNav="handleNav" />
</template>
<script lang="ts" setup>
import { ref, computed, inject, nextTick } from 'vue';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { cloneDeep } from 'lodash-es';
import { getLastPath, DEFAULT_SET_TIME } from '@/common';
import { useGlobalState, useMapTools, useMapData } from '@/hooks';
import { ALL, WAITING, PENDING, FINISHED } from '@/views/event-center/constant';

const reload: any = inject('reload');

const {
  searchParams,
  globalSearchIsChanged,
  handleReset,
  isLastLevelArea,
  handleCloseBufferSearchPanel,
  resetResourceVideo,
  toggleGlobalSearchBox,
  clearCurrentEvent,
  isGlobalSearchOpen
} = useGlobalState();
const { flyToLast, flyToDefault, closeBuffer } = useMapTools();
const {
  getVideoMapPoint,
  getResourcesList
} = useMapData();
const page = getLastPath();

const router = useRouter();
const currentPage = ref(`event-${page}`);

const isAnalysis = computed(() => {
  return currentPage.value === 'event-analysis';
});

const routerName = computed(() => {
  return router.currentRoute.value.name ?? '';
});

const showHeaderRouterList = ['event-center'];

// 默认为当年当月
const quarterAndMonthTimeObj = ref(cloneDeep(DEFAULT_SET_TIME));

// 初始化搜索时间
const initSearchDate = () => {
  // 默认为当年当月
  quarterAndMonthTimeObj.value = cloneDeep(DEFAULT_SET_TIME);
};

// 新增快捷时间条件
const quickTimeMode = ref(3);
const startTimePadStr = '00:00:00';
const endTimePadStr = '23:59:59';

const popMode = ref('展开');

const timeTabs = computed(() => {
  return [
    {
      label: '本日',
      value: 1
    },
    {
      label: '本周',
      value: 2
    },
    {
      label: '本月',
      value: 3
    },
    {
      label: '本年',
      value: 4
    }
  ];
});

const changeCurrentTimeSelect = (val: string | number) => {
  switch (val) {
    case 1:
      handleSearchTimeChanged([`${dayjs().format('YYYY-MM-DD')} ${startTimePadStr}`, `${dayjs().format('YYYY-MM-DD')} ${endTimePadStr}`]);
      break;
    case 2:
      handleSearchTimeChanged([`${dayjs().startOf('week').format('YYYY-MM-DD')} ${startTimePadStr}`, `${dayjs().endOf('week').format('YYYY-MM-DD')} ${endTimePadStr}`]);
      break;
    case 3:
      handleSearchTimeChanged([`${dayjs().startOf('month').format('YYYY-MM-DD')} ${startTimePadStr}`, `${dayjs().endOf('month').format('YYYY-MM-DD')} ${endTimePadStr}`]);
      break;
    case 4:
      handleSearchTimeChanged([`${dayjs().startOf('year').format('YYYY-MM-DD')} ${startTimePadStr}`, `${dayjs().endOf('year').format('YYYY-MM-DD')} ${endTimePadStr}`]);
      break;
    default:
      break;
  }
};

const handleQuarterAndMonthTimeChanged = (value: string[]) => {
  quickTimeMode.value = '';
  handleSearchTimeChanged(value);
};

const handleSearchTimeChanged = (value: string[]) => {
  searchParams.startTime = value[0];
  searchParams.endTime = value[1];
  globalSearchIsChanged();
};

const handleAreaChange = (areaNode: any) => {
  if (areaNode.children.length > 0) {
    isLastLevelArea.value = false;
  } else {
    isLastLevelArea.value = true;
  }
  globalSearchIsChanged();
};

const options = ref([
  {
    value: ALL,
    label: '全部'
  },
  {
    value: WAITING,
    label: '待调度'
  },
  {
    value: PENDING,
    label: '处置中'
  },
  {
    value: FINISHED,
    label: '已办结'
  }
]);

const handleNav = (pageName: string) => {
  reset(false);
  currentPage.value = pageName;
  router.push({
    name: pageName
  });
};

const reset = (flag = true) => {
  initSearchDate();
  handleReset(flag);
};

const handleResetEventDetailPage = () => {
  reload();
  nextTick(() => {
    handleCloseBufferSearchPanel();
    flyToLast();
    closeBuffer();
    resetResourceVideo();
  });
};

const handleExit = () => {
  handleCloseBufferSearchPanel();
  flyToDefault();
  closeBuffer();
  resetResourceVideo();
  getVideoMapPoint();
  getResourcesList();
  clearCurrentEvent();
  nextTick(() => {
    const preRouter = router.options.history.state.back ?? '';
    const backName = (preRouter as string).includes('/event/analysis') ? 'event-analysis' : 'event-center';
    currentPage.value = backName;
    router.push({ name: backName });
  });
};
</script>

<style lang="scss" scoped>
.panel {
  // width: calc(var(--xxl) * 34.93);
  padding: calc(var(--md));
  position: relative;
  background: rgba(7, 24, 42, 0.95);
  // box-shadow: inset 0px 0px 20px 0px rgba(36, 131, 234, 0.46);
  border: 1px solid #159AFF;
  z-index: 999;
  position: absolute;
  left: 50%;
  top: calc(var(--xxl) * 6);
  transform: translate(-50%, 0);
}

.tabs {
  width: 100%;

  .tab-btn {
    color: white;
    // border: calc(var(--xxs) / 4) solid #70b2f7;
    background-color: transparent;
    background-image: url(@/assets/images/eventCenter/tab-off.png) !important;
    background-size: 100% 100%;
    border-radius: 2px;
    height: calc(var(--xxs) * 8);
    line-height: calc(var(--xxs) * 8) !important;
    width: 100%;
    text-align: center;
    position: relative;

    &.on {
      background-image: url(@/assets/images/eventCenter/tab-on.png) !important;
    }

    &:hover {
      background-image: url(@/assets/images/eventCenter/tab-on.png) !important;
    }

    // &:before,
    // &:after {
    //   content: '';
    //   display: block;
    //   position: absolute;
    //   left: -1px;
    //   top: 50%;
    //   height: 20%;
    //   width: 2px;
    //   transform: translate(0, -50%);
    //   background: rgb(83, 44, 49);
    //   background: linear-gradient(90deg, rgba(83, 44, 49, 1) 50%, rgba(253, 250, 190, 1) 50%);
    //   box-shadow: 0 0 7px 3px rgb(83, 44, 49);
    // }
    // &:after {
    //   right: -1px;
    //   left: auto;
    //   background: rgb(83, 44, 49);
    //   background: linear-gradient(270deg, rgba(83, 44, 49, 1) 50%, rgba(253, 250, 190, 1) 50%);
    // }
  }
}

.reset-btn {
  color: #D0DEEE !important;
  background: rgba(21, 154, 255, 0.25) !important;
  box-shadow: inset 0px calc(var(--xxl) * 0.34) calc(var(--xxl) * 0.32) 0px rgba(21,154,255,0.5), inset 0px 0px 12px 0px rgba(46,102,255,0.5);
  height: calc(var(--xxl) * 0.9);
  &.plain {
    background: #042441;
    border: 1px solid #159AFF !important;
    box-shadow: none;
    color: #96BEE0 !important;
  }
}</style>
