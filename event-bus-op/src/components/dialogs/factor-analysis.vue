<template>
  <common-dialog title="事项要素分析" style="width: calc(var(--xxs) * 1348/4)" @close="$emit('close')" size="6">
    <hl-row gap="var(--lg)">
      <hl-col span="col-12">
        <simple-title-2 title="统一事项类目"></simple-title-2>
        <hl-group class="w-full left1" gap-x="var(--xl)">
          <hl-group dir="vertical">
            <div class="card1-wrap m-t-xl">
              <div class="value text-center">{{ eventTypeAnalysis.firstTypeNum }}</div>
              <div class="label text-center">事项大类(类)</div>
            </div>
            <div class="card1-wrap m-t-xl">
              <div class="value text-center">{{ eventTypeAnalysis.secondTypeNum }}</div>
              <div class="label text-center">事项中类(类)</div>
            </div>
            <div class="card1-wrap m-t-xl">
              <div class="value text-center">{{ eventTypeAnalysis.thirdTypeNum }}</div>
              <div class="label text-center">事项小类(类)</div>
            </div>
          </hl-group>
          <hl-group class="w-full events-type-slider" gap-x="var(--md)">
            <hl-group class="left" align="items-middle">
              <img :src="leftIcon" @click="prev" />
            </hl-group>
            <hl-group class="center w-full m-t-md">
              <hl-carousel :autoplay="false" arrow="never" height="calc(var(--xxs) * 253/4)" class="w-full"
                ref="carouselRef">
                <hl-carousel-item v-for="(item, index) in firstTypeList" :key="index" class="w-full">
                  <hl-row layout="grid" count="count-3" gap="var(--md)" class="w-full">
                    <hl-col span="col" v-for="(item2, idx) in item" :key="idx" class="grid-item"
                      :class="item2.firstTypeId ? '' : 'grid-item-empty'">
                      <hl-group align="items-center items-middle" class="w-full h-full" dir="vertical"
                        v-show="item2.firstTypeId">
                        <div class="value text-center">{{ item2.thirdTypeNum }}</div>
                        <div class="label text-center">{{ item2.firstTypeName }}(类)</div>
                      </hl-group>
                      <span v-show="!item2.firstTypeId" />
                    </hl-col>
                  </hl-row>
                </hl-carousel-item>
              </hl-carousel>
            </hl-group>
            <hl-group class="right" align="items-middle">
              <img :src="rightIcon" @click="next" />
            </hl-group>
          </hl-group>
        </hl-group>

        <simple-title-2 title="流入事项" class="m-t-lg m-b-lg"></simple-title-2>
        <hl-group class="w-full left2" gap-x="var(--md)">
          <hl-group dir="vertical">
            <div class="card1-wrap m-t-xl">
              <div class="value text-center">{{ inFlowEventTypeAnalysis.otherSystemNum }}</div>
              <div class="label text-center">流入系统(个)</div>
            </div>
            <div class="card1-wrap m-t-md">
              <div class="value text-center">{{ inFlowEventTypeAnalysis.firstTypeNum }}</div>
              <div class="label text-center">事项大类(类)</div>
            </div>
            <div class="card1-wrap m-t-md">
              <div class="value text-center">{{ inFlowEventTypeAnalysis.secondTypeNum }}</div>
              <div class="label text-center">事项中类(类)</div>
            </div>
            <div class="card1-wrap m-t-md">
              <div class="value text-center">{{ inFlowEventTypeAnalysis.thirdTypeNum }}</div>
              <div class="label text-center">事项小类(类)</div>
            </div>
          </hl-group>
          <hl-group class="w-full" gap-x="var(--md)">
            <stripe-list :list="inTableData" :cols="inCols" class="w-full" :height="'calc(var(--xxs) * 75)'" />
          </hl-group>
        </hl-group>
      </hl-col>
      <hl-col span="col-12">
        <simple-title-2 title="跨部门事项"></simple-title-2>
        <hl-group class="w-full" align="items-between items-middle m-t-md" dir="vertical">
          <hl-group class="w-full" align="items-between items-middle">
            <hl-select v-model="depTimeType" size="sm" @change="changeDepTimeType" style="width: calc(var(--xxs) * 114/4)"
              v-if="depModel === 2">
              <hl-option v-for="option in options" :key="option.label" :label="option.label" :value="option.value" />
            </hl-select>
            <div v-else></div>
            <dy-tabs v-model="depModel" :tabs="inflowTabs" @update:modelValue="changeMode" class="tabs-wrap" />
          </hl-group>
          <hl-group class="w-full m-t-md" gap-x="var(--md)" v-if="depModel === 2" dir="vertical" align="justify-right">
            <stripe-list :list="acrossEventSpyPageList" :cols="cols" class="w-full" :height="'calc(var(--xxs) * 125)'" />
            <hl-group v-if="acrossEventSpyPageList && acrossEventSpyPageList.length" dir="horizontal"
              class="page-content m-t-md w-full">
              <hl-group align="items-middle" class="w-full">
                <span>事件数/</span>
                <span class="page-count">{{ total }}</span>
                件
              </hl-group>
              <hl-pagination size="sm" :current-page="currentPage" :page-size="pageSize" class="w-full"
                layout="prev, pager, next" :total="total" align="items-right" @size-change="handleSizeChange"
                @current-change="handleCurrentChange">
                <div class="full"></div>
              </hl-pagination>
            </hl-group>
          </hl-group>
          <hl-group class="w-full m-t-md" gap-x="var(--md)" v-if="depModel === 1">
            <div class="relationship-wrap">
              <event-graph-basic />
            </div>
          </hl-group>
        </hl-group>
      </hl-col>
    </hl-row>
  </common-dialog>
