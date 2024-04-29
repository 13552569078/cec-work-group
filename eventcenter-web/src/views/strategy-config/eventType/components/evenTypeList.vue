<template>
  <common-page-list :has-footer="false" class="common-page-list">
    <search-form
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
        :show-actions="true"
        :search-items="filterTips"
        :select-count="selectCount"
        @heightChange="tipHeightChange"
        @delFilter="delFilter"
        @clear="clearFilters"
        @refresh="_search"
      >
        <slot name="button">
          <el-button
            class="add-btn common-action-btn"
            icon="custom-export common-icon"
            @click.stop="handleExport"
          >导出全部</el-button>
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
            icon="custom-add common-icon"
            class="add-btn common-action-btn"
            @click="openEditDialog('add')"
          >新增一级分类</el-button>
        </slot>
      </search-tips>
      <div v-loading="loading" class="result-list" :style="resultStyle">
        <el-table
          ref="tableHeight"
          :data="dataList"
          style="width: 100%"
          height="100%"
          class="table"
          row-key="id"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          :expand-row-keys="expandRows"
          @expand-change="defaultExpandedKeys"
        >
          <!-- 自定义序号 -->
          <el-table-column
            type=""
            prop="parentIndex"
            width="55"
            class-name="table-column-index"
          />
          <el-table-column
            prop="name"
            label="类型名称"
            show-overflow-tooltip
            min-width="200"
          />
          <el-table-column
            prop="code"
            label="类型编码"
            width="200"
          />
          <el-table-column
            prop="status"
            label="状态"
            width="100"
          >
            <template v-slot="{row}">
              <el-switch
                v-model="row.status"
                active-color="#4CC09E"
                inactive-color="#BDBDBD"
                :active-text="row.status == 1 ? '停用' : '启用'"
                :active-value="0"
                :inactive-value="1"
                @change="changeStatus(row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="gridDeal"
            label="是否网格处理"
            width="120"
          >
            <template v-slot="{row}">
              {{ row.gridDeal?'是':'否' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="gridDeal"
            label="是否叶子节点"
            width="120"
          >
            <template v-slot="{row}">
              {{ row.leafPoint ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="gridDeal"
            label="是否联动指挥事项"
            width="150"
          >
            <template v-slot="{row}">
              {{ row.dispatchDeal ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="speType"
            prop="busiTypeName"
            label="业务分类"
            width="200"
          />
          <el-table-column
            v-if="speType"
            prop="speTypeName"
            label="专项类型"
            width="200"
          />
          <el-table-column
            fixed="right"
            label="操作"
            :width="210"
            class-name="table-column-action"
          >
            <template v-slot="{row}">
              <span class="action-group">
                <span class="action-btn" :class=" {'is-disabled' : ((row.leafPoint === 1 || row.level >= 5) || row.code==='OTHERONE')}" @click="openEditDialog('addSub', row)">增加子类</span>
                <span class="action-divider">|</span>
                <span v-if="row.level===1" class="action-btn" :class=" {'is-disabled' : (row.status === 0 || row.code==='OTHERONE')}" @click="openEditDialog('edit',row)">编辑</span>
                <span v-else class="action-btn" :class=" {'is-disabled' : (row.status === 0 || row.code==='OTHERONE')}" @click="openEditDialog('editSub',row)">编辑</span>
                <span class="action-divider">|</span>
                <span class="action-btn" :class=" {'is-disabled' : ((row.haveChild || row.status === 0) || row.code==='OTHERONE') }" @click="deleteEventType(row)">删除</span>
                <el-dropdown
                  trigger="click"
                  placement="bottom"
                  class="more-action"
                  @command="goLeafInfo(row)"
                >
                  <i class="el-icon-arrow-down action-btn" />
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      class="dropdown-menu-item"
                      command="submit"
                      :disabled="!(row.leafPoint === 1 && +row.status === 0)"
                    >
                      <span>查看</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 事件类型管理弹窗：新增、编辑 -->
      <event-type-dialog
        :visible.sync="eventDialogVisible"
        :editingdata="dialogData"
        :mode="dialogType"
        @cancle="eventDialogClose"
      />
      <!-- 全量导入弹窗、增量导入弹窗 -->
      <template-import-dialog
        v-if="templateImportDialogVisible"
        :visible.sync="templateImportDialogVisible"
        :mode="templateImportDialogType"
        @cancle="templateImportDialogClose"
        @uplaodSuccess="uplaodSuccess"
      />
    </div>
  </common-page-list>
</template>

<script>
import SearchForm from './searchForm'
import pageMixin from '@/mixin/pageMixin'
import searchMixin from '@/mixin/searchMixin'
import eventTypeModuleSrv from '@/api/eventType'
import eventTypeDialog from './eventTypeDialog'
import templateImportDialog from './templateImportDialog'
import { countNodeTree } from '@/utils/treeUtil'
import moduleSrv from '@/api/eventType'
export default {
  name: 'EvenTypeList',
  components: {
    SearchForm,
    eventTypeDialog,
    templateImportDialog
  },
  mixins: [pageMixin, searchMixin],
  doNotInit: true,
  props: {
    eventType: {
      type: String,
      default: ''
    },
    actionWidth: {
      type: [String, Number],
      default: 80
    },
    showTipsBtn: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableColumn: [
        {
          prop: 'name',
          label: '事件名称',
          visible: true,
          minWidth: '130'
        },
        {
          prop: 'code',
          label: '类型编码',
          visible: true,
          minWidth: '120'
        },
        {
          prop: 'status',
          label: '状态',
          visible: true,
          minWidth: '200'
        },
        {
          prop: 'gridDeal',
          label: '是否网格处理',
          visible: true
        },
        {
          prop: 'eventStateText',
          label: '操作',
          visible: true,
          minWidth: '100'
        }
      ],
      expandRows: [],
      eventDialogVisible: false,
      dialogType: 'add',
      dialogData: null,
      templateImportDialogVisible: false,
      templateImportDialogType: 'all' // all || add
    }
  },
  computed: {
    speType() {
      return this.$route.query.speType || ''
    }
  },
  mounted() {
    // this.init(true)
  },
  methods: {
    // 导入弹窗
    handleCommand(type) {
      this.templateImportDialogVisible = true
      this.templateImportDialogType = type
    },
    uplaodSuccess() {
      this.templateImportDialogVisible = false
      this._search(true)
    },
    templateImportDialogClose() {
      this.templateImportDialogVisible = false
    },
    init(reset = false) {
      // reset 会刷新表格树结构加载 用于初始化
      if (reset) {
        this.expandRows = []
      }
      this.$refs?.searchRef?.searchList()
    },
    // 列表搜索接口
    async _search(reset = false) {
      // reset 会刷新表格树结构加载 用于初始化
      if (reset) {
        this.expandRows = []
      }
      const params = {
        ...this.searchParams
      }
      // 只要叶子结点
      if (params.speType) {
        params.speType = this.$refs?.searchRef?.getSpeParam(params.speType, params.dispatchDeal)
      }
      const { data } = await eventTypeModuleSrv.postEventTypeselectAllTree(params)
      this.dataList = data.map((item, index) => {
        item.parentIndex = index + 1
        return item
      })
      this.page.total = countNodeTree(data)
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
    async downLoad() {
      const serviceRes = await eventTypeModuleSrv.getDownLoad(null, { responseType: 'blob' })
      const fileName = decodeURI(serviceRes.headers['content-disposition'].split(';')[1].split('=')[1])
      const url = window.URL.createObjectURL(new Blob([serviceRes.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      link = null
    },
    // 修改状态
    async changeStatus(row) {
      const params = {
        id: row.id,
        status: row.status
      }
      try {
        await eventTypeModuleSrv.postUpdateEventTypeStatus(params)
        this._search(false)
      } catch {
        console.log('更改状态失败')
        // eslint-disable-next-line require-atomic-updates
        row.status = row.status === 0 ? 1 : 0
      }
    },
    // 新增子类
    openEditDialog(type, row = {}) {
      this.dialogData = {}
      if (type === 'add') {
        this.dialogData = {}
      }
      if (type === 'addSub') {
        this.dialogData = {
          parentId: row.id,
          parentName: row.name,
          dispatchDeal: row.dispatchDeal
        }
      }
      if (type === 'edit' || type === 'editSub') {
        Object.assign(this.dialogData, row)
      }
      if (row.leafPoint) {
        this.$router.push({
          name: 'eventTypeLeaf',
          query: {
            speType: this.speType ? this.speType : '',
            id: row.id
          }
        })
      } else {
        this.dialogType = type
        this.eventDialogVisible = true
      }
    },
    async deleteEventType(row) {
      await this.$confirm(`是否确认删除[${row.name}]`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      })
      const params = {
        id: row.id
      }
      try {
        await eventTypeModuleSrv.postDeleteEventType(params)
        this._search(false)
      } catch {
        console.log('删除失败')
      }
    },
    // 关闭弹窗且刷新列表
    eventDialogClose(updateFlag = false) {
      this.eventDialogVisible = false
      updateFlag && this._search(false)
    },
    goLeafInfo(data) {
      this.$router.push({
        name: 'eventTypeLeafInfo',
        query: {
          id: data.id
        }
      })
    },
    async handleExport() {
      const serviceRes = await moduleSrv.getEventTypesExcelExport({}, { responseType: 'blob' })
      const fileName = decodeURI(serviceRes.headers['content-disposition'].split(';')[1].split('=')[1])
      const url = window.URL.createObjectURL(new Blob([serviceRes.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      link = null
    }
  }
}
</script>

<style lang="scss" scoped>
.common-page-list {
  @include resultContent;
}
.custom-dropdown-menu{
  width: 88px!important;
  left:16px!important;
}
::v-deep{
  .el-dropdown-menu__item{
    &.dropdown-menu-item{
      &.is-disabled{
        color: #bdbdbd;
      }
    }
  }
}
</style>
