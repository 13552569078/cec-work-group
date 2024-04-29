<template>
  <hl-dialog
    :title="title"
    :model-value="true"
    class="org-user-selector-dlg"
    :class="{'hide-footer': !showActions}"
    width="calc(var(--xxl) * 35)"
    height="calc(var(--xxs) * 200)"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :append-to-body="true"
    @close="$emit('cancel')"
  >
    <slot name="top"></slot>
    <hl-row class="content">
      <hl-col v-if="!isExpert" span="col-6" class="h-full p-x-md left-part">
        <hl-group class="static h-full w-full " dir="vertical" align="items-top">
          <hl-tabs
            v-if="treeTab.length && !forceHideTreeTab"
            v-model="activeTree"
            type="line"
            nav-height="calc(var(--xxs) * 14)"
            style="
              --tabs-font-color: var(--text-secondary);
              --tabs-bar-color: var(--text-hover);
              --tabs-border-color: #0c3864;
              --tabs-font-size: var(--font-lg);
            "
            class="m-b-sm tab-box"
            @tab-change="tabTreeChange"
          >
            <hl-tab-pane
              v-for="tab in treeTab"
              :key="tab.code"
              :label="tab.label"
              :name="tab.code"
            ></hl-tab-pane>
          </hl-tabs>
          <hl-input
            v-model="keyWord"
            :placeholder="`请输入${activeTreeName}名称`"
            class="m-b-sm"
            :class="treeTab.length && !forceHideTreeTab ? '': 'm-t-sm'"
            block
            clearable
          >
            <template #prefix>
              <hl-icon>
                <two-search />
              </hl-icon>
            </template>
          </hl-input>
          <hl-scrollbar class="w-full h-full">
            <hl-tree
              :data="treeData"
              :props="defaultTreeProps"
              :default-expanded-keys="defaultExpandedKeys"
              @node-click="treeNodeClick"
              node-key="id"
              ref="treeRef"
              highlight-current
              :expand-on-click-node="false"
              :current-node-key="currentNodeKey"
              gap="0"
              class="w-full"
              :filter-node-method="filterTreeNode"
            >
              <template #default="{ node }">
                <span class="text-ellipsis" @mouseover="showTooltip">{{ node.label }}</span>
              </template>
            </hl-tree>
          </hl-scrollbar>
        </hl-group>
      </hl-col>
      <hl-col :span="isExpert ? 'col-24' : 'col-18'" class="h-full p-l-md right-part">
        <hl-group v-if="!hideWaitingItemsTab" class="w-full top-part" align="items-between" gap="var(--xxl)">
          <hl-tabs
            v-model="activeWaitingItemsTab"
            type="line"
            nav-height="calc(var(--xxs) * 14)"
            style="
            --tabs-font-color: var(--text-secondary);
            --tabs-bar-color: var(--text-hover);
            --tabs-border-color: #0c3864;
            --tabs-font-size: var(--font-lg);
          "
            class="right-tab-box"
            @tab-change="tabWaitingChange"
          >
            <hl-tab-pane v-if="showUserTab" label="选择人员" name="user"></hl-tab-pane>
            <hl-tab-pane
              v-if="activeTree === 'organization' && showOrganizationOrgTab"
              label="选择单位"
              name="org"
            ></hl-tab-pane>
            <hl-tab-pane
              v-if="activeTree === 'commandSystem' && showCommandSystemOrgTab"
              label="选择机构"
              name="org"
            ></hl-tab-pane>
            <hl-tab-pane
              v-if="activeTree === 'commandSystem' && showGroupTab"
              label="选择分组"
              name="group"
            ></hl-tab-pane>
          </hl-tabs>
          <hl-input clearable v-model="filterName" :placeholder="`请输入${waitingItemsTabName}名称`" @input="filterNameChange" class="m-t-md" size="sm">
            <template #prefix>
              <hl-icon>
                <two-search />
              </hl-icon>
            </template>
          </hl-input>
        </hl-group>
        <hl-row class="bottom-part h-full" gap="var(--xl)">
          <hl-col :span="`col-${itemsSectionWidth[0]}`" class="h-full p-y-md left-list-wrap" >
            <template v-if="showAs === 'card'">
              <title-line :title="'所有' + waitingItemsTabName" style="width: 70%" />
              <hl-group
                align="items-center items-middle"
                class="w-full m-t-xs left-list-box content-height"
              >
                <hl-spinner v-if="isLoading" size="xxxl" color="#36A4FF" />
                <hl-group v-else class="w-full h-full">
                  <hb-empty v-if="personList.length === 0" description="暂无数据" class="w-full h-70" :image="NoDataImg" />
                  <waiting-item-cards
                    v-else
                    :data="personList"
                    :type="activeWaitingItemsTab"
                    @change="selectCardChange"
                  />
                </hl-group>
              </hl-group>
            </template>
            <template v-if="showAs === 'table'">
              <div class="display-flex flex-col h-full w-full" v-load="isLoading">
                <hl-group full class="items-between items-middle font-16 query-result">
                  <div class="display-flex items-middle">
                    <hl-icon class="m-r-xs"><fill-search /></hl-icon> 查询结果<span class="color-light m-x-xxs">{{ personList.length }}</span>条数据
                  </div>
                  <hl-input clearable v-model="filterName" :placeholder="`请输入${waitingItemsTabName}名称`" @input="filterNameChange" size="sm">
                    <template #prefix>
                      <hl-icon>
                        <two-search />
                      </hl-icon>
                    </template>
                  </hl-input>
                </hl-group>
                <waiting-item-table
                  class="self-grow"
                  :loading="isLoading"
                  :data="personList"
                  :is-expert="isExpert"
                  :type="activeWaitingItemsTab"
                  @change="selectCardChange"
                />
              </div>
            </template>
          </hl-col>
          <hl-col :span="`col-${itemsSectionWidth[1]}`" class="h-full p-y-md right-list-wrap">
            <slot name="selectedItems">
              <hl-group class="w-full" align="items-between items-middle">
                <title-line :title="`已选择项(${selectedItemsCount})` " style="width: 70%" />
              </hl-group>
              <hl-group class="w-full m-t-xs right-list-box content-height" wrap>
                <hl-group class="w-full h-full">
                  <hb-empty v-if="!selectedItemsCount" description="暂无数据" class="w-full h-70" :image="NoDataImg" />
                  <template v-else>
                    <selected-item-cards :data="selected.user" type="user" @delete="delSelectedItem"/>
                    <selected-item-cards :data="selected.org" type="org" @delete="delSelectedItem"/>
                    <selected-item-cards :data="selected.group" type="group" @delete="delSelectedItem"/>
                  </template>
                </hl-group>
              </hl-group>
            </slot>
          </hl-col>
        </hl-row>
      </hl-col>
    </hl-row>
    <template v-if="showActions" #footer>
      <span class="dialog-footer">
        <hl-button @click="$emit('cancel')"  class="p-x-lg">取消</hl-button>
        <hl-button type="primary" class="m-l-md p-x-lg" @click="submit">确定</hl-button>
      </span>
    </template>
  </hl-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { HlMessage, HlMessageBox, vLoading } from 'hongluan-ui';
