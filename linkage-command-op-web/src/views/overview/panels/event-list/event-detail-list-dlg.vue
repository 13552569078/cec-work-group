<template>
  <hl-dialog
    :model-value="true"
    custom-class="event-detail-list-dlg"
    width="calc(var(--xxl) * 35)"
    height="calc(var(--xxs) * 241.5)"
    title="事件列表"
    append-to-body
    @closed="$emit('cancel')"
  >
    <hl-form inline class="form-container" item-gap="var(--sm)">
      <hl-form-item label="类型">
        <hb-tree-selector
          v-model="form.eventTypes"
          :tree-props="treeProps"
          placeholder="事件类型"
          clearable
          multiple
          collapse-tags
          class="w-200"
          popper-class="event-type-tree">
        </hb-tree-selector>
      </hl-form-item>
      <hl-form-item label="等级">
        <hl-select v-model="form.eventLevels" placeholder="事件等级" class="w-180" clearable multiple collapse-tags>
          <hl-option v-for="item in EVENT_LEVEL" :key="item.value" :label="item.label" :value="item.value" />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="行政区划">
        <area-cascader
          :model-data="form.areaCodeList"
          :custom-props="{ multiple: true, clearable: true }"
          @change="onAreaCascaderChange"
        />
      </hl-form-item>
      <hl-form-item label="状态">
        <hl-select v-model="form.eventStates" placeholder="事件状态" class="w-170" clearable multiple collapse-tags>
          <hl-option v-for="item in EVENT_STATES" :key="item.value" :label="item.label" :value="item.value" />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="发生时间">
        <hl-select v-model="form.happenTime" placeholder="发生时间" class="w-sm" clearable>
          <hl-option v-for="item in timeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </hl-select>
      </hl-form-item>
      <hl-form-item>
        <div>
          <hl-button type="primary" class="m-r-sm m-l-sm" @click="handleCurrentChange(1)">搜索</hl-button>
          <hl-button @click="resetForm">重置</hl-button>
        </div>
      </hl-form-item>
    </hl-form>
    <hl-scrollbar height="calc(var(--xxs) * 175)">
      <hl-simple-table
        :cols="cols"
        :data="tableData"
        hover
        stripe
        list
        gap-y="var(--xxs)"
        class="normal-stripe-table"
      >
        <template #tableIndex="{ rowIndex }">
          <span>{{ rowIndex + 1 }}</span>
        </template>
        <template #state="{ row }">
          <hl-tag class="font-level2 p-x-xxs event-state-tag" :class="row.eventState">
            {{ row.eventStateName }}
          </hl-tag>
        </template>
        <template #action="{ row }">
          <hl-link
            type="primary"
            @click="handleEvent(row)"
          >
            {{ row.eventState === 'FINISHED' ? '事件复盘' : '进入处置' }}
          </hl-link>
        </template>
      </hl-simple-table>
    </hl-scrollbar>
    <div class="pagination">
      <hl-pagination
        layout="total, prev, pager, next"
        :page-size="paginationParams.pageSize"
        :total="paginationParams.total"
        :current-page="paginationParams.currentPage"
        @current-change="handleCurrentChange"
      />
    </div>
  </hl-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, watch, computed, PropType } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { useCurrentArea } from '@/hooks';
import { DATE_FORMAT, EVENT_LEVEL, EVENT_STATES, GlobalAPI, tableDefaultProps, TIME_END_STR, TIME_START_STR } from '@/common';
import { IpostEventTypeTree } from '@/apis/modules/event-condition/model';
import { IpostFindEventListSpace } from '@/apis/modules/event-list/model';
import { apiEventConditionObj } from '@/apis/modules/event-condition';
import { apiEventListObj } from '@/apis/modules/event-list';
import { AreaCascader, MultiAreaChangeEvent } from '@/components';

