<template>
  <el-dialog
    :title="title"
    :visible.sync="isShowDig"
    width="620px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    top="8vh"
  >
    <div class="">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" :disabled="digType === 'view'" label-position="top" label-width="100px" class="demo-ruleForm">
        <el-form-item class="width50" label="模型名称" prop="modelName">
          <el-input v-model="ruleForm.modelName" class="width100" maxlength="50" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item class="width50" label="模型编码" prop="modelCode">
          <el-input v-model="ruleForm.modelCode" class="width100" maxlength="50" disabled placeholder="自动生成，无需输入" />
        </el-form-item>
        <el-form-item class="width100" label="评价模型" prop="indexes">
          <el-button
            type="primary"
            class="add-btn common-action-btn"
            icon="custom-add common-icon"
            :disabled="ruleForm.indexes.length === selectEvaluateList.length"
            @click.stop="comActionAdd"
          >添加指标</el-button>
          <el-table
            :data="ruleForm.indexes"
            style="width: 100%"
            show-summary
            :summary-method="getSummaries"
            align="center"
          >
            <el-table-column
              type="index"
              width="60"
            />
            <el-table-column
              prop="indexName"
              label="*指标名称"
              width="240"
              align="center"
            >
              <template v-slot="{ row }">
                <el-select v-model="row.id" placeholder="请选择评价指标" @change="($event)=> { indexChange($event, row)}">
                  <el-option
                    v-for="item in selectEvaluateList"
                    :key="item.id"
                    :label="item.indexName"
                    :value="item.id"
                    :disabled="ruleForm.indexes.map(item => item.id).includes(item.id)"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="weight"
              label="*权重"
              width="180"
              align="center"
            >
              <template v-slot="{ row }">
                <el-input-number v-model="row.weight" :precision="0" :max="100" :min="1" style="width: 88%" />&emsp;%
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作"
              class-name="table-column-action"
            >
              <template v-slot="{ $index }">
                <span class="action-group">
                  <span class="action-btn" :class="{ 'is-disabled' : digType === 'view' }" @click="ruleForm.indexes.splice($index, 1)">删除</span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item class="width100" label="自动评价设置" prop="autoEvaluateSwitch">
          <el-radio-group v-model="ruleForm.autoEvaluateSwitch">
            <el-radio :label="1">开</el-radio>
            <el-radio :label="0">关</el-radio>
          </el-radio-group>
          <div v-show="ruleForm.autoEvaluateSwitch">
            事件办结后
            <el-input-number v-model="ruleForm.autoEvaluateLimit" size="mini" style="width: 90px;" step-strictly :min="1" :max="99" />
            天，系统自动好评。
          </div>
        </el-form-item>
        <el-form-item class="width100" label="模型说明" prop="modeShow">
          <el-input v-model="ruleForm.modeShow" type="textarea" class="width100" maxlength="500" show-word-limit rows="5" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item class="width100" label="状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
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
        autoEvaluateSwitch: 0,
        autoEvaluateLimit: 15,
        modeShow: '',
        status: 1,
        indexes: []
      },
      rules: {
        modelName: [
          { required: true, message: '请输入模型名称', trigger: 'blur' }
        ],
        modelCode: [
          { required: false, message: '请输入模型编码', trigger: 'blur' }
        ],
        indexes: [
          { required: false, message: '请选择评价模型', trigger: 'change' }
        ],
        autoEvaluateSwitch: [
          { required: true, message: '请选择自动评价设置', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      selectEvaluateList: []
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
          const res = await moduleSrv.getEvaluateModelById({ id: nval.id })
          await this.dealruleFormFn(res.data)
        } else {
          await this.dealruleFormFn(this.ruleForm)
        }
        console.log('this.ruleForm', this.ruleForm)
      }
    }
  },
  async mounted() {
    moduleSrv.getSelectEvaluateList().then((res) => {
      const list = res.data
      if (res.code === 0) {
        this.selectEvaluateList = list
      }
    })
  },
  methods: {
    indexChange(val, row) {
      row.indexName = this.selectEvaluateList.filter(item => item.id === val)[0].indexName
    },
    comActionAdd() {
      this.ruleForm.indexes.push({
        id: '',
        indexName: '',
        weight: 1
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '求和'
          return
        }
        if (index === 1) {
          sums[index] = ''
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ' %'
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    async dealruleFormFn(form) {
      this.ruleForm = Object.assign(JSON.parse(JSON.stringify(this.ruleForm)), { ...form })
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
            //  进一步验证评价模型的数据
            if (!this.ruleForm.indexes.length) {
              this.$message.error('请添加评价指标！')
              return
            }
            //  进一步验证评价模型的数据 指标名称选择了没有
            let flag = false
            this.ruleForm.indexes.forEach(item => {
              if (!item.id) {
                flag = true
              }
            })
            if (flag) {
              this.$message.error('请选择指标名称')
              return false
            }
            let total = 0
            this.ruleForm.indexes.forEach(item => {
              total += Number(item.weight)
            })
            if (total !== 100) {
              this.$message.error('评价模型权重总和必须是100%，请检查')
              return false
            }

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
.common-action-btn {
  position: absolute;
  right: 0;
  top: -40px;
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
