<!--
 * @description 流程管理--角色表单
 * @date 2020-09-13
 * @author lism
-->
<template>
  <cestc-dialog
    class="remind-dialog"
    v-bind="$attrs"
    title="提醒配置"
    width="900px"
    top="20vh"
    v-on="$listeners"
    @confirm="_confirm"
    @cancle="_cancle"
  >
    <el-table class="table" :data="detailList" style="width: 100%">
      <el-table-column label="提醒对象" width="300">
        <template v-slot="{ row }">
          <div class="remind-name">{{ typeNameMap[row.type] }}</div>
          <!--  指定角色-->
          <cestc-cascader
            v-if="row.type === ZHIDING_JUESE"
            v-model="row.subject"
            class="width100"
            filterable
            separator="-"
            :props="{ checkStrictly: false, emitPath: false, children: 'roleVOList', label: 'name', value: 'id', multiple: true, }"
            :options="groupRoleTreeList"
            placeholder=""
          />
          <!--  指定人-->
          <el-select
            v-if="row.type === ZHIDING_REN"
            v-model="row.subject"
            class="zhidingren"
            placeholder="请搜索"
            remote
            reserve-keyword
            :remote-method="remoteMethod"
            :loading="queryUserLoading"
            multiple
            filterable
            clearable
          >
            <el-option
              v-for="(item, index) in userList"
              :key="`user-${item.id}-${index}`"
              :label="item.name"
              :value="item.id"
              :disabled="item.disabled"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="选择消息模板">
        <el-table-column v-for="({ name, data }, index) in templateList" :key="`label-${index}`" :label="name">
          <template v-slot="{ row }">
            <el-select
              v-model="row.mode[index].schemeCode"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="(item, _i) in data"
                :key="`template-${item.schemeCode}-${index}-${_i}`"
                :label="item.schemeName"
                :value="item.schemeCode"
                :disabled="item.disabled"
              />
            </el-select>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </cestc-dialog>
</template>
<script>
import moduleSrv from '@/api/dispatch'
import { mapGetters } from 'vuex'
import { PLATFORM_CODE, SUCCESS_CODE } from '@/constants'

const CHULI_JUESE = 1 // 1-处理角色/人
const ZHIDING_JUESE = 2 // 2-指定角色
const ZHIDING_REN = 3 // 3-指定人

