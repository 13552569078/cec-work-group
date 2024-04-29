<template>
  <div class="expert-comment-part">
    <hl-scrollbar min-height="calc(var(--xxs) * 50)" max-height="calc(var(--xxs) * 100)">
      <hl-simple-table :cols="cols" stripe :data="tableData" hover class="normal-stripe-table" list gap-y="var(--xxs)" fixed-header :header-cell-style="{background: '#044474'}">
        <template #allRowsSelector>
          <hl-checkbox v-model="selectedAll" :indeterminate="isIndeterminate" @change="selectAll" />
        </template>
        <template #rowSelector="{ row }">
          <hl-checkbox v-model="selectedRowIds" :label="row.id" @change="selectRow">{{ '' }}</hl-checkbox>
        </template>
        <template #tableIndex="{ row }">
          <span class="table-index">{{ row.rowIndex }}</span>
        </template>
        <template #adviceFileName="{ row }">
          <hl-icon v-if="row.adviceFile" class="file-link" @click="handlePreview(row)"><file-file /></hl-icon>
          <span v-else>--</span>
        </template>
        <template #empty>
          <hb-empty description="暂无数据" :image="NoDataImg" />
        </template>
      </hl-simple-table>
    </hl-scrollbar>
  </div>
  <preview-file-dlg v-if="showPreviewDlg" :file-url="curFileUrl" @cancel="showPreviewDlg = false" />
</template>
<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import { useCurrentEvent } from '@/hooks';
import { apiDisposeSuggestObj } from '@/apis/modules/dispose-suggest';
import NoDataImg from '@/assets/images/event-handling/left-2/empty.png';
import { PreviewFileDlg } from './index';

import type { IpostFindExpertAdvicePageSpace } from '@/apis/modules/dispose-suggest/model';
import type { DefaultParams } from './plan-model';

const { currentEvent } = useCurrentEvent();

const props = defineProps<{
  defaultParams: DefaultParams;
}>();
const emit = defineEmits(['updateInfo']);

const tableData = ref<IpostFindExpertAdvicePageSpace.List[]>([]);
const cols = [
  {
    title: '',
    slotName: 'rowSelector',
    headerSlotName: 'allRowsSelector',
    width: '3em'
  },
  {
    title: '#',
    prop: '',
    slotName: 'tableIndex',
    width: '3em',
  },
  {
    prop: 'expertName',
    title: '姓名',
    width: '6em',
    showTooltip: true,
  },
  {
    prop: 'orgName',
    title: '所属单位',
    showTooltip: true,
  },
  {
    prop: 'adviceContent',
    title: '建议内容',
    showTooltip: true,
  },
  {
    prop: 'adviceTime',
    title: '建议时间',
    width: '12em',
  },
  {
    prop: 'adviceFileName',
    title: '附件',
    slotName: 'adviceFileName',
    showTooltip: true,
  },
];

const selectedAll = ref(false);
const isIndeterminate = ref(false);
const selectedRowIds = ref<string[]>([]);

const showPreviewDlg = ref(false);
const curFileUrl = ref('');

const selectAll = () => {
  selectedRowIds.value.splice(0, selectedRowIds.value.length);
  if (selectedAll.value) {
    selectedRowIds.value.push(...tableData.value.map(d => `${d.id}`));
    isIndeterminate.value = false;
  }
  updateCommentInfo();
};
const selectRow = () => {
  selectedAll.value = selectedRowIds.value.length === tableData.value.length;
  if (selectedRowIds.value.length > 0 && selectedAll.value === false) {
    isIndeterminate.value = true;
  } else {
    isIndeterminate.value = false;
  }
  updateCommentInfo();
};

const updateCommentInfo = () => {
  const res = tableData.value.filter(item => {
    return selectedRowIds.value.find(id => `${item.id}` === id);
  }).map((i, index) => ({
    no: index + 1,
    ...i
  }));
  emit('updateInfo', {
    key: 'expertAdvise',
    value: res
  });
};

const handlePreview = (row: IpostFindExpertAdvicePageSpace.List) => {
  const { adviceFile } = row;
  curFileUrl.value = adviceFile;
  showPreviewDlg.value = true;
};
const searchExpertComments = async() => {
  const params = {
    currentPage: -1,
    pageSize: 9999,
    eventId: currentEvent.id
  };
  const res1 = await apiDisposeSuggestObj.postFindExpertAdvicePage(params);
  tableData.value = res1.data?.list.map((item, index) => {
    return {
      ...item,
      rowIndex: index + 1,
      userName: item.expertName,
      adivseContent: item.adviceContent,
      adivseTime: item.adviceTime,
    };
  });
};

onMounted(() => {
  searchExpertComments();
});
</script>
<style lang="scss" scoped>
.expert-comment-part {
  border: none;
  box-sizing: border-box;
  padding: calc(var(--xxs) * 5);
  overflow: hidden;
  background: rgba(0, 158, 247, 0.10);
  :deep(.hl-simple-table) {
    .fixed-top {
      top: calc(var(--xxs) * -0.75);
    }
  }
  .file-link {
    font-size: var(--font-md);
    font-weight: 400;
    color: #71F8FC;
    line-height: 1.42;
    cursor: pointer;
  }
  :deep(.empty-content) {
    .hb-empty {
      .empty-image {
        width: calc(var(--xxs) * 28);
      }
    }
  }
}
</style>