</template>
<script lang="ts" setup>
import { ref, computed, reactive } from 'vue';
import { apiFactorManagementObj } from '@/apis';
import dayjs from 'dayjs';
import { useGlobalState } from '@/hooks';
import { IgetBusEventTypeAnalysisSpace, IgetOtherEventTypeAnalysisSpace, IgetOtherEventSystemListSpace, IgetBusEventTypeCardSpace, IpostAcrossEventSpyPageSpace } from '@/apis/modules/dy-factor-management/model';
import leftIcon from '@/assets/images/deyang/center/ysfx-left.png';
import rightIcon from '@/assets/images/deyang/center/ysfx-right.png';

// immediate 默认初始化查询
const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    getCrossList();
  }
});

const eventTypeAnalysis = reactive<IgetBusEventTypeAnalysisSpace.Data>({
  'firstTypeNum': 0,
  'secondTypeNum': 0,
  'thirdTypeNum': 0
});
const firstTypeList = ref<any[]>([]);
const carouselRef = ref();

const inFlowEventTypeAnalysis = reactive<IgetOtherEventTypeAnalysisSpace.Data>({
  'firstTypeNum': 0,
  'otherSystemNum': 0,
  'secondTypeNum': 0,
  'thirdTypeNum': 0
});
const inCols = [
  {
    title: '',
    minWidth: '2em',
    align: 'left',
    slotName: 'tableIndex',
    fixed: 'left',
  },
  {
    title: '系统名称',
    prop: 'systemName',
  },
  {
    title: '事件大类',
    prop: 'firstTypeNum',
  },
  {
    title: '事件中类',
    prop: 'secondTypeNum',
  },
  {
    title: '事件小类',
    prop: 'thirdTypeNum',
  }
];
const inTableData = ref<IgetOtherEventSystemListSpace.Data[]>([]);

const depModel = ref(1);
const inflowTabs = [
  {
    label: '流转关系',
    value: 1,
  },
  {
    label: '运行监控',
    value: 2,
  }
];