import { useCurrentEvent, useTextOverflow, useCurrentArea } from '@/hooks';
import { apiAddExecutorObj } from '@/apis/modules/add-executor';
import { apiUserCenterObj } from '@/apis/modules/user-center';
import NoDataImg from '@/assets/images/empty/no-data.png';
import TitleLine from './title-line.vue';
import WaitingItemCards from './waiting-item-cards.vue';
import WaitingItemTable from './waiting-item-table.vue';
import SelectedItemCards from './selected-item-cards.vue';

import type { PropType } from 'vue';
import type { OrgUserItem, TagKeys, IdKeys } from './types';

const props = defineProps({
  title: {
    type: String,
    default: '添加人员'
  },
  showCommandSystem: {
    type: Boolean,
    default: true,
  },
  showOrganization: {
    type: Boolean,
    default: true,
  },
  selected: {
    type: Array as PropType<Array<OrgUserItem>>,
    default: () => []
  },
  disabled: {
    // 禁止选择
    type: Array as PropType<Array<OrgUserItem>>,
    default: () => []
  },
  defaultTree: {
    type: String, // 'organization' | 'commandSystem'
    default: 'organization'
  },
  forceHideTreeTab: Boolean,
  isRequired: {
    type: Boolean,
    default: false,
  },
  showUserTab: {
    type: Boolean,
    default: true
  },
  showOrgTab: {
    type: [Boolean, Object] as PropType<boolean | { showOrganizationOrgTab: boolean; showCommandSystemOrgTab: boolean; }>,
    default: true
  },
  showGroupTab: {
    type: Boolean,
    default: true
  },
  showAs: {
    type: String as PropType<'card' | 'table'>,
    default: 'card'
  },
  showActions: {
    type: Boolean,
    default: true
  },
  emptyTip: {
    type: String,
    default: '请先选择执行人',
  },
  itemsSectionWidth: {
    type: Array,
    default: () => [12, 12]
  },
  eventId: String,
  isExpert: Boolean
});
const emit = defineEmits(['cancel', 'submit']);

