<template>
  <hl-dialog
    :model-value="true"
    width="calc(var(--xxs) * 150)"
    height="calc(var(--xxs) * 200)"
    title="事件列表"
    class="event-list-dlg"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="$emit('cancel')"
  >
    <hl-group dir="vertical" full class="h-full">
      <hl-group class="" full="full-x" gap="var(--md)">
        <hl-input v-model="event.eventName" placeholder="请输入" clearable>
          <template #prefix>
            <hl-icon><two-search /></hl-icon>
          </template>
        </hl-input>
        <hl-select v-model="date.active" placeholder="全部" style="width:calc(var(--xxs) * 10);"
          @change="handleSelectChange">
          <hl-option v-for="item in date.content" :key="item.val" :label="item.label" :value="item.val" />
        </hl-select>
      </hl-group>
      <template v-if="date.active === 'custom'">
        <hl-group class="m-t-md static" full="full-x" gap="var(--md)">
          <hl-select v-model="event.eventLevelCode" placeholder="事件等级" clearable>
            <hl-option v-for="item in EVENT_LEVEL" :key="item.value" :label="item.label" :value="item.value" />
          </hl-select>
          <hb-tree-selector v-model="event.eventTypeCode" :tree-props="treeProps" placeholder="事件类型" clearable
            popper-class="event-type-tree">
          </hb-tree-selector>
          <hl-checkbox v-model="event.isDrill" style="width: 50%;">演练事件</hl-checkbox>
        </hl-group>
        <hl-date-picker v-model="customDate" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" block class="m-t-md" @change="handleDateChange"/>
      </template>

      <hl-scrollbar v-if="tableData.length > 0" @at-end="getList(false)">
        <hl-group dir="vertical" full="full-x" gap="var(--xs)" class="m-t-md">
          <hl-group v-for="item in tableData" :key="item.id" dir="vertical" class="p-md cursor-pointer event-item"
            @click="changeEvent(item.id)">
            <hl-group align="items-middle" gap-x="var(--xs)">
              <span class="font-level1 text-ellipsis self-full" @mousemove="showTooltip">
                {{ item.eventName }}
              </span>
              <hl-tag class="self-no-full font-level2 p-x-xxs tag-type">{{ item.eventTypeName }}</hl-tag>
              <hl-tag class="self-no-full font-level2 p-x-xxs event-state-tag" :class="item.eventState">
                {{ EVENT_STATES_MAP[item.eventState] }}
              </hl-tag>
            </hl-group>
            <hl-group align="items-middle" class="font-level1 m-t-xxs">
              <span>{{ item.happenTime }}</span>
            </hl-group>
          </hl-group>
        </hl-group>
        <div class="text-center m-t-xs" v-if="isLoading">加载中...</div>
      </hl-scrollbar>
      <hb-empty description="暂无搜索结果" :image="empty" v-else></hb-empty>
    </hl-group>
  </hl-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { useCurrentArea, useTextOverflow } from '@/hooks';
import { EVENT_LEVEL, EVENT_STATES_MAP } from '@/common';
import { apiEventConditionObj } from '@/apis/modules/event-condition';
import empty from '@/assets/images/empty/no-search-data.png';
import { IpostEventTypeTree, IpostFindEventListSpace } from '@/apis/modules/event-condition/model';

const emit = defineEmits(['cancel']);

const router = useRouter();
const { areaCode } = useCurrentArea();
const { showTooltip } = useTextOverflow();

const date = reactive({
  content: [
    {
      label: '全部',
      val: 'all',
    },
    {
      label: '今日',
      val: '0',
    },
    {
      label: '近一周',
      val: '7',
    },
    {
      label: '近一月',
      val: '30',
    },
    {
      label: '自定义',
      val: 'custom',
    },
  ],
  active: 'all',
});

const customDate = ref<Date[]>([]);
const treeProps = reactive({
  nodeKey: 'code',
  checkStrictly: true,
  showCheckbox: false,
  data: [] as unknown as IpostEventTypeTree.Data,
  props: {
    children: 'children',
    label: 'name',
  },
});
const tableData = ref<IpostFindEventListSpace.List[]>([]);
const pagination = reactive({
  pageSize: 20,
  page: 1,
});
const hasMore = ref(true);
const isLoading = ref(false);

const event = reactive<Record<string, any>>({
  startTime: undefined,
  endTime: undefined,
  eventName: undefined,
  eventTypeCode: undefined,
  eventLevelCode: undefined,
  isDrill: false,
});

const getList = async(isFirstLoad: boolean = true) => {
  if (isFirstLoad) {
    tableData.value = [];
    hasMore.value = true;
    pagination.page = 1;
    isLoading.value = false;
  }
  if (isLoading.value || !hasMore.value) return;
  isLoading.value = true;

  const params = {
    eventName: event.eventName,
    eventTypeCode: event.eventTypeCode,
    startTime: event.startTime,
    endTime: event.endTime,
    eventLevelCode: event.eventLevelCode,
    areaCode: areaCode.value,
    pageSize: pagination.pageSize,
    currentPage: pagination.page,
    isDrill: event.isDrill ? 1 : 0,
  };

  const res = await apiEventConditionObj.postFindEventList(params);
  tableData.value = tableData.value.concat(res.data.list || []);
  if (res.data.totalPage <= 1 || pagination.page >= res.data.totalPage) {
    hasMore.value = false;
  }
  isLoading.value = false;
  pagination.page++;
};
const handleSelectChange = (v: string) => {
  event.startTime = undefined;
  event.endTime = undefined;
  event.eventLevelCode = undefined;
  event.eventTypeCode = undefined;
  if (v !== 'all' && v !== 'custom') {
    event.startTime = dayjs().subtract(+v, 'day').format('YYYY-MM-DD ') + '00:00:00';
    event.endTime = dayjs().format('YYYY-MM-DD ') + '23:59:59';
  }
  if (v !== 'custom') {
    event.isDrill = false;
  }
};
const handleDateChange = (v: [Date, Date]) => {
  if (v) {
    const [s, e] = v;
    event.startTime = dayjs(s).format('YYYY-MM-DD ') + '00:00:00';
    event.endTime = dayjs(e).format('YYYY-MM-DD ') + '23:59:59';
  } else {
    event.startTime = undefined;
    event.endTime = undefined;
  }
};
const changeEvent = (id: string) => {
  router.push({ path: '/event-handling', query: { id } });
  emit('cancel');
};

watch(event, () => {
  getList();
}, { immediate: true, deep: true });

onMounted(async() => {
  const result = await apiEventConditionObj.getEventTypeTree();
  treeProps.data = result.data;
});
</script>

<style lang="scss" scoped>
.event-item {
  background-color: rgba(0,158,247,0.12);
  .font-level1 {
    font-size: var(--font-lg);
    line-height: 1.375;
  }
  .font-level2 {
    font-size: var(--font-sm);
    line-height: 1.66;
  }
  :deep(.hl-tag) {
    height: calc(var(--xxs) * 5.5);
    border-radius: 2px;
    &.tag-type {
      color: #71F8FC;
      background-color: rgba(113, 248, 252, 0.24);
    }
  }
}
</style>
<style lang="scss">
.event-list-dlg {
  .panel-body {
    flex: 1;
    overflow: hidden;
  }
}
</style>
