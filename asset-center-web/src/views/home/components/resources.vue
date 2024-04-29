<template>
  <div class="home-bottom-left">
    <div class="title-box">
      <div class="title">最新开发应用
      </div>
      <div class="title-right" @click="goMore">
        <c-button type="text" icon="c-icon-more">更多</c-button>
      </div>
    </div>
    <div class="content">
      <div v-for="item in appList" :key="item.appId" class="app-list-item" @click="goDetail(item,'app')">
        <div class="img" :style="`background-image:url(${previewUrl+item.appIcon})`"></div>
        <div class="app-info">
          <div class="title" :class="{hasversion:!!item.version}">
            <span>{{ item.appName }}</span>
            <i v-if="item.version" class="version">{{ item.version }}</i>
          </div>
          <div class="tag">{{ item.sceneName }}</div>
          <div class="subtitle">{{ item.appDesc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { openAppList } from '@/api'
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js';
import * as echart from 'echarts'
import { goDetail } from '@/utils'
export default {
  name: 'Resources',
  data() {
    return {
      appList: [],
      previewUrl: getProxyUrl(serviceSuffix.fdfs_preview_prefix) + '/'

    }
  },
  mounted() {
    // this.setEchart1()
    // this.setEchart2()
    this.getList()
  },
  methods: {
    getList() {
      openAppList({
        pageSize: 4
      }).then(res => {
        this.appList = res.data.list
      })
    },
    goMore() {
      this.$router.push({
        path: '/application-management'
      })
    },
    goDetail(row, flag) {
      if (flag === 'app') {
        row.assetType = 99
        row.assetId = row.id
      }
      goDetail(row)
    },
    fixWithWhiteSpace(maxLen, text, prefix = true) {
      if (text && maxLen) {
        const num = maxLen - text.length
        return prefix && num > 0 ? Array(num + 1).join('  ') + text : text + Array(num + 1).join('   ')
      }
      return text
    },
    setEchart1() {
      const pieData = [
        { value: 4, name: '模型资源' },
        { value: 7, name: '流程资源' },
        { value: 18, name: '对象资源' },
        { value: 5, name: '数据资源' },
        { value: 66, name: '技术资源' }
      ]
      const option = {
        color: ['#4CC09E', '#6E88F3', '#49ADFF', '#28E2B2', '#F7DB82', '#FCAE5C'],
        legend: {
          orient: 'vertical',
          icon: 'rect',
          right: '5%',
          top: 'center',
          itemGap: 14,
          itemWidth: 12,
          itemHeight: 12,
          formatter: (name) => { // 该函数用于设置图例显示后的百分比
            const data = pieData
            let total = 0
            let value = 0
            data.forEach((item) => {
              total += item.value
              if (item.name === name) {
                value = item.value
              }
            })
            const p = ((value / total) * 100).toFixed(1) // 求出百分比
            const maxNamelen = Math.max(...data.map(p => p.name.length))
            const maxPercentageLen = Math.max(...data.map(p => ((p.value / total) * 100).toFixed(1).length))
            // 返回出图例所显示的内容是名称+百分比
            return [`${this.fixWithWhiteSpace(maxNamelen, name, false)}` + '          ' + `${this.fixWithWhiteSpace(maxPercentageLen, p || '0')}%`]
          }
        },
        series: [{
          name: '占比分析',
          type: 'pie',
          radius: ['60%', '90%'],
          center: ['30%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: false
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          },
          data: pieData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.1)'
            }
          }
        }]
      }
      echart.init(document.getElementById('echarts1')).setOption(option, true);
    },
    setEchart2() {
      const option = {
        grid: {
          top: '5%',
          left: '0%',
          right: '0%',
          bottom: '5%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          },
          extraCssText: 'border-radius: 0;',
          formatter: (params) => `
          <div style="backgroundColor:#fff;borderRaduis:0">
            ${params[0].marker}
            <span>${params[0].axisValue} <span style="font-weight: bold; margin-left: 30px">${params[0].value}</span></span>
          </div>
          `
        },
        xAxis: {
          axisLabel: {
            fontSize: 12,
            color: 'rgba(128, 128, 160, 0.65)',
            lineHeight: 20,
            margin: 5
          },
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(128, 128, 160, 0.15)'
            }
          },
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月']
        },
        yAxis: {
          splitNumber: 3,
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(128, 128, 160, 0.15)'
            }
          },
          axisLabel: {
            fontSize: 12,
            color: 'rgba(128, 128, 160, 0.65)',
            lineHeight: 20
          },
          type: 'value'
        },
        series: [
          {
            itemStyle: {
              color: '#FA8B16'
            },
            symbolSize: 0,
            lineStyle: {
              width: 2
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(250, 139, 22, 0.1)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(250, 139, 22, 0.1)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
            data: [27, 35, 48, 50, 68, 95, 137, 153, 159, 182],
            type: 'line'
          }
        ]
      }
      echart.init(document.getElementById('echarts2')).setOption(option, true);
    }
  }
}
</script>
<style lang="scss" scoped>
.home-bottom-left {
  background: #ffffff;
  padding: 0 28px 20px;
  display: flex;
  flex-direction: column;
  width: 460px;
}