const DAY = 'DAY';
const MONTH = 'MONTH';
const QUARTER = 'QUARTER';
const YEAR = 'YEAR';
const depTimeType = ref(MONTH);
const formatType = 'YYYY-MM-DD HH:mm:ss';
const options = [
  {
    label: '本日',
    value: DAY
  },
  {
    label: '本月',
    value: MONTH
  },
  {
    label: '本季度',
    value: QUARTER
  },
  {
    label: '本年',
    value: YEAR
  }
];
const cols = [
  {
    title: '',
    minWidth: '2em',
    align: 'left',
    slotName: 'tableIndex',
    fixed: 'left',
  },
  {
    title: '发起平台',
    prop: 'sendSystemName',
  },
  {
    title: '接收平台',
    prop: 'receiveSystemName',
  },
  {
    title: '发起事项',
    prop: 'sendEventTypeName',
  },
  {
    title: '接收事项',
    prop: 'receiveEventTypeName',
  },
  {
    title: '事件数',
    prop: 'eventNum',
  }
];
const acrossEventSpyPageList = ref<IpostAcrossEventSpyPageSpace.List[]>([]);

const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);

const searchTime = computed(() => {
  let params = {
    startTime: '',
    endTime: ''
  };
  const now = dayjs();
  if (depTimeType.value === DAY) {
    params = {
      startTime: now.startOf('day').format(formatType),
      endTime: now.endOf('day').format(formatType)
    };
  }
  if (depTimeType.value === MONTH) {
    params = {
      startTime: now.startOf('month').format(formatType),
      endTime: now.endOf('month').format(formatType)
    };
    // params = {
    //   endTime: '2023-12-31 23:59:59',
    //   startTime: '2023-01-01 00:00:00'
    // };
  }
  if (depTimeType.value === QUARTER) {
    params = {
      startTime: now.startOf('quarter').format(formatType),
      endTime: now.endOf('quarter').format(formatType)
    };
  }
  if (depTimeType.value === YEAR) {
    params = {
      startTime: now.startOf('year').format(formatType),
      endTime: now.endOf('year').format(formatType)
    };
  }
  return params;
});

// 处理大类走马灯 组装成0-9个一组的二维数组， 不够9个的空补齐
const padWithZeros = (arr: IgetBusEventTypeCardSpace.Data[]) => {
  const chunks = [] as IgetBusEventTypeCardSpace.Data[];
  const chunkSize = 9;
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    if (chunk.length < chunkSize) {
      const diff = chunkSize - chunk.length;
      chunk.push(...Array(diff).fill({
        firstTypeId: '',
        firstTypeName: '',
        thirdTypeNum: ''
      }));
    }
    chunks.push(chunk as any);
  }
  return chunks;
};
const getData = async () => {
  const { data } = await apiFactorManagementObj.getBusEventTypeAnalysis();
  Object.assign(eventTypeAnalysis, data);
  const { data: data1 } = await apiFactorManagementObj.getOtherEventTypeAnalysis();
  Object.assign(inFlowEventTypeAnalysis, data1);
  const { data: data2 } = await apiFactorManagementObj.getOtherEventSystemList();
  inTableData.value = data2;
  const { data: data3 } = await apiFactorManagementObj.getBusEventTypeCard();
  firstTypeList.value = padWithZeros([...data3]);
};
const getCrossList = async () => {
  const params = {
    district: searchParams.district,
    endTime: searchTime.value.endTime,
    pageNum: currentPage.value,
    startTime: searchTime.value.startTime
  };
  const { data } = await apiFactorManagementObj.postAcrossEventSpyPage(params.district, params.endTime, currentPage.value, 10, params.startTime);
  acrossEventSpyPageList.value = data.list;
  total.value = data.total;
};
const next = () => {
  carouselRef.value!.next();
};
const prev = () => {
  carouselRef.value!.prev();
};

const changeDepTimeType = () => {
  currentPage.value = 1;
  getCrossList();
};
const changeMode = () => {
  currentPage.value = 1;
  depModel.value === 2 && getCrossList();
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getCrossList();
};

depModel.value === 2 && getCrossList();
getData();

</script>
<style lang="scss" scoped>
:deep(.carousel-indicators) {
  display: none;
}
</style>
