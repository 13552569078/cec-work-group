<template>
  <hl-dialog
    :model-value="true"
    width="calc(var(--xxs) * 250)"
    height="calc(var(--xxs) * 220)"
    title="集结点"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="assemble-user-list-dlg"
    @closed="$emit('cancel')"
  >
    <hl-group full class="h-100" gap-x="calc(var(--xxs) * 5)">
      <hl-scrollbar class="h-100 bg-normal self-no-full p-x-md p-y-sm" style="width:calc(var(--xxs) * 70);">
        <hl-tree ref="assembleTreeRef"
          :data="assembleTreeData"
          node-key="id"
          :props="assembleTreeProps"
          default-expand-all
          :expand-on-click-node="false"
          highlight-current
          style="--tree-child-bg-color:transparent;--tree-bg-color:transparent;"
          @node-click="handleNodeClick"
        >
          <template #default="{ node }">
            <hl-group gap="var(--xs)" align="items-between items-middle self-grow" style="overflow: hidden;">
              <span class="font-16 text-ellipsis" @mouseover="showTooltip">
                {{ node.label }}
              </span>
              <img class="static" v-if="node.level === 1" style="height:var(--xxs);" src="@/assets/images/common/left-tree-title-icon.png">
            </hl-group>
          </template>
        </hl-tree>
      </hl-scrollbar>
      <hl-group dir="vertical" class="h-100">
        <hl-tabs v-model="activeName" type="line" outlineless
          class="font-16 bg-normal p-l-md"
          style="
            --tabs-bar-color: var(--text-hover);
            --tabs-border-color: transparent;
            --tabs-height: calc(var(--xxs) * 14);
            --tabs-font-size: var(--font-lg);
            --tabs-font-color: #fff;
            --tabs-gap: calc(var(--xxs) * 7.5);
          "
        >
          <hl-tab-pane label="待集结" name="assembling"></hl-tab-pane>
          <hl-tab-pane label="已集结" name="assembled"></hl-tab-pane>
        </hl-tabs>
        <hl-group align="items-between items-middle" class="m-t-lg m-b-sm">
          <hl-group class="items-middle font-16">
            <hl-icon class="m-r-xs"><fill-search /></hl-icon> 查询结果<span class="m-x-xxs" style="color: #FFEA44;">{{ tableData.length }}</span>条数据
          </hl-group>
          <hl-group gap="var(--md)" v-if="!eventIsFinished && currentAssemblePoint.id !== '-1'">
            <hl-button
              v-if="activeName === 'assembling'"
              type="primary"
              class="hover-style"
              :disabled="!selectedOnlineRows.length"
              @click="openSuperviseDlg"
            >督办</hl-button>
            <hl-button
              v-else-if="activeName === 'assembled'"
              type="primary"
              class="hover-style"
              :disabled="!selectedOnlineRows.length"
              @click="openMeetingDlg"
            >组建会议</hl-button>
          </hl-group>
        </hl-group>
        <hl-scrollbar height="calc(var(--xxs) * 165)">
          <hl-simple-table :cols="cols" stripe :data="tableData" hover class="normal-stripe-table" list gap-y="var(--xxs)" fixed-header :header-cell-style="{background: '#053963'}">
            <template #allRowsSelector>
              <hl-checkbox v-model="isSelectedAll" :indeterminate="isIndeterminate" @change="selectAll" />
            </template>
            <template #rowSelector="{ row }">
              <hl-checkbox v-model="selectedRowKeys" :label="row.id" @change="selectRow" :disabled="activeName === 'assembling' ? false : row.online !== 1">{{ '' }}</hl-checkbox>
            </template>
            <template #tableIndex="{ rowIndex }">
              <span class="table-index">{{ rowIndex + 1 }}</span>
            </template>
            <template #online="{ row }">
              <span v-if="row.online === 1" class="status online">在线</span>
              <span v-else-if="row.online === 2" class="status offline">离线</span>
              <span v-else-if="row.online === 3" class="status not-report">未上报</span>
            </template>
            <template #empty>
              <hb-empty description="暂无数据" :image="NoDataImg" />
            </template>
          </hl-simple-table>
        </hl-scrollbar>
      </hl-group>
    </hl-group>
    <send-assemble-supervise-dlg
      v-if="showSendSuperviseDlg"
      :users="selectedOnlineRows"
      :content="messageContent"
      @cancel="showSendSuperviseDlg = false"
    />
  </hl-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, PropType, ref } from 'vue';
import { HlMessage, HlTree } from 'hongluan-ui';
import { useTableSelection } from 'hongluan-hooks';
import { useCurrentEvent, useMeeting, useTextOverflow } from '@/hooks';
import { apiSitePersonnelObj } from '@/apis/modules/site-personnel';
import SendAssembleSuperviseDlg from './send-assemble-supervise-dlg.vue';
import type { IpostFindCommandCenterAssemblePointListSpace } from '@/apis/modules/site-personnel/model';

