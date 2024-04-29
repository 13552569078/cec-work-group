<template>
  <div class="warning-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        :immediate-check="false"
        loading-text="正在加载数据..."
        @load="onLoad"
      >
        <warning-card v-for="warning in list" :warning="warning" :key="warning.id" />
        <van-empty v-if="!loading && !list.length" description="没有查到任何数据" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import WarningCard from "./warning-card.vue";
import { apiWarningObj } from "@/apis/modules/warning";
import { IgetFindAlarmLogPageSpace } from "@/apis/modules/warning/model";
import { Constants } from "fx-front-utils";

const props = defineProps({
  apiParams: {
    type: Object,
    required: true,
  },
});

const list = ref<IgetFindAlarmLogPageSpace.List[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
let currentPage = 1;

const onLoad = async () => {
  if (refreshing.value) {
    refreshing.value = false;
  }
  const result = await apiWarningObj.getFindAlarmLogPage({
    ...props.apiParams,
    pageSize: Constants.DEFAULT_PAGE_SIZE,
    currentPage: currentPage++,
  });
  list.value.push(...(result.data.list || []));

  loading.value = false;
  if (list.value.length === result.data.totalRow || list.value.length === 0) {
    finished.value = true;
  }
};

const reset = () => {
  finished.value = false;
  loading.value = true;
  currentPage = 1;
  list.value = [];
};

const onRefresh = async () => {
  reset();
  await onLoad();
};

watch(
  () => props.apiParams,
  async () => {
    console.log("params....", props.apiParams);
    reset();
    await onLoad();
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
<style lang="scss" scoped>
.warning-list {
  padding: 16px;
  height: calc(100vh - var(--van-dropdown-menu-height) - var(--van-nav-bar-height));
  overflow-y: auto;
}
</style>
