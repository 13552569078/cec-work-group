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
    <template #status="{ row }">
      {{ statusMap[row.status] || '-' }}
    </template>
  </fx-page-table-v2>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { HlMessage, HlMessageBox } from 'hongluan-ui';
import { apiMonitorManagementObj } from '@/apis/modules/monitor-management';
import { IpostFindMonitorInfoPageSpace } from '@/apis/modules/monitor-management/model';

const statusMap = {
  on: '在线',
  off: '离线'
};
const tableData = ref([] as IpostFindMonitorInfoPageSpace.List[]);
const tableRef = ref();

const cols = ref([
  {
    title: '序号',
    slotName: 'tableIndex',
    prop: 'tableIndex',
    align: 'center',
    width: '30px',
  }, {
    title: '监控点名称',
    prop: 'name',
    minWidth: '200px',
    showTooltip: true,
    tooltipProps: { width: '400px' }
  }, {
    title: '监测主体',
    prop: 'subjectName',
    minWidth: '200px',
    showTooltip: true,
    tooltipProps: { maxWidth: '400px' }
  }, {
    title: '在线状态',
    prop: 'status',
    minWidth: '200px',
    slotName: 'status',
  }, {
    title: '国标编码',
    prop: 'gbCode',
    minWidth: '200px',
    showTooltip: true,
    tooltipProps: { width: '400px' },
  }, {
    title: '资源编码',
    prop: 'resCode',
    minWidth: '200px',
    showTooltip: true,
    tooltipProps: { width: '400px' },
  }, {
    title: '视频来源',
    prop: 'sourceTypeName',
    showTooltip: true,
  },
]);
const searchItems = ref([{
    type: 'input',
    label: '国标编码',
    placeholder: '国标编码',
    value: '',
    name: 'gbCode',
  }, {
    type: 'input',
    label: '监测主体',
    placeholder: '监测主体',
    value: '',
    name: 'subjectName',
  }, {
    type: 'input',
    label: '监控点名称',
    placeholder: '监控点名称',
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
  const { data } = await apiMonitorManagementObj.postFindMonitorInfoPage(requestParams);
  tableData.value = data.list || [];
  setTotal(data.totalRow);
};
</script>
