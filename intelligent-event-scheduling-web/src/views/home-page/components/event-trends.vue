<template>
  <!-- 折线图 -->
  <hl-panel
    class="w-full h-full"
    style="--panel-header-height: calc(var(--xxs) * 18)"
    header-class="gap-xs"
    borderless
    padding="var(--xl)"
    body-style="padding-top: 0px;"
  >
    <template #header>
      <hl-row class="w-full">
        <hl-col span="xxl:col-4 ">
          <hl-group align="items-middle">
            <div class="panel-header-left">
              <hl-icon class="static" type="primary" size="md">
                <FillOrnamentTitle4></FillOrnamentTitle4>
              </hl-icon>
            </div>
            <div class="panel-title">
              <h6 class="title">事件趋势</h6>
            </div>
          </hl-group>
        </hl-col>
        <hl-col span="xxl:col-20 ">
          <hl-group class="w-full" align="items-right" gap="var(--sm)">
            <hl-group gap="var(--xxs)" align="items-middle">
              <span
                style="width: var(--xs); height: calc(var(--xxs) / 2); background: #ff4d4f"
              ></span>
              <p class="font-sm text-secondary">特别重大</p>
            </hl-group>
            <hl-group gap="var(--xxs)" align="items-middle">
              <span
                style="width: var(--xs); height: calc(var(--xxs) / 2); background: #fa8b16"
              ></span>
              <p class="font-sm text-secondary">重大</p>
            </hl-group>
            <hl-group gap="var(--xxs)" align="items-middle">
              <span
                style="width: var(--xs); height: calc(var(--xxs) / 2); background: #f5ee65"
              ></span>
              <p class="font-sm text-secondary">较大</p>
            </hl-group>
            <hl-group gap="var(--xxs)" align="items-middle">
              <span
                style="width: var(--xs); height: calc(var(--xxs) / 2); background: #36a4ff"
              ></span>
              <p class="font-sm text-secondary">一般</p>
            </hl-group>
            <hl-group gap="var(--xxs)" align="items-middle">
              <span
                style="width: var(--xs); height: calc(var(--xxs) / 2); background: #cacfd6"
              ></span>
              <p class="font-sm text-secondary">其他</p>
            </hl-group>
          </hl-group>
        </hl-col>
      </hl-row>
    </template>
    <template #default>
      <div class="w-full" style="height: calc(var(--xxs) * 65)">
        <div ref="chartContainerLine" class="echart-container w-full h-full"></div>
      </div>
    </template>
  </hl-panel>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import { useEChart } from 'hongluan-hooks';
import { apiHomePageApiObj } from '@/apis/modules/home-page';

const { chartContainer: chartContainerLine, setChartOption } = useEChart();

const renderChartLine = (legend: string[], data: any) => {
  const option = {
    grid: {
      top: '10%',
      left: '0%',
      right: '0%',
      bottom: '5%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none',
      },
      extraCssText: 'border-radius: 0;',
    },
    legend: {
      show: false,
    },
    xAxis: {
      axisLabel: {
        fontSize: 12,
        color: 'rgba(0, 0, 0, 0.60)',
        lineHeight: 20,
        margin: 5,
      },
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(128, 128, 160, 0.15)',
        },
      },
      type: 'category',
      data: data.dataX,
    },
    yAxis: {
      splitNumber: 3,
      splitLine: {
        lineStyle: {
          type: 'solid',
          color: 'rgba(128, 128, 160, 0.15)',
        },
      },
      axisLabel: {
        fontSize: 12,
        color: 'rgba(0, 0, 0, 0.60)',
        lineHeight: 20,
      },
      type: 'value',
    },
    dataZoom: [
      {
        height: '4px',
        id: 'dataZoomX',
        type: 'slider',
        xAxisIndex: [0],
        filterMode: 'filter',
        bottom: '2',
        left: '10',
        start: 60,
        end: 100,
        textStyle: false,
      },
    ],
    series: [
      {
        smooth: true,
        itemStyle: {
          color: '#FF4D4F',
        },
        symbolSize: 0,
        lineStyle: {
          width: 1,
        },
        name: '特别重大',
        data: data.val1,
        type: 'line',
      },
      {
        smooth: true,
        itemStyle: {
          color: '#FA8B16',
        },
        symbolSize: 0,
        lineStyle: {
          width: 1,
        },
        name: '重大',
        data: data.val2,
        type: 'line',
      },
      {
        smooth: true,
        itemStyle: {
          color: '#F5EE65',
        },
        symbolSize: 0,
        lineStyle: {
          width: 1,
        },
        name: '较大',
        data: data.val3,
        type: 'line',
      },
      {
        smooth: true,
        itemStyle: {
          color: '#36A4FF',
        },
        symbolSize: 0,
        lineStyle: {
          width: 1,
        },
        name: '一般',
        data: data.val4,
        type: 'line',
      },
      {
        smooth: true,
        itemStyle: {
          color: '#CACFD6',
        },
        symbolSize: 0,
        lineStyle: {
          width: 1,
        },
        name: '其他',
        data: data.val5,
        type: 'line',
      },
    ],
  };
  setChartOption(option);
};

const getStatEventTrendByLevel = async() => {
  const res = await apiHomePageApiObj.getStatEventTrendByLevel();
  const legend = ['特别重大', '重大', '较大', '一般', '其他'];
  const dataX = res.data[0].trend.map((el: any) => el.label);
  const val1 = res.data[0].trend.map((el: any) => el.num);
  const val2 = res.data[1].trend.map((el: any) => el.num);
  const val3 = res.data[2].trend.map((el: any) => el.num);
  const val4 = res.data[3].trend.map((el: any) => el.num);
  const val5 = res.data[4].trend.map((el: any) => el.num);
  renderChartLine(legend, { dataX, val1, val2, val3, val4, val5 });
};

onMounted(async() => {
  await getStatEventTrendByLevel();
});
</script>

<style scoped lang="scss">
.bg-yellow {
  background-color: #f5ee65;
}

.bg-grey {
  background-color: #cacfd6;
}
</style>
