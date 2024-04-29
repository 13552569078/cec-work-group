<template>
  <hl-group class="page-header" full align="items-center">
    <div class="header-title"></div>
    <div>
      <span class="header-txt-color gh-fs-100 gh-f-f-num">{{ currentTime.split(' ')[1] }}</span>
      <span class="header-txt-color date">{{  currentTime.split(' ')[0] }}</span>
      <span class="header-txt-color">星期{{ dayMap[day] }}</span>
    </div>
    <hl-group class="header-right" align="items-right items-middle" gap="var(--sm)">
      <PageHeaderWeather style="margin-right: calc(var(--xxs) * 45.25);"/>
      <hl-group class="exit-button cursor-pointer" align="items-center items-middle" @click="handleExit">
        <hl-icon class="m-r-sm">
          <FillSignout />
        </hl-icon>
        <span>退出</span>
      </hl-group>
      <!-- <hl-button equal round @click="changeFullScreen">
        <template #icon>
          <hl-icon>
            <fill-maximize />
          </hl-icon>
        </template>
      </hl-button> -->

      <!-- <message /> -->

      <!-- <hl-popover trigger="hover" popper-class="reset-popper">
        <template #reference>
          <hl-button equal round>
            <template #icon>
              <hl-icon>
                <fill-user />
              </hl-icon>
            </template>
          </hl-button>
        </template>
        <div class="p-l-sm p-r-sm p-t-md">
          <div class="font-bold font-lg">{{ userInfo?.empname }}</div>
          <div class="font-md" style="color: #6F8EA8">{{ userInfo?.orgname }}</div>
        </div>
        <hr class="w-full m-t-sm m-b-md" style="background:var(--border-regular)"/>
        <hl-list hover class="m-b-md">
          <hl-list-item @click="handleLogout">
            <template #prefix>
              <hl-icon class="m-r-sm">
                <FillSignout />
              </hl-icon>
            </template>
            退出
          </hl-list-item>
        </hl-list>
      </hl-popover> -->
    </hl-group>
  </hl-group>

  <!-- 弹窗：事件统计 -->
  <event-statistics v-if="!isEventSearchMode && showHeaderRouterList.includes(routerName as string)" />

  <!-- 全局搜索 -->
  <global-search-panel-header v-if="!isEventSearchMode" />

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

const route = useRoute();
const router = useRouter();
const isHandlingPage = computed(() => route.path.indexOf('event-handling') > -1);
const goHome = () => {
  router.push({ name: 'overview' });
};

const routerName = computed(() => {
  return router.currentRoute.value.name ?? '';
});

const { isEventSearchMode } = useGlobalState();

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

onMounted(async() => {
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

</script>
<style lang="scss" scoped>
.exit-button {
  width: calc(var(--xxl) * 1.93);
  height: calc(var(--xxl) * 0.8);
  background-image: url('@/assets/images/guanghan/exit-button-bg.png');
  background-size: contain;
  background-repeat: no-repeat;
}
.hl-popover.reset-popper {
  padding: 0;
}
.page-header{
  height: calc(var(--xxl) * 3.15);
  background-image: url(@/assets/images/guanghan/header-bg.png);
  background-size: 100% 100%;
  position: relative;
  padding: calc(var(--xxs) * 5 / 1.07) calc(var(--xxs) * 12 / 1.07) 0;

  font-size: calc(var(--xxs) * 3.75 / 1.07);
  line-height: calc(var(--xxs) * 5.25 / 1.07);
  .header-title{
    position: absolute;
    width: calc(var(--xxl) * 18.265 / 1.07);
    height: calc(var(--xxl) * 1.9 / 1.07);
    background-image: url(@/assets/images/guanghan/header-title.png);
    background-size: 100% 100%;
    left: 50%;
    transform: translateX(-50%);
    top: calc(var(--xxl) * 0.2);
  }

  .date{
    margin: 0 calc(var(--xxs) * 18 / 1.07) 0 calc(var(--xxs) * 19.25 / 1.07);
  }

  .header-right{
    position: absolute;
    right: calc(var(--xxs) * 12 / 1.07);
    // top: calc(var(--xxs) * 9 / 1.07);
  }
}
</style>
