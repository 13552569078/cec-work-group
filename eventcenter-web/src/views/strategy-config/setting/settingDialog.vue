<!--
 * @description 策略配置弹窗
 * @date 2020-08-18
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    :title="matchTitle"
    width="666px"
    v-on="$listeners"
    @confirm="_confirm"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-position="top"
      class="setting-form-class"
    >
      <el-form-item
        label="配置策略因子"

        class="custorm-label"
      >
        <el-row :gutter="20">
          <el-col :span="20">
            <div>事件来源</div>
            <el-checkbox-group v-model="eventSrcIds">
              <el-checkbox
                v-for="(item, index) in eventSourceOptions"
                :key="item.id || index"
                :label="item.dictDesc"
                :value="item.dictValue"
              />
            </el-checkbox-group>
          </el-col>
        </el-row>
        <div>
          <div>紧急程度</div>
          <el-checkbox-group v-model="eventUrgents">
            <el-checkbox
              v-for="(item, index) in eventUrgentOptions"
              :key="item.id || index"
              :label="item.dictDesc"
            />

          </el-checkbox-group>
        </div>
        <div>
          <div>事件类别</div>
          <event-type-cascader
            ref="cascader"
            :show-all-levels="true"
            :parent-type.sync="eventTypeLId"
            :middle-type.sync="eventTypeMId"
            :child-type.sync="eventTypeId"
          />
        </div>
      </el-form-item>
      <el-form-item
        label="选择流程模版"
        prop="bpmKey"
      >
        <el-select v-model="form.bpmKey" placeholder="请选择">
          <el-option
            v-for="(item, index) in dictProcess"
            :key="item.id || index"
            :label="item.dictDesc"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="策略名称" prop="strategyName">
        <el-input
          v-model="form.strategyName"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item label="策略排序" prop="priorityLevel">
        <el-input
          v-model="form.priorityLevel"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          maxlength="1000"
          :rows="5"
          placeholder="请输入内容"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="是否立即生效" prop="effect">
        <el-radio-group v-model="form.effect">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </cestc-dialog>
</template>
<script>
import { validNumber } from '@/utils/validate'
import eventTypeCascader from '../../event/components/EventTypeCascader'
import moduleSrv from '@/api/dispatch'
import { mapGetters } from 'vuex'
import { SUCCESS_CODE } from '@/constants'

const valiSortBy = (rule, value, callback) => {
  if (validNumber(value)) {
    callback()
  } else {
    callback(new Error('排序需要是数字'))
  }
}

