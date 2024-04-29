<!--
 * @description 全局事件详情--按钮操作权限
 * @date 2020-08-21
 * @author lism
-->
<template>
  <!-- 经办没有操作按钮，事件查询只有取消认领按钮查询，其他经办事件走 getToDoButtons 权限  -->
  <div>
    <el-button-group class="event-infomation-button">
      <!-- 审批管理，不从按钮接口权限控制, 固定死 -->
      <el-button
        v-if="hasApplyPermission"
        :type="isPrimary('')"
        @click.stop="_handleApply"
      >审批</el-button>
      <el-button
        v-for="(item,index) in todoButtons"
        :key="item.buttonCode"
        :v-show="()=> fiterBtnShow(item)"
        style="display: flex;
      align-items: center;
      justify-content: center;"
        :type="isPrimary(item,index)"
        :class="isHide(item)"
        @click.stop="_handle_actions(item.buttonCode)"
      >
        {{ item.buttonName }}
      </el-button>
      <!-- 调度 -->
      <dispatch-dialog
        v-if="showDispatchDialog"
        :visible.sync="showDispatchDialog"
        :button-code="buttonCode"
        :todo-buttons="todoButtonsArray"
        :task-id="taskId"
        @confirm="_handle_dispatch"
      />
      <!-- 吹哨调度 -->
      <whistle-dialog
        v-if="showWhistleDialog"
        :visible.sync="showWhistleDialog"
        :button-code="buttonCode"
        :todo-buttons="todoButtonsArray"
        :task-id="taskId"
        @confirm="_handle_whistle"
      />
      <!-- 审核 -->
      <review-dialog
        v-if="showReviewDialog"
        :visible.sync="showReviewDialog"
        :button-code="buttonCode"
        @confirm="_handle_review"
      />
      <!-- 处理 -->
      <handle-dialog
        v-if="showHandleDialog"
        :visible.sync="showHandleDialog"
        :button-code="buttonCode"
        :todo-buttons="todoButtonsArray"
        :task-id="taskId"
        :end-time="eventInfo.endTime"
        @confirm="_handle_handle"
      />
      <!-- 结案 -->
      <settle-dialog
        v-if="showSettleDialog"
        :visible.sync="showSettleDialog"
        :button-code="buttonCode"
        @confirm="_handle_settle"
      />
      <!-- 审批 -->
      <approval-dialog
        v-if="showApprovalDialog"
        :visible.sync="showApprovalDialog"
        :event-id="eventId"
        @confirm="_handle_approval"
      />
      <!-- 转派 -->
      <to-other-dialog
        v-if="showToOtherDialog"
        :visible.sync="showToOtherDialog"
        :task-id="taskId"
        @confirm="_handle_dispatch"
      />
      <!-- 转派郑郑订 -->
      <to-zzd-dialog
        v-if="showToZzdDialog"
        :visible.sync="showToZzdDialog"
        :task-id="taskId"
        @confirm="_handle_zzd"
      />
      <!-- 机构角色选择 -->
      <select-role
        v-if="showSelectRoleDialog"
        :visible.sync="showSelectRoleDialog"
        :role-list="roleList"
        @confirm="_handle_select_role"
      />
      <!-- 事件升级 -->
      <upgrade-dialog
        v-if="showUpgradeDialog"
        :visible.sync="showUpgradeDialog"
        :event-info="eventInfo"
        @upgrade="_handle_upgrade"
      />
      <!-- 审批 -->
      <approval-new-dialog
        v-if="showApprovalNewDialog"
        :visible.sync="showApprovalNewDialog"
        :event-id="eventId"
        :action="approveAction"
        @approveConfirm="_handle_approval_new"
      />
      <el-button v-if="showEvaluate" type="primary" @click.stop="handleEvaluate">评价</el-button>
      <el-button v-if="!onlyView" @click.stop="_printDetail">打印</el-button>
      <el-button v-if="!onlyView && false">删除</el-button>
      <!-- 嵌入其他系统的时候，不展示返回按钮 -->
      <el-button v-if="!hiddenBack" @click.stop="_goBack">返回</el-button>
    </el-button-group>
    <cmDialog
      v-if="dialogVisible"
      :dialog-visible="dialogVisible"
      :dig-type="digType"
      :dig-data="digData"
    />
  </div>
</template>

