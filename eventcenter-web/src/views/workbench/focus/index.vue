<template>
  <div ref="eFocus" class="event-focus">
    <statistic ref="statisticRef" @search="st_search" />
    <div id="etfSearch" ref="searchRefDiv" class="etf-search">
      <search-form
        slot="search"
        ref="searchRef"
        @searchList="dealwithFilter"
        @reset="clearFilters"
      />
    </div>
    <div class="result-content" :style="{height:resultHeight+'px'}">
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
      />
      <div v-loading="loading" class="result-list" :style="resultStyle">
        <el-table ref="tableRef" height="100%" :data="tranformData" style="width: 100%" tooltip-effect="light">
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
            :show-overflow-tooltip="item.prop !== 'eventTypeText'"
          >
            <!-- 对事件处理状态特殊处理，给不同的状态不同的标记 -->
            <template v-if="item.prop === 'eventStateName'" v-slot="{ row }">
              <span :class="`${_tranfromState(row)}-wrapper`">
                <svg-icon :icon-class="_tranfromState(row)" />
                {{ row.eventStateName }}
              </span>
            </template>
            <!--  -->
            <template v-else-if="item.prop === 'eventCode'" v-slot="{ row }">
              <span class="event-code">
                <span style="margin-right: 5px">{{ row.eventCode }}</span>
                <el-popover v-if="row.uuid" placement="top" popper-class="table-popper" trigger="hover">
                  <span>第三方事件编码：{{ row.uuid }} <el-button type="text" class="primary-text" @click="handleCopy(row.uuid)">复制</el-button></span>
                  <img slot="reference" class="icon-info" :src="IconInfo">
                </el-popover>
              </span>
            </template>
            <template v-else-if="item.prop === 'eventTypeText'" v-slot="{ row }">
              <span class="event-types">
                <el-popover placement="top" class="et-type" popper-class="table-popper" trigger="hover">
                  <span class="types">{{ row.eventTypeText }}</span>
                  <span slot="reference">{{ row.eventTypeText }}</span>
                </el-popover>
                <el-popover v-if="row.thirdEventTypeName" class="third-type" placement="top" popper-class="table-popper" trigger="hover">
                  <span>第三方事件类型：{{ row.thirdEventTypeName }}<el-button type="text" class="primary-text" @click="handleCopy(row.thirdEventTypeName)">复制</el-button></span>
                  <img slot="reference" class="icon-info" :src="IconInfo">
                </el-popover>
              </span>
            </template>
            <template v-else v-slot="{ row }">
              <span :class="row.customizeClass">
                {{ row[item.prop] || "--" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :width="80" fixed="right" class-name="table-column-action">
            <template #header>
              <span>操作</span>
            </template>
            <template v-slot="{ row }">
              <span class="action-group">
                <span class="action-btn" @click="viewDetail(row)">查看</span>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div ref="pageRef" class="foot-page">
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
    </div>
  </div>
</template>

<script>
import statistic from './statistic.vue'
import searchForm from './searchForm.vue'
import pageMixin from '@/mixin/page.mixin'
import searchMixin from '@/mixin/searchMixin'
import resizeObserverMixin from '@/mixin/resizeObserverMixin'
import service from '@/api/dispatch'
import IconInfo from '@/assets/table/icon_info.png'

const convergeStateMap = {
  'processing': '进行中',
  'done': '已办结',
  'cancelled': '已作废'
}
export default {
  name: 'EventcenterWebIndex',
  components: { statistic, searchForm },
  mixins: [pageMixin, searchMixin, resizeObserverMixin],
  data() {
    return {
      IconInfo,
      tableColumn: [
        {
          prop: 'title',
          label: '事件标题',
          minWidth: 160
        },
        {
          prop: 'eventCode',
          label: '事件编码',
          width: 210
        },
        {
          prop: 'eventTypeText',
          label: '事件类型',
          minWidth: 220
        },
        {
          prop: 'reportSourceName',
          label: '汇聚类型',
          width: 110
        },
        {
          prop: 'platformSrcName',
          label: '来源系统',
          width: 110
        },
        {
          prop: 'eventStateName',
          label: '事件状态',
          width: 110
        },
        {
          prop: 'happenTime',
          label: '发生时间',
          minWidth: 160
        },
        {
          prop: 'eventAddress',
          label: '发生地址',
          minWidth: 360
        },
        {
          prop: 'overtimeFlagName',
          label: '是否超时',
          width: 110
        }

      ],
      resultHeight: 400,
      statisticParams: {}
    }
  },
  computed: {
    tranformData() {
      return this.dataList.map((item) => {
        if (item.convergeState) {
          item.convergeStateText = convergeStateMap[item.convergeState]
        }
        // 把事件大、中、小类组合
        item.eventTypeText = `${item.eventTypeLName || ''}/${item.eventTypeMNAME || ''}/${item.eventTypeName || ''}`
        if (item.eventTypeIdFourName) {
          item.eventTypeText += `/${item.eventTypeIdFourName}`
        }
        if (item.eventTypeIdFiveName) {
          item.eventTypeText += `/${item.eventTypeIdFiveName}`
        }
        // 省略因数据为空导致的//
        item.eventTypeText = item.eventTypeText.replace(/\/\//, '') || '-'
        return item
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 创建观察实例
      this.initObServer(document.getElementById('etfSearch'), entries => {
        if (entries[0].target) {
          this.resultHeight = this.$refs.eFocus.offsetHeight - 40 - (this.$refs.statisticRef.$el.offsetHeight + this.$refs.searchRefDiv.offsetHeight + this.$refs.pageRef.offsetHeight)
        }
      })
    })
  },

  methods: {
    async viewDetail(row) {
      const loading = this.$loading({
        lock: true,
        text: '查询中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      try {
        const res = await service.getDetailByEventCode({ eventCode: row.eventCode })
        const eventDataType = res?.data?.dataType || ''
        const eventObj = res?.data?.event || {}
        loading.close()
        const eventQuery = {
          taskId: '', // eventObj.taskId, //不要其他按钮 所以不传taskId
          id: eventObj.id
        }
        // 事件类型：pre事件受理，duplicate事件去重，event事件详情，self三方自处置事件
        switch (eventDataType) {
          case 'pre':
            this.$router.push({
              path: '/event/pre-accepted/info',
              query: {
                id: eventObj.id,
                from: '/workbench/event-focus'
              }
            })
            break
          case 'duplicate':
            this.$router.push({
              path: '/event/de-weight/detail',
              query: {
                id: eventObj.id
              }
            })
            break
          case 'event':
            if (this.$route.query.speType) eventQuery.speType = this.$route.query.speType
            this.$router.push({
              path: '/workbench/todo/info',
              query: eventQuery
            })
            break
          case 'self':
            this.$router.push({
              path: '/event/type-in/info',
              query: {
                id: eventObj.id,
                eventType: 'self'
              }
            })
            break
        }
      } finally {
        loading.close()
      }
    },
    // 批量事件状态，给予不同的状态不同的标记
    _tranfromState(row) {
      if (row.dataType === 'event' || row.dataType === 'self') {
        const state = row.eventState || '0'
        if (['0', '1', '2', '4'].includes(state)) {
        // 待XXX
          return 'svg-warn'
        } else if (['3'].includes(state)) {
        // 待处理，为处理中的颜色
          return 'svg-handle'
        } else if (['5'].includes(state)) {
        // 办结
          return 'svg-success'
        } else if (['7'].includes(state)) {
        // 驳回
          return 'svg-error'
        } else if (['6'].includes(state)) {
        // 作废
          return 'svg-grey'
        } else {
          return 'svg-grey'
        }
      } else if (row.dataType === 'pre') {
        if (row.dataEventState === 'pre-1') {
          return 'svg-warn'
        } else if (row.dataEventState === 'pre-2') {
          return 'svg-success'
        } else if (row.dataEventState === 'pre-3') {
          return 'svg-error'
        }
      } else if (row.dataType === 'duplicate') {
        if (row.dataEventState === 'duplicate-3' || row.dataEventState === 'duplicate-1') {
          return 'svg-success'
        } else if (row.dataEventState === 'duplicate-2') {
          return 'svg-error'
        } else {
          return 'svg-warn'
        }
      }
    },
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    st_search(params) {
      this.statisticParams = params
      this.page.pageNum = 1
      this._search()
    },
    async _search() {
      await this.$nextTick()
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        pageNum,
        pageSize,
        ...this.searchParams,
        ...this.statisticParams
      }
      if (!params.reportSource) delete params.reportSource
      if (!params.convergeState) delete params.convergeState
      if (params.gridId) {
        params.deptId = params.gridId
      }
      this.loading = true
      const res = await service.getConvergeByPage(params).finally(() => {
        this.loading = false
      })
      const { list = [], total = 0 } = res.data
      this.dataList = list
      this.page.total = total
    }
  }
}
</script>

<style lang="scss" scoped>
.event-focus {
    height: 100%;
    .etf-search {
      margin-top: 20px;
      background: #fff;
    }
    .result-content {
      margin-top: 20px;
      @include resultContent;
  .svg-success-wrapper {
    color: $success;
  }

  .svg-handle-wrapper {
    color: $primaryColor;
  }

  .svg-warn-wrapper {
    color: $warn;
  }

  .svg-error-wrapper {
    color: $error;
  }

  .svg-grey-wrapper {
    color: $defaultGrey;
  }
  .event-code {
    display: flex;
    align-items: center;
    .icon-info {
      cursor: pointer;
    }
  }
  .event-types {
    display: flex;
    align-items: center;
    .et-type {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 5px;
    }
    .third-type {
       flex-shrink: 0;
    }
    .icon-info {
      cursor: pointer;
    }
  }
  // 表格置顶高亮
  .table {
    ::v-deep {
      .el-table__empty-block {
        min-height: 200px;
      }
      .el-table__body {
        .el-table__row {
          td {
            .cell {
              .red {
                color: #ff4d4f;
              }

              .blue {
                color: #36a4ff;
              }

              .bold {
                font-weight: bold;
              }

            }
          }
        }
      }

    }

  }
    }
    .foot-page {
      height: 76px;
      background: #FFFFFF;
      box-shadow: 0px -2px 7px 0px rgba(0,0,0,0.06);
      display: flex;
      align-items: center;
      padding-right: 20px;
      z-index: 1;
    }
}
</style>
