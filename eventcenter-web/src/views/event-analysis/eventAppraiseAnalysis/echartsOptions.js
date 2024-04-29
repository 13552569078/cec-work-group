// 已评价事件类型占比
const dataspt = []
export const inPlatformOptions = {
  color: ['#4AADFF', '#99D749', '#FFB53D', '#5B83F0', '#57DFE6'],
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(20, 29, 51, 0.8)',
    borderColor: '#CC933D',
    borderWidth: 1,
    formatter: (params) => {
      let htmltags = ''
      htmltags += `<div style="display:flex;justify-content: space-between;align-items: center;">
                    <span>
                      ${params.marker}
                      <span style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5;">${params.name}</span>
                    </span>
                    <span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF;background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${params.data.count}件</span>
                    <span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF;background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${params.value}%</span>
                  </div>`
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
    show: true,
    type: 'scroll',
    orient: 'vertical',
    top: 'center',
    right: '10%',
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
      name: '已评价事件类型占比',
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

// 待评价事件类型TOP5
export const historyDayTopFiveOptions = {
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(20, 29, 51, 0.8)',
    borderColor: '#CC933D',
    borderWidth: 1,
    formatter: (params) => {
      let htmltags = ''
      params.forEach((val, idx) => {
        htmltags += `<div style="display:flex;justify-content: space-between;align-items: center;">
                      <span>
                        ${val.marker}
                        <span style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5;">${val.name}</span>
                      </span>
                      <span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF;background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${val.data.count}件</span>
                    </div>`
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
    minInterval: 1,
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
      name: '待评价事件类型TOP5',
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
        color: 'rgba(54,164,255,0.35)'
      },
      emphasis: {
        itemStyle: {
          borderColor: '#36A4FF',
          borderWidth: 1,
          borderType: 'solid',
          color: 'rgba(54,164,255,0.65)'
        }
      }
    }
  ]
}

// 待配置事件类型占比
const dataslx = []
export const inEventTypeOptions = {
  color: ['#4AADFF', '#99D749', '#FFB53D', '#5B83F0', '#57DFE6'],
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(20, 29, 51, 0.8)',
    borderColor: '#CC933D',
    borderWidth: 1,
    formatter: (params) => {
      let htmltags = ''
      htmltags += `<div style="display:flex;justify-content: space-between;align-items: center;">
                    <span>
                      ${params.marker}
                      <span style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5;">${params.name}</span>
                    </span>
                    <span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF;background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${params.data.count}件</span>
                    <span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF;background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${params.value}%</span>
                  </div>`
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
    show: true,
    type: 'scroll',
    orient: 'vertical',
    top: 'center',
    right: '2%',
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
      name: '待配置事件类型占比',
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

// 已办结事件总数、已评价、待评价、未配置分析
export const eventInViewTongHuanBiOptions = {
  color: ['#99D749', '#FFB53D', '#57DFE6', '#36A4FF'],
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
    },
    formatter: (params) => {
      let htmltip = `<div style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5; display:flex;justify-content: space-between;align-items: center;">
                      <span>${params[1].name}</span>
                    </div>`
      params.forEach(val => {
        htmltip += `<div style="display:flex;justify-content: space-between;align-items: center; margin-top: 5px;">
                      <span>
                        ${val.marker}
                        <span style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5; width: 80px;">${val.seriesName}</span>
                      </span>
                      <span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF; background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${val.value}件</span>
                    </div>`
      })
      return htmltip
    }
  },
  legend: {
    data: ['已评价', '待评价', '未配置', '已办结事件总数'],
    right: 30,
    top: 5,
    itemGap: 20,
    textStyle: {
      fontFamily: 'PingFangSC-Regular',
      fontSize: '14px',
      color: '#666666'
    }
  },
  grid: {
    top: 60,
    left: 30,
    right: 30,
    bottom: 20,
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
      name: '已评价',
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
            offset: 0, color: 'rgba(153,215,73,0.1)' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(255,255,255,0.32)' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      }
    },
    {
      name: '待评价',
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
            offset: 0, color: 'rgba(255,181,61,0.19)' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(255,255,255,0.32)' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      }
    },
    {
      name: '未配置',
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
            offset: 0, color: 'rgba(87,223,230,0.19)' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(255,255,255,0.32)' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      }
    },
    {
      name: '已办结事件总数',
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
            offset: 0, color: 'rgba(54,164,255,0.19)' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(255,255,255,0.32)' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      }
    }
  ]
}

// 已办结事件总数、已评价、待评价、未配置分析-饼图
const dataspw = []
export const tbhbRightOptions = {
  color: ['#99D749', '#FFB53D', '#57DFE6'],
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(20, 29, 51, 0.8)',
    borderColor: '#CC933D',
    borderWidth: 1,
    formatter: (params) => {
      let htmltags = ''
      htmltags += `<div style="display:flex;justify-content: space-between;align-items: center;">
                      <span>
                        ${params.marker}
                        <span style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5;">${params.name}</span>
                      </span>
                    </div>`
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
  grid: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },
  legend: {
    show: true,
    type: 'scroll',
    orient: 'vertical',
    top: 'bottom',
    right: '3%',
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
    data: dataspw,
    formatter: (name) => {
      if (dataspw.length) {
        const item = dataspw.filter((item) => item.name === name)[0]
        return `{name|${name}}{value|${item.radio}}{rate|%}`
      }
    }
  },
  series: [
    {
      name: '已评价、待评价、未配置分析',
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['55%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderWidth: 4,
        borderType: 'solid',
        borderColor: '#F5F7FA'
      },
      label: {
        show: true,
        position: 'outside'
      },
      labelLine: {
        show: true
      },
      data: dataspw
    }
  ]
}

// 事件评价满分率排名
export const manyilvFiveOptions = {
  color: ['#FFB53D', '#91D737', '#36A4FF'],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(20, 29, 51, 0.8)',
    borderColor: '#CC933D',
    borderWidth: 1,
    formatter: (params) => {
      let htmltags = ''
      params.forEach((val, idx) => {
        htmltags += `<div style="display:flex;justify-content: space-between;align-items: center;">
                      <span>
                        ${val.marker}
                        <span style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5;">${val.seriesName}</span>
                      </span>
                      <span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF;background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${val.data.count}件</span>
                    </div>`
      })
      return `<div style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5;">事件评价满分率排名</div>${htmltags}`
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
    top: 45,
    right: 120,
    bottom: 40
  },
  legend: {
    show: true,
    top: '4%',
    left: '3%',
    icon: 'rect',
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 20,
    textStyle: {
      fontFamily: 'PingFangSC-Regular',
      fontSize: '14px',
      color: '#666666'
    }
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
    minInterval: 1,
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
      name: '满分评价',
      data: [
        {
          value: 100,
          name: '2022-08-22',
          count: 100
        },
        {
          value: 88,
          name: '2022-08-22',
          count: 88
        },
        {
          value: 77,
          name: '2022-08-22',
          count: 77
        },
        {
          value: 66,
          name: '2022-08-22',
          count: 66
        },
        {
          value: 85,
          name: '2022-08-22',
          count: 85
        }
      ],
      type: 'bar',
      stack: 'positive',
      showBackground: false,
      backgroundStyle: {
        color: 'rgba(54,164,255,0.1)'
      },
      barWidth: '12px',
      itemStyle: {
        borderColor: '#FFB53D',
        borderWidth: 1,
        borderType: 'solid',
        color: 'rgba(255,181,61,0.2)'
      },
      emphasis: {
        itemStyle: {
          borderColor: '#FFB53D',
          borderWidth: 1,
          borderType: 'solid',
          color: 'rgba(255,181,61,0.65)'
        }
      }
    },
    {
      name: '已评价',
      data: [
        {
          value: 100,
          name: '2022-08-22',
          count: 100
        },
        {
          value: 88,
          name: '2022-08-22',
          count: 88
        },
        {
          value: 77,
          name: '2022-08-22',
          count: 77
        },
        {
          value: 66,
          name: '2022-08-22',
          count: 66
        },
        {
          value: 85,
          name: '2022-08-22',
          count: 85
        }
      ],
      type: 'bar',
      stack: 'positive',
      showBackground: false,
      backgroundStyle: {
        color: 'rgba(54,164,255,0.1)'
      },
      barWidth: '12px',
      itemStyle: {
        borderColor: '#91D737',
        borderWidth: 1,
        borderType: 'solid',
        color: 'rgba(145,215,55,0.2)'
      },
      emphasis: {
        itemStyle: {
          borderColor: '#91D737',
          borderWidth: 1,
          borderType: 'solid',
          color: 'rgba(145,215,55,0.65)'
        }
      }
    },
    {
      name: '事件总数',
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
      stack: 'positive',
      showBackground: false,
      backgroundStyle: {
        color: 'rgba(54,164,255,0.1)'
      },
      barWidth: '12px',
      itemStyle: {
        borderColor: '#36A4FF',
        borderWidth: 1,
        borderType: 'solid',
        color: 'rgba(54,164,255,0.35)'
      },
      emphasis: {
        itemStyle: {
          borderColor: '#36A4FF',
          borderWidth: 1,
          borderType: 'solid',
          color: 'rgba(54,164,255,0.65)'
        }
      }
    }
  ]
}

