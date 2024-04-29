const option = {
  title: {
    text: '细分产值（亿元）',
    left: 'left',
    textStyle: {
      color: '#fff'
    }
  },
  tooltip: {
    trigger: 'item'
  },
  color: ['#36A5FF', '#3054EE', '#6761F5', '#4EC09E', '#33DFC6', '#FF4D50', '#F6BB05', '#FA8B16'],
  legend: {
    top: '10%',
    left: 'center',
    textStyle: {
      color: '#CBE9FF'
    },
    data: ['Evaporation', 'Precipitation', 'Temperature']
  },
  series: [
    {
      name: '',
      type: 'pie',
      radius: ['36%', '56%'],
      center: ['50%', '60%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        {
          value: 165.91,
          name: '新能源汽车'
        },
        {
          value: 366.94,
          name: '新能源产能企业'
        },
        {
          value: 211.7,
          name: '新能源储配企业'
        }
      ]
    },
    {
      name: '',
      type: 'pie',
      radius: ['25%', '40%'],
      center: ['50%', '60%'],
      avoidLabelOverlap: false,
      itemStyle: {
        opacity: 0.2
      },
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      data: [
        {
          value: 165.91,
          name: '新能源汽车'
        },
        {
          value: 366.94,
          name: '新能源产能企业'
        },
        {
          value: 211.7,
          name: '新能源储配企业'
        }
      ]
    }
  ]
}
export default option
