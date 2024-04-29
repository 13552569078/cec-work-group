<template>
  <div class="eventmnwraper">
    <div class="contentbox">
      <div class="toparea">
        <div class="cmtitle">
          <common-title title="事件流入统计" />
          <div class="rl">
            <div class="qbtn" :class="{'selected': databtntype === 'week'}" @click="quickDateCk('week')">近七日</div>
            <div class="qbtn" :class="{'selected': databtntype === 'month'}" @click="quickDateCk('month')">近一月</div>
            <div class="eldate">
              <el-date-picker
                v-model="curDateArr"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels
                :picker-options="pickerOptions"
                @change="quickDateCk('')"
              />
            </div>
          </div>
        </div>

        <div class="hangbox">
          <div class="hangzong width100">
            <div class="hangzongrbg">
              <div class="l"><i /><span>事件总量：</span></div>
              <div class="r"><b>{{ eventTotal | changeNumToStr }}</b><span>件</span></div>
            </div>
          </div>
        </div>

        <div class="platformbox">
          <button type="button" class="el-carousel__arrow el-carousel__arrow--left" style="display: none;"><i class="el-icon-arrow-left" /></button>
          <button type="button" class="el-carousel__arrow el-carousel__arrow--right" style="display: none;"><i class="el-icon-arrow-right" /></button>
          <div class="platformboxinner">
            <div class="modulebox">
              <div v-for="(val, idx) in sysList" :key="idx" class="emdl" :class="{'selected': val.sysCode === curSysCode}" @click="sysClickFn(val.sysCode)">
                <div class="t"><i :class="['pticon' ,'pticon'+(idx+1)]" /><span>{{ val.sysName }}</span></div>
                <div class="m">
                  <div class="d1">事件数量</div>
                  <div class="d2"><b>{{ val.count | changeNumToStr }}</b><span>件</span></div>
                </div>
                <div class="m">
                  <div class="d1">占比</div>
                  <div class="d2"><b>{{ val.percent }}%</b></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="platformbox platformbox_small">
          <button type="button" class="el-carousel__arrow el-carousel__arrow--left" style="display: none;"><i class="el-icon-arrow-left" /></button>
          <button type="button" class="el-carousel__arrow el-carousel__arrow--right" style="display: none;"><i class="el-icon-arrow-right" /></button>
          <div class="platformboxinner">
            <div class="modulebox">
              <div v-for="(val, idx) in eventTypeList" :key="idx" class="emdl" :class="{'selected': val.eventTypeId === curEventTypeId}" @click="eventTypeClickFn(val.eventTypeId)">
                <div class="t">
                  <template v-if="val.eventTypeName.length > 10">
                    <el-tooltip :content="val.eventTypeName" placement="top">
                      <span>{{ val.eventTypeName.substr(0, 10) + "..." }}</span>
                    </el-tooltip>
                  </template>
                  <span v-else>{{ val.eventTypeName }}</span>
                </div>
                <div class="m">
                  <div class="d1">事件数量</div>
                  <div class="d2"><b>{{ val.eventTypeNum | changeNumToStr }}</b><span>件</span></div>
                </div>
                <div class="m">
                  <div class="d1">占比</div>
                  <div class="d2"><b>{{ val.eventTypeNumPercent }}%</b></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="listarea">
        <div class="cmtitle">
          <common-title title="事件列表" />
          <div class="serchlistipt">
            <el-select v-model="conditionType" class="condition-select" placeholder="请选择">
              <el-option
                v-for="item in conditionTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input v-model="searchEventCode" :placeholder="conditionType===1?'请输入事件编号':'请输入发起方事件编号'" class="input-with-select" clearable>
              <el-button slot="append" icon="el-icon-search" @click="getInflowList" />
            </el-input>
          </div>
        </div>

        <div class="cnttable">
          <div class="tableboxit">
            <el-table :data="tranformData" tooltip-effect="light">
              <el-table-column
                type="index"
                width="55"
                :index="indexMethod"
                class-name="table-column-index"
              />
              <template v-for="(item, index) in tableColumn">
                <el-table-column
                  v-if="item.prop === 'eventThirdStateName'"
                  :key="index"
                  :label="item.label"
                  :prop="item.prop"
                  :width="item.width"
                  :min-width="item.minWidth"
                  show-overflow-tooltip
                >
                  <!-- 对事件处理状态特殊处理，给不同的状态不同的标记 -->
                  <template v-slot="{ row }">
                    <span :class="`${_tranfromEventThirdState(row)}-wrapper`">
                      <svg-icon :icon-class="_tranfromEventThirdState(row)" />
                      {{ row.eventThirdStateName }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  v-else
                  :key="index"
                  :label="item.label"
                  :prop="item.prop"
                  :width="item.width"
                  :min-width="item.minWidth"
                  show-overflow-tooltip
                  :formatter="_formatter"
                />
              </template>
              <el-table-column
                :width="70"
                fixed="right"
                label="操作"
                class-name="table-column-action"
              >
                <template v-slot="{ row }">
                  <span class="action-btn" @click="_showInfo(row)">查看</span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="pageunation">
            <cestc-pagination
              :current-page.sync="page.pageNum"
              :page-size="page.pageSize"
              :total="page.total"
              layout="total,prev,pager,next,jumper,sizes"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import { parseTime } from '@/utils/index'
import jQuery from 'jquery'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'Inflow',
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
  data() {
    return {
      databtntype: 'week',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() || time.getTime() < Date.now() - 365 * 24 * 60 * 60 * 1000
        }
      },
      curDateArr: [],
      curSysCode: '',
      curEventTypeId: '',
      eventTotal: 0,
      sysList: [],
      searchEventCode: '',
      eventTypeList: [],
      tableData: [],
      conditionType: 1,
      conditionTypeList: [
        {
          label: '事件编号',
          value: 1
        },
        {
          label: '发起方事件编号',
          value: 2
        }
      ],
      tableColumn: [
        {
          prop: 'eventCode',
          label: '事件编号',
          visible: true,
          minWidth: 150
        },
        {
          prop: 'title',
          label: '事件标题',
          visible: true,
          minWidth: 138
        },
        {
          prop: 'platText',
          label: '发起方系统',
          visible: true,
          minWidth: 95
        },
        {
          prop: 'uuid',
          label: '发起方事件编号',
          visible: true,
          minWidth: 150
        },
        {
          prop: 'eventTypeText',
          label: '事件总线事件类型',
          visible: true,
          minWidth: 180
        },
        {
          prop: 'urgentText',
          label: '紧急程度',
          visible: true,
          minWidth: 100
        },
        {
          prop: 'eventThirdStateName',
          label: '事件流转状态',
          visible: true,
          minWidth: 120
        },
        {
          prop: 'eventTime',
          label: '发生时间',
          visible: true,
          minWidth: 170
        },
        // TODO SYM
        {
          prop: 'dispatchOverTimeFlagName',
          label: '调度超时',
          visible: true,
          minWidth: 100
        },
        {
          prop: 'overTimeFlagName',
          label: '流程超时',
          visible: true,
          minWidth: 100
        }
      ],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {
    // 把字典转换为字典方式存储，方便获取对应中文
    eventPlatformOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_platform')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventSourceOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_origin')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventUrgentOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_urgent_level')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventStateOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_state')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventOverTimeOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('overtime_flag')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    tranformData() {
      return this.tableData.map((item) => {
        item.sourceText = this.eventSourceOptions.get(item.eventSrcId)
        item.urgentText = this.eventUrgentOptions.get(item.eventUrgent)
        item.eventStateText = this.eventStateOptions.get(item.eventState)
        item.overtimeText = this.eventOverTimeOptions.get(item.overtimeFlag)
        item.platText = this.eventPlatformOptions.get(item.platformSrc)
        // 把事件大、中、小类组合
        item.eventTypeText = `${item.eventTypeLName}/${item.eventTypeMNAME}/${item.eventTypeName}`
        item.overTimeFlagName = +item.overtimeFlag === 2 ? '已超时' : '未超时'
        item.dispatchOverTimeFlagName = +item.dispatchOverTimeFlag === 2 ? '已超时' : '未超时'
        return item
      })
    }
  },
  created() {
    this.quickDateCk('week')
  },
  mounted() {
    // const _this = this
    // 平台和事件类型滚动交互
    jQuery(document).on('mouseover', '.platformbox', function() {
      const xishuwidth = jQuery(this).hasClass('platformbox_small') > 0 ? 40 : 60
      if (jQuery(this).find('.platformboxinner').width() < ((jQuery(this).find('.emdl').width() + xishuwidth) * jQuery(this).find('.emdl').length - 20)) {
        jQuery(this).find('.el-carousel__arrow').show()
      }
    })
    jQuery(document).on('mouseleave', '.platformbox', function() {
      jQuery(this).find('.el-carousel__arrow').hide()
    })
    jQuery(document).on('click', '.el-carousel__arrow--left', function() {
      const xishuwidth = jQuery(this).closest('.platformbox_small').length > 0 ? 40 : 60
      jQuery(this).closest('.platformbox').find('.platformboxinner').stop()
      const emwidth = jQuery(this).closest('.platformbox').find('.emdl').width()
      const curScrollLeft = jQuery(this).closest('.platformbox').find('.platformboxinner').scrollLeft()
      jQuery(this).closest('.platformbox').find('.platformboxinner').animate({
        scrollLeft: curScrollLeft - emwidth - xishuwidth
      }, 600)
    })
    jQuery(document).on('click', '.el-carousel__arrow--right', function() {
      const xishuwidth = jQuery(this).closest('.platformbox_small').length > 0 ? 40 : 60
      jQuery(this).closest('.platformbox').find('.platformboxinner').stop()
      const emwidth = jQuery(this).closest('.platformbox').find('.emdl').width()
      const curScrollLeft = jQuery(this).closest('.platformbox').find('.platformboxinner').scrollLeft()
      jQuery(this).closest('.platformbox').find('.platformboxinner').animate({
        scrollLeft: curScrollLeft + emwidth + xishuwidth
      }, 600)
    })
  },
  methods: {
    // 表格内容格式化
    _formatter(_row, _column, cellValue) {
      if (cellValue === 0) {
        return cellValue
      }
      return cellValue || '--'
    },
    async quickDateCk(type) {
      this.databtntype = type
      const nowdate = new Date()
      const weekago = new Date(nowdate.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthago = new Date(nowdate.getTime() - 30 * 24 * 60 * 60 * 1000)
      const usenowdate = parseTime(nowdate, '{y}-{m}-{d}')
      const useweekago = parseTime(weekago, '{y}-{m}-{d}')
      const usemonthago = parseTime(monthago, '{y}-{m}-{d}')
      switch (this.databtntype) {
        case 'week':
          this.curDateArr = [`${useweekago} 00:00:00`, `${usenowdate} 23:59:59`]
          break
        case 'month':
          this.curDateArr = [`${usemonthago} 00:00:00`, `${usenowdate} 23:59:59`]
          break
        default:
          this.curDateArr = [`${this.curDateArr[0]} 00:00:00`, `${this.curDateArr[1]} 23:59:59`]
          break
      }
      await this.getInflowBySys()
      if (this.curSysCode) {
        this.curEventTypeId = ''
        await this.getInflowByType()
      }
      await this.getInflowList()
    },
    async sysClickFn(sysCode) {
      this.curEventTypeId = ''
      this.eventTypeList = []
      if (this.curSysCode === sysCode) {
        this.curSysCode = ''
      } else {
        this.curSysCode = sysCode
        await this.getInflowByType()
      }
      await this.getInflowList()
    },
    async eventTypeClickFn(eventTypeId) {
      if (this.curEventTypeId === eventTypeId) {
        this.curEventTypeId = ''
      } else {
        this.curEventTypeId = eventTypeId
      }
      await this.getInflowList()
    },
    async getInflowBySys() {
      const params = {
        beginTime: this.curDateArr[0],
        endTime: this.curDateArr[1]
      }
      const res = await moduleSrv.getInflowBySys(params)
      if (res.code === SUCCESS_CODE) {
        this.sysList = res.data?.sysList || []
        this.eventTotal = res.data?.eventCount || 0
      }
    },
    async getInflowByType() {
      const params = {
        beginTime: this.curDateArr[0],
        endTime: this.curDateArr[1],
        sysCode: this.curSysCode
      }
      const res = await moduleSrv.getInflowByType(params)
      if (res.code === SUCCESS_CODE) {
        this.eventTypeList = res.data || []
      }
    },
    async getInflowList() {
      const params = {
        beginTime: this.curDateArr[0],
        endTime: this.curDateArr[1],
        sysCode: this.curSysCode || undefined,
        eventTypeId: this.curEventTypeId || undefined,
        eventCode: this.conditionType === 1 ? (this.searchEventCode || undefined) : '',
        uuid: this.conditionType === 2 ? (this.searchEventCode || undefined) : '',
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum
      }
      const res = await moduleSrv.getInflowList(params)
      if (res.code === SUCCESS_CODE) {
        this.tableData = res.data?.list || []
        this.page.total = res.data?.total || 0
      }
    },
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    // 批量事件状态，给予不同的状态不同的标记
    _tranfromEventThirdState(row) {
      const state = row.eventThirdState || '0'
      if (['1', '2'].includes(state)) {
        // 待XXX
        return 'svg-warn'
      } else if (['3'].includes(state)) {
        // 待处理，为处理中的颜色
        return 'svg-handle'
      } else if (['4', '6'].includes(state)) {
        // 办结
        return 'svg-success'
      } else if (['5', '7', '8'].includes(state)) {
        // 驳回
        return 'svg-error'
      } else {
        return 'svg-grey'
      }
    },
    handleCurrentChange(current) {
      this.page.currentPage = current
      this.getInflowList()
    },
    handleSizeChange(size) {
      this.page.pageSize = size
      this.getInflowList()
    },
    // 查看详情
    _showInfo(row) {
      // 跳转详情页面, 详情页面，请求操作按钮的时候需要用到 taskId
      this.$router.push({
        path: '/event/query/info',
        query: {
          taskId: row.taskId,
          id: row.id,
          refresh: true
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.eventmnwraper {
  width: 100%;
  height: 100%;
  .contentbox {
    background: #ffffff;
    width: 100%;
    height: 100%;
    overflow: auto;
    .cmtitle {
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      .rl {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .qbtn {
          width: 104px;
          height: 32px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #4B4B4B;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #E7E7E7;
          margin-right: 5px;
          cursor: pointer;
          &.selected {
            color: #36A4FF;
            border-color: #36A4FF;
          }
        }
      }
      .serchlistipt {
        display: flex;
        align-items: center;
        .condition-select {
          margin-right: 8px;
          ::v-deep .el-input__inner {
            width: 150px;
          }
        }
        ::v-deep {
          .input-with-select {
            .el-input-group__append {
              width: 32px;
              text-align: center;
              background-color: $inputAppendBg;
              padding: 0;
            }
          }
        }
      }
    }
    .toparea {
      .hangbox {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0px 20px;
        margin-top: 10px;
        .width100 {
          width: 100%;
        }
        .width50 {
          width: calc(50% - 10px);
        }
        .hangzong {
          height: 90px;
          background: linear-gradient(243deg, rgba(0,164,255,0) 0%, rgba(0,164,255,0.1) 100%);
          border-radius: 4px;
          .hangzongrbg {
            width: 100%;
            height: 90px;
            background: url('~@/assets/workbench/hangbg.png') right -67px no-repeat;
            background-size: 250px 175px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
            .l {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              i {
                width: 16px;
                height: 16px;
                background: url('~@/assets/workbench/dbicon_all@2x.png') no-repeat;
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
            .r {
              b {
                font-size: 48px;
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #202020;
              }
              span {
                font-size: 18px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #666666;
              }
            }
          }
        }
      }
      .platformbox {
        padding: 0 20px;
        margin-top: 20px;
        position: relative;
        .el-carousel__arrow--left {
          left: 36px;
        }
        .el-carousel__arrow--right {
          right: 36px;
        }
        .platformboxinner {
          width: 100%;
          overflow: auto;
          &::-webkit-scrollbar,
          &::-webkit-scrollbar-track,
          &::-webkit-scrollbar-thumb {
            visibility: hidden;
            display: none;
          }
          &:hover::-webkit-scrollbar,
          &:hover::-webkit-scrollbar-track,
          &:hover::-webkit-scrollbar-thumb {
            visibility: hidden;
            display: none;
          }
          .modulebox {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            flex-wrap: nowrap;
            .emdl {
              flex-shrink: 0;
              width: 340px;
              height: 163px;
              background: rgba(0,164,255,0.03);
              border-radius: 4px;
              padding: 20px;
              margin-right: 20px;
              cursor: pointer;
              .t {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                width: 100%;
                i {
                  width: 16px;
                  height: 16px;
                  &.pticon {
                    background: url('~@/assets/workbench/dbicon_4@2x.png') no-repeat;
                    background-size: 100% 100%;
                  }
                  &.pticon1 {
                    background: url('~@/assets/workbench/dbicon_1@2x.png') no-repeat;
                    background-size: 100% 100%;
                  }
                  &.pticon2 {
                    background: url('~@/assets/workbench/dbicon_2@2x.png') no-repeat;
                    background-size: 100% 100%;
                  }
                  &.pticon3 {
                    background: url('~@/assets/workbench/dbicon_3@2x.png') no-repeat;
                    background-size: 100% 100%;
                  }
                  &.pticon4 {
                    background: url('~@/assets/workbench/dbicon_4@2x.png') no-repeat;
                    background-size: 100% 100%;
                  }
                }
                span {
                  font-size: 20px;
                  font-family: PingFangSC-Medium, PingFang SC;
                  font-weight: 500;
                  color: #202020;
                  margin-left: 8px;
                }
              }
              .m {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin-top: 18px;
                .d1 {
                  font-size: 18px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #666666;
                }
                .d2 {
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
                  }
                }
              }
              &.selected {
                background: linear-gradient(90deg, #78C2FF 0%, #36A4FF 100%);
                box-shadow: 5px 5px 20px 0px rgba(49,148,230,0.3), -5px -5px 10px 0px rgba(255,255,255,0.5);
                border-radius: 4px;
                filter: blur(0px);
                .t {
                  span {
                    color: #ffffff;
                  }
                }
                .m {
                  .d1 {
                    color: #ffffff;
                  }
                  .d2 {
                    b {
                      color: #ffffff;
                    }
                    span {
                      color: #ffffff;
                    }
                  }
                }
              }
            }
          }
        }
        &.platformbox_small {
          .platformboxinner {
            .modulebox {
              .emdl {
                width: 198px;
                height: 102px;
                background: #F5F7FA;
                box-shadow: inset 0px 0px 30px 0px #DCE9F5;
                border-radius: 4px;
                padding: 10px;
                .t {
                  span {
                    font-size: 14px;
                    margin-left: 0px;
                  }
                }
                .m {
                  margin-top: 8px;
                  .d1 {
                    font-size: 14px;
                  }
                  .d2 {
                    b {
                      font-size: 20px;
                    }
                    span {
                      font-size: 14px;
                    }
                  }
                }
                &.selected {
                  background: linear-gradient(90deg, #78C2FF 0%, #36A4FF 100%);
                  box-shadow: 5px 5px 20px 0px rgba(49,148,230,0.3), -5px -5px 10px 0px rgba(255,255,255,0.5);
                  border-radius: 4px;
                  filter: blur(0px);
                  .t {
                    span {
                      color: #ffffff;
                    }
                  }
                  .m {
                    .d1 {
                      color: #ffffff;
                    }
                    .d2 {
                      b {
                        color: #ffffff;
                      }
                      span {
                        color: #ffffff;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    .listarea {
      .cnttable {
        padding: 0 20px;
        .svg-success-wrapper {
          color: $success;
        }
        .svg-handle-wrapper {
          color: $primaryColor;
        }
        .svg-warn-wrapper {
          color: $warn;
        }
        .svg-error-wrapper {
          color: $error;
        }
        .svg-grey-wrapper {
          color: $defaultGrey;
        }
        .tableboxit {
          ::v-deep {
            .table-column-index {
              .cell {
                padding-right: 0px;
                font-size: 14px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #BDBDBD;
              }
            }
          }
        }
        .pageunation {
          padding: 15px 0;
        }
      }
    }
  }
}
</style>
