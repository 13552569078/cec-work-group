<template>
  <div class="protect-table-part">
    <div class="title">防护目标</div>
    <hl-form inline  gap="var(--md)" item-gap="var(--md)" class="form-container">
      <hl-form-item label="分析方式">
        <hl-select v-model="query.eventTypeCode" class="query-select" clearable @change="onEventTypeCodeChange">
          <hl-option v-for="item in methodOptions" :key="item.value" :label="item.label" :value="item.value" />
        </hl-select>
      </hl-form-item>

      <hl-form-item label="防护类型">
        <hl-select v-model="query.resourceType" class="query-select" style="width: calc(var(--xxs) * 60);" clearable multiple collapse-tags>
          <hl-option v-for="item in resourceTypes" :key="item.value" :label="item.label" :value="item.value" />
        </hl-select>
      </hl-form-item>

      <hl-form-item label="分析范围">
        <hl-group>
          <hl-input v-model="query.distance" placeholder="请输入" maxlength="6" class="with-affixe query-select" @change="onInputDistanceChange">
            <template #suffix><span>km</span></template>
          </hl-input>
        </hl-group>
      </hl-form-item>
      <hl-form-item>
        <hl-button type="primary" class="normal-width" @click="searchResource">确定</hl-button>
      </hl-form-item>
    </hl-form>

    <hl-scrollbar min-height="calc(var(--xxs) * 50)" max-height="calc(var(--xxs) * 100)">
      <hl-simple-table :cols="cols" stripe :data="tableData" hover class="normal-stripe-table" list gap-y="var(--xxs)" fixed-header :header-cell-style="{background: '#044474'}">
        <template #allRowsSelector>
          <hl-checkbox v-model="selectedAll" :indeterminate="isIndeterminate" @change="selectAll" />
        </template>
        <template #rowSelector="{ row }">
          <hl-checkbox v-model="selectedRowIds" :label="row.id" @change="selectRow">{{ '' }}</hl-checkbox>
        </template>
        <template #tableIndex="{ row }">
          <span class="table-index">{{ row.rowIndex }}</span>
        </template>
        <template #dist="{ row }">
          <span>{{ formatDistance(row.dist) }}</span>
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
import { HlMessage } from 'hongluan-ui';
import { useCurrentEvent, useMapBuffer, useResourceData } from '@/hooks';
import { PROTECT_NAME } from '@/common';
import { apiDisposeSuggestObj } from '@/apis/modules/dispose-suggest';
import NoDataImg from '@/assets/images/event-handling/left-2/empty.png';
import { useAssistPlan } from '../use-assist-plan';

import type { IpostFindEventSurroundingItemsSpace } from '@/apis/modules/dispose-suggest/model';
import type { DefaultParams } from './plan-model';

const { currentEvent } = useCurrentEvent();
const { queryParams } = useMapBuffer();
const { allConfigResourceType } = useAssistPlan();
const { ALL_RESOURCES_TREE_NEW, ALL_RESOURCES_DICT_NEW } = useResourceData();

const props = defineProps<{
  defaultParams: DefaultParams;
}>();
const emit = defineEmits(['updateInfo']);

const resourceTypes = ref<Array<{label: string; value: string; [x: string]: any; }>>([]);
const query = ref({
  eventTypeCode: 'intelligence',
  resourceType: [] as any[],
  distance: '',
  strategyId: currentEvent.strategyInfoId,
});

const tableData = ref<IpostFindEventSurroundingItemsSpace.Data[]>([]);
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
    prop: 'resName',
    title: '防护目标名称',
    width: '10em',
    showTooltip: true,
  },
  {
    prop: 'type',
    title: '防护类别',
    showTooltip: true,
  },
  {
    prop: 'dist',
    title: '距离事发地',
    showTooltip: true,
    slotName: 'dist',

  },
  {
    prop: 'personName',
    title: '安全联系人',
    showTooltip: true,
  },
  {
    prop: 'personMobile',
    title: '联系电话',
    width: '10em',
  },
];

const methodOptions = [
  {
    label: '智能匹配',
    value: 'intelligence',
  }, {
    label: '全量匹配',
    value: 'complete',
  },
];

const selectedAll = ref(false);
const isIndeterminate = ref(false);
const selectedRowIds = ref<string[]>([]);

