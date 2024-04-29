<!--/*
* @Author: dingli
* @Desc: 场景分析
* @Date:
*/-->
<template>
  <div class="scene-chart-wrap">
    <h3 class="info-title">场景分析</h3>
    <c-date-picker
      v-model="dateValue"
      size="small"
      class="cls-date-picker"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions"
      @change="timeChange"
    />
    <div class="flex">
      <div class="bar-wrap">
        <chart-box ref="refBarChart" :chart-option="optionBar" @chartClick="_getChartBarClick" />
        <div class="legent-wrap">
          <span>应用数量</span>
          <span>资源数量(具备场景)</span>
        </div>
      </div>
      <div class="pie-wrap">
        <chart-box ref="refPieChart" :chart-option="optionPie" />
        <template v-if="optionPie">
          <!-- <i class="line"></i> -->
          <span class="title">场景占比</span>
        </template>
      </div>
    </div>
    <empty v-if="!optionBar" text="暂无数据" type="no-data" style="height:100%;width:340px;" class="cls-empty" />
    <empty v-if="!optionPie" text="暂无数据" type="no-data" style="height:200px;width:340px;" class="cls-empty-pie" />
  </div>
</template>
<script>
import moment from 'moment-cn'
import chartBox from '@/components/echarts'
import empty from '@l/components/empty'
import { querySceneAnalysis } from '@/api/statistics'
import { referAssetTypeObj, ASSET_SUBTYPE } from '@/views/statistics/enumerate.js'
export default {
  name: 'SceneChart',
  components: { chartBox, empty },
  props: {},
  data() {
    return {
      optionBar: null,
      optionPie: null,
      dateValue: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '本周',
          onClick(picker) {
            picker.$emit('pick', [new Date(moment().day(1).valueOf()), new Date()])
          }
        }, {
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', [new Date(moment(1, 'DD').valueOf()), new Date()])
          }
        }, {
          text: '本年',
          onClick(picker) {
            picker.$emit('pick', [new Date(moment(1, 'MM').valueOf()), new Date()])
          }
        }]
      },
      color: ['rgba(129, 210, 187, 0.9)', 'rgba(129, 210, 187, 0.75)', 'rgba(129, 210, 187, 0.55)', 'rgba(129, 210, 187, 0.35)'],
      referAssetTypeObj, ASSET_SUBTYPE,
      dataAll: null
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    _getChartBarClick(data) {
      this.getData(this.dataAll[data.dataIndex].sceneId, true)
    },
    timeChange() {
      this.getData(null, true)
    },
    setPieOptions(dataArr) {
      const options = {
        color: ['rgba(47, 84, 237, 0.7)', 'rgba(54, 164, 255, 0.7)', 'rgba(76, 192, 158, 0.7)', 'rgba(246, 187, 6, 0.7)', 'rgba(250, 139, 22, 0.7)', 'rgba(255, 77, 79, 0.7)'],
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          },
          borderWidth: 0,
          formatter(data) {
            data = data.data
            const arr = []
            if (data.assets) {
              data.assets.forEach(d => {
                arr.push(`<p style="color:#4b4b4b;"><span style="color:#8a8a8a;display:inline-block;width:70px;">${referAssetTypeObj[d.assetType] || ASSET_SUBTYPE[d.assetType]}</span> ${d.count}</p>`)
              })
            }
            arr.unshift(`<p style="color:#4b4b4b;"><span style="display:inline-block;width:70px;">资源</span> ${data.assetCount}</p>`)
            arr.unshift(`<p style="color:#4b4b4b;"><span style="display:inline-block;width:70px;">应用</span> ${data.appCount}</p>`)
            arr.unshift(`<p style="color:#4b4b4b;">${data.name}</p>`)
            return arr.join('')
          }
        },
        legend: {
          show: false
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['48%', '70%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 0,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              normal: {
                show: false
              }
            },
            labelLine: {
              show: false
            },
            data: dataArr
          }
        ]
      }
      this.optionPie = options
    },
    setBarOptions(data) {
      const xdata = []
      const appData = []
      const assetObj = {}
      data.forEach((d, i) => {
        xdata.push(d.sceneName)
        appData.push(d.appCount)
        if (d.assets && d.assets.length) {
          d.assets.forEach(dd => {
            assetObj[dd.assetType] = assetObj[dd.assetType] || new Array(data.length).fill(null)
            assetObj[dd.assetType][i] = dd.count
          })
        }
      })
      const series = []
      Object.keys(assetObj).forEach((k, i) => {
        series.push({
          name: referAssetTypeObj[k] || ASSET_SUBTYPE[k],
          type: 'bar',
          stack: 'Ad',
          barMaxWidth: 10,
          large: true, // 开启大数据量优化
          itemStyle: {
            borderWidth: 1,
            borderColor: '#81D2BB',
            color: this.color[i] || this.color[0]
          },
          assetKey: k,
          data: assetObj[k]
        })
      })
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter(data) {
            const arr = []
            let app = 0
            let sum = 0
            data.forEach(d => {
              const v = d.value || 0
              if (d.seriesName !== '应用') {
                sum += v
                if (v) {
                  arr.push(`<p style="color:#4b4b4b;"><span style="color:#8a8a8a;display:inline-block;width:70px;">${d.seriesName}</span> ${v}</p>`)
                }
              } else {
                app = v
              }
            })
            arr.unshift(`<p style="color:#4b4b4b;"><span style="display:inline-block;width:70px;">资源</span> ${sum}</p>`)
            arr.unshift(`<p style="color:#4b4b4b;"><span style="display:inline-block;width:70px;">应用</span> ${app}</p>`)
            arr.unshift(`<p style="color:#4b4b4b;">${data[0].axisValueLabel}</p>`)
            return arr.join('')
          }
        },
        legend: {
          show: false,
          right: '4%',
          top: 24,
          selectedMode: false,
          itemWidth: 8,
          itemHeight: 8,
          itemStyle: {
            borderWidth: 1,
            borderRadius: 0
          },
          textStyle: {
            color: '#8a8a8a'
          }
        },
        grid: {
          top: 64,
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#EDEDED'
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#8a8a8a',
                fontSize: 12
              }
            },
            axisTick: {
              show: false
            },
            data: xdata
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '单位/个',
            minInterval: 1,
            Interval: 10,
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#EDEDED']
              }
            },
            axisLabel: {
              textStyle: {
                color: '#8a8a8a',
                fontSize: 12
              }
            },
            nameTextStyle: {
              color: '#8a8a8a',
              fontSize: 14,
              fontWeight: 400,
              padding: [10, 10]
            }
          }
        ],
        series: [
          {
            name: '应用',
            type: 'bar',
            barMaxWidth: 10,
            large: true, // 开启大数据量优化
            itemStyle: {
              borderWidth: 1,
              borderColor: '#36A4FF',
              color: 'rgba(54, 164, 255, 0.35)'
            },
            data: appData
          },
          ...series
        ]
      }
      this.optionBar = option
    },
    async getData(sceneId, resize) {
      try {
        const params = {
          startTime: '',
          endTime: '',
          sceneId
        }
        if (this.dateValue && this.dateValue.length === 2) {
          params.startTime = moment(this.dateValue[0].getTime()).format('YYYY-MM-DD') + ' 00:00:00'
          params.endTime = moment(this.dateValue[1].getTime()).format('YYYY-MM-DD') + ' 23:59:59'
        }
        let resdata = await querySceneAnalysis(params)
        resdata = resdata.data
        if (!sceneId) {
          this.dataAll = resdata
          this.setBarOptions(resdata)
          if (resize) {
            this.$nextTick(() => {
              this.$refs.refBarChart.resize()
            })
          }
        }
        const pieArr = []
        resdata.forEach(d => {
          const item = { ...d, name: d.sceneName }
          item.assetCount = d.assets.reduce((p, v) => {
            p = p || 0
            v = v && v.count || 0
            return p + v
          }, 0)
          item.value = item.assetCount + (d.appCount || 0)
          if (item.value) {
            pieArr.push(item)
          }
        })
        pieArr.sort((a, b) => b.value - a.value)
        const _pieArr = []
        let appCount = 0
        let assetCount = 0
        pieArr.forEach((d, i) => {
          if (i < 5) {
            _pieArr.push(d)
          } else {
            appCount += d.appCount
            assetCount += d.assetCount
          }
        })
        if (pieArr.length > 5) {
          _pieArr.push({
            name: '其他',
            value: assetCount + appCount,
            assetCount,
            appCount
          })
        }
        this.setPieOptions(_pieArr)

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
<style scoped lang="scss">
.scene-chart-wrap {
  position: relative;
  width: 100%;
  height: 384px;
  background: #FFFFFF;
}
.info-title {
  padding-top: 20px;
  margin-bottom: 0px;
  margin-left: 20px;
}
.flex {
  width: 100%;
  display: flex;
}
.bar-wrap {
  flex: 1;
  position: relative;
  // width: 1170px;
  height: 330px;
}
.pie-wrap {
  position: relative;
  width: 452px;
  height: 344px;
  .line {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 1px;
    height: 92px;
    background: #EDEDED;
  }
  .title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
  }
}
.cls-date-picker {
  width: 400px;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 999;
}
.cls-empty, .cls-empty-pie {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}
.cls-empty-pie {
  left: 1400px;
  top: 100px;
}
.legent-wrap {
  display: flex;
  position: absolute;
  right: 40px;
  top: 20px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4b4b4b;
  span:first-child{
    margin-right: 16px;
    padding-left: 16px;
    position: relative;
    &::before {
      content: '';
      width: 8px;
      height: 8px;
      background: rgba(54, 164, 255, 0.35);
      border: 1px solid #36A4FF;
      position: absolute;
      top: 2px;
      left: 0;
    }
  }
  span:last-child{
    padding-left: 16px;
    position: relative;
    &::before {
      content: '';
      width: 8px;
      height: 8px;
      background: rgba(129, 210, 187, 0.35);
      border: 1px solid #81D2BB;
      position: absolute;
      top: 2px;
      left: 0;
    }
  }
}
</style>
