<template>
  <hv-panel title="研判结果">
    <template #action> </template>
    <hl-group align="items-between" class="ornament-title bg-light m-t-lg p-r-md">
      <span>今日研判</span>
    </hl-group>
    <hl-row layout="grid" count="count-2" class="m-t-md" gap="var(--md)">
      <hl-col span="col">
        <hb-data-collect padding="0" gap="var(--md)" full="full-x">
          <hl-icon fill color="#FFA5A5" class="symbol static icon-bg-rhombus-red" size="xl" width="calc(var(--xxs) * 18)" height="calc(var(--xxs) * 18)">
            <h5 class="font-din self-top m-t-sm">{{todayJudge.judgeRate}}%</h5>
          </hl-icon>
          <hl-group dir="vertical">
            <hl-group align="items-middle" gap="var(--xs)">
              <h3 class="title font-din text-warning">{{ todayJudge.judgeNum }}</h3>
              <span>/</span>
              <h3 class="title font-din">{{ todayJudge.totalNum }}</h3>
            </hl-group>
            <span class="text-secondary font-md">研判率</span>
          </hl-group>
        </hb-data-collect>
      </hl-col>
      <hl-col span="col">
        <hb-data-collect padding="0" gap="var(--md)" full="full-x">
          <hl-icon fill color="#FFD0AB" class="symbol static icon-bg-rhombus-orange" size="xl" width="calc(var(--xxs) * 18)" height="calc(var(--xxs) * 18)">
            <h5 class="font-din self-top m-t-sm">{{ todayJudge.judgeRejectRate }}%</h5>
          </hl-icon>
          <hl-group dir="vertical">
            <hl-group align="items-middle" gap="var(--xs)">
              <h3 class="title font-din text-danger">{{ todayJudge.judgeRejectNum }}</h3>
              <span>/</span>
              <h3 class="title font-din">{{todayJudge.totalNum}}</h3>
            </hl-group>
            <span class="text-secondary font-md">误报率</span>
          </hl-group>
        </hb-data-collect>
      </hl-col>
    </hl-row>

    <hl-group align="items-between" class="ornament-title bg-light m-t-lg p-r-md">
      <span>近期研判结果统计</span>
      <hl-radio-group v-model="judgeDays" custom merge indent @change="changeJudge">
        <hl-radio :label="7">
          <hl-button size="sm">近7天</hl-button>
        </hl-radio>
        <hl-radio :label="30">
          <hl-button size="sm">近30天</hl-button>
        </hl-radio>
        <hl-radio :label="365">
          <hl-button size="sm">近一年</hl-button>
        </hl-radio>
      </hl-radio-group>
    </hl-group>

    <hl-radio-group v-model="judgeType" full custom gap="var(--sm)" class="m-t-lg" @change="changeJudge">
      <hl-radio :label="0">
        <hl-button size="sm" block>按研判结果</hl-button>
      </hl-radio>
      <hl-radio :label="1">
        <hl-button size="sm" block>按研判方式</hl-button>
      </hl-radio>
    </hl-radio-group>
    <hl-group full="full-x" class="m-t-lg" style="height: calc(var(--xxs) * 44)">
      <fx-v-pie-chart :chart-data="chartData" height="calc(var(--xxs) * 44)" v-if="chartData.length>0"/>
    </hl-group>
  </hv-panel>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { apiJudgeCenterObj } from '@/apis/modules/judgeCenter';
import { IgetListTimeJudgeResultVOsSpace } from '@/apis/modules/judgeCenter/model';
import { getDaysBetween } from '@/common/utils';

export default defineComponent({
  props: {
    useFor: {
      type: Number,
      defaut: 1
    }
  },
  setup(props) {
    const chartData = ref<IgetListTimeJudgeResultVOsSpace.Data[]>([
      /* {
        label: '真实',
        value: 40,
        color: '#00A3FF',
      },
      {
        label: '误报',
        value: 20,
        color: '#FD892F',
      }, */
    ]);
    const todayJudge = ref({
      judgeNum: 0,
      judgeRate: 0,
      judgeRejectNum: 0,
      judgeRejectRate: 0,
      totalNum: 1
    });
    const judgeDays = ref(7);
    const judgeType = ref(0);

    const getJudgeResult = async() => {
      let chartList = [];
      const { startTime, endTime } = getDaysBetween(judgeDays.value);
      const result = await apiJudgeCenterObj[judgeType.value === 0 ? 'getListTimeJudgeResultVOs' : 'getListTimeJudgeTypeVOs'](props.useFor!, startTime, endTime);
      chartList = result.data.map(item => {
        item.label = item.name;
        item.value = item.num;
        item.color = (item.name === '真实' || item.name === '人工研判') ? '#00A3FF' : '#FD892F';
        return item;
      });
      chartData.value = chartList;
    };

    const initData = async() => {
      const result = await apiJudgeCenterObj.getFindTodayJudgeVO();
      todayJudge.value = result.data;
      getJudgeResult();
    };
    initData();

    const changeJudge = () => {
      chartData.value = [];
      getJudgeResult();
    };

    return {
      chartData,
      todayJudge,
      judgeDays,
      judgeType,
      changeJudge
    };
  },
});
</script>
