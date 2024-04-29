// 历史趋势分析
export const eventInViewHistoryTendOptions = {
  color: ['#36A4FF'],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(20, 29, 51, 0.8)',
    borderColor: '#CC933D',
    borderWidth: 1,
    formatter: (params) => {
      let htmltags = ''
      params.forEach((val, idx) => {
        htmltags += `<div style="display:flex;justify-content: space-between;align-items: center;">${val.marker}<span style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5; flex-grow: 1;">${val.name}</span><span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF;background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${val.value}件</span></div>`
      })
      return `<div style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5;">${params[0].seriesName}</div>${htmltags}`
    },
    axisPointer: {
      lineStyle: {
        width: 32,
        type: 'solid',
        color: 'rgba(54,164,255,0.10)'
      }
    }
  },
  grid: {
    top: 50,
    left: '30',
    right: '50',
    bottom: '10',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['2022-01', '2022-02', '2022-03', '2022-04', '2022-05', '2022-06', '2022-07'],
    axisLabel: {
      fontFamily: 'PingFangSC-Regular',
      fontSize: '14px',
      color: '#666666'
    },
    axisLine: {
      lineStyle: {
        color: '#EDEDED'
      }
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      fontFamily: 'PingFangSC-Medium',
      fontSize: '14px',
      color: '#BDBDBD',
      fontWeight: 'bold',
      formatter: function(value) {
        const val = value
        if (+val > 9999) {
          return `${val / 10000}万`
        } else {
          return `${val}`
        }
      }
    },
    splitLine: {
      lineStyle: {
        color: '#EDEDED'
      }
    },
    name: '单位：件',
    nameTextStyle: {
      fontFamily: 'PingFangSC-Medium',
      fontSize: '14px',
      color: '#BDBDBD',
      fontWeight: 'bold'
    }
  },
  series: [
    {
      name: '统计周期事件流出趋势分析',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210],
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(54,164,255,0.1)' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(255,255,255,0.32)' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      }
    }
  ]
}

export const taskEventInViewHistoryTendOptions = {
  color: ['#91D737'],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(20, 29, 51, 0.8)',
    borderColor: '#CC933D',
    borderWidth: 1,
    formatter: (params) => {
      let htmltags = ''
      params.forEach((val, idx) => {
        htmltags += `<div style="display:flex;justify-content: space-between;align-items: center;">${val.marker}<span style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5; flex-grow: 1;">${val.name}</span><span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF;background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${val.value}件</span></div>`
      })
      return `<div style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5;">${params[0].seriesName}</div>${htmltags}`
    },
    axisPointer: {
      lineStyle: {
        width: 32,
        type: 'solid',
        color: 'rgba(54,164,255,0.10)'
      }
    }
  },
  grid: {
    top: 50,
    left: '30',
    right: '50',
    bottom: '10',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['2022-01', '2022-02', '2022-03', '2022-04', '2022-05', '2022-06', '2022-07'],
    axisLabel: {
      fontFamily: 'PingFangSC-Regular',
      fontSize: '14px',
      color: '#666666'
    },
    axisLine: {
      lineStyle: {
        color: '#EDEDED'
      }
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      fontFamily: 'PingFangSC-Medium',
      fontSize: '14px',
      color: '#BDBDBD',
      fontWeight: 'bold',
      formatter: function(value) {
        const val = value
        if (+val > 9999) {
          return `${val / 10000}万`
        } else {
          return `${val}`
        }
      }
    },
    splitLine: {
      lineStyle: {
        color: '#EDEDED'
      }
    },
    name: '单位：件',
    nameTextStyle: {
      fontFamily: 'PingFangSC-Medium',
      fontSize: '14px',
      color: '#BDBDBD',
      fontWeight: 'bold'
    }
  },
  series: [
    {
      name: '统计周期任务流出趋势分析',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210],
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(145,215,55,0.19)' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(255,255,255,0.32)' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      }
    }
  ]
}

