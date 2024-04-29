<template>
  <hv-panel title="研判分析">
    <template #action> </template>
    <hl-group align="items-between" class="ornament-title bg-light m-t-lg p-r-md">
      <span>待人工研判</span>
      <hl-group align="items-middle" class="static" gap="var(--sm)">
        <hl-group align="items-middle" gap="var(--xxs)">
          <span class="text-secondary">共</span>
          <span class="text-primary relative" data-suffix="条">{{ total }}</span>
        </hl-group>
      </hl-group>
    </hl-group>
    <hl-radio-group v-model="judgeType" full custom gap="var(--sm)" class="m-t-md" @change="changeJudgeType">
      <hl-radio :label="0">
        <hl-button size="sm" block>按{{ systemName }}类型</hl-button>
      </hl-radio>
      <hl-radio :label="1">
        <hl-button size="sm" block>按监测主体</hl-button>
      </hl-radio>
    </hl-radio-group>
    <div style="height: calc(var(--xxs) * 50);">
      <fx-v-column-chart :chart-data="chartData" :is-vertical="false" :show-count="5" :scroll-count="4" :bar-width="8" :bar-color="['#72F5AC', 'rgba(114,245,172,0.16)']" style="height: calc(var(--xxs) * 50)" v-if="chartData.length > 0 && judgeType == 0" />
      <fx-v-scrolling-bar-chart
        :chart-data="chartData"
        style="height: calc(var(--xxs) * 50);"
        :bar-style="{
          color: 'linear-gradient(90deg, rgba(114,245,172,0.16) 0%, #72F5AC 100%)',
          width: '1em',
          backgroundColor: 'rgba(47,71,110,0.12)'
        }"
        v-if="chartData.length > 0 && judgeType == 1"
      />
    </div>
  </hv-panel>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from 'vue';
import { useLoop } from '@/hooks';
import { apiJudgeCenterObj } from '@/apis/modules/judgeCenter';
import { IgetListManualUnJudgeEventTypeVOsSpace } from '@/apis/modules/judgeCenter/model';

export default defineComponent({
  props: {
    useFor: {
      type: Number,
      defaut: 1
    }
  },
  setup(props) {
    const { setLoop } = useLoop();
    const chartData = ref<IgetListManualUnJudgeEventTypeVOsSpace.Data[]>([
      /* { label: '应急救援', value: 20 },
      { label: '消防队伍', value: 60 },
      { label: '防汛抢险', value: 40 },
      { label: '医疗救护', value: 90 },
      { label: '社会救援', value: 60 },
      { label: '应急救援', value: 70 },
      { label: '消防队伍', value: 10 },
      { label: '防汛抢险', value: 50 },
      { label: '医疗救护', value: 10 },
      { label: '社会救援', value: 50 }, */
    ]);

    const total = ref(0);
    const judgeType = ref(0);
    const systemName = ref(inject('systemName'));

    const getChartData = async(type: number) => {
      let chartList = [];
      const result = await apiJudgeCenterObj[type === 0 ? 'getListManualUnJudgeEventTypeVOs' : 'getListManualUnJudgeObjectTypeVOs']();
      chartList = result.data.map(item => {
        item.label = item.name;
        item.value = item.num;
        return item;
      });
      if (type === 1)chartList = chartList.filter(item => { return item.value !== 0; });
      chartData.value = chartList;
    };
    const changeJudgeType = (type: number) => {
      chartData.value = [];
      getChartData(type);
    };

    const initData = async() => {
      const result = await apiJudgeCenterObj.getFindManualUnJudgeEventNum();
      total.value = result.data;

      getChartData(0);
    };

    initData();

    setLoop(initData, 60);
    return {
      chartData,
      total,
      judgeType,
      changeJudgeType,
      systemName
    };
  }
});
</script>
<style lang="scss" scoped>
:deep(.bar-item .value){
  margin-right: var(--xs);
}
</style>
