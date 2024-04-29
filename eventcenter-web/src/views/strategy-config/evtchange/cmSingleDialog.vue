<!--
 * @description 任务中心-待办任务
 * @date 2020-09-08
 * @author lism
-->
<template>
  <el-dialog
    class="eventchangeWHH"
    :title="title"
    :visible.sync="isShowDig"
    width="700px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-position="top" label-width="100px" class="width100">
        <div class="demo-ruleForm width100">
          <el-form-item class="width100" label="配置所属系统" prop="sysFlag">
            <el-select v-model="ruleForm.sysFlag" class="width100" :disabled="true" filterable placeholder="请选择">
              <el-option
                v-for="item in noswzxSysCodeOptions"
                :key="item.dictValue"
                :label="item.dictDesc"
                :value="item.dictValue"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item v-for="(val, index) in ruleForm.originatorList" :key="`${index}1`" class="width100 wahahaha" label="" prop="originatorList">
          <el-form-item class="width50" label="发起方系统" prop="originalSysCode">
            <el-select v-model="val.originalSysCode" class="width100" :disabled="true" filterable placeholder="请选择">
              <el-option
                v-for="item in noswzxSysCodeOptions"
                :key="item.dictValue"
                :label="item.dictDesc"
                :value="item.dictValue"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="width50" label="发起方事件类型（名称-编码）" prop="originalNameValue">
            <el-select v-model="val.originalNameValue" class="width100" :disabled="true" filterable placeholder="请选择">
              <el-option
                v-for="item in val.originalOptions"
                :key="item.eventTypeCode"
                :label="item.eventTypeNameCode"
                :value="item.eventTypeNameCode"
                :disabled="item.availableFlag"
              />
            </el-select>
          </el-form-item>
        </el-form-item>

        <div class="demo-ruleForm width100">
          <el-form-item class="width50" label="事务总线系统" prop="replaceSysCode">
            <el-select v-model="ruleForm.replaceSysCode" class="width100" :disabled="true" filterable placeholder="请选择">
              <el-option
                v-for="item in swzxSysCodeOptions"
                :key="item.dictValue"
                :label="item.dictDesc"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="width50" label="事务总线事件类型（名称-编码）" prop="replaceNameValue">
            <el-select v-model="ruleForm.replaceNameValue" class="width100" :disabled="true" filterable placeholder="请选择">
              <el-option
                v-for="item in swzxEventsOptions"
                :key="item.eventTypeCode"
                :label="item.eventTypeNameCode"
                :value="item.eventTypeNameCode"
                :disabled="item.availableFlag"
              />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item v-for="(val, index) in ruleForm.receiverList" :key="`${index}2`" class="width100 wahahaha wahahaharesever" label="" prop="receiverList">
          <el-form-item class="width50" label="接收方系统" prop="originalSysCode">
            <el-select v-model="val.originalSysCode" class="width100" placeholder="请选择" :disabled="true" filterable>
              <el-option
                v-for="item in noswzxSysCodeOptions"
                :key="item.dictValue"
                :label="item.dictDesc"
                :value="item.dictValue"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="width50" label="接收方事件类型（名称-编码）" prop="originalNameValue">
            <el-select v-model="val.originalNameValue" class="width100" filterable placeholder="请选择">
              <el-option
                v-for="item in val.originalOptions"
                :key="item.eventTypeCode"
                :label="item.eventTypeNameCode"
                :value="item.eventTypeNameCode"
                :disabled="item.availableFlag"
              />
            </el-select>
          </el-form-item>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="_confirm">确 定</el-button>
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
    },
    tableDataLinesData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isShowDig: false,
      title: '',
      ruleForm: {
        sysFlag: '',
        replaceSysCode: '100',
        replaceNameValue: '',
        replaceName: '',
        replaceValue: '',
        originatorList: [
          {
            originalSysCode: '',
            originalOptions: [],
            originalNameValue: '',
            originalName: '',
            originalValue: ''
          }
        ],
        receiverList: []
      },
      rules: {},
      noswzxSysCodeOptions: [],
      swzxSysCodeOptions: [],
      swzxEventsOptions: []
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
        if (nval === 'lieBiaoAdd') {
          this.title = '新增调度配置'
        } else if (nval === 'lieBiaoView') {
          this.title = '查看调度配置'
        } else {
          this.title = '编辑调度配置'
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
        if (this.digType === 'tupuSingleEdit') {
          await this.dealruleFormFn(JSON.parse(JSON.stringify(nval)))
        } else {
          await this.dealruleFormFn(JSON.parse(JSON.stringify(this.ruleForm)))
        }
      }
    }
  },
  async beforeCreate() {
    const params1 = {
      dictType: 'event_platform'
    }
    const res = await moduleSrv.getTcDictDataZiDian(params1)
    if (res.code === SUCCESS_CODE) {
      const useSysCodeOptions = res.data || []
      this.noswzxSysCodeOptions = useSysCodeOptions.filter(val => val.dictValue !== '100')
      this.swzxSysCodeOptions = useSysCodeOptions.filter(val => val.dictValue === '100')
    }
  },
  methods: {
    // 初始化和编辑回填处理
    async dealruleFormFn(useNvalObj) {
      if (this.digType === 'tupuSingleEdit') {
        useNvalObj.replaceSysCode = '100'
        this.changeSwzxSysFn(useNvalObj.replaceSysCode, useNvalObj.sysFlag)
        useNvalObj.replaceNameValue = `${useNvalObj.replaceName}-${useNvalObj.replaceValue}`
        for (let i = 0; i < useNvalObj.originatorList.length; i++) {
          useNvalObj.originatorList[i].originalNameValue = `${useNvalObj.originatorList[i].originalName}-${useNvalObj.originatorList[i].originalValue}`
          const res = await moduleSrv.selectMinByPlatFrom({ platformSrc: useNvalObj.originatorList[i].originalSysCode, sysFlag: useNvalObj.sysFlag, type: '1' })
          let useSwzxEventsOptions = res.data || []
          useSwzxEventsOptions = useSwzxEventsOptions.map(vk => {
            this.$set(vk, 'eventTypeNameCode', `${vk.eventTypeName}-${vk.eventTypeCode}`)
            return vk
          })
          // eslint-disable-next-line require-atomic-updates
          useNvalObj.originatorList[i].originalOptions = useSwzxEventsOptions
        }
        for (let i = 0; i < useNvalObj.receiverList.length; i++) {
          useNvalObj.receiverList[i].originalNameValue = `${useNvalObj.receiverList[i].originalName}-${useNvalObj.receiverList[i].originalValue}`
          const res = await moduleSrv.selectMinByPlatFrom({ platformSrc: useNvalObj.receiverList[i].originalSysCode, sysFlag: useNvalObj.sysFlag, type: '2' })
          let useSwzxEventsOptions = res.data || []
          useSwzxEventsOptions = useSwzxEventsOptions.map(vk => {
            this.$set(vk, 'eventTypeNameCode', `${vk.eventTypeName}-${vk.eventTypeCode}`)
            return vk
          })
          // eslint-disable-next-line require-atomic-updates
          useNvalObj.receiverList[i].originalOptions = useSwzxEventsOptions
        }
        this.ruleForm = Object.assign(JSON.parse(JSON.stringify(this.ruleForm)), useNvalObj)
      }
    },
    // 事务总线系统改变，事务总线的事件类型下拉也要改变
    async changeSwzxSysFn(val, sysFlag) {
      const res = await moduleSrv.selectMinByPlatFrom({ platformSrc: val, sysFlag: sysFlag || this.ruleForm.sysFlag, type: '3' })
      const useSwzxEventsOptions = res.data || []
      this.swzxEventsOptions = useSwzxEventsOptions.map(val => {
        this.$set(val, 'eventTypeNameCode', `${val.eventTypeName}-${val.eventTypeCode}`)
        return val
      })
    },
    handleClose(done) {
      this.isShowDig = false
      this.$parent.dialogVisibleSingle = false
    },
    // 提交
    _confirm() {
      const serverUrl = moduleSrv.eventTypeConfigUpdate
      const tipsuccess = '更新成功'
      const tiperror = '更新失败'
      try {
        this.$refs['ruleForm'].validate(async(valid) => {
          if (valid) {
            console.log('submit.ruleForm', this.ruleForm)
            const submitRuleForm = {
              id: this.ruleForm.id,
              sysFlag: this.ruleForm.originatorList[0].originalSysCode,
              originalSysCode: this.ruleForm.receiverList[0].originalSysCode,
              originalName: this.ruleForm.receiverList[0].originalNameValue.split('-')[0],
              originalValue: this.ruleForm.receiverList[0].originalNameValue.split('-')[1],
              replaceSysCode: this.ruleForm.replaceSysCode,
              replaceName: this.ruleForm.replaceNameValue.split('-')[0],
              replaceValue: this.ruleForm.replaceNameValue.split('-')[1]
            }
            console.log('submit.submitRuleForm', submitRuleForm)
            const params = {
              ...submitRuleForm
            }
            const res = await serverUrl(params)
            if (res.code === SUCCESS_CODE) {
              this.$parent._search()
              this.$parent.resultListTupu()
              this.$parent.resultListLines(this.tableDataLinesData)
              this.$message.success(tipsuccess)
              this.isShowDig = false
              this.$parent.dialogVisibleSingle = false
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
.width33 {
  width: 31%;
}
.width20 {
  width: 20%;
}
.eventchangeWHH {
  .title {
    font-weight: bold;
    font-size: 14px;
    font-family: PingFangSC-Regular,PingFang SC;
    color: #4b4b4b;
    margin-bottom: 10px;
  }
  ::v-deep {
    .wahahaha {
      > ::before {
        display: none;
      }
      > ::after {
        display: none;
      }
      .el-form-item {
        margin-bottom: 0px;
      }
      > .el-form-item__content {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;
        padding: 0px;
      }
    }
    .wahahaharesever {
      background: #f3f3f3;
      padding: 10px;
      border-radius: 10px;
    }
    .shanchu {
      position: absolute;
      top: -11px;
      right: -15px;
    }
  }
}
</style>
