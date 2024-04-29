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
          :total="page.total"
          show-search-items
          :search-items="filterTips"
          :select-count="selectCount"
          show-actions
          @heightChange="tipHeightChange"
          @delFilter="delFilter"
          @clear="clearFilters"
          @refresh="_search"
        >
          <slot name="button">
            <!-- <el-dropdown @command="handleCommand" @visible-change="visibleChange">
              <el-button
                icon="el-icon-download"
                class="add-btn common-action-btn"
              >导入数据</el-button>
              <el-dropdown-menu slot="dropdown" class="third-type-import">
                <el-dropdown-item v-if="dataList.length === 1 && dataList[0].code === 'OTHER'" command="all">全量导入</el-dropdown-item>
                <el-dropdown-item command="add">增量导入</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
            <el-button
              class="add-btn common-action-btn"
              icon="custom-import common-icon"
              @click.stop="handleCommand('add')"
            >增量导入</el-button>
            <el-button
              type="primary"
              class="add-btn common-action-btn"
              icon="custom-add common-icon"
              @click.stop="addSub('add')"
            >新增一级分类</el-button>
          </slot>
        </search-tips>
        <div v-loading="loading" class="result-list" :style="resultStyle">
          <el-table
            size="small"
            :data="dataList"
            style="width: 100%; height: calc(100% - 20px)"
            row-key="id"
            class="event-type-table"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            :expand-row-keys="expandRows"
            height="95%"
            tooltip-effect="light"
            @expand-change="defaultExpandedKeys"
          >
            <el-table-column
              type="index"
              width="55"
              :index="indexMethod"
              class-name="table-column-index"
            >
              <template slot-scope="{ row, $index }">
                <span class="table-index">{{ $index+1 }}</span>
              </template>
            </el-table-column>
            <template v-for="(item, index) in columns">
              <el-table-column
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                show-overflow-tooltip
              />
            </template>
            <el-table-column width="180" align="left" header-align="left" label="操作">
              <template slot-scope="{ row }">
                <span class="action-group">
                  <span
                    :class="['action-btn', { 'is-disabled': Number(row.level) >= 5 || row.code === 'OTHER' }]"
                    @click="addSub('addSub', row)"
                  >增加子类</span>
                  <span class="action-divider">|</span>
                  <span
                    :class="['action-btn', { 'is-disabled': row.code === 'OTHER' }]"
                    @click="edit(row)"
                  >编辑</span>
                  <span class="action-divider">|</span>
                  <span
                    :class="['action-btn', { 'is-disabled': (row.children && row.children.length) || row.code === 'OTHER' }]"
                    @click="patchRemove(row)"
                  >删除</span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </common-page-list>
    <!-- 事件类型管理弹窗：新增、编辑 -->
    <event-type-dialog
      :visible.sync="dialogVisible"
      :editingdata="dialogData"
      :mode="dialogType"
      :selected-third-system="selectedThirdSystem"
      @cancle="dialogClose"
    />
    <!-- 全量导入弹窗、增量导入弹窗 -->
    <template-import-dialog
      v-if="templateImportDialogVisible"
      :visible.sync="templateImportDialogVisible"
      :mode="templateImportDialogType"
      :selected-third-system="selectedThirdSystem"
      @cancle="templateImportDialogClose"
      @uplaodSuccess="uplaodSuccess"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixin/pageMixin'
import searchMixin from '@/mixin/searchMixin'
import search from './search'
import moduleSrv from '@/api/dispatchWhh'
import { SUCCESS_CODE } from '@/constants'
import eventTypeDialog from './eventTypeDialog'
import templateImportDialog from '@/views/strategy-config/eventType/components/templateImportDialog.vue'
import { countNodeTree } from '@/utils/treeUtil'

