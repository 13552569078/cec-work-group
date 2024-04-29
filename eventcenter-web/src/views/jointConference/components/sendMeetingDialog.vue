<template>
  <el-dialog
    title="发起联席会议"
    width="594px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    append-to-body
    @close="close"
  >
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      label-position="top"
      label-width="100px"
      class="form-in-dialog"
      :class="{'info-form' : formDisabled}"
      top="10vh"
    >
      <el-form-item label="会议主题" prop="meetingTitle">
        <el-input v-model="formData.meetingTitle" size="small" placeholder="请输入会议主题，不超过50个字" />
      </el-form-item>
      <el-form-item label="会议描述" type="text" prop="meetingDesc">
        <el-input
          v-model="formData.meetingDesc"
          type="textarea"
          :rows="2"
          size="small"
        />
      </el-form-item>
      <el-form-item label="参会人员" prop="meetingAttendOrg">
        <el-input v-model="formData.meetingAttendOrg" size="small" @click.stop.native="addMember" />
      </el-form-item>
      <el-form-item label="会议类型" prop="meetingType">
        <el-radio-group v-model="formData.meetingType">
          <el-radio :label="1">线上会议</el-radio>
          <el-radio :label="2">线下会议</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="升级联席会议原因" type="text" prop="startMeetingReason">
        <el-input
          v-model="formData.startMeetingReason"
          type="textarea"
          :rows="2"
          size="small"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <template v-if="!formDisabled">
        <el-button @click="close">取消</el-button>
        <el-button v-loading="submitLoading" type="primary" @click="confirm">提交</el-button>
      </template>
    </div>
    <member-dialog
      :dialog-visible.sync="showMemberDialog"
      :form-data.sync="formData"
    />

  </el-dialog>
</template>

<script>
import moduleSrv from '@/api/dispatch'
import memberDialog from './memberDialog.vue'
import { getPosType } from '@/utils/index'
import { SUCCESS_CODE } from '@/constants'

export default {
  components: {
    memberDialog
  },
  // mixins: [dfMixin],
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    formBody: {
      type: Object,
      default: () => {}
    },
    similarObj: {
      type: Object,
      default: () => {}
    },
    eventInfo: {
      type: Object,
      default: () => {}
    },
    groupId: {
      required: true,
      type: [Number, String]
    },
    dialogMode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tagOptionList: [],
      resMoreIdList: [],
      submitLoading: false,
      formData: {
        meetingAttendUserList: []
      },
      showMemberDialog: false,

      rules: {
        meetingTitle: [
          { required: true, message: '会议主题，不超过50个字', trigger: 'blur' }
        ],
        meetingDesc: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        meetingAttendOrg: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        meetingType: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        startMeetingReason: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    formTitle() {
      return this.dialogMode === 'add' ? '添加角色' : this.dialogMode === 'edit' ? '编辑角色' : '角色详情'
    },
    formDisabled() {
      return this.dialogMode === 'info'
    }
  },
  watch: {
    'formData.meetingAttendOrg': {
      handler(val) {
        if (val) {
          this.$refs.form.clearValidate('meetingAttendOrg')
        }
      }
    }
    // eventInfo: {
    //   handler(val) {
    //     if (val && val.startMeetingReason) {
    //       this.formData.startMeetingReason = val.startMeetingReason
    //     }
    //   }
    // }
  },
  created() {
  },
  methods: {
    treeChange(data) {
      this.resMoreIdList = data
    },
    close() {
      this.$emit('update:dialogVisible', false)
    },
    goBack() {
      this.$router.push({
        path: '/joint-conference/meeting-query'
      })
      this.$emit('update:dialogVisible', false)
    },
    addMember() {
      this.showMemberDialog = true
    },
    handleClick(list) {
      try {
        const listStr = list.join(',')
        // console.log('当前人员操作的动作的数据userid orgid compcontroltype evt：', userid || '_', orgid || '_', compcontroltype || '_', evt || '_')
        // 音视频只有 win 系统支撑, 其他系统不支持
        console.log('tauruszzd://taurusclient/action/avmeeting/conferenceCreateByIds?title=ttt&isVideoConference=true&calleeStaffIds=' + listStr)
        if (getPosType() === 'mac') {
          this.$message.warning('mac 系统暂不支持')
        } else {
          window.open('tauruszzd://taurusclient/action/avmeeting/conferenceCreateByIds?title=ttt&isVideoConference=true&calleeStaffIds=' + listStr, '_blank')
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.goBack()
      }
    },
    async confirm() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        const { meetingAttendUserList = [], meetingDesc, meetingTitle, meetingType, startMeetingReason } = this.formData
        this.submitLoading = true
        try {
          const params = {
            eventId: this.$route.query.id,
            meetingAttendUserList,
            meetingDesc,
            meetingTitle,
            meetingType,
            startMeetingReason
          }
          const res = await moduleSrv.createEventMeeting(params)
          if (res.code === SUCCESS_CODE) {
            if (meetingType === 1) { // 线上会议
              const list = meetingAttendUserList.reduce((pre, item) => {
                if (item.zzdAccountId) {
                  pre.push(item.zzdAccountId)
                }
                return pre
              }, [])
              this.handleClick(list)
            } else {
              this.$message.success('提交成功')
              this.goBack()
            }
          } else {
            this.$message.error(res.msg)
          }
        } catch (err) {
          console.log(err)
          this.$message.error(err)
        } finally {
          this.submitLoading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-in-dialog {
  padding-right: 15px;
  max-height: 55vh;
  overflow-y: auto;
  ::v-deep .c-radio__label{
  font-weight: normal;
  }
  &.info-form {
    ::v-deep .c-form-item__label {
      color: #8A8A8A;
    }
    ::v-deep .c-form-item__content {
      div {
        min-height: 40px;
      }
    }
  }
}
.entire_item{
    width: 100%;
    .c-select {
      width: 100%;
    }
  }
</style>
