<template>
  <div class="strategy-config-dict">
    <div class="left-tree">
      <left-tree
        :dict-data="leftDicts"
        default-expand-all
        node-key="dictType"
        :current-node-key="nodeKey"
        @handleNodeClick="_handleNodeClick"
        @handleAction="_handleAction"
        @addDict="_addDict"
      />
    </div>
    <div class="dict-right-result">
      <common-page-list has-footer class="common-page-list">
        <search slot="search" ref="searchRef" @searchList="dealwithFilter" @reset="clearFilters" />
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
          >
            <el-button
              type="primary"
              class="add-btn common-action-btn"
              icon="custom-add common-icon"
              @click.stop="_addDictData('add')"
            >新增字典</el-button>
          </search-tips>
          <div v-loading="loading" class="result-list" :style="resultStyle">
            <el-table
              :data="dataList"
              style="width: 100%"
              tooltip-effect="light"
            >
              <el-table-column
                type="index"
                width="55"
                :index="indexMethod"
                class-name="table-column-index"
              />
              <template v-for="(item, index) in tableColumn">
                <template v-if="item.prop === 'status'">
                  <!-- 激活状态 -->
                  <el-table-column
                    :key="index"
                    :prop="item.prop"
                    label="启停控制"
                    :width="item.width"
                    show-overflow-tooltip
                  >
                    <template v-slot="{ row }">
                      <el-switch
                        v-model="row.status"
                        active-color="#4CC09E"
                        inactive-color="#BDBDBD"
                        active-value="1"
                        inactive-value="2"
                        @change="_handleSwitch(row)"
                      />
                    </template>
                  </el-table-column>
                </template>
                <el-table-column
                  v-else
                  :key="index"
                  :label="item.label"
                  :prop="item.prop"
                  :width="item.width"
                  show-overflow-tooltip
                />
              </template>
              <el-table-column width="120" class-name="table-column-action">
                <template #header>
                  <span>操作</span>
                </template>
                <template v-slot="{ row }">
                  <span class="action-group">
                    <span class="action-btn" @click="_edit(row)">编辑</span>
                    <span class="action-divider">|</span>
                    <span class="action-btn" @click="_remove(row)">删除</span>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <template v-slot:footer>
          <cestc-pagination
            background
            :current-page="page.pageNum"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
            :page-sizes="[10, 20, 50, 100]"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </template>
      </common-page-list>
    </div>
    <!-- 新增字典弹窗 -->
    <add-dict-dialog
      :visible.sync="dialogVisible"
      :mode="dialogType"
      :dialogdata="dialogData"
      @cancle="_cancleDialog"
      @update="getDictTreeData"
    />
    <!-- 子集字典表单 -->
    <sub-dict-dialog
      :visible.sync="subDictDialogVisible"
      :mode="subDictDialogType"
      :dialogdata="subDictDialogData"
      :dicttype="nodeKey"
      @update="_search"
    />
  </div>
</template>

