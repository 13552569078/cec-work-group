<template>
  <el-dialog
    title="作废提示"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="close"
    :close-on-click-modal="false"
    class="confirm-dialog"
  >
    <svg-icon class="warning-icon" icon-class="告警" /><span
      class="warn-title"
    >即将作废当前事件！</span>
    <span class="warn-desc">事件作废后将无法还原，确认是否提交？</span>
    <el-form label-position="top" label-width="80px" :model="form">
      <el-form-item label="作废原因">
        <el-input v-model="form.comment" placeholder="请输入" :autosize="{ minRows: 4, maxRows: 7 }" class="input" show-word-limit maxlength="300" type="textarea" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">提交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
export default {
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
    }
  },
  data() {
    return {
      form: {
        comment: ''
      }
    }
  },
  watch: {
    dialogVisible: {
      handler(nVal) {
        if (nVal) {
          this.form.comment = `与事件 [ ${this.similarObj.eventCode} ] 重复，该事件作废`
        }
      }
    }
  },

  methods: {
    confirm() {
      const params = {
        eventIds: this.formBody.eventIds,
        comment: this.form.comment
      }
      moduleSrv.filterEventVerify(params).then(res => {
        if (res.code === SUCCESS_CODE) {
          this.$message({
            type: 'success',
            message: res.message || '操作成功'
          })
          this.close()
          this.$router.push({
            path: '/event/filter'
          })
        } else {
          this.$message({
            type: 'error',
            message: res.message || '操作失败'
          })
        }
      })
    },
    close() {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.confirm-dialog {
  .warning-icon {
    font-size: 32px;
  }
  .warn-title {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #4b4b4b;
    display: inline-block;
    padding-left: 10px;
  }
  .warn-desc {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #8a8a8a;
    line-height: 20px;
    display: block;
    padding: 8px 0 20px 42px;
  }
  .input {
      ::v-deep .el-input__count {
          background: none;
      }
  }
}
</style>
