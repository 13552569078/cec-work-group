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
    append-to-body
  >
    <div class="">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :disabled="digType === 'view'"
        label-position="top"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-row
          :gutter="20"
          class="width100"
        >
          <el-col :span="12">
            <el-form-item
              class="width100 count-after"
              label="系统名称"
              prop="platformName"
            >
              <el-input
                v-model="ruleForm.platformName"
                class="width100"
                maxlength="20"
                placeholder="请输入系统名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="width100 count-after"
              label="系统编码"
              prop="platformCode"
            >
              <el-input
                v-model="ruleForm.platformCode"
                class="width100"
                maxlength="8"
                placeholder="请输入系统编码"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          class="width100"
          label="系统类型"
          prop="sysType"
        >
          <el-row class="width100 row-bg source-new" :style="{'height': ruleForm.sourcePlatform ? '80px' : '40px' }">
            <el-col class="col-basic source-label no-margin" :span="6">
              <el-checkbox v-model="ruleForm.sourcePlatform" /> <span class="col-item">来源系统</span>
            </el-col>
            <el-col
              v-show="ruleForm.sourcePlatform"
              class="col-basic source-area"
              :span="18"
            ><div class="source-item">
               <span style="display: flex; align-items: center;">名称缩写 <el-tooltip
                 class="item"
                 effect="light"
                 content="名称缩写，作为事件编码前四位，采用4个大写英文字母表示。"
                 placement="right"
               >
                 <span class="info-tips" style="margin-left: 5px;" />
               </el-tooltip></span>
               <el-input
                 v-model="ruleForm.platformAbbr"
                 :disabled="!ruleForm.sourcePlatform"
                 class="col-item"
                 maxlength="4"
                 placeholder="请输入名称缩写"
               /></div>
              <div class="source-item">
                <span style="display: flex; align-items: center;">评价模型 <el-tooltip
                  class="item"
                  effect="light"
                  content="为该事件发起方配置评价模型，默认系统内置模型：总体满意度50%+处理结果30%+处理时效10%+服务态度10%，事件办结后15天系统自动好评"
                  placement="right"
                >
                  <span class="info-tips" style="margin-left: 5px;" />
                </el-tooltip></span>
                <el-select
                  v-model="ruleForm.evaluateModelId"
                  :disabled="!ruleForm.sourcePlatform"
                  class="col-item"
                >
                  <el-option
                    v-for="(item, index) in modelList"
                    :key="index"
                    :value="item.id"
                    :label="item.modelName"
                  />
                </el-select>
              </div></el-col>
          </el-row>
          <el-row class="width100 row-bg">
            <el-col class="col-basic no-margin" :span="6">
              <el-checkbox v-model="ruleForm.handlePlatform" /> <span class="col-item">处置系统</span>
            </el-col>
            <el-col
              v-show="ruleForm.handlePlatform"
              class="col-basic"
              :span="18"
            ><span>使用部门</span>
              <org-tree-select
                ref="orgTreeSelectRef"
                class="col-item"
                :height="300"
                :select-width="'100%'"
                :pop-width="455"
                size="small"
                medium
                small
                mini
                :tree-data="orgTreeList"
                :default-props="treeProps"
                multiple
                clearable
                collapse-tags
                check-strictly
                :node-key="'id'"
                :checked-keys="defaultOrgSelect"
                :disabled="!ruleForm.handlePlatform"
                @change="changeTreeSelect"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          class="width100"
          label="状态"
          prop="platformStatus"
        >
          <el-radio-group
            v-model="ruleForm.platformStatus"
            class="width100"
          >
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleClose">取 消</el-button>
      <el-button
        v-if="digType === 'add' || digType === 'edit'"
        type="primary"
        @click="_confirm"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import { deepClone } from '@/utils'
import orgTreeSelect from './orgTreeSelect.vue'

