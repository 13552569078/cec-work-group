<!--
 * @description 流程管理--按钮表单
 * @date 2020-09-13
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    :title="title"
    width="600px"
    top="20vh"
    :content-height="500"
    v-on="$listeners"
    @confirm="_confirm"
    @cancle="_cancle"
  >
    <el-form
      ref="form"
      :model="form"
      inline
      label-position="top"
      class="process-button-class"
      :rules="rules"
    >
      <el-form-item label="按钮编码" prop="buttonCode">
        <el-input v-model="form.buttonCode" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="按钮名称" prop="buttonName">
        <el-input v-model="form.buttonName" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="排序" prop="orderNum">
        <el-input v-model="form.orderNum" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="过滤条件" prop="filter">
        <el-input
          v-model="form.filter"
          type="textarea"
          maxlength="1000"
          :rows="5"
          placeholder="请输入内容"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="是否有效" prop="optStatus">
        <el-radio-group v-model="form.optStatus">
          <el-radio label="1">有效</el-radio>
          <el-radio label="2">无效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </cestc-dialog>
</template>
<script>
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
export default {
  name: 'ProcessButtonDialog',
  data() {
    return {
      form: {
        optStatus: '1'
      },
      rules: {
        buttonCode: [
          { required: true, message: '按钮编码不能为空', trigger: 'blur' }
        ],
        buttonName: [
          { required: true, message: '按钮名称不能为空', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ],
        optStatus: [
          { required: true, message: '是否有效不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    mode() {
      return this.$attrs.mode
    },
    title() {
      const obj = {
        add: '新增按钮',
        edit: '编辑按钮'
      }
      return obj[this.mode]
    },
    rowdata() {
      return this.$attrs.rowdata
    },
    currentnode() {
      return this.$attrs.currentnode
    }
  },
  watch: {
    '$attrs.visible': function(val) {
      // 打开弹窗，先把表单清空
      if (val) {
        this.form = {
          optStatus: '1'
        }
        this.$refs.form && this.$refs.form.clearValidate()
        // 编辑的时候回显
        if (this.mode === 'edit') {
          const { id, buttonCode, buttonName, orderNum, filter, optStatus } =
            this.rowdata
          this.form.id = id
          this.$set(this.form, 'buttonCode', buttonCode)
          this.$set(this.form, 'buttonName', buttonName)
          this.$set(this.form, 'orderNum', orderNum)
          this.$set(this.form, 'filter', filter)
          this.$set(this.form, 'optStatus', optStatus)
        }
      }
    }
  },
  methods: {
    // 提交
    _confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 不管新增，还是编辑，都需要带modelKey， usertaskId， 从currentnode 这里获取
          const { modelKey = '', id = '' } = this.currentnode || {}
          if (!modelKey || !id) {
            this.$message({
              message: '请选择有效的节点!',
              type: 'error'
            })
            return
          }
          this.form.modelKey = modelKey
          this.form.usertaskId = id
          // 根据类型，选择调用不同的接口
          if (this.mode === 'add') {
            moduleSrv.addProcessTaskButton(this.form).then((res) => {
              if (res.code === SUCCESS_CODE) {
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
                // 关闭弹窗，更新列表
                this.$emit('update:visible', false)
                this.$emit('update')
              } else {
                this.$message({
                  message: res.message || '操作失败!',
                  type: 'error'
                })
              }
            })
          } else {
            moduleSrv.editProcessTaskButton(this.form).then((res) => {
              if (res.code === SUCCESS_CODE) {
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
                // 关闭弹窗，更新列表
                this.$emit('update:visible', false)
                this.$emit('update')
              } else {
                this.$message({
                  message: res.message || '操作失败!',
                  type: 'error'
                })
              }
            })
          }
        }
      })
    },
    _cancle() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.process-button-class {
  .el-form-item {
    width: 100%;
  }
}
</style>
