<!--
@Author: lism
@Description: 时限配置
@Date: 2023-11-09
-->
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
            @click="_action('add')"
          >新增时限配置</el-button>
        </search-tips>
        <div v-loading="loading" class="result-list" :style="resultStyle">
          <el-table ref="tableRef" :data="dataList" style="width: 100%" tooltip-effect="light">
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
                :formatter="_formatter"
                show-overflow-tooltip
              >
                <!-- 对事件处理状态特殊处理，给不同的状态不同的标记 -->
                <template v-slot="{ row, column }">
                  <span v-if="item.prop == 'status'">
                    <el-switch
                      v-model="row[column.property]"
                      active-color="#4CC09E"
                      inactive-color="#BDBDBD"
                      :active-text="row[column.property] == 1 ? '启用' : '停用'"
                      :active-value="1"
                      :inactive-value="0"
                      @change="_action('change-status', row)"
                    />
                  </span>
                  <span v-else> {{ row[column.property] }} </span>
                </template>
              </el-table-column>
            </template>
            <el-table-column :width="160" fixed="right" class-name="table-column-action">
              <template #header>
                <span>操作</span>
              </template>
              <template v-slot="{ row }">
                <span class="action-group">
                  <span class="action-btn" @click="_action('view', row)">查看</span>
                  <span class="action-divider">|</span>
                  <span class="action-btn" @click="_action('edit', row)">编辑</span>
                  <span class="action-divider">|</span>
                  <span class="action-btn" @click="_action('del',row)">删除</span>
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
    <cmDialog
      v-if="dialogVisible"
      :dialog-visible="dialogVisible"
      :dig-type="digType"
      :dig-data="digData"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixin/page.mixin'
import searchMixin from '@/mixin/searchMixin'
import cmDialog from './cmDialog'
import search from './search'
import moduleSrv from '@/api/dispatchWhh'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'Appraise',
  components: {
    search,
    cmDialog
  },
  mixins: [pageMixin, searchMixin],
  data() {
    return {
      dialogVisible: false,
      digType: '',
      digData: {},
      tableColumn: [
        {
          prop: 'platformSrc',
          label: '发起方系统',
          visible: true,
          minWidth: 100
        },
        {
          prop: 'eventTypeName',
          label: '发起方事件类型',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'eventUrgent',
          label: '紧急程度',
          visible: true,
          minWidth: 100
        },
        {
          prop: 'processTimeOutDuration',
          label: '流程超时时限',
          visible: true,
          minWidth: 100
        },
        {
          prop: 'dispatchTimeOutDuration',
          label: '调度超时时限',
          visible: true,
          minWidth: 100
        },
        {
          prop: 'handleTimeOutDuration',
          label: '处置超时时限',
          visible: true,
          minWidth: 100
        },
        {
          prop: 'triggerPriority',
          label: '触发优先级',
          visible: true,
          minWidth: 80
        },
        {
          prop: 'updateTime',
          label: '更新时间',
          visible: true,
          minWidth: 100
        },
        {
          prop: 'status',
          label: '状态',
          visible: true,
          minWidth: 100
        }
      ]
    }
  },
  computed: {
    // 把字典转换为字典方式存储，方便获取对应中文
    eventPlatformOptionsMap() {
      const platform = this.$store.getters.getBsDictsByType('event_platform')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventUrgentOptionsMap() {
      const platform = this.$store.getters.getBsDictsByType('event_urgent_level')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    }

  },
  methods: {
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },

    _search() {
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        pageNum,
        pageSize,
        ...this.searchParams
      }
      // 事件类型单选
      params.eventTypeId = Array.isArray(params.eventTypeId)
        ? params.eventTypeId[2]
        : ''
      this.loading = true
      moduleSrv
        .getTimeConfigPage(params)
        .then((res) => {
          const { list = [], total = 0 } = res.data
          if (res.code === SUCCESS_CODE) {
            this.dataList = list
            this.page.total = total
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 删除
    _del(row) {
      this.$confirm('确定要删除该时限配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        moduleSrv.postTimeConfigDelete(params).then((res) => {
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
    // 启用、停用状态
    _changeStatus(row) {
      moduleSrv.postTimeConfigEnable({
        id: row.id,
        status: row.status
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
        }
      })
    },
    _action(action, row) {
      switch (action) {
        case 'add':
        case 'view':
        case 'edit':
          this.dialogVisible = true
          this.digType = action
          this.digData = row
          break
        case 'del':
          this._del(row)
          break
        case 'change-status':
          this._changeStatus(row)
          break

        default:
          break
      }
    },
    // 表格内容格式化
    _formatter(row, column, cellValue) {
      if (column.property === 'platformSrc') {
        return this.eventPlatformOptionsMap.get(row.platformSrc)
      }
      if (column.property === 'eventUrgent') {
        return this.eventUrgentOptionsMap.get(row.eventUrgent) || '全部'
      }
      if (column.property === 'eventTypeName') {
        return row.eventTypeName || '全部'
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
  ::v-deep {
    @include oneLineSearch;
  }
}
</style>
