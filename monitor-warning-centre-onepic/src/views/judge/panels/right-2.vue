<template>
  <hv-panel title="当前概览">
    <template #action> </template>
    <hl-group full="full-x" gap="var(--md)" class="m-t-sm">
      <hl-group v-for="(item, index) in card" :key="index" dir="vertical" class="card-tarot" full="full-x">
        <cite class="dom-frame"><cite class="dom-frame"></cite></cite>
        <h4 class="font-din" :data-suffix="item.suffix" style="--suffix-offset: calc(var(--xxs) * -0.5)">{{ item.total }}</h4>
        <div class="separator">
          <svg viewBox="0 0 106 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g stroke="none" stroke-width="1" fill="currentColor" fill-rule="evenodd">
              <rect fill-opacity="0.3" x="0" y="6.7" width="40" height="0.5" />
              <rect fill-opacity="0.3" x="66" y="6.7" width="40" height="0.5" />
              <path d="M60.4246212,7.07106781 L53,-0.353553391 L45.5753788,7.07106781 L53,14.495689 L60.4246212,7.07106781 Z M53,0.353 L59.718,7.071 L53,13.789 L46.282,7.071 L53,0.353 Z" fill-opacity="0.3" fill-rule="nonzero" />
              <path d="M57.9497475,7.07106781 L53,2.12132034 L48.0502525,7.07106781 L53,12.0208153 L57.9497475,7.07106781 Z M53,3.535 L56.536,7.071 L53,10.607 L49.464,7.071 L53,3.535 Z" fill-rule="nonzero" />
            </g>
          </svg>
        </div>
        <div class="label">{{ item.title }}</div>
      </hl-group>
    </hl-group>
    <hl-group style="height: calc(var(--xxs) * 45)" full="full-x">
      <fx-v-pie-chart :chart-data="chartData" :radius="['20%', '60%']" :legend="pieLegend" />
    </hl-group>

    <hl-group align="items-between" class="ornament-title bg-light m-none p-r-md">
      <span>当前监测主体数据统计</span>
      <hl-radio-group v-model="overviewDays" custom merge indent @change="changeOverview">
        <hl-radio :label="7">
          <hl-button size="sm">近7天</hl-button>
        </hl-radio>
        <hl-radio :label="30">
          <hl-button size="sm">近30天</hl-button>
        </hl-radio>
        <!--        TODO 2022/5/11 产品侯玉军说不做-->
        <!--        <hl-radio :label="365">
          <hl-button size="sm">近一年</hl-button>
        </hl-radio>-->
      </hl-radio-group>
    </hl-group>

    <hl-radio-group gap="var(--xs)" full v-model="analysisType" class="m-t-sm" custom @change="changeOverview">
      <hl-radio :label="0">
        <hl-button size="sm" block>按趋势</hl-button>
      </hl-radio>
      <hl-radio :label="1">
        <hl-button size="sm" block>按时段</hl-button>
      </hl-radio>
    </hl-radio-group>
    <hl-group :style="{ height: analysisType === 1 ? 'calc(var(--xxs) * 44' : 'calc(var(--xxs) * 46' }" full="full-x" class="m-t-sm">
      <fx-v-line-chart :grid="grid" :legend="legend" :series-data="seriesData" :chart-data="data" v-if="data.length > 0 && analysisType === 0" :tooltip="lineTooltip"/>
      <fx-v-column-chart :grid="gridBar" :chart-data="chartBarData" v-if="chartBarData.length > 0 && analysisType === 1" :tooltip="columnTooltip" />
    </hl-group>
  </hv-panel>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from 'vue';
import { useRoute } from 'vue-router';
import { apiJudgeCenterObj } from '@/apis/modules/judgeCenter';
import { IgetFindJudgeOverviewVOSpace, IgetListRegionTimeTrendVOsSpace, IgetListRegionTrendVOsSpace } from '@/apis/modules/judgeCenter/model';
import { getDaysBetween } from '@/common/utils';
import { CHARTS_DATA_COLOR } from '@/common';

interface seriesDataItemIn {
  label: string;
  key: string;
  itemStyle: any;
  areaStyleColor: string[];
}

interface chartsData {
  xValue: string;
  // 自定义key 任意值
  [propname: string]: any;
}

