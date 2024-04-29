<template>
  <common-dialog title="相似搜索" style="width: calc(var(--xl) * 25.32)" @close="$emit('close')">
    <hl-group dir="horizontal" merge block>
      <hl-input v-model="searchCommonParams.eventDesc" placeholder="请输入内容" clearable style="width: 100%" />
      <hl-button type="primary" style="width: calc(var(--md) * 8)" @click="getEventList">搜索</hl-button>
    </hl-group>
    <hl-group class="search-area w-full m-t-md" align="items-between">
      <hl-group align="items-middle">
        <hl-group class="search-label m-r-xs" align="items-middle">话题选择</hl-group>
        <hl-group style="width: calc(var(--xl) * 8)">
          <hl-select v-model="searchCommonParams.topic" class="w-full" size="sm" clearable>
            <hl-option v-for="option in topicList" :key="option" :label="option" :value="option" />
          </hl-select>
        </hl-group>
      </hl-group>
      <hl-group align="items-middle">
        <hl-group class="search-label m-r-xs" align="items-middle">置信度</hl-group>
        <hl-group align="items-middle"> <hl-input style="width: calc(var(--xl) * 3)" v-model="searchCommonParams.confidence" placeholder="" clearable size="sm" /><span style="margin-left: calc(var(--xl) * 0.32)">%以上</span> </hl-group>
      </hl-group>
    </hl-group>
    <c-label style="margin: calc(var(--xl) * 0.6) 0">搜索结果</c-label>
    <!-- <c-tabs v-model="searchResultType" :tabs="SEARCH_RESULT_TYPE_OPTION" /> -->
    <event-list :list="list" :platTypeStyle="platTypeStyle" progress-name="置信度"></event-list>
    <hl-group dir="horizontal" class="display-flex items-middle m-t-lg items-between page-container">
      <div>
        相似数/<span class="page-count">{{ total }}</span
        >个
      </div>
      <!-- <hl-pagination size="sm" :current-page="currentPage" :page-size="pageSize" layout="prev, pager, next" :total="total" align="items-left" @current-change="handleCurrentChange"> </hl-pagination> -->
    </hl-group>
  </common-dialog>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { apiIndexPageObj, apiEventAnalysisObj } from '@/apis';
import { useGlobalState } from '@/hooks';
import { isEmpty } from 'lodash-es';
import { SEARCH_RESULT_TYPE_OPTION } from '@/common';
import { HlMessage } from 'hongluan-ui';

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
const platTypeStyle = ref('progress');
const searchCommonParams = ref({
  eventDesc: '',
  topic: '',
  confidence: 0
});
const list = ref();
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const topicList = ref();
const searchResultType = ref(1);

const getTopicOption = async () => {
  const res = await apiEventAnalysisObj.getTopicList();
  topicList.value = res.data;
};
getTopicOption();

watch([searchResultType], () => {
  getEventList();
});

const getEventList = async () => {
  if (searchCommonParams.value.confidence > 0 && !searchCommonParams.value.eventDesc) {
    HlMessage.warning({
      message: '置信度大于0时必须填写描述'
    });
    return;
  }
  const params = {
    eventDesc: searchCommonParams.value.eventDesc,
    topic: searchCommonParams.value.topic,
    confidence: searchCommonParams.value.confidence,
    startTime: searchParams.startTime,
    endTime: searchParams.endTime,
    // pageNum: currentPage.value,
    // pageSize: pageSize.value
  };
  const res = await apiEventAnalysisObj.postSearch(params);
  if (res.data?.length) {
    list.value = res.data.map(e => ({
      id: e.id,
      title: e.title,
      time: e.eventTime,
      name: `${e.eventTypeLName ?? '--'}/${e.eventTypeMName ?? '--'}/${e.eventTypeName ?? '--'}`,
      address: e.eventAddress,
      showPosition: e.coordx && e.coordy,
      location: [+e.coordx, +e.coordy],
      confidence: Number(e.confidence.split('%')[0]) || 0
    }));
    total.value = res.data.length;
  } else {
    list.value = [];
    total.value = 0;
  }
};
const resetList = () => {
  handleClose();
  getEventList();
};
const handleClose = () => {
  searchCommonParams.value = {
    eventDesc: '',
    topic: '',
    confidence: 0
  };
  searchResultType.value = 1;
  currentPage.value = 1;
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getEventList();
};

getEventList();
</script>
<style lang="scss" scoped>
.dialog-search-list {
  .search-area {
    margin-top: calc(var(--xl) * 0.6);
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