const props = defineProps({
  tab: {
    type: String as PropType<'assembling' | 'assembled'>,
    default: 'assembling'
  },
  id: String
});

const { eventIsFinished, currentEvent } = useCurrentEvent();
const { addMeeting } = useMeeting();
const { showTooltip } = useTextOverflow();

const assembleTreeProps = ref({
  children: 'children',
  label: 'assembleTitle',
});
const currentAssemblePoint = ref<Record<string, any>>({ id: props.id || '-1' });
const assemblePointList = ref<IpostFindCommandCenterAssemblePointListSpace.Data[]>([]);
const assembleTreeRef = ref<InstanceType<typeof HlTree>>();
const activeName = ref(props.tab);
const assemblingUsers = ref<IpostFindCommandCenterAssemblePointListSpace.AssemblingUser[]>([]);
const assembledUsers = ref<IpostFindCommandCenterAssemblePointListSpace.AssemblingUser[]>([]);
const cols = [
  {
    title: '',
    slotName: 'rowSelector',
    headerSlotName: 'allRowsSelector',
    width: '3em'
  },
  {
    title: '#',
    prop: '',
    slotName: 'tableIndex',
    width: '3em',
  },
  {
    prop: 'userName',
    title: '姓名',
    width: '9em',
    showTooltip: true,
  },
  {
    prop: 'online', // 1-在线, 2-离线, 3-未上报
    title: '在线状态',
    width: '8em',
    slotName: 'online',
  },
  {
    prop: 'orgName',
    title: '部门',
    showTooltip: true,
  },
];
const showSendSuperviseDlg = ref(false);
const messageContent = ref('');

const tableData = computed(() => activeName.value === 'assembling' ? assemblingUsers.value : assembledUsers.value);
const assembleTreeData = computed(() => {
  return [{
    id: '-1',
    assembleTitle: '集结点',
    children: assemblePointList.value
  }];
});
const selectedOnlineRows = computed(() =>
  activeName.value === 'assembling' ?
    tableData.value.filter(item => selectedRowKeys.value.find(id => `${item.id}` === id)) :
    tableData.value.filter(item => selectedRowKeys.value.find(id => item.online === 1 && `${item.id}` === id))
);

const {
  isSelectedAll,
  isIndeterminate,
  selectedRowKeys,
  selectAll,
  selectRow,
} = useTableSelection(tableData);

const handleNodeClick = (node: { id: string }) => {
  currentAssemblePoint.value = node;
  if (node.id === '-1') {
    queryAllUsers();
  } else {
    const result = assemblePointList.value.find(a => a.id === node.id)!;
    assemblingUsers.value = result.assemblingUsers;
    assembledUsers.value = result.assembledUsers;
  }
};

const getAssemblePointList = async() => {
  const result = await apiSitePersonnelObj.postFindCommandCenterAssemblePointList(currentEvent.id as string);
  assemblePointList.value = result.data;
};

const queryAllUsers = async() => {
  const result = await apiSitePersonnelObj.postEventAssembleUserStatDetail(currentEvent.id as string);
  assemblingUsers.value = result.data.assemblingUsers;
  assembledUsers.value = result.data.assembledUsers;
};

const openSuperviseDlg = async() => {
  messageContent.value = `事件：【${currentEvent.name}】，请收到通知后，立即赶往集结点：【${currentAssemblePoint.value.assembleAddress}】集合，并等待后续调度通知 `;
  showSendSuperviseDlg.value = true;
};

const openMeetingDlg = async() => {
  await addMeeting({
    personIds: selectedOnlineRows.value.map(r => r.userId),
    strategyId: currentEvent.strategyInfoId
  });
};

onMounted(async() => {
  await getAssemblePointList();
  assembleTreeRef.value?.setCurrentKey(props.id || '-1');
  if (!props.id) {
    await queryAllUsers();
  } else {
    const p = assemblePointList.value.find(ap => ap.id === props.id)!;
    handleNodeClick({ ...p });
  }
});
</script>

<style lang="scss" scoped>
.bg-normal {
  background-color: rgba(0,158,247,0.1);
}
.title {
  height: calc(var(--xxs) * 22);
  line-height: calc(var(--xxs) * 22);
}

:deep(.is-current.is-focusable) {
  >.tree-node-content {
    background-image: url(@/assets/images/common/left-tree-selected.png);
    background-repeat: no-repeat;
  }
}

</style>
<style lang="scss">
.assemble-user-list-dlg {
  .panel-body {
    flex: 1;
    overflow: hidden;
  }
}
</style>
