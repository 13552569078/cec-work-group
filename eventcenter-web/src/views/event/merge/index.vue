<!--
@Author: lism
@Description: 合并事件
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
          :search-items="filterTips"
          :select-count="selectCount"
          @heightChange="tipHeightChange"
          @delFilter="delFilter"
          @clear="clearFilters"
          @refresh="_search"
        />
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
                  <div v-if="row.duplicateTcEventViewVO" class="epdcblinebox">
                    <div class="epdcbline">
                      <div class="txt wid0">&nbsp;</div>
                      <div class="txt wid1"><span>合并主事件：</span>{{ row.duplicateTcEventViewVO.eventCode }}</div>
                      <div class="txt wid2">{{ row.duplicateTcEventViewVO.title || '-' }}</div>
                      <div class="txt wid3">{{ row.duplicateTcEventViewVO.platText || '-' }}</div>
                      <div class="txt wid4">{{ row.duplicateTcEventViewVO.sourceText || '-' }}</div>
                      <div class="txt wid5">{{ row.duplicateTcEventViewVO.eventTypeText || '-' }}</div>
                      <div class="txt wid6">{{ row.duplicateTcEventViewVO.urgentText || '-' }}</div>
                      <div class="txt wid6">{{ row.duplicateTcEventViewVO.eventStateText || '-' }}</div>
                      <div class="txt wid7" @click="_action('to-info',row.duplicateTcEventViewVO)">详情</div>
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
                show-overflow-tooltip
                :formatter="_formatter"
              />
            </template>
            <el-table-column
              :width="180"
              fixed="right"
              class-name="table-column-action"
            >
              <template #header>
                <span>操作</span>
              </template>
              <template v-slot="{row}">
                <span class="action-group">
                  <!-- 1.已作废 2.已去重 3.已撤销 -->
                  <span class="action-btn" @click="_action('view', row)">查看</span>
                  <span class="action-divider">|</span>
                  <span :class="['action-btn', {'is-disabled': ![0,1].includes(row.duplicateState)}]" @click="_action('merge', row)">合并</span>
                  <span class="action-divider">|</span>
                  <span :class="['action-btn', {'is-disabled': !(row.duplicateState === 5 && row.duplicateTcEventViewVO.eventState != 5 && (row.replyState === 0 || row.replyState === null))}]" @click="_action('cancle-merge', row)">拆分</span>
                  <el-dropdown
                    trigger="click"
                    placement="bottom"
                    class="more-action"
                    @command="_action($event,row)"
                  >
                    <i class="el-icon-arrow-down action-btn" />
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        class="dropdown-menu-item"
                        command="submit"
                        :disabled="![0,1].includes(row.duplicateState)"
                      >
                        <span>提交事件</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
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
    <cmEventListDialog v-if="dialogMerge" :dialog-visible-event-list="dialogMerge" :dig-type-event-list="dialogMergeType" :dig-data-event-list="dialogMergeData" />
  </div>
</template>

