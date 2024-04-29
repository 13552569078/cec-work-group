<template>
  <div class="event-leaf">
    <div v-if="busiType === '1'" class="header">
      <div class="setp-wrap">
        <div class="setp1 setp" />
        <div class="setp2 setp" :class="{ 'active': setp === 2 }" />
      </div>
    </div>
    <div class="container">
      <div v-show="setp === 1" class="step1-containter">
        <el-form ref="setp1FormRef" :model="setp1Form" :rules="setp1Rules" label-position="top" class="event-type-class">
          <el-row :gutter="0">
            <el-col :span="12">
              <el-form-item label="事件类型名称" prop="name">
                <el-input v-model="setp1Form.name" class="w600" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="事件类型编码" prop="code">
                <el-input v-model="setp1Form.code" :disabled="doSave === 1" class="w600" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="0">
            <el-col :span="12">
              <el-form-item label="是否联动指挥处置" prop="dispatchDeal">
                <el-radio-group v-model="setp1Form.dispatchDeal" :disabled="level !== 1">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否网格处置">
                <el-radio-group v-model="setp1Form.gridDeal">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="0">
            <el-col v-if="speType" :span="12">
              <el-form-item label="专项类型" prop="speType">
                <el-cascader v-if="setp1Form.dispatchDeal === 0" key="spetypeTree" v-model="setp1Form.speType" class="w600" :options="speTypeOptions" :props="{multiple: true,label:'dictDesc',value:'dictValue'}" />
                <el-cascader v-if="setp1Form.dispatchDeal === 1" key="ldzhspetypeTree" v-model="setp1Form.speType" class="w600" :options="ldzh_speTypeOptions" :props="{multiple: true,label:'dictDesc',value:'dictValue'}" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-row :gutter="6">
                <el-col :span="17">
                  <el-form-item label="处置时限" prop="limitTime">
                    <el-input v-model="setp1Form.limitTime" />
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label=" ">
                    <el-select v-model="setp1Form.limitTimeunit" placeholder="请选择" style="width:154px;" @change="changeTimelimitUnit">
                      <el-option
                        v-for="item in limitTimeunitList"
                        :key="item.dictValue"
                        :label="item.dictDesc"
                        :value="item.dictValue"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>

          </el-row>

          <el-row :gutter="0">
            <el-col :span="12">
              <el-form-item label="立案条件" prop="caseCondition">
                <el-input v-model="setp1Form.caseCondition" maxlength="50" class="w600" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结案标准" prop="closureCriteria">
                <el-input v-model="setp1Form.closureCriteria" maxlength="50" class="w600" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="管理依据" prop="managementBasis">
                <el-input v-model="setp1Form.managementBasis" maxlength="50" class="w600" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="管理流程" prop="managementProcess">
                <el-input v-model="setp1Form.managementProcess" maxlength="50" class="w600" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型描述" prop="detail">
                <el-input v-model="setp1Form.detail" maxlength="50" class="w600" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div v-show="setp === 2 && busiType === '1'" class="step2-containter">
        <el-form ref="setp2FormRef" :model="setp2Form" :rules="setp1Rules" label-position="top" class="event-type-class">
          <div class="label-wrap">智能事件智能过滤算法</div>
          <el-row :gutter="20" class="mb-4">
            <el-col :span="20">
              <el-form-item label="是否启用算法">
                <el-radio-group v-model="setp2Form.useAlgorithm">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="label-wrap">
            配置事件去重策略
            <el-switch
              v-model="strategyIndexListState"
              active-color="#4CC09E"
              inactive-color="#BDBDBD"
              :active-text="strategyIndexListState ? '启用' : '停用'"
              :active-value="true"
              :inactive-value="false"
              class="switch-wrap"
              @change="changeAllStatus(strategyIndexListState)"
            />
          </div>
          <el-table
            ref="multipleTable"
            :data="setp2Form.strategyIndexList"
            tooltip-effect="dark"
            style="width: 100%"
            class="mb-24"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="index" width="55" class-name="table-column-index" />
            <el-table-column label=" " width="50" align="center">
              <template v-slot="{ row }">
                <el-checkbox v-model="row.status" @change="changeRowStatus" />
              </template>
            </el-table-column>
            <el-table-column label="指标名称" width="320" prop="strategyIndexName" />
            <el-table-column prop="name" label="去重相似度">
              <template v-slot="{ row }">
                <div class="slider-wrap">
                  <!-- :disabled="!row.status" -->
                  <el-slider v-model="row.strategyIndexValue" style="width:40%;" :disabled="!row.status" />{{
                    row.strategyIndexValue }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="label-wrap">配置处置流程</div>
          <el-row :gutter="20">
            <el-form-item label="选择流程模板" style="width: 610px;" class="ml-10">
              <el-select v-model="setp2Form.processTemplateId" placeholder="请选择" style="width:100%;">
                <el-option
                  v-for="item in processTemplateList"
                  :key="item.dictValue"
                  :label="item.dictDesc"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="footer">
      <el-button v-if="setp === 1 && busiType === '1'" type="primary" @click="submitStep1">下一步</el-button>
      <el-button v-if="setp === 2" type="primary" @click="changeStep(-1)">上一步</el-button>
      <el-button v-if="setp === 1" type="primary" @click="saveStep1('save')">保存</el-button>
      <el-button v-if="setp === 2" type="primary" @click="saveStep2('save')">保存</el-button>
      <el-button @click.stop="$router.go(-1)">取消</el-button>
    </div>
  </div>
</template>
<script>
import { pick } from 'lodash'
import { deepClone } from '@/utils'
import eventTypeModuleSrv from '@/api/eventType'
import speTypeMixin from '@/mixin/speTypeMixin'

const reg = /^[1-9]\d*$/

export default {
  name: 'EventTypeLeaf',
  mixins: [speTypeMixin],
  data() {
    const validatelimitTime = (rule, value, callback) => {
      if (this.setp1Form.limitTime) {
        if (!reg.test(this.setp1Form.limitTime)) {
          callback(new Error('只允许输入自然数'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      setp: 1,
      doSave: 0,
      level: 0,
      busiType: '',
      setp1Form: {
        id: '',
        name: '', // 名称
        code: '', // 编码
        dispatchDeal: 0, // 联动
        gridDeal: 0, // 网格
        limitTime: '', // 时限
        limitTimeunit: '1', // 时限单位
        caseCondition: '', // 立案
        closureCriteria: '', // 结案
        managementBasis: '', // 管理依据
        managementProcess: '', // 管理流程
        detail: '', // 类型描述
        speType: []
      },
      limitTimeunitList: [],
      setp1Rules: {
        name: [
          {
            required: true,
            message: '请填写事件类型名称',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请填写事件类型编码',
            trigger: 'blur'
          }
        ],
        dispatchDeal: [
          {
            required: true,
            message: '请选择是否联动指挥处置',
            trigger: 'blur'
          }
        ],
        limitTime: [
          // {
          //   required: true,
          //   message: '请填写处置时限',
          //   trigger: 'blur'
          // },
          { validator: validatelimitTime, trigger: 'blur' }
        ],
        caseCondition: [
          {
            max: 50,
            message: '长度不超过50个字',
            trigger: ['change', 'blur']
          }
        ],
        closureCriteria: [
          {
            max: 50,
            message: '长度不超过50个字',
            trigger: ['change', 'blur']
          }
        ],
        managementBasis: [
          {
            max: 50,
            message: '长度不超过50个字',
            trigger: ['change', 'blur']
          }
        ],
        managementProcess: [
          {
            max: 50,
            message: '长度不超过50个字',
            trigger: ['change', 'blur']
          }
        ],
        detail: [
          {
            max: 50,
            message: '长度不超过50个字',
            trigger: ['change', 'blur']
          }
        ]
      },
      setp2Form: {
        id: '',
        useAlgorithm: 1, // 启用算法
        strategyIndexList: [], // 去重策略列表
        processTemplateId: '' // 流程模板
      },
      strategyIndexListState: true, // 去重策略列表开启状态
      processTemplateList: []
    }
  },
  computed: {
    eventTypeId() {
      return this.$route.query.id
    }
  },
  mounted() {
    this.getDetail()
    this.getprocessTemplateList()
    this.getlimitTimeunitList()
  },
  methods: {
    changeStep(setpNum) {
      this.setp += setpNum
    },
    changeTimelimitUnit() {
      this.$refs['setp1FormRef'].validateField('limitTime')
    },
    async submitStep1() {
      await this.$refs['setp1FormRef'].validate()
      this.saveStep1('next')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async getprocessTemplateList() {
      const { data } = await eventTypeModuleSrv.getProcdef(null)
      this.processTemplateList = data
    },
    async getlimitTimeunitList() {
      const { data } = await eventTypeModuleSrv.getDict({ dictType: 'time_unit' })
      this.limitTimeunitList = data
    },
    // 初始详情
    async getDetail() {
      const { data } = await eventTypeModuleSrv.getEventDetail({ id: this.$route.query.id })
      // 处理基本信息 id 及是是否保存 保存不允许修改 编码
      this.doSave = data.doSave
      this.level = data.level
      this.busiType = data.busiType || ''
      if (data.speType) {
        data.speType = data.speType.split(',')
        data.speType = data.speType.map(st => {
          return data.dispatchDeal === 1 ? this.getAllParent_ldzh(st) : this.getAllParent(st)
        })
      }
      // 基本信息表单
      Object.assign(this.setp1Form, pick(data, 'setp1Form', 'closureCriteria', 'code', 'detail', 'id', 'limitTime', 'limitTimeunit', 'managementBasis', 'managementProcess', 'name', 'caseCondition', 'speType'), { 'gridDeal': data.gridDeal ? data.gridDeal : 0, 'dispatchDeal': data.dispatchDeal ? data.dispatchDeal : 0 })

      if (!this.doSave) {
        this.setp1Form.limitTimeunit = '1'
      }
      // 去重策略字典
      const { data: dataDict } = await eventTypeModuleSrv.getDict({ dictType: 'event_rmv_dup_idx' })
      // 智能事件智能过滤算法 表单
      Object.assign(this.setp2Form, pick(data, 'processTemplateId', 'strategyIndexList', 'useAlgorithm', 'id'))
      // 分别处理详情 strategyIndexList 是否为空两种情况
      data.strategyIndexList.length === 0 ? this.handelStrategyIndexListEmpty(dataDict) : this.handelStrategyIndexList(data, dataDict)
    },
    // 全量更改去重策略
    changeAllStatus(state) {
      this.setp2Form.strategyIndexList = this.setp2Form.strategyIndexList.map((item) => {
        return {
          ...item,
          status: state
        }
      })
    },
    changeRowStatus() {
      const checklist = this.setp2Form.strategyIndexList.filter((item) => {
        return item.status
      })
      if (checklist.length) {
        this.strategyIndexListState = true
      } else {
        this.strategyIndexListState = false
      }
    },
    handelStrategyIndexListEmpty(dataDict) {
      // 为空则默认 关闭
      this.strategyIndexListState = false
      // 默认选中
      this.setp2Form.strategyIndexList = dataDict.map((item) => {
        return {
          strategyIndex: item.dictValue,
          // strategyId: item.id,
          status: false,
          strategyIndexName: item.dictDesc,
          strategyIndexValue: +item.remark
        }
      })
    },
    handelStrategyIndexList(data, dataDict) {
      // 不为空则默认 开启
      this.strategyIndexListState = true
      const ids = data.strategyIndexList.map((item) => {
        return item.strategyIndex
      })
      this.setp2Form.strategyIndexList = dataDict.map((item) => {
        return {
          strategyIndex: item.dictValue,
          status: !!ids.includes(item.dictValue),
          strategyIndexName: item.dictDesc,
          strategyIndexValue: ids.includes(item.dictValue) ? (() => {
            const detailItem = data.strategyIndexList.filter((item2) => {
              return item2.strategyIndex === item.dictValue
            })
            return +detailItem[0].strategyIndexValue
          })() : +item.remark
        }
      })
    },
    async saveStep1(type = 'next') {
      const params = deepClone(this.setp1Form)
      if (params.speType) {
        params.speType = params.speType.map(arr => arr.pop()).join(',')
      }
      await eventTypeModuleSrv.postSaveEventLeafBase(params)
      if (type === 'next') {
        this.setp += 1
      } else {
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
        this.$router.go(-1)
      }
    },
    async saveStep2() {
      const params = {
        ...this.setp2Form
      }
      if (this.strategyIndexListState) {
        params.strategyIndexList = params.strategyIndexList.filter((item) => {
          return item.status
        })
        // strategyIndexListState 开启必填一个值
        if (!params.strategyIndexList.length) {
          this.$message({
            message: '配置事件去重策略开启状态，需至少配置一项目',
            type: 'warning'
          })
          return false
        }
      } else {
        params.strategyIndexList = []
      }
      await eventTypeModuleSrv.postSaveEventLeafConfig(params)
      this.$message({
        message: '保存成功！',
        type: 'success'
      })
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.event-leaf {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #ffffff;

  .header {
    height: 122px;
    background-image: url("~@/assets/eventType/bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;

    .setp-wrap {
      width: 50%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      display: flex;
      align-items: center;
      margin-top: 6px;

      .setp {
        width: 300px;
        height: 50px;

        &.setp1 {
          background-image: url("~@/assets/eventType/step1-active.png");
          background-repeat: no-repeat;
          background-size: cover;
        }

        &.setp2 {
          background-image: url("~@/assets/eventType/step2.png");
          background-repeat: no-repeat;
          background-size: cover;

          &.active {
            background-image: url("~@/assets/eventType/step2-active.png");
            background-repeat: no-repeat;
            background-size: cover;
          }
        }
      }
    }
  }

  .container {
    flex: 1;
    padding: 20px;
    overflow: auto;

    .step1-containter {
      width: 78.5%;
    }

    .label-wrap {
      font-size: 14px;
      font-weight: bold;
      // margin: 24px 0;
      display: flex;
      margin-bottom: 10px;
      justify-content: space-between;
    }

    .slider-wrap {
      display: flex;
      align-items: center;
      gap: 24px;
      font-weight: bold;
    }
  }

  .footer {
    padding-left: 20px;
    height: 64px;
    background: #ffffff;
    box-shadow: 0px -2px 7px 0px rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    gap: 6px;
  }
}

::v-deep {
  .el-table__header-wrapper thead .el-checkbox {
    display: none;
  }

  .el-slider .el-slider__bar {
    background-color: #4CC09E;
  }

  .el-slider .el-slider__button {
    border-color: #4CC09E;
    margin-top: 2px;
  }

  .el-slider__button {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    box-shadow: #b5ded2 0px 2px 10px 2px;
    border-width: 3px;
    border-color: #ffffff !important;
    background-color: #4CC09E;
  }

  .el-slider__runway.disabled .el-slider__bar {
    background-color: #d9dbe0;
  }

  .el-slider__runway.disabled .el-slider__button {
    border-color: #d9dbe0;
  }

  .el-slider__bar {
    height: 6px;
  }

  .el-slider__runway {
    height: 6px;
  }

  .el-form-item--small.el-form-item {
    margin-bottom: 20px;
  }
}

.w600 {
  width: 600px;
}

.mb-4 {
  margin-bottom: 4px;
}
.mb-24 {
  margin-bottom: 24px;
}
.ml-10{
margin-left: 10px;
}
</style>
