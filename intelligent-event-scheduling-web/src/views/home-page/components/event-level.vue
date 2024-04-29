<template>
  <!-- 饼图 -->
  <hl-panel
    class="w-full content h-full"
    style="--panel-header-height: calc(var(--xxs) * 18)"
    header-class="gap-xs content"
    borderless
    padding="var(--xl)"
    body-class="content"
    body-style="padding-top: 0px;"
  >
    <template #header>
      <hl-group style="height: calc(var(--xxs) * 18)" align="items-middle">
        <div class="panel-header-left">
          <hl-icon class="static" type="primary" size="md">
            <FillOrnamentTitle4></FillOrnamentTitle4>
          </hl-icon>
        </div>
        <div class="panel-title">
          <h6 class="title">事件等级占比</h6>
        </div>
      </hl-group>
      <!-- <div class="panel-header-right">
                    <hl-tabs class="static" type="button">
                      <hl-tab-pane label="事件等级"></hl-tab-pane>
                      <hl-tab-pane label="事件类型"></hl-tab-pane>
                    </hl-tabs>
                  </div> -->
    </template>
    <hl-group class="w-full" align="items-center items-middle" gap="var(--xs)">
      <div style="height: calc(var(--xxs) * 60); flex: 1">
        <div ref="chartContainerPie" class="echart-container w-full h-full"></div>
      </div>
      <hl-group
        align="items-left items-top"
        dir="vertical"
        gap="var(--sm)"
        style="width: calc(var(--xxs) * 49)"
      >
        <hl-group
          v-for="item in eventRatio"
          :key="item.eventLevelName"
          align="items-left items-middle"
          class="static"
          gap="var(--xs)"
        >
          <div
            :class="setLegend(item.eventLevelName)"
            style="width: var(--sm); height: var(--sm)"
          ></div>
          <div class="text-secondary static" style="width: calc(var(--xxs) * 15)">
            {{ item.eventLevelName }}
          </div>
          <h4 class="text-regular">{{ item.num }}</h4>
        </hl-group>
      </hl-group>
    </hl-group>
  </hl-panel>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useEChart } from 'hongluan-hooks';
import { apiHomePageApiObj } from '@/apis/modules/home-page';
import { useHome } from '../use-home';

const { chartContainer: chartContainerPie, setChartOption: setChartOptionPie } = useEChart();
const { setLegend } = useHome();

const eventRatio = ref([] as Record<string, any>);

const renderChartPie = (total: number) => {
  const option = {
    title: {
      text: total,
      subtext: '事件总数',
      top: '38%',
      left: 'center',
      textStyle: {
        color: '#202020',
        fontSize: 16,
        fontWeight: 'bold',
      },
      subtextStyle: {
        color: '#9E9E9E',
        fontSize: 14,
      },
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['60%', '90%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        z: 2,
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        data: eventRatio.value,
        itemStyle: {
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      },
    ],
  };
  setChartOptionPie(option);
};

const getStatEventRatioByLevel = async() => {
  const map = new Map([
    ['特别重大', '#FF4D4F'],
    ['重大', '#FA8B16'],
    ['较大', '#F5EE65'],
    ['一般', '#36A4FF'],
    ['其他', '#CACFD6'],
  ]);
  const res = await apiHomePageApiObj.getStatEventRatioByLevel();
  let totle = 0;
  res.data.forEach((el: any) => {
    el.value = el.num;
    el.name = el.eventLevelName;
    el.itemStyle = {
      color: map.get(el.eventLevelName),
    };
    totle += +el.num;
  });
  eventRatio.value = res.data;
  renderChartPie(totle);
};

onMounted(async() => {
  await getStatEventRatioByLevel();
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
