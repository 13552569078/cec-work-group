<!--
 * @description 流程管理--角色表单
 * @date 2020-09-13
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    title="新增角色"
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
      class="role-dialog-class"
      :rules="rules"
    >
      <el-form-item label="处置级别" prop="orgType">
        <el-select v-model="form.orgType">
          <el-option
            v-for="(item, index) in orgType"
            :key="item.dictValue || index"
            :label="item.dictDesc"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="roleIds">
        <el-select v-model="roleIds" multiple :disabled="!form.orgType" filterable>
          <el-option
            v-for="(item, index) in roleList"
            :key="item.id || index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
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
  name: 'RoleDialog',
  data() {
    const roleIdNotEmpty = (rule, value, callback) => {
      if (!this.roleIds) {
        return callback(new Error('角色不能为空'))
      } else {
        callback()
      }
    }
    return {
      form: {
        optStatus: '1'
      },
      rules: {
        orgType: [
          { required: true, message: '处置级别不能为空', trigger: 'blur' }
        ],
        roleIds: [
          {
            required: true,
            validator: roleIdNotEmpty,
            trigger: 'blur'
          }
        ],
        optStatus: [
          { required: true, message: '是否有效不能为空', trigger: 'blur' }
        ]
      },
      roleIds: null,
      roleList: []
    }
  },
  computed: {
    mode() {
      return this.$attrs.mode
    },
    title() {
      const obj = {
        add: '新增角色',
        edit: '编辑角色'
      }
      return obj[this.mode]
    },
    rowdata() {
      return this.$attrs.rowdata
    },
    currentnode() {
      return this.$attrs.currentnode
    },
    orgType() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('org_type').filter(item => item.parentValue === '0')
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
          const { id, roleId, optStatus, orgType } = this.rowdata
          this.form.id = id
          this.roleIds = roleId.split(',').map((item) => item * 1)
          this.$set(this.form, 'optStatus', optStatus)
          this.$set(this.form, 'orgType', orgType)
        }
      }
    },
    'form.orgType': function(val) {
      if (this.mode !== 'edit') {
        this.roleIds = null
      }
      this.getRoleList()
    }
  },

  methods: {
    getRoleList() {
      const params = {
        orgType: this.form.orgType
      }
      moduleSrv
        .getRoleByOrgType(params)
        .then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.roleList = res.data
          }
        })
        .catch(() => {
          this.$message({
            message: '角色查询失败',
            type: 'error'
          })
        })
    },
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
          // 把 ids 转换为字符串
          this.form.roleId = this.roleIds.join(',')
          // 根据类型，选择调用不同的接口
          if (this.mode === 'add') {
            moduleSrv.addProcessTaskRole(this.form).then((res) => {
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
            moduleSrv.editProcessTaskRole(this.form).then((res) => {
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
<style lang="scss">
.role-dialog-class {
  .el-form-item {
    width: 100%;
    .el-select {
      width: 100%;
    }
  }
}
</style>
