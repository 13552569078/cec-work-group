const option = {
  color: ['#9F2FD5', '#F79B29', '#FC7171'],
  title: {
    text: 'GDP占比(%)',
    textStyle: {
      color: '#fff',
      fontSize: 12
    }
  },
  grid: {
    right: '10%',
    top: '20%'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  legend: {
    top: '10%',
    left: 'center',
    textStyle: {
      color: '#CBE9FF'
    },
    data: ['Evaporation', 'Precipitation']
  },
  xAxis: {
    type: 'category',
    axisLine: {
      lineStyle: {
        color: '#CBE9FF'
      }
    },
    axisLabel: { interval: 2, rotate: 30 },
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: [
    {
      type: 'value',
      name: 'Evaporation',
      position: 'left',
      splitLine: false,
      axisLine: {
        lineStyle: {
          color: '#CBE9FF'
        }
      },
      axisLabel: {
        formatter: '{value}'
      }
    },
    {
      type: 'value',
      name: '温度',
      position: 'right',
      splitLine: false,
      axisLine: {
        lineStyle: {
          color: '#CBE9FF'
        }
      },
      axisLabel: {
        formatter: '{value}'
      }
    }
  ],
  series: [
    {
      name: 'Evaporation',
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true
    },
    {
      name: 'Precipitation',
      data: [620, 432, 501, 934, 190, 1330, 520],
      type: 'line',
      yAxisIndex: 1,
      smooth: true
    }
  ]
}
export default option
