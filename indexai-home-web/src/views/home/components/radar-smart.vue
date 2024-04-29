<template>
  <div class="ecahrts-wrap" ref="chartContainer"></div>
</template>

<script setup lang="ts">
import { watch, onMounted, ref, PropType } from 'vue'
import { useRoute } from 'vue-router'
import * as echarts from 'echarts'
import { useResponsiveChart } from "/@/hooks/ecahrts/use-responsive-chart"
import { useEChart } from "/@/hooks/ecahrts/use-echart"

const props = defineProps({
  xData: {
    type: Array as PropType<any[]>,
    default: () => [
      {
        name: '年度贡献份额',
        max: 100
      },
      {
        name: '年度论\n文数',
        max: 100
      },
      {
        name: '占地区\n贡献份\n额比(%)',
        max: 100
      }
    ]
  },
  yData: {
    type: Array as PropType<any[]>,
    default: () => ['80', '65', '33']
  },
  title: {
    type: String,
    default: () => ''
  }
});

const rankList = [
  {
    label: 'AAA',
    value: '10'
  },
  {
    label: 'AA',
    value: '9'
  },
  {
    label: 'A',
    value: '8'
  },
  {
    label: 'BBB',
    value: '7'
  },
  {
    label: 'BB',
    value: '6'
  },
  {
    label: 'B',
    value: '5'
  },
  {
    label: 'CCC',
    value: '4'
  },
  {
    label: 'CC',
    value: '3'
  },
  {
    label: 'C',
    value: '2'
  },
  {
    label: 'D',
    value: '1'
  }
]

const getValue = (key: string) => {
  return rankList.filter((item) => {
    return item.label === key
  })[0].value
}
const getKeys = (value: string) => {
  return rankList.filter((item) => {
    return item.value === value
  })[0].label
}

const { updateOptionToResponsive } = useResponsiveChart();
const { chartContainer, setChartOption, resizeChart } = useEChart();


watch(
  () => props.xData,
  () => {
    renderChart();
  },
  {
    deep: true
  }
);


const renderChart = () => {
  const option = {
    tooltip: {
      "textStyle": {
        "fontSize": 12
      },
      appendToBody: true,
      //雷达图的tooltip不会超出div，也可以设置position属性，position定位的tooltip 不会随着鼠标移动而位置变化，不友好
      confine: true,
      enterable: false, //鼠标是否可以移动到tooltip区域内
      formatter: (params: any) => {
        return `
         <div>模型详情</div>
         <div style='font-size: 10px;'>智慧城市评级: ${getKeys(params.data.value[0])}\n</div>
         <div style='font-size: 10px;'>基础建设评级: ${getKeys(params.data.value[1])}\n</div>
         <div style='font-size: 10px;'>科技应用评级: ${getKeys(params.data.value[2])}\n</div>
          `
      }
    },
    radar: {
      name: {
        textStyle: {
          color: '#ffffff',
          fontSize: 12,
          borderRadius: 3,
          padding: [-10, 10]
        }
      },
      shape: 'polygon',
      center: ['50%', '56%'],
      axisLine: {
        lineStyle: {
          color: 'rgba(55, 67, 127, 1)'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          width: 1,
          color: 'rgba(55, 67, 127, 1)' // 设置网格的颜色
        }
      },
      indicator: props.xData,
      splitArea: {
        show: false
      },
      radius: '75%',
    },
    grid: {
      position: 'center'
    },
    polar: {
      center: ['50%', '50%'], // 默认全局居中
      radius: '0%'
    },
    angleAxis: {
      min: 0,
      interval: 2,
      clockwise: false,
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    radiusAxis: {
      min: 0,
      interval: 12,
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: '模型详情',
        type: 'radar',
        symbol: 'circle', // 拐点的样式，还可以取值'rect','angle'等
        symbolSize: 5, // 拐点的大小
        itemStyle: {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            color: 'rgba(0, 248, 255, 0.32)'
          }
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(0, 248, 255, 0.32)'
            },
            {
              offset: 0.8,
              color: 'rgba(0, 248, 255, 0)'
            }
          ])
        },
        lineStyle: {
          width: 2,
          color: 'rgba(0, 248, 255, 0.32)'
        },
        label: {
          normal: {
            show: true,
            position: 'right',
            fontSize: 12,
            formatter: (params: { value: string }) => {
              return getKeys(params.value)
            },
            color: '#fff'
          }
        },
        data: [
          {
            value: [
              getValue(props.yData[0].智慧城市评级),
              getValue(props.yData[0].基础建设评级),
              getValue(props.yData[0].科技应用评级)
            ]
          }
        ]
      }
    ]
  }
  updateOptionToResponsive(option)
  setChartOption(option);
  nextTick(() => {
    resizeChart();
  });
}

onMounted(() => {
  props.xData.length && renderChart();
})

</script>

<style lang="scss" scoped>
.ecahrts-wrap {
  height: 100%;
  width: 100%;
}
</style>
