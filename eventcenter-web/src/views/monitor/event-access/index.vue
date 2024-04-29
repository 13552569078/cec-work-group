<template>
  <div class="page-wrapper">
    <common-page-list has-footer>
      <search
        v-if="thirdSystemList.length"
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
            v-show="false"
            type="primary"
            class="add-btn common-action-btn"
            icon="custom-add common-icon"
            @click.stop="comActionAdd"
          >新增评价模型</el-button>
        </search-tips>
        <div v-loading="loading" class="result-list" :style="resultStyle">
          <el-table
            ref="tableHeight"
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
              <el-table-column
                :key="index"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                :min-width="item.minWidth"
                show-overflow-tooltip
              >
                <template v-slot="scope">
                  <span v-if="item.prop == 'responeStatus'" :class="{'succclr': scope.row[scope.column.property] === '成功', 'failclr': scope.row[scope.column.property] === '失败'}">{{ scope.row[scope.column.property] || '--' }}</span>
                  <span v-else>{{ scope.row[scope.column.property] || '--' }}</span>
                </template>
              </el-table-column>
            </template>
            <el-table-column
              fixed="right"
              label="操作"
              width="70"
              class-name="table-column-action"
            >
              <template v-slot="{ row }">
                <span class="action-btn" @click="showLog(row.id)">查看</span>
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
import searchMixin from '@/mixin/searchMixin'
import search from './search'
import cmDialog from './cmDialog'
import moduleSrv from '@/api/dispatchWhh'
import { SUCCESS_CODE } from '@/constants'
import tableMixin from '@/mixin/tableWhh.mixin'
import thirdSystemMixin from '@/mixin/thirdSystemMixin'

export default {
  name: 'MontiorEventAccess',
  components: {
    cmDialog,
    search
  },
  mixins: [pageMixin, searchMixin, tableMixin, thirdSystemMixin],
  data() {
    return {
      dialogVisible: false,
      digType: '',
      digData: {},
      tableColumn: [
        {
          prop: 'id',
          label: '请求ID',
          visible: true,
          minWidth: 100
        },
        {
          prop: 'apiCode',
          label: '接口编码',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'apiName',
          label: '接口名称',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'eventCode',
          label: '事件编号',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'requestSysCode',
          label: '请求系统',
          visible: true,
          minWidth: 180
        },
        {
          prop: 'responeSysCode',
          label: '被请求系统',
          visible: true,
          minWidth: 180
        },
        {
          prop: 'responeStatus',
          label: '响应状态',
          visible: true,
          minWidth: 120
        },
        {
          prop: 'requestTime',
          label: '请求时间',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'responeTime',
          label: '响应时间',
          visible: true,
          minWidth: 200
        }
      ]
    }
  },
  methods: {
    showLog(id) {
      this.$router.push({ path: '/monitor/event-access-detail', query: { id }})
    },
    _search() {
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        pageNum,
        pageSize,
        ...this.searchParams
      }
      this.loading = true
      moduleSrv.getBusLogPage(params).then((res) => {
        const { list = [], total = 0 } = res.data
        if (res.code === SUCCESS_CODE) {
          this.dataList = list
          this.page.total = total
        }
      }).finally(() => { this.loading = false })
    },
    _action(action, row) {
      switch (action) {
        case 'add':
        {
          this.digType = 'add'
          this.dialogVisible = true
          break
        }
        case 'edit':
        {
          this.digType = 'edit'
          this.dialogVisible = true
          this.digData = row
          break
        }
        case 'view':
        {
          this.digType = 'view'
          this.dialogVisible = true
          this.digData = row
          break
        }
        case 'del':
          this._del(row)
          break
        default:
          break
      }
    },
    _del(row) {
      this.$confirm('确定要删除该事件来源吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        const ids = row.id
        const params = new FormData()
        params.append('ids', ids)
        moduleSrv.removedictData(params).then((res) => {
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
