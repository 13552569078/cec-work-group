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
    <template #areaCode="{ searchForm }">
      <hl-cascader
        v-model="searchForm['areaCode']"
        :props="areaProps"
        :options="areaTreeData"
        placeholder="请选择"
        block
        :show-all-levels="false"
      />
    </template>
    <template #actions="{ row }">
      <hl-group align="items-between">
        <hl-button type="link" effect="light" @click="edit('detail', row.id)"> 查看 </hl-button>
        <hl-button type="link" effect="light" @click="edit('edit', row.id)"> 编辑 </hl-button>
        <hl-button type="link" effect="light" @click="del(row.id, row.name)"> 删除 </hl-button>
      </hl-group>
    </template>
    <template #toolbar-extra-after>
      <fx-action-button label="新增社区(行政村)减灾能力" class="m-x-md" @click="edit('add')" />
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
    :areaCodeList = "areaTreeData"
    @cancel="showDlg = false"
    @refresh="tableRef.refresh()"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { HlMessage, HlMessageBox } from "hongluan-ui";
import { apiBasicInformationObj } from '@/apis/modules/basic-information';
import { useAreaTree } from '@/hooks';
import EditDlg from "./edit-dlg.vue";
import { DICT, exportMethods} from '../generic-methods';
import type { IpostFindDisasterCommunityReductionPageSpace } from '@/apis/modules/basic-information/model';
import type { ActionType } from '@/types';

const CODE = 'DisasterCommunityReduction';

const { getAreaTree, areaProps, areaTreeData } = useAreaTree();

const tableRef = ref();
const tableData = ref([] as IpostFindDisasterCommunityReductionPageSpace.List[]);
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
    title: "社区(行政村)名称",
    prop: "name",
    minWidth: "160px",
    showTooltip: true,
    tooltipProps: { width: "400px" },
  },
  {
    title: "社区(行政村)地址",
    prop: "address",
    minWidth: "160px",
    showTooltip: true,
    tooltipProps: { maxWidth: "400px" },
  },
  {
    title: "所属乡镇",
    prop: "areaCodeName",
    showTooltip: true,
    tooltipProps: { maxWidth: "400px" },
  },
  {
    title: "灾害预警信息接收方式",
    prop: "disasterReceiveMethodName",
    minWidth: "120px",
    showTooltip: true,
    tooltipProps: { width: "400px" },
  },
  {
    title: "灾害预警信息上报方式",
    prop: "disasterReportMethodName",
    minWidth: "100px",
    showTooltip: true,
    tooltipProps: { width: "400px" },
  },
  {
    title: "防灾减灾应急物资储备方式",
    prop: "materialsReserveMethodName",
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
    label: '所属区域',
    span: 'grid-col-span-xl-2',
    width: '400px',
    type: 'slot',
    slotName: 'areaCode',
    name: 'areaCode',
    value: '',
    display: (item: any) => {
      function findName(code:string, tree = [] as any) {
        return tree.reduce((pre:any, cur:any) => {
          if (cur.id === code) {
            pre.push(cur.name);
          } else {
            // eslint-disable-next-line no-param-reassign
            pre = pre.concat(findName(code, cur.children));
          }
          return pre;
        }, []);
      }
      const name = findName(item.value, areaTreeData.value);
      return name;
    },
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
  const { data } = await apiBasicInformationObj.postFindDisasterCommunityReductionPage(requestParams);
  data.list.forEach(el => {
     el.materialsReserveMethodName = el.materialsReserveMethod !== '--' ? (el.materialsReserveMethod.split(',').map(el => DICT.RESERVE_METHOD.filter(d => +d.code === +el)[0]?.name)).join('、') : '--';
     el.disasterReportMethodName = el.disasterReportMethod !== '--' ? (el.disasterReportMethod.split(',').map(el => DICT.REPORTING_METHO.filter(d => +d.code === +el)[0]?.name)).join('、')  : '--';
     el.disasterReceiveMethodName = el.disasterReceiveMethod !== '--' ? (el.disasterReceiveMethod.split(',').map(el => DICT.REPORTING_METHO.filter(d => +d.code === +el)[0]?.name)).join('、') : '--';
  })
  tableData.value = data.list || [];
  console.error(tableData.value,'12341')
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
  await apiBasicInformationObj.postDeleteDisasterCommunityReduction([id]);
  HlMessage.success("删除成功");
  tableRef.value.refresh();
};
const batchDel = async (ids: string[]) => {
  await HlMessageBox.confirm(`此操作将批量删除这些社区(行政村), 是否继续?`, "提示", {
    confirmButtonText: "确定",
    confirmButtonType: "danger",
    cancelButtonText: "取消",
  });
  await apiBasicInformationObj.postDeleteDisasterCommunityReduction(ids);
  HlMessage.success("批量删除成功");
  tableRef.value.refresh();
};


onMounted(async () => {
  await getAreaTree();
})
</script>
