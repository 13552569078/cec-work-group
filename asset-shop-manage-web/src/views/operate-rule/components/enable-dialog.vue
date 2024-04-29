<!--/*
* @Author: dingli
* @Desc: 启用、停用
* @Date:
*/-->
<template>
  <c-dialog
    :title="`规则${title}`"
    width="436px"
    class="dialog-center"
    :visible.sync="dialogVisible"
    @close="beforeClose"
  >
    <c-form ref="refFrom" :model="formData" :rules="rules" style="height:90px">
      <c-form-item :label="`${title}方式`" prop="type">
        <c-radio-group v-model="formData.type">
          <c-radio :label="1">{{ `立即${title}` }}</c-radio>
          <c-radio :label="2">{{ `定时${title}` }}</c-radio>
        </c-radio-group>
      </c-form-item>
      <c-form-item v-if="formData.type==2" label="生效时间" prop="time">
        <c-date-picker
          v-model="formData.time"
          :picker-options="pickerOptions"
          type="datetime"
          style="width:296px"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择生效时间">
        </c-date-picker>
      </c-form-item>
    </c-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <c-button
        size="small"
        type="ordinary"
        @click="clickClose"
      >取消</c-button>
      <c-button
        type="gradual"
        size="small"
        :disabled="loading"
        @click="clickOk"
      >确定</c-button>
    </div>
  </c-dialog>
</template>
<script>
import { changeRuleStatus } from '@/api/operate-rule'
export default {
  name: 'EnableDialog',
  components: {},
  props: {
    visible: Boolean,
    data: Object,
    type: Number // 1-启用, 2-停用
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      formData: {
        type: 1,
        time: ''
      },
      rules: {
        type: { required: true, message: '请选择', trigger: 'change' },
        time: { required: true, message: '请选择生效时间', trigger: 'change' }
      },
      pickerOptions: {
        disabledDate(val) {
          return val.getTime() < (Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    }
  },
  computed: {
    title() {
      if (+this.type === 1) {
        return '启用'
      }
      return '停用'
    }
  },
  watch: {
    visible: {
      handler(nv) {
        this.dialogVisible = nv
        if (nv) {
          this.init()
        }
      }
    }
  },
  created() {},
  methods: {
    init() {
      // 已有生效时间的“待生效”状态点击【启用】可继续编辑“规则启用”弹窗内内容（显示上一次编辑保存的内容）
      if (+this.data.ruleStatus === 0 && this.data.validTime) {
        this.formData.type = 2
        this.formData.time = this.data.validTime
      }
      // 已有失效时间的“生效中”状态点击【停用】可继续编辑“规则停用”弹窗内内容（显示上一次编辑保存的内容）
      if (+this.data.ruleStatus === 1 && this.data.invalidTime) {
        this.formData.type = 2
        this.formData.time = this.data.invalidTime
      }
    },
    beforeClose() {
      this.$emit('close')
      this.resetForm()
    },
    clickClose() {
      this.dialogVisible = false
      this.resetForm()
    },
    resetForm() {
      this.loading = false
      this.formData.type = 1
      this.formData.time = ''
    },
    clickOk() {
      this.$refs.refFrom.validate(valid => {
        if (!valid) {
          return
        }
        const params = { operateType: this.type }
        if (+this.formData.type !== 2) {
          params.time = ''
        } else {
          params.time = this.formData.time
          if (new Date(params.time.replace(/-/g, '/')).getTime() < Date.now()) {
            return this.$message.warning('生效时间不得早于当前时间')
          }
        }
        this.sendData(params)
      })
    },
    async sendData(params) {
      this.loading = true
      try {
        await changeRuleStatus(this.data.id, params)
        this.$message.success('操作成功')
        this.$emit('ok')
        this.clickClose()
      } catch (e) {
        this.loading = false
        // e
      }
    }
  }
}
</script>
<style scoped lang="scss">
.dialog-center{
  &::v-deep{
    .c-form-item__label{
      margin-right: 4px;
    }
    .c-form-item{
      margin-bottom: 32px;
    }
  }
}
</style>
