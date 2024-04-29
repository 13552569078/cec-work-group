<template>
    <!-- <hl-group dir="horizontal" merge block class="m-t-md">
      <hl-input v-model="searchCommonParams.keyword" placeholder="请输入内容" clearable style="width: 100%" />
      <hl-button type="primary" style="width: calc(var(--md) * 8)" @click="getEventList">搜索</hl-button>
    </hl-group> -->
    <hl-group class="search-area w-full" align="items-between">
      <hl-group>
        <hl-group class="search-label" align="items-middle">事件类型</hl-group>
        <hl-group style="width: calc(var(--xl) * 3.5)">
          <event-type-select v-model="searchCommonParams.eventType" :platform="searchParams.platform" :hasDefaultValue="true" :showAll="true" />
        </hl-group>
      </hl-group>
      <hl-group>
        <hl-group class="search-label" align="items-middle">是否超时</hl-group>
        <hl-group style="width: calc(var(--xl) * 3)">
          <hl-select class="w-full" size="sm" v-model="searchCommonParams.overtimeFlag">
            <hl-option v-for="item in OVERTIME_OPTION" :key="item.value" :label="item.label" :value="item.value"></hl-option>
          </hl-select>
        </hl-group>
      </hl-group>
      <hl-group>
        <hl-group class="search-label" align="items-middle">是否紧急</hl-group>
        <hl-group style="width: calc(var(--xl) * 3)">
          <hl-select class="w-full" size="sm" v-model="searchCommonParams.eventUrgent">
            <hl-option v-for="item in URGE_FLAG_OPTION" :key="item.value" :label="item.label" :value="item.value"></hl-option>
          </hl-select>
        </hl-group>
      </hl-group>
    </hl-group>
    <c-label style="margin-bottom: calc(var(--xl) * 0.6)">搜索结果</c-label>
    <c-tabs v-model="searchCommonParams.searchResultType" :tabs="SEARCH_RESULT_TYPE_OPTION" />
    <event-list :list="list" @clickLocation="handleClose"></event-list>
    <hl-pagination class="m-t-md" size="sm" hide-on-single-page :current-page="currentPage" :page-size="pageSize" layout="prev, pager, next" :total="total" align="items-between" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </hl-pagination>
</template>
<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { apiIndexPageObj } from '@/apis';
import { useGlobalState, useEventQuery } from '@/hooks';
import { isEmpty } from 'lodash-es';
import { OVERTIME_OPTION, URGE_FLAG_OPTION, SEARCH_RESULT_TYPE_OPTION, SERCH_MODE_OPTION, getLastPath } from '@/common';

const props = defineProps({
  keyword: {
    type: String,
    default: ''
  }
});

const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    resetList();
  }
});
const { searchEventListQuery } = useEventQuery();

const emit = defineEmits(['close']);

const title = '事件搜索';

const searchMode = ref('event');
const searchCommonParams = ref({
  eventType: '',
  keyword: '',
  overtimeFlag: '',
  eventUrgent: '',
  searchResultType: 1
});
const list = ref();
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const searchModeOptions = computed(() => {
  let modeArr = [];
  if (getLastPath() === 'center') {
    modeArr = [0, 2, 3];
  } else {
    modeArr = [0, 1, 2, 3];
  }
  return modeArr.map(index => SERCH_MODE_OPTION[index]);
});

watch(
  () => searchEventListQuery.value.eventType,
  newValue => {
    searchCommonParams.value.eventType = newValue as string;
  },
  { immediate: true }
);
watch(
  () => searchCommonParams.value.searchResultType,
  () => {
    getEventList();
  }
);

watch(
  () => searchEventListQuery.value.eventUrgent,
  newValue => {
    searchCommonParams.value.eventUrgent = newValue as unknown as string;
  },
  { immediate: true }
);

watch(
  () => searchEventListQuery.value.overtimeFlag,
  newValue => {
    searchCommonParams.value.overtimeFlag = newValue as string;
  },
  { immediate: true }
);

const getEventList = async () => {
  const params = {
    ...searchCommonParams.value,
    ...searchParams,
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    keyword: props.keyword
  };
  const res = await apiIndexPageObj.getPage(params);
  if (res.data.list.length) {
    list.value = res.data.list.map(e => ({
      id: e.id || e.eventId,
      title: e.title,
      time: e.eventTime,
      name: `${e.eventTypeLName ?? '--'}/${e.eventTypeMName ?? '--'}/${e.eventTypeName ?? '--'}`,
      address: e.eventAddress,
      showPosition: !isEmpty(e.coordx) && !isEmpty(e.coordy),
      value1: e.sendPlatform,
      value2: e.receivePlatform,
      overtimeList: [
        {
          name: '调度',
          value: e.dispatchOverTime
        },
        {
          name: '处置',
          value: e.handleOverTime
        },
        {
          name: '办结',
          value: e.endOverTime
        }
      ]
    }));
    total.value = res.data.totalRow;
  } else {
    list.value = [];
    total.value = 0;
  }
};
getEventList();

const resetList = () => {
  searchCommonParams.value = {
    eventType: '100',
    keyword: '',
    overtimeFlag: '',
    eventUrgent: '',
    searchResultType: 1
  };
  currentPage.value = 1;
  getEventList();
};
const handleClose = () => {
  searchCommonParams.value = {
    eventType: '100',
    keyword: '',
    overtimeFlag: '',
    eventUrgent: '',
    searchResultType: 1
  };
  currentPage.value = 1;
  emit('close');
};
const handleSizeChange = () => {
  console.log('handleSizeChange');
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getEventList();
};

const getList = () => {
  getEventList();
};

defineExpose({ getList });
</script>
<style lang="scss" scoped>
.dialog-search-list {
  .search-area {
    margin: calc(var(--xl) * 0.6) 0;
    .search-label {
      margin-right: calc(var(--xl) * 0.32);
    }
  }
  :deep(.select-trigger .hl-input) {
    color: white !important;
    border-color: #71b3f7 !important;
    border-radius: 4px !important;
    background: linear-gradient(360deg, #4f7299 0%, #273a4e 46%, #4f7299 100%) !important;
    border: 2px solid;
    border-image: linear-gradient(180deg, rgba(112, 178, 247, 1), rgba(167, 208, 255, 1), rgba(112, 178, 247, 1)) 2 2;
  }
}
</style>
