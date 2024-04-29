<template>
  <div class="filter-layer-box">
    <hl-icon fill effect="light" size="md" type="primary" class="filter-handle hover:text-info transition" @click="togglePanel">
      <fill-layer />
    </hl-icon>
    <hl-panel borderless :class="showPanel ? 'show' : ''" class="filter-panel" body-padding="var(--sm)" style="--panel-header-height: var(--xxl)">
    <template #header>
      <h5 class="panel-title font-md">图层选择</h5>
      <div class="panel-header-right" style="transform: translateX(12px); user-select: none">
        <hl-icon class="cursor-pointer" size="xxs" @click="togglePanel"><two-close /></hl-icon>
      </div>
    </template>
    <hl-tree :data="data" show-checkbox default-expand-all @check-change="getTreeNode" ref="tree" node-key="id" gap="0" style="--tree-height: var(--xl); --tree-bg-color: transparent; --tree-child-bg-color: transparent" />
  </hl-panel>
  </div>

</template>

<script setup lang="ts">
import { ref, inject, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';

interface ItreeNode {
  id: number;
  types: boolean;
  value: string;
}

const emit = defineEmits(['mapLayer']);

const router = useRouter();

const showPanel = ref(true);
const systemName = ref(inject('systemName'));
const data = ref<any[]>([]);
const tree = ref();
const routePath = ref('');
const checkTypes = ref<string[]>([]);

// base 事件等级
const base = ref({
  id: 1,
  label: `${systemName.value}信息`,
  value: 'warning',
  children: [
    {
      id: 11,
      label: 'I级',
      types: true,
      value: 'ALARM_LEVEL_CODE_1WARNING_LEVEL_CODE_1'
    },
    {
      id: 12,
      label: 'II级',
      types: true,
      value: 'ALARM_LEVEL_CODE_2WARNING_LEVEL_CODE_2'
    },
    {
      id: 13,
      label: 'III级',
      types: true,
      value: 'ALARM_LEVEL_CODE_3WARNING_LEVEL_CODE_3'
    },
    {
      id: 14,
      label: 'IV级',
      types: true,
      value: 'ALARM_LEVEL_CODE_4WARNING_LEVEL_CODE_4'
    }
  ]
});
const baseRegion = {
  id: 2,
  label: '监测要素',
  value: 'equipment',
  children: [
    {
      id: 21,
      label: '监测主体',
      types: true,
      value: 'region'
    }
  ]
};
// 研判中心
const judgeCenter = {
  id: 2,
  label: '监测要素',
  value: 'equipment',
  children: [
    {
      id: 21,
      label: '监测主体',
      types: true,
      value: 'region'
    },
    {
      id: 22,
      label: '监测点',
      types: true,
      value: 'monitor-point'
    }
  ]
};
// 检测主体 研判
const judgeRegion = {
  id: 2,
  label: '监测要素',
  value: 'equipment',
  children: [
    {
      id: 22,
      label: '监测点',
      value: 'monitor-point'
    }
  ]
};

// 监测中心center   研判中心judgement-center   研判judge  监测主体region
const treeDataHandel = (path: string) => {
  switch (path) {
    case 'center':
      data.value = [base];
      break;
    // case 'judgement-center':
    //   data.value = [base, judgeCenter];
    //   break;
    default:
      data.value = [base, judgeCenter];
  }
  baseChecked();
};
// 设置默认选择base
const baseChecked = () => {
  nextTick(() => {
    tree.value.setCheckedKeys([]);
    tree.value.setCheckedKeys([1, 21]);
    checkTypes.value = [];
    getTreeNode();
  });
};
// 选中节点types[]
const getTreeNode = () => {
  const datas = tree.value.getCheckedNodes();
  checkTypes.value = datas
    .filter((item: ItreeNode) => {
      return item.types;
    })
    .map((item2: ItreeNode) => {
      return item2.value;
    });
  // 监测中心页，需要显示「监测事件」、「监测主体」、「监测点」，但是图层选择里，仅展示「监测事件」的选择
  if (routePath.value === 'center') {
    checkTypes.value = [...checkTypes.value, 'monitor-point', 'region'];
  }
  emit('mapLayer', checkTypes.value);
};

watch(
  () => router.currentRoute.value.path,
  (newValue, oldValue) => {
    let nowRoute = '';
    if (newValue !== '/') {
      nowRoute = newValue.split('/')[newValue.split('/').length - 1];
      base.value.label = `${systemName.value}信息`;
      routePath.value = nowRoute;
      treeDataHandel(nowRoute);
    }
  },
  { immediate: true }
);

const togglePanel = () => {
  showPanel.value = !showPanel.value;
};
</script>
