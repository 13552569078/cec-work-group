<template>
  <div class="eventJK_commonMD">
    <div class="title"><span>评价总览</span></div>
    <div class="putcontent">
      <div class="pjallviewbox">
        <div class="l">
          <div class="titlewan">
            <div class="txtlf">
              <i class="icon1" />
              <span>事件已评价总数：</span>
            </div>
            <div class="txtrt">
              <b>{{ allDataObj.totalCount | changeNumToStr }}</b>
              <span>件</span>
            </div>
          </div>

          <div class="titleqian">
            <div class="txtlf">
              <span>事件人工评价总数</span>
            </div>
            <div class="txtrt">
              <b>{{ allDataObj.manualCount | changeNumToStr }}</b>
              <span>件</span>
            </div>
          </div>

          <div class="titleqian">
            <div class="txtlf">
              <span>事件系统评价总数</span>
            </div>
            <div class="txtrt">
              <b>{{ allDataObj.autoCount | changeNumToStr }}</b>
              <span>件</span>
            </div>
          </div>
        </div>
        <div class="r">
          <div class="rightlanbg">
            <div class="titlewan">
              <div class="txtlf">
                <i class="icon2" />
                <span>事件待评价总数：</span>
              </div>
              <div class="txtrt">
                <b>{{ allDataObj.stayCount | changeNumToStr }}</b>
                <span>件</span>
              </div>
            </div>
          </div>

          <div class="rightlanbg" style="margin-top: 16px;">
            <div class="titlewan">
              <div class="txtlf">
                <i class="icon3" />
                <span>事件待评价配置总数：</span>
              </div>
              <div class="txtrt">
                <b>{{ allDataObj.noConfigCount | changeNumToStr }}</b>
                <span>件</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'EaAllView',
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
      type: Object,
      default: () => {}
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
      const res = await moduleSrv.getEvaluateAnalysisOverview(params)
      if (res.code === SUCCESS_CODE) {
        this.allDataObj = res.data || {}
      }
    }
  }
}
</script>
<style scoped lang="scss">
.pjallviewbox {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .l {
    width: calc(50% - 10px);
    height: 196px;
    background: rgba(0,164,255,0.03);
    border-radius: 4px;
    padding: 20px;
  }
  .r {
    width: calc(50% - 10px);
    height: 196px;
    .rightlanbg {
      width: 100%;
      height: 90px;
      background: rgba(0,164,255,0.03);
      border-radius: 4px;
      padding: 20px;
    }
  }
  .titlewan {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .txtlf {
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
        font-size: 24px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #313131;
        margin-left: 8px;
      }
    }
    .txtrt {
      b {
        font-size: 38px;
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
  .titleqian {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 22px;
    .txtlf {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      span {
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
      }
    }
    .txtrt {
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
