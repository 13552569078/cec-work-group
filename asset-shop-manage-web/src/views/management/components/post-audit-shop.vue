<!--
 * @Description: 运营审核
 * @Author: 张森
 * @Date: 2022-01-14
-->

<template>
  <c-dialog
    :class="'dialog-center'"
    width="480px"
    :visible.sync="postDailogFlag"
    :before-close="close"
    :title="title"
  >
    <c-form
      v-if="postDailogFlag"
      ref="postFormData"
      :model="postFormData"
      :rules="rules"
      label-position="top"
    >
      <c-form-item
        label="审核结果"
        prop="applyStatus"
        :label-top-no-padding="true"
      >
        <c-radio-group
          v-model="postFormData.applyStatus"
          @change="changeApplyStatus"
        >
          <c-radio v-model="postFormData.applyStatus" label="1">通过</c-radio>
          <c-radio v-model="postFormData.applyStatus" label="2">驳回</c-radio>
        </c-radio-group>
      </c-form-item>
      <c-form-item
        ref="auditMsg"
        label="审核意见"
        prop="auditMsg"
        style="margin-bottom: 12px"
        :label-top-no-padding="true"
      >
        <c-input
          v-model="postFormData.auditMsg"
          size="small"
          resize="none"
          type="textarea"
          maxlength="50"
          placeholder="请输入"
          show-word-limit
          :rows="3"
          clearable
        />
      </c-form-item>
    </c-form>
    <div slot="footer" class="dialog-footer">
      <c-button size="small" type="ordinary" @click="close()">取消</c-button>
      <c-button type="gradual" size="small" @click="postApp()">确定</c-button>
    </div>
  </c-dialog>
</template>

<script>
import { shopApplyHandle } from '@/api/manage'
import { assetApplyTypeFormat } from '@/utils/enumerate.js'
export default {
  props: {
    postDailogFlag: {
      type: Boolean,
      default: false
    },
    applyId: {
      type: Number,
      default: 0
    },
    applyType: [String, Number]
  },
  data() {
    return {
      postFormData: {
        applyId: '',
        applyStatus: '',
        auditMsg: ''
      },
      status: false,
      rules: {
        applyStatus: [
          { required: true, message: '请选择审核结果', trigger: 'change' }
        ],
        auditMsg: [
          { required: false, message: '请输入审核意见', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    title() {
      const str = assetApplyTypeFormat(this.applyType) || ''
      return str + '审核'
    }
  },
  watch: {
    postDailogFlag() {
      this.postFormData = {
        applyId: '',
        applyStatus: '',
        auditMsg: ''
      }
      this.rules.auditMsg[0].required = false
    }
  },
  methods: {
    changeApplyStatus(val) {
      const msg = this.postFormData.auditMsg
      this.$refs.auditMsg.resetField()
      if (val === '2') {
        this.rules.auditMsg[0].required = true
      } else {
        this.rules.auditMsg[0].required = false
      }
      this.postFormData.auditMsg = msg
    },
    postApp() {
      if (this.status) return
      this.$refs.postFormData.validate((valid) => {
        if (!valid) return

        const data = {
          applyId: this.applyId,
          applyStatus: this.postFormData.applyStatus,
          auditMsg: this.postFormData.auditMsg
        }
        this.status = true
        shopApplyHandle(data).then((res) => {
          this.status = false
          if (res.code * 1 === 0) {
            this.$message.success(res.msg || '审核成功')
            this.$emit('close', true)
          }
        }).catch(() => {
          this.status = false
        })
      })
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  position: relative;
}
</style>