<script>
import dispatchDialog from '@/components/EventInfo/dialog/dispatch' // 调度流程
import whistleDialog from '@/components/EventInfo/dialog/whistle' // 吹哨调度
import reviewDialog from '@/components/EventInfo/dialog/review' // 审核流程
import handleDialog from '@/components/EventInfo/dialog/handle' // 处理流程
import settleDialog from '@/components/EventInfo/dialog/settle' // 结案流程
import approvalDialog from '@/components/EventInfo/dialog/approval' // 审批流程
import toOtherDialog from '@/components/EventInfo/dialog/toOther' // 转派流程
import toZzdDialog from '@/components/EventInfo/dialog/toZzd' // 转派郑郑订
import selectRole from '@/components/EventInfo/dialog/selectRole' // 选择角色
import upgradeDialog from '@/components/EventInfo/dialog/upgrade.vue' // 事件升级
import approvalNewDialog from '@/components/EventInfo/dialog/approvalNew.vue' // 审批
import { sendMsg, sendMsgFromWindow } from '@/config/IFRAME'
import moduleSrv from '@/api/dispatch'
import moduleSrvWhh from '@/api/dispatchWhh'
import { mapActions, mapGetters } from 'vuex'
import { SUCCESS_CODE } from '@/constants'
import cmDialog from '@/views/event/appraise/cmDialog.vue'

