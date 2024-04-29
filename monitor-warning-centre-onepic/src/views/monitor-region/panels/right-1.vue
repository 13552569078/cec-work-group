<template>
  <hv-panel :title="`${systemName}分析`">
    <template #action>
      <hl-radio-group v-model="searchType" custom merge indent @change="initData">
        <hl-radio :label="7">
          <hl-button size="sm">近7天</hl-button>
        </hl-radio>
        <hl-radio :label="30">
          <hl-button size="sm">近30天</hl-button>
        </hl-radio>
        <!-- <hl-radio :label="365">
          <hl-button size="sm">近一年</hl-button>
        </hl-radio> -->
      </hl-radio-group>
    </template>

    <hb-data-collect gap="var(--sm)" full class="border m-t-lg">
      <cite class="dom-frame"><cite class="dom-frame"></cite></cite>
      <hl-icon type="level1`" effect="light" fill class="symbol static" size="lg" padding="var(--sm)">
        <fill-Firm />
      </hl-icon>
      <span class="w-full">接入数据</span>
      <hl-group class="static" gap="var(--xs)">
        <h2 class="font-din relative" data-suffix="条">{{ accessData }}</h2>
      </hl-group>
    </hb-data-collect>

    <hl-group align="items-between" class="ornament-title bg-light m-t-lg p-r-md">
      <span>{{ systemName }}信息</span>
      <hl-group align="items-middle" class="static" gap="var(--sm)">
        <hl-group align="items-middle" gap="var(--sm)">
          <span>共</span>
          <span class="text-primary relative" data-suffix="条">{{ alarmNumber }}</span>
        </hl-group>
      </hl-group>
    </hl-group>
    <hl-group full class="m-t-md">
      <fx-v-scrolling-bar-chart :chart-data="chartData" height="cacl(var(--xxs) * 120)" :bar-style="{ color: 'linear-gradient(90deg, rgba(114,245,172,0.16) 0%, #72F5AC 100%)', width: '1em', backgroundColor: 'rgba(47,71,110,0.12)' }" />
    </hl-group>

    <hl-group align="items-between" class="ornament-title bg-light m-t-lg p-r-md">
      <span>{{ systemName }}研判</span>
      <hl-group align="items-middle" class="static" gap="var(--sm)">
        <hl-group align="items-middle" gap="var(--sm)">
          <span>共</span>
          <span class="text-primary relative" data-suffix="条">{{ warningJudge.judgeNumber }}</span>
        </hl-group>
      </hl-group>
    </hl-group>

    <hl-group class="m-t-md" full="full-x" gap="var(--sm)">
      <hl-group dir="vertical" align="items-middle" full class="p-xxs border border-dark transition">
        <h2 class="font-din m-b-xxs text-warning">{{ warningJudge.autoJudgeNumber }}</h2>
        <hl-group full align="items-center" class="p-t-xxs p-b-xxs text-secondary" style="background-color: rgba(var(--rgb-bg-light), 0.24)" gap="var(--xxs)"> 自动研判 </hl-group>
      </hl-group>
      <hl-group dir="vertical" align="items-middle" full class="p-xxs border border-dark transition">
        <h2 class="font-din m-b-xxs text-success">{{ warningJudge.manualJudgeNumber }}</h2>
        <hl-group full align="items-center" class="p-t-xxs p-b-xxs text-secondary" style="background-color: rgba(var(--rgb-bg-light), 0.24)" gap="var(--xxs)"> 人工研判 </hl-group>
      </hl-group>
      <hl-group dir="vertical" align="items-middle" full class="p-xxs border border-dark transition">
        <h2 class="font-din m-b-xxs text-danger">{{ warningJudge.judgeRejectNumber }}</h2>
        <hl-group full align="items-center" class="p-t-xxs p-b-xxs text-secondary" style="background-color: rgba(var(--rgb-bg-light), 0.24)" gap="var(--xxs)"> 其中误报 </hl-group>
      </hl-group>
    </hl-group>

    <hl-group align="items-between" class="ornament-title bg-light m-t-lg p-r-md">
      <span>{{ systemName }}处置</span>
      <hl-group align="items-middle" class="static" gap="var(--sm)">
        <hl-group align="items-middle" gap="var(--sm)">
          <span>共</span>
          <span class="text-primary relative" data-suffix="条">{{ warningHandle.handleNumber }}</span>
        </hl-group>
      </hl-group>
    </hl-group>

    <hl-group class="m-t-md" full="full-x" gap="var(--sm)">
      <hl-group dir="vertical" align="items-middle" full class="p-xxs border border-dark transition">
        <h2 class="font-din m-b-xxs text-warning">{{ warningHandle.autoHandleNumber }}</h2>
        <hl-group full align="items-center" class="p-t-xxs p-b-xxs text-secondary" style="background-color: rgba(var(--rgb-bg-light), 0.24)" gap="var(--xxs)"> 自动办结 </hl-group>
      </hl-group>
      <hl-group dir="vertical" align="items-middle" full class="p-xxs border border-dark transition">
        <h2 class="font-din m-b-xxs text-success">{{ warningHandle.eventCenterHandleNumber }}</h2>
        <hl-group full align="items-center" class="p-t-xxs p-b-xxs text-secondary" style="background-color: rgba(var(--rgb-bg-light), 0.24)" gap="var(--xxs)"> 事件中心办结 </hl-group>
      </hl-group>
      <hl-group dir="vertical" align="items-middle" full class="p-xxs border border-dark transition">
        <h2 class="font-din m-b-xxs text-danger">{{ warningHandle.handlingNumber }}</h2>
        <hl-group full align="items-center" class="p-t-xxs p-b-xxs text-secondary" style="background-color: rgba(var(--rgb-bg-light), 0.24)" gap="var(--xxs)"> 处置中 </hl-group>
      </hl-group>
    </hl-group>
  </hv-panel>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, inject } from 'vue';