const { currentEvent } = useCurrentEvent();
const { showTooltip } = useTextOverflow();
const { areaCode } = useCurrentArea();

const treeTab = ref<Record<string, any>[]>([]);
const activeTree = ref(props.showCommandSystem ? 'commandSystem' : props.defaultTree);
const treeRef = ref();
const treeData = ref<OrgUserItem[]>([]);
const defaultTreeProps = ref({
  children: 'children',
  label: 'orgName',
});
const defaultExpandedKeys = ref<string[]>([]);
const currentNodeKey = ref();
const activeWaitingItemsTab = ref(props.showUserTab ? 'user' : 'org');
const filterName = ref('');
const personList = ref<OrgUserItem[]>([]); // 右边人员列表
const isLoading = ref(false);
const keyWord = ref('');

const currentTreeNode = ref({} as OrgUserItem);
const selected = ref<Record<string, OrgUserItem[]>>({ org: [], group: [], user: [] });
const disabled = ref<Record<string, OrgUserItem[]>>({ org: [], group: [], user: [] });

const activeTreeName = computed(() => treeTab.value.filter(el => el.code === activeTree.value)[0].label);
const waitingItemsTabName = computed(() => activeWaitingItemsTab.value === 'user' ? '人员' : activeWaitingItemsTab.value === 'org' ? '机构' : '分组');
const showOrganizationOrgTab = computed(() => typeof props.showOrgTab === 'boolean' ? props.showOrgTab : props.showOrgTab.showOrganizationOrgTab);
const showCommandSystemOrgTab = computed(() => typeof props.showOrgTab === 'boolean' ? props.showOrgTab : props.showOrgTab.showCommandSystemOrgTab);
const hideWaitingItemsTab = computed(() => props.showAs === 'table' &&
  ((props.showOrganization && Number(props.showUserTab) + Number(showOrganizationOrgTab.value) <= 1) ||
  (props.showCommandSystem && Number(props.showUserTab) + Number(props.showGroupTab) + Number(showCommandSystemOrgTab.value) <= 1))
);
const selectedItemsCount = computed(() => selected.value.user.length + selected.value.org.length + selected.value.group.length);
const autoSubmit = computed(() => !props.showActions);
const eventId = computed(() => props.eventId || currentEvent.id);

// 唯一标识映射
const keyMap: Record<string, string> = {
  'user': 'userId',
  'org': 'orgId',
  'group': 'groupId',
};