// 事件评价差评率排名
export const chapinglvFiveOptions = {
  color: ['#FFB53D', '#91D737', '#36A4FF'],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(20, 29, 51, 0.8)',
    borderColor: '#CC933D',
    borderWidth: 1,
    formatter: (params) => {
      let htmltags = ''
      params.forEach((val, idx) => {
        htmltags += `<div style="display:flex;justify-content: space-between;align-items: center;">
                      <span>
                        ${val.marker}
                        <span style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5;">${val.seriesName}</span>
                      </span>
                      <span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF;background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${val.data.count}件</span>
                    </div>`
      })
      return `<div style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5;">事件评价差评率排名</div>${htmltags}`
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
    top: 45,
    right: 120,
    bottom: 40
  },
  legend: {
    show: true,
    top: '4%',
    left: '3%',
    icon: 'rect',
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 20,
    textStyle: {
      fontFamily: 'PingFangSC-Regular',
      fontSize: '14px',
      color: '#666666'
    }
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
    minInterval: 1,
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
      name: '差评评价',
      data: [
        {
          value: 100,
          name: '2022-08-22',
          count: 100
        },
        {
          value: 88,
          name: '2022-08-22',
          count: 88
        },
        {
          value: 77,
          name: '2022-08-22',
          count: 77
        },
        {
          value: 66,
          name: '2022-08-22',
          count: 66
        },
        {
          value: 85,
          name: '2022-08-22',
          count: 85
        }
      ],
      type: 'bar',
      stack: 'positive',
      showBackground: false,
      backgroundStyle: {
        color: 'rgba(54,164,255,0.1)'
      },
      barWidth: '12px',
      itemStyle: {
        borderColor: '#FFB53D',
        borderWidth: 1,
        borderType: 'solid',
        color: 'rgba(255,181,61,0.2)'
      },
      emphasis: {
        itemStyle: {
          borderColor: '#FFB53D',
          borderWidth: 1,
          borderType: 'solid',
          color: 'rgba(255,181,61,0.65)'
        }
      }
    },
    {
      name: '已评价',
      data: [
        {
          value: 100,
          name: '2022-08-22',
          count: 100
        },
        {
          value: 88,
          name: '2022-08-22',
          count: 88
        },
        {
          value: 77,
          name: '2022-08-22',
          count: 77
        },
        {
          value: 66,
          name: '2022-08-22',
          count: 66
        },
        {
          value: 85,
          name: '2022-08-22',
          count: 85
        }
      ],
      type: 'bar',
      stack: 'positive',
      showBackground: false,
      backgroundStyle: {
        color: 'rgba(54,164,255,0.1)'
      },
      barWidth: '12px',
      itemStyle: {
        borderColor: '#91D737',
        borderWidth: 1,
        borderType: 'solid',
        color: 'rgba(145,215,55,0.2)'
      },
      emphasis: {
        itemStyle: {
          borderColor: '#91D737',
          borderWidth: 1,
          borderType: 'solid',
          color: 'rgba(145,215,55,0.65)'
        }
      }
    },
    {
      name: '事件总数',
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
      stack: 'positive',
      showBackground: false,
      backgroundStyle: {
        color: 'rgba(54,164,255,0.1)'
      },
      barWidth: '12px',
      itemStyle: {
        borderColor: '#36A4FF',
        borderWidth: 1,
        borderType: 'solid',
        color: 'rgba(54,164,255,0.35)'
      },
      emphasis: {
        itemStyle: {
          borderColor: '#36A4FF',
          borderWidth: 1,
          borderType: 'solid',
          color: 'rgba(54,164,255,0.65)'
        }
      }
    }
  ]
}

