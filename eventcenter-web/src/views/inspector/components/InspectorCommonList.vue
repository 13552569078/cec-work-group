<!--
 * @description 督查督办公用页面
 * @date 2020-08-21
 * @author lism
-->
<template>
  <common-page-list has-footer class="common-page-list">
    <search-form
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
        :show-actions="$slots.button"
        :search-items="filterTips"
        :select-count="selectCount"
        @heightChange="tipHeightChange"
        @delFilter="delFilter"
        @clear="clearFilters"
        @refresh="_search"
      >
        <slot name="button" />
      </search-tips>
      <div v-loading="loading" class="result-list" :style="resultStyle">
        <el-table
          ref="tableHeight"
          :data="tranformData"
          style="width: 100%"
          class="table"
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
              v-if="item.prop === 'eventStateText'"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              :min-width="item.minWidth"
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
              :formatter="_formatter"
            />
          </template>
          <el-table-column
            :width="actionWidth"
            fixed="right"
            class-name="table-column-action"
          >
            <template #header>
              <span>操作</span>
            </template>
            <template v-slot="{ row }">
              <!-- 插槽传数据给父级，父级需要用 template 接收 -->
              <slot :row="row" />
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
</template>

<script>
import SearchForm from './SearchForm'
import pageMixin from '@/mixin/pageMixin'
import searchMixin from '@/mixin/searchMixin'
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'InspectorCommonList',
  components: {
    SearchForm
  },
  mixins: [pageMixin, searchMixin],
  doNotInit: true,
  props: {
    eventType: {
      type: String,
      default: ''
    },
    actionWidth: {
      type: [String, Number],
      default: 80
    },
    showTipsBtn: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableColumn: [
        {
          prop: 'eventCode',
          label: '事件编号',
          visible: true,
          minWidth: '130'
        },
        {
          prop: 'sourceText',
          label: '事件来源',
          visible: true,
          minWidth: '120'
        },
        {
          prop: 'eventTypeText',
          label: '事件类型',
          visible: true,
          minWidth: '200'
        },
        {
          prop: 'urgentText',
          label: '紧急程度',
          width: '90',
          visible: true
        },
        {
          prop: 'eventStateText',
          label: '处理状态',
          visible: true,
          minWidth: '100'
        },
        {
          prop: 'happenTime',
          label: '发生时间',
          visible: true,
          minWidth: '160'
        },
        {
          prop: 'overtimeText',
          label: '是否超时',
          visible: true
        },
        {
          prop: 'superviseCode',
          label: '督办单编号',
          visible: true,
          minWidth: '110'
        },
        {
          prop: 'superviseFlagOptionsText',
          label: '督办单状态',
          visible: true,
          minWidth: '110'
        }
      ],
      inspectorColumn: [
        {
          prop: 'superviseCode',
          label: '督办单编号',
          visible: true,
          minWidth: '160'
        },
        {
          prop: 'superviseTitle',
          label: '督办主题',
          visible: true
        },
        {
          prop: 'superviseFlagOptionsText',
          label: '督办单状态',
          visible: true
        },
        {
          prop: 'createTime',
          label: '督办发起时间',
          visible: true,
          minWidth: '160'
        },
        {
          prop: 'eventCode',
          label: '事件编号',
          visible: true,
          minWidth: '140'
        },
        {
          prop: 'eventTypeText',
          label: '事件类型',
          visible: true
        }
      ]
    }
  },
  computed: {
    eventSourceOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_origin')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventUrgentOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_urgent_level')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventStateOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_state')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventOverTimeOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('overtime_flag')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    superviseFlagOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('superviseStatus')
      const map = new Map()
      platform.forEach((item) => {
        map.set(Number(item.dictValue), item.dictDesc)
      })
      return map
    },
    tranformData() {
      return this.dataList.map((item) => {
        item.sourceText = this.eventSourceOptions.get(item.eventSrcId)
        item.urgentText = this.eventUrgentOptions.get(item.eventUrgent)
        item.eventStateText = this.eventStateOptions.get(item.eventState)
        item.overtimeText = this.eventOverTimeOptions.get(item.overtimeFlag)
        item.superviseFlagOptionsText = this.superviseFlagOptions.get(
          item.superviseState
        )
        // 把事件大、中、小类组合
        item.eventTypeText = `${item.eventTypeLName}/${item.eventTypeMNAME}/${item.eventTypeName}`
        if (item.eventTypeIdFourName) {
          item.eventTypeText += `/${item.eventTypeIdFourName}`
        }
        if (item.eventTypeIdFiveName) {
          item.eventTypeText += `/${item.eventTypeIdFiveName}`
        }
        return item
      })
    },
    columns() {
      const columns =
        this.$route.path === '/inspector/list' ? this.tableColumn : this.inspectorColumn
      const arr = columns.filter((item) => item.visible)
      return arr
    }
  },
  methods: {
    // 列表搜索接口
    async _search() {
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        pageNum,
        pageSize,
        ...this.searchParams
      }
      const fnMap = {
        'list': 'getEventListBySupervise',
        'feedback': 'getTodoSuperviseList',
        'settle': 'getSuperviseList'
      }
      const res = await moduleSrv[fnMap[this.eventType]](params)
      if (res.code === SUCCESS_CODE) {
        const { list = [], total = 0 } = res.data
        this.dataList = list
        this.page.total = total
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
.common-page-list {
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
  .table {
    ::v-deep {
      .el-table__body {
        .el-table__row {
          td {
            .cell {
              .red {
                color: #FF4D4F;
              }

              .blue {
                color: #36A4FF;
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
</style>
