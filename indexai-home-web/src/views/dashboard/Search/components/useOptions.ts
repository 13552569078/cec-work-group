import echarts from '/@/utils/lib/echarts'
export const barOption = {
  title: {
    textStyle: {
      color: '#ffffff',
      fontSize: '14px'
    },
    left: 0
  },
  grid: {
    top: 32,
    right: 0,
    bottom: 24
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#06124f',
    formatter: '{b0}:{c0}',
    textStyle: { color: '#ffffff' },
    borderColor: '#044f7c',
    axisPointer: {
      type: 'shadow',
      shadowStyle: {
        color: 'rgba(54, 164, 255, 0.1)'
      }
    }
  },
  xAxis: {
    type: 'category',
    axisLine: {
      lineStyle: {
        color: '#EDEDED'
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#ffffff'
    },
    data: []
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#ffffff',
      formatter: function (value: any) {
        if (value >= 10000) {
          value = value / 10000 + '万'
        } else {
          value = value
        }
        return value
      }
    },
    splitLine: {
      //网格线
      lineStyle: {
        type: 'dashed' //设置网格线类型 dotted：虚线 solid:实线
      },
      show: true //隐藏或显示
    }
  },
  series: [
    {
      data: [],
      barWidth: 14,
      type: 'bar',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#A3DEFF' },
          { offset: 1, color: 'rgba(163, 222, 255, 0)' }
        ])
        // emphasis: {
        //   label: {
        //     show: true,
        //     position: 'top',
        //     formatter: function (obj) {
        //       return obj.value + '天'
        //     }
        //   }
        // }
      }
    }
  ]
}

export const lineOption = {
  title: {
    textStyle: {
      color: '#ffffff',
      fontSize: '14px'
    },
    left: 0
  },
  grid: {
    top: 32,
    right: 0,
    bottom: 24
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#06124f',
    formatter: '{b0}:{c0}',
    textStyle: { color: '#ffffff' },
    borderColor: '#044f7c',
    axisPointer: {
      type: 'shadow',
      shadowStyle: {
        color: 'rgba(54, 164, 255, 0.1)'
      }
    }
  },
  xAxis: {
    type: 'category',
    axisLine: {
      lineStyle: {
        color: '#EDEDED'
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#ffffff'
    },
    data: []
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#ffffff',
      formatter: function (value: any) {
        if (value >= 10000) {
          value = value / 10000 + '万'
        } else {
          value = value
        }
        return value
      }
    },
    splitLine: {
      //网格线
      lineStyle: {
        type: 'dashed' //设置网格线类型 dotted：虚线 solid:实线
      },
      show: true //隐藏或显示
    }
  },
  series: [
    {
      data: [],
      type: 'line',
      showSymbol: false,
      itemStyle: {
        color: 'rgba(250, 139, 22, 1)'
        // emphasis: {
        //   label: {
        //     show: true,
        //     position: 'top',
        //     formatter: function (obj) {
        //       return obj.value + '天'
        //     }
        //   }
        // }
      }
    }
  ]
}

export const pieOption = {
  color: [
    'rgba(136, 219, 200, 1)',
    'rgba(255, 147, 141, 1)',
    'rgba(137, 157, 240, 1)',
    'rgba(126, 205, 255, 1)'
  ], // 设置颜色
  tooltip: {
    trigger: 'item',
    backgroundColor: '#06124f',
    textStyle: { color: '#ffffff' },
    borderColor: '#044f7c'
  },
  legend: {
    icon: 'circle',
    type: 'scroll',
    orient: 'vertical',
    left: '50%',
    top: 20,
    bottom: 20,
    textStyle: { color: '#ffffff' },
    data: [],
    tooltip: {
      show: true
    },
    pageIconColor: '#06124f',
    pageIconInactiveColor: '#06124f',
    pageTextStyle: {
      color: '#ffffff'
    }
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['30%', '90%'],
      center: ['20%', '50%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      labelLine: {
        show: false
      },
      data: []
    },
    {
      name: 'Access From',
      type: 'pie',
      radius: ['30%', '50%'],
      center: ['20%', '50%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      labelLine: {
        show: false
      },
      data: [],
      itemStyle: {
        color: 'rgba(255,255,0,.3)'
      }
    }
  ]
}
