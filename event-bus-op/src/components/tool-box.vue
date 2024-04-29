<template>
  <div class="exit-tool-box-button" @click="handleExit" v-if="currentName !== 'event-center'">
    <img :src="iconExitButton" />
    <span>返回</span>
  </div>

  <!-- <template v-if="!isEventSearchMode">
    <hl-group v-show="isToolBoxOpen" class="tool-box" dir="vertical" gap="var(--md)">
      <div
        class="cell"
        v-for="item in currentPageTools"
        :key="item.icon"
        @click="handleClick(item.code)"
      >
        <img :src="currentMode === item.code ? item.iconOn : item.icon" />
        <span>{{ item.label }}</span>
      </div>
      <div class="tool-box-close cursor-pointer" @click="toggleToolBox"></div>
    </hl-group>

    <icon-button
      class="toggle-tool-box-button"
      v-show="!isToolBoxOpen"
      :icon="iconToggleButton"
      :iconOn="iconToggleButtonOn"
      @click="toggleToolBox"
    />
  </template> -->

  <!-- 弹窗：趋势分析 -->
  <trend-analysis v-if="trendVisible" @close="trendVisible = false" />
  <!-- 弹窗：异常事件 -->
  <urgency-event v-if="urgencyVisible" @close="handleClose" />
  <!-- 弹窗：地图搜索 -->
  <map-search v-if="searchVisible" @close="handleClose" />
  <!-- 弹窗：地图聚合列表 -->
  <map-cluster-list
    v-if="clusterListVisible"
    :listMode="currentClusterlistMode"
    :clusterInfo="currentClusterListInfo"
    @close="handleCloseClusterList"
  />
  <!-- 弹窗：事件详情 -->
  <event-detail
    v-if="eventDetailVisible"
    @close="handleCloseEventDetail"
    :id="currentEventId"
  />
  <!-- 弹窗：自处置事件详情 -->
  <event-detail-self-handle
    v-if="eventSelfHandleDetailVisible"
    @close="handleCloseSelfHandleEventDetail"
    :id="currentEventId"
  />
  <!-- 弹窗：缓冲区查询 -->
  <event-buffer-search v-if="bufferPanelVisible" @close="handleClose" />
  <!-- 弹窗：下发指令 -->
  <instruct v-if="detailInstructVisible" @close="handleClose" />
  <!-- 弹窗：指令历史 -->
  <instruct-history v-if="detailInstructHistoryVisible" @close="handleClose" />
  <!-- 弹窗：视频播放 -->
  <camera-player-box
    v-if="cameraVisible"
    @close="handleCloseCamera"
    :id="currentCameraId"
  />
  <!-- 弹窗：开始会议 -->
  <start-meeting v-if="meetingVisible" @close="handleClose" />
  <!-- 弹窗：资源详情 -->
  <resource-detail
    v-if="resourcesVisible"
    @close="handleCloseResource"
    :formData="currentResourceInfo"
  />
  <!-- 弹窗：手动流转 -->
  <manual-handle v-if="manualHandleVisible" @close="handleClose" />
  <!-- 弹窗：事件流转关系图 -->
  <event-graph v-if="eventGraphVisible" @close="eventGraphVisible = false" />
  <!--  弹窗：相似事件 -->
  <search-similar v-if="similarEventsVisible" @close="handleClose"></search-similar>
  <!-- 弹框 要素分析 -->
  <factor-analysis v-if="factorAnalysisVisible" @close="factorAnalysisVisible = false"></factor-analysis>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGlobalState } from '@/hooks';
import { getLastPath, GlobalAPI } from '@/common';
import userAuth from '@/common/user-auth';

import iconSearch from '@/assets/images/toolBox/search.png';
import iconSearchOn from '@/assets/images/toolBox/search_on.png';
import iconStat from '@/assets/images/toolBox/stat.png';
import iconStatOn from '@/assets/images/toolBox/stat_on.png';
import iconTrends from '@/assets/images/toolBox/trends.png';
import iconTrendsOn from '@/assets/images/toolBox/trends_on.png';
import iconAlarm from '@/assets/images/toolBox/alarm.png';
import iconAlarmOn from '@/assets/images/toolBox/alarm_on.png';
import iconMap from '@/assets/images/toolBox/rect.png';
import iconMapOn from '@/assets/images/toolBox/rect_on.png';
import iconMeeting from '@/assets/images/toolBox/meeting.png';
import iconMeetingOn from '@/assets/images/toolBox/meeting_on.png';
import iconCmd from '@/assets/images/toolBox/cmd.png';
import iconCmdOn from '@/assets/images/toolBox/cmd_on.png';
import iconBuffer from '@/assets/images/toolBox/buffer.png';
import iconBufferOn from '@/assets/images/toolBox/buffer_on.png';
import iconMonitor from '@/assets/images/toolBox/monitor.png';
import iconMonitorOn from '@/assets/images/toolBox/monitor_on.png';
import iconCmdHistory from '@/assets/images/toolBox/cmd_history.png';
import iconCmdHistoryOn from '@/assets/images/toolBox/cmd_history_on.png';
import iconHandle from '@/assets/images/toolBox/handle.png';
import iconHandleOn from '@/assets/images/toolBox/handle_on.png';