// 接入平台
const dataspt = []
export const inPlatformOptions = {
  color: ['#36A4FF', '#41D2D9', '#91D737', '#FFAD26', '#4875F0'],
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(20, 29, 51, 0.8)',
    borderColor: '#CC933D',
    borderWidth: 1,
    formatter: (params) => {
      let htmltags = ''
      htmltags += `<div style="display:flex;justify-content: space-between;align-items: center;">${params.marker}<span style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5;">${params.name}</span><span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF;background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${params.value}%</span></div>`
      return `<div style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5;">${params.seriesName}</div>${htmltags}`
    },
    axisPointer: {
      type: 'shadow',
      shadowStyle: {
        color: '#FFFFFF',
        opacity: 0.15
      }
    }
  },
  legend: {
    show: false,
    type: 'scroll',
    orient: 'vertical',
    top: 'center',
    right: '0%',
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 20,
    textStyle: {
      align: 'left',
      color: '#',
      verticalAlign: 'middle',
      rich: {
        name: {
          width: 90,
          fontSize: 16,
          color: '#666666'
        },
        value: {
          align: 'right',
          fontFamily: 'Medium',
          fontSize: 16,
          fontWeight: 'bold'
        },
        rate: {
          align: 'right',
          fontSize: 16,
          color: '#202020'
        }
      }
    },
    data: dataspt,
    formatter: (name) => {
      if (dataspt.length) {
        const item = dataspt.filter((item) => item.name === name)[0]
        return `{name|${name}}{value|${item.radio}}{rate|%}`
      }
    }
  },
  series: [
    {
      name: '处置平台',
      type: 'pie',
      center: ['30%', '50%'],
      radius: ['55%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderWidth: 4,
        borderType: 'solid',
        borderColor: '#F5F7FA'
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '16',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: dataspt
    }
  ]
}

// 接入类型
const dataslx = []
export const inEventTypeOptions = {
  color: ['#36A4FF', '#41D2D9', '#91D737', '#FFAD26', '#4875F0'],
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(20, 29, 51, 0.8)',
    borderColor: '#CC933D',
    borderWidth: 1,
    formatter: (params) => {
      let htmltags = ''
      htmltags += `<div style="display:flex;justify-content: space-between;align-items: center;">${params.marker}<span style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5;">${params.name}</span><span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF;background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${params.value}%</span></div>`
      return `<div style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5;">${params.seriesName}</div>${htmltags}`
    },
    axisPointer: {
      type: 'shadow',
      shadowStyle: {
        color: '#FFFFFF',
        opacity: 0.15
      }
    }
  },
  legend: {
    show: false,
    type: 'scroll',
    orient: 'vertical',
    top: 'center',
    right: '0%',
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 20,
    textStyle: {
      align: 'left',
      color: '#',
      verticalAlign: 'middle',
      rich: {
        name: {
          width: 90,
          fontSize: 16,
          color: '#666666'
        },
        value: {
          align: 'right',
          fontFamily: 'Medium',
          fontSize: 16,
          fontWeight: 'bold'
        },
        rate: {
          align: 'right',
          fontSize: 16,
          color: '#202020'
        }
      }
    },
    data: dataslx,
    formatter: (name) => {
      if (dataslx.length) {
        const item = dataslx.filter((item) => item.name === name)[0]
        return `{name|${name}}{value|${item.radio}}{rate|%}`
      }
    }
  },
  series: [
    {
      name: '任务类型',
      type: 'pie',
      center: ['30%', '50%'],
      radius: ['55%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderWidth: 4,
        borderType: 'solid',
        borderColor: '#F5F7FA'
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '16',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: dataslx
    }
  ]
}

