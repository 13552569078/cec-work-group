<!--
 * @description 事件审核--结案过程弹窗
 * @date 2020-08-24
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    :title="matchTitle.title"
    width="466px"
    top="20vh"
    v-on="$listeners"
    @confirm="_confirm"
    @cancle="_cancle"
  >
    <el-form
      ref="form"
      :model="form"
      inline
      label-position="top"
      class="settle-dialog-class"
      :rules="rules"
    >
      <el-form-item :label="matchTitle.label" prop="comment">
        <el-input
          v-model="form.comment"
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

const checkCommitStr = (rule, value, callback) => {
  if (validCommitStr(value)) {
    // 是否包含了特殊字符
    return callback(new Error('意见包含了特殊字符，请检查后提交'))
  } else {
    callback()
  }
}

export default {
  name: 'SettleDialog',
  props: {
    buttonCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        comment: ''
      },
      rules: {
        comment: [
          { required: true, message: '请描述', trigger: 'blur' },
          { validator: checkCommitStr, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    matchTitle() {
      // 根据权限定制弹窗标题
      let title = ''
      let label = ''
      let action = ''
      if (this.buttonCode.indexOf('approve_reject') > -1) {
        title = '事件驳回'
        label = '驳回意见'
        action = 'reject'
      } else if (this.buttonCode.indexOf('approve_check') > -1) {
        title = '事件核查'
        label = '核查说明'
        action = 'check'
      } else {
        title = '事件结案'
        label = '结案说明'
        action = 'complete'
      }
      return {
        title,
        label,
        action
      }
    }
  },
  methods: {
    // 提交
    _confirm() {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        this.$nextTick(() => {
          this.$emit('confirm', {
            ...this.form,
            action: this.matchTitle && this.matchTitle.action
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
.settle-dialog-class {
  .el-form-item {
    width: 100%;
  }
}
</style>
