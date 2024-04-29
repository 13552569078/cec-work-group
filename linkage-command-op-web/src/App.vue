<template>
  <div class="map-class">
    <background-map />
    <map-actions />
    <global-actions v-if="!isPlotting" />
  </div>
  <whole-layout />
  <warning-card />
  <virtual-text-overflow />
  <router-view v-if="show"></router-view>
  <start-meeting-dlg
    v-if="showMeetingDlg"
    :meetingPassedPerson="meetingPassedPerson"
    @cancel="showMeetingDlg = false;meetingPassedPerson=[]"
    @confirm="showMeetingDlg = false;meetingPassedPerson=[]"
  />
  <calling-dlg v-if="currentCallingUser.mobile" :user="currentCallingUser" @cancel="currentCallingUser={}" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useUser } from 'fx-front-ucenter';
import { BackgroundMap, MapActions } from '@/background-map';
import { StartMeetingDlg, CallingDlg, VirtualTextOverflow } from '@/components';
import { GlobalAPI } from '@/common';
import {
  useDataRefresher,
  useMeeting,
  useCalling,
  useMapPlotting,
} from '@/hooks';
import WholeLayout from './layout/layout.vue';
import GlobalActions from './layout/global-actions.vue';
import { WarningCard } from './views/warning';

const { getUserInfo } = useUser();
const { showMeetingDlg, meetingPassedPerson } = useMeeting();
const { currentCallingUser } = useCalling();
const { startAutoRefresh, stopAutoRefresh } = useDataRefresher();
const { isPlotting } = useMapPlotting();

const show = ref(false);

/**
初始化过程如下：
  先加载用户信息才能初始化路由，加载页面。
  因为业务代码中有需要使用areaCode的api调用，所以必须保证使用用户实际的areaCode，而不是默认配置的areaCode。

  地图组件先行加载，默认中心点为配置文件中的中心点。这样可以保证地图快速出来，而不至于界面一直处在空白状态。
  在平时态的map-nav.vue中会根据用户areaCode加载行政区划列表，然后在把地图的中心点设置为列表中第一项的经纬度。

  战时态中心点为事件中心点，和行政区划列表无关。
 */
(async() => {
  const user = await getUserInfo();
  GlobalAPI.userInfo = user;
  show.value = true;
})();

onMounted(() => {
  startAutoRefresh();
});
onBeforeUnmount(() => {
  stopAutoRefresh();
});
</script>
<style lang="scss">
</style>