const getTreeData = async() => {
  treeData.value = [];
  defaultTreeProps.value.label = activeTree.value === 'organization' ? 'orgName' : 'groupName';

  const { data: tree } = activeTree.value === 'organization'
    ? await apiUserCenterObj.getFindOrgTree()
    : await apiAddExecutorObj.postFindStrategyCommandGroupTree({ eventId: eventId.value });
  if (tree.length) {
    defaultExpandedKeys.value = [tree[0].id + ''];
    currentNodeKey.value = tree[0].id + '';
    treeData.value = tree as OrgUserItem[];
    currentTreeNode.value = treeData.value[0];
    await getWaitingList(currentTreeNode.value);
  } else {
    personList.value = [];
    currentNodeKey.value = '';
  }
};
const getWaitingList = async(node: OrgUserItem) => {
  personList.value = [];
  isLoading.value = true;
  if (activeWaitingItemsTab.value === 'user') {
    await getUser(node);
  } else if (activeWaitingItemsTab.value === 'org') {
    await getOrg(node);
  } else if (activeWaitingItemsTab.value === 'group') {
    await getGroup(node);
  }
};
// 专家表头展开
const formatExpertData = (data: any[]) => {
  return data.map(el => {
    el?.attrs.forEach((item: any) => {
      el[item.code] = item.valueName || item.value || '--';
    });
    return el;
  });
};
const getUser = async(node: OrgUserItem) => {
  const res: Record<string, any> =
    props.isExpert
      ? await apiUserCenterObj.postfindResourceMainPage({
        currentPage: 1,
        pageSize: -1,
        typeCode: 'resource_expert',
        administrative: areaCode.value
      }) :
      activeTree.value === 'organization'
        ? await apiUserCenterObj.getFindUserListByOrgId(node.id || currentTreeNode.value.id as string)
        : await apiAddExecutorObj.postFindStrategyCommandUserPage({
          currentPage: 1,
          pageSize: -1,
          groupId: node.groupId || currentTreeNode.value?.groupId,
          strategyInfoId: node.strategyInfoId || currentTreeNode.value?.strategyInfoId,
          keyWord: filterName.value,
        });
  let result = [] as OrgUserItem[];
  if (props.isExpert) {
    res.data.list = formatExpertData(res.data.list).map((r: any) => ({
      ...r,
      userName: r.name,
      orgName: r.unit_name,
      mobile: r.telephone,
      expertId: r.id,
      memberType: 1 // 是否是专家
    }));
    result = res.data.list.filter((r: any) => r.userName.indexOf(filterName.value) > -1);
  } else {
    if (activeTree.value === 'organization') {
      result = res.data.filter((r: any) => r.userName.indexOf(filterName.value) > -1);
    } else {
      result = res.data.list.filter((r: any) => r.userName.indexOf(filterName.value) > -1);
    }
  }

  setWaitingItems(result);
};
const getOrg = async(node: OrgUserItem) => {
  if (activeTree.value === 'commandSystem') {
    const res = await apiAddExecutorObj.postFindStrategyCommandOrgPage({
      currentPage: 1,
      pageSize: -1,
      groupId: node.groupId || currentTreeNode.value?.groupId,
      strategyInfoId: node.strategyInfoId || currentTreeNode.value?.strategyInfoId,
      keyWord: filterName.value,
    });
    setWaitingItems(res.data.list as unknown as OrgUserItem[]);
  } else {
    setWaitingItems(node.children.map(c => ({
      id: c.id,
      orgId: c.id,
      orgName: c.orgName
    })) as unknown as OrgUserItem[]);
  }
};
const getGroup = async(node: OrgUserItem) => {
  const res = await apiAddExecutorObj.postFindByGroupId(
    `${eventId.value}`,
    `${node.groupId}` || `${currentTreeNode.value?.groupId}`,
    `${node.strategyInfoId}` || `${currentTreeNode.value?.strategyInfoId}`,
    filterName.value,
  );
  setWaitingItems(res.data);
};
const setWaitingItems = (result: OrgUserItem[]) => {
  // 判断是否有已选择或禁选
  result?.forEach(el => {
    el.active = false;
    el.disable = false;
    selected.value[activeWaitingItemsTab.value].forEach(it => {
      const key = keyMap[activeWaitingItemsTab.value];
      if (it[key] === el[key] || it.id === el[key] || it.userId === el[key]) {
        el.active = true;
      }
    });
    disabled.value[activeWaitingItemsTab.value].forEach(it => {
      const key = keyMap[activeWaitingItemsTab.value];
      if (it[key] === el[key] || it.id === el[key] || it.userId === el[key]) {
        el.disable = true;
      }
    });
  });
  personList.value = result;
  isLoading.value = false;
};

const tabTreeChange = async(val: string) => {
  keyWord.value = '';
  filterName.value = '';
  currentTreeNode.value = {} as OrgUserItem;
  activeWaitingItemsTab.value = 'user';
  activeTree.value = val;
  await getTreeData();
};
const tabWaitingChange = async(val: string) => {
  filterName.value = '';
  activeWaitingItemsTab.value = val;
  treeData.value.length && (await getWaitingList(currentTreeNode.value));
};

