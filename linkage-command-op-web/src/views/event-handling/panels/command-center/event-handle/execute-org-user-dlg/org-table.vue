<template>
  <hl-scrollbar class="table-list">
    <hl-simple-table class="normal-stripe-table" fixed-header :cols="cols" :data="tableData" hover>
      <template #allRowsSelector>
        <hl-checkbox v-model="isSelectedAll" :indeterminate="isIndeterminate" @change="selectAll" />
      </template>
      <template #tableSelect="{ row }">
        <hl-checkbox v-model="selectedRowKeys" :label="row.id" @change="handleSelectRow(row)">{{ '' }}</hl-checkbox>
      </template>
      <template #tableIndex="{ rowIndex }">
        <span>{{ rowIndex + 1 }}</span>
      </template>
      <template #communicationMode="{ row }">
        <hl-group
          align="items-left items-middle"
          gap="var(--xxs)"
        >
          <hl-popover
            v-for="(item, index) in row.communicationMode"
            :key="index"
            placement="top-start"
            :title="COMMUNICATION_MODE_MAP[item.mode]?.label + '：'"
            :width="200"
            trigger="hover"
            :content="item.value">
            <template #reference>
              <hl-icon size="xs" class="static">
                <component :is='COMMUNICATION_MODE_MAP[item.mode]?.icon'></component>
              </hl-icon>
            </template>
          </hl-popover>
        </hl-group>
      </template>
      <template #actions="{ row }">
        <hl-group gap="var(--xxs)">
          <hl-button :disabled="isEventFinished" type="link" @click="handleEdit(row)" effect="light" hover="primary">
            编辑
          </hl-button>
          <hl-button :disabled="isEventFinished" type="link" @click="handleDelete(row)" effect="light" hover="primary">
            删除
          </hl-button>
        </hl-group>
      </template>
    </hl-simple-table>
  </hl-scrollbar>
  <hl-pagination
    v-if="pagination.totalPage>0"
    v-model="pagination.currentPage"
    layout="sizes, total, slot, prev, pager, next"
    :total="pagination.totalPage"
    :page-size="pagination.pageSize"
    align="items-right" block
    style="--pagination-bg-color-active:var(--text-link);margin-top: calc(var(--xxs) * 5.5);"
    @current-change="currentChange"
    @size-change="handleSizeChange">
    <span class="self-full"></span>
  </hl-pagination>

  <add-org-dlg
    v-if="addAgencyDlgVisible"
    :strategyInfoId="strategyInfoId"
    :groupId="groupId"
    :selecedtAgencyData="selecedtAgencyData"
    @cancel="addAgencyDlgVisible=false"
    @confirm="addAgencyConfirm"
  />
  <edit-org-dlg v-if="editAgencyDlgVisible" :row="editAgecyRow" @cancel="editAgencyDlgVisible=false" @confirm="editAgencyConfirm" />
</template>
<script lang="ts" setup>
import { ref, PropType, watch, onMounted, reactive, Ref } from 'vue';
import { useRoute } from 'vue-router';
import { HlMessage, HlMessageBox } from 'hongluan-ui';
import { useTableSelection } from 'hongluan-hooks';
import { isEqual, uniq, differenceWith } from 'lodash-es';
import { useCurrentEvent, useMeeting } from '@/hooks';
import { COMMUNICATION_MODE_MAP } from '@/common';
import { IpostFindStrategyCommandOrgPageSpace, IpostFindCommandSysGroupOrgPageSpace } from '@/apis/modules/command-center/model';
import { apiCommandCenterObj } from '@/apis/modules/command-center';
import { EditOrgDlg, AddOrgDlg } from './components/index';

const props = defineProps({
  groupId: String,
  strategyInfoId: String,
  isEventFinished: Boolean,
  parentGroupId: String,
});
const emit = defineEmits(['updateTotal']);

const route = useRoute();
const { addMeetingOrg } = useMeeting();
const { currentEvent } = useCurrentEvent();

const cols = ref([
  { title: '#', slotName: 'tableSelect', headerSlotName: 'allRowsSelector', width: '3em' },
  { title: '序号', align: 'center', slotName: 'tableIndex', width: '6em', },
  { title: '机构名称 ', prop: 'orgName', width: '8em', showTooltip: true, },
  {
    title: '组内岗位职责',
    prop: 'poolRolesTxt',
    width: '8em',
    showTooltip: true,
  },
  { title: '职责描述', prop: 'jobDescription', width: '8em', showTooltip: true, },
  {
    title: '联络方式',
    prop: 'communicationMode',
    slotName: 'communicationMode',
    showTooltip: true,
    width: '8em',
    tooltipProps: { width: '200px', popperClass: 'test-tip', placement: 'bottom' },
  },
  { title: '操作', prop: 'actions', slotName: 'actions', align: 'center', fixed: 'right', },
]);
const tableData = ref<Array<IpostFindStrategyCommandOrgPageSpace.List & {poolRolesTxt?: string;}>>([]);
const pagination = reactive({
  currentPage: 1,
  totalPage: 0,
  pageSize: 10,
});
const addAgencyDlgVisible = ref(false);
const selecedtAgencyData = ref<IpostFindStrategyCommandOrgPageSpace.List[]>([]);
const editAgecyRow = ref<IpostFindStrategyCommandOrgPageSpace.List>();
const editAgencyDlgVisible = ref(false);

