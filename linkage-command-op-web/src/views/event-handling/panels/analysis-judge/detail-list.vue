<template>
  <div class="detail-list h-full display-flex flex-col">
    <div class="search-wrapper m-b-sm">
      <hl-input v-model="keyword" placeholder="请输入" clearable>
        <template #prefix>
          <hl-icon><two-search /></hl-icon>
        </template>
      </hl-input>
      <hl-group class="area-filter">
        <area-cascader
          :model-data="areaCode"
          @change="onAreaCascaderChange"
        />
      </hl-group>
      <div class="search-btn" @click="updateData">筛选</div>
    </div>
    <div class="total-count m-b-sm">
      <h4>资源总数</h4>
      <span class="big-num" @click="expandable = true">{{ total }}</span>
    </div>
    <div class="list-header m-b-xxs">
      <span><hl-checkbox class="m-r-sm" v-model="checkAll" @change="selectAllItems" />全选</span>
      <button-group
        v-if="!eventIsFinished"
        :buttons="[{label: '调度任务', value: 1, disabled: selectedItemKeys.size <= 0}]"
        :active="1"
        :hide-single="false"
        @click="scheduleTask"
      />
    </div>
    <hl-scrollbar ref="scrollbarRef" class="self-grow">
      <hl-tree
        ref="treeRef"
        class="resource-tree"
        node-key="id"
        :props="treeProps"
        :data="treeData"
        :default-expanded-keys="defaultExpandedKeys"
        :load="lazyLoadTreeData"
        lazy
      >
        <template #default="{ node, data }">
          <hl-checkbox v-model="data.checked" @click.stop @change="checked => selectResources(data, node, checked)">{{ '' }}</hl-checkbox>
          <hl-group
            v-if="node.level <=2"
            full
            class="w-full overflow-hidden font-16 items-middle items-between"
            :class="`sum-${node.level}-${data.sum}`"
            gap="var(--xs)"
          >
            <div class="text-ellipsis">{{ node.label }}</div>
            <div class="static text-right m-r-md"><span class="num">{{ data.sum }}</span></div>
          </hl-group>
          <div v-else class="list-item">
            <div class="info">
              <span class="txt" @click="setMapCenter(data)">
                <span
                  style="max-width: 10em"
                  class="font-h5 font-semibold text-ellipsis"
                  @mouseover="showTooltip"
                >
                  {{ data.resName }}
                </span>
                <span
                  style="max-width: 10em"
                  class="text-ellipsis"
                  @mouseover="showTooltip"
                >
                  <span class="dist">
                    距离事发地&nbsp;
                    <span class="num">{{ data.dist ? (+data.dist / 1000).toFixed(2) : '--' }}</span>
                    &nbsp;km
                  </span>
                </span>
              </span>
            </div>
            <div class="address" @click="setMapCenter(data)">
              <hl-icon class="m-r-xs"><fill-map /></hl-icon>
              <span
                style="max-width: 20em"
                class="text-ellipsis"
                @mouseover="showTooltip"
              >
                {{ data.address }}
              </span>
            </div>
          </div>
        </template>
      </hl-tree>
    </hl-scrollbar>
    <schedule-dlg
      v-if="showScheduleDlg"
      :resources="selectedItems"
      @cancel="showScheduleDlg=false"
      @ok="showScheduleDlg=false;selectedItemKeys.length = 0"
    />
  </div>
</template>
<script lang="ts" setup>
import { inject, onMounted, reactive, ref, watch } from 'vue';
import { cloneDeep, groupBy } from 'lodash-es';
import { ExpandableCardParamsKey, GlobalAPI, ResourceIconSize } from '@/common';
import { ButtonGroup, AreaCascader, AreaChangeEvent } from '@/components';
import { ResourceTree, BasicResourceItem, ExpandableCardParams } from '@/types';
import { useCurrentArea, useResourceData, useMap, useMapBuffer, useMapLayer, useCurrentEvent, useDataRefresher, useAreaList, useTextOverflow } from '@/hooks';
import { apiDataResourceObj } from '@/apis/modules/data-resource';
import { IpostStatEventSurroundingRiskSpace } from '@/apis/modules/data-resource/model';
import { apiUserCenterObj } from '@/apis/modules/user-center';
import { IpostAreaTreeAreaSpace } from '@/apis/modules/user-center/model';
import NoDataImg from '@/assets/images/empty/no-data.png';
import ScheduleDlg from './schedule-dlg.vue';

