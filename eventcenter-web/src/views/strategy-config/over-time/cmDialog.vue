<template>
  <el-dialog
    :title="title"
    :visible.sync="isShowDig"
    width="830px"
    :before-close="handleClose"
    :close-on-click-modal="false"
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
        <div class="width100 digwtitle">
          <div class="l">触发条件</div>
        </div>
        <el-form-item class="width50" label="发起方系统" prop="platformSrc">
          <el-select
            v-model="ruleForm.platformSrc"
            class="width100"
            clearable
            placeholder="请选择"
            @change="changeSearchTupuOriginalSysFn"
          >
            <el-option
              v-for="item in selectEventPlatformOptions"
              :key="item.dictValue"
              :label="item.dictDesc"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          class="width50"
          label="发起方事件类型"
          prop="eventTypeList"
        >
          <event-type-cascader
            v-if="loading || digType === 'add'"
            v-model="ruleForm.eventTypeList"
            class="width100"
            :options="eventTypeOptionList"
            :multiple="true"
          />
        </el-form-item>

        <el-form-item class="width50" label="紧急程度" prop="eventUrgent">
          <el-select
            v-model="ruleForm.eventUrgent"
            class="width100"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectEventUrgentOptions"
              :key="item.dictValue"
              :label="item.dictDesc"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>

        <el-form-item class="width50" label="触发优先级" prop="triggerPriority">
          <el-input
            v-model="ruleForm.triggerPriority"
            class="width100"
            maxlength="50"
            placeholder="请输入(0,99]正整数"
          />
        </el-form-item>
        <div class="width100 digwtitle">
          <div class="l">时限设置</div>
        </div>
        <el-form-item class="width100" label="时限单位" prop="timeUnit">
          <el-radio-group v-model="ruleForm.timeUnit">
            <el-radio
              v-for="(val, idx) in timeUnitOptions"
              :key="idx"
              :label="Number(val.dictValue)"
            >{{ val.dictDesc }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item class="width100 dispalyfen" label="">
          <el-form-item
            class="width50"
            label="流程预警时限"
            prop="processWarnDuration"
          >
            <el-input
              v-model="ruleForm.processWarnDuration"
              class="width100"
              maxlength="50"
              :placeholder="placeholderText"
            >
              <template slot="append"> {{ timeOutUnitName }}</template>
            </el-input>
          </el-form-item>
          <el-form-item
            class="width50"
            label="流程超时时限"
            prop="processTimeOutDuration"
          >
            <el-input
              v-model="ruleForm.processTimeOutDuration"
              class="width100"
              maxlength="50"
              :placeholder="placeholderText"
            >
              <template slot="append"> {{ timeOutUnitName }}</template>
            </el-input>
          </el-form-item>
        </el-form-item>

        <el-form-item class="width100 dispalyfen" label="">
          <el-form-item
            class="width50"
            label="调度预警时限"
            prop="dispatchWarnDuration"
          >
            <el-input
              v-model="ruleForm.dispatchWarnDuration"
              class="width100"
              maxlength="50"
              :placeholder="placeholderText"
            >
              <template slot="append"> {{ timeOutUnitName }}</template>
            </el-input>
          </el-form-item>
          <el-form-item
            class="width50"
            label="调度超时时限"
            prop="dispatchTimeOutDuration"
          >
            <el-input
              v-model="ruleForm.dispatchTimeOutDuration"
              class="width100"
              maxlength="50"
              :placeholder="placeholderText"
            >
              <template slot="append"> {{ timeOutUnitName }}</template>
            </el-input>
          </el-form-item>
        </el-form-item>

        <el-form-item class="width100 dispalyfen" label="">
          <el-form-item
            class="width50"
            label="处置预警时限"
            prop="handleWarnDuration"
          >
            <el-input
              v-model="ruleForm.handleWarnDuration"
              class="width100"
              maxlength="50"
              :placeholder="placeholderText"
            >
              <template slot="append"> {{ timeOutUnitName }}</template>
            </el-input>
          </el-form-item>
          <el-form-item
            class="width50"
            label="处置超时时限"
            prop="handleTimeOutDuration"
          >
            <el-input
              v-model="ruleForm.handleTimeOutDuration"
              class="width100"
              maxlength="50"
              :placeholder="placeholderText"
            >
              <template slot="append"> {{ timeOutUnitName }}</template>
            </el-input>
          </el-form-item>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
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
import { isEmpty, omit } from 'lodash'
import moduleSrv from '@/api/dispatchWhh'
import moduleSrv2 from '@/api/dispatch'
import { isOverTimeConfigLevalNumber } from '@/utils/validate'
import eventTypeCascader from './event-type-cascader'

export default {
  name: 'CmDialog',
  components: {
    eventTypeCascader
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
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    var processTimeCompare = (rule, value, callback) => {
      if (!this.ruleForm.processWarnDuration) {
        callback()
      }
      if (+value <= +this.ruleForm.processWarnDuration) {
        callback(new Error('流程超时时限需要大于流程预警时限'))
      } else {
        callback()
      }
    }
    var dispatchTimeCompare = (rule, value, callback) => {
      if (!this.ruleForm.dispatchWarnDuration) {
        callback()
      }
      if (+value <= +this.ruleForm.dispatchWarnDuration) {
        callback(new Error('调度超时时限需要大于调度预警时限'))
      } else {
        callback()
      }
    }
    var handleTimeCompare = (rule, value, callback) => {
      if (!this.ruleForm.handleWarnDuration) {
        callback()
      }
      if (+value <= +this.ruleForm.handleWarnDuration) {
        callback(new Error('处置超时时限需要大于处置预警时限'))
      } else {
        callback()
      }
    }
    var isOverTimeConfigNumber = (rule, value, callback) => {
      if (+this.ruleForm.timeUnit === 3) {
        const regExp = /^(?!0$)([1-9]\d{0,2}|999)$/
        if (value && !regExp.test(value)) {
          callback(new Error('请输入0-999之间的整数,不包含0'))
        }
        callback()
      } else {
        const regExp = /^(?!0$)([1-9][0-9]?|99)$/
        if (value && !regExp.test(value)) {
          callback(new Error('请输入0-99之间的整数,不包含0'))
        }
        callback()
      }
    }

    return {
      isShowDig: false,
      title: '',
      loading: false,
      eventTypeOptionList: [],
      ruleForm: {
        id: '',
        platformSrc: '', // *发起方系统
        eventTypeList: [], // *发起方事件类型
        eventUrgent: '', // *紧急程度
        triggerPriority: '', // *触发优先级
        timeUnit: 1, // 时限单位
        processWarnDuration: '', // 流程预警时限
        processTimeOutDuration: '', // 流程超时时限
        dispatchWarnDuration: '', // 调度预警时限
        dispatchTimeOutDuration: '', // 调度超时时限
        handleWarnDuration: '', // 处置预警时限
        handleTimeOutDuration: '' // 处置超时时限
      },
      rules: {
        platformSrc: [
          { required: true, message: '请选择发起方系统', trigger: 'change' }
        ],
        triggerPriority: [
          { required: true, message: '请输入触发优先级', trigger: 'change' },
          {
            validator: isOverTimeConfigLevalNumber,
            trigger: ['change', 'blur']
          }
        ],
        timeUnit: [
          { required: true, message: '请选择时限单位', trigger: 'change' }
        ],
        processWarnDuration: [
          { validator: isOverTimeConfigNumber, trigger: ['change', 'blur'] }
        ],
        processTimeOutDuration: [
          { validator: processTimeCompare, trigger: ['change', 'blur'] },
          { validator: isOverTimeConfigNumber, trigger: ['change', 'blur'] }
        ],
        dispatchWarnDuration: [
          { validator: isOverTimeConfigNumber, trigger: ['change', 'blur'] }
        ],
        dispatchTimeOutDuration: [
          { validator: dispatchTimeCompare, trigger: ['change', 'blur'] },
          { validator: isOverTimeConfigNumber, trigger: ['change', 'blur'] }
        ],
        handleWarnDuration: [
          { validator: isOverTimeConfigNumber, trigger: ['change', 'blur'] }
        ],
        handleTimeOutDuration: [
          { validator: handleTimeCompare, trigger: ['change', 'blur'] },
          { validator: isOverTimeConfigNumber, trigger: ['change', 'blur'] }
        ]
      },
      eventTypeWhhOptions: [],
      nodeNameNodeKeyOptions: []
    }
  },
  computed: {
    timeOutUnitName() {
      const unitList = new Map([
        [1, '工作日'],
        [2, '自然日'],
        [3, '小时']
      ])
      return '个' + unitList.get(this.ruleForm.timeUnit)
    },
    placeholderText() {
      return this.ruleForm.timeUnit === 3
        ? '请输入(0,999]正整数'
        : '请输入(0,99]正整数'
    },
    // 把字典转换为字典方式存储，方便获取对应中文
    selectEventPlatformOptions() {
      const usesysCodeOptions =
        this.$store.getters.getBsDictsByType('event_platform')
      // 事件总线 code不选择
      return usesysCodeOptions.filter((item) => {
        return (
          item.dictValue !== (window.GLOBAL_CONFIG.dispatchWebCode || '100')
        )
      })
    },
    selectEventUrgentOptions() {
      return this.$store.getters.getBsDictsByType('event_urgent_level')
    },
    timeUnitOptions() {
      return this.$store.getters.getBsDictsByType('time_unit')
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
          this.title = '新增时限配置'
        } else if (nval === 'view') {
          this.title = '查看时限配置'
        } else {
          this.title = '编辑时限配置'
        }
      }
    }
  },
  mounted() {
    this.id && this.getDetail()
  },
  methods: {
    async changeSearchTupuOriginalSysFn(val) {
      this.eventTypeOptionList = []
      if (!val) return
      const res = await moduleSrv2.eventTypeSelect({ platformSrc: val })
      // 存入子系统 事件类型
      !isEmpty(res) && this.$store.commit('dispatch/SET_EVENT_TYPE', res)
      this.eventTypeOptionList = this.$store.getters.getEventTypeByFlag({
        hasHidden: false,
        joinCode: true
      })
      return true
    },
    // 提交
    async _confirm() {
      await this.$refs['ruleForm'].validate()
      const params = omit(this.ruleForm, 'eventTypeList')
      params.eventTypeList = Array.isArray(this.ruleForm.eventTypeList)
        ? this.ruleForm.eventTypeList.map((item) => {
          return {
            id: '',
            eventTypeMaxId: item[0] || '',
            eventTypeMiddleId: item[1] || '',
            eventTypeId: item[2] || ''
          }
        })
        : []
      const digTypeAdd = this.digType === 'add'
      digTypeAdd
        ? await moduleSrv.postTimeConfigAdd(params)
        : await moduleSrv.postTimeConfigEdit(params)
      this.$message.success(`${digTypeAdd ? '新建' : '更新'}成功`)
      // 关闭弹窗 刷新列表
      this.$parent.resultList()
      this.isShowDig = false
      this.$parent.dialogVisible = false
    },
    handleClose(done) {
      this.isShowDig = false
      this.$parent.dialogVisible = false
    },
    async getDetail() {
      const { data } = await moduleSrv.getTimeConfigDetail({ id: this.id })
      await this.changeSearchTupuOriginalSysFn(data.platformSrc)
      Object.assign(this.ruleForm, omit(data, 'eventTypeList'))
      this.ruleForm.eventTypeList = data.eventTypeList.map((item) => {
        return [item.eventTypeMaxId, item.eventTypeMiddleId, item.eventTypeId]
      })
      // 解决 事件类型 回显问题
      this.loading = true
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

.dispalyfen {
  ::v-deep {
    > .el-form-item__content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      &::before {
        display: none;
      }

      &::after {
        display: none;
      }

      .el-form-item {
        margin-bottom: 0px;
      }
    }
  }
}

.digwtitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;

  .l {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #313131;
    border-left: 4px solid #36a4ff;
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
      color: #4d4d4d;
    }

  }
}

::v-deep .el-cascader__search-input {
  padding: 0;
  margin: 2px 0 2px 10px;
}
</style>
