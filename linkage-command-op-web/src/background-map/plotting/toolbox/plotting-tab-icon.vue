<template>
  <div class="plotting-tab-icon h-full">
    <hl-input v-model="filterText" class="filter-text" placeholder="输入关键字进行过滤" />
    <hl-scrollbar class="tree-list">
      <hl-tree
        ref="iconTree"
        class="mark-icon-tree"
        :data="treeData"
        :props="defaultProps"
        :default-expanded-keys="defaultExpandedItems"
        node-key="id"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
      >
        <template #default="{ node, data }">
          <hl-group full gap="var(--xs)" align="items-between">
            <hl-group align="items-middle" full>
              <img
                v-if="data.url && data.url.length > 0"
                :src="GlobalAPI.config.FILE_VIEW + data.url"
                class="image-icon"
                style="width: var(--md);height: var(--md);object-fit:contain; margin-right: var(--xxs);"
                alt=""
              >
              <span
                style="width: calc(var(--xxl) * 3);"
                class="font-md font-bold text-ellipsis"
                @mouseover="showTooltip"
              >{{ node.label }}</span>
            </hl-group>
            <hl-group gap="var(--md)" class="static" v-if="data.url && data.url.length > 0">
              <a @click="drawIcon(data)">绘制</a>
            </hl-group>
          </hl-group>
        </template>
      </hl-tree>
    </hl-scrollbar>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { apiPlotIconObj } from '@/apis/modules/plot-icon';
import { GlobalAPI } from '@/common';
import { useMapPlotting, useTextOverflow } from '@/hooks';
import { IpostTreePlottingSpace } from '@/apis/modules/plot-icon/model';

const route = useRoute();
const { canEdit, currentPlottingInfo } = useMapPlotting();
const { showTooltip } = useTextOverflow();

const defaultProps = {
  children: 'children',
  label: 'name',
};
const filterText = ref('');
const iconTree = ref();
const treeData = ref<IpostTreePlottingSpace.Data[]>([]);
const defaultExpandedItems = ref<string[]>([]);

const getIconTree = async() => {
  const expandedKeys: string[] = [];
  const res = await apiPlotIconObj.postTreePlotting(route.query.rootId as string);
  treeData.value = [res.data];
  expandedKeys.push(treeData.value[0].id);
  defaultExpandedItems.value = expandedKeys;
};

const drawIcon = (d: IpostTreePlottingSpace.Data) => {
  if (!canEdit.value) return;
  const result = {
    ...d,
    url: GlobalAPI.config.FILE_VIEW + d.url
  };
  currentPlottingInfo.drawShape = `draw_icon${JSON.stringify(result)}`;
  currentPlottingInfo.shapeCount++;
};

const filterNode = (value:string, data: IpostTreePlottingSpace.Data) => {
  if (!value) return true;
  return data.name.indexOf(value) !== -1;
};

watch(filterText, val => {
  iconTree.value.filter(val);
});

onMounted(() => {
  getIconTree();
});
</script>
<style lang="scss" scoped>
.plotting-tab-icon {
  display: flex;
  flex-direction: column;
  .filter-text {
    --input-bg-color: rgba(0,0,0,0);
  }
  .tree-list {
    flex: 1 0 0;
  }
  .mark-icon-tree {
    :deep(.tree-node .tree-node-children .tree-node .tree-node-content) {
      background-color: rgba(0,0,0,0);
    }
    :deep(.tree-node-content:has(.image-icon) .tree-node-arrow) {
      display: none;
    }
  }
}
</style>
