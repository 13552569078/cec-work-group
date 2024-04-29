<template>
  <div class="display-flex flex-col h-full">
    <div :class="[expandable ? 'display-flex items-middle items-between' : 'display-none','btn-tab']">
      <hl-input v-model="keywords" block @change="() => loadData()" class="search-input" placeholder="请输入">
        <template #prefix>
          <hl-icon><fill-search /></hl-icon>
        </template>
      </hl-input>
      <hl-checkbox v-model="isDrill" class="m-l-md w-sm" @change="() => loadData()">演练事件</hl-checkbox>
    </div>
    <hl-scrollbar ref="scrollbarRef" class="self-grow" @at-end="loadData(false)">
      <event-data-list :events="events" class="event-list" />
      <div class="text-center m-t-xs" v-if="isLoading">加载中...</div>
      <hb-empty v-if="!isLoading && events.length===0" description="暂无搜索结果" :image="empty"></hb-empty>
    </hl-scrollbar>
    <create-event-dlg v-if="dlgVisible" @cancel="dlgVisible=false" @ok="refreshEventList"/>
  </div>
</template>
<script lang="ts" setup>
import { inject, ref, reactive, watch } from 'vue';
import { useCurrentArea, useDataRefresher } from '@/hooks';
import { ExpandableCardParams } from '@/types';
import { EVENT_HANDLING, ExpandableCardParamsKey, MAX_PAGE_SIZE } from '@/common';
import { IpostFindEventListSpace } from '@/apis/modules/event-list/model';
import { apiEventListObj } from '@/apis/modules/event-list/index';
import EventDataList from './event-data-list.vue';
import CreateEventDlg from './create-event-dlg.vue';
import empty from '@/assets/images/empty/no-search-data.png';

const { left2: expandable } = inject<ExpandableCardParams>(ExpandableCardParamsKey)!;

const { areaCode } = useCurrentArea();

const events = ref<IpostFindEventListSpace.List[]>([]);
const pagination = reactive({
  pageSize: 30,
  page: 1,
});
const hasMore = ref(true);
const isLoading = ref(false);
const keywords = ref('');
const isDrill = ref(false);
const dlgVisible = ref(false);
const scrollbarRef = ref();

const loadData = (isFirstLoad: boolean = true) => {
  loadEventList(isFirstLoad);
};

const loadEventList = async(isFirstLoad: boolean = true) => {
  if (isFirstLoad) {
    hasMore.value = true;
    pagination.page = 1;
    isLoading.value = false;
  }
  if (isLoading.value || !hasMore.value) return;
  isLoading.value = true;

  const result = await apiEventListObj.postFindEventList({
    drill: +isDrill.value,
    pageSize: pagination.pageSize,
    currentPage: pagination.page,
    areaCodeList: [areaCode.value],
    eventStates: EVENT_HANDLING.split(','),
    keywords: keywords.value,
  });
  events.value = isFirstLoad ? [...result.data.list] : events.value.concat(result.data.list || []);
  if (result.data.totalPage <= 1 || pagination.page >= result.data.totalPage) {
    hasMore.value = false;
  }
  isLoading.value = false;
  pagination.page++;
};

const createEvent = () => {
  dlgVisible.value = true;
};

const refreshEventList = () => {
  dlgVisible.value = false;
  loadData();
};

watch(expandable, () => {
  scrollbarRef.value.update();
}, {
  flush: 'post'
});

useCurrentArea(() => loadData());
useDataRefresher(() => loadData());

defineExpose({
  createEvent
});
</script>
<style lang="scss" scoped>
.search-input {
  margin-bottom: calc(var(--xxs) * 3);
}
.event-count {
  font-family: Impact;
  font-size: var(--font-xxl);
  margin-left: calc(var(--xxs) * 2);
}
.btn-tab {
  --form-radius: var(--xxs);
  --form-bg-color: rgba(0,158,247,0.12);
  --form-border-color: rgba(0,158,247,0.24);
}
</style>