const { right1: expandable } = inject<ExpandableCardParams>(ExpandableCardParamsKey)!;

const { areaCode, getAreaValue } = useAreaList();
const { setCenter } = useMap();
const { tempResourceItemMarkerKey, updateMarker } = useMapLayer();
const { queryParams } = useMapBuffer();
const { showTooltip } = useTextOverflow();
const { ALL_RESOURCES_TREE_NEW, getResourceInfo } = useResourceData();

const scrollbarRef = ref();
const keyword = ref('');
const total = ref(0);
const checkAll = ref(false);
const selectedItemKeys = ref<Set<string>>(new Set());
const selectedItems = ref<Record<string, any>[]>([]);
const showScheduleDlg = ref(false);

const defaultExpandedKeys = ref<string[]>([]);
const treeRef = ref();
const treeProps = {
  label: 'label',
  children: 'children',
  isLeaf: 'isLeaf'
};
const treeData = ref<ResourceTree[]>([]);
const pagination = reactive({
  currentPage: 1,
  pageSize: -1
});

const selectAllItems = (val: boolean) => {
  treeData.value.forEach(t => {
    selectResources(t, { level: 1, data: {} as ResourceTree, parent: null }, val);
  });
};
const selectResources = async(data: ResourceTree, node: TreeNode, isChecked: boolean) => {
  if (node.level === 3) { // 叶子层
    isChecked ? selectedItemKeys.value.add(data.id) : selectedItemKeys.value.delete(data.id);
  } else if (node.level === 2) { // 资源类别层
    if (isChecked && !data.children) { // 还没有加载数据
      const resourceType = data.value;
      const apiMethod = node.parent!.data.value;
      const items = await loadResourceData(apiMethod, [resourceType]);
      data.children = items;
    }
    data.children?.forEach(c => {
      isChecked ? selectedItemKeys.value.add(c.id) : selectedItemKeys.value.delete(c.id);
      c.checked = isChecked;
    });
  } else if (node.level === 1) { // 大类层
    const waitingLoadTypes: string[] = [];
    const waitingIds: string[] = [];
    data.children.forEach(async c => { // 遍历资源类别层
      c.checked = isChecked;
      if (!c.children) { // 如果资源类别没有数据，收集资源类别
        waitingLoadTypes.push(c.value);
      } else if (Array.isArray(c.children)) { // 如果有数据，收集资源id
        c.children.forEach(r => {
          r.checked = isChecked;
          waitingIds.push(r.id);
        });
      }
    });
    if (isChecked) { // 如果是选中大类
      if (waitingLoadTypes.length) { // 看是否需要加载资源类别数据，这里一次性加载多个类别数据，减少加载次数
        const items = await loadResourceData(data.value, waitingLoadTypes);
        const groupResults = groupBy(items, 'resourceType');
        data.children.forEach(t => { // 再次遍历资源类别，赋值
          t.children = t.children || groupResults[t.value];
        });
        items.forEach((item: BasicResourceItem) => {
          item.checked = isChecked;
          waitingIds.push(item.id);
        });
      }
      waitingIds.forEach(id => selectedItemKeys.value.add(id));
    } else {
      waitingIds.forEach(id => selectedItemKeys.value.delete(id));
    }
  }
  data.checked = isChecked;

  let curNode = node;
  while (curNode.parent) {
    curNode.parent.data.checked = (curNode.parent.data.children ?? curNode.parent.data).every(c => c.checked);
    curNode = curNode.parent;
  }

  console.log('selectResources', isChecked, node.level, selectedItemKeys.value);
};

