<template>
  <div class="ecahrts-wrap" ref="chartContainer"></div>
</template>

<script setup lang="ts">
import { watch, onMounted, ref, PropType } from 'vue'
import * as echarts from 'echarts'
import { useResponsiveChart } from "/@/hooks/ecahrts/use-responsive-chart"
import { useEChart } from "/@/hooks/ecahrts/use-echart"

const props = defineProps({
  xData: {
    type: Array as PropType<{ name: string, max: number }[]>,
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
    type: Array as PropType<number[]>,
    default: () => ['80', '65', '33']
  },
  type: {
    type: String,
    default: () => '1'
  },
  title: {
    type: String,
    default: () => ''
  }
});

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
        "fontSize": 10
      },
      //雷达图的tooltip不会超出div，也可以设置position属性，position定位的tooltip 不会随着鼠标移动而位置变化，不友好
      confine: true,
      appendToBody: true,
      enterable: false, //鼠标是否可以移动到tooltip区域内
      // formatter: (params: any) => {
      //   return `
      //     <div style="backgroundColor:#fff;borderRaduis:0">
      //       ${params.marker}<span style='font-size: 20px;'>外贸依存度 <span style="font-weight: bold; margin-left: 30px">${params.data.value[0]}</span></span><br/>
      //     ${params.marker}<span style='font-size: 20px;'>创业活力 <span style="font-weight: bold; margin-left: 30px">${params.data.value[1]}</span></span><br/>
      //       ${params.marker}<span style='font-size: 20px;'>营商环境 <span style="font-weight: bold; margin-left: 30px">${params.data.value[2]}</span></span><br/>
      //       ${params.marker}<span style='font-size: 20px;'>收支平衡 <span style="font-weight: bold; margin-left: 30px">${params.data.value[3]}</span></span><br/>
      //       ${params.marker}<span style='font-size: 20px;'>快递物流 <span style="font-weight: bold; margin-left: 30px">${params.data.value[4]}</span></span><br/>
      //     </div>
      //     `
      // }
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
      center: ['50%', props.type === '1' ? '56%' : '50%'],
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
      radius: props.type === '1' ? '75%' : '60%',
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
        // name: props.title,
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
              return params.value
            },
            color: '#fff'
          }
        },
        data: [
          {
            value: props.yData
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
  // margin-top: 2%;
  height: 100%;
  width: 100%;
}
</style>
