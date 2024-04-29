<template>
  <hl-group class="page-header" full align="items-center">
    <!-- <div class="header-title"></div> -->
    <div class="header-left">
      <area-select v-model="searchParams.district" @change="handleAreaChange" class="header-dict m-r-lg" />
      <dy-tabs v-model="quickTimeMode" :tabs="timesTabs" @update:modelValue="changeCurrentTimeSelect" class="tabs-wrap"/>
    </div>
    <div class="header-right">
      <span class="icon-time"></span>
      <span class="m-l-md">{{ currentTime.split(" ")[0] }}</span>
      <span class="m-l-md">
        {{
          currentTime.split(" ")[1]
        }}
      </span>
    </div>
  </hl-group>

  <div v-show="showHeader">
    <!-- 弹窗：事件统计 -->
    <event-statistics />
  </div>

  <!-- 全局搜索 -->
  <!-- <global-search-panel-header v-if="!isEventSearchMode" :isShowSearch="showHeader" /> -->

  <!-- <toggle-button v-if="!isEventSearchMode && showHeaderRouterList.includes(routerName as string)" v-model="showHeader" /> -->
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { FillSetting, FillMaximize, FillBell, FillUser } from '@hongluan-ui/icons';
import { useMaxScreen } from 'fx-front-framework';
import PageHeaderWeather from './page-header-weather.vue';
// import WeatherDetail from '@/views/weather-detail/index.vue';
import { GlobalAPI } from '@/common';
import dayjs from 'dayjs';
import { useWeather, useGlobalState } from '@/hooks';
import { useRoute, useRouter } from 'vue-router';
import ToggleButton from './components/toggle-button.vue';
import SystemTitle from '@/assets/images/header-stat-box/system-title.png';

const route = useRoute();
const router = useRouter();
const isHandlingPage = computed(() => route.path.indexOf('event-handling') > -1);
const goHome = () => {
  router.push({ name: 'overview' });
};

const showHeader = ref(true);

const routerName = computed(() => {
  return router.currentRoute.value.name ?? '';
});

const { searchParams, globalSearchIsChanged, isEventSearchMode, isLastLevelArea } = useGlobalState();

const { PROD_TITLE } = GlobalAPI.config;

const { latestWeather, getLatestWeather } = useWeather();
const weatherVisible = ref(false);
const showHeaderRouterList = ['event-center'];

const dayMap = ['日', '一', '二', '三', '四', '五', '六'];
const currentTime = ref(dayjs().format('YYYY年MM月DD日 HH:mm:ss'));
const day = ref(dayjs().day());
let timer: any = '';
const showWeather = () => {
  weatherVisible.value = true;
};

onMounted(async () => {
  // getLatestWeather();
  timer = setInterval(() => {
    currentTime.value = dayjs().format('YYYY年MM月DD日 HH:mm:ss');
    day.value = dayjs().day();
  }, 1000);
});
onBeforeUnmount(() => {
  clearTimeout(timer);
});
const handleExit = () => {
  GlobalAPI.config.LOGINOUT_URL && window.location.replace(GlobalAPI.config.LOGINOUT_URL);
  console.log('退出');
};

// 德阳模块新增都不筛选
// 新增快捷时间条件
const startTimePadStr = '00:00:00';
const endTimePadStr = '23:59:59';
const quickTimeMode = ref(2);
const timesTabs = [
  {
    label: '本日',
    value: 1,
  },
  {
    label: '本月',
    value: 2,
  },
  {
    label: '本季度',
    value: 3,
  }, {
    label: '本年',
    value: 4,
  }, {
    label: '2023年',
    value: 2023,
  }
];

const handleSearchTimeChanged = (value: string[]) => {
  searchParams.startTime = value[0];
  searchParams.endTime = value[1];
  globalSearchIsChanged();
};
const changeCurrentTimeSelect = (val: string | number) => {
  searchParams.timeDimension = quickTimeMode.value;
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
    case 2023:
      handleSearchTimeChanged(['2023-01-01 00:00:00',
        '2023-12-31 23:59:59'
      ]);
      break;
    default:
      break;
  }
};

const handleAreaChange = (areaNode: any) => {
  if (areaNode.children.length > 0) {
    isLastLevelArea.value = false;
  } else {
    isLastLevelArea.value = true;
  }
  globalSearchIsChanged();
};

</script>
<style lang="scss" scoped>
.exit-button {
  width: calc(var(--xxl) * 1.93);
  height: calc(var(--xxl) * 0.8);
  background-image: url("@/assets/images/guanghan/exit-button-bg.png");
  background-size: contain;
  background-repeat: no-repeat;
}

.hl-popover.reset-popper {
  padding: 0;
}

.page-header {
  height: calc(var(--xxs) * 34.25);
  background-image: url('@/assets/images/deyang/header/header-bg.png');
  background-size: 100% 100%;
  position: relative;
  padding: calc(var(--xxs) * 5 / 1.07) calc(var(--xxs) * 12 / 1.07) 0;

  font-size: calc(var(--xxs) * 20 / 4);
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  line-height: calc(var(--xxs) * 5.25 / 1.07);

  .header-title {
    position: absolute;
    width: calc(var(--xxl) * 18.265 / 1.07);
    height: calc(var(--xxl) * 1.9 / 1.07);
    // background-image: url('@/assets/images/guanghan/header-title.png');
    background-size: 100% 100%;
    left: 50%;
    transform: translateX(-50%);
    top: calc(var(--xxl) * 0.2);
  }

  .date {
    margin: 0 calc(var(--xxs) * 18 / 1.07) 0 calc(var(--xxs) * 19.25 / 1.07);
  }

  .header-right {
    position: absolute;
    right: calc(var(--xxs) * 12 / 1.07);
    margin-top: calc(var(--xxs) * 0.5);
    color: #FFFFFF;

    // top: calc(var(--xxs) * 9 / 1.07);
    .icon-time {
      position: relative;
      top: calc(var(--xxs) * 0.25);
      display: inline-block;
      width: calc(var(--xxs) * 20 / 4);
      height: calc(var(--xxs) * 20 / 4);
      background-image: url('@/assets/images/deyang/header/icon.png');
      background-size: 100% 100%;
    }
  }
}

.system-title {
  width: calc(var(--xxl) * 5.35);
  height: calc(var(--xxl) * 1.66);
  z-index: 999;
  position: absolute;
  top: calc(var(--xxl) * 2);
  left: 50%;
  transform: translate(-50%, 0);

  img {
    width: 100%;
    height: auto;
  }
}

.tabs-wrap{
  width: calc(var(--xxs) * 96);
}
.header-left{
  display: flex;
  height: calc(var(--xxs) * 28/4);
}
</style>
