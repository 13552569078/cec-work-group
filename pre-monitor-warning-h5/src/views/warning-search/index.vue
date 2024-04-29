<template>
  <nav-bar show-back right-text="取消" title="搜索" @right-click="cancle" @back="cancle" :customBack="true"/>
  <div class="warning-search-page">
    <van-search
      v-model="alarmTitle"
      placeholder="请输入预警标题关键字"
      shape="round"
      @search="onSearch"
      @clear="onClear"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { NavBar } from "@/components";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const alarmTitle = ref("");
alarmTitle.value = route.query.alarmTitle as string;

const onSearch = () => {
  router.push({
    name: route.query.warningType === "realtime" ? "RealtimeWarningList" : "HisyoryWarningList",
    query: {
      alarmTitle: alarmTitle.value,
    },
  });
  onClear();
};

const onClear = () => {
  alarmTitle.value = "";
};
const cancle = () => {
  onClear();
  router.push({
    name: route.query.warningType === "realtime" ? "RealtimeWarningList" : "HisyoryWarningList",
  });
};

</script>
<style lang="scss" scoped>
.task-search-page {
  background: #ffffff;
  height: calc(100vh - var(--van-nav-bar-height));
}
</style>
