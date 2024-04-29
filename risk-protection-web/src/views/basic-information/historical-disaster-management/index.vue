<template>
  <fx-page-table-v2
    ref="tableRef"
    :cols="cols"
    :table-data="tableData"
    :search-items="searchItems"
    :selection-actions="selectionActions"
    :data-fetcher="getData"
    :default-pagination="defaultPagination"
    right-search-height="400px"
    search-placement="right"
    @selected-row-keys="selectedRowKeys"
  >
    <template #actions="{ row }">
      <hl-group align="items-between">
        <hl-button type="link" effect="light" @click="edit('detail', row.id)"> 查看 </hl-button>
        <hl-button type="link" effect="light" @click="edit('edit', row.id)"> 编辑 </hl-button>
        <hl-button type="link" effect="light" @click="del(row.id, row.title)"> 删除 </hl-button>
      </hl-group>
    </template>
    <template #toolbar-extra-after>
      <fx-action-button label="新增历史灾情" class="m-x-md" @click="edit('add')" />
      <fx-action-button label="导出" @click="exportMethods(CODE)">
        <template #icon>
          <hl-icon :opacity="0"><TwoDownload /></hl-icon>
        </template>
      </fx-action-button>
    </template>
  </fx-page-table-v2>
  <edit-dlg
    v-if="showDlg"
    :params="editParams"
    @cancel="showDlg = false"
    @refresh="tableRef.refresh()"
  />
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { HlMessage, HlMessageBox } from "hongluan-ui";
import { apiBasicInformationObj } from '@/apis/modules/basic-information';
import EditDlg from "./edit-dlg.vue";
import { DICT, exportMethods} from '../generic-methods';
import type { IpostFindDisasterHistoryPageSpace } from '@/apis/modules/basic-information/model';
import type { ActionType } from '@/types';

const CODE = 'DisasterHistory';

const tableRef = ref();
const tableData = ref([] as IpostFindDisasterHistoryPageSpace.List[]);
const showDlg = ref(false);
const editParams = ref({
  id: "",
  type: "" as ActionType,
});
const rowKeys = ref<string[]>([]);
const selectionActions = reactive([
  {
    label: "批量删除",
    icon: "TwoExamine",
    noFill: true,
    show: true,
    onClick: () => {
      batchDel(rowKeys.value);
    },
  },
]);
const cols = ref([
  { title: "#", slotName: "tableSelection", headerSlotName: "selectionCol", align: "center" },
  {
    title: "序号",
    slotName: "tableIndex",
    prop: "tableIndex",
    align: "center",
    width: "30px",
  },
  {
    title: "灾情主题",
    prop: "title",
    minWidth: "120px",
    showTooltip: true,
    tooltipProps: { width: "400px" },
  },
  {
    title: "灾情类型",
    prop: "disasterTypeName",
    minWidth: "120px",
    showTooltip: true,
    tooltipProps: { maxWidth: "400px" },
  },
  {
    title: "灾情开始时间",
    prop: "startDate",
    minWidth: "120px",
    showTooltip: true,
    tooltipProps: { maxWidth: "400px" },
  },
  {
    title: "灾情结束时间",
    prop: "endDate",
    minWidth: "120px",
    showTooltip: true,
    tooltipProps: { maxWidth: "400px" },
  },
  {
    title: "经济损失",
    prop: "economicLoss",
    showTooltip: true,
    tooltipProps: { maxWidth: "400px" },
  },
  {
    title: "死亡人口",
    prop: "deathNum",
    minWidth: "120px",
    showTooltip: true,
    tooltipProps: { width: "400px" },
  },
  {
    title: "操作",
    slotName: "actions",
    prop: "actions",
    align: "center",
    width: "80px",
    fixed: 'right'
  },
]);
const searchItems = ref([
  {
    type: "year",
    label: "灾情年份",
    placeholder: "请输入内容",
    value: "",
    name: "disasterYear",
    valueFormat: 'YYYY'
  },
]);
const defaultPagination = { pageSize: 10, currentPage: 1, total: 0 };

const getData = async ({
  pageSize,
  currentPage,
  params,
  setTotal,
}: {
  pageSize: number;
  currentPage: number;
  params: { [key: string]: string | string[] };
  setTotal: (item?: number) => void;
}) => {
  const requestParams = {
    ...params,
    pageSize,
    currentPage,
  };
  const { data } = await apiBasicInformationObj.postFindDisasterHistoryPage(requestParams);
  data.list.forEach(el => {
    el.disasterTypeName = DICT.DISASTER_TYPE.filter(d => +d.code === +el.disasterType)[0]?.name;
  })
  tableData.value = data.list || [];
  
  setTotal(data.totalRow);

};
const selectedRowKeys = (keys: never[]) => {
  rowKeys.value = keys;
};
const edit = (type: ActionType, id = "") => {
  editParams.value.type = type;
  editParams.value.id = id;
  showDlg.value = true;
};
const del = async (id: string, name: string) => {
  await HlMessageBox.confirm(`确认删除"${name}"?`, "提示", {
    confirmButtonText: "确定",
    confirmButtonType: "danger",
    cancelButtonText: "取消",
  });
  await apiBasicInformationObj.postDeleteDisasterHistory([id]);
  HlMessage.success("删除成功");
  tableRef.value.refresh();
};
const batchDel = async (ids: string[]) => {
  await HlMessageBox.confirm(`此操作将批量删除这些历史灾情, 是否继续?`, "提示", {
    confirmButtonText: "确定",
    confirmButtonType: "danger",
    cancelButtonText: "取消",
  });
  await apiBasicInformationObj.postDeleteDisasterHistory(ids);
  HlMessage.success("批量删除成功");
  tableRef.value.refresh();
};
</script>
