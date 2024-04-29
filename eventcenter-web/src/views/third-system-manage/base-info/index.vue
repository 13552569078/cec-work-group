<!--
 * @description 任务中心-待办任务
 * @date 2020-09-08
 * @author lism
-->
<template>
  <div class="page-wrapper">
    <common-page-list>
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
          <el-button
            type="primary"
            class="add-btn common-action-btn"
            icon="custom-add common-icon"
            @click.stop="comActionAdd('add')"
          >新增第三方系统</el-button>
        </search-tips>
        <div v-loading="loading" class="result-list" :style="resultStyle">

          <el-table
            ref="tableHeight"
            :height="tableContentHeight"
            :data="tableData"
            style="width: 100%;"
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
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                :min-width="item.minWidth"
                :formatter="_formatter"
                show-overflow-tooltip
              >
                <template v-slot="{ row, column }">
                  <span v-if="item.prop == 'platformStatus'">
                    <el-switch
                      v-model="row[column.property]"
                      active-color="#4CC09E"
                      inactive-color="#BDBDBD"
                      :active-text="row[column.property] == true ? '启用' : '停用'"
                      :active-value="true"
                      :inactive-value="false"
                      @change="comActionChangeStatus(row)"
                    />
                  </span>
                  <span v-else> {{ row[column.property] }} </span>
                </template>
              </el-table-column>
            </template>
            <el-table-column
              fixed="right"
              label="操作"
              width="120"
              class-name="table-column-action"
            >
              <template slot-scope="scope">
                <span class="action-group">
                  <!-- <span class="action-btn" @click="comActionLook(scope.row)">查看</span> -->
                  <span class="action-btn" @click="comActionEdit(scope.row)">编辑</span>
                  <span class="action-divider">|</span>
                  <span class="action-btn" @click="comActionDelete(scope.row)">删除</span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template v-slot:footer>
        <cestc-pagination
          :current-page.sync="page.pageNum"
          :page-size="page.pageSize"
          :total="page.total"
          layout="total,prev,pager,next,jumper,sizes"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </template>
    </common-page-list>

    <cmDialog v-if="dialogVisible" :dialog-visible="dialogVisible" :dig-type="digType" :dig-data="digData" />
  </div>
</template>

<script>
import searchMixin from '@/mixin/searchMixin'
import search from './search'
import pageMixin from '@/mixin/page.mixin'
import tableMixin from '@/mixin/tableWhh.mixin'
import moduleSrv from '@/api/dispatchWhh'
import cmDialog from './cmDialog.vue'
import { SUCCESS_CODE } from '@/constants'

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
      tableColumn: [
        {
          prop: 'platformName',
          label: '系统名称',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'platformCode',
          label: '系统编码',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'systemTypeText',
          label: '系统类型',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'createTime',
          label: '创建时间',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'platformStatus',
          label: '状态',
          visible: true,
          width: 100
        }
      ]
    }
  },
  computed: {
    taskTypeOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getDictsByType('plan_task_type')
    }
  },
  methods: {
    _search() {
      const { pageNum = 1, pageSize = 10 } = this.page
      let systemType
      if (this.searchParams.systemType) {
        systemType = {
          sourcePlatform: this.searchParams.systemType === 'sourcePlatform' ? 1 : 0,
          handlePlatform: this.searchParams.systemType === 'handlePlatform' ? 1 : 0
        }
      } else {
        systemType = {}
      }
      const params = {
        platformName: this.searchParams.platformName || '',
        platformCode: this.searchParams.platformCode || '',
        ...systemType,
        pageNum,
        pageSize
      }
      moduleSrv.getPlatformInfoList(params).then((res) => {
        const { list = [], total = 0 } = res.data
        if (res.code === SUCCESS_CODE) {
          this.tableData = list.map(e => {
            return {
              systemTypeText: e.sourcePlatform && e.handlePlatform ? '来源系统，处置系统' : e.sourcePlatform ? '来源系统' : e.handlePlatform ? '处置系统' : '--',
              ...e
            }
          })
          this.page.total = total
        }
      })
    },
    comActionAdd(row = {}) {
      console.log('当前行数据：', row)
      this.dialogVisible = true
      this.digType = 'add'
      this.digData = {}
    },
    comActionLook(row) {
      console.log('当前行数据：', row)
      this.dialogVisible = true
      this.digType = 'view'
      this.digData = row
    },
    comActionEdit(row) {
      console.log('当前行数据：', row)
      this.dialogVisible = true
      this.digType = 'edit'
      this.digData = row
    },
    comActionDelete(row) {
      console.log('当前行数据：', row)
      this.$confirm('确定要删除该系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        const params = { id: row.id }
        moduleSrv.deletePlatformInfo(params).then((res) => {
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
    comActionChangeStatus(row) {
      // console.log('当前行数据platformStatus：',row.platformStatus )
      moduleSrv.updatePlatformStatus({
        id: row.id,
        platformStatus: row.platformStatus
      }).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          this._search()
        } else {
          this.$message({
            message: res.message || '操作失败！',
            type: 'error'
          })
          this._search()
        }
      })
    },
    // 表格内容格式化
    _formatter(row, column, cellValue) {
      if (column.property === 'limitTimeunit') {
        const map = {
          1: '时',
          2: '日',
          3: '周',
          4: '月'
        }
        return map[cellValue]
      }
      return cellValue || '-'
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
