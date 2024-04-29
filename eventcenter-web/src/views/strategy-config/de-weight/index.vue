<!--
@Author: lism
@Description: 去重策略配置
@Date: 2023-11-07
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
          >新增去重策略配置</el-button>
        </search-tips>
        <div v-loading="loading" class="result-list" :style="resultStyle">
          <el-table
            ref="tableRef"
            :data="tranformData"
            style="width: 100%"
            tooltip-effect="light"
            @expand-change="clickexpandFn"
          >
            <el-table-column
              type="index"
              width="55"
              :index="indexMethod"
              class-name="table-column-index"
            />
            <el-table-column type="expand" width="30">
              <template v-slot="{ row }">
                <div class="expandcolumnbox">
                  <div v-if="row.strategyIndexList && row.strategyIndexList.length > 0" class="epdcblinebox">
                    <div v-for="(val, idx) in row.strategyIndexList" :key="idx" class="epdcbline">
                      <div class="txt wid0">&nbsp;</div>
                      <div class="txt wid1">事件去重指标{{ idx + 1 }}：{{ val.strategyIndexName }}</div>
                      <div class="txt wid2">相似度：{{ val.strategyIndexValue }}%</div>
                    </div>
                  </div>
                  <div v-else class="nodata">暂无任务</div>
                </div>
              </template>
            </el-table-column>
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
                <template v-slot="{row, column}">
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
            <el-table-column
              :width="280"
              fixed="right"
              class-name="table-column-action"
            >
              <template #header>
                <span>操作</span>
              </template>
              <template v-slot="{row}">
                <span class="action-group">
                  <span class="action-btn" @click="_action('view', row)">查看</span>
                  <span class="action-divider">|</span>
                  <span class="action-btn" @click="_action('edit', row)">编辑</span>
                  <span class="action-divider">|</span>
                  <span class="action-btn" @click="_action('del', row)">删除</span>\
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
  name: 'DeWeight',
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
          prop: 'platText',
          label: '平台系统',
          visible: true,
          minWidth: 100
        },
        {
          prop: 'eventTypeNames',
          label: '事件类型',
          visible: true,
          minWidth: 150
        },
        {
          prop: 'strategyCode',
          label: '去重策略编码',
          visible: true,
          minWidth: 100
        },
        {
          prop: 'strategyName',
          label: '去重策略名称',
          visible: true,
          minWidth: 130
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
    eventPlatformOptions() {
      return this.$store.getters.getBsDictsByType('event_platform')
    },
    eventPlatformOptionsMap() {
      const platform = this.eventPlatformOptions || []
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventSourceOptionsMap() {
      const platform = this.$store.getters.getBsDictsByType('event_origin')
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
    },
    replyStateMapOptionsMap() {
      const platform = this.$store.getters.getBsDictsByType('reply_state')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventStateOptionsMap() {
      const platform = this.$store.getters.getBsDictsByType('event_state')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    tranformData() {
      return this.dataList.map((item) => {
        item.sourceText = this.eventSourceOptionsMap.get(item.eventSrcId)
        item.urgentText = this.eventUrgentOptionsMap.get(item.eventUrgent)
        item.eventStateText = this.eventStateOptionsMap.get(item.eventState)
        item.platText = this.eventPlatformOptionsMap.get(item.platformSrc)
        // 把事件大、中、小类组合
        item.eventTypeText = `${item.eventTypeName || ''}`
        return item
      })
    }
  },
  methods: {
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
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
      this.$set(row, 'expandTaskIsOpen', true)
      this.$refs.tableRef.toggleRowExpansion(row, true)
    },
    _search() {
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        mergerFlag: '0',
        pageNum,
        pageSize,
        ...this.searchParams
      }
      this.loading = true
      moduleSrv.getEventRmvDupStayList(params).then((res) => {
        const { list = [], total = 0 } = res.data
        if (res.code === SUCCESS_CODE) {
          this.dataList = list
          this.page.total = total
          if (this.dataList.length > 0) {
            this.$nextTick(async() => {
              await this.clickexpandFn(this.dataList[0])
            })
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },

    _del(row) {
      this.$confirm('确定要删除该去重策略配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        moduleSrv.getEventRmvDupStayDelete({ id: row.id }).then((res) => {
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
    // 状态改变
    _changeStatus(row) {
      moduleSrv.postEventRmvDupStayUpdate(row).then((res) => {
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
