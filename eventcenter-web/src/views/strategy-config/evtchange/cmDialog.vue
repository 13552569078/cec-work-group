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
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :disabled="digType === 'lieBiaoView'"
        label-position="top"
        label-width="100px"
        class="width100"
      >
        <div class="demo-ruleForm width100">
          <el-form-item
            class="width100"
            label="配置所属系统"
            prop="sysFlag"
          >
            <el-select
              v-model="ruleForm.sysFlag"
              class="width100"
              :disabled="digType === 'lieBiaoEdit' || digType === 'tupuEdit' || digType === 'tupuAdd'"
              filterable
              placeholder="请选择"
              @change="changeSysFlagFn"
            >
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

        <el-form-item
          v-for="(val, index) in ruleForm.originatorList"
          :key="`${index}1`"
          class="width100 wahahaha"
        >
          <el-form-item
            class="width50"
            label="发起方系统"
            :prop="`originatorList.${index}.originalSysCode`"
            :rules="originatorRules.originalSysCode"
          >
            <el-select
              v-model="val.originalSysCode"
              class="width100"
              :disabled="true"
              filterable
              placeholder="请选择"
              @change="changeOriginalSysFn($event, index)"
            >
              <el-option
                v-for="item in noswzxSysCodeOptions"
                :key="item.dictValue"
                :label="item.dictDesc"
                :value="item.dictValue"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            class="width50"
            label="发起方事件类型（名称-编码）"
            :prop="`originatorList.${index}.originalNameValue`"
            :rules="originatorRules.originalNameValue"
          >
            <el-select
              v-model="val.originalNameValue"
              class="width100"
              :disabled="false"
              filterable
              placeholder="请选择"
            >
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
          <el-form-item
            class="width50"
            label="事务总线系统"
            prop="replaceSysCode"
          >
            <el-select
              v-model="ruleForm.replaceSysCode"
              class="width100"
              :disabled="true"
              filterable
              placeholder="请选择"
              @change="changeSwzxSysFn"
            >
              <el-option
                v-for="item in swzxSysCodeOptions"
                :key="item.dictValue"
                :label="item.dictDesc"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            class="width50"
            label="事务总线事件类型（名称-编码）"
            prop="replaceNameValue"
          >
            <el-select
              v-model="ruleForm.replaceNameValue"
              class="width100"
              :disabled="false"
              filterable
              placeholder="请选择"
            >
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

        <div
          v-if="ruleForm.sysFlag"
          class="width100"
          style="font-size: 30px; text-align:right; margin-bottom: 10px;"
        >
          <el-button
            type="primary"
            icon="el-icon-plus"
            plain
            @click="addNewReceiverFn"
          >接收方</el-button>
        </div>

        <el-form-item
          v-for="(val, index) in ruleForm.receiverList"
          :key="`${index}2`"
          class="width100 wahahaha wahahaharesever"
        >
          <div
            class="shanchu"
            style="font-size: 20px; text-align:right;"
          >
            <el-button
              type="text"
              icon="el-icon-remove-outline"
              @click="deleteCurLineFn(index, val.originalSysCode)"
            >删除</el-button>
          </div>

          <el-form-item
            class="width50"
            label="接收方系统"
            :prop="`receiverList.${index}.originalSysCode`"
            :rules="receiverRules.originalSysCode"
          >
            <el-select
              v-model="val.originalSysCode"
              class="width100"
              placeholder="请选择"
              filterable
              @change="changeReplaceSysFn($event, index)"
            >
              <el-option
                v-for="item in noswzxSysCodeOptions"
                :key="item.dictValue"
                :label="item.dictDesc"
                :value="item.dictValue"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            class="width50"
            label="接收方事件类型（名称-编码）"
            :prop="`receiverList.${index}.originalNameValue`"
            :rules="receiverRules.originalNameValue"
          >
            <el-select
              v-model="val.originalNameValue"
              class="width100"
              filterable
              placeholder="请选择"
            >
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
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleClose">取 消</el-button>
      <el-button
        v-if="digType === 'lieBiaoAdd' || digType === 'lieBiaoEdit' || digType === 'tupuEdit' || digType === 'tupuAdd'"
        type="primary"
        @click="_confirm"
      >确 定</el-button>
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
      default: () => { }
    },
    tableDataNodesSysFlag: {
      type: [String, Number],
      default: () => ''
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
      rules: {
        sysFlag: [{ required: true, message: '请选择配置所属系统', trigger: 'change' }],
        replaceSysCode: [{ required: true, message: '请选择事务总线系统', trigger: 'change' }],
        replaceNameValue: [{ required: true, message: '请选择事务总线事件类型（名称-编码）', trigger: 'change' }]
      },
      originatorRules: {
        originalSysCode: [{ required: true, message: '请选择发起方系统', trigger: 'change' }],
        originalNameValue: [{ required: true, message: '请选择发起方事件类型（名称-编码）', trigger: 'change' }]
      },
      receiverRules: {
        originalSysCode: [{ required: true, message: '请选择接收方系统', trigger: 'change' }],
        originalNameValue: [{ required: true, message: '请选择接收方事件类型（名称-编码）', trigger: 'change' }]
      },
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
        if (this.digType === 'lieBiaoView' || this.digType === 'lieBiaoEdit' || this.digType === 'tupuEdit' || this.digType === 'tupuAdd') {
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
      if (this.digType === 'lieBiaoView' || this.digType === 'lieBiaoEdit' || this.digType === 'tupuEdit') {
        useNvalObj.replaceSysCode = '100'
        this.changeSwzxSysFn(useNvalObj.replaceSysCode, useNvalObj.sysFlag)
        useNvalObj.replaceNameValue = `${useNvalObj.replaceName}-${useNvalObj.replaceValue}`
        useNvalObj.originatorList = []
        useNvalObj.originatorList.push(JSON.parse(JSON.stringify(useNvalObj)))
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
        useNvalObj.receiverList = JSON.parse(JSON.stringify(useNvalObj.childrenList || []))
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
      } else if (this.digType === 'tupuAdd') {
        useNvalObj.replaceSysCode = '100'
        this.changeSwzxSysFn(useNvalObj.replaceSysCode, useNvalObj.sysFlag)
        for (let i = 0; i < useNvalObj.originatorList.length; i++) {
          const res = await moduleSrv.selectMinByPlatFrom({ platformSrc: useNvalObj.originatorList[i].originalSysCode, sysFlag: useNvalObj.sysFlag, type: '1' })
          let useSwzxEventsOptions = res.data || []
          useSwzxEventsOptions = useSwzxEventsOptions.map(vk => {
            this.$set(vk, 'eventTypeNameCode', `${vk.eventTypeName}-${vk.eventTypeCode}`)
            return vk
          })
          // eslint-disable-next-line require-atomic-updates
          useNvalObj.originatorList[i].originalOptions = useSwzxEventsOptions
        }
        this.ruleForm = Object.assign(JSON.parse(JSON.stringify(this.ruleForm)), useNvalObj)
      } else {
        useNvalObj.replaceSysCode = '100'
        this.changeSwzxSysFn(useNvalObj.replaceSysCode, useNvalObj.sysFlag)
        this.ruleForm = Object.assign(JSON.parse(JSON.stringify(this.ruleForm)), useNvalObj)
      }
      // 处理系统下拉菜单
      this.dealnoswzxSysCodeOptionsFn()
    },
    // 处理系统下拉菜单
    dealnoswzxSysCodeOptionsFn() {
      const curSelectedSysCodes = []
      this.ruleForm.originatorList.forEach(val => {
        curSelectedSysCodes.push(+val.originalSysCode)
      })
      this.ruleForm.receiverList.forEach(val => {
        curSelectedSysCodes.push(+val.originalSysCode)
      })
      this.noswzxSysCodeOptions.forEach(val => {
        if (curSelectedSysCodes.includes(+val.dictValue)) {
          this.$set(val, 'disabled', true)
        } else {
          this.$set(val, 'disabled', false)
        }
      })
    },
    // 改变所属系统时候，发起方的系统要一起改变，同时后面的事件类型下拉也得变
    async changeSysFlagFn(val) {
      this.ruleForm = {
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
      }
      this.ruleForm.sysFlag = val
      this.ruleForm.originatorList.forEach(item => {
        this.$set(item, 'originalSysCode', val)
      })
      this.changeSwzxSysFn(this.ruleForm.replaceSysCode)
      const res = await moduleSrv.selectMinByPlatFrom({ platformSrc: this.ruleForm.originatorList[0].originalSysCode, sysFlag: this.ruleForm.sysFlag, type: '1' })
      let useSwzxEventsOptions = res.data || []
      useSwzxEventsOptions = useSwzxEventsOptions.map(vk => {
        this.$set(vk, 'eventTypeNameCode', `${vk.eventTypeName}-${vk.eventTypeCode}`)
        return vk
      })
      this.ruleForm.originatorList[0].originalOptions = useSwzxEventsOptions

      // 处理系统下拉菜单
      this.dealnoswzxSysCodeOptionsFn()
    },
    // 事务总线系统改变，事务总线的事件类型下拉也要改变
    async changeSwzxSysFn(val, sysFlag) {
      if ((sysFlag === '' || sysFlag === null || sysFlag === undefined) && (this.ruleForm.sysFlag === '' || this.ruleForm.sysFlag === null || this.ruleForm.sysFlag === undefined)) return
      const res = await moduleSrv.selectMinByPlatFrom({ platformSrc: val, sysFlag: sysFlag || this.ruleForm.sysFlag, type: '3' })
      const useSwzxEventsOptions = res.data || []
      this.swzxEventsOptions = useSwzxEventsOptions.map(val => {
        this.$set(val, 'eventTypeNameCode', `${val.eventTypeName}-${val.eventTypeCode}`)
        return val
      })
    },
    // 发起方系统改变，发起方的事件类型下拉也要改变
    async changeOriginalSysFn(val, index) {
      const res = await moduleSrv.selectMinByPlatFrom({ platformSrc: val, sysFlag: this.ruleForm.sysFlag, type: '1' })
      let useSwzxEventsOptions = res.data || []
      useSwzxEventsOptions = useSwzxEventsOptions.map(vk => {
        this.$set(vk, 'eventTypeNameCode', `${vk.eventTypeName}-${vk.eventTypeCode}`)
        return vk
      })
      this.ruleForm.originatorList.find((vm, idx) => {
        if (idx === index) {
          this.$set(vm, 'originalOptions', useSwzxEventsOptions)
        }
      })

      // 处理系统下拉菜单
      this.dealnoswzxSysCodeOptionsFn()
    },
    // 接收方系统改变，接收方的事件类型下拉也要改变
    async changeReplaceSysFn(val, index) {
      const res = await moduleSrv.selectMinByPlatFrom({ platformSrc: val, sysFlag: this.ruleForm.sysFlag, type: '2' })
      let useSwzxEventsOptions = res.data || []
      useSwzxEventsOptions = useSwzxEventsOptions.map(vk => {
        this.$set(vk, 'eventTypeNameCode', `${vk.eventTypeName}-${vk.eventTypeCode}`)
        return vk
      })
      this.ruleForm.receiverList.find((vm, idx) => {
        if (idx === index) {
          this.$set(vm, 'originalOptions', useSwzxEventsOptions)
        }
      })

      // 处理系统下拉菜单
      this.dealnoswzxSysCodeOptionsFn()
    },
    // 新增接收方
    addNewReceiverFn() {
      this.ruleForm.receiverList.push({
        originalSysCode: '',
        originalOptions: [],
        originalNameValue: '',
        originalName: '',
        originalValue: ''
      })
    },
    // 删除当前接收方
    deleteCurLineFn(index, sysCode) {
      this.ruleForm.receiverList.splice(index, 1)
      // 处理系统下拉菜单
      this.dealnoswzxSysCodeOptionsFn()
    },
    handleClose(done) {
      this.isShowDig = false
      this.$parent.dialogVisible = false
    },
    // 提交
    _confirm() {
      let serverUrl, tipsuccess, tiperror
      if (this.digType === 'lieBiaoAdd' || this.digType === 'tupuAdd') {
        serverUrl = moduleSrv.eventTypeConfigAdd
        tipsuccess = '添加成功'
        tiperror = '添加失败'
      } else if (this.digType === 'lieBiaoEdit' || this.digType === 'tupuEdit') {
        serverUrl = moduleSrv.eventTypeConfigUpdateAll
        tipsuccess = '更新成功'
        tiperror = '更新失败'
      }
      try {
        this.$refs['ruleForm'].validate(async(valid) => {
          if (valid) {
            console.log('submit.ruleForm', this.ruleForm)
            const submitRuleForm = []
            this.ruleForm.originatorList.forEach(val => {
              submitRuleForm.push({
                sysFlag: this.ruleForm.sysFlag,
                replaceSysCode: this.ruleForm.replaceSysCode,
                replaceNameValue: this.ruleForm.replaceNameValue,
                replaceName: this.ruleForm.replaceNameValue.split('-')[0],
                replaceValue: this.ruleForm.replaceNameValue.split('-')[1],
                id: val.id,
                originalSysCode: val.originalSysCode,
                originalOptions: val.originalOptions,
                originalNameValue: val.originalNameValue,
                originalName: val.originalNameValue.split('-')[0],
                originalValue: val.originalNameValue.split('-')[1]
              })
            })

            this.ruleForm.receiverList.forEach(val => {
              submitRuleForm.push({
                sysFlag: this.ruleForm.sysFlag,
                replaceSysCode: this.ruleForm.replaceSysCode,
                replaceNameValue: this.ruleForm.replaceNameValue,
                replaceName: this.ruleForm.replaceNameValue.split('-')[0],
                replaceValue: this.ruleForm.replaceNameValue.split('-')[1],
                id: val.id,
                originalSysCode: val.originalSysCode,
                originalOptions: val.originalOptions,
                originalNameValue: val.originalNameValue,
                originalName: val.originalNameValue.split('-')[0],
                originalValue: val.originalNameValue.split('-')[1]
              })
            })
            console.log('submit.submitRuleForm', submitRuleForm)
            const params = [
              ...submitRuleForm
            ]
            const res = await serverUrl(params)
            if (res.code === SUCCESS_CODE) {
              this.$parent._search()
              this.$parent.resultListTupu()
              if (this.digType !== 'lieBiaoAdd' && this.digType !== 'tupuAdd' && this.digType !== 'lieBiaoEdit') {
                this.$parent.resultListNodes(this.tableDataNodesSysFlag)
              }
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
    font-family: PingFangSC-Regular, PingFang SC;
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
