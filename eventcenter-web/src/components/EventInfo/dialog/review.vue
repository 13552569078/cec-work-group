<!--
 * @description 事件审核--审核过程弹窗
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
      class="type-in-class"
      :rules="rules"
    >
      <el-form-item
        :label="matchTitle.label"
        prop="comment"
        :rules="
          matchTitle.action === 'pass'
            ? ''
            : { required: true, message: '意见不能为空', trigger: 'blur' }
        "
      >
        <!-- 除了通过不需要必填校验，其他类型都要进行必填校验 -->
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
  name: 'ReviewDialog',
  props: {
    buttonCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {},
      rules: {
        comment: [{ validator: checkCommitStr, trigger: 'blur' }]
      }
    }
  },
  computed: {
    matchTitle() {
      // 根据权限定制弹窗标题
      let title = ''
      let label = ''
      let action = ''
      if (this.buttonCode.indexOf('verify_pass') > -1) {
        title = '审核通过'
        label = '通过意见'
        action = 'pass'
      } else if (this.buttonCode.indexOf('verify_cancel') > -1) {
        title = '审核作废'
        label = '作废意见'
        action = 'fail'
      } else {
        title = '审核驳回'
        label = '驳回意见'
        action = 'reject'
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
        this.$emit('confirm', { ...this.form, action: this.matchTitle.action })
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
.type-in-class {
  .el-form-item {
    width: 100%;
  }
}
</style>
