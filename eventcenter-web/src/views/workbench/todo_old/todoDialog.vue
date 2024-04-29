<!--
 * @description 事件录入新增、编辑弹窗
 * @date 2020-08-24
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    :title="matchTitle"
    :width="dialogWidth"
    top="10vh"
    v-on="$listeners"
  >
    <div class="content-wrapper">
      <el-form
        ref="form"
        :model="form"
        label-position="top"
        class="todo-class"
      >
        <template v-if="dialogMode === 'customizeTop'">
          <el-form-item label="事件来源" prop="eventSrcIdDesc">
            <el-select
              v-model="form.eventSrcIdDesc"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in eventSourceOptions"
                :key="item.id || index"
                :label="item.dictDesc"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="事件类型" prop="eventTypeId">
            <event-type-cascader
              ref="cascader"
              :check-strictly="true"
              :child-type.sync="form.eventTypeIdDesc"
              :parent-type.sync="form.eventTypeLIdDesc"
              :middle-type.sync="form.eventTypeMIdDesc"
            />
          </el-form-item>
          <p class="bold">置顶字体配置</p>
          <el-form-item label="是否加粗" prop="fontBold">
            <el-radio-group v-model="form.fontBold">
              <el-radio
                v-for="(item, index) in fontBoldOptions"
                :key="item.dictValue || index"
                :label="item.dictValue"
              >{{ item.dictDesc }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="字体颜色" prop="fontColor">
            <el-radio-group v-model="form.fontColor">
              <el-radio
                v-for="(item, index) in fontColorOptions"
                :key="item.dictValue || index"
                :label="item.dictValue"
                class="font-color-radio"
              >
                <span :class="{ circle: true, [`color-${item.dictValue}`]: true}" />
                <span>
                  {{ item.dictDesc }}
                </span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-form>
    </div>
    <!-- 自定义操作按钮 -->
    <div slot="footer">
      <el-button @click.stop="_cancle">取消</el-button>
      <el-button
        type="primary"
        @click.stop="_confirm('submit')"
      >确定
      </el-button>
    </div>
  </cestc-dialog>
</template>
<script>
/* eslint-disable */
import eventTypeCascader from '@/views/event/components/EventTypeCascader'
import leafletMapMixin from '@/mixin/leafletMapMixin'

export default {
  name: 'TodoDialog',
  components: {
    eventTypeCascader
  },
  mixins: [leafletMapMixin],
  data() {
    return {
      form: {},
      eventTypeLIdDesc: '',
      eventTypeMIdDesc: '',
      eventTypeIdDesc: '',
    }
  },
  computed: {
    dialogWidth() {
      return '456px'
    },
    dialogMode() {
      return this.$attrs.mode || 'add'
    },
    matchTitle() {
      const key = this.dialogMode
      const obj = {
        customizeTop: '置顶配置',
      }
      return obj[key]
    },
    eventSourceOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_origin')
    },
    fontBoldOptions() {
      return this.$store.getters.getBsDictsByType('yesOrNo')
    },
    fontColorOptions() {
      return [
        { dictDesc: '蓝色', dictValue: 'blue' },
        { dictDesc: '红色', dictValue: 'red' },
      ]
    }
  },
  watch: {
    '$attrs.visible': {
      // immediate: true,
      handler(val) {
        if (val) {
          this.form = { ...this.$attrs.editingdata }
        }
      }
    }
  },
  methods: {
    // 确认按钮触发
    _confirm() {
      // 区分是保存、还是提交
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const params = { ...this.form }
          const topConfigKeys = ['eventSrcIdDesc', 'eventTypeLIdDesc', 'eventTypeMIdDesc', 'eventTypeIdDesc']
          const isSet = topConfigKeys.reduce((prev, key) => {
            return prev || params[key]
          }, false)
          if (!isSet) {
            this.$message('至少选择一个筛选条件')
            return
          }
          this.$store.commit('dispatch/SET_TODO_CUSTOMIZE_TOP_CONFIG', params)
          this._cancle()
        }
      })
    },
    // 取消、关闭弹窗
    _cancle() {
      this.$emit('cancle')
    },
  },
}
</script>
<style lang="scss" scoped>
.content-wrapper {
  display: flex;
}

.todo-class {
  width: 100%;

  .bold {
    font-size: 14px;
    color: #202020;
    font-weight: 500;
  }

  .el-form-item {
    width: calc(100%);
    margin-right: 10px;

    .el-cascader,
    .el-select {
      // 修复上级事件类型样式问题
      width: 100%;
    }

    .font-color-radio {
      .circle {
        width: 10px;
        height: 10px;
        border-radius: 5px;
        margin: 0 8px;
        display: inline-block;

        &.color-blue {
          background: #36A4FF;
        }

        &.color-red {
          background: #FF4D4F;
        }
      }
    }
  }
}
</style>
