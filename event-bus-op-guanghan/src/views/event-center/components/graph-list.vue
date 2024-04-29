<template>
  <common-dialog
    title="事项列表"
    style="width:calc(var(--xl) * 42.04);height:calc(var(--xl) * 29.64);"
    @close="$emit('close')"
  >
    <div class="graph-list">
      <hl-scrollbar :style="`height: ${listHeight};max-height: ${listHeight};`" ref="treeScrollbarRef">
        <hl-simple-table class="w-full" center :cols="cols" :data="list" stripe fixed-header>
        </hl-simple-table>
      </hl-scrollbar>
      <hl-group dir="horizontal" class="page-content m-t-md w-full">
      <hl-group align="items-middle">
        <span>事项数/</span>
        <span class="page-count">{{ total }}</span>
        类
      </hl-group>
      <hl-pagination size="sm" hide-on-single-page :current-page="pageNum" :page-size="pageSize" layout="prev, pager, next" :total="total" align="items-between" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </hl-pagination>
    </hl-group>
    </div>
  </common-dialog>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';
import { HlMessage } from 'hongluan-ui';
import { apiEventGraphDataObj } from '@/apis/modules/graph-data';

const cols = [
  { title: '发起平台', prop: 'originalSysText' },
  { title: '发起事件类型', prop: 'originalName' },
  { title: '接收平台', prop: 'receiveSysText' },
  { title: '接收事件类型', prop: 'receiveName' },
];
const listHeight = 'calc(var(--xl) * 24.75);';
const list = ref();
const curLineData = ref({
  originatorSysCode: '',
  receiverSysCode: ''
});

const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(10);

const handleSizeChange = () => {
  console.log('handleSizeChange');
};
const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  getGraphList(curLineData.value);
};

const getGraphList = async(lineData:any) => {
  curLineData.value = lineData;
  const params = {
    originatorSysCode: curLineData.value.originatorSysCode,
    receiveSysCode: curLineData.value.receiverSysCode,
    // originalValue: useOriginalValue,
    // receiveValue: useReceiveValue,
    pageNum: pageNum.value,
    pageSize: pageSize.value
  };
  const res = await apiEventGraphDataObj.getLineData(params);
  if (res.code === 200) {
    list.value = res.data.list;
    total.value = res.data.total;
  }
};
// onMounted(async () => {
//   getDispatchDetail();
// });
defineExpose({ getGraphList });
</script>

<style lang="scss" scoped>
.graph-list {
  width: 100%;
  height: 100%;
  :deep(.hl-simple-table) {
    background: rgba(43, 54, 72, 0.78);
    // border-collapse: separate; /* 确保边框被分隔开 */
    // border-spacing: 0px calc(var(--xl) * 0.24); /* 调整行之间的间距 */
    // opacity: 0.7;
    color: #fff;
    thead {
      background: rgba(55, 86, 126, 1);
      color: #fff;
    }
    tbody > tr:nth-child(odd) {
      background: #214664;
    }
    tbody > tr:nth-child(even) {
      background: #142330;
    }
    // tbody tr td {
    //   padding: 0 !important;
    // }
    .fixed-left {
      background-color: transparent;
    }
  }
}
</style>
