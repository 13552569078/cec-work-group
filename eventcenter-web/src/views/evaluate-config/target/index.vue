<template>
  <div class="page-wrapper">
    <common-page-list has-footer>
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
          show-actions
          :search-items="filterTips"
          :select-count="selectCount"
          @heightChange="tipHeightChange"
          @delFilter="delFilter"
          @clear="clearFilters"
          @refresh="_search"
        >
          <el-button
            type="primary"
            class="add-btn common-action-btn"
            icon="custom-add common-icon"
            @click.stop="comActionAdd"
          >新增评价指标</el-button>
        </search-tips>
        <div v-loading="loading" class="result-list" :style="resultStyle">
          <el-table ref="tableRef" :data="dataList" style="width: 100%" tooltip-effect="light">
            <el-table-column
              type="index"
              width="55"
              :index="indexMethod"
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
            />
            <el-table-column :width="120" fixed="right" class-name="table-column-action">
              <template #header>
                <span>操作</span>
              </template>
              <template v-slot="{ row }">
                <span class="action-group">
                  <span class="action-btn" :class="{ 'is-disabled' : !row.isEdit }" @click="comActionEdit(row)">编辑</span>
                  <span class="action-divider">|</span>
                  <span class="action-btn" :class="{ 'is-disabled' : !row.isEdit }" @click="comActionDelete(row)">删除</span>
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
    <cmDialog v-if="dialogVisible" :dialog-visible="dialogVisible" :dig-type="digType" :dig-data="digData" />
  </div>
</template>

<script>
import pageMixin from '@/mixin/pageMixin'
import tableMixin from '@/mixin/tableWhh.mixin'
import moduleSrv from '@/api/dispatchWhh'
import cmDialog from './cmDialog.vue'
import searchMixin from '@/mixin/searchMixin'

import search from './search'

export default {
  name: 'SourceMsg',
  components: {
    cmDialog,
    search
  },
  mixins: [pageMixin, tableMixin, searchMixin],
  data() {
    return {
      dialogVisible: false,
      digType: '',
      digData: {},
      searchParams: {
        indexName: '',
        indexCode: ''
      },
      tableColumn: [
        {
          prop: 'indexName',
          label: '指标名称',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'indexCode',
          label: '指标编码',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'evaluateShow',
          label: '指标说明',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'updateTime',
          label: '更新时间',
          visible: true,
          minWidth: 200
        }
      ]
    }
  },
  methods: {
    _search() {
      const { pageNum = 1, pageSize = 10 } = this.page
      console.log(135, this.searchParams)
      const params = {
        ...this.searchParams,
        pageNum,
        pageSize
      }
      moduleSrv.getAppraiseTargetList(params).then((res) => {
        const { list = [], total = 0 } = res.data
        if (res.code === 0) {
          this.dataList = list
          this.page.total = total
        }
      })
    },
    comActionAdd(row = {}) {
      this.dialogVisible = true
      this.digType = 'add'
      this.digData = row
    },
    comActionLook(row) {
      this.dialogVisible = true
      this.digType = 'view'
      this.digData = row
    },
    comActionEdit(row) {
      this.digType = 'edit'
      this.digData = row
      this.dialogVisible = true
    },
    comActionDelete(row) {
      this.$confirm('确定要删除该评价指标吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        const id = row.id
        const params = {
          id
        }
        moduleSrv.postAppraiseTargetDelete(params).then((res) => {
          if (res.code === 0) {
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
    }
  }
}
</script>
<style scoped lang="scss">
.page-wrapper {
  height: 100%;
  @include resultContent;
}
</style>
