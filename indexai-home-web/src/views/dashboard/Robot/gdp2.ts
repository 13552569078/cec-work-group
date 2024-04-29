const data = {
  flag: 'chart',
  data: [
    {
      type: 'text',
      text: '新能源汽车产值达165.91亿元，占GDP2.8%；新能源产能企业产值达366.94亿元，占GDP6.2%；新能源储配企业产值达211.7亿元，占GDP3.58%，从发展情况来看，新能源产能产值有进一步提升的空间。如下图所示：'
    },
    {
      type: 'PieChart',
      title: {
        text: '细分产值（亿元）',
        left: 'left',
        textStyle: {
          color: '#fff'
        }
      },
      color: ['rgba(255, 211, 85, 1)', 'rgba(255, 103, 114, 1)', 'rgba(62, 201, 162, 1)'],
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: '细分产值（亿元）',
          type: 'pie',
          radius: ['36%', '56%'],
          center: ['50%', '60%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
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
    },
    {
      type: 'BarChart',
      title: {
        text: 'GDP占比(%)',
        left: 'center',
        textStyle: {
          color: '#fff'
        }
      },
      xAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        data: ['新能源汽车', '新能源产能企业', '系能源储配企业']
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
      },
      series: [
        {
          type: 'bar',
          barWidth: 72,
          itemStyle: {
            color: 'rgba(4, 79, 124, 0.5)'
          },
          yAxisIndex: 0,
          data: [10, 10, 10]
        },
        {
          data: [
            {
              value: 2.8,
              itemStyle: {
                color: 'rgba(255, 227, 74, 1)'
              }
            },
            {
              value: 6.2,
              itemStyle: {
                color: 'rgba(92, 232, 241, 1)'
              }
            },
            {
              value: 3.58,
              itemStyle: {
                color: 'rgba(246, 172, 132, 1)'
              }
            }
          ],
          yAxisIndex: 0,
          barWidth: 16,
          type: 'bar',
          barGap: '-60%'
        }
      ]
    }
  ]
}
export default data
