<!--
 * @description 认领--结构-角色选择
 * @date 2020-10-14
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    title="角色选择"
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
      class="select-role-dialog-class"
      :rules="rules"
    >
      <el-form-item label="角色选择" prop="roleId" class="row-one">
        <!-- 方式固定 -->
        <el-select v-model="form.roleId">
          <el-option
            v-for="(item, index) in roleList"
            :key="item.roleId || index"
            :label="item.roleName"
            :value="item.roleId"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </cestc-dialog>
</template>
<script>
export default {
  name: 'SelectRole',
  props: {
    roleList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {},
      rules: {
        roleId: [
          {
            required: true,
            message: '请选择角色',
            trigger: 'blur'
          }
        ]
      }
    }
  },

  methods: {
    // 提交
    _confirm() {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        this.$nextTick(() => {
          this.$emit('confirm', {
            ...this.form
          })
        })
      })
    },
    // 取消关闭弹窗
    _cancle() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.select-role-dialog-class {
  .row-one,
  .el-select {
    width: 100%;
  }
}
</style>
