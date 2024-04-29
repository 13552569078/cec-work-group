<!--
 * @description 事件审核--审批过程弹窗
 * @date 2020-08-24
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    title="审批"
    width="466px"
    top="20vh"
    v-on="$listeners"
    @confirm="_confirm"
    @cancle="_cancle"
  >
    <div class="tips fs14">
      <common-title title="申请信息" />
      <ul>
        <li class="li-item mb20 mt20 pl10">
          <div class="item-label mb6">申请类型</div>
          <div class="item-value">{{ detail.applyType | tansformText }}</div>
        </li>
        <li class="li-item mb20 pl10">
          <div class="item-label mb6">申请描述</div>
          <div class="ellipsis2 item-value" :title="detail.applyReason">
            {{ detail.applyReason || '-' }}
          </div>
        </li>
        <li v-if="detail.applyType === '1'" class="li-item mb20 pl10">
          <div class="item-label mb6">延期时间</div>
          <div class="ellipsis2 item-value">
            {{ detail.postponeTime || '-' }}
          </div>
        </li>
      </ul>
    </div>
    <el-form
      ref="form"
      :model="form"
      inline
      label-position="top"
      class="approval-dialog-class"
      :rules="rules"
    >
      <el-form-item label="审批结果" prop="replyState">
        <el-radio-group v-model="form.replyState">
          <el-radio label="2">通过</el-radio>
          <el-radio label="3">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审批描述" prop="replyOpinion">
        <el-input
          v-model="form.replyOpinion"
          type="textarea"
          maxlength="1000"
          :rows="5"
          placeholder="请输入内容"
          show-word-limit
        />
      </el-form-item>
    </el-form>
  </cestc-dialog>
</template>
<script>
import { validCommitStr } from '@/utils/validate'
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'

const checkCommitStr = (rule, value, callback) => {
  if (validCommitStr(value)) {
    // 是否包含了特殊字符
    return callback(new Error('意见包含了特殊字符，请检查后提交'))
  } else {
    callback()
  }
}

export default {
  name: 'ApprovalDialog',
  filters: {
    tansformText(val) {
      const obj = {
        1: '申请延时',
        2: '申请驳回'
      }
      return obj[val] || '-'
    }
  },
  props: {
    eventId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      detail: {},
      form: {
        replyState: '2'
      },
      rules: {
        replyOpinion: [
          { required: true, message: '审批描述不能为空', trigger: 'blur' },
          { validator: checkCommitStr, trigger: 'blur' }
        ]
      }
    }
  },
  async created() {
    await this.getDetail()
  },

  methods: {
    // 审批详情
    getDetail() {
      moduleSrv.getDelayApplyDetail(this.eventId).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.detail = res.data || {}
        } else {
          console.warn('getDelayApplyDetail 报错')
        }
      })
    },
    // 提交
    _confirm() {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        // applyType: 1-延期，2-驳回
        this.$nextTick(() => {
          this.$emit('confirm', {
            applyType: this.detail.applyType,
            ...this.form
          })
        })
      })
    },
    // 取消关闭弹窗
    _cancle() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.tips {
  .item-label {
    color: #8a8a8a;
  }
  .item-value {
    color: #4b4b4b;
  }
}
.approval-dialog-class {
  .el-form-item {
    width: 100%;
    margin-right: 0;
    &:nth-of-type(2) {
      margin-bottom: 0;
    }
  }
}
</style>
