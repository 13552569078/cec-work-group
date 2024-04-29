<!--
 * @description 事件处理--转派弹窗表单
 * @date 2020-09-16
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    title="事件处理"
    width="466px"
    top="20vh"
    v-on="$listeners"
    @confirm="_confirm"
    @cancle="_cancle"
  >
    <el-form
      ref="form"
      :model="form"
      inline
      label-position="top"
      class="to-other-dialog-class"
      :rules="rules"
    >
      <el-form-item label="调度方式" prop="action" class="row-one">
        <!-- 方式固定 -->
        <el-select v-model="form.action" disabled>
          <el-option
            v-for="(item, index) in dispatchOptions"
            :key="item.value || index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="调度对象" prop="deptId">
        <!-- 暂时没有从调度、知会等 -->
        <el-select v-model="deptId" placeholder="请选择">
          <el-option
            v-for="(item, index) in rawDeptOptions"
            :key="item.id || index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="调度角色" prop="roleId">
        <el-select v-model="roleId" placeholder="请选择" :disabled="!deptId">
          <el-option
            v-for="(item, index) in rolesOptions"
            :key="item.id || index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="处理说明" prop="comment" class="row-one">
        <el-input
          v-model="form.comment"
          type="textarea"
          maxlength="1000"
          :rows="5"
          placeholder="请输入内容"
          show-word-limit
        />
      </el-form-item>
    </el-form>
  </cestc-dialog>
</template>
<script>
import { validCommitStr } from '@/utils/validate'
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'

const checkCommitStr = (rule, value, callback) => {
  if (validCommitStr(value)) {
    // 是否包含了特殊字符
    return callback(new Error('处理说明包含了特殊字符，请检查后提交'))
  } else {
    callback()
  }
}

export default {
  name: 'ToOtherDialog',
  props: {
    taskId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    const deptIdNotEmpty = (rule, value, callback) => {
      if (!this.deptId) {
        return callback(new Error('调度对象不能为空'))
      } else {
        callback()
      }
    }
    const roleIdNotEmpty = (rule, value, callback) => {
      if (!this.roleId) {
        return callback(new Error('调度角色不能为空'))
      } else {
        callback()
      }
    }
    return {
      form: {
        action: 'change',
        comment: '',
        eventDispatchSubjects: []
      },
      rawDeptOptions: [],
      deptId: '',
      roleId: '',
      rules: {
        deptId: [
          {
            required: true,
            validator: deptIdNotEmpty,
            trigger: 'blur'
          }
        ],
        roleId: [
          {
            required: true,
            validator: roleIdNotEmpty,
            trigger: 'blur'
          }
        ],
        comment: [
          { required: true, message: '请输入处理说明', trigger: 'blur' },
          { validator: checkCommitStr, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    dispatchOptions() {
      return [
        {
          value: 'change',
          label: '转派'
        }
      ]
    },
    rolesOptions() {
      const match = this.rawDeptOptions.filter(
        (item) => item.id === this.deptId
      )
      return match.length ? match[0].roleVOList : []
    },
    currentDept() {
      const match = this.rawDeptOptions.filter(
        (item) => item.id === this.deptId
      )
      return match.length ? match[0] : {}
    },
    currentRole() {
      const match = this.rolesOptions.filter((item) => item.id === this.roleId)
      return match.length ? match[0] : {}
    }
  },
  watch: {
    deptId() {
      this.roleId = ''
    }
  },
  created() {
    this.deptId = this.roleId = ''
    this.form.eventDispatchSubjects = []
    const params = {
      taskId: this.taskId,
      action: 'change'
    }
    this.getDispatchDept(params)
  },
  methods: {
    getDispatchDept(params) {
      moduleSrv.getDispatchDepts(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.rawDeptOptions = res.data || []
        } else {
          console.warn('getDispatchDepts 接口报错')
        }
      })
    },
    // 提交的时候，需要重组数据结构向上返回
    _confirm() {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        //  先把数据重置
        this.form.eventDispatchSubjects = []
        this.$nextTick(() => {
          this.form.eventDispatchSubjects.push({
            roleId: this.roleId,
            roleName: this.currentRole.name,
            deptId: this.currentDept.id,
            deptName: this.currentDept.name,
            subjectType: '1'
          })
          this.$emit('confirm', {
            ...this.form
          })
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
<style lang="scss" scoped>
.to-other-dialog-class {
  .el-form-item {
    &:nth-child(3) {
      margin-right: 0;
    }
    width: calc(50% - 6px);
    .el-select {
      width: 100%;
    }
  }
  .row-one {
    width: 100%;
  }
}
</style>
