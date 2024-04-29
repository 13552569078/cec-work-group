const option = {
  color: ['#9F2FD5', '#F79B29', '#FC7171'],
  title: {
    text: '',
    textStyle: {
      color: '#fff',
      fontSize: 12
    }
  },
  legend: {
    textStyle: {
      color: '#CBE9FF'
    },
    data: ['Evaporation', 'Precipitation']
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },

  xAxis: {
    type: 'category',
    axisLine: {
      lineStyle: {
        color: '#CBE9FF'
      }
    },
    axisLabel: { interval: 0, rotate: 30 },
    data: []
  },
  yAxis: {
    type: 'value',
    name: '',
    position: 'left',
    splitLine: false,
    axisLine: {
      lineStyle: {
        color: '#CBE9FF'
      }
    }
  },
  series: [
    // {
    //   data: [820, 932, 901, 934, 1290, 1330, 1320],
    //   type: 'line',
    //   smooth: true
    // },
    // {
    //   data: [620, 432, 501, 934, 190, 1330, 520],
    //   type: 'line',
    //   smooth: true
    // }
  ]
}
export default option
