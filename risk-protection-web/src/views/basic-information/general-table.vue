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
        <hl-button type="link" effect="light" @click="del(row.id, row.resName)"> 删除 </hl-button>
      </hl-group>
    </template>
    <template #toolbar-extra-after>
      <fx-action-button :label="`新增${title}`" class="m-x-md" @click="edit('add')" />
      <fx-action-button label="导出" @click="exportMethods(code)">
        <template #icon>
          <hl-icon :opacity="0"><TwoDownload /></hl-icon>
        </template>
      </fx-action-button>
    </template>
  </fx-page-table-v2>
  <general-edit-dlg
    v-if="showDlg"
    :title="title"
    :code="code"
    :params="editParams"
    :areaCodeList = "areaTreeData"
    @cancel="showDlg = false"
    @refresh="update"
  >
  </general-edit-dlg>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useAreaTree } from '@/hooks';
import { HlMessage, HlMessageBox } from "hongluan-ui";
import { apiBasicInformationObj } from '@/apis/modules/basic-information';
import GeneralEditDlg from "./general-edit-dlg.vue";
import { exportMethods } from './generic-methods';
import type { ActionType } from '@/types';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  code: {
    type: String,
    default: ''
  },
});

const { getAreaTree, areaProps, areaTreeData } = useAreaTree();

const tableRef = ref();
const tableData = ref([] as any[]);
const showDlg = ref(false);
const editParams = ref({
  id: "",
  type: "" as ActionType,
});

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
    title: `${props.title}名称`,
    prop: "resName",
    minWidth: "160px",
    showTooltip: true,
    tooltipProps: { width: "400px" },
  },
  {
    title: "统一信用代码",
    prop: "socialCreditCode",
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
    title: "联系人",
    prop: "personName",
    minWidth: "80px",
    showTooltip: true,
    tooltipProps: { width: "400px" },
  },
  {
    title: "联系电话",
    prop: "personMobile",
    minWidth: "100px",
    showTooltip: true,
    tooltipProps: { width: "400px" },
  },
  {
    title: "详细地址",
    prop: "address",
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
const rowKeys = ref<string[]>([]);

const searchItems = ref([
  {
    type: "input",
    label: `${props.title}名称`,
    placeholder: "请输入内容",
    value: "",
    name: "resName",
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
  const { data } = await apiBasicInformationObj[`postFind${props.code}Page` as 'postFindDisasterSocialStadiumPage'](requestParams);
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
const del = async(id: string, name:string) => {
  await HlMessageBox.confirm(`确认删除"${name}"?`, "提示", {
    confirmButtonText: "确定",
    confirmButtonType: "danger",
    cancelButtonText: "取消",
  });
  await apiBasicInformationObj[`postDelete${props.code}` as 'postDeleteDisasterSocialStadium']([id]);
  HlMessage.success("删除成功");
  tableRef.value.refresh();
};
const batchDel = async(ids: string[]) => {
  await HlMessageBox.confirm(`此操作将批量删除这些${props.title}, 是否继续?`, "提示", {
    confirmButtonText: "确定",
    confirmButtonType: "danger",
    cancelButtonText: "取消",
  });
  await apiBasicInformationObj[`postDelete${props.code}` as 'postDeleteDisasterSocialStadium'](ids);
  HlMessage.success("批量删除成功");
  tableRef.value.refresh();
};

const update = () => {
  tableRef.value.refresh();
};
getAreaTree();

</script>
