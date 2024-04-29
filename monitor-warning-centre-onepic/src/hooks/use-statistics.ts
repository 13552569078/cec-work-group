import { ref, computed } from 'vue';
import { Indexable } from 'fx-front-utils';
import { apiEventStatObj as api } from '@/apis/modules/monitorStat';
import { apiEventStatObj } from '@/apis/modules/monitorStat';
import {
  IgetFindMonitorEventOverViewSpace,
  IgetFindAlarmDistributionSpace,
  IgetListMonitorEventStatisticsesSpace,
  IgetListTrendVOsSpace
} from '@/apis/modules/monitorStat/model';

const useStatistics = (useFor = 1) => {
  // 今日概览数据
  const statData = ref<IgetFindMonitorEventOverViewSpace.Data>({
    accessNumber: 0,
    alarmNumber: 0,
    judgeNumber: 0,
    autoFinishNumber: 0,
    eventCenterFinishNumber: 0
  });

  // 报警分布数据
  const alarmDistributionData = ref<IgetFindAlarmDistributionSpace.Data>();

  // 报警分布 - 折线图数据 - 按趋势
  const distLineChartDataByTrend = ref();
  const distLineChartSeriesData = ref();

  // 报警分布 - 折线图数据 - 按时间段
  const distBarChartDataByTime = ref();

  // 报警分布 - 饼图数据
  const distPieChartData = ref();

  const BY_WARNING_LEVEL = '1';
  const BY_EVENT_TYPE = '2';
  const BY_REGION_GROUP = '3';


  const mapColor = {
    'ALARM_LEVEL_CODE_1': '#FD6161',
    'ALARM_LEVEL_CODE_2': '#FB7E00',
    'ALARM_LEVEL_CODE_3': '#D6B800',
    'ALARM_LEVEL_CODE_4': '#3E7DFF',
    'WARNING_LEVEL_CODE_1': '#FD6161',
    'WARNING_LEVEL_CODE_2': '#FB7E00',
    'WARNING_LEVEL_CODE_3': '#D6B800',
    'WARNING_LEVEL_CODE_4': '#3E7DFF',
  }
  // const mapColor2 = {
  //   'WARNING_LEVEL_CODE_1': '#FD6161',
  //   'WARNING_LEVEL_CODE_2': '#FB7E00',
  //   'WARNING_LEVEL_CODE_3': '#D6B800',
  //   'WARNING_LEVEL_CODE_4': '#3E7DFF',
  // }

  const colorArr = ['#FD6161', '#FB7E00', '#D6B800', '#3E7DFF'];

  // 今日概况统计信息
  const getStatData = async () => {
    const res = await api.getFindMonitorEventOverView(statData.value);
    statData.value = res.data;
    return res.data;
  }

  const lineTooltip = ref();


  // 报警分布
  const getAlarmDistribution = async (params: IgetFindAlarmDistributionSpace.RequestParams) => {
    const res = await api.getFindAlarmDistribution(params);
    alarmDistributionData.value = res.data;
    return res.data;
  }

  // 报警分布 - 饼图
  const getDisPieChartData = async (params: IgetListMonitorEventStatisticsesSpace.RequestParams) => {
    const res = await api.getListMonitorEventStatisticses(params);
    distPieChartData.value = res.data.map((data, index) => {
      if (params.statisticsTypeCode === BY_WARNING_LEVEL) {
        // console.log('颜色', mapColor[data.typeCode as keyof typeof mapColor]);
        return {
          label: data.typeName,
          value: data.eventNumber,
          color: mapColor[data.typeCode as keyof typeof mapColor]
        }
      } else {
        return {
          label: data.typeName,
          value: data.eventNumber,
          color: colorArr[index % colorArr.length]
        }
      }
    });
    return res.data;
  }


  // 报警分布 - 折线图、柱状图
  const getDisLineChartData = async (params: IgetListMonitorEventStatisticsesSpace.RequestParams) => {
    let res = null;

    if (params.statisticsTypeCode === '1') {
      res = await api.getListTrendVOs(params);
      const result = await apiEventStatObj.getListTrendVOs(params);
      // 处理折线tooltip
      lineTooltip.value = {
        backgroundColor: '#0f182ae6',
        borderColor: '#0f182ae6',
        textStyle: {
          color: 'white'
        },
        className: 'p-md',
        //padding: 16,
        formatter: (params:any) => {
          if (params === null || params.length === 0) return;
          params.sort((a: { value: number; }, b: { value: number; }) => { return b.value - a.value; });// 降序
          let tip = '';
          tip += "<div style='margin-bottom: var(--xxs)' class='font-lg'>" + params[0].name + '</div>';
          params.forEach((item:any, index:number) => {
            tip += "<div style='margin-bottom: var(--xxs)'>" +item.marker + item.seriesName + '：' + (item.value === undefined ? '-' : item.value) + '</div>';
            // result.data.forEach((item2:any) => {
            //   if (item2.date === item.name) {
            //     item2.eventTypeVOs.forEach((item3:any) => {
            //       if (item3.code === 'OTHER' && item3.child && item3.child.length > 0 && item.seriesName === '其他') {
            //         item3.child.forEach((item4:any) => {
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
      // 数据
      distLineChartDataByTrend.value = res.data.map(item => {
        const lineData:Indexable<number> = {};
        item.eventTypeVOs.forEach(points => {
          lineData[points.code] = points.num
        });
        return {
          xValue: item.date,
          ...lineData
        }
      });
    } else {
      res = await api.getListTimeTrendVOs(params);
      distBarChartDataByTime.value = res.data.map(item => {
        const lineData:Indexable<number> = {};
        item.eventTypeVOs.forEach(points => {
          lineData[points.code] = points.num
        });
        return {
          xValue: item.code,
          ...lineData
        }
      });
    }

    // 图例
    distLineChartSeriesData.value = res.data[0].eventTypeVOs.map((item, index) => {
      return {
        label: item.name,
        key: item.code,
        barWidth: 22,
        itemStyle: {
          color: colorArr[index % colorArr.length]
        }
      }
    })
    return res.data;
  }

  return {
    statData,
    alarmDistributionData,
    distLineChartDataByTrend,
    distLineChartSeriesData,
    distBarChartDataByTime,
    distPieChartData,
    getStatData,
    getAlarmDistribution,
    getDisLineChartData,
    getDisPieChartData,
    lineTooltip
  }
}

export { useStatistics }
