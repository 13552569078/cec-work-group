<!--/*
* @Author: dingli
* @Desc: 资源分析
* @Date:
*/-->
<template>
  <div class="asset-chart-wrap">
    <h3 class="info-title">资源分析</h3>
    <span v-if="showBack" class="btn-back" @click="clickBack">返回<i class="icon-back" /></span>
    <div class="flex">
      <div class="chart-pie">
        <span v-show="optionVal" class="title">资源组成</span>
        <chart-box
          ref="refPieChart"
          :chart-option="optionVal"
          :no-data="noData"
          @chartClick="_getChartClick"
        />
        <div class="legend-wrap">
          <p v-for="item in legendList" :key="`legend-${item.type}`" class="legend-item">
            <i class="icon-color" :style="`background:${item.color}`"></i>
            <span class="legend-item-name">{{ item.name }}</span>
            <span class="legend-item-rate">{{ item.p / 100 }}%</span>
            <span class="">{{ item.value }}</span>
          </p>
        </div>
      </div>
    </div>
    <empty v-if="!optionVal" text="暂无数据" type="no-data" style="height:100%;width:300px;margin-left:-150px;" class="cls-empty" />
  </div>
</template>
<script>
import chartBox from '@/components/echarts'
import { referAssetTypeObj, ASSET_SUBTYPE } from '@/utils/enumerate'
import { queryAssetAnalysis, queryOverview } from '@/api/statistics'
import empty from '@l/components/empty'
export default {
  name: 'AssetChart',
  components: {
    chartBox,
    empty
  },
  data() {
    return {
      thirdPartRate: 0,
      noData: false,
      optionVal: null,
      showBack: false,
      legendList: [],
      referAssetTypeObj,
      ASSET_SUBTYPE,
      color: ['#899DF0', '#88dbc8', '#7ecdff', '#f8938d', '#f9bf6a', '#CACFD6'],
      borderStartColor: ['#b3c0f5', '#b3e8dc', '#acdfff', '#fabab6', '#fbd6a0', 'rgba(202, 207, 214, 0.3)']
    }
  },
  computed: {
    barHeight() {
      const h = Math.round(134 - (134 * this.thirdPartRate / 100)) + 26
      return `top:${h}px`
    }
  },
  mounted() {
    this.getRateData()
    this.getData()
  },
  methods: {
    clickBack() {
      this.showBack = false
      this.getData(null, true)
    },
    _getChartClick(data) {
      // 流程和模型保留至1级
      if ([5, 7].indexOf(+data.data.type) !== -1) return
      if (!this.showBack) {
        this.showBack = true
        this.getData(data.data.type, true)
      }
    },
    setOption(dataArr) {
      if (!dataArr.length) {
        this.optionVal = null
        return
      }
      dataArr = dataArr.map((d, i) => ({ ...d, color: this.color[i], itemStyle: { normal: { color: this.color[i] }}}))
      this.legendList = dataArr
      const options = {
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          },
          borderWidth: 0,
          formatter: '{b}'
        },
        legend: {
          show: false
        },
        series: [
          { // 主要展示层的
            radius: ['45%', '65%'],
            center: ['40%', '50%'],
            type: 'pie',
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            name: '',
            data: dataArr
          },
          { // 边框的设置
            radius: ['45%', '34%'],
            center: ['40%', '50%'],
            type: 'pie',
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            animation: false,
            tooltip: {
              show: false
            },
            data: dataArr.map((d, i) => ({ ...d, itemStyle: { normal: { color: this.borderStartColor[i] }}}))
          }
        ]
      }
      this.optionVal = options
    },
    async getRateData() {
      try {
        let resdata = await queryOverview()
        resdata = resdata.data
        let asset = Object.values(resdata.assetInfo)
        asset = asset.reduce((p, c) => {
          p = p || 0
          c = c || 0
          return p + c
        })
        resdata.apimInfo.apimCount = resdata.apimInfo.apimCount || 0
        if (!asset) {
          this.thirdPartRate = 0
        } else {
          this.thirdPartRate = Math.round(10000 * resdata.apimInfo.apimCount / asset) / 100
        }
      } catch (e) {
        // e
      }
    },
    async getData(assetType, resize) {
      try {
        let resdata = await queryAssetAnalysis({ assetType })
        resdata = resdata.data
        let sum = 0
        resdata.forEach((d) => {
          sum += (d.count || 0)
        })
        let count = 0
        const arrObj = {}
        let arr = []

        resdata.forEach((d, i) => {
          const item = {
            ...d,
            name: this.referAssetTypeObj[d.type] || this.ASSET_SUBTYPE[d.type],
            value: d.count,
            p: sum ? Math.round(10000 * d.count / sum) : 0
          }
          if (item.value) {
            arrObj[item.name] = item
          }
        })
        if (!assetType) {
          arr = []
          // 此举为保证图例顺序。。。😒😒😒
          const keys = ['流程资源', '对象资源', '数据资源', '技术资源', '模型资源']
          keys.forEach(k => {
            if (arrObj[k]) {
              arr.push(arrObj[k])
            }
          })
        } else {
          arr = Object.values(arrObj)
        }
        arr.forEach((d, i) => {
          if (i < arr.length - 1) {
            count += d.p
          }
        })
        if (arr.length > 1) {
          arr[arr.length - 1].p = 10000 - count
        }
        this.setOption(arr)
        if (resize) {
          this.$nextTick(() => {
            this.$refs.refPieChart.resize()
          })
        }
      } catch (e) {
        // e
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.info-title {
  margin-top: 20px;
  margin-bottom: 0px;
  margin-left: 20px;
}
.asset-chart-wrap {
  position: relative;
  width: 732px;
  height: 326px;
  background: #FFFFFF;
}

.icon-back {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url(~@/assets/img/icon-back.png) no-repeat center;
  background-size: 100%;
}
.btn-back{
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  justify-items: center;
  cursor: pointer;
  &:hover {
    color: #36A4FF;
    .icon-back {
      background: url(~@/assets/img/icon-back-hover.png) no-repeat center;
      background-size: 100%;
    }
  }
}
.chart-pie {
  position: relative;
  width: 280px;
  height: 280px;
  .title {
    position: absolute;
    top: 50%;
    left: 40%;
    transform: translate(-50%, -50%);
    font-size: 16px;
  }
  .legend-wrap {
    width: 250px;
    position: absolute;
    top: 50%;
    // right: -298px;
    left: 280px;
    transform: translateY(-50%);
    .legend-item {
      display: flex;
      align-items: center;
      margin-top: 16px;
      &:first-child {
        margin-top: 0;
      }
    }
    .icon-color {
      margin-right: 8px;
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .legend-item-name {
      width: 88px;
    }
    .legend-item-rate {
      width: 65px;
      padding-right: 20px;
      text-align: right;
    }
  }
}
.flex {
  width: 540px;
  margin: 0 auto;
}
.third-part {
  position: relative;
  width: 200px;
  margin-right: 72px;
  text-align: center;
  .rate-text {
    font-size: 32px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #202020;
  }
  &::before {
    content: '';
    position: absolute;
    width: 1px;
    height: 92px;
    background: #EDEDED;
    top: 85px;
    left: -28px;
  }
}
.bar {
  margin: 0 auto;
  margin-top: 8px;
  margin-bottom: 10px;
  position: relative;
  width: 32px;
  height: 160px;
  background: #F1F2F4;
  .line {
    width: 196px;
    position: absolute;
    top: 26px;
    left: -65px;
    border-bottom: 1px dashed #2F54ED;
    &::after {
      content: '占比：100%';
      color: #2F54ED;
      font-size: 12px;
      position: absolute;
      right: 0;
      top: 9px;
    }
  }
  .bar-rate {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    top: 26px;
    background: rgba(47, 84, 237, 0.7);
  }
}
.cls-empty {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}
</style>
