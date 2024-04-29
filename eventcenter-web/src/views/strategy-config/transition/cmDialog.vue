<!--
 * @description 要素转换配置
 * @date 2020-09-08
 * @author lism
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="isShowDig"
    width="660px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" :disabled="digType === 'view'" label-position="top" label-width="100px" class="demo-ruleForm">
        <el-form-item class="width100" label="系统来源" prop="originalSysCode">
          <el-select v-model="ruleForm.originalSysCode" class="width100" :disabled="digType === 'edit'" placeholder="请选择">
            <el-option
              v-for="item in eventPlatformOptions"
              :key="item.dictValue"
              :label="item.dictDesc"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="width100" label="转换类型" prop="businessType">
          <el-select v-model="ruleForm.businessType" class="width100" :disabled="digType === 'edit'" placeholder="请选择">
            <el-option
              v-for="item in businessTypeOptions"
              :key="item.dictValue"
              :label="item.dictDesc"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="width100" label="字段类型" prop="fieldType">
          <el-select v-model="ruleForm.fieldType" class="width100" :disabled="digType === 'edit'" placeholder="请选择">
            <el-option
              v-for="item in fieldTypeOptions"
              :key="item.dictValue"
              :label="item.dictDesc"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="width50" label="值名称" prop="originalName">
          <el-input v-model="ruleForm.originalName" class="width100" maxlength="30" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item class="width50" label="转换后值名称" prop="replaceName">
          <el-input v-model="ruleForm.replaceName" class="width100" maxlength="30" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item class="width50" label="字段值" prop="originalValue">
          <el-input v-model="ruleForm.originalValue" class="width100" maxlength="30" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item class="width50" label="转换后字段值" prop="replaceValue">
          <el-input v-model="ruleForm.replaceValue" class="width100" maxlength="30" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button v-if="digType === 'add' || digType === 'edit'" type="primary" @click="_confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'CmDialog',
  components: {
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    digType: {
      type: String,
      default: ''
    },
    digData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isShowDig: false,
      title: '',
      ruleForm: {
        originalSysCode: '',
        businessType: '',
        fieldType: '',
        originalField: '',
        replaceField: '',
        originalName: '',
        replaceName: '',
        originalValue: '',
        replaceValue: '',
        sysFlag: ''
      },
      rules: {
        originalSysCode: [
          { required: true, message: '请选择系统来源', trigger: 'change' }
        ],
        businessType: [
          { required: true, message: '请选择转换类型', trigger: 'change' }
        ],
        fieldType: [
          { required: true, message: '请选择字段类型', trigger: 'change' }
        ],
        originalField: [
          { required: true, message: '请输入字段编码', trigger: 'blur' }
        ],
        replaceField: [
          { required: true, message: '请输入转换后字段编码', trigger: 'blur' }
        ],
        originalName: [
          { required: false, message: '请输入值名称', trigger: 'blur' }
        ],
        replaceName: [
          { required: false, message: '请输入转换后值名称', trigger: 'blur' }
        ],
        originalValue: [
          { required: true, message: '请输入字段值', trigger: 'blur' }
        ],
        replaceValue: [
          { required: true, message: '请输入转换后字段值', trigger: 'blur' }
        ],
        sysFlag: [
          { required: true, message: '请选择请求系统', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    eventPlatformOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_platform')
    },
    businessTypeOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('businessType')
    },
    fieldTypeOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('fieldType')
    }
  },
  watch: {
    dialogVisible: {
      deep: true,
      immediate: true,
      handler(nval) {
        this.$nextTick(() => {
          this.isShowDig = nval
          if (this.isShowDig) {
            this.$nextTick(() => {
              this.$refs['ruleForm'].clearValidate()
            })
          }
        })
      }
    },
    digType: {
      deep: true,
      immediate: true,
      handler(nval) {
        if (nval === 'add') {
          this.title = '新增转换配置'
        } else if (nval === 'view') {
          this.title = '查看转换配置'
        } else {
          this.title = '编辑转换配置'
        }
      }
    },
    digData: {
      deep: true,
      immediate: true,
      async handler(nval) {
        // 遍历对象，将null 改成 ''
        for (const val in nval) {
          nval[val] = nval[val] === null ? '' : nval[val]
        }
        if (this.digType === 'view' || this.digType === 'edit') {
          await this.dealruleFormFn(nval)
        } else {
          await this.dealruleFormFn(this.ruleForm)
        }
        console.log('this.ruleForm', this.ruleForm)
      }
    }
  },

  methods: {
    async dealruleFormFn(useNvalObj) {
      this.ruleForm = Object.assign(JSON.parse(JSON.stringify(this.ruleForm)), useNvalObj)
    },
    handleClose(done) {
      this.isShowDig = false
      this.$parent.dialogVisible = false
    },
    // 提交
    _confirm() {
      let serverUrl, tipsuccess, tiperror
      if (this.digType === 'add') {
        serverUrl = moduleSrv.busValuesConfigAdd
        tipsuccess = '添加成功'
        tiperror = '添加失败'
      } else if (this.digType === 'edit') {
        serverUrl = moduleSrv.busValuesConfigUpdate
        tipsuccess = '更新成功'
        tiperror = '更新失败'
      }
      try {
        this.$refs['ruleForm'].validate(async(valid) => {
          if (valid) {
            const params = {
              ...this.ruleForm
            }
            const res = await serverUrl(params)
            if (res.code === SUCCESS_CODE) {
              this.$parent._search()
              this.$message.success(tipsuccess)
              this.isShowDig = false
              this.$parent.dialogVisible = false
            } else {
              this.$message.error(tiperror)
            }
          } else {
            return false
          }
        })
      } catch (e) {
        console.log(e)
        this.$message.error(tiperror)
      }
    }
  }
}
</script>
<style scoped lang="scss">
.demo-ruleForm {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}
.width50 {
  width: 48%;
}
.width100 {
  width: 100%;
}

</style>
