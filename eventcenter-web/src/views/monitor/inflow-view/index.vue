<template>
  <div class="contentbox">
    <div class="searchbox">
      <search-panel label-width="100" @search="getViewDataFn" @reset="resetViewDataFn">
        <panel-item label="统计周期">
          <el-date-picker
            v-model="form.curDateArr"
            type="monthrange"
            align="right"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            format="yyyy-MM"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          />
        </panel-item>
      </search-panel>
    </div>

    <div class="viewechartbox">
      <div class="vchrline">
        <div class="cmmodule width33">
          <eventInTJ :prop-search-date="propSearchDate" />
        </div>
        <div class="cmmodule width66">
          <historyTend :prop-search-date="propSearchDate" />
        </div>
      </div>
      <div class="vchrline">
        <div class="cmmodule width33">
          <inPlatform :prop-search-date="propSearchDate" />
        </div>
        <div class="cmmodule width33">
          <inEventType :prop-search-date="propSearchDate" />
        </div>
        <div class="cmmodule width33">
          <historyDayTop5 :prop-search-date="propSearchDate" />
        </div>
      </div>
      <div class="vchrline">
        <div class="cmmodule width100">
          <eventTBHB :prop-search-date="propSearchDate" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventInTJ from './eventInTJ.vue'
import historyTend from './historyTend.vue'
import inPlatform from './inPlatform.vue'
import inEventType from './inEventType.vue'
import historyDayTop5 from './historyDayTop5.vue'
import eventTBHB from './eventTBHB.vue'

export default {
  name: 'EventInView',
  components: {
    eventInTJ,
    historyTend,
    inPlatform,
    inEventType,
    historyDayTop5,
    eventTBHB
  },
  mixins: [],
  data() {
    return {
      databtntype: 'week',
      pickerOptions: {
        disabledDate(time) {
          const nowdateYear = new Date().getFullYear()
          const nowdateMonth = new Date().getMonth() + 1
          const yearagoYear = nowdateMonth + 1 > 12 ? nowdateYear : nowdateYear - 1
          const yearagoMonth = nowdateMonth + 1 > 12 ? 1 : nowdateMonth + 1
          const agodate = `${yearagoYear}-${
            yearagoMonth < 10 ? `0${yearagoMonth}` : yearagoMonth
          }-01 00:00:00`
          return (
            time.getTime() > Date.now() || time.getTime() < new Date(agodate).getTime()
          )
        }
      },
      form: {
        curDateArr: [],
        propSearchDate: []
      }
    }
  },
  computed: {},
  created() {
    this.quickDateCk()
  },
  mounted() {},
  methods: {
    quickDateCk(dataArr = []) {
      if (dataArr.length === 0) {
        const nowdateYear = new Date().getFullYear()
        const nowdateMonth = new Date().getMonth() + 1
        const nowmonthday = new Date(nowdateYear, nowdateMonth, 0).getDate()
        const yearagoYear = nowdateMonth + 1 > 12 ? nowdateYear : nowdateYear - 1
        const yearagoMonth = nowdateMonth + 1 > 12 ? 1 : nowdateMonth + 1
        this.form.curDateArr = [
          `${yearagoYear}-${
            yearagoMonth < 10 ? `0${yearagoMonth}` : yearagoMonth
          }-01 00:00:00`,
          `${nowdateYear}-${
            nowdateMonth < 10 ? `0${nowdateMonth}` : nowdateMonth
          }-${nowmonthday} 23:59:59`
        ]
      } else {
        const agodateYear = new Date(this.form.curDateArr[0]).getFullYear()
        const agodateMonth = new Date(this.form.curDateArr[0]).getMonth() + 1
        const nowdateYear = new Date(this.form.curDateArr[1]).getFullYear()
        const nowdateMonth = new Date(this.form.curDateArr[1]).getMonth() + 1
        const nowmonthday = new Date(nowdateYear, nowdateMonth, 0).getDate()
        this.form.curDateArr = [
          `${agodateYear}-${
            agodateMonth < 10 ? `0${agodateMonth}` : agodateMonth
          }-01 00:00:00`,
          `${nowdateYear}-${
            nowdateMonth < 10 ? `0${nowdateMonth}` : nowdateMonth
          }-${nowmonthday} 23:59:59`
        ]
      }
      this.propSearchDate = JSON.parse(JSON.stringify(this.form.curDateArr))
    },
    getViewDataFn() {
      this.quickDateCk(this.form.curDateArr)
    },
    resetViewDataFn() {
      this.quickDateCk()
    }
  }
}
</script>
<style scoped lang="scss">
.contentbox {
  width: 100%;
  height: 100%;
  overflow: auto;
  .searchbox {
    width: 100%;
    height: 75px;
  }
  .viewechartbox {
    margin-top: 16px;
    .vchrline {
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      &:last-child {
        margin-bottom: 0px;
      }
      .width33 {
        width: calc(33.33% - 11px);
      }
      .width66 {
        width: calc(66.66% - 5px);
      }
      .width100 {
        width: 100%;
      }
      .cmmodule {
        height: 420px;
        background: #ffffff;
      }
    }
  }
}
</style>
