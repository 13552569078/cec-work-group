<!--
 * @description 流程模型管理--新增流程模型
 * @date 2020-09-08
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    title="新增流程模型"
    width="600px"
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
      class="process-model-add-class"
      :rules="rules"
    >
      <el-form-item label="流程模型名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input
          v-model="form.desc"
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
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
export default {
  name: 'AddProcessModelDialog',
  data() {
    return {
      form: {},
      rules: {
        name: [
          { required: true, message: '流程模型名称不能为空', trigger: 'blur' }
        ],
        desc: [{ required: true, message: '描述不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    '$attrs.visible': function(val) {
      // 打开弹窗，先把表单清空
      if (val) {
        this.form = {}
        this.$refs.form && this.$refs.form.clearValidate()
      }
    }
  },
  methods: {
    // 提交
    _confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          moduleSrv.addModel(this.form).then((res) => {
            if (res.code === SUCCESS_CODE) {
              // 添加成功，跳转到绘制流程
              const id = res.data
              this.$router.push({
                path: '/process/process-model/draw',
                query: {
                  id: id
                }
              })
            } else {
              this.$message({
                message: res.message || '操作失败',
                type: 'error'
              })
            }
          })
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
@import '@/styles/global-third-sys-dialog.scss';

.process-model-add-class {
  .el-form-item {
    width: 100%;
  }
}
</style>