.app-list-item {
  width: 404px;
  height: 114px;
  display: flex;
  align-items: center;
  padding: 0px;
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  cursor: pointer;
  .img {
    flex-shrink: 0;
    width: 192px;
    height: 108px;
    margin-right: 16px;
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position-x: center;
  }

  .title {
    height: 28px;

    /* 标题样式/h3 */
    font-size: 16px;
    line-height: 28px;
    display: flex;
    align-items: center;
    margin-bottom: 13px;
    span {
      display: block;
      width: 196px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: #202020;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &.hasversion span {
      width: 114px;
    }

    .version {
      width: 72px;
      height: 20px;
      background: url(~@/assets/imgs/version-bg.png) no-repeat;
      background-size: 100%;

      font-size: 14px;
      font-family: PingFangSC-Regular;
      display: block;
      padding-left: 28px;
      line-height: 20px;
      margin-left: 10px;
      color: #4B4B4B;
    }

  }
}

.tag {
  padding: 4px 8px;
  border-radius: 2px;
  display: inline-block;
  /* 背景色/bg-light */
  background: #F6F9FB;
  font-size: 14px;
  color: #4B4B4B;
}

.subtitle {
  width: 196px;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
  margin-top: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* 文本色/text-secondary */
  color: #8A8A8A;
}

.title-box {
  display: flex;
  height: 72px;
  align-items: center;

  .title {
    width: 100%;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    font-weight: 500;
    color: #202020;
    display: flex;
    align-items: center;
    display: flex;

    &::before {
      content: '';
      display: block;
      width: 5px;
      height: 18px;
      margin-right: 15px;
      background: #36a4ff;
    }
  }

  .title-right {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;

    .total {
      display: flex;
      align-items: center;

      .total-label {
        color: #4B4B4B;
        font-size: 14px;
        font-weight: bold;
        width: 28px;
      }

      .total-num {
        position: relative;
        color: #36A4FF;
        font-size: 30px;
        margin: 0 12px;
      }
    }

    .increase {
      display: flex;
      align-items: center;

      .increase-num {
        color: #00B42A;
        font-size: 12px;
        margin-right: 4px;
      }
    }
  }
}

.content {

  overflow: auto;

  .ecahrts-title {
    color: #202020;
    font-size: 14px;
    font-weight: bold;
  }

  .echarts {
    flex: 1;
    background: #ffffff;
    padding: 24px;
    display: flex;
    overflow: auto;
    flex-direction: column;

    .echarts-con {
      flex: 1;
      margin-top: 24px;
    }
  }
}
</style>