export default {
  name: 'EventType',
  components: {
    search,
    eventTypeDialog,
    templateImportDialog
  },
  mixins: [pageMixin, searchMixin],
  props: {
    selectedThirdSystem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: false,
      digType: '',
      digData: {},
      form: {},
      tableColumn: [
        {
          prop: 'name',
          label: '类型名称',
          visible: true,
          treeNode: true
        },
        {
          prop: 'code',
          label: '类型编码',
          visible: true,
          treeNode: true
        },
        {
          prop: 'sourceSystemName',
          label: '系统名称',
          visible: true
        }
      ],
      dialogType: 'add', // 弹窗用途
      dialogData: null, // 弹窗编辑数据
      searchTipsHeight: 0,

      templateImportDialogVisible: false,
      templateImportDialogType: 'all', // all || add
      expandRows: []
    }
  },
  computed: {
    columns() {
      return this.tableColumn.filter((item) => item.visible)
    }
  },
  watch: {
    // 如果只有查看权限，则无需再继续查询按钮权限,
    selectedThirdSystem: {
      deep: true,
      handler(val) {
        if (val) this._search(true)
      },
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.searchTipsHeight = this.$refs?.searchTips?.$el?.clientHeight
    })
  },
  methods: {
    visibleChange(status) {
      if (status) {
        if (location.href.indexOf('localhost') === -1) {
          // this.$nextTick(() => {
          // // 获取下拉left样式
          //   const importPopper = document.getElementsByClassName('third-type-import')[0]
          //   importPopper.style.left = (Number(importPopper.style.left.replace('px', '')) + 88) + 'px'
          // })
        }
      }
    },
    // 展开行
    defaultExpandedKeys(row, expandedRows) {
      if (expandedRows) {
        this.expandRows.push(row.id + '')
      } else {
        this.expandRows = this.expandRows.filter((item) => {
          return item !== (row.id + '')
        }).map((item2) => {
          return item2 + ''
        })
      }
    },
    // 导入弹窗
    handleCommand(type) {
      this.templateImportDialogVisible = true
      this.templateImportDialogType = type
    },
    // 修改状态
    async changeStatus(row) {
      const params = {
        id: row.id,
        status: row.status
      }
      try {
        await moduleSrv.updateThirdTypeStatus(params)
        this._search(false)
      } catch {
        console.log('更改状态失败')
        // eslint-disable-next-line require-atomic-updates
        row.status = row.status === 0 ? 1 : 0
      }
    },
    uplaodSuccess() {
      this.templateImportDialogVisible = false
      this._search(true)
    },
    templateImportDialogClose() {
      this.templateImportDialogVisible = false
    },
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    // 搜索重置
    reset() {
      this.form = {}
      this._search(false)
    },
    // 新增事件类型、新增子类
    addSub(type, row) {
      this.dialogType = type
      if (type === 'add') {
        this.dialogData = null
      } else {
        this.dialogData = row
      }
      this.dialogVisible = true // 打开弹窗
    },
    // 编辑
    edit(row) {
      this.dialogType = 'edit'
      this.dialogVisible = true // 打开弹窗
      this.dialogData = row
    },
    // 删除
    patchRemove(row) {
      console.log('删除', row)
      this.$confirm('确定要删除该事件类型吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        moduleSrv.deleteThirdType(params).then((res) => {
          if (res.code === 0) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this._search(false)
          } else {
            this.$message({
              message: res.message || '操作失败！',
              type: 'error'
            })
          }
        })
      })
    },
    // 关闭弹窗
    dialogClose() {
      this.dialogVisible = false
      this._search(false)
    },
    async clickexpandFn(row, expandedRows) {
      await this.$nextTick()
      if (row.expandTaskIsOpen) {
        expandedRows.forEach(val => {
          if (row.eventCode === val.eventCode) {
            this.$refs.tableRef.toggleRowExpansion(val, true)
          } else {
            this.$refs.tableRef.toggleRowExpansion(val, false)
          }
        })
        return
      }
    },
    handleTree(tree) {
      tree.forEach((item) => {
        item.sourceSystemName = this.selectedThirdSystem.platformName
        if (item.children && item.children.length > 0) {
          this.handleTree(item.children)
        }
      })
    },
    _search(reset = false) {
      // reset 会刷新表格树结构加载 用于初始化
      if (reset) {
        this.expandRows = []
      }
      const params = {
        ...this.searchParams,
        sourceSystemCode: this.selectedThirdSystem.platformCode
      }
      this.loading = true
      moduleSrv.getThirdTypeList(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          const data = res.data
          this.handleTree(data)
          this.dataList = data
          this.page.total = countNodeTree(data)
          console.log('this.dataList', this.dataList)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    async viewInfo(action, row) {
      this.dialogVisible = true
      this.digType = action
      const params = {
        eventCode: row.eventCode
      }
      const res = await moduleSrv.getEvaluateModelByEventCode(params)
      if (res.code === SUCCESS_CODE) {
        this.digData = Object.assign({ eventCode: row.eventCode }, (res.data || {}))
      }
    },
    _action(action, row) {
      switch (action) {
        case 'view':
          this.viewInfo('view', row)
          break
        case 'appraise':
          this.viewInfo('edit', row)
          break
        case 'config':
          this.$router.push('/strategy-config/appraise-module')
          break

        default:
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/global-overrides.scss';

.page-wrapper {
  height: 100%;
  @include resultContent;
}
</style>
