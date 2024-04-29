<template>
  <fx-page-table-v2
    ref="tableRef"
    :cols="cols"
    :table-data="tableData"
    :search-items="searchItems"
    :data-fetcher="getData"
    :default-pagination="defaultPagination"
    right-search-height="400px"
    search-placement="right"
  >
    <template #actions="{ row }">
      <hl-group align="items-between">
        <hl-button
          type="link"
          effect="light"
          @click="openEditDlg('detail', row.id)"
        >
          查看
        </hl-button>
        <hl-button
          type="link"
          effect="light"
          @click="openEditDlg('edit', row.id)"
        >
          编辑
        </hl-button>
        <hl-button
          type="link"
          effect="light"
          @click="handleDel(row.id, row.name)"
        >
          删除
        </hl-button>
      </hl-group>
    </template>
    <template #toolbar-extra-after>
      <fx-action-button
        label="新增重点工艺"
        class="m-l-md"
        @click="openEditDlg('add')"
      />
    </template>
  </fx-page-table-v2>
  <edit-dlg v-if="dlgVisible" :actionType="actionType" :editId="editId" @cancel="dlgVisible=false;" @refresh="tableRef.refresh();"/>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { HlMessage, HlMessageBox } from 'hongluan-ui';
import { apiTechnologyManagementObj } from '@/apis/modules/major-technology-management';
import { IpostFindTechnologyPageSpace } from '@/apis/modules/major-technology-management/model';
import EditDlg from './edit-dlg.vue';

const tableData = ref([] as IpostFindTechnologyPageSpace.List[]);
const tableRef = ref();
const dlgVisible = ref(false);
const actionType = ref();
const editId = ref();

const cols = ref([
  {
    title: '序号',
    slotName: 'tableIndex',
    prop: 'tableIndex',
    align: 'center',
    width: '30px',
  }, {
    title: '重点工艺名称',
    prop: 'name',
    minWidth: '160px',
    showTooltip: true,
    tooltipProps: { width: '400px' }
  }, {
    title: '所属企业',
    prop: 'companyName',
    minWidth: '120px',
    showTooltip: true,
    tooltipProps: { maxWidth: '400px' }
  }, {
    title: '所属区域',
    prop: 'areaName',
    showTooltip: true,
    tooltipProps: { maxWidth: "400px" }
  }, {
    title: '安全生产许可证号',
    prop: 'securityLicense',
    minWidth: '120px',
    showTooltip: true,
    tooltipProps: { width: '400px' },
  }, {
    title: '有效期',
    prop: 'securityLicenseValidity',
    minWidth: '120px',
    showTooltip: true,
    tooltipProps: { width: '400px' },
  }, {
    title: '工艺简介',
    prop: 'remark',
    minWidth: '120px',
    showTooltip: true,
    tooltipProps: { width: '400px' },
  }, {
    title: '操作',
    slotName: 'actions',
    prop: 'actions',
    align: 'center',
    width: "80px",
    fixed: 'right'
  },
]);
const searchItems = ref([
  {
    type: 'input',
    label: '重点工艺名称',
    placeholder: '重点工艺名称',
    value: '',
    name: 'name',
  },
]);
const defaultPagination = { pageSize: 10, currentPage: 1, total: 0 };

const getData = async({ pageSize, currentPage, params, setTotal }: { pageSize: number; currentPage: number; params: { [key: string]: string | string[] }; setTotal: (item?: number) => void }) => {
  const requestParams = {
    ...params,
    pageSize,
    currentPage,
  }
  const { data } = await apiTechnologyManagementObj.postFindTechnologyPage(requestParams);
  tableData.value = data.list || [];
  setTotal(data.totalRow);
};

const openEditDlg = (type: string, id: string) => {
  actionType.value = type;
  dlgVisible.value = true;
  editId.value = id;
};
const handleDel = async(id: string, name: string) => {
  await HlMessageBox.confirm(`确认删除“${name}”?`, '提示', {
    confirmButtonText: '确定',
    confirmButtonType: 'danger',
    cancelButtonText: '取消',
  });
  await apiTechnologyManagementObj.postDeleteTechnology(id);
  HlMessage.success('删除成功');
  tableRef.value.refresh();
};

</script>
