<template>
  <div v-show="isShowSearch">
    <hl-group class="panel" gap="var(--md)"
      v-if="showHeaderRouterList.includes(routerName as string)" align="items-middle">
      <!-- <box-close-button @click="toggleGlobalSearchBox"/> -->
      <hl-group  gap="var(--lg)">

        <hl-group align="items-middle">
          <hl-popover class="no-border" popper-class="no-border" placement="bottom-start" width="calc(var(--xxl) * 10)" trigger="click"  @show="popMode = true" @hide="popMode = false">
            <template #reference>
              <hl-group class="toggle cursor-pointer standard-text m-r-xxs" style="width: calc(var(--xl) * 4.5); color: #139AFF;" align="items-middle">
                自定义时间
              </hl-group>
            </template>
            <hl-group align="items-center" class="w-full">
              <quarter-time-select v-model="quarterAndMonthTimeObj" @change="handleQuarterAndMonthTimeChanged" />
            </hl-group>
          </hl-popover>

          <hl-group class="w-full">
            <c-tabs :isFull="true" v-model="quickTimeMode" :tabs="timeTabs" @update:modelValue="changeCurrentTimeSelect" :compact="true" />
          </hl-group>

        </hl-group>

        <hl-group v-if="!isAnalysis" class="items-middle" gap="var(--xxs)">
          <hl-group>
            <hl-select v-model="searchParams.eventStatus" popper-append-to-body  @change="globalSearchIsChanged" style="width: calc(var(--xl) * 4) !important;" >
              <hl-option v-for="option in options" :key="option.label" :label="option.label" :value="option.value" />
            </hl-select>
          </hl-group>
          <area-select v-if="!isAnalysis" v-model="searchParams.district" @change="handleAreaChange" class="header-dict" />
          <dict-select v-if="!isAnalysis" v-model="searchParams.platform" dictType="event_platform" class="header-dict"
            @change="globalSearchIsChanged" />
        </hl-group>

        <hl-button class="reset-btn small-text p-l-md p-r-md" @click="reset">重置</hl-button>
      </hl-group>

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

const props = defineProps({
  isShowSearch: {
    type: Boolean,
    default: true
  }
});

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

const popMode = ref(false);

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
    label: '全部状态'
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
  padding: calc(var(--md)) 0;
  position: relative;
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
