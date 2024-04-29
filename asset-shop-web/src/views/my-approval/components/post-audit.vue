<!--
 * @Description:
 * @Author: lianpeng
 * @Date: 2022-04-25
-->
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
      <c-form-item label="审核结果" prop="applyStatus" :label-top-no-padding="true">
        <c-radio-group v-model="postFormData.applyStatus" @change="changeApplyStatus">
          <c-radio label="1">通过</c-radio>
          <c-radio label="2">驳回</c-radio>
        </c-radio-group>
      </c-form-item>
      <c-form-item ref="auditMsg" label="审核意见" prop="auditMsg" style="margin-bottom: 12px;" :label-top-no-padding="true">
        <c-input
          v-model="postFormData.auditMsg" size="small" resize="none" type="textarea"
          maxlength="50" placeholder="请输入" show-word-limit :rows="3" clearable />
      </c-form-item>
      <c-form-item v-if="applyType==3&&postFormData.applyStatus==1" ref="accessUrl" label="访问信息" prop="accessUrl" style="margin-bottom: 12px;" :label-top-no-padding="true">
        <c-input
          v-model="postFormData.accessUrl" size="small" resize="none" type="textarea"
          maxlength="200" placeholder="请输入" show-word-limit :rows="3" clearable />
      </c-form-item>
    </c-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <c-button
        size="small"
        type=""
        @click="close()"
      >取消</c-button>
      <c-button
        type="primary"
        size="small"
        @click="postApp()"
      >确定</c-button>
    </div>
  </c-dialog>
</template>

<script>
import { applyHandle } from '@/api'
export default {
  props: {
    postDailogFlag: {
      type: Boolean,
      default: false
    },
    applyId: {
      type: [Number, String],
      default: 0
    },
    applyType: { // 1-资源下载、2-订阅申请、3-权限分配、4-独立部署
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      postFormData: {
        applyId: '',
        applyStatus: '',
        auditMsg: '',
        accessUrl: ''
      },
      rules: {
        applyStatus: [
          { required: true, message: '请选择审核结果', trigger: 'change' }
        ],
        auditMsg: [
          { required: false, message: '请输入审核意见', trigger: 'blur' }
        ],
        accessUrl: [
          { required: true, message: '请输入访问信息', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    title() {
      // 1-资源下载、2-订阅申请、3-权限分配、4-独立部署
      let title = '资源下载审核'

      switch (this.applyType) {
        case 1:
          title = '资源下载审核'
          break
        case 2:
          title = '订阅申请审核'
          break
        case 3:
          title = '权限分配审核'
          break
        case 4:
          title = '独立部署审核'
          break

        default:
          break
      }
      return title
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
      this.$refs.postFormData.validate(valid => {
        if (!valid) return
        const loading = this.$loading({
          lock: true,
          text: '审核处理中。。。',
          fullscreen: false,
          background: 'rgba(0, 0, 0, 0)'
        })
        const data = {
          ...this.postFormData,
          applyId: this.applyId
        }
        applyHandle(data).then(res => {
          loading.close()

          if (res.code * 1 === 0) {
            this.$message.success(res.msg || '审核成功')
            this.$emit('close', true)
          }
        }).catch(err => {
          console.log(err)
          loading.close()
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

