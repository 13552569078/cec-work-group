<!--
 * @description 事件概览
 * @date 2023-11-02
 * @author lism
-->
<template>
  <div class="task-container">
    <div class="computebox">
      <div class="title">
        <div class="text">
          <svg-icon class="sjfx" icon-class="复杂事件分析统计" />
          <span>事件概览</span>
        </div>
        <div class="searchbox">
          <div class="sl">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
              <el-form-item label="平台系统">
                <el-select v-model="searchForm.useSysCodes" class="ewidth" clearable multiple collapse-tags placeholder="请选择">
                  <el-option
                    v-for="item in sysCodeOptions"
                    :key="item.dictValue"
                    :label="item.dictDesc"
                    :value="item.dictValue"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="时间范围">
                <el-date-picker
                  v-model="searchForm.useTimes"
                  class="ewidth"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  clearable
                  :picker-options="pickerOptions"
                />
              </el-form-item>
            </el-form>
          </div>

          <div class="sr">
            <el-button @click="onReset">重置</el-button>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </div>
        </div>
      </div>

      <div class="wrapper">
        <div class="rowitem">
          <div class="width100">
            <eventAllView :search-form-props="searchFormProps" />
          </div>
        </div>
        <div class="rowitem">
          <div class="width33">
            <eventSource :sys-code-all-length="sysCodeAllLength" :search-form-props="searchFormProps" />
          </div>
          <div class="width33">
            <eventDoAreaBar :sys-code-all-length="sysCodeAllLength" :search-form-props="searchFormProps" />
          </div>
          <div class="width33">
            <eventDoAreaPie :search-form-props="searchFormProps" />
          </div>
        </div>
        <div class="rowitem">
          <div class="width50">
            <eventTop10 :search-form-props="searchFormProps" />
          </div>
          <div class="width50">
            <eventOverTime :search-form-props="searchFormProps" />
          </div>
        </div>
        <div class="rowitem">
          <div class="width100">
            <eventTrend :search-form-props="searchFormProps" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import { parseTime } from '@/utils/index'
import eventAllView from './eventAllView'
import eventSource from './eventSource'
import eventDoAreaBar from './eventDoAreaBar'
import eventDoAreaPie from './eventDoAreaPie'
import eventTop10 from './eventTop10NotEcharts'
import eventOverTime from './eventOverTimeNotEcharts'
import eventTrend from './eventTrend'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'Overview',
  components: {
    eventAllView,
    eventSource,
    eventDoAreaBar,
    eventDoAreaPie,
    eventTop10,
    eventOverTime,
    eventTrend
  },
  data() {
    return {
      sysCodeOptions: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近半年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      searchForm: {
        useSysCodes: [],
        useTimes: []
      },
      searchFormProps: {},
      sysCodeAllLength: 0
    }
  },

  created() {
    this.getDefaultTime()
    const params = {
      dictType: 'event_platform'
    }
    moduleSrv.getTcDictDataZiDian(params).then((res) => {
      if (res.code === SUCCESS_CODE) {
        this.sysCodeOptions = res.data.filter(val => {
          return val.dictValue !== '100'
        })
        this.sysCodeAllLength = this.sysCodeOptions.length
        this.getDefaultSysCodes()
        this.onSubmit()
      }
    })
  },
  methods: {
    getDefaultSysCodes() {
      this.searchForm.useSysCodes = []
      this.sysCodeOptions.forEach(val => {
        this.searchForm.useSysCodes.push(val.dictValue)
      })
    },
    getDefaultTime() {
      const end = parseTime(new Date(), '{y}-{m}-{d}')
      let start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      start = parseTime(start, '{y}-{m}-{d}')
      this.searchForm.useTimes = [start, end]
    },
    onSubmit() {
      if (this.searchForm.useSysCodes === null || this.searchForm.useSysCodes.length === 0) {
        this.$message.error('事件来源不能为空！')
        return
      }
      if (this.searchForm.useTimes === null || this.searchForm.useTimes.length === 0) {
        this.$message.error('时间范围不能为空！')
        return
      }
      this.searchFormProps = {}
      this.$set(this.searchFormProps, 'sysCodes', this.searchForm.useSysCodes.join(','))
      this.$set(this.searchFormProps, 'beginTime', `${this.searchForm.useTimes[0]} 00:00:00`)
      this.$set(this.searchFormProps, 'endTime', `${this.searchForm.useTimes[1]} 23:59:59`)
      console.log('this.searchForm', this.searchForm)
      console.log('this.searchFormProps', this.searchFormProps)
    },
    onReset() {
      this.getDefaultTime()
      this.getDefaultSysCodes()
      this.onSubmit()
    }
  }
}
</script>
<style lang="scss">
// 子组件使用的样式，不加scoped，统一的组件框架样式
.come_box_wuse {
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.80);
  box-shadow: 8px 8px 30px 0 rgba(166,174,189,0.30);
  border-radius: 8px;
  .title {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #313131;
    font-weight: bold;
    padding: 20px 30px;
  }
}
</style>

<style scoped lang="scss">
.task-container {
  flex: 1;
  position: relative;
  .computebox {
    height: 100%;
    overflow: auto;
    background: #F7F9FC;
    .title {
      width: 100%;
      height: 129px;
      background: url('~@/assets/头部背景色.png') center top no-repeat;
      background-size: 100% 100%;
      padding: 0 20px;
      .text {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-top: 36px;
        .sjfx {
          width: 25px;
          height: 25px;
        }
        span {
          font-family: DOUYU-Font;
          font-size: 20px;
          color: #36A4FF;
          margin-left: 14px;
          font-weight: bold;
        }
      }
      .searchbox {
        width: 100%;
        min-height: 72px;
        padding: 10px 20px;
        background: rgba(255,255,255,0.90);
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        .sl {
          ::v-deep {
            .el-form {
              height: 32px;
              .ewidth {
                width: 296px;
              }
              .el-form-item  {
                margin-bottom: 0px;
              }
            }
            .el-form--inline .el-form-item {
              margin-right: 30px;
            }
          }
        }
      }
    }
    .wrapper {
      padding: 45px 20px 20px 20px;
      .rowitem {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
      }
      .width100 {
        width: 100%;
      }
      .width50 {
        width: 49.3%;
      }
      .width33 {
        width: 32.5%;
      }
    }
  }
}
</style>
