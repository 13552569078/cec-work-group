// 折线图1
const line1 = {
  flag: 'chart',
  data: [
    {
      type: 'lineChart',
      title: '图标标题', // 标题
      legend: [],
      xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      yName: '辆',
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320], // 数据
          type: 'line',
          smooth: true
        }
      ]
    }
  ]
}

// 双坐标-折线图2
const line2 = {
  flag: 'chart',
  data: [
    {
      type: 'lineY2Chart',
      title: '图标标题', // 标题
      legend: ['Evaporation', 'Evaporation'],
      xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      yName: '辆',
      y2Name: '辆',
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
  ]
}

// 柱状-折线图3
const barLine = {
  flag: 'chart',
  data: [
    {
      type: 'barLineChart',
      title: '图标标题', // 标题
      legend: ['客车', '火车', '总体'],
      xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      yName: '辆',
      y2Name: '辆',
      series: [
        {
          name: '客车',
          type: 'bar',
          data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
        },
        {
          name: '火车',
          type: 'bar',
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        },
        {
          name: '总体',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
        }
      ]
    }
  ]
}

// 柱状图4
const barLine = {
  flag: 'chart',
  data: [
    {
      type: 'barChart',
      title: '图表标题', // 标题
      legend: ['客车', '火车'],
      xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      yName: '辆',
      series: [
        {
          name: '客车',
          type: 'bar',
          data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
        },
        {
          name: '火车',
          type: 'bar',
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        }
      ]
    }
  ]
}

// 饼图5
const barLine = {
  flag: 'chart',
  data: [
    {
      type: 'pieChart',
      title: '图表标题', // 标题
      series: [
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

// 表格
const table = {
  flag: 'chart',

  data: [
    {
      type: 'table',
      tHead: [
        {
          prop: 'name',
          label: '名称'
        },
        {
          prop: 'date',
          label: '日期'
        },
        {
          prop: 'address',
          label: '地址'
        }
      ],
      tBody: [
        {
          date: '2016-05-03',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        },
        {
          date: '2016-05-02',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        }
      ]
    }
  ]
}

// report
const card = {
  flag: 'chart',
  data: [
    {
      type: 'report',
      url: '',
      title: '',
      recommendations: '',
      extract: '',
      content: ''
    }
  ]
}

//
