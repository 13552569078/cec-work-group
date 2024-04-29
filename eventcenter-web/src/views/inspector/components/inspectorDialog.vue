<!--
 * @description 督办发起 督办详情
 * @date 2020-09-09
 * @author qiyongguo
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    :title="matchTitle"
    width="672px"
    top="10vh"
    :content-height="700"
    center
    class="inspect-dialog"
    v-on="$listeners"
  >
    <div ref="eventInfo" class="event-info">
      <common-title title="事件信息" />
      <ul class="view-wrapper">
        <li class="view-item">
          <span class="label">事件编号</span>
          <span class="value">{{ rowData.eventCode || '--' }}</span>
        </li>
        <li class="view-item">
          <span class="label">紧急程度</span>
          <span class="value">{{ rowData.urgentText || '--' }}</span>
        </li>
        <li class="view-item">
          <span class="label">事件类型</span>
          <span class="value">{{ rowData.eventTypeText || '--' }}</span>
        </li>
        <li class="view-item">
          <span class="label">事件描述</span>
          <span class="value">{{ rowData.eventDesc || '--' }}</span>
        </li>
      </ul>
    </div>
    <common-title title="督办信息" />
    <div v-if="dialogMode == 'view'" class="inspector-info">
      <ul class="view-wrapper">
        <li class="view-item">
          <span class="label">督办主题</span>
          <span class="value">{{ inspectInfo.superviseTitle || '--' }}</span>
        </li>
        <li class="view-item">
          <span class="label">紧急程度</span>
          <span class="value">{{ inspectInfo.urgentText || '--' }}</span>
        </li>
        <li class="view-item">
          <span class="label">反馈时间</span>
          <span class="value">{{ inspectInfo.feedTimeLimit || '--' }}</span>
        </li>
        <li class="view-item">
          <span class="label">处置人</span>
          <span class="value">{{ inspectInfo.roleName || '--' }}</span>
        </li>
        <li class="view-item row">
          <span class="label">任务描述</span>
          <span class="value">{{ inspectInfo.taskDesc || '--' }}</span>
        </li>
      </ul>
    </div>
    <el-form
      v-show="dialogMode == 'add'"
      ref="form"
      :model="form"
      :rules="rules"
      inline
      label-position="top"
      class="inspector-form"
    >
      <el-form-item label="督办主题" prop="superviseTitle">
        <el-input v-model="form.superviseTitle" placeholder="请输入内容" maxlength="50" />
      </el-form-item>
      <el-form-item label="紧急程度" prop="urgentType">
        <el-select v-model="form.urgentType" placeholder="请选择">
          <el-option
            v-for="(item, index) in urgentTypeOptions"
            :key="item.id || index"
            :label="item.dictDesc"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- 进行改造 -->
      <el-form-item label="处置机构：" prop="deptId">
        <popover-select
          key="main"
          title="处置机构"
          right-title="机构角色"
          :has-user="false"
          :tree-data="deptOptions"
          :value.sync="currentDept"
          :select-text="mainSelectText"
        />
      </el-form-item>
      <el-form-item label="反馈时限：" prop="feedTimeLimit">
        <cestc-date-picker
          v-model="form.feedTimeLimit"
          :custom-picker-options="pickerOptions"
          type="datetime"
          placeholder="请选择反馈时限"
        />
      </el-form-item>
      <el-form-item label="任务描述：" prop="taskDesc" class="item-row">
        <el-input
          v-model="form.taskDesc"
          type="textarea"
          :rows="3"
          maxlength="500"
        />
      </el-form-item>
    </el-form>
    <div v-if="progressArr.length" class="progress">
      <common-title title="督办进展" />
      <sus-progress :list-data="progressArr" />
    </div>
    <!-- 自定义操作按钮 -->
    <div slot="footer">
      <el-button @click.stop="_cancle">取消</el-button>
      <el-button
        v-if="dialogMode == 'add'"
        type="primary"
        @click.stop="_confirm"
      >提交</el-button>
      <el-button
        v-if="isFeedBack && inspectInfo.superviseState == 1"
        @click.stop="claim"
      >认领</el-button>
      <el-button
        v-if="isFeedBack && inspectInfo.superviseState == 2"
        @click.stop="unClaim"
      >取消认领</el-button>
      <el-button
        v-if="isFeedBack && inspectInfo.superviseState == 2"
        type="primary"
        @click.stop="fedback"
      >反馈</el-button>
      <el-button
        v-if="isMyInspector && inspectInfo.superviseState == 3"
        type="primary"
        @click.stop="audit"
      >审核</el-button>
      <el-button
        v-if="
          isMyInspector &&
            (inspectInfo.superviseState == 1 || inspectInfo.superviseState == 2)
        "
        type="primary"
        @click.stop="comment"
      >评论</el-button>
    </div>
    <operate-dialog
      :id="inspectInfo.id"
      :visible.sync="operateDialogVisible"
      :type="operateType"
      @cancle="operateDialogClose"
    />
  </cestc-dialog>
