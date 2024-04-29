<!--
 * @description 任务中心-待办任务
 * @date 2020-09-08
 * @author lism
-->
<template>
  <div class="come_box_wuse">
    <div class="title">事件处置状态分布</div>
    <div class="content">
      <div class="eallv">
        <div class="lu">事件上报量：</div>
        <div class="ru"><span>{{ moduleData.totalCount }}</span><em>件</em></div>
      </div>
      <div class="uptext">
        <div class="s"><b>{{ moduleData.dispatchCount }}</b><span>件</span></div>
        <div class="x">已派发事件量</div>
      </div>
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
    searchFormProps: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      option: {},
      moduleData: {}
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
      moduleSrv.getBusProcessAnalysis(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          const useDatas = res.data || {}
          this.moduleData = res.data || {}
          const datas = [
            { name: '未受理', value: useDatas.noAcceptCount },
            { name: '处理中', value: useDatas.handingCount },
            { name: '已完成', value: useDatas.endCount }
          ]
          this.option = {
            color: ['#4AADFF', '#57DFE6', '#F7DB70'],
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
                    fontSize: 14,
                    color: '#666666'
                  }
                }
              },
              data: datas,
              formatter: (name) => {
                if (datas.length) {
                  const item = datas.filter((item) => item.name === name)[0]
                  return `{name|${name}}{value|${item.value}} {rate|件}`
                }
              }
            },
            series: [
              {
                name: '事件处置状态分布',
                type: 'pie',
                center: ['25%', '50%'],
                radius: ['75%', '90%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderWidth: 0,
                  borderType: 'solid',
                  borderColor: '#F5F7FA'
                },
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    show: false,
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
  padding: 0 0px 10px 0px;
  position: relative;
  .eallv {
    width: 100%;
    height: 60px;
    padding: 0 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-image: linear-gradient(243deg, rgba(0,164,255,0.00) 0%, rgba(0,164,255,0.10) 95%);
    .lu {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #202020;
      letter-spacing: 0;
      font-weight: bold;
    }
    .ru {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-family: DINAlternate-Bold;
        font-size: 30px;
        color: #202020;
        letter-spacing: 0;
        font-weight: bold;
      }
      em {
        font-style: normal;
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #666666;
        letter-spacing: 0;
        margin-left: 10px;
      }
    }
  }
  .uptext {
    position: absolute;
    z-index: 2;
    width: 130px;
    height: 130px;
    top: 105px;
    left: calc((100% - 60px) * 0.25 + 30px);
    margin-left: -65px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    pointer-events: none;
    .s {
      display: flex;
      justify-content: center;
      align-items: center;
      b {
        font-family: DINAlternate-Bold;
        font-size: 30px;
        color: #202020;
        letter-spacing: 0;
        text-align: center;
        font-weight: bold;
      }
      span {
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #666666;
        letter-spacing: 0;
        margin-left: 4px;
      }
    }
    .x {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #202020;
      letter-spacing: 0;
      font-weight: bold;
      margin-top: 5px;
    }
  }
  .echarts_box {
    width: 100%;
    height: 200px;
    padding: 0 30px;
    margin-top: 10px;
  }
}
</style>
