<template>
  <el-dialog
    :title="title"
    :visible.sync="isShowDig"
    width="600px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    custom-class="cestc-dialog"
  >
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" :disabled="digType === 'view'" label-position="top" class="demo-ruleForm">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="指标名称" prop="indexName">
            <el-input v-model="ruleForm.indexName" class="width100" maxlength="20" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="指标编码" prop="indexCode">
            <el-input v-model="ruleForm.indexCode" class="width100" maxlength="50" disabled placeholder="自动生成，无需输入" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="指标说明" prop="evaluateShow">
            <el-input v-model="ruleForm.evaluateShow" class="width100" type="textarea" maxlength="500" show-word-limit rows="5" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button v-if="digType === 'add' || digType === 'edit'" type="primary" @click="_confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'

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
    }
  },
  data() {
    return {
      isShowDig: false,
      title: '',
      ruleForm: {
        indexName: '',
        indexCode: '',
        evaluateMode: '',
        evaluateShow: ''
      },
      rules: {
        indexName: [
          { required: true, message: '请输入指标名称', trigger: 'blur' }
        ],
        indexCode: [
          { required: false, message: '请输入指标编码', trigger: 'blur' }
        ]
      },
      demoModuleValue1: 0,
      demoModuleValue2: 0
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
          this.title = '新增评价指标'
        } else if (nval === 'view') {
          this.title = '查看评价指标'
        } else {
          this.title = '编辑评价指标'
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
      const useNvalObj2 = JSON.parse(JSON.stringify(useNvalObj))
      this.ruleForm = Object.assign(JSON.parse(JSON.stringify(this.ruleForm)), useNvalObj2)
    },
    handleClose(done) {
      this.isShowDig = false
      this.$parent.dialogVisible = false
    },
    // 提交
    _confirm() {
      let serverUrl, tipsuccess, tiperror
      if (this.digType === 'add') {
        serverUrl = moduleSrv.postAppraiseTargetAdd
        tipsuccess = '添加成功'
        tiperror = '添加失败'
      } else if (this.digType === 'edit') {
        serverUrl = moduleSrv.postAppraiseTargetUpdate
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
            if (res.code === 0) {
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
.width80 {
  width: 80%;
}
.width20 {
  width: 20%;
}
.sdpwrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
::v-deep {
  .el-form--label-top .el-form-item__label {
    padding: 0;
  }
}
</style>