// 历史每天top5
export const historyDayTopFiveOptions = {
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(20, 29, 51, 0.8)',
    borderColor: '#CC933D',
    borderWidth: 1,
    formatter: (params) => {
      let htmltags = ''
      params.forEach((val, idx) => {
        htmltags += `<div style="display:flex;justify-content: space-between;align-items: center;">${val.marker}<span style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5;">${val.name}</span><span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF;background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${val.data.count}件</span></div>`
      })
      return `<div style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5;">${params[0].seriesName}</div>${htmltags}`
    },
    axisPointer: {
      type: 'shadow',
      shadowStyle: {
        color: '#cccccc',
        opacity: 0.15
      }
    }
  },
  grid: {
    left: 125,
    top: 15,
    right: 40,
    bottom: 40
  },
  xAxis: {
    type: 'value',
    axisLabel: {
      fontFamily: 'PingFangSC-Medium',
      fontSize: '14px',
      color: '#BDBDBD',
      fontWeight: 'bold',
      formatter: function(value) {
        const val = value
        if (+val > 9999) {
          return `${val / 10000}万`
        } else {
          return `${val}`
        }
      }
    },
    splitLine: {
      lineStyle: {
        color: '#EDEDED'
      }
    }
  },
  yAxis: {
    type: 'category',
    data: ['2022-08-22', '2022-08-22', '2022-08-22', '2022-08-22', '2022-08-22'],
    inverse: true,
    axisLabel: {
      fontFamily: 'PingFangSC-Regular',
      fontSize: '16px',
      color: function(value, index) {
        return index < 3 ? '#36A4FF' : '#666666'
      }
    },
    axisLine: {
      lineStyle: {
        color: '#EDEDED'
      }
    }
  },
  series: [
    {
      name: '历史每日流出任务量TOP5',
      data: [
        {
          value: 100,
          name: '2022-08-22',
          count: 100
        },
        {
          value: 88,
          name: '2022-08-22',
          count: 100
        },
        {
          value: 77,
          name: '2022-08-22',
          count: 100
        },
        {
          value: 66,
          name: '2022-08-22',
          count: 100
        },
        {
          value: 85,
          name: '2022-08-22',
          count: 100
        }
      ],
      type: 'bar',
      showBackground: false,
      backgroundStyle: {
        color: 'rgba(54,164,255,0.1)'
      },
      barWidth: '12px',
      itemStyle: {
        borderColor: '#36A4FF',
        borderWidth: 1,
        borderType: 'solid',
        color: 'rgba(54,164,255,0.65)'
      }
    }
  ]
}

// 事件接入量同比环比趋势
export const eventInViewTongHuanBiOptions = {
  color: ['#36A4FF', '#91D737'],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(20, 29, 51, 0.8)',
    borderColor: '#CC933D',
    borderWidth: 1,
    axisPointer: {
      lineStyle: {
        width: 32,
        type: 'solid',
        color: 'rgba(54,164,255,0.10)'
      }
    }
  },
  legend: {
    data: ['2021年', '2022年'],
    right: 30,
    top: 5,
    textStyle: {
      fontFamily: 'PingFangSC-Regular',
      fontSize: '14px',
      color: '#666666'
    }
  },
  grid: {
    top: 60,
    left: '30',
    right: '50',
    bottom: '20',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    axisLabel: {
      fontFamily: 'PingFangSC-Regular',
      fontSize: '14px',
      color: '#666666'
    },
    axisLine: {
      lineStyle: {
        color: '#EDEDED'
      }
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      fontFamily: 'PingFangSC-Medium',
      fontSize: '14px',
      color: '#BDBDBD',
      fontWeight: 'bold',
      formatter: function(value) {
        const val = value
        if (+val > 9999) {
          return `${val / 10000}万`
        } else {
          return `${val}`
        }
      }
    },
    splitLine: {
      lineStyle: {
        color: '#EDEDED'
      }
    },
    name: '单位：件',
    nameTextStyle: {
      fontFamily: 'PingFangSC-Medium',
      fontSize: '14px',
      color: '#BDBDBD',
      fontWeight: 'bold'
    }
  },
  series: [
    {
      name: '2021年',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90],
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(54,164,255,0.1)' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(255,255,255,0.32)' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      }
    },
    {
      name: '2022年',
      type: 'line',
      data: [220, 182, 191, 234, 290, 330, 310, 220, 232, 201, 234, 290],
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(145,215,55,0.19)' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(255,255,255,0.32)' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      }
    }
  ]
}

