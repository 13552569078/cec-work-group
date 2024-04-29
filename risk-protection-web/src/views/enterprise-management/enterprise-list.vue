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
          @click="handleDel(row.id, row.companyName)"
        >
          删除
        </hl-button>
      </hl-group>
    </template>
    <template #toolbar-extra-after>
      <fx-action-button
        :label="`新增${enterpriseTypeDesc}`"
        class="m-l-md"
        @click="openEditDlg('add')"
      />
    </template>
  </fx-page-table-v2>
  <enterprise-edit-dlg :enterpriseType="enterpriseType" :enterpriseTypeDesc="enterpriseTypeDesc" :actionType="actionType" :enterpriseId="enterpriseId" v-if="dlgVisible" @cancel="dlgVisible=false;" @refresh="tableRef.refresh();"/>
</template>
<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue';
import { HlMessage, HlMessageBox } from 'hongluan-ui';
import { GlobalAPI } from '@/common';
import { useAreaTree } from '@/hooks';
import EnterpriseEditDlg from './enterprise-edit-dlg.vue';
import { apiEnterpriseManagementObj } from '@/apis/modules/enterprise-management';
import { IpostFindCompanyPageSpace } from '@/apis/modules/enterprise-management/model';

const props = defineProps({
  enterpriseType: {
    type: String,
  }
});

const { getAreaTree, areaProps, areaTreeData } = useAreaTree();

const enterpriseTypeDesc = computed(() => {
  return GlobalAPI.config.JINGXIANDICT.ENTERPRISE_TYPE.find(item => {
    return item.value === props.enterpriseType;
  })?.label || '';
});
const dlgVisible = ref(false);
const actionType = ref();
const enterpriseId = ref('');
const tableRef = ref();
const tableData = ref([] as IpostFindCompanyPageSpace.List[]);

const cols = ref([
  {
    title: '序号',
    slotName: 'tableIndex',
    prop: 'tableIndex',
    align: 'center',
    width: '30px',
  },
  { title: '企业名称',
    prop: 'companyName',
    minWidth: "160px",
    showTooltip: true,
    tooltipProps: { width: '400px' } },
  { title: '统一信用代码', prop: 'companyCode', minWidth: "120px", showTooltip: true, tooltipProps: { maxWidth: "400px" },},
  { title: '所属区域', prop: 'areaName',  showTooltip: true,tooltipProps: { maxWidth: "400px" } },
  { title: '法定代表人', prop: 'legalPerson',  minWidth: "120px", showTooltip: true, tooltipProps: { maxWidth: "400px" }},
  { title: '法定代表人联系方式', prop: 'legalPersonPhone',  minWidth: "80px", showTooltip: true, tooltipProps: { width: "400px" }},
  { title: '注册地址', prop: 'regAddress',  minWidth: "120px", showTooltip: true, tooltipProps: { width: '400px' } },
  {
    title: '操作',
    slotName: 'actions',
    prop: 'actions',
    align: 'center',
    width: "80px",
    fixed: 'right'
  },
]);

const originSearchItems = [
  {
    type: 'input',
    label: '企业名称',
    placeholder: '企业名称',
    value: '',
    name: 'companyName',
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
      // return item.value.length === 1 ? name : `${name}等${item.value.length}个行政区划`;
    },
  },
];
const searchItems = ref(originSearchItems);
const defaultPagination = { pageSize: 10, currentPage: 1, total: 0 };

const getData = async({ pageSize, currentPage, params, setTotal }: { pageSize: number; currentPage: number; params: { [key: string]: string | string[] }; setTotal: (item?: number) => void }) => {
  const requestParams = {
    ...params,
    category: props.enterpriseType,
    pageSize,
    currentPage,
  }
  const { data } = await apiEnterpriseManagementObj.postFindCompanyPage(requestParams);
  tableData.value = data.list || [];
  setTotal(data.totalRow);
};
const openEditDlg = (type: string, id: string) => {
  actionType.value = type;
  dlgVisible.value = true;
  enterpriseId.value = id;
};
const handleDel = async(id: string, name: string) => {
  await HlMessageBox.confirm(`确认删除“${name}”?`, '提示', {
    confirmButtonText: '确定',
    confirmButtonType: 'danger',
    cancelButtonText: '取消',
  });
  await apiEnterpriseManagementObj.postDeleteCompany(id);
  HlMessage.success('删除成功');
  tableRef.value.refresh();
};

getAreaTree();

watch(() => props.enterpriseType, () => {
  searchItems.value = originSearchItems.map((o) => {
    return o;
  })
});
</script>
