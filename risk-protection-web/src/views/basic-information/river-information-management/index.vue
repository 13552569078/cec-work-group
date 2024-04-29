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
        <hl-button type="link" effect="light" @click="del(row.id, row.name)"> 删除 </hl-button>
      </hl-group>
    </template>
    <template #toolbar-extra-after>
      <fx-action-button label="新增河流" class="m-x-md" @click="edit('add')" />
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
import { DICT, exportMethods } from '../generic-methods';
import type { IpostFindDisasterRiverPageSpace } from '@/apis/modules/basic-information/model';
import type { ActionType } from '@/types';

const CODE = 'DisasterRiver';

const tableRef = ref();
const tableData = ref([] as IpostFindDisasterRiverPageSpace.List[]);
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
    title: "河流名称",
    prop: "name",
    minWidth: "160px",
    showTooltip: true,
    tooltipProps: { width: "400px" },
  },
  {
    title: "河流所属行政区名称",
    prop: "areaCodeName",
    minWidth: "160px",
    showTooltip: true,
    tooltipProps: { maxWidth: "400px" },
  },
  {
    title: "河流长度(㎞)",
    prop: "riverLength",
    showTooltip: true,
    tooltipProps: { maxWidth: "400px" },
  },
  {
    title: "上一级河流名称",
    prop: "parentName",
    minWidth: "80px",
    showTooltip: true,
    tooltipProps: { width: "400px" },
  },
  {
    title: "流经地",
    prop: "followAddress",
    minWidth: "100px",
    showTooltip: true,
    tooltipProps: { width: "400px" },
  },
  {
    title: "跨界类型",
    prop: "transboundaryTypeName",
    minWidth: "100px",
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
    type: "input",
    label: "河流名称",
    placeholder: "请输入内容",
    value: "",
    name: "name",
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
  const { data } = await apiBasicInformationObj.postFindDisasterRiverPage(requestParams);
  data.list.forEach(el => {
    el.transboundaryTypeName = DICT.RIVER_CROSS_TYPE.filter(d => +d.code === +el.transboundaryType)[0]?.name || '--';
    el.areaCodeName = DICT.RIVER_REGION.filter(d => +d.code === +el.areaCode)[0]?.name || '--';
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
const del = async (id: string, name:string) => {
  await HlMessageBox.confirm(`确认删除"${name}"?`, "提示", {
    confirmButtonText: "确定",
    confirmButtonType: "danger",
    cancelButtonText: "取消",
  });
  await apiBasicInformationObj.postDeleteDisasterRiver([id]);
  HlMessage.success("删除成功");
  tableRef.value.refresh();
};
const batchDel = async (ids: string[]) => {
  await HlMessageBox.confirm(`此操作将批量删除这些河流, 是否继续?`, "提示", {
    confirmButtonText: "确定",
    confirmButtonType: "danger",
    cancelButtonText: "取消",
  });
  await apiBasicInformationObj.postDeleteDisasterRiver(ids);
  HlMessage.success("批量删除成功");
  tableRef.value.refresh();
};
</script>