const props = defineProps({
  eventStates: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  happenTimeStart: {
    type: String,
    default: ''
  },
  happenTimeEnd: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['cancel', 'ok']);

const router = useRouter();
const { areaCode } = useCurrentArea();

const treeProps = reactive({
  nodeKey: 'code',
  checkStrictly: true,
  showCheckbox: true,
  data: [] as unknown as IpostEventTypeTree.Data,
  props: {
    children: 'children',
    label: 'name',
  },
});
const timeOptions = ref([...GlobalAPI.config.NORMAL_MAP_CONFIG.eventStatistics.timeFilter]);
const form = reactive({
  areaCodeList: [] as string[],
  eventTypes: [],
  eventLevels: [],
  eventStates: props.eventStates,
  happenTimeStart: '',
  happenTimeEnd: '',
  happenTime: ''
});

const tableData = ref<IpostFindEventListSpace.List[]>([]);
const cols = ref([
  { title: '序号', slotName: 'tableIndex', width: '4em' },
  { title: '事件标题', prop: 'name', width: '18em', showTooltip: true, tooltipProps: { ...tableDefaultProps } },
  { title: '事件类型', prop: 'eventTypeName' },
  { title: '事件等级', prop: 'eventLevelName' },
  { title: '行政区划', prop: 'areaName' },
  { title: '发生时间', prop: 'happenTime' },
  { title: '状态', prop: 'eventStateName', slotName: 'state' },
  { title: '操作', prop: 'action', slotName: 'action' },
]);
const paginationParams = reactive({
  currentPage: 1,
  total: 0,
  pageSize: 10
});

const resetForm = () => {
  form.areaCodeList = [areaCode.value];
  form.eventTypes = [];
  form.eventLevels = [];
  form.eventStates = [];
  form.happenTimeStart = '';
  form.happenTimeEnd = '';
  form.happenTime = '';
  paginationParams.currentPage = 1;
  loadData();
};

const handleCurrentChange = (current: number) => {
  paginationParams.currentPage = current;
  loadData();
};

const loadData = async() => {
  const params = {
    ...form,
    drill: 0,
    pageSize: paginationParams.pageSize,
    currentPage: paginationParams.currentPage,
  };
  if (params.happenTime) {
    params.happenTimeStart = dayjs(Date.now()).add(+params.happenTime, 'day').format(DATE_FORMAT) + TIME_START_STR;
    params.happenTimeEnd = dayjs(Date.now()).format(DATE_FORMAT) + TIME_END_STR;
  } else {
    if (props.happenTimeStart) {
      params.happenTimeStart = props.happenTimeStart;
      params.happenTimeEnd = props.happenTimeEnd;
    } else {
      params.happenTimeStart = '';
      params.happenTimeEnd = '';
    }
  }

  const res = await apiEventListObj.postFindEventList(params);
  tableData.value = res.data.list;
  paginationParams.total = res.data.totalRow;
};

const handleEvent = (item: IpostFindEventListSpace.List) => {
  emit('cancel');
  router.push({
    name: 'event-handling',
    query: {
      id: item.id
    }
  });
};

const onAreaCascaderChange = (data: MultiAreaChangeEvent) => {
  form.areaCodeList = data.idList;
};

onMounted(async() => {
  form.areaCodeList = [areaCode.value];

  const resultType = await apiEventConditionObj.getEventTypeTree();
  treeProps.data = resultType.data;

  loadData();
});
</script>
<style lang="scss" scoped>
.event-detail-list-dlg {
  width: 100%;
  display: flex;
  flex-direction: column;
  .form-container {
    width: 100%;
    display: flex;
    align-items: center;
    column-gap: var(--sm);
    margin-bottom: calc(var(--xxs) * 6);
    :deep(.hl-input-select) {
      .hl-input.is-tags {
        overflow-y: hidden;
      }
    }
    .w-170 {
      width: calc(var(--xxs) * 42.5);
    }
    .w-180 {
      width: calc(var(--xxs) * 46);
    }
    .w-200 {
      width: calc(var(--xxs) * 50);
    }
  };
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: calc(-5 * var(--xxs));
  }
}
</style>
