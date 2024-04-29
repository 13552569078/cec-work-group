<!--
 * @description 数据字典配置--子集字典
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
    @cancle="_cancle"
  >
    <el-form
      ref="form"
      :model="form"
      inline
      label-position="top"
      class="sub-dict-class"
      :rules="rules"
    >
      <el-form-item label="所属字典类别" prop="dictType">
        <el-input v-model="form.dictType" placeholder="请输入内容" disabled />
      </el-form-item>
      <el-form-item label="字典名称" prop="dictLabel">
        <el-input v-model="form.dictLabel" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="字典编码" prop="dictValue">
        <el-input v-model="form.dictValue" placeholder="请输入内容" />
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
  name: 'SubDict',
  data() {
    return {
      form: {
        status: '1'
      },
      rules: {
        dictLabel: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
        ],
        dictValue: [
          { required: true, message: '字典编码不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '字典有效性不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    mode() {
      return this.$attrs.mode || 'add'
    },
    dictType() {
      return this.$attrs.dicttype
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
            dictType: this.dictType,
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
          console.log('_confirm---', this.form)
          // 判读是新增还是编辑
          if (this.mode === 'add') {
            moduleSrv.addDictData(this.form).then((res) => {
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
            moduleSrv.editDictData(this.form).then((res) => {
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
    },
    // 取消
    _cancle() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.sub-dict-class {
  .el-form-item {
    width: 100%;
  }
}
</style>
