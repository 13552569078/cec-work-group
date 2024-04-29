<template>
  <div ref="chartContainer" class="echart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, PropType, watch } from 'vue';
import * as echarts from 'echarts';
import { echartsSize, ECHARTS_RESPONSE_LIST } from '@/common';
import { useEChart } from 'hongluan-hooks';
import { isEmpty } from 'lodash-es';
import { useResponsiveChart } from 'fx-front-framework';
import { IpostAssignedDestStatSpace } from '@/apis/modules/index-page-pending/model';
import { composeEventHandlers } from 'hongluan-ui/es/utils';

const props = defineProps({
  chartData: {
    type: Array as PropType<IpostAssignedDestStatSpace.Data[]>,
    default: () => [
      {
        platform: '市级事件总线',
        notOverTimeNum: 20,
        overTimeNum: 40
      },
      {
        platform: '12345',
        notOverTimeNum: 19,
        overTimeNum: 20
      },
      {
        platform: '综治平台',
        notOverTimeNum: 20,
        overTimeNum: 50
      },
      {
        platform: '文旅系统备份',
        notOverTimeNum: 21,
        overTimeNum: 70
      },
      {
        platform: '住建系统2',
        notOverTimeNum: 20,
        overTimeNum: 60
      },
      {
        platform: '综治平台3',
        notOverTimeNum: 20,
        overTimeNum: 50
      },
      {
        platform: '文旅系统备份4',
        notOverTimeNum: 20,
        overTimeNum: 70
      },
      {
        platform: '住建系统5',
        notOverTimeNum: 20,
        overTimeNum: 60
      }
    ]
  },
  title: {
    type: String,
    default: '发起事件数/件'
  },
  doneLabel: {
    type: String,
    default: '已办结'
  },
  unDoneLabel: {
    type: String,
    default: '未办结'
  }
});

const chartLegend = [
  {
    label: props.unDoneLabel,
    key: 'notOverTimeNum',
    barWidth: 40,
    itemStyle: {
      borderColor: 'transparent',
      borderWidth: 2,
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
        {
          offset: 0,
          color: '#B8DDFF'
        },
        {
          offset: 1,
          color: '#76BEFF'
        }
      ])
    }
  },
  {
    label: props.doneLabel,
    key: 'overTimeNum',
    barWidth: 40,
    itemStyle: {
      borderColor: 'transparent',
      borderWidth: 2,
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
        {
          offset: 0,
          color: '#B7FFE6'
        },
        {
          offset: 1,
          color: '#77FFCA'
        }
      ])
    }
  }
];

watch(
  () => props.chartData,
  (newVal, oldVal) => {
    !isEmpty(newVal) && renderChart();
  },
  {
    deep: true
  }
);

const { chartContainer, setChartOption } = useEChart();
const { updateOptionToResponsive } = useResponsiveChart();

const seriesItemStyle = {
  itemStyle: {
    borderRadius: [2, 2, 0, 0]
  },
  // showBackground: true,
  // backgroundStyle: {
  //   color: 'rgba(108, 128, 151, 0.20)'
  // },
  barWidth: 150,
  type: 'bar',
  stack: '总量'
};

const getSeriesData = () =>
  chartLegend.map(item => ({
    ...seriesItemStyle,
    itemStyle: item?.itemStyle ?? seriesItemStyle.itemStyle,
    barWidth: item?.barWidth ?? seriesItemStyle.barWidth,
    name: item.label,
    data: props.chartData.map((ele: any) => ele[item.key])
  }));

const getMax = () => {
  const data1 = props.chartData.map(item => {
    return +item.notOverTimeNum + +item.overTimeNum;
  });
  const max = Math.max(...data1);
  const len = data1.length;
  return new Array(len).fill(max);
};

const renderChart = () => {
  const option = {
    title: {
      text: props.title,
      left: 'left',
      textStyle: {
        color: '#ffffff',
        fontSize: 44
      }
    },
    grid: {
      top: '15%',
      left: '0%',
      right: '0%',
      bottom: '0%',
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    legend: {
      data: chartLegend.map(item => item.label),
      top: '3%',
      right: '3%',
      itemWidth: 26,
      itemHeight: 26,
      itemGap: 80,
      textStyle: {
        fontSize: 44,
        color: '#A1A5B7'
      }
    },
    xAxis: [
      {
        axisLabel: {
          interval: 0,
          fontSize: 42,
          color: '#ffffff',
          lineHeight: 20,
          margin: 50,
          formatter: (params: string) => {
            return params.substr(0, 4);
          }
        },
        axisLine: {
          lineStyle: {
            color: '#2B394E'
          }
        },
        type: 'category',
        data: props.chartData.map(item => item.platform)
      }, // 背景柱体，不显示数据在图表中，只显示背景色
      {
        type: 'category',
        show: false,
        data: getMax()
      }
    ],
    dataZoom: [
      {
        show: false,
        start: 0,
        end: props.chartData.length < 8 ? 100 : Math.floor((8 / props.chartData.length) * 100) - 2
      },
      {
        type: 'inside',
        start: 94,
        end: 100,
        zoomOnMouseWheel: false
      }
    ],
    yAxis: [
      {
        position: 'left',
        splitNumber: 3,
        splitLine: {
          lineStyle: {
            type: 'solid',
            color: '#2B394E'
          }
        },
        axisTick: {
          show: true
        },
        // 整条y轴
        axisLine: {
          show: true,
          lineStyle: {
            color: '#2B394E'
          }
        },
        axisLabel: {
          fontSize: 42,
          color: '#ffffff',
          lineHeight: 20
        },
        type: 'value'
      }
    ],
    series: [
      ...getSeriesData(),
      {
        xAxisIndex: 1,
        itemStyle: {
          show: false,
          color: 'red',
          opacity: 0 // 透明度
        },
        showBackground: true,
        data: getMax(), // 这个数据无所谓，反正不显示，只要data的长度和另外两个一样长就行了
        barWidth: '26%',
        backgroundStyle: {
          color: 'rgba(108, 128, 151, 0.20)'
        },
        z: 0,
        tooltip: {
          show: false,
          trigger: 'axis',
          type: 'none'
        },
        type: 'bar'
      }
    ]
  };
  updateOptionToResponsive(option, ECHARTS_RESPONSE_LIST);
  setChartOption(option);
};

onMounted(() => {
  renderChart();
});
</script>
<style>
.echart-container {
  height: 100%;
}
</style>
