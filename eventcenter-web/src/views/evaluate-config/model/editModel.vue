<template>
  <div class="page-wrapper">
    <div class="content">
      <common-title :title="title" />

      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :disabled="digType === 'view'" label-position="top" label-width="100px" class="demo-ruleForm">
        <el-form-item label="模型名称" prop="modelName">
          <el-input v-if="mode!=='view'" v-model="ruleForm.modelName" maxlength="20" placeholder="请输入内容" style="width: 600px;" />
          <div v-else style="width: 600px;">{{ ruleForm.modelName }}</div>
        </el-form-item>
        <el-form-item label="模型编码" prop="modelCode" style="margin-left: 10px;">
          <el-input v-if="mode!=='view'" v-model="ruleForm.modelCode" maxlength="50" disabled placeholder="自动生成，无需输入" style="width: 600px;" />
          <div v-else style="width: 600px;">{{ ruleForm.modelCode }}</div>
        </el-form-item>
        <el-form-item class="width100" label="评价模型" prop="indexes">
          <!-- <el-button
            type="primary"
            class="add-btn common-action-btn"
            icon="custom-add common-icon"
            :disabled="ruleForm.indexes.length === selectEvaluateList.length"
            @click.stop="comActionAdd"
          >添加指标</el-button> -->
          <div v-if="mode!=='view'" :class="['add-item', ruleForm.indexes.length === selectEvaluateList.length? 'add-item-disabled':'']" @click.stop="comActionAdd">
            添加
            <img src="@/assets/add-item-second.png" alt>
          </div>
          <el-table
            :data="ruleForm.indexes"
            style="width: 100%"
            show-summary
            :summary-method="getSummaries"
            :class="'table-' + mode"
          >
            <el-table-column
              type="index"
              width="50"
              align="center"
            >
              <template slot-scope="scope">
                <span style="color: #BDBDBD;">{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              width="820"
            >
              <template slot="header">
                <span class="star" style="color: red;"><template v-if="mode!=='view'">*</template></span>指标名称
              </template>
              <template slot-scope="scope">
                <el-select v-if="mode!=='view'" v-model="scope.row.id" placeholder="请选择评价指标" style="width: 600px;margin-left: 10px;" @change="($event)=> { indexChange($event, scope.row)}">
                  <el-option
                    v-for="item in selectEvaluateList"
                    :key="item.id"
                    :label="item.indexName"
                    :value="item.id"
                    :disabled="ruleForm.indexes.map(item => item.id).includes(item.id)"
                  />
                </el-select>
                <span v-else style="margin-left: 4px;">{{ selectEvaluateList.filter(item => item.id === scope.row.id)[0].indexName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              prop="weight"
            >
              <template slot="header">
                <div style="display: flex; align-items: center;">
                  <span class="star" style="color: red;"><template v-if="mode!=='view'">*</template></span>
                  <span style="margin-right: 5px; display: inline-block;">权重%</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    content="权重总和必须为100%，权重为正整数。"
                    placement="right"
                  >
                    <span class="info-tips" />
                  </el-tooltip>
                </div>
              </template>
              <template slot-scope="scope">
                <el-input-number v-if="mode!=='view'" v-model="scope.row.weight" :precision="0" :max="100" :min="1" style="width: 300px;margin-left: 10px;" />
                <span v-else style="margin-left: 4px;">{{ scope.row.weight }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="mode!=='view'"
              prop="address"
              label="操作"
              class-name="table-column-action"
              width="60"
            >
              <template v-slot="{ $index }">
                <span class="action-group" style="text-align: center;">
                  <span class="action-btn" :class="{ 'is-disabled' : digType === 'view' }" @click="ruleForm.indexes.splice($index, 1)">删除</span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item class="width100" label="自动评价设置" prop="autoEvaluateSwitch">
          <div class="auto-switch">
            <el-radio-group v-model="ruleForm.autoEvaluateSwitch">
              <el-radio :label="1">开</el-radio>
              <el-radio :label="0">关</el-radio>
            </el-radio-group>
            <div v-show="ruleForm.autoEvaluateSwitch" class="swith-tip">
              事件办结后
              <el-input-number v-if="mode!=='view'" v-model="ruleForm.autoEvaluateLimit" style="width: 184px;margin-left: 8px; margin-right: 8px;" step-strictly :min="1" :max="99" />
              <span v-else style="margin-left: 8px; margin-right: 8px;">{{ ruleForm.autoEvaluateLimit }}</span>
              天，系统自动好评
            </div>
          </div>
        </el-form-item>
        <el-form-item class="width100" label="模型说明" prop="modeShow">
          <el-input v-if="mode!=='view'" v-model="ruleForm.modeShow" type="textarea" class="width100" maxlength="500" show-word-limit rows="5" placeholder="请输入内容" style="width: 600px;" />
          <span v-else style="width: 600px;">{{ ruleForm.modeShow }}</span>
        </el-form-item>
        <el-form-item class="width100" label="状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <el-button
        v-if="['add', 'edit'].includes(digType)"
        v-loading="loading"
        type="primary"
        @click.stop="_confirm"
      >确定</el-button>
      <el-button v-if="['add', 'edit'].includes(digType)" @click.stop="_goback">取消</el-button>
      <el-button v-if="['view'].includes(digType)" @click.stop="_goback">返回</el-button>
    </div>
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'

export default {
  name: 'PreAcceptedInfo',
  data() {
    return {
      mode: 'view', // 默认是详情模式，只查看
      loading: false, // 按钮是否可点击

      digType: '',
      digData: {},
      isShowDig: false,
      title: '',
      ruleForm: {
        modelName: '',
        modelCode: '',
        autoEvaluateSwitch: 1,
        autoEvaluateLimit: 15,
        modeShow: '',
        status: 1,
        indexes: []
      },
      selectEvaluateList: []
    }
  },
  computed: {
    rules() {
      return {
        modelName: [
          { required: this.mode !== 'view', message: '请输入模型名称', trigger: 'blur' }
        ],
        // modelCode: [
        //   { required: false, message: '请输入模型编码', trigger: 'blur' }
        // ],
        // indexes: [
        //   { required: false, message: '请选择评价模型', trigger: 'change' }
        // ],
        autoEvaluateSwitch: [
          { required: this.mode !== 'view', message: '请选择自动评价设置', trigger: 'change' }
        ],
        status: [
          { required: this.mode !== 'view', message: '请选择状态', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    digType: {
      deep: true,
      immediate: true,
      handler(nval) {
        this.mode = nval
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
  created() {
    this.digType = this.$route.query.digType
    this.digData = {
      id: this.$route.query.id
    }
  },
  mounted() {
    moduleSrv.getSelectEvaluateList().then((res) => {
      const list = res.data
      if (res.code === 0) {
        this.selectEvaluateList = list
      }
    })
    this.$nextTick(() => {
      this.$refs.ruleFormRef.clearValidate()
    })
  },
  methods: {
    // 返回列表或上一级
    _goback() {
      // this.$router.push({
      //   path: '/evaluate-config/model'
      // })
      this.$router.go(-1)
    },

    indexChange(val, row) {
      row.indexName = this.selectEvaluateList.filter(item => item.id === val)[0].indexName
    },
    comActionAdd() {
      if (this.ruleForm.indexes.length === this.selectEvaluateList.length) return
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
          sums[index] = ''
          return
        }
        if (index === 1) {
          sums[index] = '合计'
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
          sums[index] += ''
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
        this.$refs['ruleFormRef'].validate(async(valid) => {
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
            this.loading = true
            const res = await serverUrl(params)
            if (res.code === 0) {
              this.loading = false
              this.$message.success(tipsuccess)
              this.isShowDig = false
              this._goback()
            } else {
              this.loading = false
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
.page-wrapper {
  height: 100%;
  background-color: #fff;
  position: relative;
  .content {
    padding: 20px 20px 0;
    overflow-y: auto;
    height: calc(100% - 80px);
    .demo-ruleForm {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin-top: 20px;
      }
      .auto-switch {
        height: 48px;
        background: #F9FAFE;
        border-radius: 2px;
        padding-left: 20px;
        display: flex;
        align-items: center;
        width: 600px;
        .swith-tip {
          margin-left: 24px;
          font-size: 14px;
          font-weight: 400;
          color: #4B4B4B;
        }
      }
      .common-action-btn {
        position: absolute;
        right: 0;
        top: -40px;
      }
      .width30 {
        width: 35%;
        margin-right: 20px;
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
      .add-item {
        width: 56px;
        height: 30px;
        display: flex;
        align-items: center;
        position: absolute;
        right: 0;
        top: -38px;
        cursor: pointer;
        img {
          margin-left: 8px;
          width: 16px;
          height: 16px;
          margin-top: 2px;
        }
      }
      .add-item-disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
  }
  .footer {
    position: absolute;
    bottom:0;
    left: 0;
    width: 100%;
    height: 64px;
    box-shadow: 0px -2px 7px 0px rgba(0, 0, 0, 0.06);
    padding: 0 20px;
    display: flex;
    align-items: center;
  }
}
.star {
  color: red;
  margin-right: 4px;
  position: relative;
  top: 2px;
}
::v-deep {
  .el-table__footer-wrapper {
    .cell {
      margin-left: 10px;
    }
  }
  .el-table .cell, .el-table th>.cell {
    padding-left: 0;
    padding-right: 0;
  }
  .el-input-number__decrease {
    border-right-color: #E7E7E7;
  }
  .el-input-number__increase {
    border-left-color: #E7E7E7;
  }
  .el-textarea__inner {
    height: 96px;
  }
  .el-button+.el-button {
    margin-left: 16px;
  }

  .el-table__footer-wrapper tbody td, .el-table__header-wrapper tbody td {
    background-color: #ffffff;
    color: #4B4B4B;
  }
  .table-view {
    .el-table__footer-wrapper tbody td {
      .cell {
        margin-left: 4px;
      }
    }
  }
}
</style>
