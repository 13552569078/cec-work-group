<template>
  <hl-scrollbar class="table-list">
    <hl-simple-table ref="tableRef" class="normal-stripe-table" fixed-header :cols="cols" :data="tableData" hover>
      <template #allRowsSelector>
        <hl-checkbox v-model="isSelectedAll" :indeterminate="isIndeterminate" @change="selectAll" />
      </template>
      <template #tableSelect="{ row }">
        <hl-checkbox v-model="selectedRowKeys" :label="row.id" @change="handleSelectRow(row)">{{ '' }}</hl-checkbox>      </template>
      <template #tableIndex="{ rowIndex }">
        <span>{{ rowIndex + 1 }}</span>
      </template>
      <template #userName="{ row }" >
        <span class="text-primary cursor-pointer" @click.stop="showPersonnelDetail(row)">{{ row.userName }}</span>
        <span v-if="row.memberType ===1" class="tag">专家</span>
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
            width="calc(var(--xxs) * 50)"
            trigger="hover"
          >
            <template #reference>
              <hl-icon size="xs" class="static">
                <component :is='COMMUNICATION_MODE_MAP[item.mode]?.icon'></component>
              </hl-icon>
            </template>
            <div class="display-flex items-middle">
              <span>{{ item.value }}</span>
              <img
                v-if="CALLABLE_COMMUNICATION_MODES.includes(item.mode) && item.value"
                class="icon m-l-sm cursor-pointer"
                style="width: var(--sm); height: var(--sm);"
                :src="mobileIcon"
                @click="currentCallingUser = { ...row, mobile: item.value}"
              >
            </div>
          </hl-popover>
        </hl-group>
      </template>
      <template #actions="{ row }">
        <hl-group gap="var(--xxs)">
          <hl-button v-if='row.memberType !==1' :disabled="isEventFinished" type="link" @click="handleEdit(row)" effect="light" hover="primary">
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
    v-if="pagination.totalPage > 0"
    v-model="pagination.currentPage"
    layout="sizes, total, slot, prev, pager, next"
    :total="pagination.totalPage"
    :page-size="pagination.pageSize"
    align="items-right"
    block
    style="--pagination-bg-color-active:var(--text-link);margin-top: calc(var(--xxs) * 5.5);"
    @current-change="currentChange"
    @size-change="handleSizeChange"
  >
    <span class="self-full"></span>
  </hl-pagination>
  <!-- 新增人员类型弹窗 -->
  <select-type-dlg v-if="typeDlgVisible" @cancel="typeDlgVisible=false" @confirm="typeConfirm"></select-type-dlg>
  <!-- 编辑、添加l临时人员 -->
  <add-personnel-dlg
    v-if="addPersonalDlgVisible"
    :strategyInfoId="strategyInfoId"
    :groupId="groupId"
    :personId="personId"
    :form="personalForm"
    :is-add-temp-user="isAddTempUser"
    @cancel="addPersonalDlgVisible=false;isAddTempUser=false"
    @confirm="personalConfirm"
  />
  <!-- 添加系统人员 -->
  <org-user-selector-dlg
    v-if="selectPersonalDlgVisible"
    :show-command-system="false"
    :show-org-tab="false"
    force-hide-tree-tab
    title="添加系统用户-用户中心"
    @submit="selectPersonalConfirm"
    @cancel="selectPersonalDlgVisible = false"
  />
   <!-- 添加专家 -->
   <org-user-selector-dlg
    v-if="addExpertDlgVisible"
    :show-command-system="false"
    :show-org-tab="false"
    :isExpert="isExpert"
    show-as="table"
    :itemsSectionWidth="[15,9]"
    force-hide-tree-tab
    title="专家-应急资源"
    @submit="selectPersonalConfirm"
    @cancel="addExpertDlgVisible = false;isExpert = false"
  />
  <!-- 人员详情 -->
  <personnel-detail-dlg v-if="personnelDetailDlgVisible" :personId="personId" @cancel="personnelDetailDlgVisible = false" />
  <resource-detail-dlg v-if="resourceDlgParams.show" v-bind="resourceDlgParams" @ok=" resourceDlgParams.show = false " @cancel=" resourceDlgParams.show = false "
    />
