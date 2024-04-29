<template>
  <div class="eventJK_commonMD">
    <div class="title"><span>待配置事件类型占比</span></div>
    <div class="putcontent">
      <div class="echarts_box">
        <pie-chart
          v-if="echartsOptions.series && echartsOptions.series.length > 0"
          :chart-data="echartsOptions"
        />
        <div class="huanbg" />
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
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      echartsOptions: {}
    }
  },
  computed: {
  },
  watch: {
    propSearchDate: {
      deep: true,
      immediate: true,
      handler(nval) {
        if (!nval.sysCodes || !nval.dateArr) return
        this.getMdDataFn(nval.sysCodes, nval.dateArr)
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    async getMdDataFn(sysCodes, dateArr) {
      const params = {
        sysCodes,
        beginTime: dateArr[0],
        endTime: dateArr[1]
      }
      const res = await moduleSrv.getEvaluateAnalysisNoPZ(params)
      if (res.code === SUCCESS_CODE) {
        const qushiList = res.data || []
        // echarts数据处理
        const useEchartsOptions = inEventTypeOptions
        useEchartsOptions.legend.data = []
        useEchartsOptions.series[0].data = []
        const dataspt = []
        qushiList.forEach(val => {
          const eobj = {
            value: val.rate,
            name: val.eventTypeName,
            rate: val.rate,
            count: val.count
          }
          dataspt.push(eobj)
        })
        useEchartsOptions.legend.data = dataspt
        useEchartsOptions.series[0].data = dataspt
        useEchartsOptions.legend.formatter = (name) => {
          if (dataspt.length) {
            if (name.length > 10) name = name.substr(0, 10) + '...'
            return `{name|${name}}`
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
