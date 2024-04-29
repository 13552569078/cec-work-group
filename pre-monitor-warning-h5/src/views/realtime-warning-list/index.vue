<template>
  <nav-bar>
    <template #left>
      <van-icon
        name="arrow-left"
        size="18"
        color="var(--van-text-regular)"
        @click="$router.replace({ name: 'Homepage' })"
      />
    </template>
    <template #right>
      <TwoSearch
        class="icon18"
        color="var(--van-text-regular)"
        @click="
          $router.push({
            name: 'WarningSearch',
            query: { warningType: warningType, alarmTitle: $route.query.alarmTitle },
          })
        "
      />
    </template>
    <template #title>{{ warningType === "realtime" ? "实时预警" : "历史预警" }}</template>
  </nav-bar>
  <div class="warning-list-content">
    <van-dropdown-menu active-color="var(--primary)" class="warning-list-title" :close-on-click-overlay="false" :close-on-click-outside="false">
      <WarningLevelFilter :api-params="apiParams" @filter="searchList" />
      <WarningTimeFilter :api-params="apiParams" @filter="searchList" />
      <EventTypeFilter :api-params="apiParams" @filter="searchList" />
    </van-dropdown-menu>
    <warning-list :api-params="apiParams" />
  </div>
</template>
<script lang="ts" setup>
import { reactive, onActivated } from "vue";
import { TwoSearch } from "@hongluan-ui/icons";
import { NavBar } from "@/components";
import { WarningLevelFilter, WarningTimeFilter, EventTypeFilter, WarningList } from "./components";
import { useRoute } from "vue-router";

const route = useRoute();

defineOptions({
  name: "RealtimeWarningList",
});
const props = defineProps({
  warningType: {
    type: String,
    default: "realtime",
  },
});

const apiParams = reactive({
  alarmLevels: [],
  eventTypeCodes: [],
  startTime: "",
  endTime: "",
  handleStatus: props.warningType === "realtime" ? 0 : 1,
  alarmTitle: route.query.alarmTitle,
} as Record<string, any>);

const searchList = (params: Record<string, any>) => {
  Object.assign(apiParams, params);
};

onActivated(() => {
  apiParams.alarmTitle = route.query.alarmTitle;
  searchList({});
});
</script>
<style lang="scss" scoped>
</style>
