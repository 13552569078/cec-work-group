<template>
  <el-popover
    v-model="popVisible"
    :visible-arrow="false"
    width="568"
    placement="bottom-start"
    class="ft14 diy-popover"
    :popper-class="getClass()"
    :disabled="disabled"
    @show="showPopover"
  >
    <!-- :popper-class="['select-popper-wrapper', { embed: 'embed-mode' }]" -->
    <!-- @hide="hideEvent" -->
    <!-- 添加滚动条 -->
    <el-row>
      <el-col :span="12" class="p12">
        <div class="title fw-b">{{ title }}</div>
        <el-scrollbar class="diy-scrollbar">
          <cestc-tree
            ref="cestcTree"
            :data="treeData"
            check-strictly
            :props="defaultProps"
            node-key="id"
            :filter-flag="false"
            icon-class-fold="el-icon-caret-right"
            icon-class-unfold="el-icon-caret-bottom"
            :expand-on-click-node="false"
            :default-expanded-keys="expandedKeys"
            highlight-current
            @handleNodeClick="handleNodeClick"
          />
        </el-scrollbar>
      </el-col>
      <el-col :span="12" class="p12">
        <div class="title fw-b" style="margin-bottom: 16px;">{{ isSysAvailable ? rightSystemTitle : rightTitle }}</div>
        <el-scrollbar class="diy-scrollbar scrollbar-table">
          <!-- 添加 tab（调度到角色或调度到人）, 第三方平台不展示，没有user不展示 -->
          <ul v-if="!isSysAvailable && hasUser" class="tab-wrapper">
            <li :class="['tab-item', { 'active': active === ROLE }]" @click.stop="_tabChange(ROLE)">选择角色</li>
            <li :class="['tab-item', { 'active': active === USER }]" @click.stop="_tabChange(USER)">选择人员</li>
          </ul>
          <el-table
            ref="multipleTable"
            :data="tableData"
            class="pop-table"
            style="width: 100%"
            highlight-current-row
            @select="selectChange"
            @cell-click="troggleSelectet"
          >
            <el-table-column type="selection" width="55" :selectable="checkSelectable" class-name="table-column-index" />
            <el-table-column prop="name" label="" width="160" />
          </el-table>
        </el-scrollbar>
      </el-col>
    </el-row>
    <div slot="reference" :class="['tags', { 'is-focus': popVisible }]">
      <el-tag v-for="(tag, index) in selectText" :key="index" closable @close="closeTag(tag)">
        {{ tag.deptName }}
      </el-tag>
      <span class="el-input__suffix"><span class="el-input__suffix-inner"><!----><!----><i
        class="el-select__caret el-input__icon el-icon-arrow-up"
      /><!----><!----><!----><!----></span><!----></span>
    </div>
  </el-popover>
</template>
<script>
import moduleSrv from '@/api/dispatch'
import { ArrayMinusB, singleArray } from '@/utils'
import { SUCCESS_CODE } from '@/constants'

const ROLE = 0
const USER = 1
const SYSTEM = 2