const {
  isSelectedAll,
  isIndeterminate,
  selectedRowKeys,
  selectAll,
  selectRow,
} = useTableSelection(tableData);

const getData = async() => {
  if (!props.groupId) return;
  const result = await apiCommandCenterObj.postFindStrategyCommandOrgPage({
    pageSize: pagination.pageSize,
    currentPage: pagination.currentPage,
    groupId: props.groupId,
    groupSelf: props.parentGroupId !== '0',
    strategyInfoId: props.strategyInfoId,
    eventId: currentEvent.id
  });
  tableData.value = result.data.list;
  tableData.value.forEach(item => {
    item.poolRolesTxt = item.poolRoles.length ? item.poolRoles.map((ele: any) => (ele.poolRoleName)).join('，') : '';
  });
  pagination.totalPage = +result.data.totalRow;
  selecedtAgencyData.value = tableData.value;

  emit('updateTotal', pagination.totalPage);
};

const currentChange = (page: number) => {
  pagination.currentPage = page;
  getData();
};
const handleSizeChange = (val: number) => {
  pagination.pageSize = val;
  pagination.currentPage = 1;
  getData();
};

const handleSelectRow = (rowData: IpostFindStrategyCommandOrgPageSpace.List) => {
  const { id, orgId } = rowData;
  const toDelIds = ref<string[]>([]);
  const toAddIds = ref<string[]>([]);
  const newKeys = ref<string[]>([]);
  if (selectedRowKeys.value.includes(id)) {
    tableData.value.forEach((d:any) => {
      if (d.orgId === orgId) toAddIds.value.push(d.id);
    });
    newKeys.value = uniq([...(selectedRowKeys.value as string[]), ...toAddIds.value]);
  } else {
    tableData.value.forEach(d => {
      if (d.orgId === orgId) toDelIds.value.push(`${d.id}`);
    });
    newKeys.value = uniq(differenceWith(selectedRowKeys.value as string[], toDelIds.value));
  }
  selectedRowKeys.value = newKeys.value;
};
// 编辑
const handleEdit = (row: IpostFindStrategyCommandOrgPageSpace.List) => {
  editAgecyRow.value = row;
  editAgencyDlgVisible.value = true;
};

// 删除
const handleDelete = async(row: IpostFindStrategyCommandOrgPageSpace.List) => {
  await HlMessageBox.confirm(`您确认删除${row.orgName}吗?`, '删除提示', {
    confirmButtonText: '确定',
    confirmButtonType: 'danger',
    cancelButtonText: '取消',
    type: 'success',
  }).then(async() => {
    await apiCommandCenterObj.postDeleteStrategyCommandOrg(row.id);
    getData();
  });
};
const handleBatchDelete = async() => {
  if (!selectedRowKeys.value.length) {
    HlMessage.warning('请选中单位');
    return;
  }
  await HlMessageBox.confirm('您确认删除选中单位吗?', '删除提示', {
    confirmButtonText: '确定',
    confirmButtonType: 'danger',
    cancelButtonText: '取消',
    type: 'success',
  }).then(async() => {
    await apiCommandCenterObj.postBatchDeleteStrategyCommandOrg(selectedRowKeys.value as string[]);
    getData();
  });
};

// 新增
const handleAdd = () => {
  addAgencyDlgVisible.value = true;
};

const editAgencyConfirm = () => {
  editAgencyDlgVisible.value = false;
  getData();
};

const getSelectedOrgIds = () => {
  return tableData.value.filter(item => selectedRowKeys.value.includes(item.id)).map(item => `${item.orgId}`);
};

const handleBatchMeeting = async() => {
  if (!selectedRowKeys.value.length) {
    HlMessage.warning('请选中单位');
    return;
  }
  await addMeetingOrg(getSelectedOrgIds());
};

const addAgencyConfirm = () => {
  addAgencyDlgVisible.value = false;
  getData();
};

const resetPage = () => {
  pagination.currentPage = 1;
  pagination.totalPage = 0;
};

watch(() => props.groupId, val => {
  resetPage();
  getData();
});

onMounted(() => {
  getData();
});

defineExpose({
  handleAdd,
  handleBatchDelete,
  handleBatchMeeting,
});
</script>
<style lang="scss" scoped>
</style>