const allRiskTypeList = computed(() => {
  return ALL_RESOURCES_TREE_NEW.value?.find(el => el.id === PROTECT_NAME)?.children.map(i => { return { label: i.label, value: i.id }; });
});
const intelligenceResourceTypeList = computed(() => {
  return allConfigResourceType.value?.find(el => el.id === PROTECT_NAME)?.children;
});

const onInputDistanceChange = (v: string) => {
  const value = String(v);
  if (value) {
    const nums = value.split('.');
    if (Number.isNaN(+value) || (nums[1] && nums[1].length > 2) || +value < 0 || (3 && nums[0].length > 3)) {
      query.value.distance = '';
      HlMessage.warning('请输入数值类型，最多3位整数、2位小数');
    }
  }
};
const selectAll = () => {
  selectedRowIds.value.splice(0, selectedRowIds.value.length);
  if (selectedAll.value) {
    selectedRowIds.value.push(...tableData.value.map(d => `${d.id}`));
    isIndeterminate.value = false;
  }
  updateResource();
};
const selectRow = () => {
  selectedAll.value = selectedRowIds.value.length === tableData.value.length;
  if (selectedRowIds.value.length > 0 && selectedAll.value === false) {
    isIndeterminate.value = true;
  } else {
    isIndeterminate.value = false;
  }
  updateResource();
};

const updateResource = () => {
  const res = tableData.value.filter(item => {
    return selectedRowIds.value.find(id => `${item.id}` === id);
  }).map((i, index) => ({
    no: index + 1,
    ...i
  }));
  emit('updateInfo', {
    key: 'protect',
    value: res,
  });
};

const getDict = async() => {
  query.value.eventTypeCode = 'intelligence';
  onEventTypeCodeChange(query.value.eventTypeCode);
  await searchResource();
};

const formatDistance = (distance: string) => {
  if (!distance || distance === '--') return '--';
  return `${+distance / 1000}km`;
};

const setResourceTypes = (eventTypeCode: string) => {
  resourceTypes.value = eventTypeCode === 'intelligence' ? intelligenceResourceTypeList.value : allRiskTypeList.value;
  query.value.resourceType = resourceTypes.value.map(el => el.value);
};

const onEventTypeCodeChange = (val: string) => {
  query.value.distance = val === 'intelligence' ? queryParams.value.distance : '1';
  query.value.strategyId = val === 'intelligence' ? currentEvent.strategyInfoId : '';
  setResourceTypes(val);
};
const searchResource = async() => {
  if (!query.value.resourceType.length) {
    HlMessage.warning('请选择防护类型');
    return;
  }
  const params = {
    longitude: currentEvent.longitude,
    latitude: currentEvent.latitude,
    ...query.value,
  };
  const res1 = await apiDisposeSuggestObj.postFindEventSurroundingItems(params);
  tableData.value = res1.data?.map((item, index) => {
    return {
      ...item,
      rowIndex: index + 1,
      name: item.resName,
      type: ALL_RESOURCES_DICT_NEW.value[item.resourceType].label,
      distance: item.dist,
    };
  });
};

watch(() => allConfigResourceType.value, val => {
  if (val.length) getDict();
}, {
  immediate: true,
  deep: true
});
</script>
<style lang="scss" scoped>
.protect-table-part {
  border: none;
  box-sizing: border-box;
  padding: calc(var(--xxs) * 5);
  overflow: hidden;
  background: rgba(0, 158, 247, 0.10);
  .title {
    height: calc(var(--xxs) * 5.5);
    font-size: var(--font-lg);
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 1;
    padding-bottom: calc(var(--xxs) * 8);
    border-bottom: calc(var(--xxs) * 0.25) dashed #0E3D6C;
    margin-bottom: calc(var(--xxs) * 4);
  }
  .form-container {
    width: 100%;
    display: flex;
    margin-bottom: calc(var(--xxs) * 4);
    .query-select {
      width: calc(var(--xxs) * 40);
      :deep(.hl-input) {
        background: rgba(0,158,247,0.12)!important;
      }
      :deep(.hl-tag) {
        --tag-bg-color: rgba(255,255,255,.1);
      }
    }
  }
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
