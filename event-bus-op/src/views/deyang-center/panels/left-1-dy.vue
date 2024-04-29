<template>
  <hv-panel title="管理要素">
    <template #action>
      <div class="icon" @click="factorAnalysisVisible = true"/>
    </template>
    <hl-group full="full-x" gap="calc(var(--xxs) * 15/4)">
      <hl-group class="card-item p-t-xs" dir="vertical" align="items-center items-middle">
        <div class="label">统一事项类目(类)</div>
        <div class="value">{{ eventTypeAnalysis?.busEventThirdTypeNum }}</div>
      </hl-group>
      <hl-group class="card-item p-t-xs" dir="vertical" align="items-center items-middle">
        <div class="label">流入事项(类)</div>
        <div class="value">{{ eventTypeAnalysis?.otherEventThirdTypeNum }}</div>
      </hl-group>
      <hl-group class="card-item p-t-xs" dir="vertical" align="items-center items-middle">
        <div class="label">跨部门事项(类)</div>
        <div class="value">{{ eventTypeAnalysis?.acrossEventTypeNum }}</div>
      </hl-group>
    </hl-group>
    <simple-title title="跨部门事项运行监控" class="m-t-md" />
    <!-- 跨部门 -->
    <scroll-table :cols="cols" :table-data="tableData" class="m-t-xxs" :height="'calc(var(--xxs) * 130/4)'" />
  </hv-panel>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { pick } from 'lodash-es';
import { useGlobalState } from '@/hooks';
import { apiFactorManagementObj } from '@/apis';
import { IgetEventTypeAnalysisSpace, IpostAcrossEventSpySpace } from '@/apis/modules/dy-factor-management/model';

// 要素分析 卡片统计
const eventTypeAnalysis = reactive<IgetEventTypeAnalysisSpace.Data>({
  'acrossEventTypeNum': 0,
  'busEventThirdTypeNum': 0,
  'otherEventThirdTypeNum': 0
});
const cols = [
  {
    label: '发起平台',
    key: 'sendSystemName',
  },
  {
    label: '接收平台',
    key: 'receiveSystemName',
  }, {
    label: '发起事项',
    key: 'sendEventTypeName',
  },
  {
    label: '接收事项',
    key: 'receiveEventTypeName',
  }, {
    label: '事件数',
    key: 'eventNum',
  }
];
const tableData = ref<IpostAcrossEventSpySpace.Data[]>([]);

const getEventTypeAnalysis = async () => {
  const { data } = await apiFactorManagementObj.getEventTypeAnalysis();
  Object.assign(eventTypeAnalysis, data);
};
const postAcrossEventSpy = async (params:any) => {
  const searchParams = pick(params, 'startTime', 'endTime', 'district');
  const { data } = await apiFactorManagementObj.postAcrossEventSpy(searchParams.district, searchParams.startTime, searchParams.endTime);
  tableData.value = data;
};

// immediate 默认初始化查询
const { factorAnalysisVisible } = useGlobalState({
  handleWatch: (params: any) => {
    getEventTypeAnalysis();
    postAcrossEventSpy({ ...params });
  },
  immediate: true,
});

</script>
<style scoped lang="scss">
.icon {
  width: calc(var(--xxs) * 6);
  height: calc(var(--xxs) * 6);
  background-image: url('@/assets/images/deyang/center/left1-icon.png');
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  top: calc(var(--md));
  cursor: pointer;
}

.card-item {
  width: calc(var(--xxs) * 167/4);
  height: calc(var(--xxs) * 56/4);
  background-image: url('@/assets/images/deyang/center/left1-card-bg.png');
  background-repeat: no-repeat;
  background-size: contain;

  .label {
    font-size: calc(var(--xxs) * 14/4);
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #DDF2FF;
  }

  .value {
    font-size: calc(var(--xxs) * 18/4);
    font-family: PangMenZhengDao;
    letter-spacing: 1px;
    background: linear-gradient(180deg, #FFFFFF 0%, #34E9B7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
