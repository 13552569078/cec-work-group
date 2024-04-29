<template>
  <div class="page-wrapper">
    <common-page-list :has-top-border="hasTopBorder">
      <search slot="search" ref="searchRef" :source="source" type="eventIn" @searchList="dealwithFilter" @reset="clearFilters" />
      <div slot="content" class="result-content">
        <search-tips
          ref="searchTips"
          :total="page.total"
          show-search-items
          :search-items="filterTips"
          :select-count="selectCount"
          :show-actions="false"
          @heightChange="tipHeightChange"
          @delFilter="delFilter"
          @clear="clearFilters"
          @refresh="_search"
        />
        <div v-loading="loading" class="result-list" :style="hasTopBorder?resultStyle:{}">
          <el-table
            ref="tableHeight"
            :height="hasTopBorder?tableContentHeight:null"
            :data="tranformData"
            style="width: 100%;"
            tooltip-effect="light"
          >
            <el-table-column
              type="index"
              width="55"
              fixed="left"
              :index="indexMethod"
              class-name="table-column-index"
            />
            <template v-for="(item, index) in tableColumn">
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
            <el-table-column fixed="right" label="操作" width="70" class-name="table-column-action">
              <template v-slot="{ row }">
                <span class="action-group">
                  <span class="action-btn" @click="showDetail(row)">查看</span>
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
  </div>
</template>

<script>
import searchMixin from '@/mixin/searchMixin'
import search from './search'
import pageMixin from '@/mixin/page.mixin'
import tableMixin from '@/mixin/tableWhh.mixin'
import moduleSrv from '@/api/dispatchWhh'
import { EMPTY_STRING } from '@/constants'

export default {
  name: 'EventIn',
  components: {
    search
  },
  mixins: [pageMixin, tableMixin, searchMixin],
  props: {
    hasTopBorder: {
      type: Boolean,
      default: true
    },
    source: {
      type: String,
      default: 'list' // eventIn 为事件流入监控列表 共用一个组件
    },
    mainSearchParams: {
      type: Object,
      default: () => {
        return {
          startTime: '',
          endTime: '',
          curSysCode: '',
          curEventTypeId: ''
        }
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      digType: '',
      digData: {},
      tableColumn: [
        {
          prop: 'eventCode',
          label: '事件编码',
          width: 200
        },
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
          prop: 'happenTime',
          label: '发生时间',
          width: 200
        },
        {
          prop: 'eventAddress',
          label: '发生地址',
          minWidth: 200
        },
        // {
        //   prop: 'masterOrgCate',
        //   label: '主处置部门',
        //   width: 150
        // },
        {
          prop: 'overtimeFlagName',
          label: '超时状态',
          width: 150
        }
      ]
    }
  },
  computed: {
    taskTypeOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getDictsByType('plan_task_type')
    },
    eventSourceOptionsMap() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_origin')
      const map = new Map()
      platform.forEach(item => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventStateOptionsMap() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_state')
      const map = new Map()
      platform.forEach(item => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    platformSrcOptions() {
      const platform = this.$store.getters.getBsDictsByType('event_platform')
      const map = new Map()
      platform.forEach(item => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    tranformData() {
      const transformEventTypeData = item => {
        return item.eventTypeLName && item.eventTypeMNAME && item.eventTypeName
          ? `${item.eventTypeLName}/${item.eventTypeMNAME}/${item.eventTypeName}`
          : EMPTY_STRING
      }
      return this.dataList.map(item => {
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
    mainSearchParams: {
      deep: true,
      handler(val, old) {
        // 有初始时间则查询
        if (val?.beginTime) {
          this.resetSize()
          this._search()
        }
      },
      immediate: true
    }
  },
  methods: {
    resetSize() {
      // 重置页码
      this.page.pageSize = 10
      this.page.pageNum = 1
    },
    async _search() {
      if (!this.mainSearchParams.endTime) return
      console.log(this.searchParams, '>>>>>>>>>>>>')
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        ...this.mainSearchParams,
        pageNum,
        pageSize,
        ...this.searchParams,
        title: this.searchParams.eventTitle,
        eventStatus: this.searchParams.dealStatus
      }
      if (params.gridId) {
        params.deptId = params.gridId
      }
      const { data } = await moduleSrv.getInflowList(params)
      this.dataList = data.list
      this.page.total = data.total
    },
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
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
    showDetail(row) {
      this.$router.push({
        path: '/event/type-in/info',
        query: {
          taskId: row?.taskId,
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
