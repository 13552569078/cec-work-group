const data = {
  flag: 'chart',
  data: [
    {
      type: 'text',
      text: '从氢气供应来看，我市制氢厂有两家，使用三种种工艺进行氢气生产，其日产能如下图所示'
    },
    {
      type: 'PieChart',
      title: {
        text: '制氢厂日产能',
        left: 'center',
        textStyle: {
          color: '#eee'
        }
      },
      legend: {
        top: 'bottom',
        textStyle: {
          color: '#eee'
        }
      },
      series: [
        {
          name: '制氢厂日产能',
          type: 'pie',
          radius: [50, 100],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            // borderRadius: 8
          },
          label: {
            color: '#eee',
            show: true,
            position: 'inside',
            fontSize: 14
          },
          data: [
            { value: 3.81, name: '燕山石化' },
            { value: 2.33, name: '环宇京辉' }
          ]
        }
      ]
    },
    {
      type: 'PieChart',
      title: {
        text: '氢气生产各种工艺的日产能',
        left: 'center',
        textStyle: {
          color: '#eee'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        bottom: '15%',
        textStyle: {
          color: '#eee'
        }
      },
      series: [
        {
          name: '氢气生产日产能',
          type: 'pie',
          radius: [50, 120],
          center: ['50%', '40%'],
          roseType: 'area',
          itemStyle: {
            // borderRadius: 8
          },
          label: {
            color: '#eee',
            show: true,
            position: 'inside',
            fontSize: 14
          },
          data: [
            { value: 1.63, name: '天然气制氢' },
            { value: 3.81, name: '工业副产氢' },
            { value: 0.7, name: '电解水制氢' }
          ]
        }
      ]
    },
    {
      type: 'text',
      text: '加氢站也是供给侧的重要组成部分，我市有在运行的加氢站7家，其最近日加氢量如下图所示：'
    },
    {
      type: 'PieChart',
      title: {
        text: '氢气生产各种工艺的日产能',
        left: 'center',
        textStyle: {
          color: '#eee'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        type: 'scroll',
        bottom: '5',
        textStyle: {
          color: '#eee'
        }
      },
      series: [
        {
          name: '氢气日产能',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '47%'],
          // roseType: 'area',
          label: {
            color: '#eee'
          },
          // itemStyle: {
          //   borderRadius: 10,
          //   // borderColor: '#fff',
          //   borderWidth: 1
          // },
          data: [
            { value: 1.34, name: '大兴氢能示范区站' },
            { value: 1.59, name: '大兴时顺苑站' },
            { value: 0.39, name: '房山氢能产业园站' },
            { value: 1.43, name: '延庆庆园街站' },
            { value: 0.63, name: '延庆王泉营站' },
            { value: 0.77, name: '海淀永丰站' },
            { value: 0.11, name: '房山燕山石化站' }
          ]
        }
      ]
    },
    {
      type: 'text',
      text: '从需求侧来看，目前共有氢能源车辆1801辆，各区的分布车辆如下图所示：'
    },
    {
      type: 'BarChart',
      color: ['#25F9FF'],
      title: {
        text: '各区氢能源车注册数量',
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
        data: [
          '海淀区',
          '东城区',
          '西城区',
          '朝阳区',
          '大兴区',
          '石景山区',
          '房山区',
          '昌平区',
          '延庆区',
          '密云区'
        ]
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
          data: [301, 229, 55, 1, 669, 100, 96, 15, 201, 1],
          type: 'bar'
        }
      ]
    }
  ]
}

export default data
