<template>
  <hl-group
    dir="vertical"
    gap-x="var(--md)"
    gap-y="calc(var(--xxs)* 4.25)"
    class="page-left"
  >
    <!-- 首页 -->
    <template v-if="!isEventSearchMode">
      <template v-if="searchParams.eventStatus === ALL">
        <!-- <left-1-gh ref="leftFirstRef" /> -->
        <left-1-dy />
        <left-2-dy />
      </template>

      <template v-if="searchParams.eventStatus === WAITING">
        <left-1 />
        <left-2-wating />
        <left-3-waiting />
      </template>

      <template v-if="searchParams.eventStatus === PENDING">
        <left-1 />
        <left-2-pending />
        <left-3-pending />
      </template>

      <template v-if="searchParams.eventStatus === FINISHED">
        <left-1 />
        <left-2-finished />
        <left-3-finished />
      </template>
    </template>

    <!-- 事件搜索模式-->
    <template v-else>
      <left-event-search
        ref="leftEventSearch"
        @search="handleSearch"
        @reset="handleReset"
      />
    </template>
  </hl-group>

  <hl-group
    dir="vertical"
    gap-x="var(--md)"
    gap-y="calc(var(--xxs)* 4.25)"
    class="page-right"
  >
    <template v-if="!isEventSearchMode">
      <template v-if="searchParams.eventStatus === ALL">
        <right-1 />
        <right2Monitoring />
      </template>

      <template v-if="searchParams.eventStatus === WAITING">
        <right-1-waiting />
        <right-2 :eventStatus="searchParams.eventStatus" />
      </template>

      <template v-if="searchParams.eventStatus === PENDING || searchParams.eventStatus === FINISHED">
        <right-1-pending :eventStatus="searchParams.eventStatus" />
        <right-2 :eventStatus="searchParams.eventStatus" />
      </template>
    </template>

    <!-- 事件搜索模式-->
    <template v-else>
      <right-event-list ref="rightEventList" />
    </template>
  </hl-group>

  <!-- 底部事件 -->
  <footer-event-list v-if="searchParams.eventStatus === ALL"/>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';
import { useGlobalState, useRefresh } from '@/hooks';
import { ALL, WAITING, PENDING, FINISHED } from './constant';
import { GlobalAPI } from '@/common';

import left1 from './panels/left-1.vue';
import left1Gh from './panels/left-1-gh.vue';
import left1Dy from './panels/left-1-dy.vue';
import left2 from './panels/left-2.vue';
import left2Dy from './panels/left-2-dy.vue';
import left3 from './panels/left-3.vue';
import left2Wating from './panels/left-2-wating.vue';
import left2Pending from './panels/left-2-pending.vue';
import left3Waiting from './panels/left-3-waiting.vue';
import left3Pending from './panels/left-3-pending.vue';
import left2Finished from './panels/left-2-finished.vue';
import left3Finished from './panels/left-3-finished.vue';
import right1 from './panels/right-1.vue';
import right1Waiting from './panels/right-1-waiting.vue';
import right1Pending from './panels/right-1-pending.vue';
import right2 from './panels/right-2-self-handle.vue';
import right2Monitoring from './panels/right-2-monitoring.vue';
import LeftEventSearch from './panels/left-event-search.vue';
import RightEventList from './panels/right-event-list.vue';

const { searchParams, isEventSearchMode } = useGlobalState();
const {
  startTimer,
  destoryTimer,
  addToRefreshQueue,
  indexPageRefreshFlag,
} = useRefresh();

const leftEventSearch = ref();
const rightEventList = ref();

// 刷新子组件数据，保留原参数
const leftFirstRef = ref();
const rightFirstRef = ref();
const rightSecondRef = ref();
const secondSet = GlobalAPI.config.LOOP_SECONDS || 30;
watch(
  () => indexPageRefreshFlag.value,
  (n, o) => {
    if (n !== o) {
      leftFirstRef.value?.refreshData();
      rightFirstRef.value?.refreshData();
      rightSecondRef.value?.refreshData();
      rightSecondRef.value?.resetOriginEvent();
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

const handleSearch = () => {
  rightEventList.value.search();
};

const handleReset = () => {
  rightEventList.value.reset();
};

addToRefreshQueue(() => {
  leftFirstRef.value?.refreshData();
  rightFirstRef.value?.refreshData();
  rightEventList.value?.refreshData();
  rightSecondRef.value?.refreshData();
});

// 全局定时刷新
startTimer(secondSet * 1000);

onBeforeUnmount(() => {
  destoryTimer();
});
</script>

<style lang="scss" scoped>
.today-condition {
  position: absolute;
  top: calc(var(--xxs) * 24);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.float-number {
  position: absolute;
  left: size(32px);
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
}
</style>
