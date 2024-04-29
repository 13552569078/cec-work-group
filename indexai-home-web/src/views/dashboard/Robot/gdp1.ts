const data = {
  flag: 'chart',
  data: [
    {
      type: 'text',
      text: '工业投资增长7.4%，规模以上工业产值增长8%，单位工业增加值能耗下降2.6%，新增就业1.7万人；新增工业规模以上企业45家；新能源经济达465.3亿元，同比增长达1.2%。增长目标如下图所示：'
    },
    {
      type: 'BarChart',
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        top: '2%',
        right: '5%',
        textStyle: {
          color: '#fff'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '2%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          rotate: 30,
          show: true,
          color: '#fff'
        },
        data: [
          '工业投资增长',
          '规模以上工业产值增长',
          '单位工业增加值能耗下降',
          '新能源经济同比增长'
        ]
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          show: true,
          interval: 'auto',
          formatter: '{value} %',
          color: '#fff'
        }
      },
      series: [
        {
          name: '完成',
          type: 'bar',
          barWidth: 16,
          data: [7.4, 8, 2.6, 1.2],
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            color: '#fff'
          },

          itemStyle: {
            color: '#0EC895'
          }
        },
        {
          name: '目标',
          type: 'bar',
          barWidth: 16,
          data: [12, 10, 1, 5, 8],
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            color: '#fff'
          },
          itemStyle: {
            color: '#FF9C00'
          }
        },
        {
          type: 'bar',
          barWidth: 60,
          barGap: '-200%',
          itemStyle: {
            color: 'rgba(4, 79, 124, 0.5)'
          },
          yAxisIndex: 0,
          data: [15, 15, 15, 15]
        }
      ]
    },

    {
      type: 'BarChart',
      title: {
        text: ''
      },
      color: ['#ff9900', '#0066ff'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        top: '2%',
        right: '5%',
        textStyle: {
          color: '#fff'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          show: true,
          color: '#fff'
        }
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: ['高新技术规上企业（家）', '新能源经济（亿元）'],
        axisLabel: {
          rotate: 70,
          color: '#fff'
        }
      },
      series: [
        {
          name: '完成',
          type: 'bar',
          barWidth: 16,
          data: [45, 456.3],
          label: {
            show: true,
            position: 'right',
            color: '#5CF1B0'
          },
          itemStyle: {
            color: '#5CF1B0'
          }
        },
        {
          name: '目标',
          type: 'bar',
          barWidth: 16,
          data: [60, 745],
          label: {
            show: true,
            position: 'right',
            color: '#FF9C00'
          },
          itemStyle: {
            color: '#FF9C00'
          }
        },
        {
          type: 'bar',
          barWidth: 60,
          barGap: '-200%',
          itemStyle: {
            color: 'rgba(4, 79, 124, 0.5)'
          },
          yAxisIndex: 0,
          data: [100, 800]
        }
      ]
    }
  ]
}
export default data
