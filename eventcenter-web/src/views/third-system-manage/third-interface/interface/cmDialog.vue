<!--
 * @description 第三方接口配置
 * @date 2020-09-08
 * @author lism
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="isShowDig"
    width="600px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    append-to-body
  >
    <div class="">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" :disabled="digType === 'view'" label-position="top" label-width="100px" class="demo-ruleForm">
        <el-form-item class="width100 count-after" label="接口编码" prop="apiCode">
          <el-input v-model="ruleForm.apiCode" class="width100" :disabled="digType === 'edit'" maxlength="20" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item class="width100 count-after" label="接口名称" prop="apiName">
          <el-input v-model="ruleForm.apiName" class="width100" :disabled="digType === 'edit'" maxlength="20" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item class="width100" label="对接系统名称" prop="sysCode">
          <el-select v-model="ruleForm.sysCode" class="width100" :disabled="digType === 'edit'" placeholder="请选择">
            <el-option
              v-for="item in eventPlatformOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="width100 count-after" label="接口地址" prop="url">
          <el-input v-model="ruleForm.url" class="width100" maxlength="200" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item class="width100 count-after" label="请求方式" prop="requestMethod">
          <el-input v-model="ruleForm.requestMethod" class="width100" maxlength="10" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item class="width100" label="备注" prop="comment">
          <el-input v-model="ruleForm.comment" class="width100" type="textarea" rows="5" maxlength="200" show-word-limit placeholder="请输入内容" />
        </el-form-item>
        <el-form-item class="width100" label="请求报文（样例报文）" prop="requestData">
          <el-input v-model="ruleForm.requestData" class="width100" type="textarea" :autosize="{ minRows: 5 }" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item class="width100" label="响应报文（样例报文）" prop="responeData">
          <el-input v-model="ruleForm.responeData" class="width100" type="textarea" :autosize="{ minRows: 5 }" placeholder="请输入内容" />
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
    },
    selectedThirdSystem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isShowDig: false,
      title: '',
      ruleForm: {
        apiCode: '',
        apiName: '',
        sysCode: '',
        url: '',
        requestMethod: '',
        comment: '',
        requestData: '',
        responeData: ''
      },
      rules: {
        apiCode: [
          { required: true, message: '请输入接口编码', trigger: 'blur' }
        ],
        apiName: [
          { required: true, message: '请输入接口名称', trigger: 'blur' }
        ],
        sysCode: [
          { required: true, message: '请选择对接系统名称', trigger: 'change' }
        ],
        url: [
          { required: true, message: '请输入接口地址', trigger: 'blur' }
        ],
        requestMethod: [
          { required: true, message: '请输入请求方式', trigger: 'blur' }
        ],
        comment: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        requestData: [
          { required: true, message: '请输入请求报文（样例报文）', trigger: 'blur' }
        ],
        responeData: [
          { required: true, message: '请输入响应报文（样例报文）', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    eventPlatformOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getThirdSystemList
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
          this.title = '新增接口配置'
        } else if (nval === 'view') {
          this.title = '查看接口配置'
        } else {
          this.title = '编辑接口配置'
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
          this.ruleForm.sysCode = this.selectedThirdSystem.platformCode === '-999' ? '' : this.selectedThirdSystem.platformCode
        }
        console.log('this.ruleForm', this.ruleForm)
      }
    }
  },

  methods: {
    async dealruleFormFn(useNvalObj) {
      // const res = await moduleSrv.getBusApiById(useNvalObj)
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
        serverUrl = moduleSrv.busApiAdd
        tipsuccess = '添加成功'
        tiperror = '添加失败'
      } else if (this.digType === 'edit') {
        serverUrl = moduleSrv.busApiUpdate
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
              if (this.digType === 'add') {
                this.$emit('changeTreeSelect', { platformCode: this.ruleForm.sysCode })
              }
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
@import '@/styles/global-third-sys-dialog.scss';

.demo-ruleForm {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}
::v-deep{
  .count-after {
    .el-input__suffix {
      width: 54px;
    }
  }
}
.width50 {
  width: 48%;
}
.width100 {
  width: 100%;
}
</style>
