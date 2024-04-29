<template>
  <hl-dialog
    v-model="dialogVisible"
    title="监测点详情"
    width="960px"
    :append-to-body="true">

    <div class="m-b-md">
      <card :id="pointId" v-if="dialogVisible"/>
    </div>

    <panel
      id="accsss"
      title="已关联指标数据项"
      button-text="关联指标数据"
      :show-edit="isSettingPage"
      @click="handleAddTarget">
      <div class="table-scroll scroll-column">
        <hl-simple-table
        class="w-full"
        :cols="colsFactor"
        :data="targetList"
        border="bordered">
        <template #tableIndex="{ rowIndex }">
          <span>{{ rowIndex + 1 }}</span>
        </template>
        <template #targetTimeList="{ row }">
          <template v-if="!row.targetTimeList?.length">
            <span>--</span>
          </template>
          <template v-else>
            <span v-for="{timeRange, index} in row.targetTimeList" :key="index" style="display: block;">{{ timeRange }}</span>
          </template>
        </template>
        <template #targetDataIsMultiple="{ row }">
          <span v-if="row.targetDataIsMultiple !== undefined">{{ row.targetDataIsMultiple ? '复合' : '简单' }}</span>
          <span v-else>{{ row.isMultiple ? '复合' : '简单' }}</span>
        </template>
        <template #targetFrequency="{ row }">
          <span v-if="!row.targetFrequency">--</span>
          <span v-else>{{ `${getSecondsToUnitTime(row, 'targetFrequencyUnit', 'targetFrequency')} ${row.targetFrequencyUnitName}`}}</span>
        </template>
        <template #targetDataType="{ row }">
          <span>{{ row.targetDataType || row.dataTypeName  }}</span>
        </template>
        <template #isPublic="{ row }">
          <span>{{ row.isPublic ? '是' : '否' }}</span>
        </template>
        <template #targetMeasureUnitName="{ row }">
          <span>{{ row.targetMeasureUnitName || row.measureUnitName  }}</span>
        </template>
        <template #timeScopes="{ row }">
          <span v-if="!Array.isArray(row.timeScopes)">--</span>
          <template v-else>
            <span v-for="time in getTimeScopesArr(row.timeScopes)" :key="time">{{ time }}</span>
          </template>
        </template>
        <template #handle="{ row }">
          <hl-button type="link" @click="handleRemove('target', row.targetDataId)">移除</hl-button>
        </template>
      </hl-simple-table>
      </div>
    </panel>

    <panel
      id="strategy"
      title="已配置策略"
      button-text="关联预警策略"
      :show-edit="isSettingPage"
      @click="handleAddStrategy">
      <div class="table-scroll scroll-column">
        <hl-simple-table
        class="w-full"
        :cols="colsStrategy"
        :data="strategyList"
        border="bordered">
        <template #tableIndex="{ rowIndex }">
          <span>{{ rowIndex + 1 }}</span>
        </template>
        <!--<template #strategyName="{ row }">
          <span class="text-link" style="cursor: pointer;" @click="handleGo(row.strategyId || row.id)">{{ row.strategyName }}</span>
        </template>-->
        <template #isTemplate="{ row }">
          <span>{{ row.isTemplate ? '是' : '否' }}</span>
        </template>
        <template #targetDataNameList="{ row }">
          <hl-group dir="vertical">
            <span v-for="(target, index) in row.targetDataNameList" :key="index">{{ target }}</span>
          </hl-group>
        </template>
        <template #handle="{ row }">
          <hl-button type="link" @click="handleRemove('strategy', row.id || row.strategyId)">移除</hl-button>
        </template>
      </hl-simple-table>
      </div>
    </panel>
  </hl-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { HlMessage } from 'hongluan-ui';
import { apiMonitorPointObj as api } from '@/apis/modules/monitor-unit/index';
import { getSecondsToUnitTime } from '@/common/time';
import { getTimeScopesArr } from './utils';
import { useMonitorUnit } from './hook';
import Panel from './panel.vue';
import Card from './detail-card.vue';

const route = useRoute();
const router = useRouter();
const pointId = ref('');
const anchor = route.query.anchor as string;

