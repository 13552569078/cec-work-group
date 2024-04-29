<!--
 * @description 权责清单--编辑弹窗
 * @date 2020-08-25
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    width="666px"
    top="20vh"
    class="strategy-dialog"
    :content-height="contentHeight"
    v-on="$listeners"
  >
    <span slot="title">{{ mode === "view" ? "查看" : "设置" }}权责清单</span>
    <div ref="contentRef" class="dialog-wrapper">
      <!-- 详情模式 -->
      <ul v-if="mode === 'view'" class="view-wrapper">
        <li class="view-item">
          <span class="label">事件类型</span>
          <span class="value">{{ eventClass || "-" }}</span>
        </li>
        <li class="view-item">
          <span class="label">处置级别</span>
          <span class="value">{{ detail.eventLevelName || "-" }}</span>
        </li>
        <li class="view-item">
          <span class="label">主处置部门和角色</span>
          <span class="value">{{ detail.mainDutyRole || "-" }}</span>
        </li>
        <li class="view-item">
          <span class="label">从处置部门和角色</span>
          <span class="value">{{ detail.slaveDutyRole || "-" }}</span>
        </li>
      </ul>
      <el-form
        v-else
        ref="formRef"
        :model="form"
        :rules="mode !== 'view' ? rules : {}"
        inline
        label-position="top"
      >
        <el-form-item label="事件类型" class="row" :required="mode !== 'view'">
          <el-input v-model="eventClass" disabled />
        </el-form-item>
        <el-form-item label="处置级别" class="row" prop="eventLevel">
          <el-select v-model="form.eventLevel" placeholder="请选择" @change="_change">
            <el-option
              v-for="(item, index) in eventLevelOptions"
              :key="item.id || index"
              :label="item.dictDesc"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="主处置部门和角色" prop="masterOrgCate" class="row">
          <cestc-cascader
            key="masterOrgCate"
            v-model="form.masterOrgCate"
            clearable
            :options="maindutyDeptOptions"
            :props="{ checkStrictly: true, label: 'name', value: 'id' }"
          />
        </el-form-item>
        <el-form-item label="从处置部门和角色" prop="slaveOrgCateList" class="row">
          <el-cascader
            key="slaveOrgCateList"
            v-model="form.slaveOrgCateList"
            clearable
            collapse-tags
            :options="followdutyDeptOptions"
            :props="{ checkStrictly: false, multiple: true, label: 'name', value: 'id' }"
          />
        </el-form-item>
      </el-form>
      <template v-if="eventTypeDutySystemList.length">
        <div class="tips">
          <span class="text">为实体组织选择外部处置系统</span>
          <!-- 总数统计中添加一个提示语，说明该统计是延迟的 -->
          <el-tooltip placement="right" effect="light">
            <ul slot="content">
              <li>同一部门的同一事件类型，最多只能选择一个处置系统。</li>
              <li>若未设置外部处置系统，则事件会流转到本系统的事件处置模块进行处置。</li>
              <li>已配置外部处置系统的部门，系统将事件默认推送到对应系统处置；</li>
            </ul>
            <span class="el-icon-warning-outline" />
          </el-tooltip>
        </div>
        <!-- 表格 -->
        <el-table :data="eventTypeDutySystemList" style="width: 100%">
          <el-table-column type="index" width="40" />
          <el-table-column
            label="处置部门"
            min-width="90px"
            prop="orgCate"
            :formatter="_formatter"
          />
          <el-table-column
            label="对应的实体组织机构"
            min-width="120px"
            prop="orgName"
            :formatter="_formatter"
          />
          <el-table-column label="设置事件处置系统" min-width="120px" prop="systemId">
            <template v-slot="{ row }">
              <el-select v-model="row.systemId" placeholder="请选择" clearable :disabled="mode==='view'">
                <el-option
                  v-for="item in row.platforms"
                  :key="item.id"
                  :label="item.platformName"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div slot="footer">
      <el-button @click.stop="_cancle">取消</el-button>
      <el-button v-if="mode !== 'view'" type="primary" @click.stop="confirm">确定</el-button>
    </div>
  </cestc-dialog>
