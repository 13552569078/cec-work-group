<!--
 * @description 去重策略配置
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
        <div class="width100 digwtitle">
          <div class="l">事件去重基本信息</div>
        </div>

        <el-form-item class="width50" label="平台系统" prop="platformSrc">
          <el-select v-model="ruleForm.platformSrc" class="width100" clearable placeholder="请选择" @change="changeSearchTupuOriginalSysFn">
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

        <el-form-item class="width50" label="去重策略名称" prop="strategyName">
          <el-input v-model="ruleForm.strategyName" class="width100" maxlength="50" placeholder="请输入内容" />
        </el-form-item>

        <el-form-item class="width50" label="去重策略编码" prop="strategyCode">
          <el-input v-model="ruleForm.strategyCode" class="width100" maxlength="50" disabled placeholder="自动生成，无需输入" />
        </el-form-item>

        <div class="width100 digwtitle">
          <div class="l">事件去重指标 <b style="color: red">*</b></div>
        </div>

        <div class="width100 zbgbox">
          <div class="ttp">
            <div class="w1">&nbsp;</div>
            <div class="w2">指标名称</div>
            <div class="w3">去重相似度</div>
          </div>
          <div v-for="(val, idx) in ruleForm.strategyIndexList" :key="idx" class="ttpeach">
            <div class="w1">
              <el-form-item class="width100" label="" :prop="`strategyIndexList.${idx}.isChecked`" :rules="strategyIndexListRules.isChecked">
                <el-checkbox v-model="val.isChecked" />
              </el-form-item>
            </div>
            <div class="w2">{{ val.strategyIndexName }}</div>
            <div class="w3">
              <el-form-item class="width100" label="" :prop="`strategyIndexList.${idx}.strategyIndexValue`" :rules="strategyIndexListRules.strategyIndexValue">
                <el-slider v-model="val.strategyIndexValue" />
              </el-form-item>
            </div>
          </div>
        </div>
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
        strategyName: '',
        strategyCode: '',
        platformSrc: '',
        useEventTypeIds: [],
        eventTypeIds: '',
        status: 1,
        strategyIndexList: []
      },
      rules: {
        strategyName: [
          { required: true, message: '请输入策略名称', trigger: 'blur' }
        ],
        strategyCode: [
          { required: false, message: '请输入策略编码', trigger: 'blur' }
        ],
        platformSrc: [
          { required: true, message: '请选择平台系统', trigger: 'change' }
        ],
        useEventTypeIds: [
          { required: false, message: '请选择事件类型', trigger: 'change' }
        ]
      },
      strategyIndexListRules: {
        isChecked: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        strategyIndexValue: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      eventTypeWhhOptions: []
    }
  },
  computed: {
    // 把字典转换为字典方式存储，方便获取对应中文
    deleteMutiOptions() {
      return this.$store.getters.getBsDictsByType('event_rmv_dup_idx')
    },
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
          this.title = '新增去重策略配置'
        } else if (nval === 'view') {
          this.title = '查看去重策略配置'
        } else {
          this.title = '编辑去重策略配置'
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
    async changeSearchTupuOriginalSysFn(val) {
      this.eventTypeWhhOptions = []
      this.ruleForm.useEventTypeIds = []
      if (val === '' || val === null || val === undefined) return
      const res = await moduleSrv.getEventRmvDupStaySelectEventTypeIdByplatformSrc({ platformSrc: val })
      this.eventTypeWhhOptions = res.data || []
    },
    async dealruleFormFn(useNvalObj) {
      const useNvalObj2 = JSON.parse(JSON.stringify(useNvalObj))
      const isNotPiPeiOptions = JSON.parse(JSON.stringify(this.deleteMutiOptions))
      if (this.digType === 'edit' || this.digType === 'view') {
        await this.changeSearchTupuOriginalSysFn(useNvalObj2.platformSrc)
        if (useNvalObj2.eventTypeIds === '' || useNvalObj2.eventTypeIds === null) {
          // eslint-disable-next-line require-atomic-updates
          useNvalObj2.useEventTypeIds = []
        } else {
          // eslint-disable-next-line require-atomic-updates
          useNvalObj2.useEventTypeIds = useNvalObj2.eventTypeIds.split(',')
        }
        // 先过滤一下之前已经配置过的，加点数据进去
        isNotPiPeiOptions.forEach(kval => {
          useNvalObj2.strategyIndexList.forEach(mval => {
            if (+kval.dictValue === +mval.strategyIndex) {
              kval.ishased = true
              mval.dictLabel = kval.dictLabel
              mval.dictValue = kval.dictValue
              mval.isChecked = true
              mval.strategyIndexValue = Number(mval.strategyIndexValue)
            }
          })
        })
        // 之前没有配置过的指标，同样也要加数据进去
        const isNotPiPeiOptionsArr = []
        isNotPiPeiOptions.forEach(uval => {
          if (uval.ishased === undefined) {
            isNotPiPeiOptionsArr.push(uval)
          }
        })
        isNotPiPeiOptionsArr.forEach(uval => {
          const uobj = {
            dictLabel: uval.dictLabel,
            dictValue: uval.dictValue,
            isChecked: false,
            strategyIndex: uval.dictValue,
            strategyIndexName: uval.dictLabel,
            strategyIndexValue: 0
          }
          useNvalObj2.strategyIndexList.push(uobj)
        })
        // 排序
        useNvalObj2.strategyIndexList.sort((a, b) => a.dictValue - b.dictValue)
        this.ruleForm = Object.assign(JSON.parse(JSON.stringify(this.ruleForm)), useNvalObj2)
      } else {
        // 之前没有配置过的指标，同样也要加数据进去
        isNotPiPeiOptions.forEach(uval => {
          const uobj = {
            dictLabel: uval.dictLabel,
            dictValue: uval.dictValue,
            isChecked: false,
            strategyIndex: uval.dictValue,
            strategyIndexName: uval.dictLabel,
            strategyIndexValue: 0
          }
          useNvalObj2.strategyIndexList.push(uobj)
        })
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
        serverUrl = moduleSrv.postEventRmvDupStayAdd
        tipsuccess = '添加成功'
        tiperror = '添加失败'
      } else if (this.digType === 'edit') {
        serverUrl = moduleSrv.postEventRmvDupStayUpdate
        tipsuccess = '更新成功'
        tiperror = '更新失败'
      }
      try {
        this.$refs['ruleForm'].validate(async(valid) => {
          if (valid) {
            const useSubmitRuleform = JSON.parse(JSON.stringify(this.ruleForm))
            useSubmitRuleform.eventTypeIds = useSubmitRuleform.useEventTypeIds.join(',')
            const lsStrategyIndexList = []
            useSubmitRuleform.strategyIndexList.forEach((v, i) => {
              if (v.isChecked === true) {
                lsStrategyIndexList.push(v)
              }
            })
            useSubmitRuleform.strategyIndexList = JSON.parse(JSON.stringify(lsStrategyIndexList))
            const params = {
              ...useSubmitRuleform
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
.digwtitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  .l {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #313131;
    border-left: 4px solid #36A4FF;
    line-height: 14px;
    padding-left: 8px;
  }
  .r {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;
    span {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #4D4D4D;
    }
  }
}
.actbtn {
  color: #36a4ff;
  cursor: pointer;
  margin-right: 8px;
}
.zbgbox {
  .ttp {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #f9fafe;
    padding: 10px 20px;
    .w1 {
      width: 40px;
    }
    .w2 {
      width: 150px;
      color: #202020;
      font-size: 14px;
      font-family: PingFangSC-Medium;
    }
    .w3 {
      flex-grow: 1;
      color: #202020;
      font-size: 14px;
      font-family: PingFangSC-Medium;
    }
  }
  .ttpeach {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10px 20px;
    ::v-deep {
      .el-form-item {
        margin-bottom: 0px;
      }
    }
    .w1 {
      width: 40px;

    }
    .w2 {
      width: 150px;
      color: #4B4B4B;
      font-size: 14px;
    }
    .w3 {
      flex-grow: 1;
    }
  }
}
</style>