const lazyLoadTreeData = async(node: TreeNode, resolve: (args: Record<string, any>[]) => void) => {
  if (node.level > 0) {
    if (!node.data.children.length) {
      const resourceType = node.data.value;
      const apiMethod = node.parent!.data.value;
      if (apiMethod) {
        const data = await loadResourceData(apiMethod, [resourceType]);
        node.data.children = data;
        resolve(data);
      } else {
        resolve([]);
      }
    } else if (Array.isArray(node.data.children)) {
      resolve(node.data.children);
    }
  }
};

const loadResourceData = async(apiMethod: string, resourceTypes: string[]) => {
  if (apiMethod) {
    const result = await (apiDataResourceObj as Record<string, any>)[apiMethod]({
      ...pagination,
      ...queryParams.value,
      areaCode: getAreaValue(),
      keyWord: keyword.value,
      resourceType: resourceTypes,
      strategyId: currentEvent.strategyInfoId
    });
    result.data.forEach((d: Record<string, any>) => (d.isLeaf = true));
    return result.data;
  }
};

const loadData = async() => {
  selectedItemKeys.value = new Set();
  defaultExpandedKeys.value = [];

  const result = await apiDataResourceObj.postStatEventSurroundingItems({
    ...queryParams.value,
    areaCode: getAreaValue(),
    keyWord: keyword.value,
    strategyId: currentEvent.strategyInfoId
  });

  const tree = cloneDeep(ALL_RESOURCES_TREE_NEW.value);
  tree.forEach(t => {
    for (let i = t.children.length - 1; i >= 0; i--) {
      const child = result.data.find(r => r.resoureType === t.children[i].value);
      if (child) {
        t.children[i].sum = `${child.sum}`;
      } else {
        t.children.splice(i, 1);
      }
    }
    t.sum = '' + t.children.reduce((prev, cur) => prev + Number(cur.sum), 0);
    defaultExpandedKeys.value.push(t.id);
  });

  treeData.value = tree;
  total.value = tree.reduce((prev, cur) => prev + Number(cur.sum), 0);

  return tree;
};

const updateData = async() => {
  const result = await apiDataResourceObj.postStatEventSurroundingItems({
    ...queryParams.value,
    areaCode: getAreaValue(),
    keyWord: keyword.value,
    strategyId: currentEvent.strategyInfoId
  });
  treeData.value.forEach(t => { // 更新数量
    for (let i = t.children.length - 1; i >= 0; i--) {
      const child = result.data.find(r => r.resoureType === t.children[i].value);
      if (child) {
        t.children[i].sum = `${child.sum}`;
      } else {
        t.children.splice(i, 1);
      }
    }
    t.sum = '' + t.children.reduce((prev, cur) => prev + Number(cur.sum), 0);
  });
  total.value = treeData.value.reduce((prev, cur) => prev + Number(cur.sum), 0);

  const existedIds: string[] = [];
  treeData.value.forEach(async level1 => { // 遍历大类
    const waitingLoadTypes: string[] = [];
    level1.children.forEach(level2 => { // 遍历资源类别
      if (level2.children) { // 如果资源类别有数据，收集资源类别
        waitingLoadTypes.push(level2.value);
      }
    });
    if (waitingLoadTypes.length) {
      const items = await loadResourceData(level1.value, waitingLoadTypes);
      const groupResults = groupBy(items, 'resourceType');
      level1.children.forEach(level2 => { // 刷新资源类别数据
        if (waitingLoadTypes.includes(level2.value)) {
          const checkedMap = level2.children!.reduce((prev, cur) => {
            prev[cur.id] = cur.checked!;
            return prev;
          }, {} as Record<string, boolean>);
          const newChildren = groupResults[level2.value] || [];
          newChildren.forEach(c => (c.checked = checkedMap[c.id] ?? false));
          treeRef.value.updateKeyChildren(level2.id, newChildren);

          level2.checked = level2.children!.every(c => c.checked);
        }
      });
      existedIds.push(...items.map((i: { id: string }) => i.id));
      level1.checked = level1.children.every(c => c.checked);
    }
  });

  selectedItemKeys.value = new Set(Array.from(selectedItemKeys.value).filter(i => existedIds.includes(i)));
};

