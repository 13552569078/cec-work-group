<!--
 * @description 计划任务-定制任务计划
 * @date 2020-11-22
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    title="定制任务计划"
    width="682px"
    top="10vh"
    append-to-body
    v-on="$listeners"
    @confirm="_confirm"
    @cancle="_cancle"
  >
    <el-form
      ref="form"
      :model="form"
      inline
      label-position="top"
      class="task-config-add"
      :rules="rules"
    >
      <el-form-item label="计划名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item
        label="计划生效时间"
        prop="planStartTime"
        class="form-item-two"
      >
        <cestc-date-picker
          v-model="form.planStartTime"
          type="datetime"
          clearable
          value-format="yyyy-MM-dd HH:mm:ss"
          add-default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item
        label="计划失效时间"
        prop="planEndTime"
        class="form-item-two mr0"
      >
        <cestc-date-picker
          v-model="form.planEndTime"
          type="datetime"
          clearable
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="周期配置" prop="cron">
        <el-input v-model="cronText" placeholder="corn表达式" readonly>
          <i
            slot="suffix"
            class="el-icon-setting"
            @click.stop="cronDialog = true"
          />
        </el-input>
      </el-form-item>
      <el-form-item label="任务类型" prop="taskType" class="form-item-two">
        <el-select
          v-model="form.taskType"
          placeholder="请选择"
          @change="changeTaskType"
        >
          <el-option
            v-for="(item, index) in taskTypeOptions"
            :key="item.id || index"
            :label="item.dictDesc"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="任务对象"
        prop="taskObject"
        class="form-item-two mr0"
      >
        <el-select
          v-model="form.taskObject"
          placeholder="请选择"
          @change="$forceUpdate()"
        >
          <el-option
            v-for="(item, index) in taskPersonOptions"
            :key="item.id || index"
            :label="item.dictDesc"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发布范围" prop="deptIds">
        <!-- 父子不关联-checkStrictly， -->
        <cestc-cascader
          ref="cascader"
          v-model="selectedMap"
          :options="rangeMap"
          :show-all-levels="false"
          :props="{
            checkStrictly: true,
            value: 'id',
            label: 'name',
            multiple: true,
          }"
        />
      </el-form-item>
      <el-form-item label="执行角色" prop="roleId" class="form-item-two">
        <el-select v-model="form.roleId" placeholder="请选择">
          <el-option
            v-for="(item, index) in planTaskRoleOptions"
            :key="item.id || index"
            :label="item.dictDesc"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="周期任务数" prop="count" class="form-item-two mr0">
        <el-input-number v-model="form.count" :min="1" />
      </el-form-item>
      <el-form-item label="任务时长" prop="limitTime" class="form-item-two">
        <el-input-number
          v-model="form.limitTime"
          :min="1"
          placeholder="请输入数字"
        />
      </el-form-item>
      <el-form-item label="单位" class="form-item-two mr0">
        <el-select v-model="form.limitTimeunit" placeholder="请选择">
          <el-option
            v-for="(item, index) in limitTimeunitOption"
            :key="item.value || index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="任务描述" prop="taskDesc">
        <el-input
          v-model="form.taskDesc"
          type="textarea"
          maxlength="1000"
          :rows="5"
          placeholder="请输入内容"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="附件" prop="planTaskMediaList">
        <cestc-upload
          accept=".doc,.xlsx, .xls"
          :media-list="form.planTaskMediaList"
          @eventMedia="updateEventMedia"
        >
          <span slot="tips">请上传word或excel格式文档，大小不能超过500M</span>
        </cestc-upload>
      </el-form-item>
    </el-form>
    <!-- cron 表达式 -->
    <cestc-cron
      ref="cron"
      :echo-cron="form.cron"
      :visible.sync="cronDialog"
      :cron-text.sync="cronText"
      @confirm="_ok"
    />
  </cestc-dialog>
