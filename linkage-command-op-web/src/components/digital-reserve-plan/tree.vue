<template>
  <hl-panel
    class="h-full w-full list-header"
    borderless
    inner-scroll
    full-body
  >
    <template #header>
      <h4 class="title">目录</h4>
      <img class="icon" src="@/assets/images/common/left-tree-title-icon.png" alt="">
    </template>
    <hl-scrollbar class="no-padding-top-bottom">
      <hl-tree
        ref="tree"
        class="catalog-tree filter-tree"
        node-key="id"
        :data="catalogTree"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        :highlight-current="true"
        :current-node-key="currentNodeKey"
        >
        <template #default="{ node, data }">
          <hl-group
            class="w-full"
            gap="var(--xs)"
            align="items-between items-center"
          >
            <span
              class="tree-node-label ellipsis static"
              :style="`width:var(--xs) * 30`"
              :title="data.catalogName"
            >
            {{ node.label}}
            </span>
          </hl-group>
        </template>
      </hl-tree>
    </hl-scrollbar>
  </hl-panel>
</template>
<script lang="ts" setup>
import { ref, watch, nextTick, reactive } from 'vue';
import { HlMessageBox } from 'hongluan-ui';
import { useRouter, useRoute } from 'vue-router';
import { apiReservePlanManageObj } from '@/apis/modules/reserve-plan';
import { IpostFindReservePlanCatalogByIdSpace } from '@/apis/modules/reserve-plan/model';

const route = useRoute();

const props = defineProps({
  id: String
});
const emit = defineEmits(['updatePage']);

// 筛选树
const filterText = ref('');
const tree = ref();
const catalogTree = ref();
const currentNodeKey = ref();

const defaultProps = ref({
  children: 'children',
  label: 'catalogName'
});
const activeId = ref();
const parentName = ref('');
const addLevel = ref('self');
const type = ref('add');
const curNode = ref();

const filterNode = (value: string, treeData:IpostFindReservePlanCatalogByIdSpace.Data) => {
  if (!value) return true;
  return treeData.catalogName.indexOf(value) !== -1;
};

watch(filterText, val => {
  tree.value.filter(val);
});

const updateActivedPage = (page: number) => {
  emit('updatePage', page);
};

watch(() => catalogTree.value, treeData => {
  updateActivedPage(1);
});

const handleNodeClick = (data:IpostFindReservePlanCatalogByIdSpace.Data, node: any) => {
  if (data.parentId === '0') {
    updateActivedPage(1);
  } else {
    updateActivedPage(data.page);
  }
};

const getCatalogTree = async() => {
  const res = await apiReservePlanManageObj.postFindReservePlanCatalogTree(props.id!);
  if (+res.code === 0) {
    catalogTree.value = [res.data];
    currentNodeKey.value = catalogTree.value[0].id;
  }
};

getCatalogTree();
</script>
<style lang="scss" scoped>
.list-header {
  background-color: transparent;
  :deep(.panel-header){
    background-image:url("");
    position: relative;
    padding: 0 var(--md);
    .icon{
      height: var(--xxs);
      position: absolute;
      right: var(--md);
      top: 50%;
      transform: translateY(-50%);
    }
  }
  :deep(.panel-body) {
    padding: 0 var(--md);
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
