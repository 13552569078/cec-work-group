<template>
  <div
    class="footer-bg static"
    :class="getOpenClass()"
    ref="footer"
  >
    <div class="title">协同处置流程</div>
    <div
      class="open"
      :class="getOpenClass()"
      @click="handleToggle"
    ></div>
    <div class="tabs-wrap">
      <dy-tabs
        v-model="mode"
        :tabs="eventTabs"
        @update:modelValue="changeMode"
      />
    </div>
    <div class="table-wrap m-t-xs">
      <event-progress-list-scroll
        :list="recentTableData"
        class="m-t-xxs"
        @clickEventRow="clickEventRow"
        :height="'calc(var(--xxs) * 130/4)'"
        v-if="mode===defaultMode"
      >
        <template #key6="{ row }">{{ row.key6 }}</template>
      </event-progress-list-scroll>
      <event-progress-list
        :list="tableData"
        :height="'calc(var(--xxs) * 180/4)'"
        @clickEventRow="clickEventRow"
        v-else
      />
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import { useGlobalState } from '@/hooks';
import { apiEventMonitorObj } from '@/apis';
import { pick } from 'lodash-es';

const { isFooterEventListOpen, currentEventId, handleShowEventDetail } = useGlobalState();

const footer = ref();

const open = ref(true);

const handleToggle = () => {
  open.value = !open.value;
  isFooterEventListOpen.value = open.value;
};

const mode = ref('recent');
const defaultMode = 'recent';

const eventTabs = ref([
  {
    label: '最新',
    defaultLabel: '最新',
    value: 'recent',
  },
  {
    label: '待办(0)',
    defaultLabel: '待办',
    value: 'dbNum',
    flag: 1,
  },
  {
    label: '异常(0)',
    defaultLabel: '异常',
    value: 'ycNum',
    flag: 2,
  },
  {
    label: '超时(0)',
    defaultLabel: '超时',
    value: 'csNum',
    flag: 3,
  },
  {
    label: '紧急(0)',
    defaultLabel: '紧急',
    value: 'jjNum',
    flag: 4,
  },
  {
    label: '长期未办(0)',
    defaultLabel: '长期未办',
    value: 'cqwbNum',
    flag: 5,
  },
  {
    label: '多部门(0)',
    defaultLabel: '多部门',
    value: 'dbmNum',
    flag: 6,
  },
  {
    label: '自处置',
    defaultLabel: '自处置',
    value: 'self',
    flag: 7,
  },
]);

const recentTableData = ref();
const tableData = ref();
const eventParams = ref();

const getOpenClass = () => {
  return open.value ? 'open' : 'close';
};

const changeMode = () => {
  // 重新查询
  if (mode.value === 'recent') {
    getRecentTableData(eventParams.value);
  } else {
    getTypeTableData(eventParams.value);
  }
};

const clickEventRow = (item: any) => {
  currentEventId.value = item.id;
  handleShowEventDetail(item.id);
};

const getStatisticsData = async (params:any) => {
  eventParams.value = pick(params, 'startTime', 'endTime', 'district');
  const { data } = await apiEventMonitorObj.postStatistics({
    districtCode: eventParams.value.district,
    ...eventParams.value
  });
  eventTabs.value.forEach((e: any) => {
    if (data[e.value as keyof typeof data]) {
      e.label = `${e.defaultLabel}(${data[e.value as keyof typeof data]})`;
    }
  });
};

const getRecentTableData = async (params:any) => {
  const { data } = await apiEventMonitorObj.postLatestList({
    districtCode: params.district ?? params.districtCode,
  });
  recentTableData.value = data;
};

const getTypeTableData = async (params:any) => {
  eventParams.value = pick(params, 'startTime', 'endTime', 'district');
  const flag = eventTabs.value.find(e => e.value === mode.value)?.flag;
  if (!flag) return;
  const { data } = await apiEventMonitorObj.postPage({
    districtCode: eventParams.value.district,
    flag,
    pageNum: 1,
    pageSize: 9999,
    ...eventParams.value
  });
  tableData.value = data.list;
};
// immediate 默认初始化查询
const { factorAnalysisVisible } = useGlobalState({
  handleWatch: (params: any) => {
    getStatisticsData({ ...params });
    getRecentTableData({ ...params });
    getTypeTableData({ ...params });
  },
  immediate: true,
});

const updateWindowWidth = () => {
  const width = window.innerWidth;
  nextTick(() => {
    if (width > 6000) {
      footer.value.style.width = '52%';
    } else {
      footer.value.style.width = '48%';
    }
  });
};

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth);
  updateWindowWidth();
});
</script>

<style lang='scss' scoped>
.footer-bg {
  .title {
    position: absolute;
    font-size: calc(var(--xxs) * 20 / 4);
    left: calc(var(--xxs) * 40 / 4);
    top: calc(var(--xxs));
    font-family: PangMenZhengDao;
    background: linear-gradient(180deg, #ffffff 0%, #44bbff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .open {
    position: absolute;
    width: calc(var(--xxs) * 24 / 4);
    height: calc(var(--xxs) * 20 / 4);
    background: url("@/assets/images/deyang/open.png");
    background-size: 100% 100%;
    top: calc(var(--xxs) * 3.5);
    right: calc(var(--xxs) * 18 / 4);
    cursor: pointer;

    &.close {
      position: absolute;
      width: calc(var(--xxs) * 24 / 4);
      height: calc(var(--xxs) * 20 / 4);
      background: url("@/assets/images/deyang/close.png");
      background-size: 100% 100%;
      top: calc(var(--xxs) * 3.5);
      right: calc(var(--xxs) * 18 / 4);
      cursor: pointer;
    }
  }

  &.close {
    .title {
      top: calc(var(--xxs) * 0.5);
    }

    .tabs-wrap {
      margin-top: calc(var(--xxs) * 10.5) !important;
      margin-bottom: calc(var(--xxs) * 10);
    }
  }

  .tabs-wrap {
    margin-top: calc(var(--xxs) * 12) !important;
    width: 95% !important;
    margin: 0 auto;
  }

  .table-wrap {
    width: 95% !important;
    margin: 0 auto;
  }
}
</style>