export default {
  name: 'EventButtons',
  components: {
    dispatchDialog,
    whistleDialog,
    reviewDialog,
    handleDialog,
    settleDialog,
    approvalDialog,
    toOtherDialog,
    toZzdDialog,
    selectRole,
    cmDialog,
    upgradeDialog,
    approvalNewDialog
  },
  props: {
    eventInfo: {
      type: Object,
      default: () => {}
    },
    eventId: {
      type: [String, Number],
      default: ''
    },
    taskId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      showDispatchDialog: false, // 调度弹窗
      showWhistleDialog: false, // 吹哨弹窗
      showReviewDialog: false, // 审核弹窗
      showHandleDialog: false, // 处理弹窗
      showSettleDialog: false, // 结案弹窗
      showApprovalDialog: false, // 审批弹窗
      showToOtherDialog: false, // 转派弹窗
      showToZzdDialog: false, // 转派郑郑订
      showSelectRoleDialog: false, // 选择角色弹窗
      showUpgradeDialog: false, // 事件升级
      showApprovalNewDialog: false, // 事件审批
      buttonCode: '', // 当前按钮的编码
      action: '', // 操作类型
      roleList: [], // 角色数据

      dialogVisible: false,
      digType: '',
      digData: {},
      approveAction: '', // 审批0-拒绝，1-通过
      isWindowOpenFromWujie: window.isWindowOpenFromWujie
    }
  },
  computed: {
    ...mapGetters(['todoButtons']),
    // 嵌入其他平台的返回按钮要隐藏 || 如果有参数 flag = jump 的也隐藏
    hiddenBack() {
      return this.$route.query.flag === 'jump' || this.isWindowOpenFromWujie
    },
    todoButtonsArray() {
      // 编码进行全部小写格式化
      return this.todoButtons.map((item) => item.buttonCode.toLowerCase())
    },
    // 只查看，没有操作权限
    onlyView() {
      // 经办、办结流程没有操作按钮
      const _noPermissionRoute = [
        'workbench/handle/info',
        'workbench/assist/info',
        'workbench/notify/info'
      ]
      const _routePath = this.$route.path
      return _noPermissionRoute.some((item) => _routePath.indexOf(item) > -1)
    },
    // 审批权限
    hasApplyPermission() {
      const _avaiableRoute = ['event/approval/info']
      const _routePath = this.$route.path
      return _avaiableRoute.some((item) => _routePath.indexOf(item) > -1)
    },

    // 是否显示评价按钮
    showEvaluate() {
      return this.$route.query.formSource === 'evaluate' && this.eventInfo.evaluateFlag === '1'
    },
    // 是否区县一网统管wujie的工作台
    isWujieWorkebench() {
      return this.$route.query.isWujieWorkebench === '1'
    }
  },
  watch: {
    // 如果只有查看权限，则无需再继续查询按钮权限,
    taskId: {
      immediate: true,
      handler(val) {
        if (val && !this.onlyView) {
          // 先获取按钮权限, 事件审批页面，只有审批按钮，不需求调用 todobuttons 接口
          if (!this.hasApplyPermission) {
            this.getTodoButtons({
              eventId: this.eventId,
              taskId: this.taskId
            })
          }
        }
      }
    }
  },
  created() {
    // 先清空 todoButtons 列表
    this.$store.commit('dispatch/RET_TODO_BUTTONS', [])
  },
  methods: {
    _search() {
      this.$parent.getEventDetail()
    },
    async handleEvaluate() {
      this.digType = 'edit'
      const params = {
        eventId: this.eventInfo.id
      }
      const res = await moduleSrvWhh.getEvaluateModelByEventCode(params)
      if (res.code === SUCCESS_CODE) {
        this.digData = Object.assign({ eventInfo: this.eventInfo }, { evaluateList: res.data })
        this.dialogVisible = true
      }
    },
    ...mapActions('dispatch', ['getTodoButtons']),
    fiterBtnShow(item) {
      if (item.buttonCode !== 'dispatch_up' && item.buttonCode !== 'dispatch_down' && item.buttonCode !== 'whistle' || (item.buttonCode === 'report2meeting' && this.eventInfo.hasUpdMeetingStatus !== 1)) {
        return true
      }
      return false
    },
    // 是否需要额外把按钮隐藏
    isHide(button) {
      const _hiddenArray = ['dispatch_up', 'dispatch_down']
      return _hiddenArray.some((item) => item.indexOf(button.buttonCode) > -1)
        ? 'hiden'
        : ''
    },
    // 是否为主键颜色
    isPrimary(button, index) {
      if (this.hasApplyPermission && this.todoButtons.length > 1 && button === 'sp') {
        return 'primary'
      } else if (this.todoButtons.length > 2 && index === 0) {
        return 'primary'
      } else if (button && button.buttonCode === 'agree') {
        return 'primary'
      }
      return 'default'
    },
    // 审批弹窗入口
    _handleApply() {
      this.showApprovalDialog = true
    },
    // 审批提交
    _handle_approval(form) {
      if (!form) return
      const params = {
        eventId: this.eventId,
        ...form
      }
      if (form.applyType === '1') {
        // 延时答复
        moduleSrv.reply(params).then((res) => {
          this.ajaxResult(res)
        })
      } else {
        // 驳回答复
        moduleSrv.replyReject(params).then((res) => {
          this.ajaxResult(res)
        })
      }
    },
    // 流程操作按钮总入口
    _handle_actions(code) {
      // 调度、上报、下发、吹哨申请
      const dispatchActions = [
        'dispatch_dispatch',
        'dispatch_up',
        'dispatch_down',
        'whistle',
        'whistle_dispatch',
        'whistle_reply'
      ]
      // 审核通过、审核作废、审核驳回
      const verifyActions = ['verify_pass', 'verify_cancel', 'verify_back']
      // 处理延期、处理申请驳回、处理、上报联动指挥
      const handleActions = [
        'handle_apply',
        'handle_reject',
        'handle_complete',
        'handle_change',
        'handle_report', // 上报联动指挥
        'handle_chengguan', // 下发城管
        'report2meeting', // 升级到联席事件
        'handle_municipal', // 上报市平台
        'zzd_change', // 郑郑订转派
        'upgradedispatchevent' // 升级到联动指挥
      ]
      // 结案驳回、同意、检查、评价
      const approveActions = [
        'approve_reject',
        'approve_agree',
        'approve_check',
        'approve_evaluation'
      ]
      // 审批同意、驳回
      const approvalActions = ['agree', 'refuse']
      if (code === 'claim') {
        this.setClaim({ taskId: this.taskId })
        // 点击认领按钮之前，先选择角色
        // this.getRoleByEventId()
      } else if (code === 'unClaim') {
        this.setUnclaim()
      } else if (
        // 审核
        verifyActions.some((item) => code.toLowerCase().indexOf(item) > -1)
      ) {
        // 把 code 小写处理
        this.buttonCode = code.toLowerCase()
        this.showReviewDialog = true
      } else if (
        dispatchActions.some((item) => code.toLowerCase().indexOf(item) > -1)
      ) {
        // 调度, 区分出一次吹哨，二次吹哨，三次吹哨，还是其他调度
        // 把 code 小写处理
        this.buttonCode = code.toLowerCase()
        const whistleArr = ['whistle_dispatch', 'whistle_second', 'whistle_three', 'whistle_complete', 'whistle_reply', 'whistle_reject']
        if (whistleArr.includes(this.buttonCode)) {
          this.showWhistleDialog = true
        } else {
          this.showDispatchDialog = true
        }
      } else if (
        handleActions.some((item) => code.toLowerCase().indexOf(item) > -1)
      ) {
        // 处理节点
        // 把 code 小写处理
        this.buttonCode = code.toLowerCase()
        switch (this.buttonCode) {
          case 'handle_change': // 转派
            this.showToOtherDialog = true
            break
          case 'handle_report': // 上报联动指挥
            this.toOtherPlatform('eventtomq', '是否确认上报联动指挥?', '上报联动指挥')
            break
          case 'handle_chengguan': // 下发城管
            this.toOtherPlatform('eventtoChengGuan', '是否确认下发城管?', '下发城管')
            break
          case 'handle_municipal': // 上报市平台
            this.toOtherPlatform('eventToMunicipalPlat', '是否确认上报市平台?', '上报市平台')
            break
          case 'report2meeting': // 升级到联席事件
            this.toOtherPlatform('pushEventToChengGuan', '是否升级到联席事件', '升级到联席事件')
            break
          case 'zzd_change':
            // console.log('zzd_change');
            this.showToZzdDialog = true
            break
          case 'upgradedispatchevent':
            this.showUpgradeDialog = true
            break
          default: // 正常的处理弹窗处理
            this.showHandleDialog = true
            break
        }
      } else if (
        approveActions.some((item) => code.toLowerCase().indexOf(item) > -1)
      ) {
        // 结案
        // 把 code 小写处理
        this.buttonCode = code.toLowerCase()
        this.showSettleDialog = true
      } else if (approvalActions.some((item) => code.toLowerCase().indexOf(item) > -1)) {
        this.approveAction = code === 'agree' ? 1 : 0
        this.showApprovalNewDialog = true
      }
    },

    /**
     * 上报其他平台
     * fn : 方法名
     * tipsContent: 提示语内容
     * tipsTitle: 提示语标题
     * options: {} // 其他的额外参数
     * */
    toOtherPlatform(fn, tipsContent, tipsTitle, options = {}) {
      this.$confirm(tipsContent, tipsTitle, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          eventId: this.eventId,
          ...options
        }
        moduleSrv[fn](params).then((res) => {
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          // 返回列表页面，退出详情页面
          this.isWujieWorkebench ? window.$wujie?.bus.$emit('backToWorkbench', true, this.$route) : this.$router.go(-1)
          // 如果是其他平台打开的，则关闭当前 tab
          if (this.hiddenBack) {
            window.close() || window.self.close()
            sendMsgFromWindow('reload')
          }
        })
      })
        .catch((e) => {
          console.log('取消操作', e)
        })
    },

    // 根据事件 id 获取角色
    getRoleByEventId() {
      moduleSrv.getRoleByEventId(this.eventId, this.taskId).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.roleList = res.data || []
          // 如果有超过一个角色，则弹窗让用户选择，要是只有一个角色，则默认选择
          const length = this.roleList.length
          if (length === 1) {
            this._handle_select_role({ roleId: res.data[0].roleId })
          } else if (length > 1) {
            this.showSelectRoleDialog = true
          } else {
            this.$message({
              message: '可选角色为空!',
              type: 'error'
            })
          }
        } else {
          this.$message({
            message: res.message || '获取角色失败!',
            type: 'error'
          })
        }
      })
    },
    // 选择机构弹窗触发
    _handle_select_role(form) {
      if (!form) return
      const params = {
        taskId: this.taskId,
        ...form
      }
      // 关闭弹窗
      this.setClaim(params)
      this.showSelectRoleDialog = false
    },
    // 认领
    setClaim(params) {
      moduleSrv.claim(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          // 更新操作权限按钮
          this.getTodoButtons({ eventId: this.eventId, taskId: this.taskId })
        } else {
          this.$message({
            message: '认领失败!',
            type: 'error'
          })
        }
      })
    },
    // 取消认领
    setUnclaim() {
      moduleSrv.unclaim(this.taskId).then((res) => {
        if (res.code === SUCCESS_CODE) {
          // 更新操作权限按钮
          this.getTodoButtons({ eventId: this.eventId, taskId: this.taskId })
        } else {
          this.$message({
            message: '取消认领失败!',
            type: 'error'
          })
        }
      })
    },
    // 审核流程相关操作
    _handle_review(form) {
      if (!form) return
      const params = {
        eventId: this.eventId,
        taskId: this.taskId,
        comment: form.comment,
        action: form.action
      }
      moduleSrv.review(params).then((res) => {
        this.ajaxResult(res)
      })
    },

    // 结案操作
    _handle_settle(form) {
      if (!form) return
      const { comment = '', action = '' } = form
      const params = {
        eventId: this.eventId,
        taskId: this.taskId,
        comment,
        action
      }
      moduleSrv.approve(params).then((res) => {
        this.ajaxResult(res)
      })
    },

    // 转派郑郑订
    _handle_zzd(form) {
      if (!form) return
      const params = {
        id: this.eventId,
        taskId: this.taskId,
        ...form
      }
      moduleSrv.zzdChange(params).then((res) => {
        // this.ajaxResult(res)
        if (res.data) { // 转派成功，
          this.$message({
            message: '转派成功！',
            type: 'success'
          })
          sendMsg('eventDialogClose')
          // 返回列表页面，退出详情页面
          this.isWujieWorkebench ? window.$wujie?.bus.$emit('backToWorkbench', true, this.$route) : this.$router.go(-1)
          // 如果是其他平台打开的，则关闭当前 tab
          if (this.hiddenBack) {
            window.close() || window.self.close()
            sendMsgFromWindow('reload')
          }
        } else {
          this.$message({
            message: res.message || '转派失败！',
            type: 'error'
          })
        }
      })
    },

    // 调度操作
    _handle_dispatch(form) {
      if (!form) return
      const params = {
        eventId: this.eventId,
        taskId: this.taskId,
        ...form
      }
      moduleSrv.dispatch(params).then((res) => {
        this.ajaxResult(res)
      })
    },
    // 吹哨申请
    _handle_whistle(form) {
      if (!form) return
      const params = {
        eventId: this.eventId,
        taskId: this.taskId,
        ...form
      }
      console.log('form==', params)
      // 根据 form 的 buttonCode 区分接口
      const map = {
        'whistle_dispatch': moduleSrv.whistleOne,
        'whistle_second': moduleSrv.whistleTwo,
        'whistle_three': moduleSrv.whistleThree,
        'whistle_complete': moduleSrv.whistleToComplete,
        'whistle_reply': moduleSrv.whistleToReply,
        'whistle_reject': moduleSrv.whistleReject
      }
      map[form.buttonCode](params).then(res => {
        this.ajaxResult(res)
      })
    },

    // result response
    ajaxResult(res) {
      if (res.code === SUCCESS_CODE) {
        this.$message({
          message: '操作成功！',
          type: 'success'
        })
        // 如果是被嵌入的方式，则告诉父框架，要关闭弹窗
        console.log('要关闭弹窗了', window.embed)
        sendMsg('eventDialogClose')
        // 返回列表页面，退出详情页面
        this.isWujieWorkebench ? window.$wujie?.bus.$emit('backToWorkbench', true, this.$route) : this.$router.go(-1)
        // 如果是其他平台打开的，则关闭当前 tab
        if (this.hiddenBack) {
          window.close() || window.self.close()
          sendMsgFromWindow('reload')
        }
      } else {
        this.$message({
          message: res.message || '操作失败！',
          type: 'error'
        })
      }
    },
    // 处理操作
    _handle_handle(form) {
      if (!form) return
      const params = {
        eventId: this.eventId,
        taskId: this.taskId,
        ...form
      }
      if (form.action === 'complete') {
        // 事件
        moduleSrv.handle(params).then((res) => {
          this.ajaxResult(res)
        })
      } else if (form.action === 'apply') {
        // 事件延时, 申请理由字段变为 applyReason
        delete params.action
        params.applyReason = params.comment
        moduleSrv.delayApply(params).then((res) => {
          this.ajaxResult(res)
        })
      } else if (form.action === 'reject') {
        // 事件驳回
        delete params.action
        moduleSrv.applyReject(params).then((res) => {
          this.ajaxResult(res)
        })
      }
    },
    // 升级
    _handle_upgrade(params) {
      moduleSrv.upgradeEventToDispatch(params).then((res) => {
        this.ajaxResult(res)
      })
    },
    // 审批
    _handle_approval_new(params) {
      moduleSrv.approvalEvent(params).then((res) => {
        this.ajaxResult(res)
      })
    },
    // 打印
    _printDetail() {
      this.$emit('print')
    },
    // 返回操作
    _goBack() {
      if (this.isWindowOpenFromWujie) return
      console.log('.............................back', this.isWujieWorkebench)
      // 返回列表页面，退出详情页面
      this.isWujieWorkebench ? window.$wujie?.bus.$emit('backToWorkbench', false, this.$route) : this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.event-infomation-button {
  .hiden {
    display: none;
  }
  .el-button {
    margin-right: 16px;
  }
}
</style>
