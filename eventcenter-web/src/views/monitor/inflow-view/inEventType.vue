<template>
  <div class="eventJK_commonMD">
    <div class="title"><span>接入类型</span></div>
    <div class="putcontent">
      <div class="echarts_box">
        <pie-chart
          v-if="echartsOptions.series && echartsOptions.series.length > 0"
          :chart-data="echartsOptions"
        />
        <div class="huanbg" />
        <div class="topbox">
          <div class="t">TOP5</div>
          <div v-for="(val, idx) in top5List" :key="idx" class="e"><div><i :class="['n'+(idx+1)]" /><span>{{ val.eventTypeName }}</span></div><b>{{ val.eventTypeNum | changeNumToStr }}</b></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import pieChart from '@/components/echarts/pieChart.vue'
import { inEventTypeOptions } from './echartsOptions'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'InPlatform',
  components: {
    pieChart
  },
  filters: {
    changeNumToStr(num) {
      if (num === undefined || num === null) {
        return 0
      } else {
        const useNum = Number(num)
        return useNum.toLocaleString()
      }
    }
  },
  mixins: [],
  props: {
    propSearchDate: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      echartsOptions: {},
      top5List: []
    }
  },
  computed: {
  },
  watch: {
    propSearchDate: {
      deep: true,
      immediate: true,
      handler(nval) {
        this.getMdDataFn(nval)
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    async getMdDataFn(dateArr) {
      const params = {
        beginTime: dateArr[0],
        endTime: dateArr[1]
      }
      const res = await moduleSrv.getInflowAnalysisByEventType(params)
      if (res.code === SUCCESS_CODE) {
        const qushiList = res.data || []
        // top5数据处理
        this.top5List = qushiList.slice(0, 5)
        // echarts数据处理
        const useEchartsOptions = inEventTypeOptions
        useEchartsOptions.legend.data = []
        useEchartsOptions.series[0].data = []
        const dataspt = []
        qushiList.slice(0, 5).forEach(val => {
          const eobj = {
            value: val.eventTypeNumPercent,
            name: val.eventTypeName,
            radio: val.eventTypeNumPercent,
            count: val.eventTypeNum
          }
          dataspt.push(eobj)
        })
        if (qushiList.length > 5) {
          const other = {
            value: 0,
            name: '其他',
            radio: 0,
            count: 0
          }
          qushiList.slice(5).forEach(val => {
            other.value += Number(val.eventTypeNumPercent)
            other.radio += Number(val.eventTypeNumPercent)
            other.count += Number(val.eventTypeNum)
          })
          other.value = other.value.toFixed(2)
          dataspt.push(other)
        }
        useEchartsOptions.legend.data = dataspt
        useEchartsOptions.series[0].data = dataspt
        useEchartsOptions.legend.formatter = (name) => {
          if (dataspt.length) {
            const item = dataspt.filter((item) => item.name === name)[0]
            return `{name|${name}}{value|${item.radio}}{rate|%}`
          }
        }
        this.echartsOptions = useEchartsOptions
      }
    }
  }
}
</script>
<style scoped lang="scss">
.echarts_box {
  width: 100%;
  height: 350px;
  position: relative;
  .huanbg {
    width: 180px;
    height: 180px;
    background: url('~@/assets/workbench/oval@2x.png') no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 50%;
    left: 30%;
    margin: -90px 0 0 -90px;
    pointer-events: none;
  }
  .topbox {
    width: 170px;
    position: absolute;
    top: 20%;
    left: calc(30% + 90px + 60px);
    .t {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #4B4B4B;
      margin-bottom: 18px;
    }
    .e {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
      > div {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        i.n1 {
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: #36A4FF;
        }
        i.n2 {
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: #41D2D9;
        }
        i.n3 {
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: #91D737;
        }
        i.n4 {
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: #FFAD26;
        }
        i.n5 {
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: #4875F0;
        }
        span {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #4B4B4B;
          margin-left: 5px;
        }
      }
      b {
        font-size: 17px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #202020;
      }
    }
  }
}
</style>