</template>
<script>
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
import { deepClone } from '@/utils'
import resizeObserverMixin from '@/mixin/resizeObserverMixin'
export default {
  name: 'Dialog',
  mixins: [resizeObserverMixin],
  props: {
    eventTypeName: {
      type: Object,
      default: () => {}
    },
    dialogData: {
      type: Object,
      default: () => {}
    },
    mode: {
      type: String,
      default: 'set'
    }
  },
  data() {
    // eslint-disable-next-line no-unused-vars
    return {
      eventTypeDutySystemList: [], // 外部处置系统主从数据
      form: {
        slaveOrgCateList: [],
        slaveRoleIdList: []
      },
      rules: {
        eventLevel: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      },
      rolesList: [], // 处置角色数据
      dutyDeptList: [], // 智能部门
      contentHeight: 200,
      detailDutyDeptCode: ''// 编辑初始化记录一下 因为第一次map里存不到
    }
  },
  computed: {
    orgTypeOptions() {
      return this.$store.getters.getBsDictsByType('org_type')
    },
    dutyDeptListMap() {
      const map = new Map()
      this.dutyDeptList.forEach((item) => {
        map.set(item.id, item)
      })
      return map
    },
    eventLevelOptions() {
      return this.orgTypeOptions.filter((item) => item.parentValue === '0')
    },
    eventLevelOptionsMap() {
      const map = new Map()
      this.eventLevelOptions.forEach((item) => {
        map.set(item.dictValue, item)
      })
      return map
    },
    detail() {
      const { masterDutyDeptRole = {}, eventLevel, slaveDutyDeptRoleList = [] } = this.form
      return {
        eventLevelName: this.eventLevelOptionsMap.get(eventLevel)?.dictDesc,
        mainDutyRole: `${masterDutyDeptRole.name}/${masterDutyDeptRole.roleName}`.replace(/null/g, '').replace(/\/$/, ''),
        slaveDutyRole: slaveDutyDeptRoleList.map(item => {
          return `${item.name}/${item.roleName}`.replace(/\/$/, '')
        }).join(', ')
      }
    },
    // 主处置部门, 数据取自当前处置级别的children, 把角色数据重组数据，保持数据为级联组件数据
    maindutyDeptOptions() {
      const dutyDeptList = deepClone(this.dutyDeptList)
      const rolesList = deepClone(this.rolesList)
      const slaveOrgCateList = this.form.slaveOrgCateList || []
      return dutyDeptList.map((item) => {
        item.children = rolesList
        item.disabled = false
        item.children.forEach((sub) => (sub.disabled = false))
        if (slaveOrgCateList.some((sub) => sub?.[0] === item.id)) {
          item.disabled = true
          item.children = deepClone(rolesList)
          item.children.forEach((sub) => (sub.disabled = true))
        }
        return item
      })
    },
    // 主处置部门可以不选角色，从处置部门必须有角色
    // 从处置部门，数据取自当前处置级别的children, 且已经选定的主不可以再次选中
    followdutyDeptOptions() {
      const dutyDeptList = deepClone(this.dutyDeptList)
      const rolesList = deepClone(this.rolesList)
      const masterOrgCate = this.form.masterOrgCate || []
      return dutyDeptList.map((item) => {
        // 主处置部门选中的要禁用
        item.children = rolesList
        item.disabled = false
        if (masterOrgCate?.[0] === item.id) {
          item.disabled = true
        }
        return item
      })
    },
    // 事件类型
    eventClass() {
      const { eventLarge, eventMiddle } = this.eventTypeName || {}
      return `${eventLarge}/${eventMiddle}/${this.dialogData?.eventTypeName}`
    }
  },
  watch: {
    // 监听表单打开，表单回填
    '$attrs.visible': function(val) {
      if (val) {
        // 弹窗打开
        this.getdutyDetail()
        this.$nextTick(() => {
          // 创建观察实例
          const _el = this.$refs.contentRef
          this.initObServer(_el, (entries) => {
            const targetEl = entries[0].target
            if (targetEl) {
              this.contentHeight = targetEl.offsetHeight
            }
          })
          if (this.mode === 'view') {
            this.$refs.formRef?.clearValidate()
          }
        })
      } else {
        // 清除校验规则
        this.form = {}
        this.eventTypeDutySystemList = []
        this.$refs.formRef?.clearValidate()
      }
    },
    // 主处置部门改变，则对应的外部系统数据发生改变
    'form.masterOrgCate': {
      immediate: true,
      handler(val, old) {
        if (val?.[0]) {
          if ((val[0] && !old) || val[0] !== old?.[0]) {
            this.getPlatformInfoDepartmentList(val[0])
          }
        } else {
          this.eventTypeDutySystemList = []
        }
      }
    },
    'form.eventLevel': {
      handler(val) {
        if (val) {
          this.getRolesByOrg()
          this.getDutyDept()
        } else {
          this.rolesList = []
          this.dutyDeptList = []
        }
      }
    }
  },
  methods: {
    _change(_val) {
      // 主处置部门、从处置部门要清空
      this.$set(this.form, 'masterOrgCate', [])
      this.$set(this.form, 'slaveOrgCateList', [])
    },
    // 根据处置级别查询角色
    async getRolesByOrg() {
      const res = await moduleSrv.getRolesByOrg({ orgLevel: this.form.eventLevel })
      this.rolesList = res.data || []
    },
    // 根据处置级别查询智能部门
    async getDutyDept() {
      const res = await moduleSrv.getDutyDeptList({
        deptLevel: this.form.eventLevel,
        state: 1
      })
      this.dutyDeptList = res.data || []
    },
    // 获取外部处置系统数据
    async getPlatformInfoDepartmentList(val) {
      await this.$nextTick()
      console.log('val', val, this.dutyDeptList)
      const res = await moduleSrv.getPlatformInfoDepartmentList({ dutyDeptCode: this.dutyDeptListMap.get(val)?.deptCode || this.detailDutyDeptCode })
      this.eventTypeDutySystemList = res.data || []
      // 如果发现有回填数据，则进行回填
      const origins = this.form.eventTypeDutySystemList || []
      if (origins?.length) {
        this.eventTypeDutySystemList.forEach((item) => {
          const target = origins.find((sub) => item.orgId === String(sub.orgId))
          if (target?.systemId) {
            item.systemId = target.systemId
          }
        })
      }
    },
    // 详情数据
    getdutyDetail() {
      moduleSrv
        .getdutyDetail({ eventTypeId: this.dialogData.eventTypeId })
        .then((res) => {
          if (res.code === SUCCESS_CODE) {
            const obj = res.data || {}
            Object.keys(obj).forEach((k) => {
              this.$set(this.form, k, obj[k])
            })
            // 如果详情中未提供eventLevel， 则处置级别默认为街道级别
            if (!this.form.eventLevel) {
              this.$set(this.form, 'eventLevel', '05')
            }
            // 回填主处置、从处置部门角色
            const { masterDutyDeptRole = {}, slaveDutyDeptRoleList = [] } = obj
            if (masterDutyDeptRole.id && masterDutyDeptRole.roleId) {
              this.$set(this.form, 'masterOrgCate', [
                masterDutyDeptRole.id,
                masterDutyDeptRole.roleId
              ])
            } else if (masterDutyDeptRole.id) {
              this.$set(this.form, 'masterOrgCate', [
                masterDutyDeptRole.id
              ])
            }

            this.detailDutyDeptCode = masterDutyDeptRole.deptCode
            this.$set(
              this.form,
              'slaveOrgCateList',
              slaveDutyDeptRoleList.map((item) => [item.id, item.roleId])
            )
          }
        })
    },

    // 表格内容格式化
    _formatter(row, column, cellValue) {
      if (column.property === 'orgCate') {
        return '主处置部门'
      }
      return cellValue || '-'
    },

    // 提交
    confirm() {
      const params = {
        ...this.form,
        state: 1,
        eventTypeDutySystemList: this.eventTypeDutySystemList
      }
      const { masterOrgCate = [], slaveOrgCateList = [] } = this.form
      // 重组主处置部门
      if (masterOrgCate.length) {
        const [orgId = '', roleId = ''] = masterOrgCate
        params.masterDutyDeptRole = {
          deptCode: this.dutyDeptListMap.get(orgId)?.deptCode,
          id: orgId,
          roleId
        }
      }
      // 从处置部门
      if (slaveOrgCateList.length) {
        const slaveDutyDeptRoleList = []
        slaveOrgCateList.forEach((item) => {
          const [orgId = '', roleId = ''] = item
          slaveDutyDeptRoleList.push({
            deptCode: this.dutyDeptListMap.get(orgId)?.deptCode,
            id: orgId,
            roleId
          })
        })
        params.slaveDutyDeptRoleList = slaveDutyDeptRoleList
      }

      moduleSrv.saveDuty(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.$message.success('操作成功')
          // 关闭弹窗
          this._cancle()
          this.$emit('flash')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    _cancle() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/global-third-sys-dialog.scss';

.strategy-dialog {
  @include info(1);
  .el-form-item {
    width: calc(50% - 10px);
    margin-right: 20px;
    &.row {
      width: 100%;
      margin-right: 0;
    }
    &:nth-of-type(4),
    &:nth-of-type(6) {
      margin-right: 0;
    }
    .el-select,
    .el-cascader {
      width: 100%;
    }
  }
  .tips {
    margin-bottom: 10px;
    color: #4b4b4b;
    font-size: 14px;
    .el-icon-warning-outline {
      margin-left: 5px;
    }
  }
  ::v-deep {
    .el-table {
      margin-bottom: 26px;
      .el-table__header {
        height: 48px;
      }
    }
  }
}
</style>
