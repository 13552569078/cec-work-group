<template>
  <hl-dialog
    :model-value="true"
    custom-class="warning-list-dlg"
    width="calc(var(--xxl) * 35)"
    title="预警列表"
    append-to-body
    @closed="$emit('cancel')"
  >
    <hl-form inline class="form-container">
      <div class="display-flex warning-form-left">
        <hl-form-item label="相关事故">
          <hb-tree-selector
            v-model="form.eventTypes"
            :tree-props="treeProps"
            placeholder="请选择类型"
            clearable
            block
            collapse-tags
            popper-class="event-type-tree"
          >
          </hb-tree-selector>
        </hl-form-item>
      </div>
      <hl-form-item>
        <hl-input v-model="form.keyword" clearable :maxlength="10">
          <template #prefix>
            <hl-icon><fill-search /></hl-icon>
          </template>
        </hl-input>
        <div>
          <hl-button type="primary" class="m-r-sm m-l-sm" @click="handleCurrentChange(1)">搜索</hl-button>
          <hl-button @click="resetForm">重置</hl-button>
        </div>
      </hl-form-item>
    </hl-form>
    <hl-scrollbar height="calc(var(--xxs) * 110)">
      <hl-simple-table
        :cols="cols"
        :data="tableData"
        hover
        stripe
        list
        gap-y="var(--xxs)"
        class="normal-stripe-table"
      >
        <template #tableIndex="{ rowIndex }">
          <span>{{ rowIndex + 1 }}</span>
        </template>
        <template #attachments="{ row }">
          <template v-if="row.fileUrl">
            <hl-link type="primary" class="m-r-sm" @click="previewFile(row)">预览</hl-link>
            <hl-link type="primary" @click="downloadFile(row)">下载</hl-link>
          </template>
          <template v-else>
            --
          </template>
        </template>
        <template #eventTypeShow="{ row }">
          <hl-popover :content="row.eventTypeShow" popper-class="warning-event-types-popper" effect="dark" trigger="hover">
            <template #reference>
              <div class="text-ellipsis" style="width: 8em">{{ row.eventTypeShow }}</div>
            </template>
          </hl-popover>
        </template>
      </hl-simple-table>
    </hl-scrollbar>
    <div class="pagination">
      <hl-pagination
        layout="total, prev, pager, next"
        :page-size="paginationParams.pageSize"
        :total="paginationParams.total"
        :current-page="paginationParams.currentPage"
        @current-change="handleCurrentChange"
      />
    </div>
    <pdf-previewer-dlg v-if="showFileDlg" :url="pdfFileUrl" @cancel="showFileDlg=false" />
  </hl-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, watch, computed, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { CommonUtils } from 'fx-front-utils';
import { useCurrentEvent } from '@/hooks';
import { getRemoteFilePath, tableDefaultProps } from '@/common';
import { PdfPreviewerDlg } from '@/components';
import { apiWarningObj } from '@/apis/modules/warning';
import { IpostFindWarningPageSpace } from '@/apis/modules/warning/model';
import { apiEventConditionObj } from '@/apis/modules/event-condition';

const emit = defineEmits(['cancel', 'ok']);

const route = useRoute();
const { currentEvent } = useCurrentEvent();

const form = reactive({
  eventTypes: [] as string[],
  keyword: '',
});
const treeProps = reactive<Record<string, any>>({
  nodeKey: 'code',
  checkStrictly: true,
  showCheckbox: true,
  data: [],
  defaultExpandedKeys: [],
  props: {
    children: 'children',
    label: 'name',
  },
});

const tableData = ref<IpostFindWarningPageSpace.Data[]>([]);
const cols = ref([
  { title: '序号', slotName: 'tableIndex', width: '4em' },
  { title: '预警标题', prop: 'title', width: '18em' },
  { title: '预警内容', prop: 'content', width: '18em' },
  { title: '相关事故', slotName: 'eventTypeShow' },
  { title: '发布单位', prop: 'publishUnit', width: '8em', showTooltip: true, tooltipProps: { ...tableDefaultProps } },
  { title: '发布时间', prop: 'publishTime' },
  { title: '附件', slotName: 'attachments' },
]);
const paginationParams = reactive({
  currentPage: 1,
  total: 0,
  pageSize: 8
});
const pdfFileUrl = ref('');
const showFileDlg = ref(false);

const resetForm = () => {
  form.eventTypes = [];
  form.keyword = '';
  paginationParams.currentPage = 1;
  initEventTtype();
  loadData();
};

const handleCurrentChange = (current: number) => {
  paginationParams.currentPage = current;
  loadData();
};

const downloadFile = (row: IpostFindWarningPageSpace.Data) => {
  CommonUtils.downloadFile(row.fileName, getRemoteFilePath(row.fileUrl));
};
const previewFile = (row: IpostFindWarningPageSpace.Data) => {
  const fileUrl = getRemoteFilePath(row.fileUrl);
  if (fileUrl.endsWith('.pdf')) {
    pdfFileUrl.value = fileUrl;
    showFileDlg.value = true;
  } else {
    window.open(fileUrl, '_blank');
  }
};

const initEventTtype = () => {
  if (route.name === 'event-handling') {
    form.eventTypes = [currentEvent.eventTypeCode];
  }
};

const loadData = async() => {
  const params = {
    keyword: form.keyword,
    eventTypes: form.eventTypes.join(','),
    status: 1,
    currentPage: paginationParams.currentPage,
    pageSize: paginationParams.pageSize,
  };
  const res = await apiWarningObj.postFindWarningPage(params);
  paginationParams.total = res.data.totalRow;
  tableData.value = res.data.list;
};

onMounted(async() => {
  const result = await apiEventConditionObj.getEventTypeTree();
  treeProps.data = result.data;
  treeProps.data.forEach((d: any) => {
    treeProps.defaultExpandedKeys.push(d.code);
  });
  await nextTick();
  initEventTtype();

  loadData();
});
</script>
<style lang="scss" scoped>
.warning-list-dlg {
  width: 100%;
  display: flex;
  flex-direction: column;
  .form-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: calc(var(--xxs) * 6);
    .warning-form-left {
      column-gap:var(--px20);
      :deep(.form-label) {
        margin-right: calc(var(--xxs) * 4);
      }
    }
  };
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: calc(var(--xxs) * 6);
  }
}
</style>
<style lang="scss">
.warning-event-types-popper {
  max-width: calc(var(--xxs) * 60);
  max-height: calc(var(--xxs) * 50);
  overflow-y: auto;
}
</style>
