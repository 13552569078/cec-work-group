<template>
  <div class="strategy-config-setting">
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
            @click.stop="openSettingDialog('add')"
          >新增配置</el-button>
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
            <template v-for="(item, index) in columns">
              <el-table-column
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                show-overflow-tooltip
              >
                <template v-slot="{ row }">
                  <span v-if="item.prop === 'scopeType'">组织</span>
                  <span v-else>{{ row[item.prop] }}</span>
                </template>
              </el-table-column>
            </template>
            <el-table-column class-name="table-column-action">
              <template #header>
                <span>操作</span>
              </template>
              <template v-slot="{ row }">
                <span
                  class="action-btn"
                  @click="openSettingDialog(row)"
                >编辑</span>
                <span class="action-btn" @click="patchRemove(row)">删除</span>
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
    <dis-scope-config-dialog
      :visible.sync="dialogVisible"
      :editingdata="dialogData"
      :mode="dialogType"
      top="10vh"
      @cancle="dialogClose"
    />
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatch'
import search from './search'
import pageMixin from '@/mixin/pageMixin'
import searchMixin from '@/mixin/searchMixin'
import disScopeConfigDialog from './disScopeConfigDialog'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'DisScopeConfig',
  components: {
    search,
    disScopeConfigDialog
  },
  mixins: [pageMixin, searchMixin],
  data() {
    return {
      tableColumn: [
        {
          prop: 'subjectValueName',
          label: '角色类型',
          visible: true
        },
        {
          prop: 'scopeType',
          label: '范围类型',
          visible: true
        },
        {
          prop: 'scopeValueName',
          label: '范围值',
          visible: true
        }
      ],
      dialogType: 'add',
      dialogVisible: false, // 策略配置弹窗
      dialogData: null
    }
  },
  computed: {
    columns() {
      return this.tableColumn.filter((item) => item.visible)
    }
  },
  created() {
    this._search()
  },
  methods: {
    // 列表查询
    _search() {
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        pageNum,
        pageSize,
        ...this.searchParams
      }
      moduleSrv.getDisScopeConfigList(params).then((res) => {
        const { list = [], total = 0 } = res.data
        if (res.code === SUCCESS_CODE) {
          this.dataList = list
          this.page.total = total
        } else {
          console.warn('getStrategyList 接口报错')
        }
      })
    },
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    // 删除接口
    patchRemove(row) {
      this.$confirm('确定要删除该配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        moduleSrv.removeDisScopeConfig(params).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            this._search()
          } else {
            this.$message({
              message: res.message || '操作失败!',
              type: 'error'
            })
          }
        })
      })
    },
    // 新增、编辑策略配置
    openSettingDialog(row) {
      if (row === 'add') {
        // 新增
        this.dialogData = []
        this.dialogType = 'add'
      } else {
        // 编辑
        this.dialogType = 'edit'
        this.dialogData = row
      }
      this.dialogVisible = true
    },
    // 单条策略起停
    dialogClose() {
      this.dialogVisible = false
      // 关闭弹窗，触发更新
      this._search()
    }
  }
}
</script>

<style lang="scss" scoped>
.strategy-config {
  &-setting {
    .common-page-list {
      height: 100%;
      .search-section {
        background: #ffffff;
        border-top: 1px solid #36a4ff;
        margin-bottom: 16px;
      }
      .list-section {
        background: #ffffff;
        padding: 16px 0 16px 16px;
      }
      .foot-page {
        height: 64px;
        background: #ffffff;
        display: flex;
        align-items: center;
        padding: 0 20px;
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
          // width: 200px;
          margin-left: auto;
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
