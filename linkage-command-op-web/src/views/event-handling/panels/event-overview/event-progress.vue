<template>
  <hl-scrollbar ref="scrollbarRef" class="h-full" @at-end="getEventDynamic(currentEvent, false)">
    <hl-timeline v-if="dynamicList && dynamicList.length > 0" class="p-md">
      <hl-timeline-item v-for="(i,index) in dynamicList" :key="i" hide-timestamp :active="index==0">
        <hl-group dir="vertical" full="full-x">
          <hl-group full="full-x" class="m-b-sm">
            <span class="self-full title font-bold">{{ i.title }}</span>
            <span class="self-no-full time">{{ i.happenedTime }}</span>
          </hl-group>
          <hl-group dir="vertical" full="full-x" class="dynamic-content p-y-xs p-x-sm">
            <span v-html="i.content" class="p-b-xs" style="word-break:break-all;"></span>
            <div class="p-t-xs dynamic-users">
              <span v-for="u in i.users" :key="u.id" class="display-inline-flex items-middle">
                <img src="@/assets/images/common/people-icon.png" style="width:var(--md);" alt="" class="m-r-xxs">
                <span>{{ u.name }}-{{ u.deport }}</span>
              </span>
            </div>
          </hl-group>
        </hl-group>
      </hl-timeline-item>
    </hl-timeline>
    <hb-empty v-else :image="NoDataImg"></hb-empty>
    <div class="text-center" v-if="isLoading">加载中...</div>
  </hl-scrollbar>
</template>

<script setup lang="ts">
import { ref, inject, reactive, watch } from 'vue';
import { useCurrentEvent, useDataRefresher } from '@/hooks';
import { ExpandableCardParams } from '@/types';
import { ExpandableCardParamsKey } from '@/common';
import { apiEventConditionObj } from '@/apis/modules/event-condition';
import { IpostFindEventDynamicsByIdSpace, IpostFindEventDetailByIdSpace, IpostListForDataViewSpace } from '@/apis/modules/event-condition/model';
import NoDataImg from '@/assets/images/empty/no-data.png';

const { left1: expandable } = inject<ExpandableCardParams>(ExpandableCardParamsKey)!;

const scrollbarRef = ref();
const dynamicList = ref<IpostListForDataViewSpace.List[]>([]);
const pagination = reactive({
  pageSize: 20,
  page: 1,
});
const hasMore = ref(true);
const isLoading = ref(false);

const getEventDynamic = async(currentEvent: IpostFindEventDetailByIdSpace.Data, isFirstLoad: boolean = true) => {
  if (isFirstLoad) {
    dynamicList.value = [];
    hasMore.value = true;
    pagination.page = 1;
    isLoading.value = false;
  }

  if (isLoading.value || !hasMore.value) return;
  isLoading.value = true;
  const params = {
    eventId: currentEvent.id,
    currentPage: pagination.page,
    pageSize: pagination.pageSize,
    typeCodes: ['PROCESS'],
  };
  const res = await apiEventConditionObj.postListForDataView(params);
  dynamicList.value = dynamicList.value.concat(res.data.list || []);
  if (res.data.totalPage <= 1 || pagination.page >= res.data.totalPage) {
    hasMore.value = false;
  }
  isLoading.value = false;
  pagination.page++;
};

watch(expandable, () => {
  scrollbarRef.value.update();
}, {
  flush: 'post'
});

const { currentEvent } = useCurrentEvent(getEventDynamic);

useDataRefresher(() => {
  getEventDynamic(currentEvent);
});
</script>
<style lang="scss" scoped>
.hl-scrollbar {
  background-color: rgba(0,158,247,0.12);
  .hl-timeline {
    .title {
      font-size: var(--font-lg);
      line-height: 1.5;
    }
    .time {
      font-size: var(--font-md);
    }
    .dynamic-content {
      font-size: var(--font-md);
      line-height: 1.7143;
      background-color: rgba(28,77,133,0.2);
      .dynamic-users {
        border-top: 1px solid #0E3D6C;
        text-align: right;
      }
    }
  }
}
</style>