import iconToggleButton from '@/assets/images/buttons/tool_box_button.png';
import iconToggleButtonOn from '@/assets/images/buttons/tool_box_button_on.png';

import iconExitButton from '@/assets/images/buttons/tool_exit.png';
import iconExitButtonOn from '@/assets/images/buttons/tool_exit_on.png';

import { ALL, WAITING, PENDING, FINISHED } from '@/views/event-center/constant';
import ResourceDetail from './dialogs/resource-detail.vue';

const {
  eventInfoTabName,
  resourcesVisible,
  handleCloseResource,
  currentResourceInfo,
  currentEventId,
  currentCameraId,
  currentMode,
  setMode,
  clearMode,
  searchParams,
  eventDetailVisible,
  cameraVisible,
  meetingVisible,
  bufferPanelVisible,
  urgencyVisible,
  searchVisible,
  clusterListVisible,
  currentClusterlistMode,
  currentClusterListInfo,
  handleCloseClusterList,
  similarEventsVisible,
  factorAnalysisVisible,
  detailInstructVisible,
  toggleInstructDialog,
  detailInstructHistoryVisible,
  handleCloseCamera,
  handleCloseEventDetail,
  manualHandleVisible,
  trendVisible,
  eventGraphVisible,
  isToolBoxOpen,
  toggleToolBox,
  eventSelfHandleDetailVisible,
  handleCloseSelfHandleEventDetail,
  isEventSearchMode,
} = useGlobalState();

const route = useRoute();
const router = useRouter();

const path = ref();

const tools = [
  // {
  //   icon: iconSearch,
  //   iconOn: iconSearchOn,
  //   code: 'eventSearchBasic',
  //   label: '地图搜索',
  //   show: 'center',
  //   elShow: [ALL, WAITING, PENDING, FINISHED],
  //   handler: () => {
  //     searchVisible.value = !searchVisible.value;
  //   }
  // },
  // {
  //   icon: iconStat,
  //   iconOn: iconStatOn,
  //   code: 'eventSearchStatics',
  //   label: '事件统计',
  //   show: 'center',
  //   elShow: [ALL, WAITING, PENDING, FINISHED],
  //   handler: () => {
  //     statVisible.value = !statVisible.value;
  //   }
  // },
  // {
  //   icon: iconTrends,
  //   iconOn: iconTrendsOn,
  //   code: 'eventTrend',
  //   label: '趋势分析',
  //   show: 'center',
  //   elShow: [ALL, WAITING, PENDING, FINISHED],
  //   handler: () => {
  //     trendVisible.value = !trendVisible.value;
  //   }
  // },
  // {
  //   icon: iconAlarm,
  //   iconOn: iconAlarmOn,
  //   code: 'eventUrge',
  //   label: '异常事件',
  //   show: 'center',
  //   elShow: [ALL, WAITING, PENDING, FINISHED],
  //   handler: () => {
  //     urgencyVisible.value = !urgencyVisible.value;
  //   }
  // },
  // {
  //   icon: iconMap,
  //   iconOn: iconMapOn,
  //   code: 'mapFrame',
  //   label: '地图框选',
  //   show: 'center',
  //   elShow: [ALL, WAITING, PENDING, FINISHED],
  // },
  {
    icon: iconMeeting,
    iconOn: iconMeetingOn,
    code: 'createMeeting',
    label: '创建会议',
    show: 'analysis, detail',
    elShow: [ALL, WAITING, PENDING, FINISHED],
    handler: () => {
      meetingVisible.value = !meetingVisible.value;
    },
  },
  {
    icon: iconSearch,
    iconOn: iconSearchOn,
    code: 'similarEvents',
    label: '相似搜索',
    show: 'analysis',
    elShow: [ALL, WAITING, PENDING, FINISHED],
    handler: () => {
      similarEventsVisible.value = !similarEventsVisible.value;
    },
  },
  // {
  //   icon: iconMonitor,
  //   iconOn: iconMonitorOn,
  //   code: 'onlineMonitor',
  //   label: '在线监察',
  //   show: 'analysis',
  //   elShow: [ALL, WAITING, PENDING, FINISHED],
  //   handler: () => {
  //     console.log('跳转');
  //     document.location.href = `${GlobalAPI.config.LINKAGE_URL}?token=${userAuth.getFxToken()}`;
  //   }
  // },
  {
    icon: iconBuffer,
    iconOn: iconBufferOn,
    code: 'bufferSearch',
    label: '半径查询',
    show: 'detail',
    elShow: [ALL, WAITING, PENDING, FINISHED],
    handler: () => {
      // bufferPanelVisible.value = !bufferPanelVisible.value;
      eventInfoTabName.value =
        eventInfoTabName.value !== 'radiusQuery' ? 'radiusQuery' : 'baseInfo';
    },
  },
  // {
  //   icon: iconHandle,
  //   iconOn: iconHandleOn,
  //   code: 'manualHandle',
  //   label: '手动流转',
  //   show: 'center',
  //   elShow: [ALL, WAITING, PENDING],
  //   handler: () => {
  //     console.log('关闭手动流转');
  //     manualHandleVisible.value = !manualHandleVisible.value;
  //   }
  // },
  {
    icon: iconCmd,
    iconOn: iconCmdOn,
    code: 'sendCMD',
    label: '下发指令',
    show: 'detail',
    elShow: [ALL, WAITING, PENDING, FINISHED],
    handler: () => {
      toggleInstructDialog();
    },
  },
  {
    icon: iconCmdHistory,
    iconOn: iconCmdHistoryOn,
    code: 'sendCMDHistory',
    label: '指令历史',
    show: 'center, detail',
    elShow: [ALL, WAITING, PENDING, FINISHED],
    handler: () => {
      detailInstructHistoryVisible.value = !detailInstructHistoryVisible.value;
    },
  },
];