import { useLoop } from '@/hooks';
import { getDaysBetween } from '@/common/utils';
import { apiRegionAlarmObj } from '@/apis/modules/regionAlarm';
import { IgetFindRegionAlarmJudgeSpace, IgetFindRegionAlarmHandleSpace, IgetFindRegionAlarmInfoSpace } from '@/apis/modules/regionAlarm/model';

interface IwarningInfo {
  value: number;
  label: string;
}

const props = defineProps({
  regionId: {
    type: Number
  }
});

const { setLoop } = useLoop();

const searchType = ref(7);
const chartData = ref<IwarningInfo[]>([]);
// 接入数据
const accessData = ref();
// 报警研判
const warningJudge = ref({} as IgetFindRegionAlarmJudgeSpace.Data);
// 报警处置
const warningHandle = ref({} as IgetFindRegionAlarmHandleSpace.Data);
// 报警信息
const warningInfo = reactive({
  alarmNumber: 0,
  alarmInfoList: [] as IgetFindRegionAlarmInfoSpace.AlarmInfoList[]
});
const systemName = ref(inject('systemName'));

const initData = async() => {
  const { startTime, endTime } = getDaysBetween(searchType.value);
  const searchParams = {
    startTime,
    endTime,
    regionId: props.regionId
  };
  // 接入数据
  const { data } = await apiRegionAlarmObj.getFindRegionAccessData(searchParams);
  accessData.value = data;
  // 研判数据
  const { data: data1 } = await apiRegionAlarmObj.getFindRegionAlarmJudge(searchParams);
  warningJudge.value = data1;
  // 报警处置
  const { data: data2 } = await apiRegionAlarmObj.getFindRegionAlarmHandle(searchParams);
  warningHandle.value = data2;
  // 报警信息
  const { data: data3 } = await apiRegionAlarmObj.getFindRegionAlarmInfo(searchParams);
  warningInfo.alarmNumber = data3.alarmNumber;
  chartData.value = data3.alarmInfoList.map((item: IgetFindRegionAlarmInfoSpace.AlarmInfoList) => {
    const _itms = {
      label: item.codeName || '未知',
      value: item.value || 0
    };
    return _itms;
  });
};

initData();

setLoop(initData, 60);

// setup toRefs
const { alarmNumber, alarmInfoList } = toRefs(warningInfo);
</script>
