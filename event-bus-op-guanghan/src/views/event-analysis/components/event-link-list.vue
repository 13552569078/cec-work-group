<template>
  <common-dialog
    :title="title"
    width="calc(var(--xl) * 19.32)"
    @close="handleClose"
  >
    <hl-group
      class="dialog-search-list"
      dir="horizontal"
      merge
      block
    >
      <!-- <hl-select
        v-model="mode"
        style="width: calc(var(--md) * 8)"
        class="static"
      >
        <hl-option
          label="标准搜索"
          value="standard"
        ></hl-option>
      </hl-select>
      <hl-input
        v-model="keyword"
        placeholder="请输入内容"
        clearable
        style="width: 100%;"
      />
      <hl-button
        type="primary"
        style="width: calc(var(--md) * 8)"
        @click="getEventList"
      >搜索</hl-button> -->
      {{`“${keyword}”`}}相关事件
    </hl-group>
    <event-list :list="list" @clickLocation="clickLocation"></event-list>
    <hl-pagination
      class="m-t-md"
      size="sm"
      hide-on-single-page
      :current-page="currentPage"
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="total"
      align="items-between"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </hl-pagination>
  </common-dialog>
</template>
<script lang='ts' setup>
import { ref } from 'vue';
import {
  apiEventAnalysisObj
} from '@/apis';
import closeButton from '@/assets/images/dialog/close.png';
import { isEmpty } from 'lodash-es';
import { useGlobalState } from '@/hooks';

const emit = defineEmits(['close', 'closeAll']);

const {
  searchParams,
} = useGlobalState();

const props = defineProps({
  keyword: {
    type: String,
    default: ''
  },
  platFormCode: {
    type: String,
    default: ''
  },
});

const title = '事件列表';
const mode = ref('standard');
const list = ref();
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const getEventList = async () => {
  const params = {
    keyword: props.keyword,
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    startTime: searchParams.startTime,
    endTime: searchParams.endTime,
    platFormCode: props.platFormCode
  };
  const res = await apiEventAnalysisObj.postKeywordEventList(params);
  if (res.data.list.length) {
    list.value = res.data.list.map(e => ({
      id: e.id || e.eventId,
      title: e.title,
      time: e.eventTime,
      name: `${e.eventTypeLName ?? '--'}/${e.eventTypeMName ?? '--'}/${
        e.eventTypeName ?? '--'
      }`,
      address: e.eventAddress,
      showPosition: !isEmpty(e.coordx) && !isEmpty(e.coordy),
      value1: e.sendPlatform,
      value2: e.receivePlatform,
      overtimeList: [
        {
          name: '调度',
          value: e.dispatchOverTime,
        },
        {
          name: '处置',
          value: e.handleOverTime,
        },
        {
          name: '办结',
          value: e.endOverTime,
        },
      ],
    }));
    total.value = res.data.totalRow;
  } else {
    list.value = [];
    total.value = 0;
  }
};
getEventList();
const handleClose = () => {
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

const clickLocation = () => {
  emit('closeAll');
};
</script>
<style lang="scss" scoped>
.dialog-search-list {
  :deep(.select-trigger .hl-input) {
  color: white !important;
  border-color: #71b3f7 !important;
  border-radius: 4px !important;
  background: linear-gradient(
    360deg,
    #4f7299 0%,
    #273a4e 46%,
    #4f7299 100%
  ) !important;
  border: 2px solid;
  border-image: linear-gradient(
      180deg,
      rgba(112, 178, 247, 1),
      rgba(167, 208, 255, 1),
      rgba(112, 178, 247, 1)
    )
    2 2;
}

}

</style>
