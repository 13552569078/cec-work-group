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
    <template #year="{ searchForm }">
      <hl-date-picker v-model="searchForm['yearly']" type="year" placeholder="选择年" value-format="YYYY" block />
    </template>
    <template #actions="{ row }">
      <hl-group align="items-between">
        <hl-button type="link" effect="light" @click="edit('detail', row.id)"> 查看 </hl-button>
        <hl-button type="link" effect="light" @click="edit('edit', row.id)"> 编辑 </hl-button>
        <hl-button type="link" effect="light" @click="del(row.id, row.yearly)"> 删除 </hl-button>
      </hl-group>
    </template>
    <template #toolbar-extra-after>
      <fx-action-button label="新增县域基础指标统计" class="m-x-md" @click="edit('add')" />
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
    :areaCodeList="areaTreeData"
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
import { DICT, exportMethods } from '../generic-methods';
import type { IpostFindDisasterIndicatorStatisticsPageSpace } from '@/apis/modules/basic-information/model';
import type { ActionType } from '@/types';

const CODE = 'DisasterIndicatorStatistics';

const { getAreaTree, areaProps, areaTreeData } = useAreaTree();

const tableRef = ref();
const tableData = ref([] as IpostFindDisasterIndicatorStatisticsPageSpace.List[]);
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
    title: `年度`,
    prop: "yearly",
  },
  {
    title: "地区生产总值（万元）",
    prop: "grossRegionalProduct",
  },
  {
    title: "人均地区生产总值（元）",
    prop: "grossRegionalProductPerCapita",
  },
  {
    title: "居民人均可支配收入（元）",
    prop: "residentsPerCapitaDisposable",
  },
  {
    title: "耕地面积（公顷）",
    prop: "cultivatedLandArea",
  },
  {
    title: "粮食产量（吨）",
    prop: "grainProduction",
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
    type: "slot",
    label: `年度`,
    placeholder: "年度",
    value: "",
    name: "yearly",
    slotName: 'year',
  },
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

const getData = async({
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
  const { data } = await apiBasicInformationObj.postFindDisasterIndicatorStatisticsPage(requestParams);
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
const del = async(id: string, name: string) => {
  await HlMessageBox.confirm(`确认删除"${name}"年度吗?`, "提示", {
    confirmButtonText: "确定",
    confirmButtonType: "danger",
    cancelButtonText: "取消",
  });
  await apiBasicInformationObj.postDeleteDisasterIndicatorStatistics([id]);
  HlMessage.success("删除成功");
  tableRef.value.refresh();
};
const batchDel = async(ids: string[]) => {
  await HlMessageBox.confirm(`此操作将批量删除这些县域基础指标统计, 是否继续?`, "提示", {
    confirmButtonText: "确定",
    confirmButtonType: "danger",
    cancelButtonText: "取消",
  });
  await apiBasicInformationObj.postDeleteDisasterIndicatorStatistics(ids);
  HlMessage.success("批量删除成功");
  tableRef.value.refresh();
};

onMounted(async() => {
  await getAreaTree();
});
</script>
