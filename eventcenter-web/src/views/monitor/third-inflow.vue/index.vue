<template>
  <div class="eventmnwraper">
    <div class="contentbox">
      <div class="toparea">
        <div class="cmtitle">
          <div class="tl">三方流入监控</div>
          <div class="rl">
            <div
              class="qbtn"
              :class="{'selected': databtntype === 'week'}"
              @click="quickDateCk('week')"
            >近七日</div>
            <div
              class="qbtn"
              :class="{'selected': databtntype === 'month'}"
              @click="quickDateCk('month')"
            >近一月</div>
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

        <div class="header-box width100">
          <div class="header-left">
            <span class="title">三方流入事件总数</span>
            <span class="title-con">
              <span>{{ eventTotal }}</span>
              <span class="unit">件</span>
            </span>
          </div>
          <div class="header-right">
            <div class="right-item">
              <span class="con">{{ eventInTotal }}</span>
              <span class="label">三方接入事件总数</span>
            </div>
            <div class="right-item">
              <span class="con">{{ selfTotal }}</span>
              <span class="label">三方自处置事件总数</span>
            </div>
          </div>
        </div>

        <div class="platformbox">
          <button
            type="button"
            class="el-carousel__arrow el-carousel__arrow--left"
            style="display: none;"
          >
            <i class="el-icon-arrow-left" />
          </button>
          <button
            type="button"
            class="el-carousel__arrow el-carousel__arrow--right"
            style="display: none;"
          >
            <i class="el-icon-arrow-right" />
          </button>
          <div class="platformboxinner">
            <div class="modulebox">
              <div
                v-for="(val, idx) in sysList"
                :key="val.sysCode"
                class="emdl"
                :class="{'selected': val.sysCode === curSysCode}"
                @click="sysClickFn(val.sysCode)"
              >
                <div class="t">
                  <i
                    :class="['pticon' ,'pticon'+(idx+1), {'selected': val.sysCode === curSysCode}]"
                  />
                  <span>{{ val.sysName }}</span>
                </div>
                <div class="card-title-wrap" :class="{'selected': val.sysCode === curSysCode}">
                  <div class="title">事件数量</div>
                  <div class="title-count">
                    <span class="count">{{ val.count + val.selfHandleCount }}</span>
                    <span class="unit">件</span>
                    <b class="count m-l-10">{{ val.percent }}</b>
                    <span class="unit">%</span>
                  </div>
                </div>
                <div class="card-con-wrap" :class="{'selected': val.sysCode === curSysCode}">
                  <div class="card-con-item m-t-10">
                    <div class="label">接入事件</div>
                    <div>
                      <span class="count">{{ val.count | changeNumToStr }}</span>件
                    </div>
                  </div>
                  <div class="card-con-item">
                    <div class="label">自处置事件</div>
                    <div>
                      <span class="count">{{ val.selfHandleCount }}</span>件
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="platformbox platformbox_small">
          <button
            type="button"
            class="el-carousel__arrow el-carousel__arrow--left"
            style="display: none;"
          >
            <i class="el-icon-arrow-left" />
          </button>
          <button
            type="button"
            class="el-carousel__arrow el-carousel__arrow--right"
            style="display: none;"
          >
            <i class="el-icon-arrow-right" />
          </button>
          <div class="platformboxinner">
            <div class="modulebox">
              <div
                v-for="val in eventTypeList"
                :key="val.eventTypeId"
                class="emdl"
                :class="{'selected': val.eventTypeId === curEventTypeId}"
                @click="eventTypeClickFn(val.eventTypeId)"
              >
                <div class="t" :title="val.eventTypeName">
                  <span class="ellipsis">{{ val.eventTypeName || '--' }}</span>
                </div>
                <div class="m">
                  <div class="d1">事件数量</div>
                  <div class="d2">
                    <b>{{ val.eventTypeNum | changeNumToStr }}</b>
                    <span>件</span>
                  </div>
                </div>
                <div class="m">
                  <div class="d1">占比</div>
                  <div class="d2">
                    <b>{{ val.eventTypeNumPercent }}%</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="contentbox m-t-20">
      <el-tabs v-model="tableType" class="m-t-20">
        <el-tab-pane label="接入事件" name="eventIn" />
        <el-tab-pane label="自处置事件" name="self" />
      </el-tabs>
      <event-in v-if="tableType==='eventIn'" :has-top-border="false" source="eventIn" :main-search-params="searchParams" />
      <third-self-handle v-if="tableType==='self'" :has-top-border="false" source="eventIn" :main-search-params="searchParams" />
    </div>
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import { parseTime } from '@/utils/index'
import jQuery from 'jquery'
import thirdSelfHandle from '@/views/event/third-self-handle'
import eventIn from '@/views/event/third-self-handle/eventIn.vue'

