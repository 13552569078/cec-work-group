<!--
 * @description 事件管理-事件录入
 * @date 2020-08-19
 * @author lism
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
          :show-actions="false"
          :search-items="filterTips"
          :select-count="selectCount"
          @heightChange="tipHeightChange"
          @delFilter="delFilter"
          @clear="clearFilters"
          @refresh="_search"
        />
        <div v-loading="loading" class="result-list" :style="resultStyle">
          <el-table ref="tableRef" :data="tranformData" style="width: 100%" tooltip-effect="light">
            <el-table-column
              type="index"
              width="55"
              fixed="left"
              :index="indexMethod"
              class-name="table-column-index"
            />
            <template v-for="(item, index) in getTableColumns">
              <el-table-column
                v-if="item.prop === 'eventStateText'"
                :key="index"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                show-overflow-tooltip
              >
                <!-- 对事件处理状态特殊处理，给不同的状态不同的标记 -->
                <template v-slot="{ row }">
                  <span :class="`${_tranfromState(row)}-wrapper`">
                    <svg-icon :icon-class="_tranfromState(row)" />
                    {{ row.eventStateText }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                v-else
                :key="index"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                :min-width="item.minWidth"
                show-overflow-tooltip
                :fixed="item.fixed"
                :formatter="_formatter"
              />
            </template>

            <el-table-column :width="70" fixed="right" class-name="table-column-action">
              <template #header>
                <span>操作</span>
              </template>
              <template v-slot="{ row }">
                <span class="action-btn" @click="_handle_action('view', row)">查看</span>
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
</template>

<script>
import moduleSrv from '@/api/dispatch'
import search from './search'
import pageMixin from '@/mixin/page.mixin'
import searchMixin from '@/mixin/searchMixin'
import { SUCCESS_CODE, EMPTY_STRING } from '@/constants'

export default {
  name: 'Collection',
  components: {
    search
  },
  mixins: [pageMixin, searchMixin],
  data() {
    return {
      searchFilterItems: []
    }
  },
  computed: {
    refresh() {
      return this.$route.query.refresh
    },
    getTableColumns() {
      const baseColumns = [
        {
          prop: 'title',
          label: '事件标题',
          fixed: 'left',
          width: 200
        },
        {
          prop: 'eventTypeText',
          label: '事件类型',
          width: 290
        },
        {
          prop: 'platformSrcName',
          label: '来源系统',
          width: 150
        },
        {
          prop: 'eventStateText',
          label: '事件状态',
          width: 150
        },
        {
          prop: 'eventCode',
          label: '事件编码',
          width: 200
        },
        {
          prop: 'happenTime',
          label: '发生时间',
          width: 200
        },
        {
          prop: 'eventAddress',
          label: '发生地址',
          minWidth: 200
        }
      ]
      const additionalColumns = [{
        prop: 'masterOrgCate',
        label: '主处置部门',
        width: 150
      },
      {
        prop: 'slaveOrgCate',
        label: '协助部门',
        width: 150
      }]
      if (this.$route.name === 'collectionAll') {
        baseColumns.push(...additionalColumns)
      }
      return baseColumns
    },
    eventSourceOptionsMap() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_origin')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventStateOptionsMap() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_state')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    platformSrcOptions() {
      const platform = this.$store.getters.getBsDictsByType('event_platform')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    tranformData() {
      const transformEventTypeData = (item) => {
        return item.eventTypeLName && item.eventTypeMNAME && item.eventTypeName ? `${item.eventTypeLName}/${item.eventTypeMNAME}/${item.eventTypeName}` : EMPTY_STRING
      }
      return this.dataList.map((item) => {
        item.sourceText = this.eventSourceOptionsMap.get(item.eventSrcId)
        item.platformSrcText = this.platformSrcOptions.get(item.platformSrc)
        item.eventStateText = this.eventStateOptionsMap.get(item.eventState)
        // 把事件大、中、小类组合
        item.eventTypeText = transformEventTypeData(item)
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
  watch: {
    '$route': 'init'
  },
  async created() {
    await this.$nextTick()
    if (this.refresh) {
      this._search()
    }
  },
  methods: {
    init(currentRoute, prevRoute) {
      console.log(currentRoute, prevRoute, 111)
      if (!prevRoute.path.includes('info') && !currentRoute.path.includes('info')) {
        this._search()
      }
    },
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    async _search() {
      await this.$nextTick()
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        pageNum,
        pageSize,
        ...this.searchParams
      }
      if (params.gridId) {
        params.deptId = params.gridId
      }
      const fnMap = {
        collectionAll: moduleSrv.getEventList,
        collectionUnsolved: moduleSrv.getPendingEventList
      }
      this.loading = true

      const func = fnMap[this.$route.name]

      if (!func) return

      const res = await func(params).finally(() => {
        this.loading = false
      })
      if (res.code === SUCCESS_CODE) {
        const { list = [], total = 0 } = res.data
        this.dataList = list
        this.page.total = total
      }
    },
    // 批量事件状态，给予不同的状态不同的标记
    _tranfromState(row) {
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
    },
    // 操作处理
    _handle_action(action, row) {
      this.$router.push({
        path: '/event/type-in/info',
        query: {
          taskId: row.taskId,
          id: row.id,
          refresh: true
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.page-wrapper {
  height: 100%;
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
}
</style>
