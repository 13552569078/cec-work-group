<template>
  <hl-group full dir="vertical" gap="var(--md)">
    <hl-group class="font-lg p-l-lg">提示：{{ rainInfo.msg }}</hl-group>
    <hl-group style="height: calc(var(--xl) * 20">
      <div class="w-full h-full" ref="charDom"></div>
    </hl-group>
    <hl-group gap="var(--xxl)" class="font-lg p-l-lg">
      <hl-group>
        <hl-group>小雨：</hl-group>
        <hl-group>0.0 &lt; 雨强 &lt; 2.5</hl-group>
      </hl-group>
      <hl-group>
        <hl-group>中雨：</hl-group>
        <hl-group>2.5 ≤ 雨强 &lt; 8.0</hl-group>
      </hl-group>
      <hl-group>
        <hl-group>大雨：</hl-group>
        <hl-group>8.0 ≤ 雨强 &lt; 16.0</hl-group>
      </hl-group>
      <hl-group>
        <hl-group>暴雨：</hl-group>
        <hl-group>雨强 ≥ 16.0</hl-group>
      </hl-group>
    </hl-group>
  </hl-group>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useEChart } from 'hongluan-hooks';
import { IgetGetNowCastingSpace } from '@/apis/modules/weather/model';
import { apiWeatherObj } from '@/apis/modules/weather';
import { dateFormat } from '@/common/utils';

const { setChartOption, chartContainer } = useEChart();
const store = useStore();

const props = defineProps({
  long: {
    type: String
  },
  lat: {
    type: String
  }
});

watch(
  () => [props.long, props.lat],
  () => {
    getRainInfo();
  }
);

const charDom = chartContainer;
const data: IgetGetNowCastingSpace.Data = {
  msg: '近2小时内不会下雪的，放心出门吧',
  startTime: '',
  endTime: '',
  series: []
};
const rainInfo = ref<IgetGetNowCastingSpace.Data>(data);

// 获取接口信息
const getRainInfo = async() => {
  const res = await apiWeatherObj.getGetNowCasting(`${props.long},${props.lat}`);

  rainInfo.value = res.data;
  const { startTime, endTime, series } = res.data;

  let xData = [];
  const yData = series;
  if (startTime && endTime) {
    xData = getTwoTimeList(startTime, endTime);
    initChart(xData, yData);
  }
};
// 获取x轴时间数组
const getTwoTimeList = (beginTime: string, endTime: string) => {
  const intervaltime = (new Date(endTime).getTime() - new Date(beginTime).getTime()) / 1000 / 60;
  const timeList = [];
  for (let i = 0; i <= intervaltime; i++) {
    const time = new Date(beginTime).getTime() + i * 1000 * 60;

    timeList.push(dateFormat(new Date(time), 'hh:mm'));
  }
  return timeList;
};
// 初始化图表
const initChart = (xData: string[], yData: string[]) => {
  const option = {
    // backgroundColor: "#0f375f",
    grid: {
      left: '8%',
      right: '3%',
      top: '0%',
      bottom: '0%'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLine: {
        // 坐标轴轴线相关设置。数学上的x轴
        show: true,
        lineStyle: {
          color: '#0158A1'
        }
      },
      axisLabel: {
        // 坐标轴刻度标签的相关设置
        textStyle: {
          color: '#BFE0FF'
          // margin: 15,
        }
        // formatter: function(data) {
        //   return data + "时";
        // }
      },
      axisTick: {
        show: false
      },

      data: xData
    },
    yAxis: {
      type: 'value',
      show: false,
      splitNumber: 500
    },

    series: [
      {
        name: '雨强',
        data: yData,
        color: '#02B4FE',
        // symbolSize: 10,
        //  itemStyle: {
        //     borderWidth: 2,
        //     borderColor: '#02B4FE',
        //     color: 'none'
        // },
        type: 'line',
        smooth: true,
        markLine: {
          symbol: 'none',
          silent: true,
          lineStyle: {
            normal: {
              type: 'dashed'
            },
            color: 'rgba(2, 177, 251, 0.6)'
          },
          label: {
            show: false,
            position: 'start',
            formatter: '小雨'
          },
          data: [
            {
              yAxis: 2.5,
              label: {
                show: true,
                formatter: '小雨',
                padding: [30, 10, 0]
              }
            },
            {
              yAxis: 8,
              label: {
                show: true,
                formatter: '中雨',
                padding: [60, 10, 0]
              }
            },
            {
              yAxis: 16,
              label: {
                show: true,
                formatter: '大雨',
                padding: [80, 10, 0]
              }
            },
            {
              yAxis: 16,
              label: {
                show: true,
                formatter: '暴雨',
                padding: [-80, 10, 0]
              }
            }
          ]
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: ' rgba(2, 179, 253, 0.05)' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(2, 177, 251, 0.2)' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        }
      }
    ]
  };
  setChartOption(option);
};

onMounted(() => {
  getRainInfo();
});
</script>
