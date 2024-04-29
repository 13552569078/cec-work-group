import echarts from '/@/utils/lib/echarts'
export const barOption = {
  // title: {
  //   textStyle: {
  //     color: '#CBE9FF',
  //     fontSize: '14px'
  //   },
  //   top: '4%',
  //   left: '8%'
  // },
  grid: {
    top: '8%',
    left: '8%',
    right: '8%',
    bottom: '8%',
    containLabel: true,
    borderColor: '#607577',
    borderWidth: 1,
    show: true
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#06124f',
    formatter: '{b0}:{c0}',
    textStyle: { color: '#ffffff' },
    borderColor: '#044f7c',
    axisPointer: {
      type: 'none'
    }
    // axisPointer: {
    //   type: 'shadow',
    //   shadowStyle: {
    //     color: 'rgba(54, 164, 255, 0.1)'
    //   }
    // }
  },
  xAxis: {
    type: 'category',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#CBE9FF'
    },
    data: []
  },
  yAxis: {
    type: 'value',

    axisLabel: {
      color: '#CBE9FF',
      formatter: function (value: any) {
        if (value >= 10000) {
          value = value / 10000 + '万'
        } else {
          value = value
        }
        return value
      }
    },
    axisLine: {
      show: false
    },
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    }
  },
  series: [
    {
      data: [],
      barWidth: 16,
      type: 'bar',
      showBackground: true,
      backgroundStyle: { color: 'rgba(255, 255, 255, 0.04)' },
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(255, 227, 74, 1)' },
          { offset: 1, color: 'rgba(255, 156, 0, 0)' }
        ])
        // borderColor: 'transparent',
        // borderWidth: 80,
        // borderType: 'solid',
        // shadowColor: '#fac858',
        // shadowBlur: 0,
        // shadowOffsetX: 0,
        // shadowOffsetY: 40
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
    top: '4%',
    left: '8%'
  },
  grid: {
    top: '14%',
    left: '8%',
    right: '8%',
    bottom: '8%',
    containLabel: true
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
    axisLabel: {
      color: '#ffffff'
    },
    axisTick: {
      show: false
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

export const pieCardOption = {
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
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['30%', '90%'],
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
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['20%', '60%'],
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
      radius: ['20%', '30%'],
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