const setMapCenter = (item: BasicResourceItem) => {
  setCenter([+item.longitude, +item.latitude]);
  updateMarker(tempResourceItemMarkerKey, [
    {
      coordinates: [+item.longitude, +item.latitude],
      iconUrl: GlobalAPI.config.MAP_IMAGES_URL + 'normal/' + getResourceInfo(item.resourceType!, 'code') + '.svg',
      iconSize: ResourceIconSize,
      properties: {
        ...item
      }
    }
  ]);
};

const scheduleTask = () => {
  selectedItems.value = [];
  treeData.value.forEach(level1 => {
    level1.children.forEach(level2 => {
      level2.children?.forEach(level3 => {
        if (selectedItemKeys.value.has(level3.id)) {
          selectedItems.value.push(level3);
        }
      });
    });
  });
  showScheduleDlg.value = true;
};

const onAreaCascaderChange = (data: AreaChangeEvent) => {
  areaCode.value = data.id || '';
};

watch(queryParams, () => {
  treeData.value.length && updateData();
});

watch(() => selectedItemKeys.value.size, len => {
  checkAll.value = len === total.value;
});

watch(expandable, () => {
  scrollbarRef.value.update();
}, {
  flush: 'post'
});

const { eventIsFinished, currentEvent } = useCurrentEvent(() => {
  treeData.value.length ? updateData() : loadData();
});
useDataRefresher(() => {
  treeData.value.length && updateData();
});

type TreeNode = {
  level: number;
  data: ResourceTree;
  parent: TreeNode | null
}
</script>
<style lang="scss" scoped>
.detail-list {
  --search-height: calc(var(--xxs) * 8);
  .search-wrapper {
    display: flex;
    align-items: center;
    column-gap: var(--md);
    :deep(.hl-input) {
      flex: 1;
      --input-height: var(--search-height);
    }
    .area-filter {
      width: calc(var(--xxs) * 31);
    }
    .search-btn {
      cursor: pointer;
      width: calc(var(--xxs) * 18);
      height: var(--search-height);
      background-image: url('@/assets/images/event-handling/right-1/btn-bg.png');
      background-size: 100%;
      background-repeat: no-repeat;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .total-count {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: calc(var(--xxs) * 4);
    padding-right: calc(var(--xxs) * 10.25);
    height: calc(var(--xxs) * 14);
    background-image: url('@/assets/images/overview/left-3/background.png');
    background-size: cover;
    background-repeat: no-repeat;
    cursor: pointer;
  }
  .list-header {
    height: calc(var(--xxs) * 11);
    background-image: url('@/assets/images/event-handling/right-1/list-header-bg.png');
    background-size: 100%;
    background-repeat: no-repeat;
    padding: calc(var(--xxs) * 3.5) var(--md);
    padding-left: calc(var(--xxs) * 11);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  :deep(.resource-tree) {
    --tree-height: calc(var(--xxs) * 11);
    --tree-bg-color: transparent;
    --tree-child-bg-color: transparent;
    .tree-node-content {
      background-image: url('@/assets/images/event-handling/right-1/list-item-bg.png');
      background-size: 100%;
      background-repeat: no-repeat;
    }
    .num {
      color: #FFEA44;
    }
    .tree-node-content:has(.sum-2-0) {
      .tree-node-arrow {
        color: transparent;
      }
      .hl-checkbox {
        visibility: hidden;
        .hl-icon {
           visibility: hidden !important;
        }
      }
    }
    .tree-node > .tree-node-children > .tree-node > .tree-node-children .tree-node-content {
      height: calc(var(--xxs) * 20);
      align-items: start;
      padding-top: calc(var(--xxs) * 4);
    }
  }
  .list-item {
    padding-right: calc(var(--xxs) * 4);
    width: 100%;
    .info {
      margin-bottom: calc(var(--xxs) * 1.5);
      display: flex;
      column-gap: calc(var(--xxs) * 3);
      .txt {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        column-gap: calc(var(--xxs) * 3);
        cursor: pointer;
        .dist {
          color: #B5CEE3;
          .num {
            font-weight: 500;
            color: #FFEA44;
          }
        }
      }
    }
    .address {
      cursor: pointer;
      display: flex;
      align-items: center;
    }
  }
}
</style>