const treeNodeClick = async(n: OrgUserItem) => {
  currentTreeNode.value = n;
  await getWaitingList(n);
};
const filterTreeNode = (value: string, d: Record<string, any>) => {
  if (!value) return true;
  return d[defaultTreeProps.value.label].indexOf(value) !== -1;
};

const filterNameChange = async() => {
  await getWaitingList(currentTreeNode.value);
};
const selectCardChange = (item: OrgUserItem, index: number) => {
  if (!item.active) {
    if (activeWaitingItemsTab.value === 'user') {
      // 人员用移动电话校验是否重复; 如果添加了机构执行人，则不允许再添加该机构中的人员未普通执行人，需要在添加执行人的时候进行校验并提示用户
      const selectedMobiles = selected.value.user.map(el => el.mobile);
      selectedMobiles.includes(item.mobile) && item.mobile !== ''
        ? HlMessage.warning({ message: '该人员已添加！' })
        : setSelectedItems(item, index);
    } else if (activeWaitingItemsTab.value === 'org') {
      // 用机构名称校验是否重复;如果添加了机构执行人，则不允许再添加该机构中的人员未普通执行人，需要在添加执行人的时候进行校验并提示用户
      const selectedOrgNames = selected.value.org.map(el => el.orgName);
      selectedOrgNames.includes(item.orgName)
        ? HlMessage.warning({ message: '该机构已添加！' })
        : setSelectedItems(item, index);
    } else if (activeWaitingItemsTab.value === 'group') {
      // 用分组名称验是否重复
      const selectedGroupNames = selected.value.group.map(el => el.groupName);
      selectedGroupNames.includes(item.orgName)
        ? HlMessage.warning({ message: '该分组已添加！' })
        : setSelectedItems(item, index);
    }
  } else {
    delSelectedCard(activeWaitingItemsTab.value as TagKeys, item);
    personList.value[index].active = false;
  }

  if (autoSubmit.value) {
    submit();
  }
};
const setSelectedItems = (item: OrgUserItem, index: number) => {
  selected.value[activeWaitingItemsTab.value].push({
    type: activeWaitingItemsTab.value,
    treeType: activeTree.value,
    active: true,
    ...item,
    name: activeWaitingItemsTab.value === 'org'
      ? item.orgName
      : activeWaitingItemsTab.value === 'user'
        ? item.userName
        : item.groupName,
  });
  personList.value[index].active = true;
};
const delSelectedItem = (tag: OrgUserItem, type: TagKeys) => {
  _delSelectedItem(tag, type);

  if (autoSubmit.value) {
    submit();
  }
};
const _delSelectedItem = (tag: OrgUserItem, type: TagKeys = 'user') => {
  personList.value?.forEach(el => {
    const key = keyMap[type];
    if (el[key] === tag[key]) {
      el.active = false;
    }
  });
  delSelectedCard(type, tag);
};
const delSelectedCard = (type: TagKeys, tag: OrgUserItem) => {
  selected.value[type].splice(
    selected.value[type].findIndex(el => el.userId === tag.userId),
    1
  );
};
const submit = () => {
  // 区分组织机构人员/指挥体系人员/机构/分组
  if (props.isRequired && !selected.value.user.length && !selected.value.org.length && !selected.value.group.length) {
    HlMessage.warning({ message: props.emptyTip });
  } else {
    // 以下要区分是指挥体系还是用户中心的数据
    // 还有一种可能是用户初始传进来的数据但并没有标识是哪类，这种数据统一归类为other
    const organizationUsers = [] as OrgUserItem[];
    const commandSystemUsers = [] as OrgUserItem[];
    const otherUsers = [] as OrgUserItem[];
    selected.value.user.forEach(el => {
      el.tempUser = el?.temporaryPersonnel ? el?.temporaryPersonnel : 0;
      switch (el.treeType) {
        case 'organization':
          organizationUsers.push(el);
          break;
        case 'commandSystem':
          commandSystemUsers.push(el);
          break;
        default:
          otherUsers.push(el);
      }
    });

    const organizationOrgs = [] as OrgUserItem[];
    const commandSystemOrgs = [] as OrgUserItem[];
    const otherOrgs = [] as OrgUserItem[];
    selected.value.org.forEach(el => {
      switch (el.treeType) {
        case 'organization':
          organizationOrgs.push(el);
          break;
        case 'commandSystem':
          commandSystemOrgs.push(el);
          break;
        default:
          otherOrgs.push(el);
      }
    });
    emit('submit', {
      organization: {
        user: organizationUsers,
        org: organizationOrgs,
      },
      commandSystem: {
        user: commandSystemUsers,
        group: selected.value.group,
        org: commandSystemOrgs
      },
      other: {
        user: otherUsers,
        org: otherOrgs
      }
    });
  }
};