<script>
import leftTree from './leftTree'
import search from './search'
import pageMixin from '@/mixin/pageMixin'
import searchMixin from '@/mixin/searchMixin'
import addDictDialog from './addDictDialog'
import subDictDialog from './subDictDialog'
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'Dict',
  components: {
    search,
    leftTree,
    addDictDialog,
    subDictDialog
  },
  mixins: [pageMixin, searchMixin],
  data() {
    return {
      leftDicts: [],
      nodeKey: 'all',
      tableColumn: [
        {
          prop: 'dictLabel',
          label: '名称',
          visible: true
        },
        {
          prop: 'dictValue',
          label: '编码',
          visible: false
        },
        {
          prop: 'dictName',
          label: '字典类别名称',
          visible: true
        },
        {
          prop: 'createTime',
          label: '创建时间',
          visible: true
        },
        {
          prop: 'status',
          label: '状态',
          visible: true
        }
      ],
      dialogType: 'add',
      dialogVisible: false, // 字典新增、编辑
      dialogData: null,
      subDictDialogVisible: false,
      subDictDialogType: 'add',
      subDictDialogData: null
    }
  },
  async created() {
    // 事件类型所有模块都要使用，故此在这里进行请求
    await this.getDictTreeData()
    this._search()
  },
  methods: {
    // 获取左侧树形结构数
    getDictTreeData() {
      moduleSrv.getDictTreeData().then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.leftDicts = res.data || []
        } else {
          console.warn('getDictTreeData 接口报错')
        }
      })
    },
    // 左侧树节点点击的时候触发
    _handleNodeClick(node) {
      if (this.dictType === 'all') return
      this.nodeKey = node.dictType
      this._search()
    },
    // 左侧树编辑、删除操作触发
    _handleAction(obj) {
      if (obj.type === 'edit') {
        // 编辑
        this.dialogVisible = true
        this.dialogType = 'edit'
        this.dialogData = obj.data
      } else {
        // 删除
        this.$confirm('确定要删除该字典吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'cestc-confirm-warning'
        }).then(() => {
          const ids = obj.data.id
          const form = new FormData()
          form.append('ids', ids)
          moduleSrv.removeDict(form).then((res) => {
            if (res.code === SUCCESS_CODE) {
              this.$message({
                message: '操作成功！',
                type: 'success'
              })
              // 更新数据
              this.getDictTreeData()
            } else {
              this.$message({
                message: res.message || '操作失败！',
                type: 'error'
              })
            }
          })
        })
      }
    },
    // 新增字典
    _addDict() {
      this.dialogVisible = true
      this.dialogType = 'add'
    },
    // 新增右侧子集字典
    _addDictData() {
      // 如果当前节点是在全部，不能够进行新增
      if (this.nodeKey === 'all') {
        this.$message({
          message: '请先选择一个具体字典节点',
          type: 'error'
        })
        return
      }
      this.subDictDialogType = 'add'
      this.subDictDialogVisible = true
    },
    // 右侧字典子集列表查询
    _search() {
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        pageNum,
        pageSize,
        dictType: this.nodeKey,
        ...this.searchParams
      }
      moduleSrv.getDictDataList(params).then((res) => {
        const { list = [], total = 0 } = res.data
        // 匹配左侧的字典数，翻译为中文名称
        list.forEach((item) => {
          const temp = this.leftDicts.filter(
            (val) => val.dictType === item.dictType
          )
          item.dictName = temp && temp[0] && temp[0].dictName
        })
        if (res.code === SUCCESS_CODE) {
          this.dataList = list
          this.page.total = total
        } else {
          console.warn('getDictDataList 接口报错')
        }
      })
    },
    // 删除子集字典
    _remove(row) {
      this.$confirm('确定要删除该字典吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        const ids = row.id
        const form = new FormData()
        form.append('ids', ids)
        moduleSrv.removedictData(form).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            // 更新数据
            this._search()
          } else {
            this.$message({
              message: res.message || '操作失败！',
              type: 'error'
            })
          }
        })
      })
    },
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },

    // 编辑字典
    _edit(row) {
      this.subDictDialogType = 'edit'
      this.subDictDialogData = row
      this.subDictDialogVisible = true
    },

    // 单个字典状态修改
    _handleSwitch(row) {
      moduleSrv.editDictData(row).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
        } else {
          this.$message({
            message: res.message || '操作失败！',
            type: 'error'
          })
        }
        this._search()
      })
    },

    _cancleDialog() {
      this.dialogVisible = false
      // 关闭弹窗，触发更新
      this._search()
    }
  }
}
</script>

<style lang="scss" scoped>
.strategy-config {
  &-dict {
    display: flex;
    .left-tree {
      flex: 0 0 272px;
      width: 272px;
      margin: 0 16px 0 0;
      background-color: #fff;
    }
    .dict-right-result {
      flex: 1;
      width: calc(100% - 292px);
      display: flex;
      flex-direction: column;
      .result-content {
        height: 100%;
        .result-list {
          overflow-y: auto;
        }
      }
    }
    ::v-deep {
      .advance-search {
        display: flex;
        .cestc-form {
          flex: 1;
          .el-form-item {
            margin-bottom: 0;
          }
        }
        .a-btns {
          margin-left: auto;
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