</template>
<script>
import cestcCron from '@/components/CestcCron'
import moduleSrv from '@/api/dispatch'
import { getTreeParent } from '@/utils'
import { SUCCESS_CODE } from '@/constants'
export default {
  name: 'TaskConfig',
  components: {
    cestcCron
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    rangeMap: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const checkLength = (rule, value, callback) => {
      if (value.length > 20) {
        // 校验长度
        return callback(new Error('名称过长,请输入长度20以内的名称'))
      } else {
        callback()
      }
    }
    const checkCron = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    return {
      selectedMap: '',
      limitTimeunitOption: [
        {
          value: 1,
          label: '小时'
        },
        {
          value: 2,
          label: '日'
        },
        {
          value: 3,
          label: '月'
        }
      ],
      form: {},
      cron: '',
      rules: {
        name: [
          { required: true, message: '必填', trigger: 'blur' },
          { validator: checkLength, trigger: 'blur' }
        ],
        planStartTime: [{ required: true, message: '必填', trigger: 'blur' }],
        cron: [
          {
            required: true,
            validator: checkCron,
            trigger: 'blur'
          }
        ],
        roleId: [{ required: true, message: '必填', trigger: 'blur' }],
        taskType: [{ required: true, message: '必填', trigger: 'blur' }],
        count: [{ required: true, message: '必填', trigger: 'blur' }],
        limitTime: [{ required: true, message: '必填', trigger: 'blur' }],
        taskDesc: [{ required: true, message: '必填', trigger: 'blur' }]
        // planTaskMediaList: [
        //   { required: true, message: '必填', trigger: 'blur' },
        // ],
      },
      cronDialog: false,
      cronText: '',
      taskPersonKey: ''
    }
  },
  computed: {
    planTaskRoleOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('plan_task_role')
    },
    taskTypeOptions() {
      return this.$store.getters.getBsDictsByType('plan_task_type')
    },
    taskPersonOptions() {
      return this.$store.getters.getBsDictsByType(this.taskPersonKey)
    },
    isAdd() {
      return !this.info.id
    }
  },
  watch: {
    // 监听弹窗开启状态
    '$attrs.visible': {
      immediate: true,
      handler(visible) {
        if (visible) {
          this.initFormData()
        } else {
          this.form = {}
        }
      }
    }
  },
  methods: {
    // cron 表达式转译中文
    translateToChinese(cron) {
      moduleSrv.translateToChinese({ cron }).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.cronText = res.data
        }
      })
    },
    // 处理回显及机构数据获取
    async initFormData() {
      if (!this.isAdd) {
        await this.translateToChinese(this.info.cron)
        // 编辑
        // 表单回显
        this.form = this.info
        // 多角色 id 进行字符串转换操作
        this.$set(this.form, 'roleId', String(this.info.roleId))
        // 对机构进行数据转换，进行回显
        this.tranformDeptIds()
      }
    },
    tranformDeptIds() {
      const { deptIds = '' } = this.info
      const arr = deptIds.split(',') // 多个机构
      const targetArray = []
      arr.forEach((item) => {
        targetArray.push(getTreeParent(this.rangeMap, item, 'pid'))
      })
      this.selectedMap = targetArray.map((subArray) => {
        return subArray.map((item) => item.id)
      })
    },

    updateEventMedia(fileList = []) {
      this.$set(this.form, 'planTaskMediaList', fileList)
    },
    // cron 表达式
    _ok(cron) {
      this.$set(this.form, 'cron', cron)
      // 针对 cron 做一次校验
      this.$refs.form.validateField('cron')
    },
    changeTaskType(val) {
      this.form.taskObject = ''
      this.taskPersonKey = val
    },
    // 提交
    _confirm() {
      this.$refs.form.validate((valid) => {
        const params = {
          ...this.form
        }
        if (!valid) return
        let servicePromise = ''
        // 需要把 deptids 进行拼接，只传叶子节点id
        const nodes = this.$refs.cascader?.$refs.cascaderRef.getCheckedNodes()
        const deptIds = nodes.map((item) => item.value).join(',')
        console.log('deptIds===', deptIds)
        params.deptIds = deptIds
        if (this.isAdd) {
          servicePromise = moduleSrv.addFormulate(params)
        } else {
          // 把 id 传过去
          if (!params.id) params.id = this.info.id
          servicePromise = moduleSrv.updateFormulate(params)
        }
        servicePromise.then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.$message({
              type: 'success',
              message: '处理成功!'
            })
            // 告诉父组件，更新列表
            this.$emit('success')
          } else {
            this.$message({
              type: 'error',
              message: res.message || '处理失败!'
            })
          }
        })
      })
    },
    // 取消关闭弹窗
    _cancle() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss">
.task-config-add {
  .el-form-item {
    &.form-item-two {
      &.mr0 {
        width: 50%;
        margin-right: 0;
      }
      width: calc(50% - 16px);
    }
    width: 100%;
    .el-select,
    .el-date-editor,
    .el-cascader,
    .el-input-number,
    .cestc-date-picker {
      width: 100%;
    }
  }
}
</style>
