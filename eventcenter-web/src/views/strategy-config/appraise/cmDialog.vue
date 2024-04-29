<!--
 * @description 任务中心-待办任务
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
        <el-form-item class="width50" label="模型名称" prop="modelName">
          <el-input v-model="ruleForm.modelName" class="width100" maxlength="50" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item class="width50" label="模型编码" prop="modelCode">
          <el-input v-model="ruleForm.modelCode" class="width100" maxlength="50" disabled placeholder="自动生成，无需输入" />
        </el-form-item>
        <el-form-item class="width50" label="平台系统" prop="sysCode">
          <el-select v-model="ruleForm.sysCode" class="width100" clearable placeholder="请选择" @change="changeSearchTupuOriginalSysFn">
            <el-option
              v-for="item in eventPlatformOptions"
              :key="item.dictValue"
              :label="item.dictDesc"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="width50" label="事件类型" prop="useEventTypeIds">
          <el-select v-model="ruleForm.useEventTypeIds" class="width100" multiple clearable placeholder="请选择">
            <el-option
              v-for="item in eventTypeWhhOptions"
              :key="item.eventTypeCode"
              :label="item.eventTypeName"
              :value="`${item.id}`"
              :disabled="item.availableFlag"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="width50" label="评价指标" prop="useEvaluateIndexIds">
          <el-select v-model="ruleForm.useEvaluateIndexIds" class="width100" multiple clearable placeholder="请选择">
            <el-option
              v-for="item in pingjiazhibiaoOptions"
              :key="item.id"
              :label="item.indexName"
              :value="`${item.id}`"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="width100" label="模型说明" prop="modeShow">
          <el-input v-model="ruleForm.modeShow" type="textarea" class="width100" maxlength="500" show-word-limit rows="5" placeholder="请输入内容" />
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
        modelName: '',
        modelCode: '',
        sysCode: '',
        useEventTypeIds: [],
        eventTypeIds: '',
        useEvaluateIndexIds: [],
        evaluateIndexIds: '',
        modeShow: ''
      },
      rules: {
        modelName: [
          { required: true, message: '请输入模型名称', trigger: 'blur' }
        ],
        modelCode: [
          { required: false, message: '请输入模型编码', trigger: 'blur' }
        ],
        sysCode: [
          { required: true, message: '请选择平台系统', trigger: 'change' }
        ],
        useEventTypeIds: [
          { required: false, message: '请选择事件类型', trigger: 'change' }
        ],
        useEvaluateIndexIds: [
          { required: true, message: '请选择评价指标', trigger: 'change' }
        ]
      },
      eventTypeWhhOptions: [],
      pingjiazhibiaoOptions: []
    }
  },
  computed: {
    eventPlatformOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_platform')
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
          this.title = '新增评价模型'
        } else if (nval === 'view') {
          this.title = '查看评价模型'
        } else {
          this.title = '编辑评价模型'
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
  async mounted() {
    const params2 = {
      pageNum: 1,
      pageSize: 10000
    }
    moduleSrv.getAppraiseTargetList(params2).then((res) => {
      const { list = [] } = res.data
      if (res.code === SUCCESS_CODE) {
        this.pingjiazhibiaoOptions = list
      }
    })
  },
  methods: {
    async changeSearchTupuOriginalSysFn(val) {
      this.eventTypeWhhOptions = []
      this.ruleForm.useEventTypeIds = []
      if (val === '' || val === null || val === undefined) return
      const res = await moduleSrv.getSelectEventTypeIdBySysCode({ sysCode: val })
      this.eventTypeWhhOptions = res.data || []
    },
    async dealruleFormFn(useNvalObj) {
      const useNvalObj2 = JSON.parse(JSON.stringify(useNvalObj))
      if (this.digType === 'edit' || this.digType === 'view') {
        await this.changeSearchTupuOriginalSysFn(useNvalObj2.sysCode)
        if (useNvalObj2.eventTypeIds === '' || useNvalObj2.eventTypeIds === null) {
          useNvalObj2.useEventTypeIds = []
        } else {
          useNvalObj2.useEventTypeIds = useNvalObj2.eventTypeIds.split(',')
        }
        useNvalObj2.useEvaluateIndexIds = useNvalObj2.evaluateIndexIds.split(',')
        this.ruleForm = Object.assign(JSON.parse(JSON.stringify(this.ruleForm)), useNvalObj2)
      } else {
        this.ruleForm = Object.assign(JSON.parse(JSON.stringify(this.ruleForm)), useNvalObj2)
      }
    },
    handleClose(done) {
      this.isShowDig = false
      this.$parent.dialogVisible = false
    },
    // 提交
    _confirm() {
      let serverUrl, tipsuccess, tiperror
      if (this.digType === 'add') {
        serverUrl = moduleSrv.postAppraiseModuleAdd
        tipsuccess = '添加成功'
        tiperror = '添加失败'
      } else if (this.digType === 'edit') {
        serverUrl = moduleSrv.postAppraiseModuleUpdate
        tipsuccess = '更新成功'
        tiperror = '更新失败'
      }
      try {
        this.$refs['ruleForm'].validate(async(valid) => {
          if (valid) {
            this.ruleForm.eventTypeIds = this.ruleForm.useEventTypeIds.join(',')
            this.ruleForm.evaluateIndexIds = this.ruleForm.useEvaluateIndexIds.join(',')
            const params = {
              ...this.ruleForm
            }
            const res = await serverUrl(params)
            if (res.code === SUCCESS_CODE) {
              this.$parent.resultList()
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
</style>