export default {
  name: 'SettingDialog',
  components: {
    eventTypeCascader
  },
  data() {
    return {
      form: {
        effect: 1
      },
      eventSrcIds: [], // 事件来源
      eventUrgents: [], // 紧急程度
      eventTypeLId: '',
      eventTypeMId: '',
      eventTypeId: '', // 事件类别
      rules: {
        eventType: [
          {
            required: true,
            message: '事件类型不能为空',
            trigger: 'blur'
          }
        ],
        strategyKey: [
          {
            required: true,
            message: '配置策略因子不能为空',
            trigger: 'blur'

          }
        ],
        bpmKey: [
          {
            required: true,
            message: '流程模板不能为空',
            trigger: 'blur'
          }
        ],
        strategyName: [
          {
            required: true,
            message: '策略名称不能为空',
            trigger: 'blur'
          }
        ],
        priorityLevel: [
          {
            required: true,
            message: '策略排序不能为空',
            trigger: 'blur'
          },
          { validator: valiSortBy, trigger: 'blur' }
        ],
        effect: [
          {
            required: true,
            message: '是否立即生效不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['dictProcess']),
    eventPlatformOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_platform')
    },
    eventSourceOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_origin') || []
    },
    eventUrgentOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_urgent_level') || []
    },
    // 弹窗类型
    mode() {
      return this.$attrs.mode
    },
    matchTitle() {
      const key = this.mode || 'add'
      const obj = {
        add: '新增策略配置',
        edit: '修改策略配置'
      }
      return obj[key]
    }
  },
  watch: {
    // 监听弹窗开启关闭动作，每当开启后，需要更新级联绑定数据
    '$attrs.visible': function(val) {
      if (!val) {
        this.$refs['form'].resetFields()
        this.eventSrcIds = [] // 事件来源多选清空
        this.eventUrgents = [] // 紧急程度多选清空
        this.$refs.cascader.eventType = []
        this.eventTypeId = '' // 事件类型清空
        this.form = {
          effect: 1
        }
      } else {
        this.updateForm()
      }
    }
  },

  methods: {
    // 对策略因子进行数据结构重组
    _toMatch(key, origins, editData = {}) {
      // 平台来源，如果为空，则传一个-1 的值，有值则变量添加到strategyKeyAndValueList
      const obj = {}
      obj.strategyKey = key
      if (editData?.id) {
        obj.strategyId = editData.id
      }
      if (origins.length) {
        obj.strategyValue = origins.join()
      } else {
        obj.strategyValue = '-1'
      }
      return obj
    },
    // 确认按钮触发
    _confirm() {
      this.$refs['form'].validate((valid) => {
        const mode = this.mode
        if (valid) {
          const {
            eventSrcIds = [],
            eventUrgents = [],
            eventTypeId = ''
          } = this
          const editData = this.$attrs.editingdata
          // 根据选择的策略因子，对其进行重组数据结构, 如果editData有值，需要把id 给拼上

          const strategyKeyAndValueList_eventSrcIds = this._toMatch(
            'event_origin',
            eventSrcIds,
            editData
          )
          const strategyKeyAndValueList_eventUrgents = this._toMatch(
            'event_urgent_level',
            eventUrgents,
            editData
          )
          const strategyKeyAndValueList_eventTypeId = []
          if (eventTypeId) {
            // 如果选了事件类型
            const obj = {}
            obj.strategyKey = 'event_type'
            obj.strategyValue = eventTypeId
            if (editData?.id) {
              obj.strategyId = editData.id
            }
            strategyKeyAndValueList_eventTypeId.push(obj)
          } else {
            const obj = {}
            obj.strategyKey = 'event_type'
            obj.strategyValue = '-1'
            if (editData?.id) {
              obj.strategyId = editData.id
            }
            strategyKeyAndValueList_eventTypeId.push(obj)
          }
          // 把策略因子组合在一起，赋值给 form 表单
          this.form.strategyKeyAndValueList =
                        strategyKeyAndValueList_eventTypeId.concat([
                          strategyKeyAndValueList_eventSrcIds,
                          strategyKeyAndValueList_eventUrgents
                        ])
          // 对排序进行 number 转换操作，确保是 number 类型
          this.form.priorityLevel *= 1
          // 校验成功, 区分是新增还是编辑
          if (mode === 'edit') {
            moduleSrv.updateStrategy(this.form).then((res) => {
              if (res.code === SUCCESS_CODE) {
                this.$emit('cancle')
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: res.message || '操作失败！',
                  type: 'error'
                })
              }
            })
          } else {
            moduleSrv.addStrategy(this.form).then((res) => {
              if (res.code === SUCCESS_CODE) {
                this.$emit('cancle')
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: res.message || '操作失败！',
                  type: 'error'
                })
              }
            })
          }
        }
      })
    },

    // 事件管理
    getEventTypeSelect(data) {
      moduleSrv.eventTypeSelect({ platformSrc: data }).then((res) => {
        if (res) {
          this.$store.commit('dispatch/SET_EVENT_TYPE', res)
        }
      })
    },

    // 更新级联选择数据，修复回显问题
    updateForm() {
      const editData = this.$attrs.editingdata
      const mode = this.mode
      if (mode === 'edit') {
        // 从返回值中获取策略因子信息, 从字典中绑定选中的值
        const { strategyKeyAndValueList = [] } = editData
        this.matchStrategyKey(strategyKeyAndValueList) // 回显策略因子
        const {
          id = '',
          bpmKey = '',
          strategyName = '',
          priorityLevel = '',
          remark = '',
          effect = 0
        } = editData
        // 编辑的时候需要 id
        this.form.id = id
        // 回显其他字段值
        this.$set(this.form, 'bpmKey', bpmKey)
        this.$set(this.form, 'strategyName', strategyName)
        this.$set(this.form, 'priorityLevel', Number(priorityLevel))
        this.$set(this.form, 'remark', remark)
        this.$set(this.form, 'effect', effect)
      } else {
        this.eventSrcIds = [] // 事件来源多选清空
        this.eventUrgents = [] // 紧急程度多选清空
        this.eventTypeId = '' // 事件类型清空
      }
    },
    // 匹配到各个因子，且遍历出选项的 id, strategyId 就是这个表单的id； 从编辑数据对象中获取
    matchStrategyKey(strategyKeyAndValueList = []) {
      const event_origin = strategyKeyAndValueList.filter(
        (item) =>
          item.strategyKey === 'event_origin' &&
                    item.strategyValue !== '-1'
      )
      // 事件来源
      this.eventSrcIds = event_origin[0]?.strategyValue.split(',') || []
      const event_urgent_level = strategyKeyAndValueList.filter(
        (item) =>
          item.strategyKey === 'event_urgent_level' &&
                    item.strategyValue !== '-1'
      )
      // 紧急程度
      this.eventUrgents = event_urgent_level[0]?.strategyValue.split(',') || []
      const event_type = strategyKeyAndValueList.filter(
        (item) =>
          item.strategyKey === 'event_type' &&
                    item.strategyValue !== '-1'
      )
      // 选择的事件类型，目前单选，后续可能多选
      this.eventTypeId = event_type[0]?.strategyValue || ''
    }
  }
}
</script>
<style lang="scss" scoped>
.setting-form-class {
    height: 75vh;
    overflow-y: auto;
    overflow-x: hidden;
    .el-select, .el-cascader {
        width: 100%;
    }
}
::v-deep .el-checkbox__label {
    font-size: 14px;
    padding-left: 4px;
    vertical-align: middle;
    color: #4b4b4b;
    font-family: PingFangSC-Regular, PingFang SC;
    line-height: 20px;
}
::v-deep .el-form-item__content {
    line-height: 40px;
    position: relative;
    font-size: 14px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #4B4B4B;
}
::v-deep .el-dialog__title {
    font-size: 14px;
    color: #202020;
}
</style>