const isSettingPage = route.path.includes('setting');

const {
  cardInfo,
  targetList,
  strategyList,
  strategyIdList,
  targetIdList,
  targetDataIdListUsed,
  getRelatedList
} = useMonitorUnit();

const showStrategySelector = ref(false);
const showTargetSelector = ref(false);

const colsFactor = [
  {
    title: '序号',
    minWidth: '4em',
    maxWidth: '4em',
    align: 'left',
    slotName: 'tableIndex',
    fixed: 'left'
  },
  { title: '指标数据项名称', prop: 'targetDataName', minWidth: '12em', fixed: { position: 'left', distance: '4em' } },
  { title: '监测指标', prop: 'targetName', minWidth: '12em' },
  { title: '数据类型', slotName: 'targetDataType', minWidth: '120px' },
  { title: '是否公用', slotName: 'isPublic', minWidth: '4em' },
  { title: '计量单位', slotName: 'targetMeasureUnitName', minWidth: '120px' },
  { title: '计算周期类型', prop: 'computePeriodTypeName', minWidth: '120px' },
  { title: '数据频率', slotName: 'targetFrequency', minWidth: '120px' },
  { title: '数据时间区间', slotName: 'timeScopes' },
  { title: '指标分类', slotName: 'targetDataIsMultiple', minWidth: '120px' },
  { title: '计算公式', prop: 'formulaName', minWidth: '120px' },
];

const colsStrategy = [
  {
    title: '序号',
    minWidth: '4em',
    maxWidth: '4em',
    align: 'left',
    slotName: 'tableIndex'
  },
  { title: '策略名称', prop: 'strategyName', minWidth: '25%' },
  { title: '风险分类', prop: 'eventTypeName', minWidth: '25%' },
  { title: '指标数据项', slotName: 'targetDataNameList' },
  { title: '是否为模板', slotName: 'isTemplate', minWidth: '25%' },
];

if (isSettingPage.value) {
  const action = { title: '操作', slotName: 'handle', align: 'center', width: '80px' };
  colsFactor.push(action);
  colsStrategy.push(action);
}

const handleGo = (id: string) => {
  router.push({
    name: 'monitoringConfigDetails',
    query: {
      title: '预警策略模板',
      id,
      source: 'pointSetting'
    }
  });
};

const handleAddTarget = () => {
  console.log('添加指标');
  showTargetSelector.value = true;
};

const handleAddStrategy = () => {
  console.log('添加策略');
  showStrategySelector.value = true;
};

const handleCloseStrategy = () => {
  showStrategySelector.value = false;
};

const handleCloseTarget = () => {
  showTargetSelector.value = false;
};

const ok = async() => {
  console.log(pointId, targetIdList.value, strategyIdList.value);
  const res = await api.postAddStrategyTarget(pointId.value, targetIdList.value, strategyIdList.value);
  router.go(-1);
};

const handleRemove = (type: string, id: string) => {
  if (type === 'target') {
    if (targetDataIdListUsed.value.includes(id)) {
      console.log('不能删除');
      HlMessage.warning({
        message: '该指标数据项已被策略引用，不能删除！',
      });
    } else {
      targetList.value = targetList.value.filter(item => item.targetDataId !== id);
    }
  } else {
    console.log(id, strategyList.value);
    strategyList.value = strategyList.value.filter(item => item.id !== id && item.strategyId !== id);
  }
};

const init = async() => {
  await getRelatedList(pointId.value);
  const element = document.querySelector(`#${anchor}`);
  nextTick(() => {
    element?.scrollIntoView({ behavior: 'smooth' });
  });
};

const dialogVisible = ref(false);
const openDialog = async(data: any) => {
  console.log(data);
  pointId.value = data.unitId || data.pointId;
  init();
  await nextTick();
  dialogVisible.value = true;
};

// 需要暴露出去给父组件调用
defineExpose({ openDialog });
</script>

<style lang="scss">
  #accsss .hl-simple-table tr th.fixed-right, #accsss .hl-simple-table tr th.fixed-left {
    background-color: rgba(56,75,103, 1);
  }
</style>