export default {
  name: 'PopoverSelect',
  props: {
    depSingle: { // 主调度可单独选择机构
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'dispatch'
    },
    value: {
      type: [Object, Array],
      default: () => { }
    },
    hasUser: { // 是否有人员，默认有
      type: Boolean,
      default: true
    },
    selectText: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: '调度组织'
    },
    rightTitle: {
      type: String,
      default: '调度角色'
    },
    treeData: {
      type: Array,
      default: () => []
    },
    povselect: {
      type: Array,
      default: () => []
    },
    defaultProps: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'name'
      })
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否需要请求第三方系统
    isNeedFetchSystem: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      embed: window.embed,
      popVisible: false,
      tableData: [],
      selectedTableRow: [], // 表格当前项目
      selectedTreeNode: {}, // 选中的 tree node
      active: undefined, // 0-角色;1-人员;2-第三方平台
      rightSystemTitle: '第三方平台',
      ROLE,
      USER,
      expandedKeys: [],
      isSysAvailable: undefined // 是否能获取到第三方平台,勾选平台为单选模式
    }
  },
  watch: {
    selectedTableRow: {
      handler(nVal) {
        this.hideEvent()
      }
    },
    povselect: {
      handler(nVal) {
        this.tableData = []
      }
    }
  },
  created() {
    this.isSysAvailable = this.isNeedFetchSystem
    // isSysAvailable为真默认平台，反之调度角色
    this.active = this.isSysAvailable ? SYSTEM : ROLE
  },
  methods: {
    async _tabChange(tab) {
      if (this.active === tab) return
      this.active = tab
      if (this.active === ROLE) {
        this.tableData = await this.getRolesByOrg()
      } else {
        this.tableData = await this.getUsersByOrg()
      }
    },
    // 主办最多选择一行: selection, 多选对象，row: 当前对象
    selectChange(selection, row) {
      row.deptObj = this.selectedTreeNode
      // 添加类型，用来区分是角色还是人员
      const typeMap = {
        [ROLE]: 'role',
        [USER]: 'user',
        [SYSTEM]: 'system'
      }
      row.type = typeMap[this.active || ROLE]
      // multiple为 true && 不为第三方系统,则是多选,最多限制 5 条,否则只选一条
      const _curRowHit = selection.some(item => item.id === row.id) // 当前多选是否命中
      if (!this.multiple || this.isSysAvailable) { // 单选
        if (_curRowHit) {
          // 如果选中超过一个
          if (selection.length > 1) {
            const del_row = selection.shift()
            this.$refs.multipleTable.toggleRowSelection(del_row, false)
          }
          this.selectedTableRow = [row]
        } else {
          this.closeTag(row)
        }
      } else { // 多选
        // 去重操作
        this.selectedTableRow = singleArray(selection, 'id', ['deptObj', 'id'])
      }
    },

    // 切换是否选中
    async troggleSelectet(row) {
      await this.$nextTick()
      const tableRef = this.$refs.multipleTable
      tableRef.toggleRowSelection(row)
      this.selectChange(tableRef.selection, row)
    },

    // 返回值用来决定这一行的 CheckBox 是否可以勾选
    checkSelectable(row, bool = true) {
      let tempArr = []
      // 获取当前tree-node下的所选table行
      const filterSelectedTableRow = this.selectedTableRow?.filter(
        (item) => item.deptObj.id === this.selectedTreeNode.id
      )
      if (this.selectedTableRow?.length >= 5) {
        // 获取属于当前tree-node的table未选行
        tempArr = ArrayMinusB(this.tableData, filterSelectedTableRow, 'id')
      }
      let mark = 0
      tempArr?.forEach((item) => {
        if (item.id === row.id) {
          mark = mark + 1
          return false
        }
      })
      return mark <= 0
    },

    // 展开级联面板
    showPopover() {
      // 打开popover更新面板table数据
      this.selectedTableRow = this.value?.role
      this.selectedTableRow?.forEach((item) => {
        item.checked = true
      })
      this.toggleSelection(this.selectedTableRow)
    },

    // 收起展开面板
    hideEvent() {
      // 回显 input 内容区，把选中对象传给父级
      const dept = this.selectedTreeNode
      const role = this.selectedTableRow
      this.$emit('update:value', { dept, role })
      this.$emit('confim', { id: `${dept?.id}/${role?.id}`, dept, role })
    },

    // 删除tag
    closeTag(val) {
      const index = this.value.role?.findIndex(
        (item) => item.id === val.id && item.deptObj.id === val.deptObj.id
      )
      this.selectedTableRow?.splice(index, 1)
      const clickItem = this.tableData.find(
        (item) => item.id === val.id && item.deptObj.id === val.deptObj.id
      )
      this.$refs.multipleTable.toggleRowSelection(clickItem, false)
    },

    // 根据机构查询角色
    getRolesByOrg() {
      if (!this.selectedTreeNode.id) return []
      return new Promise((resolve, reject) => {
        const params = {
          orgId: this.selectedTreeNode.id,
          pageNum: 1,
          pageSize: 10000
        }
        moduleSrv.getRolesByOrg(params).then(res => {
          if (res.code === 0) {
            resolve(res.data || [])
          } else {
            this.$message.error(res.msg)
            reject()
          }
        })
      })
    },
    // 根据机构查询人员
    getUsersByOrg() {
      if (!this.selectedTreeNode.id) return []
      return new Promise((resolve, reject) => {
        const params = {
          orgId: this.selectedTreeNode.id,
          pageNum: 1,
          pageSize: 10000
        }
        moduleSrv.getUsersByOrg(params).then(res => {
          if (res.code === 0) {
            // 如果姓名为空，则展示-
            const tem = res.data || []
            resolve(tem.map(item => {
              if (!item.name) {
                item.name = item.username || '-'
              }
              return item
            }))
          } else {
            this.$message.error(res.msg)
            reject()
          }
        })
      })
    },
    // 根据机构查询第三方平台
    getPlatformsByOrg() {
      if (!this.selectedTreeNode.id) return []
      return new Promise((resolve, reject) => {
        const params = {
          orgIds: [this.selectedTreeNode.id]
        }
        moduleSrv.getPlatformsByOrg(params).then(res => {
          if (res.code === 0) {
            // 如果姓名为空，则展示-
            const tem = res?.data[0]?.platforms || []
            const sysData = tem.map(item => {
              item.name = item.platformName || '-'
              return item
            })
            resolve(sysData)
          } else {
            this.$message.error(res.msg)
            reject()
          }
        })
      })
    },

    // 知会人员查询
    getNotifyRoleByDeptId() {
      return new Promise((resolve, reject) => {
        moduleSrv.getNotifyRoleByDeptId(this.selectedTreeNode.id).then((res) => {
          if (res.code === SUCCESS_CODE) {
            const tem = res.data || []
            resolve(tem.map(item => {
              item.id = item.roleId
              item.name = item.roleName || '-'
              return item
            }))
          } else {
            this.$message.error(res.msg)
            reject()
          }
        })
      })
    },

    setCheckedKeys(key) {
      this.$refs.cestcTree.setCheckedKeys(key)
      this.expandedKeys = [key]
    },
    getClass() {
      return this.emebd ? `select-popper-wrapper embed-mode` : `select-popper-wrapper`
    },
    async handleNodeClick(node) {
      // 如果是知会，则需要重新调用接口
      this.selectedTreeNode = node
      const fnMap = {
        [ROLE]: 'getRolesByOrg',
        [USER]: 'getUsersByOrg'
      }
      if (this.type === 'notify') {
        this.tableData = await this.getNotifyRoleByDeptId()
      } else if (this.isNeedFetchSystem) {
        // 先请求平台数据
        this.tableData = await this.getPlatformsByOrg()
        this.isSysAvailable = !!this.tableData?.length
        // 重置
        this.active = this.isSysAvailable ? SYSTEM : ROLE
        if (!this.isSysAvailable) this.tableData = await this[fnMap[this.active]]()
      } else {
        this.tableData = await this[fnMap[this.active]]()
      }
      this.toggleSelection(this.selectedTableRow)
      this.checkSelectable([], false)

      // 主调度单独组织机构
      if (this.depSingle) {
        const dept = this.selectedTreeNode
        // 添加类型，用来区分是角色还是人员
        const typeMap = {
          [ROLE]: 'role',
          [USER]: 'user',
          [SYSTEM]: 'system'
        }
        const role = [
          {
            'deptObj': this.selectedTreeNode,
            'id': '',
            'platformName': '',
            'platformCode': '',
            'platformAbbr': '',
            'name': '',
            'type': typeMap[this.active || ROLE]
          }
        ]
        this.$emit('update:value', { dept, role })
      }
    },

    // 右侧table回显 (勾选)
    toggleSelection(rows) {
      if (!rows) return
      // 先统一清空  再勾选
      this.$nextTick(() => {
        if (rows.length) {
          this.$refs.multipleTable.clearSelection()
          rows.forEach((_row) => {
            this.$refs.multipleTable.toggleRowSelection(_row)
            // debugger
          })
          // setTimeout(() => {
          // }, 300);
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.diy-popover .tags .el-input__suffix {
  border-right: 1px solid #E7E7E7;
}

.tags {
  width: 100%;
  min-height: 30px;
  border: 1px solid #D0D2D7;
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  position: relative;

  .el-input__suffix {
    height: 28px;
    margin-top: 0;
    margin-right: 0;
    transform: rotate(180deg);
  }

  &.is-focus {
    border: 1px solid #36A4FF;

    .el-input__suffix {
      border-right-color: #36A4FF;
    }
  }

  &-placeholder {
    line-height: 30px;
    padding-left: 8px;
  }

  ::v-deep {
    .el-tag {
      margin: 2px 0 2px 5px;
    }
  }
}

.tab-wrapper {
  // margin-top: 27px;
  margin-top: 0px;
  display: flex;
  padding: 0 27px 0 15px;

  .tab-item {
    cursor: pointer;
    height: 32px;
    line-height: 32px;
    text-align: center;
    width: 50%;

    &:nth-of-type(1) {
      border-radius: 2px 0px 0px 2px;

      &:not(.active) {
        border-right: none;
      }
    }

    &:nth-of-type(2) {
      border-radius: 0px 2px 2px 0px;

      &:not(.active) {
        border-left: none;
      }
    }

    &.active {
      border-color: #36A4FF;
      color: #36A4FF;
    }

    border: 1px solid #E7E7E7;
  }
}
</style>
<style lang="scss">
.pop-table {
  .el-table__header {
    display: none;

    .has-gutter {
      .is-leaf {
        .cell .el-checkbox .el-checkbox__inner {
          display: none;
        }
      }
    }
  }
}

.select-popper-wrapper {
  padding: 8px 0 0 0;
  margin-top: 0 !important;
  height: 440px;

  &.embed-mode {
    height: 250px;
  }

  .el-row {
    display: flex;

    .el-col {
      padding: 0;

      &:first-child {
        width: 340px;
      }

      &:last-child {
        width: calc(100% - 340px);
      }

      .title {
        padding-left: 16px;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #202020;
      }
    }
  }

  .p12,
  .cestc-tree,
  .el-table {
    .has-gutter {
      display: none;
    }

    .el-table__body {
      overflow: hidden;

      tbody {
        overflow: hidden;

        .el-table__row {
          height: 40px;
          display: flex;
          align-items: center;

          td {
            border: none;
            position: absolute;

            &:last-child {
              left: 22px;
              width: 80%;
            }
          }
        }

        tr:hover {
          &>td {
            background-color: #e6edff;
          }
        }
      }
    }
  }

  .diy-scrollbar {
    margin-top: 16px;
    height: 240px;
    .el-scrollbar__wrap {
      height: inherit;
      overflow-x: hidden;
    }
    .el-scrollbar__bar.is-horizontal {
      display: none;
    }
  }

  .scrollbar-table {
    margin-top: 0
  }

  .cestc-tree {
    padding: 0;
    border-right: 1px solid #ededed;
  }
}
</style>
