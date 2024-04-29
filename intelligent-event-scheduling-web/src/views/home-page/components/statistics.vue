<template>
  <hl-panel
    class="h-full"
    style="--panel-header-height: calc(var(--xxs) * 15.5)"
    header-style="gap: 0px;"
    borderless
    padding="var(--xl)"
    header-class="p-y-lg p-x-xl bg-content"
    body-class="display-flex items-center items-middle flex-row gap-sm p-t-xxs p-x-xl bg-content"
    body-style="padding-bottom: 20px;"
  >
    <template #header>
      <div class="panel-header-left">
        <hl-icon class="static" type="primary" size="md">
          <FillOrnamentTitle4></FillOrnamentTitle4>
        </hl-icon>
      </div>
      <div class="panel-title">
        <h6 class="text-title">处置统计</h6>
      </div>
    </template>
    <hl-group class="w-full" gap="var(--sm)" dir="vertical">
      <hl-group class="w-full" gap="var(--lg)" style="height: calc(var(--xxs) * 16)">
        <hl-group class="p-md bg-primary-light-5 w-full" align="items-middle" gap="var(--xs)">
          <hl-group class="w-full" align="items-middle" gap="var(--xs)">
            <hl-icon
              fill
              class="static radius-lg"
              type="primary"
              style="width: calc(var(--xxs) * 8)"
            >
              <FillBuilding></FillBuilding>
            </hl-icon>
            <span class="static text-secondary">参与处置单位</span>
          </hl-group>
          <span class="text-regular font-xxl font-bold text-center">
            {{
              statTask.length && statTask.filter((el: any) => el.typeName === "参与处置单位").length
                ? statTask.filter((el: any) => el.typeName === "参与处置单位")[0].count
                : 0
            }}
          </span>
        </hl-group>
        <hl-group class="p-md bg-primary-light-5 w-full" align="items-middle" gap="var(--xs)">
          <hl-group class="w-full" align="items-middle" gap="var(--xs)">
            <hl-icon
              fill
              class="static radius-lg"
              type="primary"
              style="width: calc(var(--xxs) * 8)"
            >
              <FillUser></FillUser>
            </hl-icon>
            <span class="static text-secondary">参与处置人员</span>
          </hl-group>
          <span class="text-regular font-xxl font-bold text-center">
            {{
              statTask.length && statTask.filter((el: any) => el.typeName === "参与处置人员").length
                ? statTask.filter((el: any) => el.typeName === "参与处置人员")[0].count
                : 0
            }}
          </span>
        </hl-group>
      </hl-group>
      <!-- charts -->
      <hl-group class="w-full h-full" align="items-middle" style="justify-content: center">
        <div style="width: calc(var(--xxs) * 50); height: calc(var(--xxs) * 50)">
          <div ref="chartContainerDouble" class="echart-container w-full h-full"></div>
        </div>
        <hl-group
          dir="vertical"
          gap="var(--sm)"
          style="width: calc(var(--xxs) * 30); margin-left: calc(var(--xxs) * 14)"
        >
          <hl-group
            v-for="item in statTaskLengend"
            :key="item.typeName"
            gap="var(--xs)"
            align="items-left items-middle"
          >
            <template v-if="['未响应', '已终止', '已完成', '执行中'].includes(item.typeName)">
              <div
                :class="setLegend(item.typeName)"
                style="width: var(--sm); height: var(--sm)"
              ></div>
              <div class="text-secondary static" style="width: calc(var(--xxs) * 15)">
                {{ item.typeName }}
              </div>
              <h4 class="text-regular">{{ item.count }}</h4>
            </template>
          </hl-group>
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

const { chartContainer: chartContainerDouble, setChartOption: setChartOptionDouble } = useEChart();
const { setLegend } = useHome();

const statTask = ref([] as Record<string, any>);
const statTaskLengend = ref([] as Record<string, any>);

const renderChartDouble = (total: number, reate: number, data: Record<string, any>) => {
  const option = {
    title: {
      text: total,
      subtext: `任务进展${reate}`,
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
        name: '案例4',
        type: 'pie',
        radius: ['80%', '90%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        z: 2,
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        data: data.map((el: any) => {
          return {
            value: el.value,
            name: el.name,
            itemStyle: {
              color:
                el.name === '执行中'
                  ? '#36A4FF'
                  : el.name === '未响应'
                    ? '#FA8B16'
                    : el.name === '已终止'
                      ? '#FF4D4F'
                      : '#4CC09E',
            },
          };
        }),
        itemStyle: {
          borderWidth: 4,
          borderColor: '#ffffff',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.1)',
          },
        },
      },
      {
        name: '案例4',
        type: 'pie',
        radius: ['60%', '90%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        z: 1,
        label: {
          show: false,
        },
        itemStyle: {
          borderWidth: 4,
          borderColor: '#ffffff',
        },
        data: data.map((el: any) => {
          return {
            value: el.value,
            name: el.name,
            itemStyle: {
              color:
                el.name === '执行中'
                  ? '#A3DEFF'
                  : el.name === '未响应'
                    ? 'rgba(250,139,22,0.16)'
                    : el.name === '已终止'
                      ? '#FFD3CD'
                      : '#C9F1EB',
            },
          };
        }),
      },
    ],
  };
  setChartOptionDouble(option);
};
const getStatTask = async() => {
  const res = await apiHomePageApiObj.getStatTask();
  statTask.value = res.data;

  const data = res.data.filter((el: any) => {
    return ['未响应', '已终止', '已完成', '执行中'].includes(el.typeName);
  });
  statTaskLengend.value = data;
  data.forEach((el: any, index: number) => {
    el.value = el.count;
    el.name = el.typeName;
  });
  renderChartDouble(statTask.value[2].count, statTask.value[7].count, data);
};
onMounted(async() => {
  await getStatTask();
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
