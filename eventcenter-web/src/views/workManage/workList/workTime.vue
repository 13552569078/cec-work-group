<template>
  <div class="work-time">
    <div class="header">
      <div class="left-btn">
        <i class="el-icon-arrow-left" @click="preEvent" />
      </div>
      <div v-for="(item, index) in weekList" :key="index" class="header-item">
        <div class="week">{{ item.name }}</div>
        <div class="date">{{ item.date }}</div>
      </div>
      <div class="right-btn">
        <i class="el-icon-arrow-right" @click="nextEvent" />
      </div>
    </div>
    <div class="content-father">
      <div v-for="(item, index) in workList" :key="index" class="content">
        <div class="default-item first" :style="backgroundPic(index)">
          <div class="default-item-content">
            <div class="first-title">{{ item.name }}</div>
            <div class="first-time">{{ item.time }}</div>
          </div>
        </div>
        <div class="default-item other">{{ item.nameMon }}</div>
        <div class="default-item other">{{ item.nameTue }}</div>
        <div class="default-item other">{{ item.nameWed }}</div>
        <div class="default-item other">{{ item.nameThu }}</div>
        <div class="default-item other">{{ item.nameFri }}</div>
        <div class="default-item other">{{ item.nameSat }}</div>
        <div class="default-item other">{{ item.nameSun }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
const backgroundImg1 = require('@/assets/插图1.png')
const backgroundImg2 = require('@/assets/插图2.png')
const backgroundImg3 = require('@/assets/插图3.png')
const backgroundImg4 = require('@/assets/插图4.png')
const backgroundImg5 = require('@/assets/插图5.png')
export default {
  name: 'WorkTime',
  props: {
    nowTime: {
      type: Array,
      default: () => []
    },
    workList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      weekList: [
        {
          name: '星期一',
          date: ''
        },
        {
          name: '星期二',
          date: ''
        },
        {
          name: '星期三',
          date: ''
        },
        {
          name: '星期四',
          date: ''
        },
        {
          name: '星期五',
          date: ''
        },
        {
          name: '星期六',
          date: ''
        },
        {
          name: '星期日',
          date: ''
        }
      ],
      dataList: []
    }
  },

  watch: {
    nowTime: {
      handler(nVal) {
        this.weekList.forEach((item, index) => {
          item.date = nVal[index]
        })
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // this.getTime()
  },
  methods: {
    backgroundPic(index) {
      let temp
      switch (index) {
        case 0:
          temp = backgroundImg1
          break
        case 1:
          temp = backgroundImg2
          break
        case 2:
          temp = backgroundImg3
          break
        case 3:
          temp = backgroundImg4
          break
        default:
          temp = backgroundImg5
          break
      }
      return {
        background: `url(${
          temp
        }) no-repeat 0 0 / 100% 100%`
      }
    },
    // 上一周
    preEvent() {
      console.log(this.weekList[0]?.date)
      this.getTime(this.weekList[0]?.date, '1')
    },
    // 下一周
    nextEvent() {
      console.log(this.weekList[this.weekList?.length - 1]?.date)
      this.getTime(this.weekList[this.weekList?.length - 1]?.date, '2')
    },
    // 获取一周日期
    getTime(date, type) {
      const params = {
        date,
        type
      }
      moduleSrv.getTime(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          const { timeList, yearAndMon } = res.data
          this.weekList.forEach((item, index) => {
            item.date = timeList[index]
          })
          this.$emit('yearAndMon', yearAndMon)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.work-time {
  height: calc(100% - 24px);
  overflow: hidden;
  .header {
    display: flex;
    position: relative;
    &-item {
      height: 75px;
      width: 12.5%;
      display: flex;
      flex-flow: column;
      justify-content: space-around;
      // margin-left: 20px;
    }
    .left-btn,
    .right-btn {
      height: 75px;
      width: 12.5%;
      display: flex;
      align-items: center;
      padding: 0 10px;
      cursor: pointer;
      .el-icon-arrow-left,
      .el-icon-arrow-right {
        cursor: pointer;
        font-size: 32px;
        font-weight: 700;
        color: #bfbfbf;
        &:hover,
        &:active {
          color: #3ba6ff;
        }
      }
    }
    .right-btn {
      position: absolute;
      right: 0;
      justify-content: end;
    }
  }
  .content-father {
    height: calc(100% - 130px);
    overflow-y: auto;
    .content {
      display: flex;
      box-shadow: 0 0 15px #eee;
      margin-bottom: 10px;
      height: 160px;
      .default-item {
        height: 100%;
        width: 185px;
        &-content {
          height: 100%;
          display: flex;
          flex-flow: column;
          justify-content: space-around;
          border-right: 1px solid #e7e7e7;
          height: calc(100% - 20px);
          margin: 10px 0;
        }
      }
      .first {
        padding-left: 16px;
        background-size: 100% 100%;
        &-title {
          font-family: PingFangSC-Medium;
          font-size: 24px;
          color: #333;
          font-weight: 500;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        &-time {
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #4b4b4b;
          font-weight: 400;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
      .other {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #333;
        font-weight: 400;
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(100% - 20px);
        margin: 10px 0;
        border-right: 1px solid #ccc;
      }
    }
  }
}
</style>
