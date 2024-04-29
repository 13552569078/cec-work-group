<!--
 * @description 智能部门
 * @date 2023-12-02
 * @author lism
-->
<template>
  <div class="page-wrapper">
    <common-page-list :has-footer="false">
      <search
        slot="search"
        ref="searchRef"
        @searchList="dealwithFilter"
        @reset="clearFilters"
      />
      <div slot="content" class="result-content">
        <search-tips
          ref="searchTips"
          :total="queryTotal"
          show-search-items
          show-actions
          :search-items="filterTips"
          :select-count="selectCount"
          @heightChange="tipHeightChange"
          @delFilter="delFilter"
          @clear="clearFilters"
          @refresh="_search"
        >
          <el-dropdown placement="bottom" trigger="click" @command="handleCommand">
            <el-button
              icon="el-icon-download"
              class="add-btn common-action-btn"
            >导入数据</el-button>
            <el-dropdown-menu slot="dropdown" class="custom-dropdown-menu" :append-to-body="false">
              <el-dropdown-item command="all">全量导入</el-dropdown-item>
              <el-dropdown-item command="add">增量导入</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            type="primary"
            class="add-btn common-action-btn"
            icon="custom-add common-icon"
            @click.stop="_handle_action('add0')"
          >新增一级部门</el-button>
        </search-tips>
        <div v-loading="loading" class="result-list" :style="resultStyle">
          <el-table
            ref="tableRef"
            :data="dataList"
            style="width: 100%"
            row-key="id"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            tooltip-effect="light"
          >
            <!-- 自定义序号 -->
            <el-table-column
              type=""
              prop="parentIndex"
              width="55"
              class-name="table-column-index"
            />
            <el-table-column
              v-for="(item, index) in tableColumn"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              :min-width="item.minWidth"
              show-overflow-tooltip
            >
              <template v-slot="{ row, column }">
                <span v-if="item.prop == 'state'">
                  <el-switch
                    v-model="row[column.property]"
                    active-color="#4CC09E"
                    inactive-color="#BDBDBD"
                    :active-text="row[column.property] == 1 ? '启用' : '停用'"
                    :active-value="1"
                    :inactive-value="0"
                    @change="_stateChange(row)"
                  />
                </span>
                <span v-else> {{ row[column.property] || '-' }} </span>
              </template>
            </el-table-column>
            <el-table-column :width="220" fixed="right" class-name="table-column-action">
              <template #header>
                <span>操作</span>
              </template>
              <template v-slot="{ row }">
                <span class="action-group">
                  <!-- 第四级或网格级别无法新增 -->
                  <template v-if="row.deptLevel !== '07'">
                    <span class="action-btn" @click="_handle_action('add', row)">新增下级部门</span>
                    <span class="action-divider">|</span>
                  </template>
                  <!-- 启用状态不可编辑、不可删除 -->
                  <span :class="['action-btn', {'is-disabled': row.state === 1}]" @click="_handle_action('edit', row)">编辑</span>
                  <span class="action-divider">|</span>
                  <!-- 如果有子部门，则不可删除 -->
                  <span :class="['action-btn', {'is-disabled': row.state === 1 || row.haveChild}]" @click="_delete(row)">删除</span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </common-page-list>
    <dialog-show
      :visible.sync="dialogVisible"
      :echo-form="dialogData"
      :mode="dialogMode"
      @reflash="_search"
    />
    <!-- 全量导入弹窗、增量导入弹窗 -->
    <dialogTemplateImport
      :visible.sync="dialogTemplateImportVisible"
      :mode="dialogTemplateImportMode"
      @reflash="_search"
    />
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatch'
import search from './search'
import dialogShow from './dialog'
import dialogTemplateImport from './dialog-template-import'
import searchMixin from '@/mixin/searchMixin'
import { SUCCESS_CODE } from '@/constants'
import { countNodeTree } from '@/utils/treeUtil'

export default {
  name: 'DutyDept',
  components: {
    search,
    dialogShow,
    dialogTemplateImport
  },
  mixins: [searchMixin],
  data() {
    return {
      queryTotal: 0,
      tableColumn: [
        {
          prop: 'name',
          label: '职能部门名称'
        },
        {
          prop: 'deptCode',
          label: '职能部门编码'
        },
        {
          prop: 'state',
          label: '状态'
        },
        {
          prop: 'deptLevelName',
          label: '部门等级'
        }
      ],
      dialogVisible: false,
      dialogData: {},
      dialogMode: 'add0', // 默认新增一级部门
      dialogTemplateImportVisible: false, // 导入弹窗
      dialogTemplateImportMode: 'all' // 全量导入
    }
  },
  created() {
    this._search()
  },
  methods: {
    handleCommand(command) {
      this.dialogTemplateImportMode = command
      this.dialogTemplateImportVisible = true
    },
    async _search() {
      await this.$nextTick()
      const params = {
        ...this.searchParams
      }
      // 如果有其他搜索条件查询，则使用列表查询接口
      if (params.name || params.state === 0 || params.state || params.deptLevel) {
        this.getDutyDeptList(params)
        return
      }
      this.loading = true
      const res = await moduleSrv.getDutyDeptListByTree(params).finally(() => {
        this.loading = false
      })
      if (res.code === SUCCESS_CODE) {
        this.dataList = (res.data || []).map((item, index) => {
          item.parentIndex = index + 1
          return item
        })
        this.queryTotal = countNodeTree(res.data)
      }
    },

    async getDutyDeptList(params) {
      this.loading = true
      const res = await moduleSrv.getDutyDeptList(params).finally(() => {
        this.loading = false
      })
      if (res.code === SUCCESS_CODE) {
        this.dataList = (res.data || []).map((item, index) => {
          item.parentIndex = index + 1
          return item
        })
        this.queryTotal = res.data.length || 0
      }
    },

    // 操作处理
    _handle_action(action, row) {
      console.log('row==', row)
      switch (action) {
        case 'add':
        case 'add0':
          this.dialogData = {}
          this.dialogMode = action
          if (action === 'add') {
            this.dialogData.pidName = row.name
            this.dialogData.pid = row.id
            this.dialogData.pidDeptLevel = row.deptLevel
          }
          this.dialogVisible = true
          break
        case 'edit':
          // 如果是一级编辑，则 mode 为 edit0
          this.dialogMode = row.pid === 0 ? 'edit0' : action
          this.dialogData = row
          this.dialogVisible = true
          break

        default:
          break
      }
    },
    _stateChange(row) {
      console.log('row.state==', row.state)
      moduleSrv.updateDutyDeptState(row).then(res => {
        if (res.code === SUCCESS_CODE) {
          this.$message.success(res.message || '操作成功！')
        } else {
          this.$message.error(res.message || '操作失败！')
        }
        this._search()
      }).catch((_err) => {
        // if (err.message === '请先启用父级职能部门') {
        //   this.$set(row, 'state', 0)
        // }
        this._search()
      })
    },
    // 删除事件录入
    _delete(row) {
      this.$confirm('确定要删除该部门吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        moduleSrv.deleteDutyDept(params).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this._search()
          } else {
            this.$message({
              message: res.message || '操作失败！',
              type: 'error'
            })
          }
        })
      })
    }
  }
}
</script>
<style scoped lang="scss">
.page-wrapper {
  height: 100%;
  @include resultContent;
  ::v-deep {
    @include oneLineSearch;
    .el-form-item__label-wrap {
      margin-left: 0 !important;
    }
  }
}
.custom-dropdown-menu{
  width: 88px!important;
  left:16px!important;
}
</style>
