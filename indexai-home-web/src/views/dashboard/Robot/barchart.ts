const option = {
  color: ['rgba(255, 227, 74, 1)', 'rgba(92, 232, 241, 1)', 'rgba(246, 172, 132, 1)'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  grid: {
    right: '10%',
    top: '20%'
  },
  title: {
    text: 'GDP占比(%)',
    textStyle: {
      color: '#fff'
    }
  },
  legend: {
    textStyle: {
      color: '#CBE9FF'
    },
    data: ['Evaporation', 'Precipitation', 'Temperature']
  },
  xAxis: [
    {
      type: 'category',
      axisLine: {
        lineStyle: {
          color: '#CBE9FF'
        }
      },
      axisLabel: { interval: 0, rotate: 30 },
      // prettier-ignore
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  ],
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
        formatter: '{value} ml'
      }
    }
  ],
  series: [
    {
      name: 'Evaporation',
      type: 'bar',
      data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
    },
    {
      name: 'Precipitation',
      type: 'bar',
      data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
    }
  ]
}
export default option