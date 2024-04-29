<template>
  <hl-scrollbar class="w-full h-full">
    <hl-simple-table class="normal-stripe-table" ref="tableRef" fixed-header :cols="isExpert ? expertCols : cols" :data="data" row-key="userId" hover>
      <template #allRowsSelector>
        <hl-checkbox v-model="isSelectedAll" :indeterminate="isIndeterminate" @change="selectAll" />
      </template>
      <template #tableSelect="{ row, rowIndex }">
        <hl-checkbox :model-value="row.active" :disabled="row.disable" @click="selectRow(row, rowIndex)">{{ '' }}</hl-checkbox>
      </template>
      <template #tableIndex="{ rowIndex }">
        <span>{{ rowIndex + 1 }}</span>
      </template>
      <template #administrative="{row}">
        <span>{{ getAreaName(row.administrative) }}</span>
      </template>
      <template #empty>
        <hb-empty description="暂无数据" class="w-full" :image="NoDataImg" />
      </template>
    </hl-simple-table>
  </hl-scrollbar>
</template>

<script lang="ts" setup>
import { PropType, ref, watch, computed, onMounted } from 'vue';
import { useResourceData, useAreaList } from '@/hooks';
import { RESOURCE_EXPERT } from '@/common';
import NoDataImg from '@/assets/images/empty/no-data.png';

const props = defineProps({
  data: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
  type: {
    type: String, // org 机构
    default: '',
  },
  isExpert: {
    type: Boolean,
    default: false,
  }
});
const emit = defineEmits(['change']);

const { getAreaName, getAreaTree } = useAreaList();
const { EXPERT_COMMON_COLS, resourceTypeAttrCols, getResourceCustomLabels } = useResourceData();

// 专家
const expertCols = computed(() => [
  ...EXPERT_COMMON_COLS,
  ...resourceTypeAttrCols.value
]);

const cols = [
  { title: '#', slotName: 'tableSelect', headerSlotName: 'allRowsSelector', width: '3em' },
  { title: '序号', align: 'center', slotName: 'tableIndex', width: '3em', },
  { title: '姓名 ', prop: props.type === 'org' ? 'orgName' : props.type === 'user' ? 'userName' ?? 'name' : 'groupName', width: '8em', showTooltip: true, },
  { title: '机构名称', prop: 'orgName', width: '8em', showTooltip: true, },
];

const isSelectedAll = ref(false);
const isIndeterminate = ref(false);
const selectedRowKeys = ref<string[]>([]);

const selectAll = () => {
  props.data.forEach((d, index) => {
    if (!d.disable && ((!d.active && isSelectedAll.value) || (d.active && !isSelectedAll.value))) {
      emit('change', d, index);
    }
  });
};

const selectRow = (row: Record<string, any>, index: number) => {
  if (row.disable) return;
  emit('change', row, index);
};

const updateRowStatus = () => {
  isSelectedAll.value = props.data.length ? props.data.every(d => !d.disable && d.active) : false;
  if (isSelectedAll.value) {
    isIndeterminate.value = false;
  } else {
    isIndeterminate.value = props.data.length ? props.data.some(d => !d.disable && d.active) : false;
  }
};

const initCols = () => {
  if (props.type === 'org') {
    cols.splice(2, 1);
    cols[2].width = '15em';
  }
};

watch(() => props.data, () => {
  updateRowStatus();
}, {
  deep: true,
  immediate: true,
});

onMounted(async() => {
  await getAreaTree();
  initCols();
  if (props.isExpert) {
    await getResourceCustomLabels(RESOURCE_EXPERT);
  }
});
</script>

<style lang="scss" scoped>
</style>
