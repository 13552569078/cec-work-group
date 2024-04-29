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
          >新增评价模型</el-button>
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
            >
              <template v-slot="{ row, column }">
                <span v-if="item.prop == 'status'">
                  <el-switch
                    v-model="row[column.property]"
                    :disabled="row.id === 1"
                    active-color="#4CC09E"
                    inactive-color="#BDBDBD"
                    :active-text="row[column.property] == 1 ? '启用' : '停用'"
                    :active-value="1"
                    :inactive-value="0"
                    @change="_changeStatus(row)"
                  />
                </span>
                <span v-else> {{ row[column.property] }} </span>
              </template>
            </el-table-column>
            <el-table-column :width="120" fixed="right" class-name="table-column-action">
              <template #header>
                <span>操作</span>
              </template>
              <template v-slot="{ row }">
                <span class="action-group">
                  <span class="action-btn" @click="comActionLook(row)">查看</span>
                  <span class="action-divider">|</span>
                  <span class="action-btn" :class="{ 'is-disabled' : row.id === 1 }" @click="comActionEdit(row)">编辑</span>
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

import search from './search'
import searchMixin from '@/mixin/searchMixin'

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
        sysCode: '',
        modelName: '',
        modelCode: ''
      },
      tableColumn: [
        {
          prop: 'modelName',
          label: '模型名称',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'modelCode',
          label: '模型编码',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'platformNames',
          label: '适用系统',
          visible: true,
          minWidth: 150
        },
        {
          prop: 'status',
          label: '状态',
          visible: true,
          width: 100,
          slot: true
        },
        {
          prop: 'modeShow',
          label: '模型说明',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'updateTime',
          label: '更新时间',
          visible: true,
          minWidth: 180
        }
      ]
    }
  },
  methods: {
    _search() {
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        ...this.searchParams,
        pageNum,
        pageSize
      }
      moduleSrv.getAppraiseModuleList(params).then((res) => {
        const { list = [], total = 0 } = res.data
        if (res.code === 0) {
          this.dataList = list.map(item => { item.platformNames = item.platformNames.join(','); return item })
          this.page.total = total
        }
      })
    },
    // 启用、停用状态
    _changeStatus(row) {
      console.log(318, row)
      moduleSrv.postAppraiseModuleStatusChange({ id: row.id, status: row.status }).then((res) => {
        if (res.code === 0) {
          this.$message({
            message: `${row.status === 0 ? '停用' : '开启'}成功！`,
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
    },
    comActionAdd(row = {}) {
      this.$router.push({ path: '/evaluate-config/edit-model', query: { digType: 'add' }})
    },
    comActionLook(row) {
      // console.log('当前行数据：', row)
      // this.dialogVisible = true
      // this.digType = 'view'
      // this.digData = row
      this.$router.push({ path: '/evaluate-config/edit-model', query: { digType: 'view', id: row.id }})
    },
    comActionEdit(row) {
      // console.log('当前行数据：', row)
      // this.dialogVisible = true
      // this.digType = 'edit'
      // this.digData = row

      this.$router.push({ path: '/evaluate-config/edit-model', query: { digType: 'edit', id: row.id }})
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