export default defineComponent({
  props: {
    useFor: {
      type: Number,
      defaut: 1
    }
  },
  setup(props) {
    const route = useRoute();
    const systemName = ref(inject('systemName'));
    const card = ref([
      {
        title: `接收${systemName.value}数`,
        total: 0,
        suffix: '条'
      },
      {
        title: '误报',
        total: 0,
        suffix: '条'
      },
      {
        title: '误报率',
        total: '0%',
        suffix: ''
      }
    ]);
    const chartData = ref<IgetFindJudgeOverviewVOSpace.EventCountVO[]>([
      // {
      //   label: '重大风险',
      //   value: 40,
      //   color: '#FD6161',
      // },
      // {
      //   label: '较大风险',
      //   value: 20,
      //   color: '#FB7E00',
      // },
      // {
      //   label: '一般风险',
      //   value: 50,
      //   color: '#D6B800',
      // },
      // {
      //   label: '低风险',
      //   value: 10,
      //   color: '#3E7DFF',
      // },
    ]);

    const judgeOverview = ref<IgetFindJudgeOverviewVOSpace.Data>({
      totalNum: 0,
      judgeRejectNum: 0,
      judgeRejectRate: 0,
      eventCountVOs: [
        // { 'code': 'AABBC1', 'name': '高温报警事件', 'num': 2 }
      ]
    });
    const initData = async() => {
      const result = await apiJudgeCenterObj.getFindJudgeOverviewVO();
      judgeOverview.value = result.data;

      // 处理统计数据
      card.value[0].total = judgeOverview.value.totalNum;
      card.value[1].total = judgeOverview.value.judgeRejectNum;
      card.value[2].total = judgeOverview.value.judgeRejectRate + '%';

      // 处理chartData
      chartData.value = judgeOverview.value.eventCountVOs.map((item, index) => {
        item.label = item.name;
        item.value = item.num;
        item.color = CHARTS_DATA_COLOR[index % 5].itemStyle.color; // TODO 这里是数量不确定，需要随机取值
        return item;
      });

      // 处理折线图和柱状图
      getOverviewAnalysisData();
    };

    const overviewDays = ref(7);

    const analysisType = ref(0);
    const pieLegend = {
      type: 'scroll',
      orient: 'vertical',
      pageIconColor: '#fff',
      pageTextStyle: {
        color: '#fff'
      },
      itemGap: 25
    };
    const legend = {
      type: 'scroll',
      pageIconColor: '#fff',
      pageTextStyle: {
        color: '#fff'
      },
      top: '0%',
      right: '0%',
      left: 10
    };
    const grid = {
      top: '30',
      left: '0',
      right: '12',
      bottom: '10',
      containLabel: true
    };
    const gridBar = {
      bottom: 30,
      containLabel: true
    };

    const seriesData = ref<seriesDataItemIn[]>([
      /* {
        label: '大客流',
        key: 'greatRisk',
        itemStyle: { color: '#FD6161' },
        areaStyleColor: ['rgba(255, 220, 2, 0.5)', 'rgba(255, 220, 2, 0)'],
      },
      {
        label: '人员聚集',
        key: 'biggerRisk',
        itemStyle: {
          color: '#71F8FC',
        },
        areaStyleColor: ['rgba(113,248,252,0.5)', 'rgba(113,248,252, 0)'],
      }, */
    ]);

    const data = ref<chartsData[]>([
      /* {
        xValue: '一月',
        greatRisk: 20,
        biggerRisk: 40,
      },
      {
        xValue: '二月',
        greatRisk: 30,
        biggerRisk: 60,
      },
      {
        xValue: '三月',
        greatRisk: 60,
        biggerRisk: 40,
      },
      {
        xValue: '四月',
        greatRisk: 20,
        biggerRisk: 40,
      },
      {
        xValue: '五月',
        greatRisk: 40,
        biggerRisk: 70,
      },
      {
        xValue: '六月',
        greatRisk: 60,
        biggerRisk: 50,
      },
      {
        xValue: '七月',
        greatRisk: 40,
        biggerRisk: 30,
      },
      {
        xValue: '八月',
        greatRisk: 80,
        biggerRisk: 50,
      },
      {
        xValue: '九月',
        greatRisk: 50,
        biggerRisk: 70,
      },
      {
        xValue: '十月',
        greatRisk: 30,
        biggerRisk: 20,
      },
      {
        xValue: '十一月',
        greatRisk: 20,
        biggerRisk: 40,
      },
      {
        xValue: '十二月',
        greatRisk: 30,
        biggerRisk: 50,
      }, */
    ]);

    const lineTooltip = ref();

    const getOverviewAnalysisData = async() => {
      const chartList = [];
      const { startTime, endTime } = getDaysBetween(overviewDays.value);
      if (analysisType.value === 0) {
        const result = await apiJudgeCenterObj.getListRegionTrendVOs({
          startTime: startTime,
          endTime: endTime,
          monitorRegionId: route.query.monitorRegionId as string
        });
        /* const result:IgetListRegionTrendVOsSpace.Data[] = [
          {
            'date': '2022-05-05',
            'eventTypeVOs': [
              {
                'code': 'AABBD1',
                'name': '消防通道占用事件',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': 'AABBD3',
                'name': '消防通道占用事件22',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': 'AABBC1',
                'name': '高温报警事件',
                'num': 1,
                'child': [

                ]
              },
              {
                'code': 'AABBD2',
                'name': '消防通道占用事件11',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': 'OTHER',
                'name': '其他',
                'num': 1,
                'child': [
                  {
                    'code': '660101',
                    'name': '森林火灾',
                    'num': 0,
                    'child': [

                    ]
                  },
                  {
                    'code': '5566778899',
                    'name': '踩踏事件3级',
                    'num': 1,
                    'child': [

                    ]
                  }
                ]
              }
            ]
          },
          {
            'date': '2022-05-06',
            'eventTypeVOs': [
              {
                'code': 'AABBD1',
                'name': '消防通道占用事件',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': 'AABBD3',
                'name': '消防通道占用事件22',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': 'AABBC1',
                'name': '高温报警事件',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': 'AABBD2',
                'name': '消防通道占用事件11',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': '660101',
                'name': '森林火灾',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': '5566778899',
                'name': '踩踏事件3级',
                'num': 0,
                'child': [

                ]
              }
            ]
          },
          {
            'date': '2022-05-07',
            'eventTypeVOs': [
              {
                'code': 'AABBD1',
                'name': '消防通道占用事件',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': 'AABBD3',
                'name': '消防通道占用事件22',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': 'AABBC1',
                'name': '高温报警事件',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': 'AABBD2',
                'name': '消防通道占用事件11',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': '660101',
                'name': '森林火灾',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': '5566778899',
                'name': '踩踏事件3级',
                'num': 0,
                'child': [

                ]
              }
            ]
          },
          {
            'date': '2022-05-08',
            'eventTypeVOs': [
              {
                'code': 'AABBD1',
                'name': '消防通道占用事件',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': 'AABBD3',
                'name': '消防通道占用事件22',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': 'AABBC1',
                'name': '高温报警事件',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': 'AABBD2',
                'name': '消防通道占用事件11',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': '660101',
                'name': '森林火灾',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': '5566778899',
                'name': '踩踏事件3级',
                'num': 0,
                'child': [

                ]
              }
            ]
          },
          {
            'date': '2022-05-09',
            'eventTypeVOs': [
              {
                'code': 'AABBD1',
                'name': '消防通道占用事件',
                'num': 1,
                'child': [

                ]
              },
              {
                'code': 'AABBD3',
                'name': '消防通道占用事件22',
                'num': 1,
                'child': [

                ]
              },
              {
                'code': 'AABBC1',
                'name': '高温报警事件',
                'num': 2,
                'child': [

                ]
              },
              {
                'code': 'AABBD2',
                'name': '消防通道占用事件11',
                'num': 1,
                'child': [

                ]
              },
              {
                'code': 'OTHER',
                'name': '其他',
                'num': 1,
                'child': [
                  {
                    'code': '660101',
                    'name': '森林火灾',
                    'num': 1,
                    'child': [

                    ]
                  },
                  {
                    'code': '5566778899',
                    'name': '踩踏事件3级',
                    'num': 0,
                    'child': [

                    ]
                  }
                ]
              }
            ]
          },
          {
            'date': '2022-05-10',
            'eventTypeVOs': [
              {
                'code': 'AABBD1',
                'name': '消防通道占用事件',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': 'AABBD3',
                'name': '消防通道占用事件22',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': 'AABBC1',
                'name': '高温报警事件',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': 'AABBD2',
                'name': '消防通道占用事件11',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': '660101',
                'name': '森林火灾',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': '5566778899',
                'name': '踩踏事件3级',
                'num': 0,
                'child': [

                ]
              }
            ]
          },
          {
            'date': '2022-05-11',
            'eventTypeVOs': [
              {
                'code': 'AABBD1',
                'name': '消防通道占用事件',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': 'AABBD3',
                'name': '消防通道占用事件22',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': 'AABBC1',
                'name': '高温报警事件',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': 'AABBD2',
                'name': '消防通道占用事件11',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': '660101',
                'name': '森林火灾',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': '5566778899',
                'name': '踩踏事件3级',
                'num': 0,
                'child': [

                ]
              }
            ]
          },
          {
            'date': '2022-05-12',
            'eventTypeVOs': [
              {
                'code': 'AABBD1',
                'name': '消防通道占用事件',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': 'AABBD3',
                'name': '消防通道占用事件22',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': 'AABBC1',
                'name': '高温报警事件',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': 'AABBD2',
                'name': '消防通道占用事件11',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': '660101',
                'name': '森林火灾',
                'num': 0,
                'child': [

                ]
              },
              {
                'code': '5566778899',
                'name': '踩踏事件3级',
                'num': 0,
                'child': [

                ]
              }
            ]
          }
        ]; */

        // 处理折线tooltip
        lineTooltip.value = {
          backgroundColor: '#0f182ae6',
          borderColor: '#0f182ae6',
          textStyle: {
            color: 'white'
          },
          className: 'p-md',
          formatter: (params: any) => {
            if (params === null || params.length === 0) return;
            params.sort((a: { value: number; }, b: { value: number; }) => { return b.value - a.value; });// 降序
            let tip = '';
            tip += '<div style=\'margin-bottom: var(--xxs)\' class=\'font-lg\'>' + params[0].name + '</div>';
            params.forEach((item: any, index: number) => {
              // tip += item.marker + item.seriesName + '：' + (item.value === undefined ? '-' : item.value) + '<br/>';
              tip += '<div style=\'margin-bottom: var(--xxs)\'>' + item.marker + item.seriesName + '：' + (item.value === undefined ? '-' : item.value) + '</div>';
              // result.data.forEach(item2 => {
              //   if (item2.date === item.name) {
              //     item2.eventTypeVOs.forEach(item3 => {
              //       if (item3.code === 'OTHER' && item3.child && item3.child.length > 0 && item.seriesName === '其他') {
              //         item3.child.forEach(item4 => {
              //           tip += '<div style=\'margin-left: var(--md);\'>' + item4.name + '：' + item4.num + '</div>';
              //         });
              //       }
              //     });
              //   }
              // });
            });
            return tip;
          }
        };
        // 处理折线图数据
        result.data.forEach((item, index) => {
          const xData: chartsData = { xValue: '' };
          xData.xValue = item.date;
          item.eventTypeVOs.forEach((item2, index2) => {
            xData[item2.code] = item2.num;

            const seriesDataItem = {
              label: '',
              key: '',
              itemStyle: {
                color: ''
              },
              areaStyleColor: [] as string[]
            };
            if (index === 0) {
              seriesDataItem.label = item2.name;
              seriesDataItem.key = item2.code;
              seriesDataItem.itemStyle = CHARTS_DATA_COLOR[index2 % 5].itemStyle;
              seriesDataItem.areaStyleColor = CHARTS_DATA_COLOR[index2 % 5].areaStyleColor;
              seriesData.value.push(seriesDataItem);
            }
          });
          data.value.push(xData);
        });
      } else {
        const result = await apiJudgeCenterObj.getListRegionTimeTrendVOs({
          startTime: startTime,
          endTime: endTime,
          monitorRegionId: route.query.monitorRegionId as string
        });

        // 处理tooltip
        columnTooltip.value = {
          backgroundColor: '#0f182ae6',
          borderColor: '#0f182ae6',
          textStyle: {
            color: 'white'
          },
          className: 'p-md',
          formatter: (params: any) => {
            if (params === null || params.length === 0) return;
            let tip = '';
            tip += '<div style=\'margin-bottom: var(--xxs)\' class=\'font-lg\'>' + params[0].name + '<span style="display: inline-block; margin-left: var(--md)">总计：' + (params[0].value === undefined ? '-' : params[0].value) + '</span></div>';
            params.forEach((item: any) => {
              result.data.forEach(columnItem => {
                if (item.name === columnItem.code) {
                  columnItem.eventTypeVOs.forEach(eventTypeItem => {
                    tip += '<div style=\'margin-bottom: var(--xxs)\' class="font-md">' + eventTypeItem.name + '：' + eventTypeItem.num + '</div>';
                  });
                }
              });
            });
            return tip;
          }
        };

        chartBarData.value = result.data.map(item => {
          item.label = item.code;
          item.value = item.num;
          return item;
        });
      }
    };

    const chartBarData = ref<IgetListRegionTimeTrendVOsSpace.Data[]>([]);
    const columnTooltip = ref({});

    const changeOverview = () => {
      // 重置数据
      data.value = [];
      seriesData.value = [];
      chartBarData.value = [];
      getOverviewAnalysisData();
    };

    initData();

    return {
      card,
      analysisType,
      chartData,
      grid,
      legend,
      seriesData,
      data,

      judgeOverview,
      overviewDays,
      changeOverview,
      chartBarData,
      columnTooltip,
      lineTooltip,

      pieLegend,
      gridBar
    };
  }
});
</script>
<style lang="scss" scoped>
:deep(.echart-fill-rect){
  margin-right: var(--xxs);
}
</style>
