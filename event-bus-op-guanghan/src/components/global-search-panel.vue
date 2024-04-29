<template>
  <div v-show="isGlobalSearchOpen" >
    <hl-group class="panel" gap="var(--md)" dir="vertical"
      v-if="['event-center', 'event-analysis'].includes(routerName as string)">
      <box-close-button @click="toggleGlobalSearchBox"/>
      <hl-group class="tabs" gap="var(--md)">
        <div class="tab-btn font-xl cursor-pointer" :class="routerName === 'event-center' ? 'on' : ''"
          @click="handleNav('event-center')">事件总览</div>
        <div class="tab-btn font-xl cursor-pointer" :class="routerName === 'event-analysis' ? 'on' : ''"
          @click="handleNav('event-analysis')">监督分析</div>
      </hl-group>
      <hl-group class="items-middle" gap="var(--md)" v-if="!isAnalysis">
        <span class="static">事件状态</span>
        <hl-select v-model="searchParams.eventStatus" class="w-full" size="sm" @change="globalSearchIsChanged">
          <hl-option v-for="option in options" :key="option.label" :label="option.label" :value="option.value" />
        </hl-select>
      </hl-group>
      <hl-group align="items-middle">
        <span class="static m-r-md">时间选择</span>
        <quarter-time-select v-model="quarterAndMonthTimeObj" @change="handleQuarterAndMonthTimeChanged" />
      </hl-group>
      <hl-group align="items-middle">
        <span class="static m-r-md" style="opacity: 0;">时间选择</span>
        <hl-group class="w-full">
          <c-tabs :isFull="true" v-model="quickTimeMode" :tabs="timeTabs" @update:modelValue="changeCurrentTimeSelect" />
        </hl-group>
      </hl-group>
      <hl-group class="items-middle" gap="var(--md)" v-if="!isAnalysis">
        <span class="static">地区选择</span>
        <area-select v-model="searchParams.district" @change="handleAreaChange" />
      </hl-group>
      <hl-group class="items-middle" gap="var(--md)" v-if="!isAnalysis">
        <span class="static">平台选择</span>
        <dict-select v-model="searchParams.platform" dictType="event_platform" class="w-full"
          @change="globalSearchIsChanged" />
      </hl-group>
      <hl-button class="reset-btn" style="height: calc(var(--xxs) * 8)" @click="reset">重置</hl-button>
    </hl-group>
    <hl-group class="panel" gap="var(--md)" dir="vertical" v-if="['event-detail'].includes(routerName as string)">
      <hl-group class="tabs" gap="var(--md)">
        <div class="tab-btn font-xl cursor-pointer" @click.stop="handleExit">退出事件</div>
        <div class="tab-btn font-xl cursor-pointer" @click.stop="handleResetEventDetailPage">重置</div>
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
import userAuth from '@/common/user-auth';
import { getLastPath, DEFAULT_SET_TIME, GlobalAPI } from '@/common';
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
  isGlobalSearchOpen
} = useGlobalState();
const { flyToLast, flyToDefault, closeBuffer } = useMapTools();
const { getVideoMapPoint, getResourcesList } = useMapData();
const page = getLastPath();

const router = useRouter();
const currentPage = ref(`event-${page}`);

const isAnalysis = computed(() => {
  return currentPage.value === 'event-analysis';
});

const routerName = computed(() => {
  return router.currentRoute.value.name ?? '';
});

// 默认为当年当月
const quarterAndMonthTimeObj = ref(cloneDeep(DEFAULT_SET_TIME));

// 初始化搜索时间
const initSearchDate = () => {
  // 默认为当年当月
  quarterAndMonthTimeObj.value = cloneDeep(DEFAULT_SET_TIME);
};

// 新增快捷时间条件
const quickTimeMode = ref('');
const startTimePadStr = '00:00:00';
const endTimePadStr = '23:59:59';
const secondaryOpen = computed(() => {
  return GlobalAPI.config.SECONDARY === 'open';
});
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
const goOnlineAnalysis = () => {
  document.location.href = `${GlobalAPI.config.LINKAGE_URL}?token=${userAuth.getFxToken()}`;
};

const reset = (flag = true) => {
  initSearchDate();
  handleReset(flag);
  flyToDefault();
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
  width: calc(var(--xxl) * 9.33008);
  padding: calc(var(--lg));
  position: relative;
  background: rgba(7, 24, 42, 0.95);
  box-shadow: inset 0px 0px 20px 0px rgba(36, 131, 234, 0.46);
  border: 1px solid #159AFF;
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
  color: #d0deee !important;
  background: rgba(21, 154, 255, 0.25) !important;
  box-shadow: inset 0px 34px 32px 0px rgba(21, 154, 255, 0.5), inset 0px 0px 12px 0px rgba(46, 102, 255, 0.5) !important;
}

.page-header-secondary {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: calc(var(--xxl) * 13.45);
  top: calc(var(--xxl) * 1.86);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .title-secondary {
    width: calc(var(--xxl) * 5.05);
    height: calc(var(--xxl) * 1.66);
    background-image: url('@/assets/images/guanghan/secondary-title.png');
    background-size: 100% 100%;
  }
  .title-tabs-wrap {
    width: calc(var(--xxl) * 13.45);
    height: calc(var(--xxl) * 1.66);
    background-image: url('@/assets/images/guanghan/secondary-bg.png');
    background-size: contain;
    margin-top: calc(var(--xxl) * -0.46);
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-around;
    .tabs-item {
      height: calc(var(--xxl) * 1.3);
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: center;
      color: #bdd4eb;
      font-size: calc(var(--xxl) * 0.52);
      &.on {
        color: #fff8ef;
        background: url('@/assets/images/guanghan/tabs-bg.png') no-repeat;
        background-position: left bottom;
        background-size: contain;
      }
    }
  }
}
</style>
