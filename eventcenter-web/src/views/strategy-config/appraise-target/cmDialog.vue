<!--
 * @description 评价指标定义
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
  >
    <div class="">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" :disabled="digType === 'view'" label-position="top" label-width="100px" class="demo-ruleForm">
        <el-form-item class="width50" label="指标名称" prop="indexName">
          <el-input v-model="ruleForm.indexName" class="width100" maxlength="50" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item class="width50" label="指标编码" prop="indexCode">
          <el-input v-model="ruleForm.indexCode" class="width100" maxlength="50" disabled placeholder="自动生成，无需输入" />
        </el-form-item>
        <el-form-item class="width50" label="评价模式" prop="evaluateMode">
          <el-select v-model="ruleForm.evaluateMode" class="width100">
            <el-option
              v-for="(item, index) in evaluateModeOptions"
              :key="item.dictValue || index"
              :label="item.dictDesc"
              :value="item.dictValue"
            >
              <div class="sdpwrap">
                <div class="">{{ item.dictDesc }}：</div>
                <div v-if="+item.dictValue === 1" class="">
                  <select style="width: 140px; pointer-events: none;" @click.stop>
                    <option label="5" value="5" />
                    <option label="4" value="4" />
                    <option label="3" value="3" />
                    <option label="2" value="2" />
                    <option label="1" value="1" />
                  </select>
                </div>
                <div v-else-if="+item.dictValue === 2" class="">
                  <select style="width: 140px; pointer-events: none;" @click.stop>
                    <option label="10" value="10" />
                    <option label="9" value="9" />
                    <option label="8" value="8" />
                    <option label="7" value="7" />
                    <option label="6" value="6" />
                    <option label="5" value="5" />
                    <option label="4" value="4" />
                    <option label="3" value="3" />
                    <option label="2" value="2" />
                    <option label="1" value="1" />
                  </select>
                </div>
                <div v-else-if="+item.dictValue === 3" class="">
                  <input type="text" style="width: 140px; pointer-events: none;" value="100" @click.stop>
                </div>
                <div v-else-if="+item.dictValue === 4" class="">
                  <el-rate v-model="demoModuleValue1" style="width: 140px; pointer-events: none;" @click.stop />
                </div>
                <div v-else-if="+item.dictValue === 5" class="">
                  <el-radio-group v-model="demoModuleValue2" style="width: 140px; pointer-events: none;" @click.stop>
                    <el-radio :label="3">好</el-radio>
                    <el-radio :label="6">中</el-radio>
                    <el-radio :label="9">差</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="width100" label="指标说明" prop="evaluateShow">
          <el-input v-model="ruleForm.evaluateShow" type="textarea" class="width100" maxlength="500" show-word-limit rows="5" placeholder="请输入内容" />
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
        ],
        evaluateMode: [
          { required: true, message: '请选择评价模式', trigger: 'change' }
        ]
      },
      demoModuleValue1: 0,
      demoModuleValue2: 0
    }
  },
  computed: {
    evaluateModeOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('evaluate_mode')
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
      useNvalObj2.evaluateMode = `${useNvalObj2.evaluateMode}`
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
            if (res.code === SUCCESS_CODE) {
              this.$parent._serch()
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
</style>
