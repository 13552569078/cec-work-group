<template>
  <div class="eventJK_commonMD">
    <div class="title"><span>事件流入监控统计</span></div>
    <div class="putcontent">
      <div class="totalbox">
        <div class="e">
          <div class="l"><i class="icon1" /><span>统计周期接入量：</span></div>
          <div class="r"><b>{{ allDataObj.withinCount | changeNumToStr }}</b><span>件</span></div>
        </div>
        <div class="e">
          <div class="l"><i class="icon2" /><span>今日接入总量：</span></div>
          <div class="r"><b>{{ allDataObj.todayCount | changeNumToStr }}</b><span>件</span></div>
        </div>
        <div class="e">
          <div class="l"><i class="icon3" /><span>历史接入总量：</span></div>
          <div class="r"><b>{{ allDataObj.totalCount | changeNumToStr }}</b><span>件</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'EventInTJ',
  components: {
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
      allDataObj: {}
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
      const res = await moduleSrv.getInflowTotalCount(params)
      if (res.code === SUCCESS_CODE) {
        this.allDataObj = res.data || {}
      }
    }
  }
}
</script>
<style scoped lang="scss">
.totalbox {
  padding: 17px 20px 0px 20px;
  .e {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 97px;
    background: rgba(255,255,255,0.8);
    box-shadow: 4px 4px 10px 0px rgba(166,174,189,0.3);
    border-radius: 4px;
    padding: 20px;
    margin-bottom: 16px;
    .l {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .icon1 {
        width: 16px;
        height: 16px;
        background: url('~@/assets/workbench/dbicon_all@2x.png') no-repeat;
        background-size: 100% 100%;
      }
      .icon2 {
        width: 16px;
        height: 16px;
        background: url('~@/assets/workbench/dbicon_3@2x.png') no-repeat;
        background-size: 100% 100%;
      }
      .icon3 {
        width: 16px;
        height: 16px;
        background: url('~@/assets/workbench/dbicon_2@2x.png') no-repeat;
        background-size: 100% 100%;
      }
      span {
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        margin-left: 8px;
      }
    }
    .r {
      b {
        font-size: 30px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #202020;
      }
      span {
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        margin-left: 4px;
      }
    }
  }
}
</style>