const typeNameMap = {
  [CHULI_JUESE]: '处理角色',
  [ZHIDING_JUESE]: '指定角色',
  [ZHIDING_REN]: '指定人'
}
let list = []
let defaultDetailList = []
export default {
  name: 'RemindDialog',
  data() {
    return {
      queryUserLoading: false,
      detailList: [],
      rules: {},
      groupRoleTreeList: [],
      userList: [],
      CHULI_JUESE,
      ZHIDING_JUESE,
      ZHIDING_REN,
      typeNameMap,
      templateMap: {},
      templateList: []
    }
  },
  computed: {
    ...mapGetters(['appCode']),
    mode() {
      return this.$attrs.mode
    },
    rowdata() {
      return this.$attrs.rowdata
    },
    orgType() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('org_type')
    }
  },
  watch: {
    '$attrs.visible': function(val) {
      // 打开弹窗，先把表单清空
      if (val) {
        this.getRemindDetail()
      } else {
        this.userList = []
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getGroupRoleList()
      this.getDictListByType()
    },
    // 根据机构查询角色
    getGroupRoleList() {
      const params = {
        orgId: this.$store.getters?.profile?.currentOrgRole?.org?.gridId || '',
        pageNum: 1,
        pageSize: 10000
      }
      moduleSrv.getGroupRoleList(params).then(res => {
        this.groupRoleTreeList = res.data || []
      })
    },
    // 根据机构查询人员，兼容初始化userIds查询
    remoteMethod(query, userIds = []) {
      if (query === '') {
        this.userList = []
        return
      }
      this.queryUserLoading = true
      const params = { pageNum: 1, pageSize: 500, name: '' }
      userIds.length && (params.userIds = userIds)
      params.name = query
      moduleSrv.getUsersListFromUc(params).then(res => {
        if (res.code === 0) {
          this.userList = (res.data || []).map(item => {
            if (!item.name) {
              item.name = '-'
            }
            // 修复id匹配不上
            item.id += ''
            return item
          })
        }
      }).catch((e) => {
        console.log(e)
      }).finally(() => {
        this.queryUserLoading = false
      })
    },
    // 获取消息中心模板
    async getDictListByType() {
      const res = await moduleSrv.getDictListByType({ dictType: 27001 })
      if (res.code === 0) {
        const tempData = res.data || []
        let i = 0
        tempData.forEach(({ dictDesc: name, dictValue: mode }) => {
          moduleSrv.querySchemeList({ platformCode: PLATFORM_CODE, pushTypeCode: mode }).then(res => {
            const data = res.data || []
            this.templateMap[mode] = { name, data }
            this.templateList.push({ name, data, mode })
            if (++i === tempData.length) this.setDefaultList()
          })
        })
      }
    },
    setDefaultList() {
      // mode: 1-短信  2-邮箱  3-站内信  4-钉钉
      // { mode: 1, platformCode, schemeCode: undefined }
      list = this.templateList.map(({ mode }) => ({ mode, platformCode: PLATFORM_CODE, schemeCode: undefined }))
      defaultDetailList = [CHULI_JUESE, ZHIDING_JUESE, ZHIDING_REN].map(type => ({
        type,
        mode: JSON.parse(JSON.stringify(list)),
        subject: []
      }))
    },
    // 获取全量的表格详情
    getRemindDetail() {
      const { id = '' } = this.rowdata || {}
      moduleSrv.getRemindDetail({ id }).then(res => {
        if (res.code === SUCCESS_CODE) {
          const tempData = res?.data?.detailList || []
          tempData.forEach((v) => {
            v.subject = v.subject.split(',')
          })
          // m1, s1, t1为默认配置，m2, s2, t2为接口返回配置，进行比对后提交
          const detailList = defaultDetailList.map(({ type: t1, subject: s1, mode: m1 }) => {
            const targetItem = tempData.find(u => u.type === t1) || {}
            const { subject: s2, mode: m2 } = targetItem
            s1 = s2 || s1
            m1 = m1.map((v) => {
              const findMode = m2 && m2.find((w) => w.mode === v.mode)
              return findMode ? { ...findMode } : { ...v }
            })
            return { type: t1, subject: s1, mode: m1 }
          })
          const zhidingrenSubject = detailList.find(v => v.type === ZHIDING_REN)?.subject
          if (zhidingrenSubject?.length) {
            this.remoteMethod(null, zhidingrenSubject)
          }
          this.detailList = detailList
        }
      })
    },
    // 提交
    _confirm() {
      const { id = '' } = this.rowdata || {}
      const detailList = []
      for (let i = 0; i < this.detailList.length; i++) {
        const item = this.detailList[i]
        const type = item.type
        const subject = item.subject.join(',')
        // mode排除未填写的模板（schemeCode为空）
        const mode = item.mode.filter(v => !!v.schemeCode) || []
        // 提醒对象subject和模板mode缺一不可，除非是处理角色（CHULI_JUESE的subject默认[]）
        const needPush = (type === CHULI_JUESE || ([ZHIDING_JUESE, ZHIDING_REN].includes(type) && subject)) && !!mode.length
        if (needPush) detailList.push({ type, mode, subject })
      }
      if (!id) {
        this.$message({
          message: '请选择有效的节点!',
          type: 'error'
        })
        return
      }
      const params = { id, detailList }
      console.log(params)
      // 关闭弹窗，更新列表
      if (this.mode === 'edit') {
        moduleSrv.submitRemind(params).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            // 关闭弹窗，更新列表
            this.$emit('update:visible', false)
            this.$emit('update')
          } else {
            this.$message({
              message: res.message || '操作失败!',
              type: 'error'
            })
          }
        })
      }
    },
    _cancle() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss">
.remind-dialog {
  .table {
    .remind-name {
      width: 60px;
      display: inline-block;
    }
    .el-input__suffix {
      z-index: 1;
    }
  }
  .el-table thead.is-group th {
    border-color:  $greyDivision;
  }
  .el-table--border {
    border-color: transparent;
  }
  .el-table td, .el-table--border td {
    border-color: $greyDivision;
    border-right-color: $greyDivision;
    border-bottom-color: $greyDivision;
  }
  .el-table tr td:nth-of-type(1) {
    border-left: 1px solid $greyDivision;
  }
  .el-table--border th {
    border-color: $greyDivision;
    border-bottom: 1px solid $greyDivision;
    border-top: 1px solid $greyDivision;
    &:nth-of-type(1) {
      border-left: 1px solid $greyDivision;
    }
  }
  .el-table__body tr:hover>td  {
    background-color: $columnHover;
  }
  .zhidingren {
    .el-input__suffix {
      display: none;
      .el-input__icon {
        &::before {
          content: "\e6e1";
        }
      }
    }
  }
}

</style>