</template>
<script>
import susProgress from '../components/susProgress.vue'
import operateDialog from './operateDialog.vue'
import PopoverSelect from '@/components/PopoverSelect'
import moduleSrv from '@/api/dispatch'
import { mapActions } from 'vuex'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'InspectorDialog',
  components: {
    susProgress,
    operateDialog,
    PopoverSelect
  },
  data() {
    const deptIdNotEmpty = (rule, value, callback) => {
      if (!this.mainSelectText) {
        return callback(new Error('调度对象不能为空'))
      } else {
        callback()
      }
    }
    return {
      form: {},
      rules: {
        superviseTitle: [
          { required: true, message: '请输入督办主题', trigger: 'blur' }
        ],
        urgentType: [
          { required: true, message: '请选择紧急程度', trigger: 'change' }
        ],
        deptId: [
          {
            required: true,
            validator: deptIdNotEmpty,
            trigger: 'blur'
          }
        ],
        feedTimeLimit: [
          { required: true, message: '请选择反馈时限', trigger: 'change' }
        ],
        roleId: [
          { required: true, message: '请选择机构角色', trigger: 'change' }
        ],
        taskDesc: [
          { required: true, message: '请输入任务描述', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      currentDept: {}, // 主调度对象
      deptOptions: [],
      roleOptions: [],
      rowData: {}, // 发起督办数据或者事件详情中事件对象
      inspectInfo: {},
      progressArr: [],
      operateType: 1,
      operateDialogVisible: false
    }
  },
  computed: {
    mainSelectText() {
      const { dept = {}, role = {}} = this.currentDept
      if (!dept.name || !role.length) {
        return []
      }
      const res = role.map((item) => {
        return {
          ...item,
          deptName: `${item.deptObj.name}/${item.name}`
        }
      })
      return res
    },
    dialogMode() {
      return this.$attrs.mode || 'add'
    },
    matchTitle() {
      const key = this.dialogMode
      const obj = {
        add: '督办单发起',
        view: '督办单详情'
      }
      return obj[key]
    },

    eventPlatformOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_platform')
    },
    eventSourceOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_origin')
    },
    urgentTypeOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('urgentType')
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
    isFeedBack() {
      return this.$route.path === '/inspector/feedback'
    },
    isMyInspector() {
      return this.$route.path === '/inspector/settle'
    }
  },
  watch: {
    // 监听弹窗开启关闭动作，每当开启后，需要更新级联绑定数据
    '$attrs.visible': function(val) {
      if (!val) {
        this.$refs['form'].resetFields()
        this.form = {}
      } else {
        this.updateForm()
      }
    }
  },
  methods: {
    ...mapActions('dispatch', ['getEventType']),
    // 确认按钮触发
    _confirm() {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        // 处置机构参数拼装
        const { dept = {}, role = [] } = this.currentDept
        if (!role.length || !dept.id) {
          this.$message({
            type: 'warning',
            message: '机构机构、角色必填'
          })
          return
        }
        const temObj = {
          roleId: role[0]?.id,
          roleName: role[0]?.name,
          deptId: dept.id,
          deptName: dept.name
        }
        const params = {
          ...this.form,
          ...temObj,
          eventId: this.rowData.id
        }

        moduleSrv.submitSupervise(params).then((res) => {
          if (res.code === 500) {
            this.$message.error(res.message)
          } else {
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            this.$emit('cancle', 1)
          }
        })
      })
    },
    // 更新级联选择数据，修复回显问题
    async updateForm() {
      this.progressArr = []
      const mode = this.$attrs.mode
      if (mode === 'add') {
        await this.getSuperviseDepts()
        this.rowData = this.$attrs.editingdata || {}
        this.$set(this.form, 'roleId', '')
      } else {
        moduleSrv
          .getSuperviseById(
            this.$attrs.editingdata.superviseId || this.$attrs.editingdata.id
          )
          .then((res) => {
            if (res.code === SUCCESS_CODE && res.data) {
              this.rowData = res.data.event || {}
              this.rowData.eventTypeText = `${this.rowData.eventTypeLName}/${this.rowData.eventTypeMNAME}/${this.rowData.eventTypeName}`
              this.rowData.urgentText = this.eventUrgentOptions.get(
                this.rowData.eventUrgent
              )
              this.inspectInfo = res.data.tcSupervise || {}
              const urgent =
                this.urgentTypeOptions.find(
                  (item) =>
                    Number(item.dictValue) ===
                    Number(this.inspectInfo.urgentType)
                ) || {}
              this.inspectInfo.urgentText = urgent.dictDesc
              this.progressArr = res.data.tcSuperviseInfoList || []
            }
          })
      }
    },
    // 获取机构信息
    getSuperviseDepts() {
      const eventId = this.$attrs.editingdata && this.$attrs.editingdata.id
      moduleSrv.getSuperviseDepts({ eventId }).then((res) => {
        this.deptOptions = res || []
      })
    },
    deptChange(nVal) {
      const item = this.deptOptions.find((item) => item.id === nVal)
      this.form.deptName = item.name
      this.form.roleId = ''
      this.$nextTick(() => {
        this.roleOptions = item.roleVOList || []
      })
    },
    roleChange(nVal) {
      const item = this.roleOptions.find((item) => item.id === nVal)
      this.form.roleName = item.name
    },
    // 取消、关闭弹窗
    _cancle() {
      this.$emit('cancle')
    },
    // 认领
    claim() {
      moduleSrv.claimSupervise({ id: this.inspectInfo.id }).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.$message.success('认领成功')
          this.updateForm()
        }
      })
    },
    unClaim() {
      moduleSrv.unClaimSupervise({ id: this.inspectInfo.id }).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.$message.success('取消认领成功')
          this.updateForm()
        }
      })
    },
    // 审核
    audit() {
      this.operateType = 1
      this.operateDialogVisible = true
    },
    // 评论
    comment() {
      this.operateType = 2
      this.operateDialogVisible = true
    },
    // 反馈
    fedback() {
      this.operateType = 3
      this.operateDialogVisible = true
    },
    // 操作弹窗关闭回调
    operateDialogClose(refresh) {
      refresh && this.updateForm()
      this.operateDialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
@include info;
.event-info, .inspector-info {
  .view-wrapper {
    padding-top: 20px;
    .view-item {
      padding: 0 10px;
    }
  }
}
.inspector-form {
  margin-top: 20px;
  .el-form-item {
    width: calc(50% - 10px);
    margin-right: 20px;
    &:nth-of-type(2n) {
      margin-right: 0;
    }
    margin-bottom: 20px;
    &.item-row {
      width: 100%;
      margin-right: 0;
    }
    .el-select {
      width: 100%;
    }
    ::v-deep .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100%;
    }
  }
}
</style>

<style lang='scss'>
.cestc-dialog.inspect-dialog .el-dialog__body{
  max-height: 600px;
}
</style>