export default {
  name: 'CmDialog',
  components: {
    orgTreeSelect
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
      default: () => { }
    }
  },
  data() {
    return {
      isShowDig: false,
      title: '',
      departmentOptions: [
        {
          dictValue: 1,
          dictLabel: '平台1'
        },
        {
          dictValue: 12,
          dictLabel: '平台2'
        }
      ],
      ruleForm: {
        platformCode: '',
        platformName: '',
        platformAbbr: '',
        evaluateModelId: '',
        platformStatus: true,
        sourcePlatform: false,
        handlePlatform: false,
        orgSelect: []
      },
      rules: {
        platformName: [
          { required: true, message: '请输入系统来源名称', trigger: 'blur' }
        ],
        platformCode: [
          { required: true, message: '请输入来源编码', trigger: 'blur' }
        ],
        sysType: [
          { required: true, validator: this.platFormValitor, trigger: ['change', 'blur'] }
        ],
        platformStatus: [
          { required: true, message: '请选择启用状态', trigger: 'blur' }
        ]
      },
      orgTreeList: [],
      defaultOrgSelect: [],
      treeProps: {
        multiple: true,
        value: 'id',
        label: 'name',
        children: 'children',
        checkStrictly: true,
        emitPath: false
      },
      childrenOrgCode: [],
      modelList: [],
      orgCascader: null
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
          this.title = '新增第三方系统'
        } else if (nval === 'view') {
          this.title = '查看第三方系统'
        } else {
          this.title = '编辑第三方系统'
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
      }
    }
  },
  created() {
    this.getOrgTreeList()
    this.getEvaluateModelSelect()
  },
  methods: {
    changeTreeSelect(data) {
      this.ruleForm.orgSelect = data
    },
    platFormValitor(rule, value, callback) {
      const regLetterExp = /^[A-Z]+$/
      if (!this.ruleForm.sourcePlatform && !this.ruleForm.handlePlatform) {
        callback(new Error('请勾选系统类型'))
      }
      if (this.ruleForm.sourcePlatform) {
        if (this.ruleForm.platformAbbr) {
          if (!regLetterExp.test(this.ruleForm.platformAbbr)) {
            callback(new Error('名称缩写请输入大写字母'))
          } else if (this.ruleForm.platformAbbr.length !== 4) {
            callback(new Error('请输入4位名称缩写'))
          }
        } else if (!this.ruleForm.platformAbbr) {
          callback(new Error('请输入名称缩写'))
        }
      }
      if (this.ruleForm.handlePlatform && this.ruleForm.orgSelect && this.ruleForm.orgSelect?.length === 0) {
        callback(new Error('请选择使用部门'))
      }
      callback()
    },
    // 级联选择相关
    selectAllChildOrgs(node) {
      this.childrenOrgCode = []
      this.getChildrenOrgCode(node.children)
      this.ruleForm.orgSelect = [...new Set(this.ruleForm.orgSelect.concat(this.childrenOrgCode))]
    },
    unSelectAllChildOrgs(node) {
      this.childrenOrgCode = []
      this.getChildrenOrgCode(node.children)
      this.ruleForm.orgSelect = this.ruleForm.orgSelect.filter(item => !this.childrenOrgCode.includes(item))
    },
    async dealruleFormFn(useNvalObj) {
      this.ruleForm = deepClone(Object.assign(this.ruleForm, useNvalObj))
      if (useNvalObj.departments?.length) {
        this.defaultOrgSelect = useNvalObj.departments.map(e => e.orgId)
      }
    },
    handleClose(done) {
      this.isShowDig = false
      this.$parent.dialogVisible = false
    },
    async getOrgTreeList() {
      const res = await moduleSrv.getTreeV2WithHaveChild({ })
      if (res.data.length) {
        this.orgTreeList = this.setBlankArrToNull(res.data)
      }
    },
    async getEvaluateModelSelect() {
      const res = await moduleSrv.getEvaluateModelSelect()
      if (res.data.length) {
        this.modelList = res.data
      }
    },

    getChildrenOrgCode(arr) {
      arr.forEach(e => {
        if (e?.children.length) {
          e.children.forEach(j => {
            this.childrenOrgCode.push(j.data.id)
          })
          this.getChildrenOrgCode(e.children)
        }
        if (this.childrenOrgCode.findIndex(i => i === e.data.id) === -1) this.childrenOrgCode.push(e.data.id)
      })
    },
    setBlankArrToNull(arr) {
      arr.forEach(e => {
        if (e?.children?.length) {
          this.setBlankArrToNull(e.children)
        } else {
          e.children = null
        }
      })
      return arr
    },
    // 提交
    _confirm() {
      let serverUrl, tipsuccess, tiperror
      if (this.digType === 'add') {
        serverUrl = moduleSrv.addPlatformInfo
        tipsuccess = '添加成功'
        tiperror = '添加失败'
      } else if (this.digType === 'edit') {
        serverUrl = moduleSrv.updatePlatformInfo
        tipsuccess = '更新成功'
        tiperror = '更新失败'
      }
      try {
        this.$refs['ruleForm'].validate(async(valid) => {
          if (valid) {
            let curDepartments = []
            if (this.ruleForm.orgSelect?.length) {
              const currentNodes = new Set(this.$refs['orgTreeSelectRef'].$refs['tree'].getCheckedNodes().map(e => {
                return {
                  orgCode: e.orgCode,
                  orgId: e.id,
                  orgName: e.name
                }
              }))
              curDepartments = Array.from(currentNodes)
            }
            const { orgSelect, departments, ...currentParam } = this.ruleForm
            console.log(orgSelect, departments)
            const params = {
              ...currentParam,
              departments: curDepartments
            }
            if (this.digType === 'edit') {
              params.id = this.digData.id
            }
            const res = await serverUrl(params)
            if (+res.code === 0) {
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
.row-bg {
  padding: 0 16px;
  margin-bottom: 10px;
  min-height: 40px;
  background: #f9fafe;
  border-radius: 2px;
  display: flex;
  align-items: center;
  &:last-child {
    margin-bottom: 0;
  }
  .col-basic {
    display: flex;
    align-items: center;
  }
  .col-item {
    flex: 1;
    margin-left: 8px;
  }
}
.source-new {
  position: relative;
  height: 80px;
  .source-label {
    position: absolute;
    left: 16px;
    top: 10px;
  }
  .source-area {
    position: absolute;
    right: 12px;
    display: flex;
    flex-direction: column;
  .source-item {
    display: flex;
      width: 398px;
      height: 40px;
      align-items: center;
    }
  }
}

.no-margin {
  margin: 0 !important;
}

.org-tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .org-label {
    max-width: 158px;
  }
  .org-tree-all {
    color: #36a4ff;
    margin-left: 20px;
    width: 101px;
    color: #36a4ff;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
  }
};
::v-deep{
  .count-after {
    .el-input__suffix {
      width: 40px;
    }
  }
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