<script>
import pageMixin from '@/mixin/page.mixin'
import searchMixin from '@/mixin/searchMixin'
import cmDialog from '../de-weight/cmDialog'
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
      dialogMerge: false,
      dialogMergeType: '',
      dialogMergeData: {},
      tableColumn: [
        {
          prop: 'eventCode',
          label: '事件编号',
          visible: true,
          minWidth: 150
        },
        {
          prop: 'title',
          label: '事件标题',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'platText',
          label: '平台系统',
          visible: true,
          minWidth: 120
        },
        {
          prop: 'sourceText',
          label: '事件来源',
          visible: true,
          minWidth: 120
        },
        {
          prop: 'eventTypeText',
          label: '事件类型',
          visible: true,
          minWidth: 120
        },
        {
          prop: 'urgentText',
          label: '紧急程度',
          visible: true,
          minWidth: 100
        },
        {
          prop: 'duplicateStateName',
          label: '合并状态',
          visible: true,
          minWidth: 120
        },
        {
          prop: 'replyStateText',
          label: '反馈状态',
          visible: true,
          minWidth: 120
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
        item.platText = this.eventPlatformOptionsMap.get(`${item.platformSrc}`)
        item.sourceText = this.eventSourceOptionsMap.get(`${item.eventSrcId}`)
        item.urgentText = this.eventUrgentOptionsMap.get(`${item.eventUrgent}`)
        item.replyStateText = this.replyStateMapOptionsMap.get(`${item.replyState}`)
        item.eventTypeText = `${item.eventTypeLName || '-'}/${
          item.eventTypeMNAME || '-'
        }/${item.eventTypeName || '-'}`
        if (item.eventTypeIdFourName) {
          item.eventTypeText += `/${item.eventTypeIdFourName}`
        }
        if (item.eventTypeIdFiveName) {
          item.eventTypeText += `/${item.eventTypeIdFiveName}`
        }
        if (item.duplicateTcEventViewVO) {
          item.duplicateTcEventViewVO.platText = this.eventPlatformOptionsMap.get(`${item.duplicateTcEventViewVO.platformSrc}`)
          item.duplicateTcEventViewVO.sourceText = this.eventSourceOptionsMap.get(`${item.duplicateTcEventViewVO.eventSrcId}`)
          item.duplicateTcEventViewVO.urgentText = this.eventUrgentOptionsMap.get(`${item.duplicateTcEventViewVO.eventUrgent}`)
          item.duplicateTcEventViewVO.eventStateText = this.eventStateOptionsMap.get(`${item.duplicateTcEventViewVO.eventState}`)
          item.duplicateTcEventViewVO.eventTypeText = item.duplicateTcEventViewVO.eventTypeName
        }
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
        mergerFlag: '1',
        pageNum,
        pageSize,
        ...this.searchParams
      }
      this.loading = true
      moduleSrv.getEventRmvDupList(params).then((res) => {
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
    async viewInfo(row) {
      this.dialogVisible = true
      this.digType = 'view'
      const params = {
        id: row.id
      }
      const res = await moduleSrv.getEventRmvDupDetail(params)
      if (res.code === SUCCESS_CODE) {
        this.digData = res.data || {}
      }
    },

    canclemerge(row) {
      this.$confirm('<div class="main-value">确定要拆分该条事件吗？</div><div class="sub-value">主事件未办结之前，可以拆分。拆分之后，该事件将重新回到已拆分状态，可以进行，合并、提交事件操作</div>', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning',
        dangerouslyUseHTMLString: true
      }).then(async() => {
        const params = {
          id: row.id
        }
        try {
          const res = await moduleSrv.postEventRmvDupEventMergeSplit(params)
          if (res.code === SUCCESS_CODE) {
            this.resultList()
            this.$message({
              message: '事件拆分成功！',
              type: 'success'
            })
          } else {
            this.$message({
              message: '事件拆分失败！',
              type: 'error'
            })
          }
        } catch (e) {
          this.$message({
            message: '事件撤销去重失败！',
            type: 'error'
          })
        }
      })
    },

    submit(row) {
      this.$confirm('<div class="main-value">确定要提交该条事件吗？</div><div class="sub-value">确认提交该事件，将认为该事件并非和相似事件重复，事件将进入正常处理流程</div>', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning',
        dangerouslyUseHTMLString: true
      }).then(async() => {
        const params = {
          id: row.id
        }
        try {
          const res = await moduleSrv.postEventRmvDupRevoke(params)
          if (res.code === SUCCESS_CODE) {
            this.$message({
              message: '事件提交成功！',
              type: 'success'
            })
            this._search()
          } else {
            this.$message({
              message: '事件提交失败！',
              type: 'error'
            })
          }
        } catch (e) {
          this.$message({
            message: '事件提交失败！',
            type: 'error'
          })
        }
      })
    },
    _action(action, row) {
      switch (action) {
        case 'view':
          this.viewInfo(row)
          break
        case 'merge':
          this.dialogMerge = true
          this.dialogMergeType = 'edit'
          this.dialogMergeData = row
          break
        case 'cancle-merge':
          this.canclemerge(row)
          break
        case 'submit':
          this.submit(row)
          break
        case 'to-info':
          this.$router.push({
            path: '/event/merge/info',
            query: {
              taskId: row.taskId,
              id: row.id,
              refresh: true
            }
          })
          break

        default:
          break
      }
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
