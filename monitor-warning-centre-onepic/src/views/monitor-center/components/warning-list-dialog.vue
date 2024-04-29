<template>
  <hl-dialog :modelValue="$props.modelValue" :title="`${systemName}信息列表`" width="calc(var(--xxs) * 300)" :append-to-body="true" @closed="handleClosed">
    <hb-table-searchbar v-if="isFilterDataReady" class="p-b-lg border-bottom no-spread-button" :selector="selector" :searcher="searcher" padding="0" gap="var(--md)" @change="handleSearch" />
    <hl-simple-table :cols="cols" :data="tableData" padding="var(--lg)" hover @row-click="handleRowClick">
      <template #index="{ rowIndex }">
        <span>{{ rowIndex + 1 }}</span>
      </template>
      <template #progress="{ row }">
        <hl-tag size="sm"
                :type="row.eventShowCode === 'EVENT_STATE_TO_BE_JUDGED'?'level1':'leve2'">
          {{ row.eventShowName }}
        </hl-tag>
      </template>
      <template #level="{ row }">
        <hl-tag size="sm" :type="`level${row.eventLevelCode.split('_')[3]}`">{{ row.eventLevelCodeName }}</hl-tag>
      </template>
      <template #titles="{ row }">
        <hl-group dir="vertical" full="full-x" class="content">
          <h6 class="title">{{ row.eventTitle }}</h6>
          <span class="text-secondary">{{ row.streetName }}</span>
        </hl-group>
      </template>
      <template #handle>
        <a>详情</a>
      </template>
    </hl-simple-table>
    <hl-pagination v-if="tableData.length > 0" :current-page="pagination.currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="pagination.pageSize" layout="total, slot, prev, pager, next, jumper" :total="pagination.total" align="items-between" class="w-full m-t-lg" @current-change="handleCurrentChange">
      <div class="w-full"></div>
    </hl-pagination>
  </hl-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, inject } from 'vue';
import { Emitter } from 'mitt';
import { useMonitorCenter, useRegion, useDict, useEventType } from '@/hooks';
import { IgetFindWarningInfoListPageSpace } from '@/apis/modules/monitorCenter/model';
import { useRoute } from 'vue-router';
import { getUrlPrefix } from '@/common/utils';

const route = useRoute();

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: Boolean,
  onlyRegion: {
    type: Boolean,
    default: false
  },
  currentFilter: {
    type: Object,
    default: () => { return {}; }
  }
});

const $eventBus = inject('$mitter') as Emitter;

const { regionList, getRegionList } = useRegion();

const { getWarningList } = useMonitorCenter();

const { getDictByType } = useDict();

const { getEventTypeList } = useEventType();

const tableData = ref<IgetFindWarningInfoListPageSpace.List[]>([]);
const isFilterDataReady = ref(false);
const eventLevelOptions = ref();
const eventTypeOptions = ref();
const systemName = ref(inject('systemName'));

const pagination = reactive({
  pageSize: 10,
  total: 0,
  currentPage: 1,
  show: false
});

const currentParams = ref<IgetFindWarningInfoListPageSpace.RequestParams>();

const cols = ref([
  { title: '#', prop: 'id', slotName: 'index' },
  { title: '进展', prop: 'eventStateName', slotName: 'progress' },
  { title: '标题', prop: 'eventTitle', slotName: 'titles' },
  { title: '产生时间', prop: 'startTime' },
  { title: '类型', prop: 'eventTypeName' },
  { title: '监测主体', prop: 'regionName' },
  { title: '等级', prop: 'eventLevelCodeName', slotName: 'level' }
]);

const fetchData = async(params?: IgetFindWarningInfoListPageSpace.RequestParams) => {
  currentParams.value = params;
  const data = {
    ...pagination,
    ...params
  };

  if (props.currentFilter.value) {
    if (props.currentFilter.valueName === 'region') {
      data.regionId = props.currentFilter.value;
    }
    if (props.currentFilter.valueName === 'eventType') {
      data.eventTypeCode = props.currentFilter.value;
    }
  }
  if (currentParams.value?.regionId) {
    data.regionId = currentParams.value.regionId;
  }
  if (currentParams.value?.eventTypeCode) {
    data.eventTypeCode = currentParams.value.eventTypeCode;
  }
  if (route.query.regionId) {
    data.regionId = route.query.regionId as string;
  }
  const res = await getWarningList(data);
  tableData.value = res.list;
  pagination.pageSize = res.pageSize;
  pagination.total = res.totalRow;
  pagination.currentPage = res.currentPage;
};

const init = async() => {
  const isMonitorPage = getUrlPrefix().includes('monitor');
  fetchData();
  const p1 = getEventTypeList();
  const p2 = isMonitorPage ? getDictByType('ALARM_LEVEL_CODE') : getDictByType('WARNING_LEVEL_CODE');
  const p3 = getRegionList();
  const resArr = await Promise.all([p1, p2, p3]);
  eventTypeOptions.value = resArr[0];
  eventLevelOptions.value = resArr[1];
  isFilterDataReady.value = true;
};

init();

const handleSearch = (a: string, params: any) => {
  pagination.currentPage = 1;
  console.log(133, params);
  fetchData(params);
};

const visible = ref(false);

const handleClosed = () => {
  emit('update:modelValue', false);
};

const originItems = computed(() => {
  return [
    {
      placeholder: '事件类型',
      fill: false,
      value: props.currentFilter.valueName === 'eventType' ? props.currentFilter.value : '',
      name: 'eventTypeCode',
      prop: {
        label: 'eventTypeName',
        value: 'eventTypeCode'
      },
      options: eventTypeOptions
    },
    {
      placeholder: `${systemName.value}等级`,
      fill: false,
      value: '',
      name: 'eventLevelCode',
      options: eventLevelOptions,
      prop: {
        label: 'dictName',
        value: 'dictCode'
      }
    },
    {
      placeholder: '监测主体',
      fill: false,
      value: route.query.regionId || (props.currentFilter.valueName === 'region' ? props.currentFilter.value : ''),
      name: 'regionId',
      disabled: props.onlyRegion,
      options: regionList,
      prop: {
        label: 'regionName',
        value: 'id'
      }
    }
  ];
});
const searcher = reactive({
  show: true,
  fill: false,
  name: 'eventTitle',
  placeholder: '输入关键词搜索'
});
const selector = reactive({
  colCount: 'md:count-3 sm:count-2',
  items: originItems
});
const handleCurrentChange = (page: number) => {
  console.log(page);
  pagination.currentPage = page;
  fetchData(currentParams.value);
};
const handleRowClick = (row: any) => {
  console.log(row);
  $eventBus.emit('OPEN_DIALOG:eventInfo', row);
};
</script>
