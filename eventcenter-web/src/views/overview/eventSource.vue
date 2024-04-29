<!--
 * @description 任务中心-待办任务
 * @date 2020-09-08
 * @author lism
-->
<template>
  <div class="come_box_wuse">
    <div class="title">事件来源分布</div>
    <div class="content">
      <div class="echarts_box">
        <pie-chart
          v-if="option.series && option.series.length > 0"
          :chart-data="option"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import pieChart from '@/components/echarts/pieChart.vue'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'EventSource',
  components: {
    pieChart
  },
  props: {
    sysCodeAllLength: {
      type: Number,
      default: () => 0
    },
    searchFormProps: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      option: {}
    }
  },
  watch: {
    searchFormProps: {
      deep: true,
      handler(nVal) {
        if (!nVal.beginTime || !nVal.endTime) return
        this.getDataFn(nVal)
      }
    }
  },
  created() {
  },
  methods: {
    getDataFn({ sysCodes, beginTime, endTime }) {
      const params = {
        sysCodes,
        beginTime,
        endTime
      }
      moduleSrv.getBusSoure(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          const datas = []
          const useDatas = res.data || []

          // 判定是否要补齐 其他
          if (useDatas.length < this.sysCodeAllLength && useDatas.length !== 0) {
            const allRadio = useDatas.reduce((previousValue, currentValue) => previousValue + Number(currentValue.radio), 0)
            const allCount = useDatas.reduce((previousValue, currentValue) => previousValue + Number(currentValue.count), 0)
            useDatas.push({
              count: useDatas[0].totalCount - allCount,
              name: '其他',
              radio: (100 - allRadio).toFixed(2)
            })
          }

          useDatas.forEach(val => {
            datas.push({
              value: +val.count,
              name: val.name,
              radio: val.radio
            })
          })
          this.option = {
            color: ['#5B83F0', '#4AADFF', '#FFB53D'],
            tooltip: {
              trigger: 'item',
              backgroundColor: 'rgba(20, 29, 51, 0.8)',
              borderColor: '#CC933D',
              borderWidth: 1,
              formatter: (params) => {
                let htmltags = ''
                htmltags += `<div style="display:flex;justify-content: space-between;align-items: center;">${params.marker}<span style="font-size: 14px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: #FFFBF5;">${params.name}</span><span style="margin-left: 20px;font-size: 14px;font-family: DINPro-Bold, DINPro;font-weight: bold;color: #FFFFFF;background: linear-gradient(180deg, #FCEDE5 0%, #FFD2A2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">${params.value}件</span></div>`
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
              type: 'scroll',
              orient: 'vertical',
              top: 'center',
              right: '0%',
              icon: 'circle',
              itemWidth: 30,
              itemHeight: 8,
              itemGap: 20,
              textStyle: {
                align: 'left',
                color: '#',
                verticalAlign: 'middle',
                rich: {
                  name: {
                    width: 120,
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
              data: datas,
              formatter: (name) => {
                if (datas.length) {
                  const item = datas.filter((item) => item.name === name)[0]
                  if (name.length > 5) name = name.substr(0, 5) + '...'
                  return `{name|${name}}{value|${item.radio}}{rate|%}`
                }
              }
            },
            series: [
              {
                name: '事件来源分布',
                type: 'pie',
                center: ['25%', '50%'],
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
                data: datas
              }
            ]
          }
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.content {
  padding: 0 30px 20px 30px;
  .echarts_box {
    width: 100%;
    height: 260px;
  }
}
</style>