export default {
  name: 'SourceMsg',
  components: {
    eventIn,
    thirdSelfHandle
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
  data() {
    return {
      databtntype: 'week',
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() ||
            time.getTime() < Date.now() - 365 * 24 * 60 * 60 * 1000
          )
        }
      },
      curDateArr: [],
      curSysCode: '',
      curEventTypeId: '',
      eventTotal: 0, // 总数
      eventInTotal: 0, // 接入总数
      selfTotal: 0, // 自处置总数
      sysList: [],
      searchEventCode: '',
      eventTypeList: [],
      tableData: [],
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
          minWidth: 150
        },
        {
          prop: 'platText',
          label: '平台系统',
          visible: true,
          minWidth: 90
        },
        {
          prop: 'sourceText',
          label: '事件来源',
          visible: true,
          minWidth: 120
        },
        {
          prop: 'eventTypeText',
          label: '事件类型',
          visible: true,
          minWidth: 120
        },
        {
          prop: 'urgentText',
          label: '紧急程度',
          visible: true,
          minWidth: 100
        },
        {
          prop: 'eventStateText',
          label: '事件状态',
          visible: true,
          minWidth: 100
        },
        {
          prop: 'reporterName',
          label: '上报人',
          visible: true,
          minWidth: 110
        },
        {
          prop: 'reporterMobile',
          label: '联系方式',
          visible: true,
          minWidth: 140
        },
        {
          prop: 'happenTime',
          label: '发生时间',
          visible: true,
          minWidth: 170
        },
        {
          prop: 'overtimeText',
          label: '是否超时',
          visible: true,
          minWidth: 100
        }
      ],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableType: 'eventIn' // 接入列表 self自处置
    }
  },
  computed: {
    // 把字典转换为字典方式存储，方便获取对应中文
    eventPlatformOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getDictsByType('event_platform')
      const map = new Map()
      platform.forEach(item => {
        map.set(item.dictValue, item.dictLabel)
      })
      return map
    },
    eventSourceOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getDictsByType('event_origin')
      const map = new Map()
      platform.forEach(item => {
        map.set(item.dictValue, item.dictLabel)
      })
      return map
    },
    eventUrgentOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getDictsByType('event_urgent_level')
      const map = new Map()
      platform.forEach(item => {
        map.set(item.dictValue, item.dictLabel)
      })
      return map
    },
    eventStateOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getDictsByType('event_state')
      const map = new Map()
      platform.forEach(item => {
        map.set(item.dictValue, item.dictLabel)
      })
      return map
    },
    eventOverTimeOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getDictsByType('overtime_flag')
      const map = new Map()
      platform.forEach(item => {
        map.set(item.dictValue, item.dictLabel)
      })
      return map
    },
    tranformData() {
      return this.tableData.map(item => {
        item.sourceText = this.eventSourceOptions.get(item.eventSrcId)
        item.urgentText = this.eventUrgentOptions.get(item.eventUrgent)
        item.eventStateText = this.eventStateOptions.get(item.eventState)
        item.overtimeText = this.eventOverTimeOptions.get(item.overtimeFlag)
        item.platText = this.eventPlatformOptions.get(item.platformSrc)
        // 把事件大、中、小类组合
        item.eventTypeText = `${item.eventTypeLName}/${item.eventTypeMNAME}/${item.eventTypeName}`
        return item
      })
    },
    searchParams() {
      return {
        beginTime: this.curDateArr[0] || '',
        endTime: this.curDateArr[1] || '',
        sysCode: this.curSysCode,
        eventTypeId: this.curEventTypeId
      }
    }
  },
  created() {
    this.quickDateCk('week')
  },
  mounted() {
    // const _this = this
    // 平台和事件类型滚动交互
    jQuery(document).on('mouseover', '.platformbox', function() {
      const xishuwidth =
        jQuery(this).hasClass('platformbox_small') > 0 ? 40 : 60
      if (
        jQuery(this)
          .find('.platformboxinner')
          .width() <
        (jQuery(this)
          .find('.emdl')
          .width() +
          xishuwidth) *
          jQuery(this).find('.emdl').length -
          20
      ) {
        jQuery(this)
          .find('.el-carousel__arrow')
          .show()
      }
    })
    jQuery(document).on('mouseleave', '.platformbox', function() {
      jQuery(this)
        .find('.el-carousel__arrow')
        .hide()
    })
    jQuery(document).on('click', '.el-carousel__arrow--left', function() {
      const xishuwidth =
        jQuery(this).closest('.platformbox_small').length > 0 ? 40 : 60
      jQuery(this)
        .closest('.platformbox')
        .find('.platformboxinner')
        .stop()
      const emwidth = jQuery(this)
        .closest('.platformbox')
        .find('.emdl')
        .width()
      const curScrollLeft = jQuery(this)
        .closest('.platformbox')
        .find('.platformboxinner')
        .scrollLeft()
      jQuery(this)
        .closest('.platformbox')
        .find('.platformboxinner')
        .animate(
          {
            scrollLeft: curScrollLeft - emwidth - xishuwidth
          },
          600
        )
    })
    jQuery(document).on('click', '.el-carousel__arrow--right', function() {
      const xishuwidth =
        jQuery(this).closest('.platformbox_small').length > 0 ? 40 : 60
      jQuery(this)
        .closest('.platformbox')
        .find('.platformboxinner')
        .stop()
      const emwidth = jQuery(this)
        .closest('.platformbox')
        .find('.emdl')
        .width()
      const curScrollLeft = jQuery(this)
        .closest('.platformbox')
        .find('.platformboxinner')
        .scrollLeft()
      jQuery(this)
        .closest('.platformbox')
        .find('.platformboxinner')
        .animate(
          {
            scrollLeft: curScrollLeft + emwidth + xishuwidth
          },
          600
        )
    })
  },
  methods: {
    resetSize() {
      // 重置页码
      this.page.pageSize = 10
      this.page.pageNum = 1
      this.searchEventCode = undefined
    },
    async quickDateCk(type) {
      this.databtntype = type
      const nowdate = new Date()
      const weekago = new Date(nowdate.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthago = new Date(nowdate.getTime() - 30 * 24 * 60 * 60 * 1000)
      const usenowdate = parseTime(nowdate, '{y}-{m}-{d}')
      const useweekago = parseTime(weekago, '{y}-{m}-{d}')
      const usemonthago = parseTime(monthago, '{y}-{m}-{d}')
      this.resetSize()
      switch (this.databtntype) {
        case 'week':
          this.curDateArr = [
            `${useweekago} 00:00:00`,
            `${usenowdate} 23:59:59`
          ]
          break
        case 'month':
          this.curDateArr = [
            `${usemonthago} 00:00:00`,
            `${usenowdate} 23:59:59`
          ]
          break
        default:
          this.curDateArr = [
            `${this.curDateArr[0]} 00:00:00`,
            `${this.curDateArr[1]} 23:59:59`
          ]
          break
      }
      await this.getInflowBySys()
      if (this.curSysCode) {
        this.curEventTypeId = ''
        await this.getInflowByType()
      }
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
      this.resetSize()
      await this.getInflowList()
    },
    async eventTypeClickFn(eventTypeId) {
      if (this.curEventTypeId === eventTypeId) {
        this.curEventTypeId = ''
      } else {
        this.curEventTypeId = eventTypeId
      }
      this.resetSize()
      await this.getInflowList()
    },
    async getInflowBySys() {
      const params = {
        beginTime: this.curDateArr[0],
        endTime: this.curDateArr[1]
      }
      // this.sysList = [
      //   {
      //     sysCode: '70101',
      //     sysName: '市场监督管理局',
      //     count: 1,
      //     selfHandleCount: 0,
      //     percent: '11.11'
      //   },
      //   {
      //     sysCode: '304',
      //     sysName: '监测预警',
      //     count: 0,
      //     selfHandleCount: 8,
      //     percent: '88.89'
      //   },
      //   {
      //     sysCode: '305',
      //     sysName: '指挥调度',
      //     count: 0,
      //     selfHandleCount: 0,
      //     percent: '0.00'
      //   },
      //   {
      //     sysCode: '302',
      //     sysName: '城管',
      //     count: 0,
      //     selfHandleCount: 0,
      //     percent: '0.00'
      //   },
      //   {
      //     sysCode: '303',
      //     sysName: '综治',
      //     count: 0,
      //     selfHandleCount: 0,
      //     percent: '0.00'
      //   },
      //   {
      //     sysCode: '301',
      //     sysName: '12345',
      //     count: 0,
      //     selfHandleCount: 0,
      //     percent: '0.00'
      //   },
      //   {
      //     sysCode: '701',
      //     sysName: '协同中心',
      //     count: 0,
      //     selfHandleCount: 0,
      //     percent: '0.00'
      //   },
      //   {
      //     sysCode: '111',
      //     sysName: 'test',
      //     count: 0,
      //     selfHandleCount: 0,
      //     percent: '0.00'
      //   },
      //   {
      //     sysCode: '101',
      //     sysName: '协同中心-101',
      //     count: 0,
      //     selfHandleCount: 0,
      //     percent: '0.00'
      //   },
      //   {
      //     sysCode: '444',
      //     sysName: 'dispatch-error',
      //     count: 0,
      //     selfHandleCount: 0,
      //     percent: '0.00'
      //   },
      //   {
      //     sysCode: '501',
      //     sysName: '社会治理',
      //     count: 0,
      //     selfHandleCount: 0,
      //     percent: '0.00'
      //   },
      //   {
      //     sysCode: '555',
      //     sysName: 'H5',
      //     count: 0,
      //     selfHandleCount: 0,
      //     percent: '0.00'
      //   },
      //   {
      //     sysCode: '70102',
      //     sysName: '生态环境局',
      //     count: 0,
      //     selfHandleCount: 0,
      //     percent: '0.00'
      //   },
      //   {
      //     sysCode: '70103',
      //     sysName: '交通运输局',
      //     count: 0,
      //     selfHandleCount: 0,
      //     percent: '0.00'
      //   },
      //   {
      //     sysCode: '70104',
      //     sysName: '下级区县',
      //     count: 0,
      //     selfHandleCount: 0,
      //     percent: '0.00'
      //   }
      // ]
      const res = await moduleSrv.getInflowBySys(params)
      this.sysList = res.data?.sysList || []
      this.eventTotal = res.data?.eventCount || 0
      this.eventInTotal = (res.data?.eventCount - res.data?.selfHandleEventCount) || 0
      this.selfTotal = res.data?.selfHandleEventCount || 0
    },
    async getInflowByType() {
      const params = {
        beginTime: this.curDateArr[0],
        endTime: this.curDateArr[1],
        sysCode: this.curSysCode
      }
      console.log(params)
      const res = await moduleSrv.getInflowByType(params)
      this.eventTypeList = res.data || []
      // this.eventTypeList = [
      //   {
      //     eventTypeId: '290510',
      //     eventTypeName: '社会应急救援',
      //     eventTypeNum: 34,
      //     eventTypeNumPercent: '97.14'
      //   },
      //   {
      //     eventTypeId: '290141',
      //     eventTypeName: '食品流通管理与服务',
      //     eventTypeNum: 1,
      //     eventTypeNumPercent: '2.86'
      //   }
      // ]
    },
    async getInflowList() {
      // 分别处理自处置和事件列表
      if (this.tableType === 'eventIn') {
        const params = {
          beginTime: this.curDateArr[0],
          endTime: this.curDateArr[1],
          sysCode: this.curSysCode || undefined,
          eventTypeId: this.curEventTypeId || undefined,
          eventCode: this.searchEventCode || undefined,
          pageSize: this.page.pageSize,
          pageNum: this.page.pageNum
        }
        const res = await moduleSrv.getInflowList(params)
        if (res.code === 200) {
          this.tableData = res.data?.list || []
          this.page.total = res.data?.total || 0
        }
      } else {
        const params = {
          beginTime: this.curDateArr[0],
          endTime: this.curDateArr[1],
          sysCode: this.curSysCode || undefined,
          eventTypeId: this.curEventTypeId || undefined,
          uuid: this.searchEventCode || undefined,
          pageSize: this.page.pageSize,
          pageNum: this.page.pageNum
        }
        const res = await moduleSrv.getselfflowList(params)
        if (res.code === 200) {
          this.tableData = res.data?.list || []
          this.page.total = res.data?.totalRow || 0
        }
      }
    },
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    // 批量事件状态，给予不同的状态不同的标记
    _tranfromState(row) {
      const state = row.eventState || '0'
      if (['0', '1', '2', '4'].includes(state)) {
        // 待XXX
        return 'svg-warn'
      } else if (['3'].includes(state)) {
        // 待处理，为处理中的颜色
        return 'svg-handle'
      } else if (['5'].includes(state)) {
        // 办结
        return 'svg-success'
      } else if (['7'].includes(state)) {
        // 驳回
        return 'svg-error'
      } else if (['6'].includes(state)) {
        // 作废
        return 'svg-grey'
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
    changeTable(type) {
      this.tableType = type
      this.resetSize()
      this.getInflowList()
    },
    // 查看详情
    _showInfo(row) {
      // 跳转详情页面, 详情页面，请求操作按钮的时候需要用到 taskId
      this.$router.push({
        path: '/event/query/info',
        query: {
          taskId: row?.taskId,
          id: row.id
        }
      })
    },
    // 查看详情
    _showSelfInfo(row) {
      // 跳转详情页面, 详情页面，请求操作按钮的时候需要用到 taskId
      this.$router.push({
        path: '/event/query/selfInfo',
        query: {
          id: row.id
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import "@/styles/index.scss";
.width100 {
  width: 100%;
}
.m-t-20 {
  margin-top: 20px;
}
.eventmnwraper {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  .contentbox {
    background: #ffffff;
    width: 100%;
    // height: 100%;
    padding: 0 20px 20px;
    .cmtitle {
      height: 64px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .tl {
        font-weight: bold;
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        color: #313131;
        border-left: 4px solid #36a4ff;
        line-height: 16px;
        padding-left: 10px;
      }
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
          color: #4b4b4b;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #e7e7e7;
          margin-right: 5px;
          cursor: pointer;
          &.selected {
            color: #36a4ff;
            border-color: #36a4ff;
          }
        }
      }
      .serchlistipt {
        ::v-deep {
          .el-button--default {
            width: auto;
            background: #f9fafe;
          }
          .el-icon-search {
            color: #4b4b4b;
            transform: scale(1.5);
          }
        }
      }
    }
    .toparea {
      .header-box {
        padding: 0 20px;
        height: 90px;
        display: flex;
        align-items: center;
        padding: 0px 20px;
        margin-top: 10px;
        background: url("~@/assets/workbench/head-bg.png") no-repeat;
        background-size: 100% 100%;
        font-family: PingFangSC, PingFang SC;
        .header-left {
          width: 40%;
          height: 100%;
          display: flex;
          align-items: center;
          .title {
            font-size: 20px;
            margin-right: 20px;
            color: #4b4b4b;
          }
          .title-con {
            font-size: 30px;
            font-weight: bold;
            color: #202020;
          }
          .unit {
            font-weight: normal;
            font-size: 18px;
            color: #666666;
          }
        }
        .header-right {
          flex: 1;
          display: flex;
          align-items: center;
          .right-item {
            margin-right: 64px;
            display: flex;
            flex-direction: column;
            align-items: center;
            .con {
              font-size: 22px;
              font-weight: 500;
              color: #202020;
            }
            .label {
              margin-top: 4px;
              font-size: 14px;
              font-weight: 500;
              color: #4b4b4b;
            }
          }
        }
      }
      .platformbox {
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
              height: 180px;
              background: rgba(0, 164, 255, 0.03);
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
                    background: url("~@/assets/workbench/dbicon_4@2x.png")
                      no-repeat;
                    background-size: 100% 100%;
                  }
                  &.selected {
                    background: url("~@/assets/workbench/active-bg.png")
                      no-repeat !important;
                    background-size: 100% 100% !important;
                  }
                  &.pticon1 {
                    background: url("~@/assets/workbench/dbicon_1@2x.png")
                      no-repeat;
                    background-size: 100% 100%;
                  }
                  &.pticon2 {
                    background: url("~@/assets/workbench/dbicon_2@2x.png")
                      no-repeat;
                    background-size: 100% 100%;
                  }
                  &.pticon3 {
                    background: url("~@/assets/workbench/dbicon_3@2x.png")
                      no-repeat;
                    background-size: 100% 100%;
                  }
                  &.pticon4 {
                    background: url("~@/assets/workbench/dbicon_4@2x.png")
                      no-repeat;
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
                background: linear-gradient(90deg, #78c2ff 0%, #36a4ff 100%);
                box-shadow: 5px 5px 20px 0px rgba(49, 148, 230, 0.3),
                  -5px -5px 10px 0px rgba(255, 255, 255, 0.5);
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
                background: #f5f7fa;
                box-shadow: inset 0px 0px 30px 0px #dce9f5;
                border-radius: 4px;
                padding: 10px;
                .t {
                  margin-bottom: 18px;
                  span {
                    font-size: 14px;
                    margin-left: 0px;
                  }
                }
                .m {
                  margin-top: 4px;
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
                  background: linear-gradient(90deg, #78c2ff 0%, #36a4ff 100%);
                  box-shadow: 5px 5px 20px 0px rgba(49, 148, 230, 0.3),
                    -5px -5px 10px 0px rgba(255, 255, 255, 0.5);
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
      margin-top: 10px;
      .cnttable {
        padding: 0 20px;
        .svg-success-wrapper {
          color: $success;
        }
        .svg-handle-wrapper {
          color: #ff0000;
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
                color: #bdbdbd;
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
.card-title-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  border-bottom: 1px solid #ededed;
  .title {
    font-size: 18px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #666666;
  }
  .count {
    font-size: 30px;
    color: #202020;
    font-weight: bold;
  }
  .unit {
    font-size: 18px;
    font-family: PingFangSC, PingFang SC;
    color: #202020;
  }
  .m-l-10 {
    margin-left: 10px;
  }
  &.selected {
    .title,
    .count,
    .unit {
      color: #ffffff;
    }
  }
}
.card-con-wrap {
  font-size: 16px;
  color: #666666;
  .m-t-10 {
    margin-top: 10px;
  }
  .card-con-item {
    display: flex;
    justify-content: space-between;
    height: 30px;
    align-items: center;
    color: #666666;
  }
  .count {
    color: #202020;
    margin-right: 2px;
    font-weight: bold;
    font-size: 24px;
  }
  &.selected {
    color: #ffffff;
    .card-con-item,
    .count {
      color: #ffffff;
    }
  }
}

.ellipsis {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.m-l-16 {
  margin-left: 16px;
}
.active {
  border-color: #36a4ff !important;
  color: #36a4ff !important;
}
::v-deep{
  #listSection{
    height:auto !important;
  }
  .page-wrapper{
    // height: 100%;
    max-height: calc(100% - 50px);
  }
}
</style>
