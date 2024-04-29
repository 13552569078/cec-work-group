<template>
  <div>
    <div ref="chartContainer" class="echart-container"></div>
    <div class="legend">
      <span class="mark" v-for="(item, index) in factorNameList" :key="index" @click="changeLine(index)">
         <hl-tag type="success">{{item}}</hl-tag>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, watch, ref, PropType } from 'vue';
import { useEChart } from 'hongluan-hooks';
import { IgetListMonitorFactorDataListSpace } from '@/apis/modules/monitorCenter/model';

interface DATA {
  xData: string[];
  value: number[];
  thresholdList: number[];
}
export default defineComponent({
  props: {
    lineChartData: {
      type: Array as PropType<IgetListMonitorFactorDataListSpace.Data[]>,
      default: () => []
    }
  },
  setup(props) {
    const { chartContainer, setChartOption, clearChart } = useEChart();
    const lineData:DATA = {
      xData: [],
      value: [],
      thresholdList: []
    };

    const factorNameList = ref<string[]>([]);

    const renderChart = () => {
      const option = {
        grid: {
          top: '100',
          left: '10',
          right: '10',
          bottom: '10',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none',
          },
          extraCssText: 'border-radius: 0;',
          formatter: (params: any) => `
          <div style="backgroundColor:#fff;borderRaduis:0">
            ${params[0].marker}
            <span>${params[0].axisValue} <span style="font-weight: bold; margin-left: 30px">${params[0].value}</span></span>
          </div>
          `,
        },
        xAxis: {
          axisLabel: {
            fontSize: 12,
            color: 'rgba(128, 128, 160, 0.65)',
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
          data: lineData.xData,
        },
        yAxis: {
          splitNumber: 4,
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(128, 128, 160, 0.15)',
            },
          },
          axisLabel: {
            fontSize: 12,
            color: 'rgba(128, 128, 160, 0.65)',
            lineHeight: 20,
          },
          type: 'value',
        },
        series: [{
          itemStyle: {
            color: '#009EF7',
          },
          symbolSize: 0,
          lineStyle: {
            width: 3,
          },
          data: lineData.value,
          type: 'line',
          markLine: {
            silent: true,
            symbol: ['none', 'none'],
            label: {
              show: true,
              distance: 9,
              position: 'start',
              fontSize: 12,
              lineHeight: 20,
            },
            data: lineData.thresholdList.map(item => {
              return {
                yAxis: item,
                lineStyle: {
                  type: 'dashed',
                  color: '#79D42B',
                },
                label: {
                  color: '#79D42B',
                },
              };
            })
            /* [{
              yAxis: 51,
              lineStyle: {
                type: 'dashed',
                color: '#79D42B',
              },
              label: {
                color: '#79D42B',
              },
            }, {
              yAxis: 74,
              lineStyle: {
                type: 'dashed',
                color: '#F1E723',
              },
              label: {
                color: '#F1E723',
              },
            }], */
          },
        }],
      };
      setChartOption(option);
    };
    let resultData:IgetListMonitorFactorDataListSpace.Data[] = [];
    const changeLine = (index: number) => {
      lineData.xData = [];
      lineData.value = [];
      lineData.thresholdList = [];
      resultData[index].monitorFactorDataVOList.forEach(item => {
        lineData.xData.push(item.monitorTime);
        lineData.value.push(item.factorValue);
      });
      lineData.thresholdList = resultData[index].thresholdList as number[];
      // clearChart();
      renderChart();
    };

    watch(() => props.lineChartData, (val:IgetListMonitorFactorDataListSpace.Data[]) => {
      nextTick(() => {
        factorNameList.value = [];
        val.forEach(item => {
          factorNameList.value.push(item.factorName);
        });
        if (val.length > 0) {
          console.log('值', val);
          resultData = val;
          lineData.xData = [];
          lineData.value = [];
          lineData.thresholdList = [];
          changeLine(0);
        }
      });
    }, { deep: true, immediate: true });

    return {
      chartContainer,
      factorNameList,
      changeLine
    };
  },
});
</script>
<style lang="scss" scoped>
.echart-container {
  height: calc(var(--xxl) * 16)
}
.legend {
  position: absolute;
  top: calc(var(--panel-header-height) / 3);
  right: calc(var(--panel-padding) + 36px);
  text-align: center;
  .mark {
    margin-right: var(--lg);
    cursor: pointer;
    .rect {
      display: inline-block;
      width: var(--xs);
      height: var(--xs);
      margin-right: var(--xs);
      vertical-align: middle;
      border-radius: 25%;
      &.low {
        background-color: #009EF7;
      }
      &.normal {
        background-color: #79D42B;
      }
      &.high {
        background-color: #F1E723;
      }
    }
    .text {
      font-size: var(--font-sm);
      color: var(--text-secondary);
    }
  }
}
</style>