</template>
<script lang="ts" setup>
import { ref, PropType, watch, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { isEqual, uniq, differenceWith } from 'lodash-es';
import { HlMessage, HlMessageBox } from 'hongluan-ui';
import { useTableSelection } from 'hongluan-hooks';
import { OrgUserSelectorDlg } from '@/components';
import { useCalling, useCurrentEvent, useIcons, useMeeting } from '@/hooks';
import { COMMUNICATION_MODE_MAP, CALLABLE_COMMUNICATION_MODES } from '@/common';
import { IpostFindStrategyCommandGroupTreeSpace } from '@/apis/modules/command-center/model';
import { IpostFindStrategyCommandUserPageSpace } from '@/apis/modules/command-center/model';
import { apiCommandCenterObj } from '@/apis/modules/command-center';
import { SelectTypeDlg, AddPersonnelDlg, PersonnelDetailDlg } from './components/index';
import { ResourceDetailDlg } from '@/background-map/dialog';

const props = defineProps({
  groupId: String,
  strategyInfoId: String,
  isEventFinished: Boolean,
  parentGroupId: String,
  keyWord: String
});
const emit = defineEmits(['updateTotal']);

const route = useRoute();
const { currentEvent } = useCurrentEvent();
const { mobileIcon } = useIcons();
const { currentCallingUser } = useCalling();

const cols = ref([
  { title: '#', slotName: 'tableSelect', headerSlotName: 'allRowsSelector', width: '3em' },
  { title: '序号', align: 'center', slotName: 'tableIndex', width: '6em', },
  { title: '姓名 ', prop: 'userName', width: '10em', slotName: 'userName', showTooltip: true, },
  { title: '工作单位 ', prop: 'orgName', width: '8em', showTooltip: true, },
  {
    title: '联系方式',
    prop: 'communicationMode',
    slotName: 'communicationMode',
    showTooltip: true,
    width: '8em',
    tooltipProps: { width: '200px', popperClass: 'test-tip', placement: 'bottom' },
  },
  { title: '工作组', prop: 'groupName', width: '8em', showTooltip: true, },
  {
    title: '组内岗位职责',
    prop: 'poolRolesTxt',
    width: '8em',
    showTooltip: true,
  },
  { title: '职责描述', prop: 'jobDescription', width: '8em', showTooltip: true, },

  { title: '操作', prop: 'actions', slotName: 'actions', align: 'center', fixed: 'right', },
]);

const tableData = ref<IpostFindStrategyCommandUserPageSpace.List[]>([]);
const pagination = reactive({
  currentPage: 1,
  totalPage: 0,
  pageSize: 10,
});
const {
  isSelectedAll,
  isIndeterminate,
  selectedRowKeys,
  selectAll,
} = useTableSelection(tableData);

const typeDlgVisible = ref(false);
const selectType = ref('');
const personId = ref();
const personalForm = ref();
const addPersonalDlgVisible = ref(false);
const selectPersonalDlgVisible = ref(false);
const personnelDetailDlgVisible = ref(false);
const addExpertDlgVisible = ref(false);
const isExpert = ref(false); // 是否专家
const isAddTempUser = ref(false);
const resourceDlgParams = reactive<Record<string, any>>({ show: false, id: '', resourceType: '', name: '', title: '专家详情' });

const { addMeeting } = useMeeting();

const getData = async() => {
  if (!props.groupId) return;
  const result = await apiCommandCenterObj.postFindStrategyCommandUserPage({
    pageSize: pagination.pageSize,
    currentPage: pagination.currentPage,
    groupId: props.groupId,
    groupSelf: props.parentGroupId !== '0',
    strategyInfoId: props.strategyInfoId,
    eventId: currentEvent.id,
    keyWord: props.keyWord
  });
  tableData.value = result.data.list.map(d => ({
    ...d,
    poolRolesTxt: d.poolRoles.length ? d.poolRoles.map((ele: any) => (ele.poolRoleName)).join('，') : ''
  }));

  pagination.totalPage = +result.data.totalRow;
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

const handleSelectRow = (rowData: IpostFindStrategyCommandUserPageSpace.List) => {
  const { id, userId } = rowData;
  const toDelIds = ref<string[]>([]);
  const toAddIds = ref<string[]>([]);
  const newKeys = ref<string[]>([]);
  if (selectedRowKeys.value.includes(id)) {
    tableData.value.forEach(d => {
      if (d.userId === userId) toAddIds.value.push(`${d.id}`);
    });
    newKeys.value = uniq([...(selectedRowKeys.value as string[]), ...toAddIds.value]);
  } else {
    tableData.value.forEach(d => {
      if (d.userId === userId) toDelIds.value.push(`${d.id}`);
    });
    newKeys.value = uniq(differenceWith(selectedRowKeys.value as string[], toDelIds.value));
  }
  selectedRowKeys.value = newKeys.value;
};
// 编辑
const handleEdit = (row: any) => {
  personId.value = row.id;
  addPersonalDlgVisible.value = true;
};
// 删除
const handleDelete = async(row: any) => {
  await HlMessageBox.confirm(`您确认删除${row.userName}吗?`, '删除提示', {
    confirmButtonText: '确定',
    confirmButtonType: 'danger',
    cancelButtonText: '取消',
    type: 'success',
  }).then(async() => {
    await apiCommandCenterObj.postDeleteStrategyCommandUser(row.id);
    getData();
  });
};
const handleBatchDelete = async() => {
  if (!selectedRowKeys.value.length) {
    HlMessage.warning('请选中人员');
    return;
  }
  await HlMessageBox.confirm('您确认删除选中人员吗?', '删除提示', {
    confirmButtonText: '确定',
    confirmButtonType: 'danger',
    cancelButtonText: '取消',
    type: 'success',
  }).then(async() => {
    await apiCommandCenterObj.postBatchDeleteStrategyCommandUser(selectedRowKeys.value as string[]);
    getData();
  });
};

// 新增
const handleAdd = () => {
  typeDlgVisible.value = true;
};
const typeConfirm = (value: string) => {
  selectType.value = value;
  typeDlgVisible.value = false;
  isAddTempUser.value = false;
  if (value === '1') {
    // 临时处置人员
    personId.value = null;
    personalForm.value = null;
    isAddTempUser.value = true;
    addPersonalDlgVisible.value = true;
  } else if (value === '0') {
    // 专家
    isExpert.value = true;
    addExpertDlgVisible.value = true;
  } else {
    // 系统人员
    selectPersonalDlgVisible.value = true;
  }
};

const personalConfirm = () => {
  isAddTempUser.value = false;
  addPersonalDlgVisible.value = false;
  getData();
};
const selectPersonalConfirm = async({ organization: { user } }: { organization: { user: Record<string, any>[] }}) => {
  const members = user.map(ele => {
    const communicationMode = [{ value: ele.mobile, mode: 'mobile' }];
    if (ele.account) {
      communicationMode.push({ value: ele.account, mode: 'system' });
    }
    return {
      ...ele,
      gender: ele.gender === '男' ? 1 : ele.gender === '女' ? 0 : ele.gender,
      strategyInfoId: props.strategyInfoId,
      groupId: props.groupId,
      addGroupOrg: false,
      addUser: false,
      name: ele.userName,
      communicationMode,
    };
  });
  await apiCommandCenterObj.postBatchAddStrategyCommandUser(members);
  selectPersonalDlgVisible.value = false;
  // 专家
  isExpert.value = false;
  addExpertDlgVisible.value = false;
  getData();
};

const handleBatchMeeting = async() => {
  if (!selectedRowKeys.value.length) {
    HlMessage.warning('请选中人员');
    return;
  }
  const userIds: string[] = [];
  tableData.value.forEach(row => {
    selectedRowKeys.value.includes(row.id) && userIds.push(`${row.userId}`);
  });
  await addMeeting({ personIds: userIds as string[], strategyId: props.strategyInfoId! });
};

const showPersonnelDetail = (row: IpostFindStrategyCommandUserPageSpace.List) => {
  personId.value = row.id;
  if (row.memberType === 1) {
    resourceDlgParams.id = row.expertId;
    resourceDlgParams.resourceType = 'resource_expert';
    resourceDlgParams.name = row.userName;
    resourceDlgParams.show = true;
  } else {
    personnelDetailDlgVisible.value = true;
  }
};

const resetPage = () => {
  pagination.currentPage = 1;
  pagination.totalPage = 0;
};

watch(() => props.groupId, val => {
  resetPage();
  getData();
});
watch(() => props.keyWord, val => {
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
.tag {
  background: rgba(113, 248, 252, 0.24);
  border-radius: calc(var(--xxs) * 0.5);
  font-size: var(--font-sm);
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #71F8FC;
  margin-left: calc(var(--xxs) * 2);
  padding: calc(var(--xxs) * 0.5) calc(var(--xxs) * 1.5);
}
</style>
