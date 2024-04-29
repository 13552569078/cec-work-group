<template>
  <div class="page-container">
    <div class="strategy-config-accrual-list">
      <div class="search-tree">
        <tree @nodeClick="nodeClick" />
      </div>
      <div v-if="headerData && headerData.id" class="content-right">
        <div class="head">
          <div class="head-left">
            <img src="@/assets/svg/daochu.svg">
            <div class="head-left-name">{{ headerData.name || "--" }}</div>
          </div>
          <div class="head-right">
            {{ headerData.remark || "--" }}
          </div>
        </div>
        <div class="content-result">
          <div class="content-result-time">{{ yearAndMon || "--" }}</div>
          <work-time
            :now-time="timeData.timeList"
            :work-list="workList"
            @getWorkList="getWorkList"
            @yearAndMon="getYearAndMon"
          />
        </div>
      </div>
      <div v-else class="no-content">
        <img src="@/assets/svg/暂无任何内容.svg" alt="">
        <span>暂时还没有配置排班表，请先进行排班</span>
      </div>
    </div>
  </div>
</template>
<script>
import moduleSrv from '@/api/dispatch'
import workTime from './workTime.vue'
import tree from './tree'
import { SUCCESS_CODE } from '@/constants'
export default {
  name: 'WorkList',
  components: { tree, workTime },
  data() {
    return {
      tableList: [],
      headerData: {},
      timeData: {},
      workList: [],
      yearAndMon: ''
    }
  },
  methods: {
    // 树 点击事件
    nodeClick(data) {
      this.headerData = data
      this.getTimeData()
      this.getWorkList(data)
    },
    getTimeData() {
      moduleSrv.getTime().then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.timeData = res.data
          this.yearAndMon = res.data.yearAndMon
        }
      })
    },
    getWorkList() {
      moduleSrv.getRotaInfo({ rotaId: this.headerData?.id }).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.workList = res.data
        }
      })
    },
    getYearAndMon(value) {
      this.yearAndMon = value
    }
  }
}
</script>

<style lang="scss" scoped>
.strategy-config {
  &-accrual-list {
    display: flex;
    height: 100%;
    .search-tree {
      flex: 0 0 272px;
      width: 272px;
      margin: 0 16px 16px 0;
    }
    .content-right {
      background: #fff;
      // flex: 1;
      overflow: hidden;
      height: calc(100% - 18px);
      width: calc(100% - 292px);
      // padding-bottom: 60px; // 避免内容被分页遮挡
      display: flex;
      flex-direction: column;
      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 86px;
        background: #f9fafe;
        padding: 0 20px;
        margin: 20px 20px 0 20px;
        &-left {
          display: flex;
          align-items: center;
          &-name {
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #2b2b2b;
            font-weight: 500;
          }
        }
        &-right {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          line-height: 20px;
          color: #4b4b4b;
          font-weight: 400;
          text-align: right;
          width: 600px;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .content-result {
        background-color: $white;
        height: calc(100% - 86px);
        padding: 20px;
        &-time {
          font-family: PingFangSC-Semibold;
          font-size: 20px;
          color: #4b4b4b;
          font-weight: 600;
          padding-left: 40px;
        }
      }
    }
    .no-content {
      background: #fff;
      width: calc(100% - 292px);
      height: calc(100% - 18px);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-flow: column;
      padding-bottom: 100px;
    }
  }
}
</style>
