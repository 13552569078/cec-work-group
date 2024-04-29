<!--
 * @description 策略配置弹窗
 * @date 2020-08-18
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    :title="matchTitle"
    width="600px"
    append-to-body
    v-on="$listeners"
    @confirm="_confirm"
    @cancle="_cancle"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-position="top"
      class="setting-form-class"
    >
      <el-form-item label="平台系统" prop="sysCode" class="custorm-label">
        <el-select v-model="form.sysCode" placeholder="请选择平台系统" @change="createSecretFn()">
          <el-option
            v-for="(item, index) in eventPlatformOptions"
            :key="item.id || index"
            :label="item.dictDesc"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="密钥" prop="apiAuth">
        <el-input v-model="form.apiAuth" placeholder="请输入内容" disabled />
      </el-form-item>

      <el-form-item v-show="0" label="密钥" prop="secret">
        <el-input v-model="form.secret" placeholder="请输入内容" disabled />
      </el-form-item>

      <el-form-item label="是否启用" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </cestc-dialog>
</template>

<script>
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'SettingDialog',
  components: {
  },
  props: {
    eventPlatformOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        sysCode: '',
        apiAuth: '',
        secret: '',
        status: 1
      },
      rules: {
        sysCode: [
          { required: true, message: '平台系统不能为空', trigger: 'change' }
        ],
        apiAuth: [
          { required: true, message: '密钥不能为空', trigger: 'blur' }
        ],
        secret: [
          { required: true, message: '密钥不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '是否启用不能为空', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    // 弹窗类型
    mode() {
      return this.$attrs.mode
    },
    matchTitle() {
      const key = this.mode || 'add'
      const obj = {
        add: '新增请求鉴权配置',
        edit: '修改请求鉴权配置'
      }
      return obj[key]
    }
  },
  watch: {
    // 监听弹窗开启关闭动作，每当开启后，需要更新级联绑定数据
    '$attrs.visible': function(val) {
      if (!val) {
        this.$refs['form'].resetFields()
        this.form = {
          sysCode: '',
          apiAuth: '',
          secret: '',
          status: 1
        }
      } else {
        this.updateForm()
      }
    }
  },
  methods: {
    createSecretFn() {
      const params = {
        sysCode: this.form.sysCode
      }
      moduleSrv.postGenerateSecret(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.form.apiAuth = res.data.apiAuth
          this.form.secret = res.data.secret
        } else {
          console.warn('postGenerateSecret 接口报错')
        }
      })
    },
    // 更新级联选择数据，修复回显问题
    updateForm() {
      const editData = this.$attrs.editingdata
      const mode = this.mode
      if (mode === 'edit') {
        const {
          id = '',
          sysCode = '',
          apiAuth = '',
          secret = '',
          status = 0
        } = editData
        // 编辑的时候需要 id
        this.form.id = id
        // 回显其他字段值
        this.$set(this.form, 'sysCode', sysCode)
        this.$set(this.form, 'apiAuth', apiAuth)
        this.$set(this.form, 'secret', secret)
        this.$set(this.form, 'status', status)
      } else {
        this.form = {
          sysCode: '',
          apiAuth: '',
          secret: '',
          status: 1
        }
      }
    },
    _cancle() {
      this.$emit('update:visible', false)
    },
    // 确认按钮触发
    _confirm() {
      this.$refs['form'].validate((valid) => {
        const mode = this.mode
        if (valid) {
          // 校验成功, 区分是新增还是编辑
          if (mode === 'edit') {
            moduleSrv.postAuthPageUpdate(this.form).then((res) => {
              if (res.code === SUCCESS_CODE) {
                this.$emit('update')
                this._cancle()
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: res.message || '操作失败！',
                  type: 'error'
                })
              }
            })
          } else {
            moduleSrv.postAuthPageAdd(this.form).then((res) => {
              if (res.code === SUCCESS_CODE) {
                this.$emit('update')
                this._cancle()
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
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
@import '@/styles/global-third-sys-dialog.scss';
.setting-form-class {
    .el-select {
        width: 100%;
    }
    .el-cascader {
        width: 100%;
    }
    .custorm-label {
        margin-bottom: 10px;
    }
}
</style>
