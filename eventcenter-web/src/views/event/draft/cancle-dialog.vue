<template>
  <cestc-dialog
    v-bind="$attrs"
    title="作废"
    width="684px"
    top="10vh"
    v-on="$listeners"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      inline
      label-position="top"
      class="type-in-class"
    >
      <el-form-item label="作废类型" prop="invalidState">
        <el-radio-group v-model="form.invalidState" class="cestc-radio-group">
          <el-radio
            v-for="item in invalidTypes"
            :key="item.dictValue"
            :label="item.dictValue"
          >{{ item.dictDesc }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="作废原因" prop="invalidDesc">
        <el-input
          v-model="form.invalidDesc"
          type="textarea"
          maxlength="1000"
          :rows="5"
          placeholder="请输入内容"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <!-- 自定义操作按钮 -->
    <div slot="footer">
      <el-button @click.stop="_cancle">取消</el-button>
      <el-button type="primary" @click.stop="_confirm">提交</el-button>
    </div>
  </cestc-dialog>
</template>
<script>
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'

export default {
  data() {
    return {
      form: {},
      rules: {
        invalidState: [
          { required: true, message: '作废类型不能为空', trigger: 'blur' }
        ],
        invalidDesc: [
          { required: true, message: '作废原因不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    invalidTypes() {
      return this.$store.getters.getBsDictsByType('invalid_flag')
    }
  },
  watch: {
    // 监听弹窗开启关闭动作，每当开启后，需要更新级联绑定数据
    '$attrs.visible': function(val) {
      if (!val) {
        this.form = {}
      }
    }
  },
  methods: {
    // 取消、关闭弹窗
    _cancle() {
      this.$emit('update:cancle', false)
    },
    _confirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          moduleSrv
            .withdrawDraft({
              id: this.$attrs.echoData.id,
              ...this.form
            })
            .then((res) => {
              if (res.code === SUCCESS_CODE) {
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
                this.$emit('refresh')
              } else {
                this.$message({
                  message: res.message || '操作失败！',
                  type: 'error'
                })
              }
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.type-in-class {
  .el-form-item {
    width: calc(50% - 25px);
    margin-right: 24px;
    .el-cascader,
    .el-select {
      // 修复上级事件类型样式问题
      width: 100%;
    }
    // &:nth-child(2n) {
    //   margin-right: 0;
    // }
    &.item-row {
      width: 100%;
    }
    .upload-trigger {
      display: flex;
    }
    .upload_tips {
      cursor: initial;
      color: #bdbdbd;
    }
    .el-upload-list {
      display: flex;
    }
  }
}
</style>
