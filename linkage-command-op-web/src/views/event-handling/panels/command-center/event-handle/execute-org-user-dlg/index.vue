<template>
  <hl-dialog
    :model-value="true"
    width="calc(var(--xxs)*329)"
    height="calc(var(--xxs)*241.5)"
    title="处置单位及人员"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="execute-org-user-dlg"
    @closed="$emit('cancel')">
    <hl-group full class="h-100" gap-x="calc(var(--xxs) * 5)">
      <hl-scrollbar class="h-100 bg-normal self-no-full p-x-md p-y-sm" style="width:calc(var(--xxs) * 70);">
        <hl-tree ref="orgTreeRef" :data="orgTree" node-key="id" :props="orgTreeProps" default-expand-all :expand-on-click-node="false"
          highlight-current style="--tree-child-bg-color:transparent;--tree-bg-color:transparent;" @node-click="handleNodeClick">
          <template #default="{ node }">
            <hl-group gap="var(--xs)" align="items-between items-middle self-grow" style="overflow: hidden;">
              <span class="text-ellipsis" :class="[1,2].includes(node.level) ? 'font-16' : 'font-14'" @mouseover="showTooltip">
                {{ node.label }}
              </span>
              <img class="static" v-if="node.level === 1" style="height:var(--xxs);"
                src="@/assets/images/common/left-tree-title-icon.png">
            </hl-group>
          </template>
        </hl-tree>
      </hl-scrollbar>
      <hl-group dir="vertical" class="h-100">
        <hl-group align="items-between items-middle" class="m-t-lg m-b-sm">
          <hl-group class="items-middle font-16">
            <hl-icon class="m-r-xs"><fill-search /></hl-icon> 查询结果<span class="m-x-xxs" style="color: #FFEA44;">{{ total }}</span>条数据
          </hl-group>
          <hl-group gap="var(--md)" align="items-middle">
            <hl-input
              clearable
              placeholder="请输入"
              maxlength="15"
              v-model="keyWord"
              @change="getSearchTag"
            >
              <template #suffix>
                <hl-icon size="xs" class="static">
                  <two-search />
                </hl-icon>
              </template>
            </hl-input>
            <div v-if="!eventIsFinished">
              <hl-button type="primary" class="m-r-sm m-l-sm" @click="handleClickBatchDelete">批量删除</hl-button>
              <hl-button icon-position="left" v-if="selectTreeNode.parentGroupId !== '0'" @click="handleClickAdd">
                新增人员
              </hl-button>
            </div>
          </hl-group>
        </hl-group>
        <!-- 处置人员列表 -->
        <user-table ref="userTableRef" v-if="strategyInfoId" :isEventFinished="eventIsFinished" :strategyInfoId="strategyInfoId" :parentGroupId="parentGroupId" :groupId="groupId" :keyWord="userKeyword" @updateTotal="val => total = val"/>
        <!-- 处置单位列表 -->
        <!-- <org-table ref="orgTableRef" v-if="activeName==='org'&&strategyInfoId" :isEventFinished="eventIsFinished" :strategyInfoId="strategyInfoId" :parentGroupId="parentGroupId" :groupId="groupId" @updateTotal="val => total = val"/> -->
      </hl-group>
    </hl-group>
  </hl-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, PropType, nextTick, computed, watch } from 'vue';
import { HlMessage, HlMessageBox, HlTree } from 'hongluan-ui';
import { GlobalAPI } from '@/common';
import { useMeeting, useCurrentEvent, useTextOverflow } from '@/hooks';
import { IpostFindEventResponseByIdSpace } from '@/apis/modules/event-response/model';
import { apiCommandCenterObj } from '@/apis/modules/command-center';
import UserTable from './user-table.vue';
import OrgTable from './org-table.vue';
import type { IpostFindStrategyCommandGroupTreeSpace } from '@/apis/modules/command-center/model';

const { HIDE_TOOLS } = GlobalAPI.config;

const props = defineProps({
  info: Object as PropType<IpostFindEventResponseByIdSpace.Data>,
  activeTab: {
    type: String,
    default: 'user',
  }
});
const emit = defineEmits(['cancel']);

const { showMeetingDlg } = useMeeting();
const { eventIsFinished } = useCurrentEvent();
const { showTooltip } = useTextOverflow();

const total = ref(0);
const orgTreeProps = ref({
  children: 'children',
  label: 'groupName',
});
const orgTree = ref<IpostFindStrategyCommandGroupTreeSpace.Data[]>([]);
const selectTreeNode = ref({
  parentGroupId: '',
  groupName: '',
  groupDesc: ''
});
const groupId = ref<string>('');
const parentGroupId = ref<string>('');

const orgTreeRef = ref<InstanceType<typeof HlTree>>();
const activeName = ref('user');
const userTableRef = ref();
const orgTableRef = ref();
const keyWord = ref('');
const userKeyword = ref('');
const strategyInfoId = computed(() => props.info?.strategyInfoId);

const getOrg = async() => {
  const res = await apiCommandCenterObj.postFindStrategyCommandGroupTree({ strategyInfoId: strategyInfoId.value, });
  orgTree.value = res.data;
  const item = res.data[0];
  if (item && item.id) {
    await nextTick();
    orgTreeRef.value?.setCurrentKey(item.id);
    handleNodeClick({ ...item, level: 0, parent: item });
  }
};

const handleNodeClick = (node: any) => {
  selectTreeNode.value = node;
  groupId.value = node.groupId;
  parentGroupId.value = node.parentGroupId;
};

const handleClickAdd = () => {
  if (activeName.value === 'user') {
    userTableRef.value?.handleAdd();
  } else if (activeName.value === 'org') {
    orgTableRef.value?.handleAdd();
  }
};
const handleClickBatchDelete = () => {
  if (activeName.value === 'user') {
    userTableRef.value?.handleBatchDelete();
  } else if (activeName.value === 'org') {
    orgTableRef.value?.handleBatchDelete();
  }
};
const handleClickBatchMeeting = () => {
  if (activeName.value === 'user') {
    userTableRef.value?.handleBatchMeeting();
  } else if (activeName.value === 'org') {
    orgTableRef.value?.handleBatchMeeting();
  }
};

const getSearchTag = (val: string) => {
  userKeyword.value = val;
};

watch(strategyInfoId, val => {
  if (val) {
    getOrg();
  }
}, { immediate: true });

onMounted(() => {
  activeName.value = props.activeTab;
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
.execute-org-user-dlg{
  .panel-body{
    flex: 1;
    overflow: hidden;
  }
}
</style>
