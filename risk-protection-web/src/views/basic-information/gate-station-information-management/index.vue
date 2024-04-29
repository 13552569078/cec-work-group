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
        <hl-button type="link" effect="light" @click="del(row.id, row.resName)"> 删除 </hl-button>
      </hl-group>
    </template>
    <template #gateType="{row}">
      {{ [1,2].includes(+row.gateType)? +row.gateType === 1? '节制闸' : '引(进)水闸' : row.gateType}}
    </template>
    <template #toolbar-extra-after>
      <fx-action-button label="新增闸站" class="m-x-md" @click="edit('add')" />
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
import {exportMethods} from '../generic-methods';
import type { IpostFindDisasterGateStationPageSpace } from '@/apis/modules/basic-information/model';
import type { ActionType } from '@/types';

const CODE = 'DisasterGateStation';

const tableRef = ref();
const tableData = ref([] as IpostFindDisasterGateStationPageSpace.List[]);
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
    title: "闸站名称",
    prop: "resName",
    minWidth: "160px",
    showTooltip: true,
    tooltipProps: { width: "400px" },
  },
  {
    title: "所在河流",
    prop: "riverName",
    minWidth: "120px",
    showTooltip: true,
    tooltipProps: { maxWidth: "400px" },
  },
  {
    title: "所属区域",
    prop: "areaCodeName",
    showTooltip: true,
    tooltipProps: { maxWidth: "400px" },
  },
  {
    title: "水闸类型",
    prop: "gateType",
    minWidth: "100px",
    showTooltip: true,
    slotName: 'gateType',
    tooltipProps: { width: "400px" },
  },
  {
    title: "设计过闸流量(m³/s)",
    prop: "waterFlow",
    minWidth: "80px",
    showTooltip: true,
    tooltipProps: { width: "400px" },
  },
  {
    title: "竣工验收时间",
    prop: "finishDate",
    minWidth: "160px",
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
    label: "闸站名称",
    placeholder: "请输入内容",
    value: "",
    name: "resName",
  },
  {
    type: "input",
    label: "所属河流",
    placeholder: "请输入内容",
    value: "",
    name: "riverName",
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
  const { data } = await apiBasicInformationObj.postFindDisasterGateStationPage(requestParams);
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
  await apiBasicInformationObj.postDeleteDisasterGateStation([id]);
  HlMessage.success("删除成功");
  tableRef.value.refresh();
};
const batchDel = async (ids: string[]) => {
  await HlMessageBox.confirm(`此操作将批量删除这些闸站, 是否继续?`, "提示", {
    confirmButtonText: "确定",
    confirmButtonType: "danger",
    cancelButtonText: "取消",
  });
  await apiBasicInformationObj.postDeleteDisasterGateStation(ids);
  HlMessage.success("批量删除成功");
  tableRef.value.refresh();
};
</script>