const currentPageTools = ref<any[]>([]);

const currentName = computed(() => {
  return router.currentRoute.value.name;
});

// 解决切换地图tool不切换 改为watch
// const currentPageTools = computed(() => {
//   return tools.filter(item => item.show.includes(getLastPath()) && item.elShow.includes(searchParams.eventStatus as string));
// });

const statVisible = ref(false);
// const trendVisible = ref(false);

watch(
  () => route.path,
  () => {
    console.log('route change');
    path.value = document.location.href;
    currentPageTools.value = tools.filter(
      item =>
        item.show.includes(getLastPath()) &&
        item.elShow.includes(searchParams.eventStatus as string)
    );
  },
  {
    immediate: true,
  }
);

watch(
  () => bufferPanelVisible.value,
  (val: boolean) => {
    if (!val) {
      currentMode.value = '';
    }
  }
);

const callHandler = (mode: string) => {
  tools.find(item => item.code === mode)?.handler?.call(this);
};

const handleClick = (mode: string) => {
  callHandler(currentMode.value);
  if (currentMode.value !== mode) {
    setMode(mode);
    callHandler(mode);
  } else {
    clearMode();
  }
};

const handleClose = () => {
  callHandler(currentMode.value);
  clearMode();
};

const handleExit = () => {
  // GlobalAPI.config.LOGINOUT_URL && window.location.replace(GlobalAPI.config.LOGINOUT_URL);
  // console.log('退出');
  searchParams.eventStatus === ALL;
  router.push({
    name: 'event-center'
  });
};
</script>
<style lang="scss">
.tool-box-close {
  // background: rgba(7, 24, 42, 0.95);
  // box-shadow: inset 0px 0px 20px 0px rgba(36, 131, 234, 0.46);
  background: url("@/assets/images/buttons/up_button.png");
  height: calc(var(--xl) * 0.42);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: 50%;

  &:hover {
    background-image: url("@/assets/images/buttons/up_button_on.png");
  }
}

.cell {
  position: relative;
  user-select: none;
  cursor: pointer;

  img {
    width: calc(2.16 * var(--xl));
    height: calc(1.72 * var(--xl));
    margin: 0 auto;
    display: block;
  }

  span {
    position: absolute;
    bottom: calc(-0.07 * var(--xl));
    left: 0;
    width: 100%;
    display: inline-block;
    font-size: calc(var(--xl) * 0.52);
    text-align: center;
  }
}
</style>
