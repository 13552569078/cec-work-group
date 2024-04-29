<template>
  <div class="wbi_wrapper">
    <div class="eachlinerow">
      <div class="listlinerow">
        <div class="eachlinerow">
          <div class="list_item">
            <div class="event_item">
              <div class="com_module event_static_module">
                <div class="top">
                  <div class="title">近30天事件总览</div>
                </div>
                <div class="static_bottom">
                  <div class="static_area">
                    <div
                      v-for="item in r30eventOverview"
                      :key="item.key"
                      class="static_item"
                      :style="{width: item.isFull? '100%' : '50%'}"
                    >
                      <span class="static_label">{{ item.label }}</span>
                      <span
                        class="static_value"
                        :style="{color: item.color}"
                      >{{ item.value }}<span class="static_unit">件</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="event_item mid_content">
              <div class="com_module event_static_module">
                <div class="top">
                  <div class="title">近30天流转事件</div>
                </div>
                <div class="static_bottom">
                  <div class="static_area">
                    <div
                      v-for="item in r30eventFlow"
                      :key="item.key"
                      class="static_item"
                      :style="{width: item.isFull? '100%' : '50%'}"
                    >
                      <span class="static_label">{{ item.label }}</span>
                      <span
                        class="static_value"
                        :style="{color: item.color}"
                      >{{ item.value }}<span class="static_unit">件</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="eachlinerow">
          <div class="event_item">
            <div class="com_module message_module event_message_module event_module">
              <div class="top">
                <div class="title">流转工作台</div>
                <div
                  v-if="showEventList"
                  class="more"
                >
                  <span @click="goEventList()">更多</span>
                </div>
              </div>
              <div class="bottom">
                <div class="tab">
                  <span
                    v-for="item in selectEventStateOptions"
                    :key="item.dictValue"
                    :class="{ selected: evtActiveType === item.dictValue }"
                    @click="changeTabFn(item.dictValue)"
                  >{{ item.dictDesc }}</span>
                </div>
                <el-table
                  v-if="flowTableData.length > 0"
                  :data="flowTableData"
                  border
                  max-height="312"
                  tooltip-effect="light"
                >
                  <el-table-column
                    type="index"
                    width="45"
                    class="indexcolor"
                  >
                    <template slot-scope="scope">
                      <span class="gray">{{ scope.$index + 1 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="事件编号"
                    width="140"
                    prop="eventCode"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    label="事件标题"
                    min-width="78"
                    prop="title"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    label="操作"
                    width="58"
                    class-name="table-column-action"
                  >
                    <template slot-scope="{ row }">
                      <el-button
                        type="text"
                        @click="_showInfo(row)"
                      >办理</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                  v-else
                  class="nodata"
                >
                  <div class="nodataimg">
                    <img src="@/assets/workbench/no_data@2x.png" alt>
                  </div>
                  <div class="nodatatxt">暂无数据</div>
                </div>
              </div>
            </div>
          </div>
          <div class="event_item mid_content">
            <div class="com_module message_module event_message_module event_module">
              <div class="top">
                <div class="title">处置工作台</div>
                <div
                  v-if="showEventList"
                  class="more"
                >
                  <span @click="goXietongTodo">更多</span>
                </div>
              </div>
              <div class="bottom">
                <div class="tab">
                  <span
                    v-for="item in selectHandleWorkEventStateOptions"
                    :key="item.dictValue"
                    :class="{ selected: handleActiveType === item.dictValue }"
                    @click="changeHandleTabFn(item.dictValue)"
                  >{{ item.dictDesc }}</span>
                </div>
                <el-table
                  v-if="handleTableData.length > 0"
                  :data="handleTableData"
                  border
                  max-height="312"
                  align="left"
                >
                  <el-table-column
                    type="index"
                    width="45"
                    class="indexcolor"
                  >
                    <template slot-scope="scope">
                      <span class="gray">{{ scope.$index + 1 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="事件编号"
                    width="140"
                    prop="eventCode"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    label="事件标题"
                    min-width="78"
                    prop="title"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    label="操作"
                    width="58"
                    class-name="table-column-action"
                  >
                    <template slot-scope="{ row }">
                      <el-button
                        type="text"
                        @click="_showXieTongInfo(row)"
                      >办理</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                  v-else
                  class="nodata"
                >
                  <div class="nodataimg">
                    <img src="@/assets/workbench/no_data@2x.png" alt>
                  </div>
                  <div class="nodatatxt">暂无数据</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="eachlinerow">
          <div class="width100">
            <div class="com_module serviceenter_module">
              <div class="top">
                <div class="title">快捷入口</div>
              </div>
              <div class="static_bottom">
                <div class="esrboxwrapper">
                  <div
                    v-for="(val, idx) in serviceList"
                    :key="idx"
                    class="esrbox"
                    @click="goToServiceFn(val)"
                  >
                    <i class="el-icon-link link_icon" />
                    <span>{{ val.serviceName }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="event_item">
        <div class="event_item">
          <div class="com_module event_static_module">
            <div class="top">
              <div class="title">近30天处置事件</div>
            </div>
            <div class="static_bottom">
              <div class="static_area">
                <div
                  v-for="item in r30eventHandle"
                  :key="item.key"
                  class="static_item"
                  :style="{width: item.isFull? '100%' : '50%'}"
                >
                  <span class="static_label">{{ item.label }}</span>
                  <span
                    class="static_value"
                    :style="{color: item.color}"
                  >{{ item.value }}<span class="static_unit">{{ item.unit || '件' }}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="com_module month_module">
          <div class="top">
            <div class="title">欢迎 {{ userNameAccount }}</div>
          </div>
          <div class="static_bottom">
            <div class="month_title">
              <span>
                月度数据
              </span>
              <el-date-picker
                v-model="curMonthValue"
                style="width: 116px;"
                type="month"
                align="right"
                format="yyyy-MM"
                value-format="yyyy-MM"
                :clearable="false"
                @change="changeMonth"
              />
            </div>
            <div class="month_static">
              <div class="citizen_static">
                <div class="citizen_title">
                  流转事件
                </div>
                <div class="citizen_bottom">
                  <div>
                    <div>
                      月度经办
                    </div>
                    <div>
                      <span class="citizen_value">{{ citizenStatic.mountCount }}</span>件
                    </div>
                  </div>
                  <div>
                    <div>
                      经办办结
                    </div>
                    <div>
                      <span class="citizen_value">{{ citizenStatic.mountDownCount }}</span>件
                    </div>
                  </div>
                </div>
              </div>
              <div class="citizen_static">
                <div class="citizen_title">
                  处置事件
                </div>
                <div class="citizen_bottom">
                  <div>
                    <div>
                      月度经办
                    </div>
                    <div>
                      <span class="citizen_value">{{ handleStatic.passCount }}</span>件
                    </div>
                  </div>
                  <div>
                    <div>
                      经办办结
                    </div>
                    <div>
                      <span class="citizen_value">{{ handleStatic.passEndCount }}</span>件
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="month_title">
              <span>
                消息通知
              </span>
              <div class="title_more" @click="goToMessageList">
                更多
              </div>
            </div>
            <div
              v-if="msgList.length > 0"
              class="emsg_area"
            >
              <div
                v-for="(val, idx) in msgList"
                :key="idx"
                class="emsg"
              >
                <div class="tm">
                  <i>{{ idx + 1 }}</i>
                  <b
                    :class="{
                      noread: val.messageStatus === 1,
                      read: val.messageStatus === 2,
                    }"
                  >{{
                    val.messageStatus === 1
                      ? "【未读】"
                      : val.messageStatus === 2
                        ? "【已读】"
                        : "【未知】"
                  }}</b>
                  <b class="platformName">{{ val.platformName }}</b>
                  <span style="float: right">{{ val.createTime }}</span>
                </div>
                <div
                  class="text"
                  :title="val.messageContent"
                  v-html="val.messageContent"
                />
              </div>
            </div>
            <div
              v-else
              class="nodata"
            >
              <div class="nodataimg">
                <img src="@/assets/workbench/no_data@2x.png" alt>
              </div>
              <div class="nodatatxt">暂无数据</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import msgApiService from '@/api/msgApi'
import { mapGetters } from 'vuex'
import { getAccessToken } from '@/utils/auth'
import { SUCCESS_CODE, HANDLE_STATE_LIST, HANDLE_WORK_STATE_LIST } from '@/constants'

export default {
  name: 'WorkbenchIndex',
  components: {},
  mixins: [],
  data() {
    return {
      r30eventOverview: [
        {
          label: '全部事件',
          key: 'totalCount',
          color: '#36A4FF',
          value: 0
        }, {
          label: '已办结',
          key: 'downCount',
          color: '#4CC09E',
          value: 0
        }, {
          label: '流转事件',
          key: 'dispatchEventCount',
          color: '#FF4D4F',
          value: 0
        }, {
          label: '流转办结',
          key: 'dispatchDownCount',
          color: '#FA8B16',
          value: 0
        }, {
          label: '三方自闭环事件',
          key: 'thirdSelfEventCount',
          color: '#4A72E5',
          value: 0
        }, {
          label: '自闭环办结',
          key: 'SelfEventCount',
          color: '#8D36FF',
          value: 0
        }
      ],
      r30eventFlow: [
        {
          label: '待流转',
          key: 'toDispatchCount',
          color: '#36A4FF',
          value: 0
        }, {
          label: '流转异常',
          key: 'dispatchErrorCount',
          color: '#4CC09E',
          value: 0
        }, {
          label: '处置中',
          key: 'handlingCount',
          color: '#FF4D4F',
          value: 0
        }, {
          label: '处置异常',
          key: 'handleErrorCount',
          color: '#FA8B16',
          value: 0
        }, {
          label: '已办结',
          key: 'handleDownCount',
          color: '#4A72E5',
          value: 0
        }, {
          label: '退回发起方',
          key: 'rebackCount',
          color: '#8D36FF',
          value: 0
        }
      ],
      r30eventHandle: [
        {
          label: '接收事件',
          key: 'receiveCount',
          color: '#36A4FF',
          value: 0,
          isFull: true
        }, {
          label: '受理事件',
          key: 'verifyedCount',
          color: '#FF4D4F',
          value: 0
        }, {
          label: '退回事件',
          key: 'cancelCount',
          color: '#FA8B16',
          value: 0
        }, {
          label: '办结事件',
          key: 'endCount',
          color: '#4A72E5',
          value: 0
        }, {
          label: '办结率',
          key: 'endRate',
          color: '#8D36FF',
          value: 0,
          unit: '%'
        }
      ],
      citizenStatic: {
        mountCount: 0,
        mountDownCount: 0
      },
      handleStatic: {
        passCount: 0,
        passEndCount: 0
      },
      commom30Day: [

      ],
      curMonthValue: '',
      timmer: '',
      noReadNumber: 0,
      evtActiveType: '',
      handleActiveType: '',
      flowTableData: [],
      handleTableData: [],
      msgList: [],
      serviceList: [],
      handleFlowInfo: {
        id: 115202093187,
        name: '手动流转',
        path: '/event-flow/handle-flow'
      }
    }
  },
  computed: {
    ...mapGetters(['getUnReadMessageNums', 'menuList', 'profile']),
    userNameAccount() {
      return (
        this.$store.getters.profile?.name ||
        this.$store.getters.profile?.nickName ||
        this.$store.getters.profile?.username ||
        '用户'
      )
    },
    userAccountId() {
      return this.$store.getters.profile?.id || ''
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
    showEventList() {
      return this.hasHandleFlow(this.menuList)
    },
    selectEventStateOptions() {
      return HANDLE_STATE_LIST
    },
    selectHandleWorkEventStateOptions() {
      return HANDLE_WORK_STATE_LIST
    }

  },
  watch: {
    menuList: {
      deep: true,
      immediate: true,
      handler(nval) {
        if (!nval || nval.length <= 0) return
        const flag = this.hasHandleFlow(nval)
        if (flag) {
          this.changeTabFn('')
        }
      }
    }
  },
  async mounted() {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    this.commom30Day = [`${start.getFullYear()}-${(start.getMonth() + 1).toString().padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')} 00:00:00`, `${end.getFullYear()}-${(end.getMonth() + 1).toString().padStart(2, '0')}-${end.getDate().toString().padStart(2, '0')} 23:59:59`]
    this.curMonthValue = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`
    this.serviceList = window.GLOBAL_CONFIG.workbenchServiceList
    await this.messageList()
    this.loopMessageList()
    await this.getR30Overview()
    await this.getR30FlowStatistics()
    await this.getR30eventHandle()
    await this.getCitizenStatic(this.curMonthValue)
    await this.getHandleStatic(this.curMonthValue)
    await this.getHandleTodoList()
  },
  beforeDestroy() {
    this.timmer && clearInterval(this.timmer)
  },
  methods: {
    hasHandleFlow(list) {
      let flag = false
      list?.forEach((e) => {
        e.children &&
          e.children.length &&
          e.children.forEach((k) => {
            if (
              k.name === this.handleFlowInfo.name ||
              k.path === this.handleFlowInfo.path
            ) {
              flag = true
            }
          })
      })
      return flag
    },
    goToServiceFn(val) {
      if (val.openNewWindow) {
        window.open(`${window.location.origin}${val.serviceUrl}`)
      } else {
        window.location.href = `${window.location.origin}${val.serviceUrl}`
      }
    },
    goXietongTodo() {
      window.location.href = `${window.location.origin}${window.GLOBAL_CONFIG.workbenchXieTongService.todoListUrl}`
    },
    goEventList() {
      this.$router.push({
        path: '/event-flow/handle-flow'
      })
    },
    // 查看详情
    _showInfo(row) {
      // 跳转详情页面, 详情页面，请求操作按钮的时候需要用到 taskId
      this.$router.push({
        path: '/event-flow/handle-flow/detail',
        query: {
          taskId: row.taskId,
          id: row.id
        }
      })
    },
    // 查看协同详情
    _showXieTongInfo(row) {
      window.location.href = `${window.location.origin}${window.GLOBAL_CONFIG.workbenchXieTongService.handleDetailUrl}?taskId=${row.taskId}&id=${row.id}`
    },
    async resultListTodo(state) {
      const params = {
        eventThirdState: state,
        pageNum: 1,
        pageSize: 99999
      }
      moduleSrv.getEventManualEventListPage(params).then((res) => {
        const { list = [] } = res.data
        if (res.code === SUCCESS_CODE) {
          if (list.length > 0) {
            this.flowTableData = list.splice(0, 10)
          } else {
            this.flowTableData = []
          }
        }
      })
    },
    // 服务总线-流转事件相关统计
    async getR30Overview() {
      const params = {
        startTime: this.commom30Day[0],
        endTime: this.commom30Day[1]
      }
      moduleSrv.getOneMounthOverviewStatistics(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          if (res.data && res.data[0]) {
            this.r30eventOverview?.forEach(e => {
              e.value = res.data[0][e.key]
            })
          }
        }
      })
    },
    async getR30FlowStatistics() {
      const params = {
        startTime: this.commom30Day[0],
        endTime: this.commom30Day[1]
      }
      moduleSrv.get30DispatchStatistics(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          if (res.data && res.data[0]) {
            this.r30eventFlow?.forEach(e => {
              e.value = res.data[0][e.key]
            })
          }
        }
      })
    },
    async getCitizenStatic(monthValue) {
      const params = {
        beginTime: `${monthValue}-01 00:00:00`,
        endTime: `${monthValue}-${new Date(new Date(monthValue).getFullYear(), new Date(monthValue).getMonth() + 1, 0).getDate()} 23:59:59`
      }
      moduleSrv.getMounthDataStatistics(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.citizenStatic = res.data
        }
      })
    },
    // 协同中心-处置事件相关
    async getR30eventHandle() {
      const params = {
        startTime: this.commom30Day[0],
        endTime: this.commom30Day[1]
      }
      moduleSrv.getOpenEventHandleStatistic(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          if (res.data) {
            this.r30eventHandle?.forEach(e => {
              e.value = res.data[e.key]
            })
          }
        }
      })
    },
    async getHandleStatic(monthValue) {
      const params = {
        startTime: `${monthValue}-01 00:00:00`,
        endTime: `${monthValue}-${new Date(new Date(monthValue).getFullYear(), new Date(monthValue).getMonth() + 1, 0).getDate()} 23:59:59`
      }
      moduleSrv.getOpenEventHandleUserStatistic(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.handleStatic = res.data
        }
      })
    },
    async getHandleTodoList(state) {
      const params = {
        eventState: state,
        pageNum: 1,
        pageSize: 10
      }
      moduleSrv.getOpenTcEventTodoList(params).then((res) => {
        const { list = [] } = res.data
        if (res.code === SUCCESS_CODE) {
          if (list.length > 0) {
            this.handleTableData = list
          } else {
            this.handleTableData = []
          }
        }
      })
    },
    changeTabFn(type) {
      this.evtActiveType = type
      this.resultListTodo(this.evtActiveType)
    },
    changeHandleTabFn(type) {
      this.handleActiveType = type
      this.getHandleTodoList(this.handleActiveType)
    },
    changeMonth() {
      this.getCitizenStatic(this.curMonthValue)
      this.getHandleStatic(this.curMonthValue)
    },
    // 消息相关
    loopMessageList() {
      this.timmer && clearInterval(this.timmer)
      this.timmer = setInterval(() => {
        this.messageList(false)
      }, 60 * 1000)
    },
    async messageList() {
      const { data } = await moduleSrv.postQueryMessage({
        receiveAccount: this.profile.username,
        pageNum: 1,
        pageSize: 4,
        messageStatus: '', // 未读
        deleteFlag: false
      })
      this.noReadNumber = data.total || 0
      this.msgList = data.list || []
    },
    read(msg) {
      if (msg.messageStatus !== 1) return
      msgApiService.setMsgRead({ id: msg.id }).then((res) => {
        this.$message.success('已标为已读')
        this.messageList()
      })
    },
    goToMessageList() {
      window.open(
        `${window.MESSAGE?.FX_MESSAGE_CENTER_PATH}?token=${getAccessToken()}`
      )
    }
  }
}
</script>

<style scoped lang="scss">
.wbi_wrapper {
  padding: 10px 0 0 10px;
  width: 100%;
  height: 100%;
  .eachlinerow {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    .width100 {
      width: 100%;
    }
    .width66 {
      width: calc(66% - 5px);
    }
    .width34 {
      width: calc(34% - 5px);
    }
    .event_item {
      flex: 1;
    }
    .mid_content {
      margin-left: 20px;
    }
    .list_item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex: 2;
    }
    .list-left-area {
      display: flex;
    }
    .event_static_module {
      height: 276px;
    }
    .static_bottom {
      padding: 0 24px 32px;
    }
    .static_area {
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #8a8a8a;
      .static_item {
        margin-bottom: 12px;
        padding: 12px 20px;
        height: 52px;
        background: #f1fafd;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .static_label {
          font-weight: 500;
          color: #4b4b4b;
          font-family: PingFang SC-Medium, PingFang SC;
        }
        .static_value {
          font-size: 20px;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
        }
        .static_unit {
          margin-left: 4px;
          font-weight: 400;
          font-size: 14px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #8a8a8a;
        }
      }
    }
    .month_title {
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title_more {
        cursor: pointer;
        color: #36a4ff;
      }
    }
    .month_static {
      display: flex;
      margin-bottom: 24px;
      justify-content: space-between;
      .citizen_static {
        padding: 24px;
        flex: 1;
        height: 128px;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        &:first-child {
          background-image: url("~@/assets/workbench/card_bg_left.png");
          margin-right: 20px;
        }
        background-image: url("~@/assets/workbench/card_bg_right.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-family: PingFang SC-Medium, PingFang SC;
        color: #ffffff;
        font-size: 14px;
        font-weight: 400;
        .citizen_bottom {
          display: flex;
          justify-content: space-between;
          .citizen_value {
            margin-right: 4px;
            line-height: 28px;
            font-size: 20px;
            font-weight: 500;
          }
        }
      }
    }
    .com_module {
      background: #ffffff;
      .top {
        height: 64px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 24px;
        .title {
          font-size: 18px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #313131;
          border-left: 4px solid #36a4ff;
          line-height: 16px;
          padding-left: 10px;
        }
        .tlright {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
      }
      .bottom {
        padding: 0 24px 32px;
      }
    }
    .tab {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      span {
        width: 88px;
        height: 32px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4b4b4b;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #e7e7e7;
        cursor: pointer;
        &.selected {
          color: #36a4ff;
          border-color: #36a4ff;
        }
      }
    }
    .more {
      cursor: pointer;
      color: #36a4ff;
      font-size: 14px;
    }
    .event_message_module {
      height: 212px;
    }
    .event_module {
      height: 480px;
      .bottom {
        height: 396px;
        ::v-deep {
          .gray {
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #bdbdbd;
          }
          .el-table th .cell {
            padding: 0 12px;
            height: 32px;
            line-height: 32px;
            text-align: left;
          }
          .el-table td .cell {
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #4b4b4b;
            padding: 0 12px;
            text-align: left;
          }
          .el-table thead th {
            border-bottom: 1px solid #E4E9ED;
          }
          // .el-table--striped .el-table__body tr.el-table__row--striped td {
          //   background: #f9fafe;
          // }
          .el-button {
            padding: 0px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #36a4ff;
          }
          .el-table__body-wrapper {
            &::-webkit-scrollbar {
              width: 0;
              background: rgba(213, 215, 220, 0.3);
              border:0 none;
            }
            &::-webkit-scrollbar-track {
              border: 0 none;
            }
          }
          .el-table th.gutter {
           display: none;
           width: 0;
          }
          .el-table colgroup col[name='gutter'] {
           display: none;
           width: 0;
          }
          .el-table__body {
           width: 100%!important;
          }

          .el-table--border th.gutter:last-of-type {
            border-top: 0 none;
            border-bottom: 0 none;
            background: #fff;
          }
        }
      }
    }
    .month_module {
      margin-top: 20px;
      height: 634px;
      .emsg_area {
        height: 290px;
        overflow: hidden;
        overflow-y: scroll;
        .emsg {
          cursor: pointer;
          margin-bottom: 25px;
          &:last-child {
            margin-bottom: 0px;
          }
          &:hover {
            background: #f1f1f1;
            box-shadow: -5px -5px 5px 5px #f1f1f1, 5px 5px 5px 5px #f1f1f1;
          }
          .tm {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            i {
              width: 23px;
              height: 23px;
              background: #36a4ff;
              border-radius: 4px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 18px;
              font-family: DINAlternate-Bold, DINAlternate;
              font-weight: bold;
              color: #ffffff;
              font-style: normal;
            }
            b {
              margin-left: 10px;
              &.noread {
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #ff4d4f;
              }
              &.read {
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #8a8a8a;
              }
            }
            span {
              font-size: 16px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #8a8a8a;
            }
          }
          .text {
            word-break: break-all;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #202020;
            line-height: 22px;
            margin-left: 33px;
            margin-top: 8px;
          }
        }
      }
    }
    .message_module {
      height: 474px;
      position: relative;
      .bottom {
        height: 410px;
        width: 100%;
        position: absolute;
      }
    }
    .serviceenter_module {
      height: 140px;
      .esrboxwrapper {
        width: 100%;
        display: flex;
        .esrbox {
          margin-right: 20px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-wrap: nowrap;
          padding: 13px 22px;
          background: #ebf9ff;
          border-radius: 2px;
          border: 1px solid #ebf9ff;
          font-size: 14px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #36a4ff;
          cursor: pointer;
          &:hover {
            transition: 0.5s;
            background: #36a4ff;
            color: #ffffff;
          }
          .link_icon {
            margin-right: 9px;
          }
        }
      }
    }
  }
  .listlinerow {
    display: flex;
    // justify-content: space-between;
    margin-right: 20px;
    margin-bottom: 20px;
    flex-direction: column;
    flex: 2;
  }
  .nodata {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .nodataimg {
      img {
        width: 214px;
        height: 184px;
      }
    }
    .nodatatxt {
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #c3cbd6;
      margin-top: 10px;
    }
  }
}
.platformName {
  flex: 1;
}
</style>