watch(keyWord, val => {
  treeRef.value.filter(val);
});

watch(() => props.disabled.length, len => {
  disabled.value.user.length = 0;
  disabled.value.org.length = 0;
  disabled.value.group.length = 0;
  if (len) {
    props.disabled.forEach(el => {
      el.type === 'user' && disabled.value.user.push(el);
      el.type === 'org' && disabled.value.org.push(el);
      el.type === 'group' && disabled.value.group.push(el);
    });
  }
});

onMounted(async() => {
  props.selected.forEach(el => {
    el.type === 'user' && selected.value.user.push(el);
    el.type === 'org' && selected.value.org.push(el);
    el.type === 'group' && selected.value.group.push(el);
  });
  // 禁止选择
  props.disabled.forEach(el => {
    el.type === 'user' && disabled.value.user.push(el);
    el.type === 'org' && disabled.value.org.push(el);
    el.type === 'group' && disabled.value.group.push(el);
  });

  if (props.showOrganization) {
    treeTab.value.push({
      label: '组织机构',
      code: 'organization',
    });
  }
  if (props.showCommandSystem) {
    treeTab.value.push({
      label: '指挥体系',
      code: 'commandSystem',
    });
  }

  await getTreeData();
});

defineExpose({
  delSelectedItem: _delSelectedItem
});
</script>

<style lang="scss" scoped>
.org-user-selector-dlg {
  .content {
    height: 100% !important;
    // height: calc(var(--xxs) * 120);
    box-sizing: border-box;
    .left-part {
      background-color: rgba(0, 158, 247, 0.10);
      box-sizing: border-box;
      max-width: 24%;
      margin-right: 1%;
    }
    .right-part {
      background-color: rgba(0, 158, 247, 0.10);
      .top-part {
        border-bottom: 1px solid #0E3D6C;
        padding-right: calc(var(--xxs) * 5);
      }
      .bottom-part {
        .content-height {
          height: calc(var(--xxs) * 130 - var(--top-height, 0px));
        }
        .left-list-wrap {
          border-right: 1px solid #0E3D6C;
          box-sizing: border-box;
          .left-list-box {
            .hl-group {
              border: none !important;
            }
          }
           .query-result {
            margin-bottom: var(--px20);
            column-gap: var(--xs);
            div {
              word-break: keep-all;
              flex-shrink: 0;
            }
          }
        }
        .right-list-wrap {
          padding-right: 0 !important;
          .right-list-box {
            .hl-group {
              border: none !important;
            }
          }
        }
      }
    }
  }
}
:deep(.hl-tree) {
  &.highlight-current .tree-node.is-current > .tree-node-content{
    background-color: transparent;
    background-image: url(@/assets/images/common/left-tree-selected.png);
    background-size: 100% 100%;
  }
}
</style>

<style lang="scss">
.org-user-selector-dlg.hl-panel {
  --panel-border-color: none;
  &.hide-footer {
    padding-bottom: calc(var(--xxs) * 5)
  }
  .panel-body {
    flex: 1;
    overflow: hidden;
    padding: calc(var(--xxs) * 5) calc(var(--xxs) * 5) 0;
    .tab-box {
      width: 100%;
      display: flex;
      justify-content: space-around;
      border-bottom: calc(var(--xxs) * 0.25) solid rgba(14, 61, 108, 1);
      .tabs-header {
        width: 100%;
        .tabs-nav {
          width: 100%;
          display: flex;
          justify-content: space-around;
          transform: translateX(var(--md))!important;
        }
      }
    }
  }
}
</style>
