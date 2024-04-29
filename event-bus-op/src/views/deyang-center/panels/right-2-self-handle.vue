<template>
  <hv-panel title="事件列表">
    <!--仅 ALL 展示实时事件 -->
    <!-- <template #title>
      <hl-group v-if="searchParams.eventStatus === ALL" align="items-middle">
        <div
          class="header-tabs"
          :class="headerMode === 'realTime' ? 'active' : null"
          @click="headerMode = 'realTime'"
        >
          实时事件
        </div>
        <div
          class="header-tabs"
          :class="headerMode === 'eventList' ? 'active' : null"
          @click="headerMode = 'eventList'"
        >
          事件列表
        </div>
      </hl-group>
      <hl-group v-else>事件列表</hl-group>
    </template> -->
    <!-- <template #title v-else> 事件列表 </template> -->

    <!-- <template #action>
      <hl-group dir="vertical" gap="var(--xxs)">
        <hl-button class="standard-text" type="primary" @click="toggleEventSearchMode"
          >事件搜索</hl-button
        >
      </hl-group>
    </template> -->
    <!-- ALL 的 实时列表 -->
    <template v-if="searchParams.eventStatus === ALL && headerMode === 'realTime'">
      <c-tabs
        :isFull="true"
        :tabs="realTimeTabs"
        class="w-full m-t-sm m-b-xs"
        @update:modelValue="changeRealTime"
        v-model="realTimeEventTabType"
      ></c-tabs>
      <real-time-event-list
        ref="realTimeEventRef"
        :realTimeEventTabType="realTimeEventTabType"
      ></real-time-event-list>
    </template>
    <template v-else>
      <hl-group class="w-full m-t-sm m-b-xs" align="items-between" gap="var(--md)">
        <c-tabs
          :isFull="true"
          v-model="eventTabType"
          :tabs="eventTabOptions"
          v-if="showStatTab"
        >
          <template v-slot="{ option }">
            <span class="standard-text">
              {{ option.label }}
              <b style="color: #82ffa1">{{
                statNum && !isNaN(statNum[option.numName])
                  ? statNum[option.numName]
                  : "--"
              }}</b>
              <!-- <b style="color: #82ffa1">{{ statNum[option.numName] }}</b> -->
              件
            </span>
          </template>
        </c-tabs>
      </hl-group>
      <template v-if="EVENT_ORIGIN_TABS.includes(eventTabType)">
        <origin-event-list ref="originEventRef" @setTabsNum="setTabsNum" />
      </template>
      <template v-else-if="eventTabType === 'manualPending'">
        <manual-handle-event-list />
      </template>
      <template v-else-if="eventTabType === 'warning'">
        <abnormal-list />
      </template>
      <template v-else>
        <self-handle-event-list />
      </template>
    </template>
  </hv-panel>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, watch, nextTick } from 'vue';
import { apiSelfHanleObj as api } from '@/apis';
import { useGlobalState } from '@/hooks';
import RealTimeEventList from '../components/real-time-list.vue';
import OriginEventList from '../components/origin-event-list.vue';
import ManualHandleEventList from '../components/manual-handle-event-list.vue';
import SelfHandleEventList from '../components/self-handle-event-list.vue';
import AbnormalList from '../components/abnormal-list.vue';

import { EVENT_LIST_TABS, EVENT_ORIGIN_TABS, DEFAULT_TAB, ALL } from '../constant';

const { searchParams, toggleEventSearchMode } = useGlobalState();

const realTimeTabs = [
  {
    label: '全部事件',
    value: '',
  },
  {
    label: '一般事件',
    value: '1',
  },
  {
    label: '紧急事件',
    value: '2',
  },
];
const realTimeEventTabType = ref('');

const realTimeEventRef = ref();
const originEventRef = ref();

const headerMode = ref('realTime');
const eventTabType = ref('manual');
watchEffect(() => {
  eventTabType.value = DEFAULT_TAB[searchParams.eventStatus];
});

watch(
  () => searchParams.eventStatus,
  n => {
    n === ALL ? (headerMode.value = 'realTime') : (headerMode.value = 'eventList');
  },
  {
    immediate: true,
    deep: true,
  }
);

const eventTabOptions = computed(() => {
  return EVENT_LIST_TABS[searchParams.eventStatus];
});

const props = defineProps({
  eventStatus: {
    type: String,
    default: '',
  },
});

const statNum = ref();
const showStatTab = ref(false);
const setTabsNum = (tabs: any) => {
  showStatTab.value = false;
  nextTick(() => {
    statNum.value = tabs;
    showStatTab.value = true;
  });
};

const changeRealTime = () => {
  nextTick(() => {
    realTimeEventRef.value.refreshData();
  });
};

const refreshData = () => {
  realTimeEventRef.value?.refreshData();
};
const resetOriginEvent = () => {
  originEventRef.value?.search();
};

defineExpose({
  refreshData,
  resetOriginEvent,
});
</script>
<style lang="scss" scoped>
.page-content {
  justify-content: space-between;
  font-size: calc(var(--xl) * 0.48);
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  .page-count {
    color: #36b7ff;
  }
}
:deep(.hl-input .input-inner) {
  color: #96bee0 !important;
}

.header-tabs {
  color: #96bee0;
  cursor: pointer;
  margin-right: calc(var(--xl) * 0.48);
  position: relative;

  &.active {
    color: #ffffff;

    &::after {
      position: absolute;
      content: "";
      bottom: calc(var(--xl) * -0.4);
      left: 0;
      width: calc(var(--xl) * 2.5);
      height: calc(var(--xl) * 1);
      background-image: url("@/assets/images/panelBox/active-bg.png");
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: left bottom;
      z-index: 1;
    }
  }
}
</style>
