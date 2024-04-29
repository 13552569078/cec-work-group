<!--
 * @description 事件审核--调度弹窗表单
 * @date 2020-08-25
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    title="事件调度"
    width="624px"
    top="20vh"
    :content-height="contentHeight"
    v-on="$listeners"
    @confirm="_confirm"
    @cancle="_cancle"
  >
    <el-form ref="form" :model="form" inline label-position="top" class="dispatch-dialog-class" :rules="rules">
      <el-form-item label="调度方式" prop="action" class="row-one">
        <el-radio-group v-model="form.action">
          <el-radio v-for="(item, index) in dispatchOptions" :key="item.value || index" :label="item.value">{{ item.label
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 只有调度才可以调度到人，上报下发还是保持调度到角色 -->
      <el-form-item v-if="form.action !== 'whistle'" label="主办" prop="mainDept" class="row-one">
        <div class="main-title main-obj">调度对象</div>
        <div class="smart-post">
          <popover-select
            ref="mainRef"
            key="main"
            title="调度组织"
            class="smart-post-select"
            :is-need-fetch-system="form.action === 'dispatch'"
            :right-title="form.action === 'dispatch' ? '调度角色或人员' : '调度角色'"
            :has-user="form.action === 'dispatch'"
            :dep-single="true"
            :povselect="povselect"
            :tree-data="rawDeptOptions"
            :value.sync="currentDept"
            :select-text="mainSelectText"
          />
          <!-- 只有调度有智能派单 -->
          <el-button v-if="form.action==='dispatch'" type="primary" @click="openTable">智能派单</el-button>
        </div>
        <!--  只有调度有智能派单 智能推荐table -->
        <transition name="fade">
          <div v-if="showDispatchTableData" class="dispatch-smart-table">
            <el-table :data="dispatchTableData" style="width: 100%" max-height="300">
              <el-table-column type="index" width="55" fixed="left" :index="indexMethod" class-name="table-column-index" />
              <el-table-column
                label=" "
                width="50"
              >
                <template slot-scope="{ row }">
                  <el-radio v-model="dispatchOrg" :label="row.deptId" @change="changeOrg(dispatchOrg)" />
                </template>
              </el-table-column>
              <el-table-column prop="deptName" label="推荐部门" width="100">
                <template slot-scope="{ row }">
                  <span :title="row.deptName" class="ellipse">{{ row.deptName }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="eventTitle" label="相似事件" width="180">
                <template slot-scope="{ row }">
                  <span :title="row.eventTitle" class="ellipse">{{ row.eventTitle }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="prob" label="相似度">
                <template slot-scope="{ row }">
                  <cestc-progress :show-label="false" :precent="row.prob" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </transition>
      </el-form-item>
      <!-- 协办、知会可以为空，不校验，可以不用包裹 form-item -->
      <div v-if="form.action === 'dispatch'" class="row-one mb20 pl-10">
        <div class="title">
          <div class="flex1">协办</div>
          <div class="default-title">调度对象</div>
        </div>
        <popover-select
          ref="subRef"
          key="sub"
          type="sub"
          class="flex1"
          title="调度组织"
          :has-user="false"
          :tree-data="rawDeptOptions"
          :value.sync="subDept"
          :select-text="subSelectText"
          :disabled="hasCurrentDept"
          :multiple="true"
          @confim="subDeptConfim"
        />
      </div>
      <!-- 知会 -->
      <div v-if="form.action === 'dispatch'" class="row-one mb20 notify pl-10">
        <div class="title">
          <div class="flex1">知会</div>
          <div class="default-title">调度对象</div>
        </div>
        <popover-select
          ref="notifyRef"
          key="notify"
          type="notify"
          class="flex1"
          title="调度组织"
          :has-user="false"
          :tree-data="notifyDeptOptions"
          :value.sync="notifyDept"
          :disabled="hasCurrentDept"
          :select-text="notifySelectText"
          :multiple="true"
          @confim="notifyDeptConfim"
        />
      </div>
      <el-form-item label="处理说明" prop="comment" class="row-one">
        <el-input v-model="form.comment" type="textarea" maxlength="1000" :rows="5" placeholder="请输入内容" show-word-limit />
      </el-form-item>
    </el-form>
  </cestc-dialog>
</template>
<script>
import { validCommitStr } from '@/utils/validate'
import moduleSrv from '@/api/dispatch'
import { removeEmptyChildren, ArrayMinusB } from '@/utils'
import PopoverSelect from '@/components/PopoverSelect'
import { SUCCESS_CODE } from '@/constants'
import resizeObserverMixin from '@/mixin/resizeObserverMixin'

const checkCommitStr = (rule, value, callback) => {
  if (validCommitStr(value)) {
    // 是否包含了特殊字符
    return callback(new Error('处理说明包含了特殊字符，请检查后提交'))
  } else {
    callback()
  }
}

export default {
  name: 'DispatchDialog',
  components: {
    PopoverSelect
  },
  mixins: [resizeObserverMixin],
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
        action: 'dispatch', // 默认调度
        comment: '',
        eventDispatchSubjects: [],
        eventNofityVOS: []
      },
      rawDeptOptions: [],
      notifyDeptOptions: [], // 知会下拉数
      currentDept: {}, // 主调度对象
      subDept: {}, // 协办调度对象
      notifyDept: {}, // 知会调度对象
      rules: {
        action: [{ required: true, message: '请选择调度方式', trigger: 'blur' }],
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
      },
      value: [],
      isShowOrgTree: false,
      povselect: [],
      contentHeight: 570,
      showDispatchTableData: false, // 智能派单dialog
      dispatchOrg: '', // 智能派单实体组织切换
      dispatchTableData: [] // 智能派单tableData
    }
  },
  computed: {
    eventId() {
      return this.$route.query.id
    },
    hasCurrentDept() {
      return !this.currentDept?.role?.length
    },
    dispatchOptions() {
      // 根据按钮权限，选择调度、上报、还是下发
      const options = []
      const arr = this.todoButtons
      if (arr.length) {
        arr.forEach((item) => {
          if (item.indexOf('dispatch_dispatch') > -1) {
            options.push({
              value: 'dispatch',
              label: '调度'
            })
          } else if (item.indexOf('whistle') > -1) {
            options.push({
              value: 'whistle',
              label: '吹哨申请'
            })
          } else if (item.indexOf('dispatch_up') > -1) {
            options.push({
              value: 'up',
              label: '上报'
            })
          } else if (item.indexOf('dispatch_down') > -1) {
            options.push({
              value: 'down',
              label: '下发'
            })
          }
        })
      }
      return options
    },
    mainSelectText() {
      // 机构、角色、人员  原始逻辑
      // const { dept = {}, role = {}} = this.currentDept
      // if (!dept.name || !role.length) {
      //   return []
      // }
      // const res = role.map((item) => {
      //   return {
      //     ...item,
      //     deptName: `${item.deptObj.name}/${item.name}`
      //   }
      // })
      // return res

      // 此处修改为 主调度对象 三方系统和角色不是必填
      const { dept = {}, role = {}} = this.currentDept
      if (!dept.name) {
        return []
      }
      const res = role.map((item) => {
        return {
          ...item,
          deptName: item.name ? `${item.deptObj.name}/${item.name}` : `${item.deptObj.name}`
        }
      })
      return res
    },
    // 协办回显--文字
    subSelectText() {
      return this.formatToText(this.subDept)
    },
    // 知会回显--文字
    notifySelectText() {
      return this.formatToText(this.notifyDept)
    },

    selectedDept() {
      // 过滤掉 id 为空，或机构 id 为空的项
      const arr = [this.currentDept, ...this.subDept].filter(
        (item) => item.dept && item.dept.id
      )
      return arr.map((item) => {
        const obj = item
        obj.id = item.dept.id
        return obj
      })
    },
    subDeptOptions() {
      // 排除主办选择项、排除协办已经选择项
      return ArrayMinusB(this.rawDeptOptions, [...this.selectedDept], 'id', true)
    }
  },
  watch: {
    'form.action': {
      // 调度方式发生变化的时候，调度对象也需要改变更新
      handler(val, old) {
        if (!val || val === old) return
        this.povselect = []
        this.currentDept = {} // 主调度对象
        this.showDispatchTableData = false // 调度框隐藏
        this.$nextTick(() => {
          this.$refs.mainRef.active = 0
          // 创建观察实例
          const _el = this.$refs.form?.$el
          this.initObServer(_el, (entries) => {
            const targetEl = entries[0].target
            if (targetEl) {
              this.contentHeight = targetEl.offsetHeight
            }
          })
        })
        this.subDept = [] // 协办调度对象
        this.notifyDept = [] // 知会调度对象
        this.form.eventDispatchSubjects = []
        this.form.eventNofityVOS = []
        const params = {
          taskId: this.taskId,
          action: val
        }
        // 只要不是吹哨，都需要更新调度组织
        if (val !== 'whistle') {
          this.getDispatchDept(params)
        }
      }
    }
  },
  async created() {
    // 根据 buttonCode 默认选择是调度、还是上报、下发、吹哨申请
    const actionMap = {
      'dispatch_dispatch': 'dispatch',
      'dispatch_up': 'up',
      'dispatch_down': 'down',
      'whistle': 'whistle'
    }
    this.$set(this.form, 'action', actionMap[this.buttonCode])
    // 先查询调度、上报、下发数据
    const params = {
      taskId: this.taskId,
      action: this.form.action
    }
    await this.getDispatchDept(params)
    // 知会下拉数据获取
    this.getNotifyMap()
    // 智能推荐
    const { data } = await moduleSrv.getSimilarity(this.eventId)
    this.dispatchTableData = data
  },

  methods: {
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    openTable() {
      this.showDispatchTableData = !this.showDispatchTableData
    },
    async changeOrg(key) {
      // 设置选中
      this.$nextTick(() => {
        this.$refs.mainRef.setCheckedKeys(key)
        this.dispatchOrg = ''
        this.showDispatchTableData = false
      })
      // await this.$nextTick()
      // this.$refs.mainRef.popVisible = true // 默认打开调度对象
    },
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
    showOrgTree() {
      this.isShowOrgTree = !this.isShowOrgTree
    },

    handleNodeClick(node) {
      // 如果是知会，则需要重新调用接口
      this.selectedTreeNode = node
      if (this.type === 'notify') {
        moduleSrv.getNotifyRoleByDeptId(node.id).then((res) => {
          this.tableData = res.data || []
        })
      } else {
        this.tableData = node.roleVOList
      }
    },
    // 协办选定触发
    subDeptConfim(value) {
      this.type = 'sub'
      this.subDept = value
    },
    // 知会选定触发
    notifyDeptConfim(value) {
      this.type = 'notify'
      this.notifyDept = value
    },

    getDispatchDept(params) {
      // 先清空
      this.rawDeptOptions = []
      moduleSrv.getDispatchDepts(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          // 递归处理，把空数组的chilren 去掉
          this.rawDeptOptions = removeEmptyChildren(res.data) || []
        } else {
          this.rawDeptOptions = []
          console.warn('getDispatchDepts 接口报错')
        }
      })
    },
    // 知会下拉数据获取
    getNotifyMap() {
      moduleSrv.getNotifyMap().then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.notifyDeptOptions = res.data || []
        } else {
          this.notifyDeptOptions = []
          console.warn('getNotifyMap 接口报错')
        }
      })
    },
    // 提交的时候，需要重组数据结构向上返回
    _confirm() {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        //  先把数据重置
        this.form.eventDispatchSubjects = []
        this.form.eventNofityVOS = []
        this.$nextTick(() => {
          // 主调度对象拼装
          const { dept = {}, role = [] } = this.currentDept
          if (!role.length && this.form.action !== 'whistle') {
            this.$message({
              type: 'warning',
              message: '主办为必填'
            })
            return
          }
          // 根据 role 对象的 type 字段判断是角色/人员调度/系统
          let roleType = role[0]?.type || 'role'
          // 处理仅仅选择的是 机构没选择 系统 assignType为3
          if (role[0]?.type === 'system' && !role[0]?.platformCode && !role[0]?.platformName) {
            roleType = 'dept'
          }
          // 处理角色
          if (role[0]?.type === 'role' && !role[0]?.roleCode && !role[0]?.fxRoleId) {
            roleType = 'dept'
          }
          const assignTypeMap = { role: 0, user: 1, system: 2, dept: 3 }
          const assignType = assignTypeMap[roleType]
          const mainDispath = assignType === 2 ? {
            assignSystemId: role[0]?.id,
            assignSystemName: role[0]?.name,
            deptId: dept.id,
            deptName: dept.name,
            subjectType: '1'
          } : {
            roleId: role[0]?.id,
            roleName: role[0]?.name,
            assignUserId: role[0]?.id, // 如果是人员调度，则后端取该字段，否则取上面角色字段
            assignUserName: role[0]?.name,
            deptId: dept.id,
            deptName: dept.name,
            subjectType: '1'
          }
          // 协办对象拼装, 因协办可以为空的情况，先过滤为空的数据
          const subDispatch =
            this.subDept?.role?.map((item) => {
              return {
                roleId: item.id,
                roleName: item.name,
                deptId: item.deptObj.id,
                deptName: item.deptObj.name,
                subjectType: '2'
              }
            }) || []
          // 知会对象拼装, 因知会可以为空的情况，先过滤为空的数据
          const notifyDispatch =
            this.notifyDept?.role?.map((item) => {
              return {
                roleId: item.id,
                roleName: item.name,
                deptId: item.deptObj.id,
                deptName: item.deptObj.name
              }
            }) || []
          this.form.eventDispatchSubjects = [mainDispath, ...subDispatch]
          this.form.eventNofityVOS = [...notifyDispatch]
          // 吹哨申请，需要删除eventDispatchSubjects
          if (this.form.action === 'whistle') {
            delete this.form.eventDispatchSubjects
          }
          this.$emit('confirm', {
            assignType,
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
  font-family: PingFangSC-Regular, PingFang SC;
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
      cursor: pointer;
    }

    .main-title {
      font-size: 14px;
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
        font-weight: 500;
        color: #4b4b4b;
      }

      .default-title {
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

// 智能推荐style
.smart-post {
  display: flex;
  gap: 16px;

  .smart-post-select {
    flex: 1;
  }
}

.dispatch-smart-table {
  margin-top: 20px;
  width: 100%;
}

::v-deep {
  .dispatch-smart-table{
    .el-radio__label{
      display: none;
    }
  }
  .el-form-item{
    margin-right: 0px !important;
  }
}
.pl-10{
  padding-left:10px
}
.mr-10{
  margin-left:10px
}

.ellipse{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.main-obj{
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
