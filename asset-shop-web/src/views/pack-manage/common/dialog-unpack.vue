<!--/*
* @Author: dingli
* @Desc: 选择应用弹框
* @Date:
*/-->
<template>
  <c-dialog
    :class="'dialog-center'"
    :title="'下架申请'"
    width="480px"
    :visible.sync="dialogVisible"
    append-to-body
    :before-close="closeDialog">
    <c-form
      ref="refUnpackForm"
      :model="formData"
      label-position="top"
      :rules="rules"
      @submit.native.prevent>
      <div class="cls-tips"><i class="c-icon-warning"></i> {{ tipsText }}</div>
      <c-form-item label="下架原因" prop="unpackReason">
        <c-input
          v-model="formData.unpackReason"
          type="textarea"
          maxlength="50"
          :rows="4"
          :autosize="false"
          resize="none"
          show-word-limit
          placeholder="请输入" />
      </c-form-item>

      <c-form-item label="下架方式" prop="unpackType">
        <c-radio-group v-model="formData.unpackType">
          <c-radio label="0">立即下架</c-radio>
          <c-radio label="1">定时下架</c-radio>
        </c-radio-group>
      </c-form-item>
      <c-form-item v-if="formData.unpackType==1" label="下架时间" prop="unpackTime">
        <c-date-picker
          v-model="formData.unpackTime"
          :picker-options="pickerOptions"
          type="datetime"
          style="width:296px"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择">
        </c-date-picker></c-form-item>

    </c-form>
    <div slot="footer" class="dialog-footer">
      <c-button size="small" type="" @click="closeDialog">取消</c-button>
      <c-button type="primary" size="small" @click="clickOk">确定</c-button>
    </div>
  </c-dialog>
</template>
<script>
export default {
  name: 'DialogPacked',
  props: {
    visible: Boolean,
    assetType: [Number, String]
  },
  data() {
    return {
      dialogVisible: true,
      formData: {
        unpackReason: '',
        unpackType: '0',
        unpackTime: null
      },
      rules: {
        unpackReason: { required: true, message: '请输入', trigger: ['blur', 'change'] },
        unpackType: { required: true, message: '请选择', trigger: ['blur', 'change'] },
        unpackTime: { required: true, message: '请选择', trigger: ['blur', 'change'] }
      },
      pickerOptions: {
        disabledDate(val) {
          return val.getTime() < (Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    }
  },
  computed: {
    tipsText() {
      // 应用
      if (+this.assetType === 99) return '下架申请通过后，资源状态将自动改为已停用'
      // 22接口, 14体征, 72模型, 27支撑应用
      if ([22, 14, 72, 27, 7].includes(+this.assetType)) return '下架申请通过后，资源订阅状态将自动改为已失效'
      return '下架申请通过后，资源将不在门户展示'
    }
  },
  watch: {
    visible: {
      handler(nv) {
        this.dialogVisible = nv
      }
    }
  },
  created() {
    this.dialogVisible = this.visible
  },
  methods: {
    clickOk() {
      this.$emit('ok', this.formData)
      this.closeDialog()
    },
    closeDialog() {
      this.formData.unpackReason = ''
      this.formData.unpackType = '0'
      this.formData.unpackTime = null
      this.$refs.refUnpackForm.resetFields()
      this.$emit('close')
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
.cls-tips {
  margin-bottom: 20px;
  padding-left: 16px;
  height: 48px;
  line-height: 48px;
  background: rgba(30, 111, 255, 0.05);
  border: 1px solid $primaryColor;
  i {
    color: $primaryColor;
  }
}
</style>
