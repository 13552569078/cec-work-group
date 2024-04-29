<!--
 * @description 数据字典配置--新增字典弹窗
 * @date 2020-09-09
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    :title="title"
    width="466px"
    top="20vh"
    v-on="$listeners"
    @confirm="_confirm"
  >
    <el-form
      ref="form"
      :model="form"
      inline
      label-position="top"
      class="dict-add-class"
      :rules="rules"
    >
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model="form.dictName" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="字典类型" prop="dictType">
        <el-input v-model="form.dictType" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="1">正常</el-radio>
          <el-radio label="2">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </cestc-dialog>
</template>
<script>
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
export default {
  name: 'AddDict',
  data() {
    return {
      form: {
        status: '1'
      },
      rules: {
        dictName: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
        ],
        dictType: [
          { required: true, message: '字典类型不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    mode() {
      return this.$attrs.mode || 'add'
    },
    backFillData() {
      return this.$attrs.dialogdata
    },
    title() {
      const mode = this.mode
      const obj = {
        add: '新增字典',
        edit: '编辑字典'
      }
      return obj[mode]
    }
  },
  watch: {
    '$attrs.visible': function(val) {
      // 打开弹窗，先把表单清空
      if (val) {
        // 判读是新增还是编辑
        if (this.mode === 'add') {
          this.form = {
            status: '1'
          }
        } else {
          this.form = this.backFillData
        }
      } else {
        this.$refs.form && this.$refs.form.clearValidate()
      }
    }
  },
  methods: {
    // 提交
    _confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 判读是新增还是编辑
          if (this.mode === 'add') {
            moduleSrv.addDict(this.form).then((res) => {
              if (res.code === SUCCESS_CODE) {
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
                this.$emit('update:visible', false)
                // 更新列表
                this.$emit('update')
              } else {
                this.$message({
                  message: res.message || '操作失败！',
                  type: 'error'
                })
              }
            })
          } else {
            moduleSrv.editDict(this.form).then((res) => {
              if (res.code === SUCCESS_CODE) {
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
                this.$emit('update:visible', false)
                // 更新列表
                this.$emit('update')
              } else {
                this.$message({
                  message: res.message || '操作失败！',
                  type: 'error'
                })
              }
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dict-add-class {
  .el-form-item {
    width: 100%;
  }
}
</style>
