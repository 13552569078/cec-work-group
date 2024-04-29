<!--
 * @description 事件审核--吹哨调度弹窗
 * @date 2022-06-29
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    title="事件调度"
    width="624px"
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
      class="dispatch-dialog-class"
      :rules="rules"
    >
      <!-- 只有一次吹哨有 -->
      <el-form-item v-if="buttonCode === 'whistle_dispatch'" label="主办" prop="mainDept" class="row-one">
        <div class="main-title">调度对象</div>
        <popover-select
          key="main"
          title="调度组织"
          :tree-data="rawDeptOptions"
          :value.sync="currentDept"
          :select-text="mainSelectText"
        />
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
import { removeEmptyChildren } from '@/utils'
import PopoverSelect from '@/components/PopoverSelect'
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
  name: 'WhistleDialog',
  components: {
    PopoverSelect
  },
  props: {
    buttonCode: {
      type: String,
      default: ''
    },
    todoButtons: {
      type: Array,
      default: () => []
    },
    taskId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    const deptIdNotEmpty = (rule, value, callback) => {
      if (!this.mainSelectText) {
        return callback(new Error('调度对象不能为空'))
      } else {
        callback()
      }
    }

    return {
      form: {
        comment: '',
        eventDispatchSubjects: []
      },
      rawDeptOptions: [],
      currentDept: {}, // 主调度对象
      rules: {
        mainDept: [
          {
            required: true,
            validator: deptIdNotEmpty,
            trigger: 'blur'
          }
        ],
        comment: [
          { required: true, message: '请输入说明', trigger: 'blur' },
          { validator: checkCommitStr, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    mainSelectText() {
      const { dept = {}, role = {}} = this.currentDept
      if (!dept.name || !role.length) {
        return []
      }
      const res = role.map((item) => {
        return {
          ...item,
          deptName: `${item.deptObj.name}/${item.name}`
        }
      })
      return res
    }

  },
  created() {
    // 先查询吹哨调度对象
    const params = {
      taskId: this.taskId
    }
    if (this.buttonCode === 'whistle_dispatch') this.getWhistleDept(params)
  },

  methods: {
    // 回显文字整理
    formatToText({ dept = {}, role = {}}) {
      if (!dept.name || !role.length) {
        return []
      }
      const res = role.map((item) => {
        return {
          ...item,
          deptName: `${item.deptObj.name}/${item.name}`
        }
      })
      return res
    },
    getWhistleDept(params) {
      moduleSrv.getWhistleDept(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          // 递归处理，把空数组的chilren 去掉
          this.rawDeptOptions = removeEmptyChildren(res.data) || []
        } else {
          this.rawDeptOptions = []
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
          // 主调度对象拼装
          const { dept = {}, role = [] } = this.currentDept
          if (!role.length && this.buttonCode === 'whistle_dispatch') {
            this.$message({
              type: 'warning',
              message: '主办为必填'
            })
            return
          }
          // 根据 role 对象的 type 字段判断是角色还是人员调度
          const assignType = role[0]?.type === 'role' ? 0 : 1

          const mainDispath = {
            roleId: role[0]?.id,
            roleName: role[0]?.name,
            assignUserId: role[0]?.id, // 如果是人员调度，则后端取该字段，否则取上面角色字段
            assignUserName: role[0]?.name,
            deptId: dept.id,
            deptName: dept.name,
            subjectType: '1'
          }
          this.form.eventDispatchSubjects = [mainDispath]
          this.$emit('confirm', {
            assignType,
            buttonCode: this.buttonCode,
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
.dispatch-dialog-class {
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
    .title,
    .item {
      display: flex;
      flex-flow: column;
      // align-items: center;
      cursor: pointer;
    }
    ::v-deep .el-form-item__label {
      padding: 0;
    }
    .main-title {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #202020;
    }
    .title {
      padding-bottom: 10px;
      .flex1 {
        padding-bottom: 16px;
      }
      .flex1,
      .default-title {
        flex: 1;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #4b4b4b;
      }
      .default-title {
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #202020;
      }
    }
    .can-remove {
      color: #36a4ff;
    }

    .action {
      width: 60px;
      text-align: center;
    }
  }
}
</style>
