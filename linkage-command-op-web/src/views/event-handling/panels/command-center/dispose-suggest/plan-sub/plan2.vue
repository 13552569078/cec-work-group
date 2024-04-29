<template>
  <div class="msds-table-part">
    <hl-scrollbar min-height="calc(var(--xxs) * 50)" max-height="calc(var(--xxs) * 100)" @at-end="searchMSDS">
      <hl-simple-table :cols="cols" stripe :data="tableData" hover class="normal-stripe-table" list gap-y="var(--xxs)" fixed-header :header-cell-style="{background: '#044474'}">
        <template #firstCol>
          <hl-checkbox v-model="selectedAll" :indeterminate="isIndeterminate" @change="selectAll" />
        </template>
        <template #tableIndex="{ row }">
          <hl-checkbox v-model="selectedRowIds" :label="row.id" @change="selectRow">{{ '' }}</hl-checkbox>
        </template>
        <template #rowIndex="{ rowIndex }">
          <span class="table-index">{{ rowIndex + 1 }}</span>
        </template>
        <template v-if="hasMoreData" #more>
          <template v-if="loading">
            <hl-group align="items-middle" gap="var(--xs)">
              <hl-spinner size="sm" />
              <span>正在加载...</span>
            </hl-group>
          </template>
        </template>
        <template #empty>
          <hb-empty description="暂无数据" :image="NoDataImg" />
        </template>
      </hl-simple-table>
    </hl-scrollbar>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useCurrentEvent } from '@/hooks';
import { apiKnowledgeRecommendObj } from '@/apis/modules/knowledge-recommend';
import NoDataImg from '@/assets/images/event-handling/left-2/empty.png';

import { IpostMSDSPageSpace } from '@/apis/modules/knowledge-recommend/model';
import type { DefaultParams } from './plan-model';

const props = defineProps<{
  defaultParams: DefaultParams;
}>();
const emit = defineEmits(['updateInfo']);

const { currentEvent } = useCurrentEvent();

const tableData = ref<IpostMSDSPageSpace.List[]>([]);
const cols = [
  {
    title: '',
    slotName: 'tableIndex',
    headerSlotName: 'firstCol',
    width: '3em'
  },
  {
    title: '#',
    prop: '',
    slotName: 'rowIndex',
    width: '4em',
  },
  {
    prop: 'chName1',
    title: '中文名称',
    width: '10em',
    showTooltip: true,
  },
  {
    prop: 'enName1',
    title: '英文名称',
    showTooltip: true,
  },
  {
    prop: 'chemicalType',
    title: '化学品类别',
    showTooltip: true,
  },
  {
    prop: 'casNo',
    title: 'CAS.NO',
  },
];
const currentPage = ref(1);
const loading = ref(false);
const hasMoreData = ref(true);

const selectedAll = ref(false);
const isIndeterminate = ref(false);
const selectedRowIds = ref<string[]>([]);

const selectAll = () => {
  selectedRowIds.value.splice(0, selectedRowIds.value.length);
  if (selectedAll.value) {
    selectedRowIds.value.push(...tableData.value.map(d => d.id));
    isIndeterminate.value = false;
  }
  updateMSDS();
};
const selectRow = () => {
  selectedAll.value = selectedRowIds.value.length === tableData.value.length;
  if (selectedRowIds.value.length > 0 && selectedAll.value === false) {
    isIndeterminate.value = true;
  } else {
    isIndeterminate.value = false;
  }
  updateMSDS();
};

const updateMSDS = () => {
  const res = tableData.value
    .filter(item => selectedRowIds.value.find(id => item.id === id))
    .map((i, index) => ({
      no: index + 1,
      ...i
    }));
  emit('updateInfo', {
    key: 'msdsParams',
    value: res
  });
};

const searchMSDS = async() => {
  if (loading.value || !hasMoreData.value) return;
  loading.value = true;
  currentPage.value++;
  const res = await apiKnowledgeRecommendObj.postMSDSPage({ currentPage: currentPage.value, pageSize: 10 });
  tableData.value.push(...res.data.list);
  loading.value = false;
  if (tableData.value.length >= res.data.totalRow) hasMoreData.value = false;
};

watch(
  () => props.defaultParams, () => {
    searchMSDS();
  }, {
    immediate: true,
    deep: true
  }
);
</script>
<style lang="scss" scoped>
.msds-table-part {
  border: none;
  box-sizing: border-box;
  padding: calc(var(--xxs) * 5);
  overflow: hidden;
  background: rgba(0, 158, 247, 0.10);
  :deep(.hl-simple-table) {
    .fixed-top {
      top: calc(var(--xxs) * -0.75);
    }
  }
  :deep(.empty-content) {
    .hb-empty {
      .empty-image {
        width: calc(var(--xxs) * 28);
      }
    }
  }
}
</style>
